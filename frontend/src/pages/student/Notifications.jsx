import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import EmptyState from '../../components/common/EmptyState'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getNotifications, markNotificationRead } from '../../api/student'
import { IconCheckCircle, IconBell } from '../../components/common/Icons'
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

  const unread = notifications.filter(n => !n.isRead).length

  return (
    <DashboardLayout title="Notifications">
      <div className="max-w-2xl space-y-4">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {unread > 0 && (
              <div className="bg-orange-400 rounded-2xl px-5 py-3 text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-white/25 rounded-full flex items-center justify-center shrink-0">
                  <IconBell size={15} className="text-white" strokeWidth={2} />
                </div>
                <p className="text-sm font-medium">{unread} unread notification{unread > 1 ? 's' : ''}</p>
              </div>
            )}
            {notifications.length === 0 ? (
              <EmptyState message="No notifications yet" icon={IconBell} />
            ) : (
              <div className="space-y-2">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => handleRead(n)}
                    className={`bg-white rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md border-2 ${
                      !n.isRead ? 'border-orange-300' : 'border-gray-100'
                    } ${n.isRead ? 'opacity-80' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${!n.isRead ? 'bg-orange-100' : 'bg-gray-100'}`}>
                          <IconBell size={15} className={!n.isRead ? 'text-orange-500' : 'text-gray-400'} strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{n.notification.title}</p>
                          <p className="text-sm text-gray-600 mt-0.5">{n.notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1.5">{formatDateTime(n.createdAt)}</p>
                        </div>
                      </div>
                      {n.isRead && (
                        <IconCheckCircle size={16} className="text-emerald-400 shrink-0 mt-1" strokeWidth={2} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default StudentNotifications
