import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { getMe } from '../api/auth'
import { getToken } from '../api/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  const loadUser = useCallback(async () => {
    if (!getToken()) { setLoading(false); return }
    try {
      const userData = await getMe()
      setUser(userData)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadUser() }, [loadUser])

  // Auto-clear loggingOut 600 ms after user becomes null
  useEffect(() => {
    if (!user && loggingOut) {
      const t = setTimeout(() => setLoggingOut(false), 600)
      return () => clearTimeout(t)
    }
  }, [user, loggingOut])

  const startLogout = useCallback(() => setLoggingOut(true), [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading, refresh: loadUser, loggingOut, startLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
