const { supabaseAdmin } = require('../utils/supabase')
const prisma = require('../utils/prisma')

const login = async (email, password) => {
  const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password })
  if (error) throw Object.assign(new Error('Invalid email or password'), { status: 401 })

  const dbUser = await prisma.user.findUnique({
    where: { id: data.user.id },
    include: { studentProfile: true, staffProfile: true }
  })

  if (!dbUser) throw Object.assign(new Error('User not found in system'), { status: 404 })
  if (!dbUser.isActive) throw Object.assign(new Error('Account is deactivated'), { status: 403 })

  return {
    token: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresAt: data.session.expires_at,
    user: dbUser
  }
}

const logout = async (userId) => {
  try {
    await supabaseAdmin.auth.admin.signOut(userId)
  } catch (_) {
    // token expires naturally if this fails
  }
}

const refreshSession = async (refreshToken) => {
  const { data, error } = await supabaseAdmin.auth.refreshSession({ refresh_token: refreshToken })
  if (error) throw Object.assign(new Error('Invalid or expired refresh token'), { status: 401 })
  return {
    token: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresAt: data.session.expires_at
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

const createUserWithProfile = async ({ email, password, role, firstName, lastName, ...profileData }) => {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role }
  })
  if (error) throw Object.assign(new Error(error.message), { status: 400 })

  const user = await prisma.user.create({
    data: { id: data.user.id, email, role }
  })

  if (role === 'STUDENT') {
    await prisma.studentProfile.create({
      data: { userId: user.id, firstName, lastName, ...profileData }
    })
  } else if (role === 'STAFF' || role === 'ADMIN') {
    await prisma.staffProfile.create({
      data: { userId: user.id, firstName, lastName, ...profileData }
    })
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

module.exports = { login, logout, refreshSession, getCurrentUser, createUserWithProfile, deactivateUser, reactivateUser }
