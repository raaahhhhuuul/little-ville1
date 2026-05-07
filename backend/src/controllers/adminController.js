const adminService = require('../services/adminService')
const authService = require('../services/authService')

const getAllUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20 } = req.query
    const result = await adminService.getAllUsers(role, Number(page), Number(limit))
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

const createUser = async (req, res, next) => {
  try {
    const user = await authService.createUserWithProfile(req.body)
    res.status(201).json({ success: true, data: user, message: 'User created successfully' })
  } catch (err) {
    next(err)
  }
}

const deactivateUser = async (req, res, next) => {
  try {
    const user = await authService.deactivateUser(req.params.id)
    res.json({ success: true, data: user, message: 'User deactivated' })
  } catch (err) {
    next(err)
  }
}

const reactivateUser = async (req, res, next) => {
  try {
    const user = await authService.reactivateUser(req.params.id)
    res.json({ success: true, data: user, message: 'User reactivated' })
  } catch (err) {
    next(err)
  }
}

const getAnalytics = async (req, res, next) => {
  try {
    const data = await adminService.getAnalytics()
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

const markStaffAttendance = async (req, res, next) => {
  try {
    const { staffId, date, status, notes } = req.body
    const record = await adminService.markStaffAttendance(staffId, date, status, notes, req.user.id)
    res.json({ success: true, data: record })
  } catch (err) {
    next(err)
  }
}

const getStaffAttendance = async (req, res, next) => {
  try {
    const { month, year } = req.query
    const records = await adminService.getStaffAttendance(Number(month), Number(year))
    res.json({ success: true, data: records })
  } catch (err) {
    next(err)
  }
}

const manageSalary = async (req, res, next) => {
  try {
    const { staffId, month, year, baseSalary, deductions, bonus, reason } = req.body
    const salary = await adminService.createSalary(staffId, month, year, baseSalary, deductions, bonus, reason)
    res.json({ success: true, data: salary })
  } catch (err) {
    next(err)
  }
}

const getSalaries = async (req, res, next) => {
  try {
    const { staffId, year } = req.query
    const salaries = await adminService.getSalaries(staffId, year ? Number(year) : undefined)
    res.json({ success: true, data: salaries })
  } catch (err) {
    next(err)
  }
}

const sendNotification = async (req, res, next) => {
  try {
    const { title, message, target } = req.body
    const notification = await adminService.sendNotification(title, message, target, req.user.id)
    res.status(201).json({ success: true, data: notification, message: 'Notification sent' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getAllUsers,
  createUser,
  deactivateUser,
  reactivateUser,
  getAnalytics,
  markStaffAttendance,
  getStaffAttendance,
  manageSalary,
  getSalaries,
  sendNotification
}
