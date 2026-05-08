import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { sendNotification } from '../../api/admin'
import toast from 'react-hot-toast'
import { Send, Loader2, Users, User, Globe } from 'lucide-react'

const targets = [
  { value: 'ALL',      label: 'Everyone',      desc: 'All students & staff', icon: Globe, emoji: '🌍', active: 'bg-violet-50 border-violet-400 text-violet-700' },
  { value: 'STAFF',    label: 'Staff Only',     desc: 'All staff members',    icon: User,  emoji: '🍎', active: 'bg-orange-50 border-orange-400 text-orange-700' },
  { value: 'STUDENTS', label: 'Students Only',  desc: 'All students',          icon: Users, emoji: '🎒', active: 'bg-sky-50 border-sky-400 text-sky-700'         }
]

const AdminNotifications = () => {
  const [form, setForm]         = useState({ title: '', message: '', target: 'ALL' })
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent]         = useState([])

  const handleSend = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await sendNotification(form)
      toast.success('Notification sent! 📣')
      setSent(prev => [{ ...form, sentAt: new Date(), id: Date.now() }, ...prev])
      setForm(p => ({ ...p, title: '', message: '' }))
    } catch { toast.error('Failed to send notification') }
    finally { setSubmitting(false) }
  }

  return (
    <DashboardLayout title="Send Notifications">
      <div className="max-w-2xl space-y-6">
        <div className="card">
          <h2 className="text-base font-bold text-violet-800 mb-5">📣 Compose Notification</h2>
          <form onSubmit={handleSend} className="space-y-5">
            <div>
              <label className="label">Target Audience *</label>
              <div className="grid grid-cols-3 gap-3">
                {targets.map(({ value, label, desc, emoji, active }) => (
                  <label key={value}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      form.target === value ? active : 'border-orange-100 bg-white hover:border-orange-200'
                    }`}>
                    <input type="radio" name="target" value={value} checked={form.target === value}
                      onChange={e => setForm(p => ({ ...p, target: e.target.value }))} className="sr-only" />
                    <span className="text-2xl">{emoji}</span>
                    <div className="text-center">
                      <p className="font-bold text-sm">{label}</p>
                      <p className="text-xs opacity-70 mt-0.5">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Title *</label>
              <input className="input-field" value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="Notification title..." required />
            </div>

            <div>
              <label className="label">Message *</label>
              <textarea className="input-field" rows={4} value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                placeholder="Write your message here..." required />
            </div>

            <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {submitting ? 'Sending...' : 'Send Notification'}
            </button>
          </form>
        </div>

        {sent.length > 0 && (
          <div className="card">
            <h3 className="text-base font-bold text-violet-800 mb-4">✅ Recently Sent</h3>
            <div className="space-y-3">
              {sent.map(n => (
                <div key={n.id} className="bg-amber-50 border-2 border-amber-100 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-sm text-gray-800">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                    </div>
                    <span className="text-xs bg-violet-100 text-violet-700 font-bold px-3 py-1 rounded-full border border-violet-200 shrink-0">
                      {n.target}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 font-medium">{n.sentAt.toLocaleTimeString()}</p>
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
