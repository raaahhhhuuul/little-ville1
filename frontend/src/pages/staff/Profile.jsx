import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { updateStaffProfile } from '../../api/staff'
import toast from 'react-hot-toast'
import { IconSpinner, IconSave, IconEdit } from '../../components/common/Icons'
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
    try { await updateStaffProfile(form); await refresh(); toast.success('Profile updated'); setEditing(false) }
    catch { toast.error('Failed to update profile') }
    finally { setSubmitting(false) }
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
      <div className="max-w-2xl space-y-4">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-500 flex items-center justify-center shrink-0">
              <span className="text-white text-lg font-medium">{initials || '?'}</span>
            </div>
            <div>
              <h2 className="text-base font-medium text-gray-900">{form.firstName} {form.lastName}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <span className="badge-purple mt-2">{form.designation || 'Staff Member'}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Personal Information</h3>
            {!editing && (
              <button onClick={() => setEditing(true)} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
                <IconEdit size={13} strokeWidth={1.5} /> Edit
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">First Name</label><input className="input-field" value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} required /></div>
                <div><label className="label">Last Name</label><input className="input-field" value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} required /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Designation</label><input className="input-field" value={form.designation} onChange={e => setForm(p => ({ ...p, designation: e.target.value }))} placeholder="e.g. Head Teacher" /></div>
                <div><label className="label">Phone</label><input className="input-field" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
              </div>
              <div><label className="label">Address</label><textarea className="input-field" rows={2} value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} /></div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setEditing(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-violet flex-1 flex items-center justify-center gap-2">
                  {submitting ? <><IconSpinner size={14} /> Saving...</> : <><IconSave size={14} strokeWidth={1.5} /> Save</>}
                </button>
              </div>
            </form>
          ) : (
            <div className="divide-y divide-gray-100">
              {rows.map(({ label, value }) => (
                <div key={label} className="flex items-start gap-4 py-3">
                  <span className="text-xs font-medium text-gray-500 w-32 shrink-0 pt-0.5">{label}</span>
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

export default StaffProfile
