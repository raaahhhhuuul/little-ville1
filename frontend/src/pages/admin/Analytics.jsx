import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { StatCard } from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getAnalytics } from '../../api/admin'
import { IconUsers, IconSchool, IconBook, IconClipboard } from '../../components/common/Icons'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts'
import { formatDate } from '../../utils/helpers'

const COLORS      = ['#4ADE80', '#F87171', '#FCD34D']
const tooltipStyle = { border: '1px solid #E5E7EB', fontFamily: 'Nunito', borderRadius: 0 }
const tickStyle    = { fontSize: 11, fontFamily: 'Nunito' }

const AdminAnalytics = () => {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { getAnalytics().then(res => setData(res.data.data)).finally(() => setLoading(false)) }, [])

  const stats = data?.totals || {}

  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-6">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              <StatCard label="Students" value={stats.students ?? 0} icon={IconUsers}    color="primary" />
              <StatCard label="Staff"    value={stats.staff ?? 0}    icon={IconUsers}    color="blue"    />
              <StatCard label="Classes"  value={stats.classes ?? 0}  icon={IconSchool}   color="green"   />
              <StatCard label="Quizzes"  value={stats.quizzes ?? 0}  icon={IconBook}     color="purple"  />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="card">
                <p className="text-sm font-medium text-gray-900 mb-4">Daily Attendance Trend</p>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={data?.attendanceByDate || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="date" tickFormatter={d => formatDate(d).slice(0, 6)} tick={tickStyle} />
                    <YAxis tick={tickStyle} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="PRESENT" stroke="#4ADE80" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="ABSENT"  stroke="#F87171" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="LATE"    stroke="#FCD34D" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="card">
                <p className="text-sm font-medium text-gray-900 mb-4">Attendance Breakdown</p>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={data?.attendanceSummary || []}
                      dataKey="count" nameKey="status"
                      cx="50%" cy="50%" outerRadius={95}
                      label={({ status, count }) => `${status}: ${count}`}
                    >
                      {(data?.attendanceSummary || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Legend wrapperStyle={{ fontFamily: 'Nunito' }} />
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <p className="text-sm font-medium text-gray-900 mb-4">Weekly Attendance Comparison</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data?.attendanceByDate || []} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="date" tickFormatter={d => formatDate(d).slice(0, 6)} tick={tickStyle} />
                  <YAxis tick={tickStyle} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontFamily: 'Nunito' }} />
                  <Bar dataKey="PRESENT" fill="#4ADE80" />
                  <Bar dataKey="ABSENT"  fill="#F87171" />
                  <Bar dataKey="LATE"    fill="#FCD34D" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default AdminAnalytics
