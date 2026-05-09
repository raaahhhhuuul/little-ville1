import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { updateProfile } from '../../api/student'
import toast from 'react-hot-toast'
import { IconSpinner, IconSave, IconEdit, IconUser } from '../../components/common/Icons'
import { formatDate } from '../../utils/helpers'

const StudentProfile = () => {
  const { user, refresh } = useAuth()
  const profile = user?.studentProfile
  const [editing, setEditing]       = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    firstName:     profile?.firstName     || '',
    lastName:      profile?.lastName      || '',
    guardianName:  profile?.guardianName  || '',
    guardianPhone: profile?.guardianPhone || '',
    address:       profile?.address       || ''
  })

  const handleSave = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try { await updateProfile(form); await refresh(); toast.success('Profile updated'); setEditing(false) }
    catch { toast.error('Failed to update profile') }
    finally { setSubmitting(false) }
  }

  const initials = `${(form.firstName || '')[0] || ''}${(form.lastName || '')[0] || ''}`.toUpperCase()

  const rows = [
    { label: 'Full Name',      value: `${form.firstName} ${form.lastName}` },
    { label: 'Email',          value: user?.email },
    { label: 'Guardian Name',  value: form.guardianName  || '—' },
    { label: 'Guardian Phone', value: form.guardianPhone || '—' },
    { label: 'Address',        value: form.address       || '—' },
    { label: 'Date of Birth',  value: profile?.dateOfBirth ? formatDate(profile.dateOfBirth) : '—' },
    { label: 'Enrolled',       value: formatDate(user?.createdAt) }
  ]

  return (
    <DashboardLayout title="My Profile">
      <div className="max-w-2xl space-y-4">
        {/* Avatar card */}
        <div className="bg-white rounded-2xl p-6 border-2 border-orange-100">
          <div className="flex items-center gap-5">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center shrink-0 shadow-md"
              style={{ background: 'linear-gradient(135deg, #FF8C42 0%, #FF6F61 100%)' }}
            >
              {initials
                ? <span className="text-white text-2xl font-medium">{initials}</span>
                : <IconUser size={30} className="text-white" strokeWidth={2} />
              }
            </div>
            <div>
              <h2 className="font-display text-xl text-gray-900">{form.firstName} {form.lastName}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
              <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                Student
              </span>
            </div>
          </div>
        </div>

        {/* Info card */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Personal Information</h3>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-orange-500 hover:text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full transition-colors"
              >
                <IconEdit size={12} strokeWidth={2} /> Edit
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">First Name</label>
                  <input className="input-field rounded-xl" value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} required />
                </div>
                <div>
                  <label className="label">Last Name</label>
                  <input className="input-field rounded-xl" value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Guardian Name</label>
                  <input className="input-field rounded-xl" value={form.guardianName} onChange={e => setForm(p => ({ ...p, guardianName: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Guardian Phone</label>
                  <input className="input-field rounded-xl" value={form.guardianPhone} onChange={e => setForm(p => ({ ...p, guardianPhone: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="label">Address</label>
                <textarea className="input-field rounded-xl" rows={2} value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setEditing(false)} className="btn-secondary flex-1 rounded-full">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2 rounded-full">
                  {submitting ? <><IconSpinner size={14} /> Saving...</> : <><IconSave size={14} strokeWidth={2} /> Save</>}
                </button>
              </div>
            </form>
          ) : (
            <div className="divide-y divide-gray-100">
              {rows.map(({ label, value }) => (
                <div key={label} className="flex items-start gap-4 py-3">
                  <span className="text-xs font-medium text-gray-400 w-32 shrink-0 pt-0.5">{label}</span>
                  <span className="text-sm text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StudentProfile
