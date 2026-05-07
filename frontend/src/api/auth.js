import api, { supabase } from './axios'

export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
  const meRes = await api.get('/auth/me')
  return { session: data.session, user: meRes.data.data }
}

export const logout = async () => {
  await supabase.auth.signOut()
}

export const getMe = async () => {
  const res = await api.get('/auth/me')
  return res.data.data
}
