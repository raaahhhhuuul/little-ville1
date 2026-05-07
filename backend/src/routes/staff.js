const router = require('express').Router()
const { authenticate } = require('../middleware/auth')
const { authorize } = require('../middleware/authorize')
const { validate } = require('../middleware/errorHandler')
const { body, query } = require('express-validator')
const ctrl = require('../controllers/staffController')

router.use(authenticate, authorize('STAFF', 'ADMIN'))

router.get('/classes', ctrl.getClasses)
router.post('/classes',
  [body('name').trim().notEmpty(), body('grade').trim().notEmpty()],
  validate, ctrl.createClass
)
router.patch('/classes/:id', ctrl.updateClass)
router.post('/classes/:id/students',
  [body('studentId').notEmpty()], validate, ctrl.addStudentToClass
)
router.delete('/classes/:id/students/:studentId', ctrl.removeStudentFromClass)

router.get('/subjects', ctrl.getSubjects)
router.post('/subjects',
  [
    body('name').trim().notEmpty(),
    body('classId').notEmpty()
  ],
  validate, ctrl.createSubject
)

router.post('/attendance',
  [
    body('classId').notEmpty(),
    body('attendances').isArray().notEmpty()
  ],
  validate, ctrl.markAttendance
)
router.get('/attendance',
  [query('classId').notEmpty(), query('date').isISO8601()],
  validate, ctrl.getAttendance
)

router.get('/quizzes', ctrl.getQuizzes)
router.post('/quizzes',
  [
    body('title').trim().notEmpty(),
    body('subjectId').notEmpty(),
    body('questions').isArray()
  ],
  validate, ctrl.createQuiz
)
router.patch('/quizzes/:id', ctrl.updateQuiz)
router.get('/quizzes/:id/submissions', ctrl.getQuizSubmissions)

router.get('/notifications', ctrl.getNotifications)
router.patch('/notifications/:id/read', ctrl.markNotificationRead)

module.exports = router
