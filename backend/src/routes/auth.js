const router = require('express').Router()
const { body } = require('express-validator')
const { authenticate } = require('../middleware/auth')
const { validate } = require('../middleware/errorHandler')
const { login, logout, refresh, getMe } = require('../controllers/authController')

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

module.exports = router
