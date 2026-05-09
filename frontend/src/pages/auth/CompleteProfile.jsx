import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { updateProfile } from '../../api/student'
import toast from 'react-hot-toast'
import { IconSpinner, IconGraduation, IconAlertCircle } from '../../components/common/Icons'

const Step = ({ n, label, state }) => {
  const base = 'w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 transition-colors'
  if (state === 'done')   return (
    <div className={`${base} bg-orange-400 text-white`}>✓</div>
  )
  if (state === 'active') return (
    <div className={`${base} bg-orange-500 text-white ring-4 ring-orange-200`}>{n}</div>
  )
  return <div className={`${base} bg-gray-200 text-gray-400`}>{n}</div>
}

const StudentCompleteProfile = () => {
  const { user, loading, refresh } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ guardianPhone: '', dateOfBirth: '', address: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  useEffect(() => {
    if (loading) return
    if (!user) { navigate('/login', { replace: true }); return }
    if (user.role !== 'STUDENT') { navigate('/portal/complete-profile', { replace: true }); return }
    if (user.studentProfile?.guardianPhone) { navigate('/dashboard', { replace: true }) }
  }, [user, loading, navigate])

  if (loading || !user || user.role !== 'STUDENT') return null
  if (user.studentProfile?.guardianPhone) return null

  const profile   = user.studentProfile
  const firstName = profile?.firstName || user.email?.split('@')[0] || 'there'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.guardianPhone.trim()) { setError('Guardian phone number is required'); return }

    setSaving(true)
    setError('')
    try {
      await updateProfile({
        guardianPhone: form.guardianPhone.trim(),
        ...(form.dateOfBirth && { dateOfBirth: new Date(form.dateOfBirth).toISOString() }),
        ...(form.address.trim() && { address: form.address.trim() })
      })
      await refresh()
      toast.success('Profile completed! Welcome aboard.')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save profile. Please try again.')
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#FFF7EE' }}>
      <div className="w-full max-w-md animate-slide-up">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #FF8C42, #FF6F61)' }}
          >
            <IconGraduation size={20} className="text-white" />
          </div>
          <span className="font-display text-2xl text-orange-500">Little Ville</span>
        </div>

        {/* Progress steps */}
        <div className="flex items-center mb-8">
          <Step n={1} label="Account" state="done" />
          <div className="flex-1 h-0.5 bg-orange-300 mx-2" />
          <Step n={2} label="Profile" state="active" />
          <div className="flex-1 h-0.5 bg-gray-200 mx-2" />
          <Step n={3} label="Dashboard" state="pending" />
        </div>
        <div className="flex justify-between text-xs mb-6 -mt-2 px-0.5">
          <span className="text-orange-400 font-medium w-16 text-center">Account</span>
          <span className="text-orange-600 font-medium w-16 text-center">Profile</span>
          <span className="text-gray-400 w-16 text-center">Dashboard</span>
        </div>

        {/* Greeting */}
        <h1 className="font-display text-3xl text-gray-900 mb-1">
          Hi, {firstName}!
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Just a few more details and you're ready to go.
        </p>

        {/* Card */}
        <div className="bg-white rounded-2xl border-2 border-orange-100 p-6">
          {error && (
            <div className="mb-5 p-4 bg-rose-50 border-2 border-rose-200 rounded-xl flex gap-2.5">
              <IconAlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">
                Guardian Phone Number
                <span className="text-rose-400 ml-0.5">*</span>
              </label>
              <input
                type="tel"
                value={form.guardianPhone}
                onChange={e => { setForm(p => ({ ...p, guardianPhone: e.target.value })); setError('') }}
                className="input-field rounded-xl"
                placeholder="+1 555 000 0000"
                required
              />
            </div>

            <div>
              <label className="label">
                Student Date of Birth
                <span className="text-gray-400 font-normal text-xs ml-1.5">(optional)</span>
              </label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={e => setForm(p => ({ ...p, dateOfBirth: e.target.value }))}
                className="input-field rounded-xl"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="label">
                Home Address
                <span className="text-gray-400 font-normal text-xs ml-1.5">(optional)</span>
              </label>
              <textarea
                value={form.address}
                onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                className="input-field rounded-xl resize-none"
                rows={2}
                placeholder="123 Sunshine Street, City"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-full"
            >
              {saving
                ? <><IconSpinner size={16} /> Saving…</>
                : 'Save & Go to Dashboard'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          You can update these details anytime from your profile page.
        </p>
      </div>
    </div>
  )
}

export default StudentCompleteProfile
