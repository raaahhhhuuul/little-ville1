const studentService = require('../services/studentService')

const requireStudentProfile = (req, res) => {
  if (!req.user.studentProfile) {
    res.status(403).json({ success: false, message: 'Student profile not found' })
    return false
  }
  return true
}

const getProfile = async (req, res, next) => {
  try {
    const profile = await studentService.getStudentProfile(req.user.id)
    res.json({ success: true, data: profile })
  } catch (err) {
    next(err)
  }
}

const updateProfile = async (req, res, next) => {
  try {
    const profile = await studentService.updateStudentProfile(req.user.id, req.body)
    res.json({ success: true, data: profile })
  } catch (err) {
    next(err)
  }
}

const getAttendance = async (req, res, next) => {
  try {
    if (!requireStudentProfile(req, res)) return
    const { month, year } = req.query
    const data = await studentService.getStudentAttendance(
      req.user.studentProfile.id,
      month ? Number(month) : undefined,
      year ? Number(year) : undefined
    )
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

const getSubjects = async (req, res, next) => {
  try {
    if (!requireStudentProfile(req, res)) return
    const subjects = await studentService.getStudentSubjects(req.user.studentProfile.id)
    res.json({ success: true, data: subjects })
  } catch (err) {
    next(err)
  }
}

const getQuizzes = async (req, res, next) => {
  try {
    if (!requireStudentProfile(req, res)) return
    const quizzes = await studentService.getAvailableQuizzes(req.user.studentProfile.id)
    res.json({ success: true, data: quizzes })
  } catch (err) {
    next(err)
  }
}

const getQuiz = async (req, res, next) => {
  try {
    if (!requireStudentProfile(req, res)) return
    const quiz = await studentService.getQuizById(req.params.id, req.user.studentProfile.id)
    res.json({ success: true, data: quiz })
  } catch (err) {
    next(err)
  }
}

const submitQuiz = async (req, res, next) => {
  try {
    if (!requireStudentProfile(req, res)) return
    const submission = await studentService.submitQuiz(
      req.params.id,
      req.user.studentProfile.id,
      req.body.answers
    )
    res.status(201).json({ success: true, data: submission, message: 'Quiz submitted successfully' })
  } catch (err) {
    next(err)
  }
}

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await studentService.getStudentNotifications(req.user.id)
    res.json({ success: true, data: notifications })
  } catch (err) {
    next(err)
  }
}

const markNotificationRead = async (req, res, next) => {
  try {
    await studentService.markNotificationRead(req.user.id, req.params.id)
    res.json({ success: true, message: 'Marked as read' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getProfile, updateProfile,
  getAttendance,
  getSubjects,
  getQuizzes, getQuiz, submitQuiz,
  getNotifications, markNotificationRead
}
