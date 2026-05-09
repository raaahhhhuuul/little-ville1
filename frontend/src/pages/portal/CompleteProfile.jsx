import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { updateStaffProfile } from '../../api/staff'
import toast from 'react-hot-toast'
import { IconSpinner, IconGraduation, IconShield, IconAlertCircle } from '../../components/common/Icons'

const Step = ({ n, state }) => {
  const base = 'w-7 h-7 flex items-center justify-center text-xs shrink-0 transition-colors'
  if (state === 'done')   return <div className={`${base} bg-violet-500 text-white`}>✓</div>
  if (state === 'active') return <div className={`${base} bg-violet-600 text-white ring-4 ring-violet-900`}>{n}</div>
  return <div className={`${base} bg-[#2A2D3A] text-gray-600`}>{n}</div>
}

const StaffCompleteProfile = () => {
  const { user, loading, refresh } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ phone: '', address: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  useEffect(() => {
    if (loading) return
    if (!user) { navigate('/portal/login', { replace: true }); return }
    if (user.role === 'STUDENT') { navigate('/complete-profile', { replace: true }); return }
    if (user.staffProfile?.phone) {
      const dest = user.role === 'ADMIN' ? '/portal/admin/dashboard' : '/portal/staff/dashboard'
      navigate(dest, { replace: true })
    }
  }, [user, loading, navigate])

  if (loading || !user || user.role === 'STUDENT') return null
  if (user.staffProfile?.phone) return null

  const profile   = user.staffProfile
  const firstName = profile?.firstName || user.email?.split('@')[0] || 'there'
  const dest      = user.role === 'ADMIN' ? '/portal/admin/dashboard' : '/portal/staff/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.phone.trim()) { setError('Phone number is required'); return }

    setSaving(true)
    setError('')
    try {
      await updateStaffProfile({
        phone:   form.phone.trim(),
        ...(form.address.trim() && { address: form.address.trim() })
      })
      await refresh()
      toast.success('Profile completed! Welcome to the portal.')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save profile. Please try again.')
      setSaving(false)
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
            <p className="text-violet-400 text-xs tracking-widest uppercase">Complete Your Profile</p>
          </div>
        </div>

        {/* Progress steps */}
        <div className="flex items-center mb-2">
          <Step n={1} state="done" />
          <div className="flex-1 h-px bg-violet-700 mx-2" />
          <Step n={2} state="active" />
          <div className="flex-1 h-px bg-[#2A2D3A] mx-2" />
          <Step n={3} state="pending" />
        </div>
        <div className="flex justify-between text-[10px] mb-8 px-0.5">
          <span className="text-violet-400 w-16 text-center">Account</span>
          <span className="text-violet-300 font-medium w-16 text-center">Profile</span>
          <span className="text-gray-600 w-16 text-center">Dashboard</span>
        </div>

        {/* Card */}
        <div className="bg-[#1A1D27] border border-[#2A2D3A] p-6">
          <h2 className="text-base font-medium text-white mb-0.5">
            Welcome, {firstName}!
          </h2>
          <p className="text-xs text-gray-500 mb-5">
            Add your contact details to complete your staff profile.
          </p>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-950/40 border border-rose-800/50 flex gap-2.5">
              <IconAlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
              <p className="text-sm text-rose-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Phone Number <span className="text-rose-400">*</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => { setForm(p => ({ ...p, phone: e.target.value })); setError('') }}
                className="w-full px-3.5 py-2.5 text-sm bg-[#0F1117] border border-[#2A2D3A] text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                placeholder="+1 555 000 0000"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Address{' '}
                <span className="text-gray-600 font-normal">(optional)</span>
              </label>
              <textarea
                value={form.address}
                onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm bg-[#0F1117] border border-[#2A2D3A] text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none"
                placeholder="123 Main Street, City"
                rows={2}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {saving
                ? <><IconSpinner size={16} /> Saving…</>
                : <><IconShield size={15} /> Save & Go to Dashboard</>}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-gray-700 mt-5">
          You can update these details from your profile page.
        </p>
      </div>
    </div>
  )
}

export default StaffCompleteProfile
