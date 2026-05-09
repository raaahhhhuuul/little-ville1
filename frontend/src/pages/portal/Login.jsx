import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { login, logout } from '../../api/auth'
import toast from 'react-hot-toast'
import { IconEye, IconEyeOff, IconSpinner, IconShield, IconGraduation, IconAlertCircle, IconExternalLink } from '../../components/common/Icons'

const portalRedirectMap = {
  STAFF: '/portal/staff/dashboard',
  ADMIN: '/portal/admin/dashboard'
}

const demoAccounts = [
  { role: 'Admin', email: 'admin@kindercare.com', password: 'Admin@1234',  desc: 'Full system access' },
  { role: 'Staff', email: 'staff@kindercare.com', password: 'Staff@1234',  desc: 'Classes & attendance' }
]

const PortalLogin = () => {
  const { user, setUser } = useAuth()
  const navigate          = useNavigate()
  const [form, setForm]   = useState({ email: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  if (user) {
    if (user.role === 'STUDENT') navigate('/dashboard', { replace: true })
    else navigate(portalRedirectMap[user.role] || '/portal/staff/dashboard', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { toast.error('Please fill in all fields'); return }
    setLoading(true)
    try {
      const { user: u } = await login(form.email, form.password)
      if (u.role === 'STUDENT') {
        await logout()
        setError('This portal is for staff and administrators only. Students must use the student portal.')
        return
      }
      setUser(u)
      toast.success('Welcome back!')
      navigate(portalRedirectMap[u.role] || '/portal/staff/dashboard', { replace: true })
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to server. Make sure the backend is running on port 5000.')
      } else {
        setError(err.response?.data?.message || 'Invalid credentials. Please check your email and password.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative"
      style={{ background: '#0F1117' }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '48px 48px' }}
      />

      <div className="w-full max-w-sm z-10 animate-slide-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-4">
            <IconGraduation size={22} className="text-violet-400" />
          </div>
          <h1 className="font-display text-2xl text-white">Little Ville</h1>
          <div className="flex items-center gap-1.5 mt-1.5">
            <IconShield size={11} className="text-violet-400" strokeWidth={1.5} />
            <p className="text-violet-400 text-xs tracking-widest uppercase">Staff & Admin Portal</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#1A1D27] border border-[#2A2D3A] p-6">
          <h2 className="text-base font-medium text-white mb-0.5">Authorized access only</h2>
          <p className="text-xs text-gray-500 mb-5">
            No account?{' '}
            <Link to="/portal/signup" className="text-violet-400 hover:text-violet-300 transition-colors">
              Register as staff
            </Link>
            {' · '}
            <a href="/login" className="text-gray-600 hover:text-gray-400 inline-flex items-center gap-0.5 transition-colors">
              Student portal <IconExternalLink size={10} />
            </a>
          </p>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-950/40 border border-rose-800/50 flex gap-2.5">
              <IconAlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-rose-300">{error}</p>
                {error.includes('student portal') && (
                  <a href="/login" className="text-xs text-rose-400 hover:underline mt-1 block">
                    → Go to Student Portal
                  </a>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setError('') }}
                className="w-full px-3.5 py-2.5 text-sm bg-[#0F1117] border border-[#2A2D3A] text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                placeholder="you@littleville.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setError('') }}
                  className="w-full px-3.5 py-2.5 pr-10 text-sm bg-[#0F1117] border border-[#2A2D3A] text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {showPw ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {loading
                ? <><IconSpinner size={16} /> Verifying...</>
                : <><IconShield size={15} /> Sign In to Portal</>}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-5 pt-5 border-t border-[#2A2D3A]">
            <p className="text-[10px] font-medium text-gray-600 uppercase tracking-widest mb-3">Demo Access</p>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map(({ role, email, password, desc }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => { setForm({ email, password }); setError('') }}
                  className="p-3 text-left bg-[#0F1117] border border-[#2A2D3A] hover:border-violet-500/50 hover:bg-violet-950/20 transition-colors"
                >
                  <p className="text-xs font-medium text-gray-300">{role}</p>
                  <p className="text-[10px] text-gray-600 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-700 mt-5">Little Ville Management System · Staff Portal v1.0</p>
      </div>
    </div>
  )
}

export default PortalLogin
