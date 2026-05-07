import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { login } from '../../api/auth'
import toast from 'react-hot-toast'
import { GraduationCap, Eye, EyeOff, Loader2 } from 'lucide-react'

const redirectMap = { ADMIN: '/admin', STAFF: '/staff', STUDENT: '/student' }

const Login = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  if (user) {
    const dest = location.state?.from?.pathname || redirectMap[user.role] || '/'
    navigate(dest, { replace: true })
    return null
  }

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      const { user: u } = await login(form.email, form.password)
      toast.success(`Welcome back!`)
      navigate(redirectMap[u.role] || '/', { replace: true })
    } catch (err) {
      toast.error(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4 shadow-lg shadow-primary-200">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">KinderCare</h1>
          <p className="text-gray-500 mt-1">Management System</p>
        </div>

        <div className="card shadow-xl border-0">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Sign in to your account</h2>
          <p className="text-sm text-gray-500 mb-6">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                placeholder="you@kindercare.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center mb-3">Demo Credentials</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { role: 'Admin', email: 'admin@kindercare.com', color: 'purple' },
                { role: 'Staff', email: 'staff@kindercare.com', color: 'blue' },
                { role: 'Student', email: 'student@kindercare.com', color: 'green' }
              ].map(({ role, email, color }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setForm({ email, password: `${role}@1234` })}
                  className={`p-2 rounded-lg border text-center transition-colors ${
                    color === 'purple' ? 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100' :
                    color === 'blue' ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100' :
                    'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  <div className="font-medium">{role}</div>
                  <div className="text-xs opacity-70 truncate">{role}@1234</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          KinderCare Management System v1.0
        </p>
      </div>
    </div>
  )
}

export default Login
