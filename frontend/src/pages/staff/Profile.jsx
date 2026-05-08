import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { updateStaffProfile } from '../../api/staff'
import toast from 'react-hot-toast'
import { Loader2, Save, Edit2 } from 'lucide-react'
import { formatDate } from '../../utils/helpers'

const StaffProfile = () => {
  const { user, refresh } = useAuth()
  const profile = user?.staffProfile
  const [editing, setEditing]       = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    firstName:   profile?.firstName   || '',
    lastName:    profile?.lastName    || '',
    designation: profile?.designation || '',
    phone:       profile?.phone       || '',
    address:     profile?.address     || ''
  })

  const handleSave = async (e) => {
    e.preventDefault(); setSubmitting(true)
    try {
      await updateStaffProfile(form)
      await refresh()
      toast.success('Profile updated! ✅')
      setEditing(false)
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSubmitting(false)
    }
  }

  const initials = `${(form.firstName || '')[0] || ''}${(form.lastName || '')[0] || ''}`.toUpperCase()

  const rows = [
    { label: 'Full Name',    value: `${form.firstName} ${form.lastName}` },
    { label: 'Email',        value: user?.email },
    { label: 'Designation',  value: form.designation || '—' },
    { label: 'Phone',        value: form.phone       || '—' },
    { label: 'Address',      value: form.address     || '—' },
    { label: 'Member Since', value: formatDate(user?.createdAt) }
  ]

  return (
    <DashboardLayout title="My Profile">
      <div className="max-w-2xl space-y-6">
        {/* Avatar card */}
        <div className="card">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-rose-500 rounded-3xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-200">
              <span className="text-white text-2xl font-black">{initials || '🍎'}</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-800">{form.firstName} {form.lastName}</h2>
              <p className="text-gray-500 text-sm font-medium">{user?.email}</p>
              <span className="badge-orange mt-2 inline-flex">🍎 {form.designation || 'Staff'}</span>
            </div>
          </div>
        </div>

        {/* Info card */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-violet-800">📋 Personal Information</h3>
            {!editing && (
              <button onClick={() => setEditing(true)} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
                <Edit2 size={14} /> Edit Profile
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">First Name *</label>
                  <input className="input-field" value={form.firstName}
                    onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} required />
                </div>
                <div>
                  <label className="label">Last Name *</label>
                  <input className="input-field" value={form.lastName}
                    onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Designation</label>
                  <input className="input-field" value={form.designation}
                    onChange={e => setForm(p => ({ ...p, designation: e.target.value }))}
                    placeholder="e.g. Head Teacher" />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input className="input-field" value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+1 234 567 8900" />
                </div>
              </div>
              <div>
                <label className="label">Address</label>
                <textarea className="input-field" rows={2} value={form.address}
                  onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setEditing(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {submitting
                    ? <><Loader2 size={14} className="animate-spin" /> Saving...</>
                    : <><Save size={14} /> Save</>}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-0">
              {rows.map(({ label, value }) => (
                <div key={label} className="flex items-start gap-4 py-3 border-b-2 border-orange-50 last:border-0">
                  <span className="text-sm font-bold text-violet-600 w-36 shrink-0">{label}</span>
                  <span className="text-sm text-gray-700 font-medium">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StaffProfile
