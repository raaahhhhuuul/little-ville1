const router = require('express').Router()
const { authenticate } = require('../middleware/auth')
const { authorize } = require('../middleware/authorize')
const { validate } = require('../middleware/errorHandler')
const { body, query } = require('express-validator')
const ctrl = require('../controllers/adminController')

router.use(authenticate, authorize('ADMIN'))

router.get('/users', ctrl.getAllUsers)

router.post('/users',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['STUDENT', 'STAFF', 'ADMIN']),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty()
  ],
  validate,
  ctrl.createUser
)

router.patch('/users/:id/deactivate', ctrl.deactivateUser)
router.patch('/users/:id/reactivate', ctrl.reactivateUser)

router.get('/analytics', ctrl.getAnalytics)

router.post('/attendance',
  [
    body('staffId').notEmpty(),
    body('date').isISO8601(),
    body('status').isIn(['PRESENT', 'ABSENT', 'LATE'])
  ],
  validate,
  ctrl.markStaffAttendance
)
router.get('/attendance',
  [query('month').isInt({ min: 1, max: 12 }), query('year').isInt({ min: 2020 })],
  validate,
  ctrl.getStaffAttendance
)

router.post('/salary',
  [
    body('staffId').notEmpty(),
    body('month').isInt({ min: 1, max: 12 }),
    body('year').isInt({ min: 2020 }),
    body('baseSalary').isFloat({ min: 0 }),
    body('deductions').optional().isFloat({ min: 0 }),
    body('bonus').optional().isFloat({ min: 0 })
  ],
  validate,
  ctrl.manageSalary
)
router.get('/salary', ctrl.getSalaries)

router.post('/notifications',
  [
    body('title').trim().notEmpty(),
    body('message').trim().notEmpty(),
    body('target').isIn(['ALL', 'STAFF', 'STUDENTS'])
  ],
  validate,
  ctrl.sendNotification
)

module.exports = router
