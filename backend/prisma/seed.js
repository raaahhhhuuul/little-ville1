const { PrismaClient } = require('@prisma/client')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const prisma = new PrismaClient()
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function getOrCreateSupabaseUser(email, password, role) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role }
  })
  if (!error) return data.user

  if (error.message?.toLowerCase().includes('already')) {
    const { data: listData } = await supabase.auth.admin.listUsers({ perPage: 1000 })
    const existing = listData?.users?.find(u => u.email === email)
    if (existing) return existing
  }
  throw new Error(`Supabase error for ${email}: ${error.message}`)
}

const GRADE_LEVELS = [
  { name: 'Play Group', grade: 'Play Group' },
  { name: 'Nursery',    grade: 'Nursery'    },
  { name: 'Junior KG',  grade: 'Junior KG'  },
  { name: 'Senior KG',  grade: 'Senior KG'  },
]

async function main() {
  console.log('Starting seed...')

  // ── Grade-level classes ─────────────────────────────────────────────────────
  // Delete old unassigned classes (cascade removes any ClassStudent links)
  console.log('\nResetting grade-level classes...')
  await prisma.class.deleteMany({ where: { staffId: null } })

  const classMap = {}
  for (const { name, grade } of GRADE_LEVELS) {
    const cls = await prisma.class.create({ data: { name, grade } })
    classMap[name] = cls
    console.log(`  Created: ${name}`)
  }

  // ── Admin ───────────────────────────────────────────────────────────────────
  console.log('\nSeeding admin...')
  const adminAuth = await getOrCreateSupabaseUser('admin@kindercare.com', 'Admin@1234', 'ADMIN')
  await prisma.user.upsert({
    where:  { email: 'admin@kindercare.com' },
    update: {},
    create: { id: adminAuth.id, email: 'admin@kindercare.com', role: 'ADMIN' }
  })

  // ── Staff ───────────────────────────────────────────────────────────────────
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

  // ── Student ─────────────────────────────────────────────────────────────────
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
      userId:        studentUser.id,
      firstName:     'Emma',
      lastName:      'Thompson',
      guardianName:  'Robert Thompson',
      guardianPhone: '+1-555-0103',
      parentEmail:   'student@kindercare.com'
    }
  })

  // Link demo student to Nursery
  if (classMap['Nursery']) {
    await prisma.classStudent.upsert({
      where:  { classId_studentId: { classId: classMap['Nursery'].id, studentId: studentProfile.id } },
      update: {},
      create: { classId: classMap['Nursery'].id, studentId: studentProfile.id }
    })
    console.log('  Linked Emma Thompson → Nursery')
  }

  console.log('\nSeed completed successfully.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
