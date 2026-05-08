import api, { setToken, removeToken } from './axios'

export const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password })
  const { token, user } = res.data.data
  setToken(token)
  return { user, token }
}

export const logout = async () => {
  try { await api.post('/auth/logout') } catch (_) {}
  removeToken()
}

export const getMe = async () => {
  const res = await api.get('/auth/me')
  return res.data.data
}
