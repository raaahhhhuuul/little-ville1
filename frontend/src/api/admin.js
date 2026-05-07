import api from './axios'

export const getUsers = (params) => api.get('/admin/users', { params })
export const createUser = (data) => api.post('/admin/users', data)
export const deactivateUser = (id) => api.patch(`/admin/users/${id}/deactivate`)
export const reactivateUser = (id) => api.patch(`/admin/users/${id}/reactivate`)

export const getAnalytics = () => api.get('/admin/analytics')

export const markStaffAttendance = (data) => api.post('/admin/attendance', data)
export const getStaffAttendance = (params) => api.get('/admin/attendance', { params })

export const manageSalary = (data) => api.post('/admin/salary', data)
export const getSalaries = (params) => api.get('/admin/salary', { params })

export const sendNotification = (data) => api.post('/admin/notifications', data)
