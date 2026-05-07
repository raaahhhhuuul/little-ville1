import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { StatCard } from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getAnalytics } from '../../api/admin'
import { Users, BookOpen, School, ClipboardList } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { formatDate } from '../../utils/helpers'

const COLORS = { PRESENT: '#22c55e', ABSENT: '#ef4444', LATE: '#f59e0b' }

const AdminDashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnalytics()
      .then(res => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout title="Dashboard"><LoadingSpinner fullScreen /></DashboardLayout>

  const stats = data?.totals || {}

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="Total Students" value={stats.students ?? 0} icon={Users} color="primary" />
          <StatCard label="Total Staff" value={stats.staff ?? 0} icon={Users} color="blue" />
          <StatCard label="Total Classes" value={stats.classes ?? 0} icon={School} color="green" />
          <StatCard label="Active Quizzes" value={stats.quizzes ?? 0} icon={BookOpen} color="purple" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Attendance — Last 7 Days</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data?.attendanceByDate || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tickFormatter={d => formatDate(d).slice(0, 6)} tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val, name) => [val, name]} />
                <Bar dataKey="PRESENT" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ABSENT" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="LATE" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Overall Attendance</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={data?.attendanceSummary || []}
                  dataKey="count"
                  nameKey="status"
                  cx="50%" cy="50%"
                  outerRadius={90}
                  label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                >
                  {(data?.attendanceSummary || []).map((entry) => (
                    <Cell key={entry.status} fill={COLORS[entry.status] || '#6366f1'} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard
