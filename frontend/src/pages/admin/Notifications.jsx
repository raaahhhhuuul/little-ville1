import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { sendNotification } from '../../api/admin'
import toast from 'react-hot-toast'
import { IconSend, IconSpinner, IconUsers, IconUser, IconGlobe } from '../../components/common/Icons'

const targets = [
  { value: 'ALL',      label: 'Everyone',     desc: 'All students & staff', icon: IconGlobe, activeClass: 'border-violet-400 bg-violet-50 text-violet-700' },
  { value: 'STAFF',    label: 'Staff Only',   desc: 'All staff members',    icon: IconUser,  activeClass: 'border-indigo-400 bg-indigo-50 text-indigo-700'  },
  { value: 'STUDENTS', label: 'Students',     desc: 'All students',         icon: IconUsers, activeClass: 'border-sky-400 bg-sky-50 text-sky-700'           }
]

const AdminNotifications = () => {
  const [form, setForm]         = useState({ title: '', message: '', target: 'ALL' })
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent]         = useState([])

  const handleSend = async (e) => {
    e.preventDefault(); setSubmitting(true)
    try {
      await sendNotification(form)
      toast.success('Notification sent')
      setSent(prev => [{ ...form, sentAt: new Date(), id: Date.now() }, ...prev])
      setForm(p => ({ ...p, title: '', message: '' }))
    } catch { toast.error('Failed to send notification') }
    finally { setSubmitting(false) }
  }

  return (
    <DashboardLayout title="Send Notifications">
      <div className="max-w-2xl space-y-5">
        <div className="card">
          <p className="text-sm font-medium text-gray-900 mb-4">Compose Notification</p>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="label">Target Audience</label>
              <div className="grid grid-cols-3 gap-2">
                {targets.map(({ value, label, desc, icon: Icon, activeClass }) => (
                  <label
                    key={value}
                    className={`flex flex-col items-center gap-2 p-3.5 border-2 cursor-pointer transition-colors ${
                      form.target === value ? activeClass : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <input type="radio" name="target" value={value} checked={form.target === value}
                      onChange={e => setForm(p => ({ ...p, target: e.target.value }))} className="sr-only" />
                    <Icon size={18} strokeWidth={1.5} />
                    <div className="text-center">
                      <p className="text-xs font-medium">{label}</p>
                      <p className="text-[10px] opacity-60 mt-0.5">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Title</label>
              <input className="input-field" value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="Notification title..." required />
            </div>

            <div>
              <label className="label">Message</label>
              <textarea className="input-field" rows={4} value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                placeholder="Write your message here..." required />
            </div>

            <button type="submit" disabled={submitting} className="btn-violet flex items-center gap-2">
              {submitting ? <><IconSpinner size={15} /> Sending...</> : <><IconSend size={15} strokeWidth={1.5} /> Send Notification</>}
            </button>
          </form>
        </div>

        {sent.length > 0 && (
          <div className="card">
            <p className="text-sm font-medium text-gray-900 mb-3">Recently Sent</p>
            <div className="space-y-2">
              {sent.map(n => (
                <div key={n.id} className="border border-gray-200 p-3.5 bg-gray-50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                    </div>
                    <span className="badge-purple shrink-0">{n.target}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{n.sentAt.toLocaleTimeString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default AdminNotifications
