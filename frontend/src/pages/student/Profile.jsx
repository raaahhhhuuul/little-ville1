import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { updateProfile } from '../../api/student'
import toast from 'react-hot-toast'
import { Loader2, Save, User } from 'lucide-react'
import { formatDate } from '../../utils/helpers'

const StudentProfile = () => {
  const { user, refresh } = useAuth()
  const profile = user?.studentProfile
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    guardianName: profile?.guardianName || '',
    guardianPhone: profile?.guardianPhone || '',
    address: profile?.address || ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await updateProfile(form)
      await refresh()
      toast.success('Profile updated!')
      setEditing(false)
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSubmitting(false)
    }
  }

  const initials = `${(form.firstName || '')[0] || ''}${(form.lastName || '')[0] || ''}`.toUpperCase()

  return (
    <DashboardLayout title="My Profile">
      <div className="max-w-2xl space-y-6">
        <div className="card">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center shrink-0">
              <span className="text-primary-700 text-2xl font-bold">{initials || <User size={28} />}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{form.firstName} {form.lastName}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <span className="badge-green mt-2 inline-block">Student</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-900">Personal Information</h3>
            {!editing && (
              <button onClick={() => setEditing(true)} className="btn-secondary text-sm py-1.5 px-3">
                Edit Profile
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">First Name *</label>
                  <input className="input-field" value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} required />
                </div>
                <div>
                  <label className="label">Last Name *</label>
                  <input className="input-field" value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Guardian Name</label>
                  <input className="input-field" value={form.guardianName} onChange={e => setForm(p => ({ ...p, guardianName: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Guardian Phone</label>
                  <input className="input-field" value={form.guardianPhone} onChange={e => setForm(p => ({ ...p, guardianPhone: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="label">Address</label>
                <textarea className="input-field" rows={2} value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setEditing(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {[
                { label: 'Full Name', value: `${form.firstName} ${form.lastName}` },
                { label: 'Email', value: user?.email },
                { label: 'Guardian Name', value: form.guardianName || '—' },
                { label: 'Guardian Phone', value: form.guardianPhone || '—' },
                { label: 'Address', value: form.address || '—' },
                { label: 'Date of Birth', value: profile?.dateOfBirth ? formatDate(profile.dateOfBirth) : '—' },
                { label: 'Enrolled', value: formatDate(user?.createdAt) }
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start gap-4 py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-500 w-36 shrink-0">{label}</span>
                  <span className="text-sm text-gray-900 font-medium">{value}</span>
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
