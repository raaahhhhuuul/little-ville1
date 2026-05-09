const router = require('express').Router()
const { authenticate } = require('../middleware/auth')
const { authorize } = require('../middleware/authorize')
const { validate } = require('../middleware/errorHandler')
const { body } = require('express-validator')
const ctrl = require('../controllers/studentController')

router.use(authenticate, authorize('STUDENT'))

router.get('/profile', ctrl.getProfile)
router.patch('/profile', ctrl.updateProfile)

router.get('/attendance', ctrl.getAttendance)

router.get('/subjects', ctrl.getSubjects)

router.get('/quizzes', ctrl.getQuizzes)
router.get('/quizzes/:id', ctrl.getQuiz)
router.post('/quizzes/:id/submit',
  [body('answers').notEmpty()],
  validate,
  ctrl.submitQuiz
)

router.get('/notifications', ctrl.getNotifications)
router.patch('/notifications/:id/read', ctrl.markNotificationRead)

module.exports = router
