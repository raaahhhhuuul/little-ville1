const prisma = require('../utils/prisma')

const getAllUsers = async (role, page = 1, limit = 20) => {
  const skip = (page - 1) * limit
  const where = role ? { role } : {}

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: { studentProfile: true, staffProfile: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.user.count({ where })
  ])

  return { users, total, page, totalPages: Math.ceil(total / limit) }
}

const getAnalytics = async () => {
  const [
    totalStudents,
    totalStaff,
    totalClasses,
    totalQuizzes,
    recentAttendance,
    attendanceSummary
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT', isActive: true } }),
    prisma.user.count({ where: { role: 'STAFF', isActive: true } }),
    prisma.class.count(),
    prisma.quiz.count({ where: { isPublished: true } }),
    prisma.attendance.findMany({
      take: 7,
      orderBy: { date: 'desc' },
      distinct: ['date'],
      select: { date: true }
    }),
    prisma.attendance.groupBy({
      by: ['status'],
      _count: { status: true }
    })
  ])

  const attendanceByDate = await Promise.all(
    recentAttendance.map(async ({ date }) => {
      const counts = await prisma.attendance.groupBy({
        by: ['status'],
        where: { date },
        _count: { status: true }
      })
      const result = { date, PRESENT: 0, ABSENT: 0, LATE: 0 }
      counts.forEach(c => { result[c.status] = c._count.status })
      return result
    })
  )

  return {
    totals: { students: totalStudents, staff: totalStaff, classes: totalClasses, quizzes: totalQuizzes },
    attendanceSummary: attendanceSummary.map(a => ({ status: a.status, count: a._count.status })),
    attendanceByDate: attendanceByDate.reverse()
  }
}

const markStaffAttendance = async (staffId, date, status, notes, markedById) => {
  return prisma.staffAttendance.upsert({
    where: { staffId_date: { staffId, date: new Date(date) } },
    update: { status, notes },
    create: { staffId, date: new Date(date), status, notes, markedById }
  })
}

const getStaffAttendance = async (month, year) => {
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)

  return prisma.staffAttendance.findMany({
    where: { date: { gte: startDate, lte: endDate } },
    include: { staff: true },
    orderBy: { date: 'asc' }
  })
}

const createSalary = async (staffId, month, year, baseSalary, deductions, bonus, reason) => {
  const netSalary = baseSalary - deductions + bonus
  return prisma.salary.upsert({
    where: { staffId_month_year: { staffId, month, year } },
    update: { baseSalary, deductions, bonus, netSalary, reason },
    create: { staffId, month, year, baseSalary, deductions, bonus, netSalary, reason }
  })
}

const getSalaries = async (staffId, year) => {
  const where = {}
  if (staffId) where.staffId = staffId
  if (year) where.year = year

  return prisma.salary.findMany({
    where,
    include: { staff: true },
    orderBy: [{ year: 'desc' }, { month: 'desc' }]
  })
}

const sendNotification = async (title, message, target, createdById) => {
  const notification = await prisma.notification.create({
    data: { title, message, target, createdById }
  })

  let usersWhere = {}
  if (target === 'STAFF') usersWhere = { role: 'STAFF', isActive: true }
  else if (target === 'STUDENTS') usersWhere = { role: 'STUDENT', isActive: true }
  else usersWhere = { isActive: true }

  const users = await prisma.user.findMany({ where: usersWhere, select: { id: true } })

  await prisma.userNotification.createMany({
    data: users.map(u => ({ userId: u.id, notificationId: notification.id })),
    skipDuplicates: true
  })

  return notification
}

module.exports = {
  getAllUsers,
  getAnalytics,
  markStaffAttendance,
  getStaffAttendance,
  createSalary,
  getSalaries,
  sendNotification
}
