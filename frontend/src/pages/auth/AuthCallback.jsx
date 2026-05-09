import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../utils/supabase'
import { setToken, setUserRole } from '../../api/axios'
import { getMe } from '../../api/auth'
import { Pinwheel } from '../../components/common/LoadingSpinner'

const AuthCallback = () => {
  const { setUser } = useAuth()
  const navigate    = useNavigate()
  const done        = useRef(false)

  useEffect(() => {
    if (done.current) return
    done.current = true

    const exchange = async () => {
      const code = new URLSearchParams(window.location.search).get('code')
      if (!code) { navigate('/login', { replace: true }); return }

      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      if (error || !data.session) { navigate('/login', { replace: true }); return }

      setToken(data.session.access_token)

      try {
        const user = await getMe()
        setUserRole(user.role)
        setUser(user)
        const dest =
          user.role === 'STUDENT' ? '/dashboard' :
          user.role === 'ADMIN'   ? '/portal/admin/dashboard' :
                                    '/portal/staff/dashboard'
        navigate(dest, { replace: true })
      } catch {
        navigate('/login', { replace: true })
      }
    }

    exchange()
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: 'linear-gradient(160deg, #FFFBEB 0%, #F3F0FF 60%, #EEF2FF 100%)' }}>
      <div style={{ animation: 'spin 1.8s linear infinite' }}>
        <Pinwheel size={56} />
      </div>
      <p className="text-violet-600 text-sm">Verifying your account…</p>
    </div>
  )
}

export default AuthCallback
