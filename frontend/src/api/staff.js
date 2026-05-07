import api from './axios'

export const getClasses = () => api.get('/staff/classes')
export const createClass = (data) => api.post('/staff/classes', data)
export const updateClass = (id, data) => api.patch(`/staff/classes/${id}`, data)
export const addStudent = (classId, studentId) => api.post(`/staff/classes/${classId}/students`, { studentId })
export const removeStudent = (classId, studentId) => api.delete(`/staff/classes/${classId}/students/${studentId}`)

export const getSubjects = () => api.get('/staff/subjects')
export const createSubject = (data) => api.post('/staff/subjects', data)

export const markAttendance = (data) => api.post('/staff/attendance', data)
export const getClassAttendance = (classId, date) => api.get('/staff/attendance', { params: { classId, date } })

export const getQuizzes = () => api.get('/staff/quizzes')
export const createQuiz = (data) => api.post('/staff/quizzes', data)
export const updateQuiz = (id, data) => api.patch(`/staff/quizzes/${id}`, data)
export const getQuizSubmissions = (id) => api.get(`/staff/quizzes/${id}/submissions`)

export const getNotifications = () => api.get('/staff/notifications')
export const markNotificationRead = (id) => api.patch(`/staff/notifications/${id}/read`)
