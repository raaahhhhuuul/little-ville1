import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import EmptyState from '../../components/common/EmptyState'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getNotifications, markNotificationRead } from '../../api/student'
import { Bell, CheckCircle } from 'lucide-react'
import { formatDateTime } from '../../utils/helpers'

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const res = await getNotifications()
      setNotifications(res.data.data)
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleRead = async (n) => {
    if (n.isRead) return
    await markNotificationRead(n.notificationId).catch(() => {})
    load()
  }

  if (loading) return <DashboardLayout title="Notifications"><LoadingSpinner fullScreen /></DashboardLayout>

  const unread = notifications.filter(n => !n.isRead).length

  return (
    <DashboardLayout title="Notifications">
      <div className="max-w-2xl space-y-4">
        {unread > 0 && (
          <div className="bg-primary-50 border border-primary-200 rounded-xl px-4 py-3 text-sm text-primary-700 font-medium">
            {unread} unread notification{unread > 1 ? 's' : ''}
          </div>
        )}
        {notifications.length === 0 ? (
          <EmptyState message="No notifications" icon={Bell} />
        ) : (
          <div className="space-y-3">
            {notifications.map(n => (
              <div
                key={n.id}
                onClick={() => handleRead(n)}
                className={`card cursor-pointer hover:shadow-md transition-all ${!n.isRead ? 'border-l-4 border-l-primary-500' : 'opacity-75'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{n.notification.title}</p>
                    <p className="text-gray-600 text-sm mt-1">{n.notification.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{formatDateTime(n.createdAt)}</p>
                  </div>
                  {n.isRead && <CheckCircle size={16} className="text-green-500 shrink-0" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default StudentNotifications
