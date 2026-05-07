import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { sendNotification } from '../../api/admin'
import toast from 'react-hot-toast'
import { Send, Loader2, Users, User, Globe } from 'lucide-react'

const targets = [
  { value: 'ALL', label: 'Everyone', description: 'All students and staff', icon: Globe, color: 'primary' },
  { value: 'STAFF', label: 'Staff Only', description: 'All staff members', icon: User, color: 'blue' },
  { value: 'STUDENTS', label: 'Students Only', description: 'All students', icon: Users, color: 'green' }
]

const AdminNotifications = () => {
  const [form, setForm] = useState({ title: '', message: '', target: 'ALL' })
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState([])

  const handleSend = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await sendNotification(form)
      toast.success('Notification sent successfully!')
      setSent(prev => [{ ...form, sentAt: new Date(), id: Date.now() }, ...prev])
      setForm(p => ({ ...p, title: '', message: '' }))
    } catch {
      toast.error('Failed to send notification')
    } finally {
      setSubmitting(false)
    }
  }

  const colorMap = { primary: 'bg-primary-50 border-primary-200 text-primary-700', blue: 'bg-blue-50 border-blue-200 text-blue-700', green: 'bg-green-50 border-green-200 text-green-700' }

  return (
    <DashboardLayout title="Send Notifications">
      <div className="max-w-2xl space-y-6">
        <div className="card">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Compose Notification</h2>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="label">Target Audience *</label>
              <div className="grid grid-cols-3 gap-3">
                {targets.map(({ value, label, description, icon: Icon, color }) => (
                  <label
                    key={value}
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      form.target === value
                        ? `${colorMap[color]} border-current`
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="target"
                      value={value}
                      checked={form.target === value}
                      onChange={e => setForm(p => ({ ...p, target: e.target.value }))}
                      className="sr-only"
                    />
                    <Icon size={22} />
                    <div className="text-center">
                      <p className="font-medium text-sm">{label}</p>
                      <p className="text-xs opacity-70">{description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Title *</label>
              <input
                className="input-field"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="Notification title..."
                required
              />
            </div>

            <div>
              <label className="label">Message *</label>
              <textarea
                className="input-field"
                rows={4}
                value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                placeholder="Write your message here..."
                required
              />
            </div>

            <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {submitting ? 'Sending...' : 'Send Notification'}
            </button>
          </form>
        </div>

        {sent.length > 0 && (
          <div className="card">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Recently Sent</h3>
            <div className="space-y-3">
              {sent.map(n => (
                <div key={n.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                    </div>
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full ml-2 shrink-0">{n.target}</span>
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
