const prisma = require('../utils/prisma')

const getStudentProfile = async (userId) => {
  return prisma.studentProfile.findUnique({
    where: { userId },
    include: {
      classStudents: {
        include: { class: { include: { staff: true, subjects: true } } }
      }
    }
  })
}

const updateStudentProfile = async (userId, data) => {
  return prisma.studentProfile.update({
    where: { userId },
    data
  })
}

const getStudentAttendance = async (studentId, month, year) => {
  const where = { studentId }
  if (month && year) {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)
    where.date = { gte: startDate, lte: endDate }
  }

  const records = await prisma.attendance.findMany({
    where,
    include: { class: true },
    orderBy: { date: 'desc' }
  })

  const summary = {
    total: records.length,
    present: records.filter(r => r.status === 'PRESENT').length,
    absent: records.filter(r => r.status === 'ABSENT').length,
    late: records.filter(r => r.status === 'LATE').length
  }
  summary.percentage = summary.total > 0 ? ((summary.present / summary.total) * 100).toFixed(1) : '0'

  return { records, summary }
}

const getStudentSubjects = async (studentId) => {
  const classStudents = await prisma.classStudent.findMany({
    where: { studentId },
    include: {
      class: {
        include: {
          subjects: {
            include: {
              staff: true,
              quizzes: {
                where: { isPublished: true },
                select: { id: true, title: true, dueDate: true, timeLimit: true }
              }
            }
          }
        }
      }
    }
  })

  return classStudents.flatMap(cs => cs.class.subjects)
}

const getAvailableQuizzes = async (studentId) => {
  const classStudents = await prisma.classStudent.findMany({
    where: { studentId },
    select: { class: { select: { subjects: { select: { id: true } } } } }
  })

  const subjectIds = classStudents.flatMap(cs => cs.class.subjects.map(s => s.id))

  const quizzes = await prisma.quiz.findMany({
    where: { subjectId: { in: subjectIds }, isPublished: true },
    include: {
      subject: { include: { class: true } },
      submissions: { where: { studentId }, select: { id: true, score: true, submittedAt: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  return quizzes.map(q => ({
    ...q,
    isSubmitted: q.submissions.length > 0,
    submission: q.submissions[0] || null
  }))
}

const getQuizById = async (quizId, studentId) => {
  const classStudents = await prisma.classStudent.findMany({
    where: { studentId },
    select: { class: { select: { subjects: { select: { id: true } } } } }
  })
  const subjectIds = classStudents.flatMap(cs => cs.class.subjects.map(s => s.id))

  const quiz = await prisma.quiz.findFirst({
    where: { id: quizId, subjectId: { in: subjectIds }, isPublished: true },
    include: { subject: true }
  })
  if (!quiz) throw Object.assign(new Error('Quiz not found'), { status: 404 })

  const existing = await prisma.quizSubmission.findUnique({
    where: { quizId_studentId: { quizId, studentId } }
  })
  if (existing) throw Object.assign(new Error('Quiz already submitted'), { status: 409 })

  return quiz
}

const submitQuiz = async (quizId, studentId, answers) => {
  const quiz = await prisma.quiz.findUnique({ where: { id: quizId } })
  if (!quiz) throw Object.assign(new Error('Quiz not found'), { status: 404 })

  const questions = quiz.questions
  let correct = 0
  if (Array.isArray(questions)) {
    questions.forEach((q, i) => {
      if (q.correctAnswer !== undefined && answers[i] === q.correctAnswer) correct++
    })
  }
  const score = questions.length > 0 ? (correct / questions.length) * 100 : 0

  return prisma.quizSubmission.create({
    data: { quizId, studentId, answers, score }
  })
}

const getStudentNotifications = async (userId) => {
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
  getStudentProfile,
  updateStudentProfile,
  getStudentAttendance,
  getStudentSubjects,
  getAvailableQuizzes,
  getQuizById,
  submitQuiz,
  getStudentNotifications,
  markNotificationRead
}
