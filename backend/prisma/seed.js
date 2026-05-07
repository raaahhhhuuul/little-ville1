const { PrismaClient } = require('@prisma/client')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const prisma = new PrismaClient()
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createSupabaseUser(email, password, role) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role }
  })
  if (error) throw new Error(`Supabase user creation failed for ${email}: ${error.message}`)
  return data.user
}

async function main() {
  console.log('Starting seed...')

  // Admin
  const adminAuth = await createSupabaseUser('admin@kindercare.com', 'Admin@1234', 'ADMIN')
  await prisma.user.upsert({
    where: { email: 'admin@kindercare.com' },
    update: {},
    create: {
      id: adminAuth.id,
      email: 'admin@kindercare.com',
      role: 'ADMIN'
    }
  })

  // Staff
  const staffAuth = await createSupabaseUser('staff@kindercare.com', 'Staff@1234', 'STAFF')
  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@kindercare.com' },
    update: {},
    create: {
      id: staffAuth.id,
      email: 'staff@kindercare.com',
      role: 'STAFF'
    }
  })
  await prisma.staffProfile.upsert({
    where: { userId: staffUser.id },
    update: {},
    create: {
      userId: staffUser.id,
      firstName: 'Sarah',
      lastName: 'Johnson',
      designation: 'Class Teacher',
      phone: '+1-555-0102',
      salary: 3500
    }
  })

  // Student
  const studentAuth = await createSupabaseUser('student@kindercare.com', 'Student@1234', 'STUDENT')
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@kindercare.com' },
    update: {},
    create: {
      id: studentAuth.id,
      email: 'student@kindercare.com',
      role: 'STUDENT'
    }
  })
  await prisma.studentProfile.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      firstName: 'Emma',
      lastName: 'Thompson',
      guardianName: 'Robert Thompson',
      guardianPhone: '+1-555-0103'
    }
  })

  console.log('Seed completed successfully.')
  console.log('Credentials:')
  console.log('  Admin:   admin@kindercare.com / Admin@1234')
  console.log('  Staff:   staff@kindercare.com / Staff@1234')
  console.log('  Student: student@kindercare.com / Student@1234')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
