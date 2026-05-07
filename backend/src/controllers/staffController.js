const staffService = require('../services/staffService')

const getClasses = async (req, res, next) => {
  try {
    const classes = await staffService.getAssignedClasses(req.user.staffProfile.id)
    res.json({ success: true, data: classes })
  } catch (err) {
    next(err)
  }
}

const createClass = async (req, res, next) => {
  try {
    const cls = await staffService.createClass(req.user.staffProfile.id, req.body)
    res.status(201).json({ success: true, data: cls })
  } catch (err) {
    next(err)
  }
}

const updateClass = async (req, res, next) => {
  try {
    const cls = await staffService.updateClass(req.params.id, req.user.staffProfile.id, req.body)
    res.json({ success: true, data: cls })
  } catch (err) {
    next(err)
  }
}

const addStudentToClass = async (req, res, next) => {
  try {
    const cs = await staffService.addStudentToClass(req.params.id, req.body.studentId, req.user.staffProfile.id)
    res.status(201).json({ success: true, data: cs })
  } catch (err) {
    next(err)
  }
}

const removeStudentFromClass = async (req, res, next) => {
  try {
    await staffService.removeStudentFromClass(req.params.id, req.params.studentId, req.user.staffProfile.id)
    res.json({ success: true, message: 'Student removed from class' })
  } catch (err) {
    next(err)
  }
}

const getSubjects = async (req, res, next) => {
  try {
    const subjects = await staffService.getAssignedSubjects(req.user.staffProfile.id)
    res.json({ success: true, data: subjects })
  } catch (err) {
    next(err)
  }
}

const createSubject = async (req, res, next) => {
  try {
    const subject = await staffService.createSubject(req.user.staffProfile.id, req.body)
    res.status(201).json({ success: true, data: subject })
  } catch (err) {
    next(err)
  }
}

const markAttendance = async (req, res, next) => {
  try {
    const { classId, attendances } = req.body
    const records = await staffService.markStudentAttendance(req.user.staffProfile.id, classId, attendances)
    res.json({ success: true, data: records })
  } catch (err) {
    next(err)
  }
}

const getAttendance = async (req, res, next) => {
  try {
    const { classId, date } = req.query
    const records = await staffService.getClassAttendance(classId, req.user.staffProfile.id, date)
    res.json({ success: true, data: records })
  } catch (err) {
    next(err)
  }
}

const getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await staffService.getStaffQuizzes(req.user.staffProfile.id)
    res.json({ success: true, data: quizzes })
  } catch (err) {
    next(err)
  }
}

const createQuiz = async (req, res, next) => {
  try {
    const quiz = await staffService.createQuiz(req.user.staffProfile.id, req.body)
    res.status(201).json({ success: true, data: quiz })
  } catch (err) {
    next(err)
  }
}

const updateQuiz = async (req, res, next) => {
  try {
    const quiz = await staffService.updateQuiz(req.params.id, req.user.staffProfile.id, req.body)
    res.json({ success: true, data: quiz })
  } catch (err) {
    next(err)
  }
}

const getQuizSubmissions = async (req, res, next) => {
  try {
    const submissions = await staffService.getQuizSubmissions(req.params.id, req.user.staffProfile.id)
    res.json({ success: true, data: submissions })
  } catch (err) {
    next(err)
  }
}

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await staffService.getStaffNotifications(req.user.id)
    res.json({ success: true, data: notifications })
  } catch (err) {
    next(err)
  }
}

const markNotificationRead = async (req, res, next) => {
  try {
    await staffService.markNotificationRead(req.user.id, req.params.id)
    res.json({ success: true, message: 'Marked as read' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getClasses, createClass, updateClass, addStudentToClass, removeStudentFromClass,
  getSubjects, createSubject,
  markAttendance, getAttendance,
  getQuizzes, createQuiz, updateQuiz, getQuizSubmissions,
  getNotifications, markNotificationRead
}
