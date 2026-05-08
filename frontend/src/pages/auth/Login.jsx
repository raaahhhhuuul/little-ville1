import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { login } from '../../api/auth'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

const redirectMap = { ADMIN: '/admin', STAFF: '/staff', STUDENT: '/student' }

const demoAccounts = [
  { role: 'Admin',   email: 'admin@kindercare.com',   emoji: '👑', gradient: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' },
  { role: 'Staff',   email: 'staff@kindercare.com',   emoji: '🍎', gradient: 'from-orange-400 to-rose-500',   bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
  { role: 'Student', email: 'student@kindercare.com', emoji: '🎒', gradient: 'from-sky-400 to-blue-500',      bg: 'bg-sky-50',    border: 'border-sky-200',    text: 'text-sky-700'    }
]

const floaters = [
  { emoji: '⭐', pos: 'top-8 left-8',      dur: '3.5s', delay: '0s',    size: 'text-4xl' },
  { emoji: '🌈', pos: 'top-6 right-10',    dur: '4.5s', delay: '0.8s',  size: 'text-5xl' },
  { emoji: '🎨', pos: 'top-1/3 left-4',    dur: '4s',   delay: '0.3s',  size: 'text-3xl' },
  { emoji: '📚', pos: 'top-2/3 right-6',   dur: '3.8s', delay: '1.1s',  size: 'text-3xl' },
  { emoji: '✏️', pos: 'bottom-24 left-10', dur: '5s',   delay: '0.5s',  size: 'text-3xl' },
  { emoji: '🌟', pos: 'bottom-16 right-8', dur: '3.2s', delay: '1.5s',  size: 'text-4xl' },
  { emoji: '🎒', pos: 'top-1/2 right-4',   dur: '4.2s', delay: '0.2s',  size: 'text-2xl' },
  { emoji: '🎯', pos: 'bottom-32 left-20', dur: '3.7s', delay: '0.9s',  size: 'text-2xl' },
]

const Login = () => {
  const { user }    = useAuth()
  const navigate    = useNavigate()
  const location    = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  if (user) {
    const dest = location.state?.from?.pathname || redirectMap[user.role] || '/'
    navigate(dest, { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { toast.error('Please fill in all fields'); return }
    setLoading(true)
    try {
      const { user: u } = await login(form.email, form.password)
      toast.success('Welcome back! 🎉')
      navigate(redirectMap[u.role] || '/', { replace: true })
    } catch (err) {
      toast.error(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FFFBEB 0%, #FFF0F6 50%, #EEF2FF 100%)' }}
    >
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-20 animate-blob pointer-events-none"
           style={{ background: 'radial-gradient(circle, #FCD34D, transparent 65%)', animationDelay: '0s' }} />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full opacity-15 animate-blob pointer-events-none"
           style={{ background: 'radial-gradient(circle, #C084FC, transparent 65%)', animationDelay: '3s' }} />
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full opacity-15 animate-blob pointer-events-none"
           style={{ background: 'radial-gradient(circle, #60A5FA, transparent 65%)', animationDelay: '1.5s' }} />

      {/* Floating decorations */}
      {floaters.map(({ emoji, pos, dur, delay, size }) => (
        <div
          key={emoji + pos}
          className={`absolute ${pos} ${size} select-none pointer-events-none opacity-50`}
          style={{ animation: `float ${dur} ease-in-out infinite`, animationDelay: delay }}
        >
          {emoji}
        </div>
      ))}

      {/* Login card */}
      <div className="w-full max-w-md z-10 animate-pop">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl mb-4 shadow-xl shadow-violet-200/50 border-2 border-violet-100">
            <span className="text-5xl">🏫</span>
          </div>
          <h1 className="font-display text-5xl text-violet-700">Little Ville</h1>
          <p className="text-orange-500 font-bold text-sm mt-1 tracking-wide uppercase">Kindergarten Management</p>
        </div>

        {/* Card */}
        <div className="bg-white/85 backdrop-blur-md rounded-4xl p-8 shadow-2xl shadow-violet-200/30 border-2 border-white">
          <h2 className="text-xl font-bold text-violet-800 mb-1">Welcome back! 👋</h2>
          <p className="text-sm text-gray-500 font-medium mb-6">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="input-field"
                placeholder="you@littleville.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="input-field pr-11"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-500 transition-colors"
                >
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2 py-3 text-base"
            >
              {loading
                ? <><Loader2 size={18} className="animate-spin" /> Signing in...</>
                : '🚀 Sign In'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-5 border-t-2 border-amber-100">
            <p className="text-xs font-bold text-gray-400 text-center mb-3 uppercase tracking-wide">
              Quick Demo Access
            </p>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map(({ role, email, emoji, bg, border, text }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setForm({ email, password: `${role}@1234` })}
                  className={`${bg} ${border} border-2 ${text} p-3 rounded-2xl text-center transition-all hover:scale-105 active:scale-95`}
                >
                  <div className="text-2xl mb-1">{emoji}</div>
                  <div className="text-xs font-bold">{role}</div>
                  <div className="text-xs opacity-60">{role}@1234</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 font-medium mt-5">
          Little Ville Management System v1.0 🌟
        </p>
      </div>
    </div>
  )
}

export default Login
