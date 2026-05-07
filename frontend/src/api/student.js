import api from './axios'

export const getProfile = () => api.get('/student/profile')
export const updateProfile = (data) => api.patch('/student/profile', data)

export const getAttendance = (params) => api.get('/student/attendance', { params })

export const getSubjects = () => api.get('/student/subjects')

export const getQuizzes = () => api.get('/student/quizzes')
export const getQuiz = (id) => api.get(`/student/quizzes/${id}`)
export const submitQuiz = (id, answers) => api.post(`/student/quizzes/${id}/submit`, { answers })

export const getNotifications = () => api.get('/student/notifications')
export const markNotificationRead = (id) => api.patch(`/student/notifications/${id}/read`)
