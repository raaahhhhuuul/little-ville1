import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { StatCard } from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getAnalytics } from '../../api/admin'
import { IconUsers, IconBook, IconSchool, IconClipboard } from '../../components/common/Icons'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { formatDate } from '../../utils/helpers'

const STATUS_COLORS = { PRESENT: '#4ADE80', ABSENT: '#F87171', LATE: '#FCD34D' }

const AdminDashboard = () => {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnalytics().then(res => setData(res.data.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const stats = data?.totals || {}

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        <div className="relative overflow-hidden p-6 border border-violet-900/40"
          style={{ background: 'linear-gradient(135deg, #170F3E 0%, #1E1552 60%, #0E0B26 100%)' }}>
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-violet-500/10" />
          <div className="absolute top-4 right-20 w-12 h-12 rounded-full bg-violet-400/10" />
          <div className="relative z-10">
            <span className="inline-flex items-center text-[10px] font-medium tracking-widest uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-1 mb-3">
              Admin Portal
            </span>
            <p className="text-lg font-medium text-white">Administrator Dashboard</p>
            <p className="text-sm text-white/40 mt-0.5">System overview for Little Ville</p>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              <StatCard label="Total Students" value={stats.students ?? 0} icon={IconUsers}     color="primary" />
              <StatCard label="Total Staff"    value={stats.staff ?? 0}    icon={IconUsers}     color="blue"    />
              <StatCard label="Total Classes"  value={stats.classes ?? 0}  icon={IconSchool}    color="green"   />
              <StatCard label="Active Quizzes" value={stats.quizzes ?? 0}  icon={IconBook}      color="purple"  />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="card">
                <p className="text-sm font-medium text-gray-900 mb-4">Attendance — Last 7 Days</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data?.attendanceByDate || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="date" tickFormatter={d => formatDate(d).slice(0, 6)} tick={{ fontSize: 11, fontFamily: 'Nunito' }} />
                    <YAxis tick={{ fontSize: 11, fontFamily: 'Nunito' }} />
                    <Tooltip contentStyle={{ fontFamily: 'Nunito', border: '1px solid #E5E7EB', borderRadius: 0 }} />
                    <Bar dataKey="PRESENT" fill="#4ADE80" />
                    <Bar dataKey="ABSENT"  fill="#F87171" />
                    <Bar dataKey="LATE"    fill="#FCD34D" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="card">
                <p className="text-sm font-medium text-gray-900 mb-4">Overall Attendance</p>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={data?.attendanceSummary || []}
                      dataKey="count" nameKey="status"
                      cx="50%" cy="50%" outerRadius={85}
                      label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                    >
                      {(data?.attendanceSummary || []).map(entry => (
                        <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#C084FC'} />
                      ))}
                    </Pie>
                    <Legend wrapperStyle={{ fontFamily: 'Nunito' }} />
                    <Tooltip contentStyle={{ fontFamily: 'Nunito', border: '1px solid #E5E7EB', borderRadius: 0 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard
