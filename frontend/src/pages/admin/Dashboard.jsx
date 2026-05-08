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

const STATUS_COLORS = { PRESENT: '#4ADE80', ABSENT: '#F87171', LATE: '#FCD34D' }

const AdminDashboard = () => {
  const [data, setData]       = useState(null)
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
        {/* Welcome banner */}
        <div className="rounded-3xl p-6 text-white shadow-lg"
          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)' }}>
          <p className="font-display text-3xl">Welcome back, Admin! 👑</p>
          <p className="text-white/70 text-sm mt-1 font-semibold">Here's what's happening at Little Ville today</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="Total Students" value={stats.students ?? 0} icon={Users}         color="primary" />
          <StatCard label="Total Staff"    value={stats.staff ?? 0}    icon={Users}         color="blue"    />
          <StatCard label="Total Classes"  value={stats.classes ?? 0}  icon={School}        color="green"   />
          <StatCard label="Active Quizzes" value={stats.quizzes ?? 0}  icon={BookOpen}      color="purple"  />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-base font-bold text-violet-800 mb-4">📅 Attendance — Last 7 Days</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data?.attendanceByDate || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FDE68A" />
                <XAxis dataKey="date" tickFormatter={d => formatDate(d).slice(0, 6)} tick={{ fontSize: 11, fontFamily: 'Nunito', fontWeight: 700 }} />
                <YAxis tick={{ fontSize: 11, fontFamily: 'Nunito' }} />
                <Tooltip contentStyle={{ borderRadius: 16, border: '2px solid #FDE68A', fontFamily: 'Nunito', fontWeight: 600 }} />
                <Bar dataKey="PRESENT" fill="#4ADE80" radius={[6, 6, 0, 0]} />
                <Bar dataKey="ABSENT"  fill="#F87171" radius={[6, 6, 0, 0]} />
                <Bar dataKey="LATE"    fill="#FCD34D" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="text-base font-bold text-violet-800 mb-4">🥧 Overall Attendance</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={data?.attendanceSummary || []}
                  dataKey="count" nameKey="status"
                  cx="50%" cy="50%" outerRadius={90}
                  label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                >
                  {(data?.attendanceSummary || []).map(entry => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#C084FC'} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontFamily: 'Nunito', fontWeight: 700 }} />
                <Tooltip contentStyle={{ borderRadius: 16, border: '2px solid #FDE68A', fontFamily: 'Nunito' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard
