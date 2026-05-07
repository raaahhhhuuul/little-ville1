const prisma = require('../utils/prisma')

const getAssignedClasses = async (staffId) => {
  return prisma.class.findMany({
    where: { staffId },
    include: {
      classStudents: { include: { student: true } },
      subjects: true,
      _count: { select: { classStudents: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
}

const createClass = async (staffId, { name, grade, section }) => {
  return prisma.class.create({
    data: { name, grade, section, staffId },
    include: { classStudents: true, subjects: true }
  })
}

const updateClass = async (classId, staffId, data) => {
  const cls = await prisma.class.findFirst({ where: { id: classId, staffId } })
  if (!cls) throw Object.assign(new Error('Class not found or unauthorized'), { status: 403 })
  return prisma.class.update({ where: { id: classId }, data })
}

const addStudentToClass = async (classId, studentId, staffId) => {
  const cls = await prisma.class.findFirst({ where: { id: classId, staffId } })
  if (!cls) throw Object.assign(new Error('Class not found or unauthorized'), { status: 403 })
  return prisma.classStudent.create({ data: { classId, studentId } })
}

const removeStudentFromClass = async (classId, studentId, staffId) => {
  const cls = await prisma.class.findFirst({ where: { id: classId, staffId } })
  if (!cls) throw Object.assign(new Error('Class not found or unauthorized'), { status: 403 })
  return prisma.classStudent.deleteMany({ where: { classId, studentId } })
}

const getAssignedSubjects = async (staffId) => {
  return prisma.subject.findMany({
    where: { staffId },
    include: { class: true, quizzes: { select: { id: true, title: true, isPublished: true } } }
  })
}

const createSubject = async (staffId, { name, description, classId }) => {
  const cls = await prisma.class.findFirst({ where: { id: classId, staffId } })
  if (!cls) throw Object.assign(new Error('Class not found or unauthorized'), { status: 403 })
  return prisma.subject.create({
    data: { name, description, classId, staffId },
    include: { class: true }
  })
}

const markStudentAttendance = async (staffId, classId, attendances) => {
  const cls = await prisma.class.findFirst({ where: { id: classId, staffId } })
  if (!cls) throw Object.assign(new Error('Class not found or unauthorized'), { status: 403 })

  const ops = attendances.map(({ studentId, date, status, notes }) =>
    prisma.attendance.upsert({
      where: { studentId_classId_date: { studentId, classId, date: new Date(date) } },
      update: { status, notes },
      create: { studentId, classId, date: new Date(date), status, notes }
    })
  )

  return Promise.all(ops)
}

const getClassAttendance = async (classId, staffId, date) => {
  const cls = await prisma.class.findFirst({ where: { id: classId, staffId } })
  if (!cls) throw Object.assign(new Error('Class not found or unauthorized'), { status: 403 })

  return prisma.attendance.findMany({
    where: { classId, date: new Date(date) },
    include: { student: true }
  })
}

const createQuiz = async (staffId, { title, description, subjectId, questions, timeLimit, dueDate }) => {
  const subject = await prisma.subject.findFirst({ where: { id: subjectId, staffId } })
  if (!subject) throw Object.assign(new Error('Subject not found or unauthorized'), { status: 403 })

  return prisma.quiz.create({
    data: { title, description, subjectId, staffId, questions, timeLimit, dueDate: dueDate ? new Date(dueDate) : null },
    include: { subject: true }
  })
}

const updateQuiz = async (quizId, staffId, data) => {
  const quiz = await prisma.quiz.findFirst({ where: { id: quizId, staffId } })
  if (!quiz) throw Object.assign(new Error('Quiz not found or unauthorized'), { status: 403 })
  return prisma.quiz.update({ where: { id: quizId }, data })
}

const getStaffQuizzes = async (staffId) => {
  return prisma.quiz.findMany({
    where: { staffId },
    include: {
      subject: { include: { class: true } },
      _count: { select: { submissions: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
}

const getQuizSubmissions = async (quizId, staffId) => {
  const quiz = await prisma.quiz.findFirst({ where: { id: quizId, staffId } })
  if (!quiz) throw Object.assign(new Error('Quiz not found or unauthorized'), { status: 403 })

  return prisma.quizSubmission.findMany({
    where: { quizId },
    include: { student: true }
  })
}

const getStaffNotifications = async (userId) => {
  return prisma.userNotification.findMany({
    where: { userId },
    include: { notification: true },
    orderBy: { createdAt: 'desc' }
  })
}

const markNotificationRead = async (userId, notificationId) => {
  return prisma.userNotification.updateMany({
    where: { userId, notificationId },
    data: { isRead: true, readAt: new Date() }
  })
}

module.exports = {
  getAssignedClasses,
  createClass,
  updateClass,
  addStudentToClass,
  removeStudentFromClass,
  getAssignedSubjects,
  createSubject,
  markStudentAttendance,
  getClassAttendance,
  createQuiz,
  updateQuiz,
  getStaffQuizzes,
  getQuizSubmissions,
  getStaffNotifications,
  markNotificationRead
}
