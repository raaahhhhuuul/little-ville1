const router = require('express').Router()
const { body } = require('express-validator')
const { authenticate } = require('../middleware/auth')
const { validate } = require('../middleware/errorHandler')
const {
  login, logout, refresh, getMe,
  getClasses, studentSignup, staffSignup, resendVerification
} = require('../controllers/authController')

router.post('/login',
  [
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password required')
  ],
  validate,
  login
)

router.post('/logout', authenticate, logout)

router.post('/refresh',
  [body('refreshToken').notEmpty().withMessage('Refresh token required')],
  validate,
  refresh
)

router.get('/me', authenticate, getMe)

router.get('/classes', getClasses)

router.post('/student-signup',
  [
    body('studentName').trim().notEmpty().withMessage('Student name required')
      .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('parentName').trim().notEmpty().withMessage('Parent name required'),
    body('parentEmail').isEmail().withMessage('Valid parent email required').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('classId').isUUID().withMessage('Valid class selection required'),
  ],
  validate,
  studentSignup
)

router.post('/staff-signup',
  [
    body('fullName').trim().notEmpty().withMessage('Full name required')
      .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('designation')
      .isIn(['TEACHER', 'ASSISTANT_TEACHER', 'COORDINATOR'])
      .withMessage('Invalid designation. Choose Teacher, Assistant Teacher, or Coordinator.'),
  ],
  validate,
  staffSignup
)

router.post('/resend-verification',
  [body('email').isEmail().withMessage('Valid email required').normalizeEmail()],
  validate,
  resendVerification
)

module.exports = router
