const { supabaseAdmin } = require('../utils/supabase')
const prisma = require('../utils/prisma')

const getCurrentUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      studentProfile: true,
      staffProfile: true
    }
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
    data: {
      id: data.user.id,
      email,
      role
    }
  })

  if (role === 'STUDENT') {
    await prisma.studentProfile.create({
      data: { userId: user.id, firstName, lastName, ...profileData }
    })
  } else if (role === 'STAFF') {
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
  return prisma.user.update({
    where: { id: userId },
    data: { isActive: false }
  })
}

const reactivateUser = async (userId) => {
  await supabaseAdmin.auth.admin.updateUserById(userId, { ban_duration: 'none' })
  return prisma.user.update({
    where: { id: userId },
    data: { isActive: true }
  })
}

module.exports = { getCurrentUser, createUserWithProfile, deactivateUser, reactivateUser }
