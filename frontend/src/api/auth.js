import api, { setToken, removeToken, setUserRole, removeUserRole } from './axios'

export const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password })
  const { token, user } = res.data.data
  setToken(token)
  setUserRole(user.role)
  return { user, token }
}

export const logout = async () => {
  try { await api.post('/auth/logout') } catch (_) {}
  removeToken()
  removeUserRole()
}

export const getMe = async () => {
  const res = await api.get('/auth/me')
  return res.data.data
}

export const getClasses = async () => {
  const res = await api.get('/auth/classes')
  return res.data.data
}

export const studentSignup = async ({ studentName, parentName, parentEmail, password, classId }) => {
  const res = await api.post('/auth/student-signup', {
    studentName, parentName, parentEmail, password, classId
  })
  const { token, user } = res.data.data
  setToken(token)
  setUserRole(user.role)
  return { user, token }
}

export const staffSignup = async ({ fullName, email, password, designation }) => {
  const res = await api.post('/auth/staff-signup', {
    fullName, email, password, designation
  })
  const { token, user } = res.data.data
  setToken(token)
  setUserRole(user.role)
  return { user, token }
}
