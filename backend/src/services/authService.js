const { supabaseAdmin, supabaseAnon } = require('../utils/supabase')
const prisma = require('../utils/prisma')

const ALLOWED_DESIGNATIONS = ['TEACHER', 'ASSISTANT_TEACHER', 'COORDINATOR']
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// ── Helpers ───────────────────────────────────────────────────────────────────

const assertEmailVerified = (supabaseUser) => {
  if (!supabaseUser.email_confirmed_at) {
    throw Object.assign(
      new Error('Please verify your email before logging in.'),
      { status: 403, code: 'EMAIL_NOT_VERIFIED' }
    )
  }
}

// ── Login / Logout / Session ──────────────────────────────────────────────────

const login = async (email, password) => {
  const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password })
  if (error) throw Object.assign(new Error('Invalid email or password'), { status: 401 })

  assertEmailVerified(data.user)

  const dbUser = await prisma.user.findUnique({
    where: { id: data.user.id },
    include: { studentProfile: true, staffProfile: true }
  })

  if (!dbUser) throw Object.assign(new Error('User not found in system'), { status: 404 })
  if (!dbUser.isActive) throw Object.assign(new Error('Account is deactivated'), { status: 403 })

  return {
    token:        data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresAt:    data.session.expires_at,
    user:         dbUser
  }
}

const logout = async (userId) => {
  try { await supabaseAdmin.auth.admin.signOut(userId) } catch (_) {}
}

const refreshSession = async (refreshToken) => {
  const { data, error } = await supabaseAdmin.auth.refreshSession({ refresh_token: refreshToken })
  if (error) throw Object.assign(new Error('Invalid or expired refresh token'), { status: 401 })
  return {
    token:        data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresAt:    data.session.expires_at
  }
}

const getCurrentUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { studentProfile: true, staffProfile: true }
  })
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 })
  return user
}

// ── Class lookup (public) ─────────────────────────────────────────────────────

const getClasses = async () => {
  return prisma.class.findMany({
    select: { id: true, name: true, grade: true, section: true },
    orderBy: { createdAt: 'asc' }
  })
}

// ── Signup flows ──────────────────────────────────────────────────────────────

const studentSignup = async ({ studentName, parentName, parentEmail, password, classId }) => {
  const existing = await prisma.user.findUnique({ where: { email: parentEmail } })
  if (existing) throw Object.assign(new Error('An account with this email already exists'), { status: 409 })

  const cls = await prisma.class.findUnique({ where: { id: classId } })
  if (!cls) throw Object.assign(new Error('Selected class not found'), { status: 400 })

  const nameParts = studentName.trim().split(/\s+/)
  const firstName = nameParts[0]
  const lastName  = nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0]

  // Regular signUp — sends verification email, returns session: null until verified
  const { data: authData, error: authErr } = await supabaseAnon.auth.signUp({
    email:    parentEmail,
    password,
    options: {
      emailRedirectTo: `${FRONTEND_URL}/auth/callback`,
      data: { role: 'STUDENT' }
    }
  })

  if (authErr) throw Object.assign(new Error(authErr.message), { status: 400 })

  // Supabase returns user with empty identities array for duplicate emails
  if (!authData.user?.id || authData.user.identities?.length === 0) {
    throw Object.assign(new Error('An account with this email already exists'), { status: 409 })
  }

  const userId = authData.user.id

  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { id: userId, email: parentEmail, role: 'STUDENT' }
      })
      const profile = await tx.studentProfile.create({
        data: { userId: user.id, firstName, lastName, guardianName: parentName, parentEmail }
      })
      await tx.classStudent.create({ data: { classId, studentId: profile.id } })
    })
  } catch (txErr) {
    await supabaseAdmin.auth.admin.deleteUser(userId).catch(() => {})
    throw txErr
  }

  // Email confirmation disabled in Supabase → session returned immediately
  if (authData.session) {
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true, staffProfile: true }
    })
    return {
      requiresVerification: false,
      token:        authData.session.access_token,
      refreshToken: authData.session.refresh_token,
      expiresAt:    authData.session.expires_at,
      user:         dbUser
    }
  }

  return { requiresVerification: true, email: parentEmail }
}

const staffSignup = async ({ fullName, email, password, designation }) => {
  if (!ALLOWED_DESIGNATIONS.includes(designation)) {
    throw Object.assign(new Error('Invalid designation. Admin accounts cannot be created via signup.'), { status: 403 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw Object.assign(new Error('An account with this email already exists'), { status: 409 })

  const nameParts = fullName.trim().split(/\s+/)
  const firstName = nameParts[0]
  const lastName  = nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0]

  const { data: authData, error: authErr } = await supabaseAnon.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${FRONTEND_URL}/auth/callback`,
      data: { role: 'STAFF', designation }
    }
  })

  if (authErr) throw Object.assign(new Error(authErr.message), { status: 400 })

  if (!authData.user?.id || authData.user.identities?.length === 0) {
    throw Object.assign(new Error('An account with this email already exists'), { status: 409 })
  }

  const userId = authData.user.id

  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { id: userId, email, role: 'STAFF' }
      })
      await tx.staffProfile.create({
        data: { userId: user.id, firstName, lastName, designation }
      })
    })
  } catch (txErr) {
    await supabaseAdmin.auth.admin.deleteUser(userId).catch(() => {})
    throw txErr
  }

  if (authData.session) {
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true, staffProfile: true }
    })
    return {
      requiresVerification: false,
      token:        authData.session.access_token,
      refreshToken: authData.session.refresh_token,
      expiresAt:    authData.session.expires_at,
      user:         dbUser
    }
  }

  return { requiresVerification: true, email }
}

// ── Resend verification email ─────────────────────────────────────────────────

const resendVerification = async (email) => {
  const dbUser = await prisma.user.findUnique({ where: { email } })
  if (!dbUser) throw Object.assign(new Error('No account found with this email'), { status: 404 })

  const { error } = await supabaseAnon.auth.resend({
    type:  'signup',
    email,
    options: { emailRedirectTo: `${FRONTEND_URL}/auth/callback` }
  })

  if (error) throw Object.assign(new Error(error.message), { status: 400 })
  return { message: 'Verification email sent' }
}

// ── Admin helpers ─────────────────────────────────────────────────────────────

const createUserWithProfile = async ({ email, password, role, firstName, lastName, ...profileData }) => {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role }
  })
  if (error) throw Object.assign(new Error(error.message), { status: 400 })

  const user = await prisma.user.create({ data: { id: data.user.id, email, role } })

  if (role === 'STUDENT') {
    await prisma.studentProfile.create({ data: { userId: user.id, firstName, lastName, ...profileData } })
  } else if (role === 'STAFF' || role === 'ADMIN') {
    await prisma.staffProfile.create({ data: { userId: user.id, firstName, lastName, ...profileData } })
  }

  return prisma.user.findUnique({
    where: { id: user.id },
    include: { studentProfile: true, staffProfile: true }
  })
}

const deactivateUser = async (userId) => {
  await supabaseAdmin.auth.admin.updateUserById(userId, { ban_duration: '876600h' })
  return prisma.user.update({ where: { id: userId }, data: { isActive: false } })
}

const reactivateUser = async (userId) => {
  await supabaseAdmin.auth.admin.updateUserById(userId, { ban_duration: 'none' })
  return prisma.user.update({ where: { id: userId }, data: { isActive: true } })
}

module.exports = {
  login, logout, refreshSession, getCurrentUser,
  getClasses, studentSignup, staffSignup, resendVerification,
  createUserWithProfile, deactivateUser, reactivateUser
}
