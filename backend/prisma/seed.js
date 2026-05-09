const { PrismaClient } = require('@prisma/client')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const prisma = new PrismaClient()
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Idempotent — if user already exists in Supabase, return the existing record
async function getOrCreateSupabaseUser(email, password, role) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role }
  })

  if (!error) return data.user

  // User already registered — fetch from Supabase
  if (error.message?.toLowerCase().includes('already')) {
    const { data: listData } = await supabase.auth.admin.listUsers({ perPage: 1000 })
    const existing = listData?.users?.find(u => u.email === email)
    if (existing) return existing
  }

  throw new Error(`Supabase user error for ${email}: ${error.message}`)
}

const GRADE_LEVELS = [
  { name: 'Nursery', grade: 'Nursery' },
  { name: 'LKG',     grade: 'LKG'     },
  { name: 'UKG',     grade: 'UKG'     },
  { name: 'Grade 1', grade: 'Grade 1' },
  { name: 'Grade 2', grade: 'Grade 2' },
]

async function main() {
  console.log('Starting seed...')

  // ── Default grade-level classes (no staff assigned) ──────────────────────
  console.log('\nSeeding grade-level classes...')
  const classMap = {}
  for (const { name, grade } of GRADE_LEVELS) {
    let cls = await prisma.class.findFirst({ where: { name } })
    if (!cls) {
      cls = await prisma.class.create({ data: { name, grade } })
      console.log(`  Created: ${name}`)
    } else {
      console.log(`  Exists:  ${name}`)
    }
    classMap[name] = cls
  }

  // ── Admin ─────────────────────────────────────────────────────────────────
  console.log('\nSeeding admin...')
  const adminAuth = await getOrCreateSupabaseUser('admin@kindercare.com', 'Admin@1234', 'ADMIN')
  await prisma.user.upsert({
    where:  { email: 'admin@kindercare.com' },
    update: {},
    create: { id: adminAuth.id, email: 'admin@kindercare.com', role: 'ADMIN' }
  })

  // ── Staff ─────────────────────────────────────────────────────────────────
  console.log('Seeding staff...')
  const staffAuth = await getOrCreateSupabaseUser('staff@kindercare.com', 'Staff@1234', 'STAFF')
  const staffUser = await prisma.user.upsert({
    where:  { email: 'staff@kindercare.com' },
    update: {},
    create: { id: staffAuth.id, email: 'staff@kindercare.com', role: 'STAFF' }
  })
  await prisma.staffProfile.upsert({
    where:  { userId: staffUser.id },
    update: {},
    create: {
      userId:      staffUser.id,
      firstName:   'Sarah',
      lastName:    'Johnson',
      designation: 'TEACHER',
      phone:       '+1-555-0102',
      salary:      3500
    }
  })

  // ── Student ───────────────────────────────────────────────────────────────
  console.log('Seeding student...')
  const studentAuth = await getOrCreateSupabaseUser('student@kindercare.com', 'Student@1234', 'STUDENT')
  const studentUser = await prisma.user.upsert({
    where:  { email: 'student@kindercare.com' },
    update: {},
    create: { id: studentAuth.id, email: 'student@kindercare.com', role: 'STUDENT' }
  })
  const studentProfile = await prisma.studentProfile.upsert({
    where:  { userId: studentUser.id },
    update: {},
    create: {
      userId:       studentUser.id,
      firstName:    'Emma',
      lastName:     'Thompson',
      guardianName: 'Robert Thompson',
      guardianPhone: '+1-555-0103',
      parentEmail:  'student@kindercare.com'
    }
  })

  // Link demo student to LKG
  if (classMap['LKG']) {
    await prisma.classStudent.upsert({
      where:  { classId_studentId: { classId: classMap['LKG'].id, studentId: studentProfile.id } },
      update: {},
      create: { classId: classMap['LKG'].id, studentId: studentProfile.id }
    })
    console.log('  Linked Emma Thompson → LKG')
  }

  console.log('\nSeed completed successfully.')
  console.log('\nDemo credentials:')
  console.log('  Admin:   admin@kindercare.com   / Admin@1234')
  console.log('  Staff:   staff@kindercare.com   / Staff@1234')
  console.log('  Student: student@kindercare.com / Student@1234')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
