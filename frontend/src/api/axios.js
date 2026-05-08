import axios from 'axios'

const TOKEN_KEY = 'lv_token'

export const getToken    = ()  => localStorage.getItem(TOKEN_KEY)
export const setToken    = (t) => localStorage.setItem(TOKEN_KEY, t)
export const removeToken = ()  => localStorage.removeItem(TOKEN_KEY)

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      removeToken()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
