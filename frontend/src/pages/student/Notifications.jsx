import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import EmptyState from '../../components/common/EmptyState'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getNotifications, markNotificationRead } from '../../api/student'
import { CheckCircle } from 'lucide-react'
import { formatDateTime } from '../../utils/helpers'

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading]             = useState(true)

  const load = async () => {
    try { const res = await getNotifications(); setNotifications(res.data.data) }
    catch {} finally { setLoading(false) }
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
          <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl px-5 py-3 text-sm font-bold text-orange-700 flex items-center gap-2">
            🔔 {unread} unread notification{unread > 1 ? 's' : ''}
          </div>
        )}
        {notifications.length === 0 ? (
          <EmptyState message="No notifications yet" emoji="🔔" />
        ) : (
          <div className="space-y-3">
            {notifications.map(n => (
              <div key={n.id} onClick={() => handleRead(n)}
                className={`card cursor-pointer hover:shadow-md transition-all duration-200 ${
                  !n.isRead ? 'border-l-4 border-l-orange-400' : 'opacity-70'
                }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {!n.isRead && <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />}
                      <p className="font-bold text-gray-800 text-sm">{n.notification.title}</p>
                    </div>
                    <p className="text-gray-600 text-sm mt-1 font-medium">{n.notification.message}</p>
                    <p className="text-xs text-gray-400 mt-2 font-medium">{formatDateTime(n.createdAt)}</p>
                  </div>
                  {n.isRead && <CheckCircle size={16} className="text-emerald-500 shrink-0" />}
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
