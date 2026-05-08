const authService = require('../services/authService')

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const result = await authService.login(email, password)
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.id)
    res.json({ success: true, message: 'Logged out successfully' })
  } catch (err) {
    next(err)
  }
}

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token required' })
    }
    const result = await authService.refreshSession(refreshToken)
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id)
    res.json({ success: true, data: user })
  } catch (err) {
    next(err)
  }
}

module.exports = { login, logout, refresh, getMe }
