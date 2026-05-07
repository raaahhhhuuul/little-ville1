const authService = require('../services/authService')

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id)
    res.json({ success: true, data: user })
  } catch (err) {
    next(err)
  }
}

module.exports = { getMe }
