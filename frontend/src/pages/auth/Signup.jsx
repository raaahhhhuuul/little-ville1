import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { studentSignup, getClasses, resendVerification } from '../../api/auth'
import toast from 'react-hot-toast'
import {
  IconEye, IconEyeOff, IconSpinner, IconAlertCircle,
  IconGraduation, IconChevronDown
} from '../../components/common/Icons'

const pwStrength = (pw) => {
  if (!pw) return null
  if (pw.length < 8) return { label: 'Too short', color: 'bg-rose-400', w: 'w-1/3' }
  if (!/[A-Z]/.test(pw) || !/\d/.test(pw)) return { label: 'Medium', color: 'bg-amber-400', w: 'w-2/3' }
  return { label: 'Strong', color: 'bg-emerald-400', w: 'w-full' }
}

const StudentSignup = () => {
  const { user, setUser } = useAuth()
  const navigate           = useNavigate()

  const [classes, setClasses]           = useState([])
  const [loadingClasses, setLoadingClasses] = useState(true)
  const [form, setForm] = useState({
    studentName: '', parentName: '', parentEmail: '',
    classId: '', password: '', confirmPassword: ''
  })
  const [showPw, setShowPw]   = useState(false)
  const [showCPw, setShowCPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [pwErr, setPwErr]     = useState('')
  const [verificationEmail, setVerificationEmail] = useState('')
  const [resending, setResending] = useState(false)

  useEffect(() => {
    getClasses()
      .then(setClasses)
      .catch(() => setClasses([]))
      .finally(() => setLoadingClasses(false))
  }, [])

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
    if (!form.classId) { setError('Please select a class'); return }

    setLoading(true)
    try {
      const result = await studentSignup({
        studentName:  form.studentName,
        parentName:   form.parentName,
        parentEmail:  form.parentEmail,
        password:     form.password,
        classId:      form.classId
      })
      if (result.requiresVerification) {
        setVerificationEmail(result.email)
        return
      }
      setUser(result.user)
      toast.success('Welcome to Little Ville!')
      navigate('/dashboard', { replace: true })
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
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#FFF7EE' }}>
        <div className="w-full max-w-sm text-center animate-slide-up">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: 'linear-gradient(135deg, #FF8C42, #FF6F61)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <h1 className="font-display text-3xl text-gray-900">Check your email</h1>
          <p className="text-gray-500 text-sm mt-3 leading-relaxed">
            We sent a verification link to<br />
            <span className="font-medium text-gray-700">{verificationEmail}</span>
          </p>
          <p className="text-gray-400 text-xs mt-3">
            Click the link in the email to activate your account.
          </p>
          <button
            onClick={handleResend}
            disabled={resending}
            className="mt-6 text-sm text-orange-500 hover:text-orange-600 hover:underline disabled:opacity-50 flex items-center gap-1.5 mx-auto"
          >
            {resending && <IconSpinner size={14} />}
            Resend verification email
          </button>
          <p className="mt-6 text-xs text-gray-400">
            <Link to="/login" className="text-orange-500 hover:underline">Back to sign in</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#FFF7EE' }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-10"
        style={{ background: 'linear-gradient(160deg, #FF6F61 0%, #FF8C42 55%, #FFBB33 100%)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/25 rounded-full flex items-center justify-center">
            <IconGraduation size={20} className="text-white" />
          </div>
          <span className="font-display text-2xl text-white">Little Ville</span>
        </div>

        <div>
          <p className="text-white/70 text-xs font-medium tracking-widest uppercase mb-5">Student Portal</p>
          <h2 className="font-display text-4xl text-white leading-snug">
            Join Little Ville<br />today!
          </h2>
          <p className="text-white/70 text-sm mt-4 leading-relaxed">
            Create your student account and unlock a world of learning — subjects, quizzes, attendance and more!
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {['Subjects', 'Quizzes', 'Attendance', 'Notifications'].map(label => (
              <span key={label} className="bg-white/20 text-white text-xs px-3 py-1.5 rounded-full">
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2.5">
          {['bg-white/60', 'bg-white/40', 'bg-white/30', 'bg-white/20', 'bg-white/15'].map((c, i) => (
            <div key={i} className={`w-2.5 h-2.5 ${c} rounded-full`} />
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-sm py-8 animate-slide-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF8C42, #FF6F61)' }}>
              <IconGraduation size={17} className="text-white" />
            </div>
            <span className="font-display text-2xl text-orange-500">Little Ville</span>
          </div>

          <h1 className="font-display text-3xl text-gray-900">Create account</h1>
          <p className="text-sm text-gray-500 mt-1">
            Already have one?{' '}
            <Link to="/login" className="text-orange-500 hover:text-orange-600 hover:underline">
              Sign in
            </Link>
          </p>

          {error && (
            <div className="mt-5 p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl flex gap-2.5">
              <IconAlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label">Student Full Name</label>
              <input
                type="text"
                value={form.studentName}
                onChange={set('studentName')}
                className="input-field rounded-xl"
                placeholder="e.g. Emma Thompson"
                required
              />
            </div>

            <div>
              <label className="label">Parent / Guardian Name</label>
              <input
                type="text"
                value={form.parentName}
                onChange={set('parentName')}
                className="input-field rounded-xl"
                placeholder="e.g. Robert Thompson"
                required
              />
            </div>

            <div>
              <label className="label">Parent Email</label>
              <input
                type="email"
                value={form.parentEmail}
                onChange={set('parentEmail')}
                className="input-field rounded-xl"
                placeholder="parent@email.com"
                required
                autoComplete="email"
              />
              <p className="text-xs text-gray-400 mt-1">This will be used to sign in</p>
            </div>

            <div>
              <label className="label">Class</label>
              <div className="relative">
                <select
                  value={form.classId}
                  onChange={set('classId')}
                  required
                  disabled={loadingClasses}
                  className="input-field rounded-xl appearance-none pr-10 disabled:opacity-60"
                >
                  <option value="">
                    {loadingClasses ? 'Loading classes…' : classes.length === 0 ? 'No classes available' : 'Select a class'}
                  </option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}{cls.section ? ` — Section ${cls.section}` : ''}
                    </option>
                  ))}
                </select>
                <IconChevronDown
                  size={15}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
              {!loadingClasses && classes.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">No classes found. Please contact the administrator.</p>
              )}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  className="input-field rounded-xl pr-10"
                  placeholder="Min. 8 characters"
                  required
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                  {showPw ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
              </div>
              {strength && (
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.w}`} />
                  </div>
                  <span className="text-xs text-gray-400 w-12 text-right">{strength.label}</span>
                </div>
              )}
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <input
                  type={showCPw ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  className="input-field rounded-xl pr-10"
                  placeholder="Re-enter password"
                  required
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowCPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                  {showCPw ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
              </div>
              {pwErr && <p className="text-xs text-rose-500 mt-1">{pwErr}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || loadingClasses}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-full mt-2"
            >
              {loading
                ? <><IconSpinner size={16} /> Creating account…</>
                : 'Create Student Account'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Staff or admin?{' '}
            <Link to="/portal/signup" className="text-orange-500 hover:underline">
              Staff portal signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default StudentSignup
