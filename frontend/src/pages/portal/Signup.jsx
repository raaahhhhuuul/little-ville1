import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { staffSignup, resendVerification } from '../../api/auth'
import toast from 'react-hot-toast'
import {
  IconEye, IconEyeOff, IconSpinner, IconShield,
  IconGraduation, IconAlertCircle
} from '../../components/common/Icons'

const DESIGNATIONS = [
  { value: 'TEACHER',           label: 'Teacher' },
  { value: 'ASSISTANT_TEACHER', label: 'Assistant Teacher' },
  { value: 'COORDINATOR',       label: 'Coordinator' },
]

const pwStrength = (pw) => {
  if (!pw) return null
  if (pw.length < 8) return { label: 'Too short', color: 'bg-rose-500', w: '33%' }
  if (!/[A-Z]/.test(pw) || !/\d/.test(pw)) return { label: 'Medium', color: 'bg-amber-400', w: '66%' }
  return { label: 'Strong', color: 'bg-emerald-400', w: '100%' }
}

const StaffSignup = () => {
  const { user, setUser } = useAuth()
  const navigate           = useNavigate()
  const [form, setForm] = useState({
    fullName: '', email: '', designation: '', password: '', confirmPassword: ''
  })
  const [showPw, setShowPw]   = useState(false)
  const [showCPw, setShowCPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [pwErr, setPwErr]     = useState('')
  const [verificationEmail, setVerificationEmail] = useState('')
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (!user) return
    if (user.role === 'STUDENT') navigate('/dashboard', { replace: true })
    else navigate(user.role === 'ADMIN' ? '/portal/admin/dashboard' : '/portal/staff/dashboard', { replace: true })
  }, [user, navigate])

  if (user) return null

  const set = (k) => (e) => {
    setForm(p => ({ ...p, [k]: e.target.value }))
    setError('')
    if (k === 'password' || k === 'confirmPassword') setPwErr('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 8) { setPwErr('Password must be at least 8 characters'); return }
    if (form.password !== form.confirmPassword) { setPwErr('Passwords do not match'); return }

    setLoading(true)
    try {
      const result = await staffSignup({
        fullName:    form.fullName,
        email:       form.email,
        password:    form.password,
        designation: form.designation
      })
      if (result.requiresVerification) {
        setVerificationEmail(result.email)
        return
      }
      setUser(result.user)
      toast.success('Account created! Welcome to the portal.')
      navigate('/portal/staff/dashboard', { replace: true })
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to server. Make sure the backend is running on port 5000.')
      } else {
        setError(err.response?.data?.message || 'Failed to create account. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const strength = pwStrength(form.password)

  const handleResend = async () => {
    setResending(true)
    try {
      await resendVerification(verificationEmail)
      toast.success('Verification email resent!')
    } catch {
      toast.error('Failed to resend. Try again shortly.')
    } finally {
      setResending(false)
    }
  }

  if (verificationEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative" style={{ background: '#0F1117' }}>
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />
        <div className="w-full max-w-sm z-10 text-center animate-slide-up">
          <div className="w-14 h-14 bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <h1 className="font-display text-2xl text-white">Check your email</h1>
          <p className="text-gray-400 text-sm mt-3 leading-relaxed">
            We sent a verification link to<br />
            <span className="text-gray-200">{verificationEmail}</span>
          </p>
          <p className="text-gray-600 text-xs mt-3">
            Click the link in the email to activate your account.
          </p>
          <button
            onClick={handleResend}
            disabled={resending}
            className="mt-6 text-sm text-violet-400 hover:text-violet-300 transition-colors disabled:opacity-50 flex items-center gap-1.5 mx-auto"
          >
            {resending && <IconSpinner size={14} />}
            Resend verification email
          </button>
          <p className="mt-6 text-xs text-gray-700">
            <Link to="/portal/login" className="text-violet-400 hover:text-violet-300 transition-colors">Back to sign in</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative"
      style={{ background: '#0F1117' }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize:  '48px 48px'
        }}
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
            <p className="text-violet-400 text-xs tracking-widest uppercase">Staff Registration</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#1A1D27] border border-[#2A2D3A] p-6">
          <h2 className="text-base font-medium text-white mb-0.5">Create staff account</h2>
          <p className="text-xs text-gray-500 mb-5">
            Already have an account?{' '}
            <Link to="/portal/login" className="text-violet-400 hover:text-violet-300 transition-colors">
              Sign in
            </Link>
          </p>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-950/40 border border-rose-800/50 flex gap-2.5">
              <IconAlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
              <p className="text-sm text-rose-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name</label>
              <input
                type="text"
                value={form.fullName}
                onChange={set('fullName')}
                className="w-full px-3.5 py-2.5 text-sm bg-[#0F1117] border border-[#2A2D3A] text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                placeholder="e.g. Sarah Johnson"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                className="w-full px-3.5 py-2.5 text-sm bg-[#0F1117] border border-[#2A2D3A] text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                placeholder="you@littleville.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Role / Designation</label>
              <div className="relative">
                <select
                  value={form.designation}
                  onChange={set('designation')}
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-[#0F1117] border border-[#2A2D3A] focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all appearance-none"
                  style={{ color: form.designation ? 'white' : '#4B5563' }}
                >
                  <option value="" style={{ color: '#4B5563', background: '#0F1117' }}>
                    Select your role
                  </option>
                  {DESIGNATIONS.map(({ value, label }) => (
                    <option
                      key={value}
                      value={value}
                      style={{ color: 'white', background: '#1A1D27' }}
                    >
                      {label}
                    </option>
                  ))}
                  <option disabled style={{ color: '#374151', background: '#0F1117' }}>
                    ────────────────────
                  </option>
                  <option disabled style={{ color: '#4B5563', background: '#0F1117' }}>
                    Administrator — Restricted (contact admin)
                  </option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
              <p className="text-[10px] text-gray-600 mt-1">
                Admin accounts can only be created by an existing administrator.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  className="w-full px-3.5 py-2.5 pr-10 text-sm bg-[#0F1117] border border-[#2A2D3A] text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                  placeholder="Min. 8 characters"
                  required
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors">
                  {showPw ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
              </div>
              {strength && (
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex-1 h-px bg-[#2A2D3A] overflow-visible relative">
                    <div
                      className={`absolute inset-y-0 left-0 ${strength.color} transition-all duration-300`}
                      style={{ width: strength.w, height: '2px', top: '-0.5px' }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 w-12 text-right">{strength.label}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type={showCPw ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  className="w-full px-3.5 py-2.5 pr-10 text-sm bg-[#0F1117] border border-[#2A2D3A] text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                  placeholder="Re-enter password"
                  required
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowCPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors">
                  {showCPw ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
              </div>
              {pwErr && <p className="text-xs text-rose-400 mt-1">{pwErr}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {loading
                ? <><IconSpinner size={16} /> Creating account…</>
                : <><IconShield size={15} /> Create Staff Account</>}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-gray-700 mt-5">
          Student?{' '}
          <Link to="/signup" className="text-violet-400 hover:text-violet-300 transition-colors">
            Student portal signup
          </Link>
          {' · '}Little Ville Management System v1.0
        </p>
      </div>
    </div>
  )
}

export default StaffSignup
