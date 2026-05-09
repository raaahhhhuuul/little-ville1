import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import EmptyState from '../../components/common/EmptyState'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { IconCheckCircle, IconBell } from '../../components/common/Icons'
import { formatDateTime } from '../../utils/helpers'
import api from '../../api/axios'

const StaffNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading]             = useState(true)

  const load = async () => {
    try { const res = await api.get('/staff/notifications'); setNotifications(res.data.data || []) }
    catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleRead = async (n) => {
    if (n.isRead) return
    await api.patch(`/staff/notifications/${n.notificationId}/read`).catch(() => {})
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
              <div className="bg-indigo-50 border border-indigo-200 px-4 py-2.5 text-sm text-indigo-700 flex items-center gap-2">
                <IconBell size={14} strokeWidth={1.5} />
                {unread} unread notification{unread > 1 ? 's' : ''}
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
                    className={`card cursor-pointer hover:bg-gray-50 transition-colors ${
                      !n.isRead ? 'border-l-4 border-l-indigo-400' : 'opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {!n.isRead && <span className="w-1.5 h-1.5 bg-indigo-400 shrink-0" />}
                          <p className="text-sm font-medium text-gray-900">{n.notification.title}</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{n.notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1.5">{formatDateTime(n.createdAt)}</p>
                      </div>
                      {n.isRead && <IconCheckCircle size={15} className="text-emerald-500 shrink-0" strokeWidth={1.5} />}
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

export default StaffNotifications
