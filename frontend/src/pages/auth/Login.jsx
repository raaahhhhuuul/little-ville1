import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { login, logout, resendVerification } from '../../api/auth'
import toast from 'react-hot-toast'
import { IconEye, IconEyeOff, IconSpinner, IconAlertCircle, IconExternalLink, IconGraduation } from '../../components/common/Icons'

const StudentLogin = () => {
  const { user, setUser } = useAuth()
  const navigate          = useNavigate()
  const [form, setForm]   = useState({ email: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [unverifiedEmail, setUnverifiedEmail] = useState('')
  const [resending, setResending] = useState(false)

  if (user) {
    if (user.role === 'STUDENT') navigate('/dashboard', { replace: true })
    else navigate(user.role === 'ADMIN' ? '/portal/admin/dashboard' : '/portal/staff/dashboard', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { toast.error('Please fill in all fields'); return }
    setLoading(true)
    try {
      const { user: u } = await login(form.email, form.password)
      if (u.role !== 'STUDENT') {
        await logout()
        setError('This portal is for students only. Staff and admins must use the staff portal.')
        return
      }
      setUser(u)
      toast.success('Welcome back!')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to server. Make sure the backend is running on port 5000.')
      } else if (err.response?.data?.code === 'EMAIL_NOT_VERIFIED') {
        setUnverifiedEmail(form.email)
        setError(err.response.data.message)
      } else {
        setError(err.response?.data?.message || 'Invalid email or password')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await resendVerification(unverifiedEmail)
      toast.success('Verification email resent!')
    } catch {
      toast.error('Failed to resend. Try again shortly.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#FFF7EE' }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-10"
        style={{ background: 'linear-gradient(160deg, #FF6F61 0%, #FF8C42 55%, #FFBB33 100%)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/25 rounded-full flex items-center justify-center">
            <IconGraduation size={20} className="text-white" />
          </div>
          <span className="font-display text-2xl text-white">Little Ville</span>
        </div>

        {/* Center content */}
        <div>
          <p className="text-white/70 text-xs font-medium tracking-widest uppercase mb-5">Student Portal</p>
          <h2 className="font-display text-4xl text-white leading-snug">
            Ready to learn<br />something new?
          </h2>
          <p className="text-white/70 text-sm mt-4 leading-relaxed">
            Access your attendance, subjects, quizzes and notifications — all in one colourful place!
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-6">
            {['Attendance', 'Subjects', 'Quizzes', 'Notifications'].map(label => (
              <span key={label} className="bg-white/20 text-white text-xs px-3 py-1.5 rounded-full">
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom decorative dots */}
        <div className="flex gap-2.5">
          {['bg-white/60', 'bg-white/40', 'bg-white/30', 'bg-white/20', 'bg-white/15'].map((c, i) => (
            <div key={i} className={`w-2.5 h-2.5 ${c} rounded-full`} />
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-slide-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF8C42, #FF6F61)' }}>
              <IconGraduation size={17} className="text-white" />
            </div>
            <span className="font-display text-2xl text-orange-500">Little Ville</span>
          </div>

          <h1 className="font-display text-3xl text-gray-900">Sign in</h1>
          <p className="text-sm text-gray-500 mt-1">
            No account?{' '}
            <Link to="/signup" className="text-orange-500 hover:text-orange-600 hover:underline">
              Create one
            </Link>
            {' · '}
            <a href="/portal/login" className="text-gray-400 hover:text-gray-600 hover:underline inline-flex items-center gap-0.5">
              Staff portal <IconExternalLink size={11} />
            </a>
          </p>

          {error && (
            <div className="mt-5 p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl flex gap-2.5">
              <IconAlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-rose-700">{error}</p>
                {error.includes('staff portal') && (
                  <a href="/portal/login" className="text-xs text-rose-600 hover:underline mt-1 block">
                    → Go to Staff Portal
                  </a>
                )}
                {unverifiedEmail && (
                  <button
                    onClick={handleResend}
                    disabled={resending}
                    className="text-xs text-rose-600 hover:underline mt-1 block disabled:opacity-50"
                  >
                    {resending ? 'Sending…' : '→ Resend verification email'}
                  </button>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setError('') }}
                className="input-field rounded-xl"
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
                  value={form.password}
                  onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setError('') }}
                  className="input-field rounded-xl pr-10"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  {showPw ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-full"
            >
              {loading ? <><IconSpinner size={16} /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">Little Ville v1.0</p>
        </div>
      </div>
    </div>
  )
}

export default StudentLogin
