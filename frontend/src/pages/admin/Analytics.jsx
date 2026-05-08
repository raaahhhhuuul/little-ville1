import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { StatCard } from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getAnalytics } from '../../api/admin'
import { Users, School, BookOpen, ClipboardList } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts'
import { formatDate } from '../../utils/helpers'

const COLORS = ['#4ADE80', '#F87171', '#FCD34D']

const tooltipStyle = { borderRadius: 16, border: '2px solid #FDE68A', fontFamily: 'Nunito', fontWeight: 600 }
const tickStyle    = { fontSize: 11, fontFamily: 'Nunito', fontWeight: 700 }

const AdminAnalytics = () => {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { getAnalytics().then(res => setData(res.data.data)).finally(() => setLoading(false)) }, [])

  if (loading) return <DashboardLayout title="Analytics"><LoadingSpinner fullScreen /></DashboardLayout>

  const stats = data?.totals || {}

  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-6">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="Students" value={stats.students ?? 0} icon={Users}        color="primary" />
          <StatCard label="Staff"    value={stats.staff ?? 0}    icon={Users}        color="blue"    />
          <StatCard label="Classes"  value={stats.classes ?? 0}  icon={School}       color="green"   />
          <StatCard label="Quizzes"  value={stats.quizzes ?? 0}  icon={BookOpen}     color="purple"  />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-base font-bold text-violet-800 mb-4">📈 Daily Attendance Trend</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data?.attendanceByDate || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FDE68A" />
                <XAxis dataKey="date" tickFormatter={d => formatDate(d).slice(0, 6)} tick={tickStyle} />
                <YAxis tick={tickStyle} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="PRESENT" stroke="#4ADE80" strokeWidth={3} dot={{ r: 5, fill: '#4ADE80' }} />
                <Line type="monotone" dataKey="ABSENT"  stroke="#F87171" strokeWidth={3} dot={{ r: 5, fill: '#F87171' }} />
                <Line type="monotone" dataKey="LATE"    stroke="#FCD34D" strokeWidth={3} dot={{ r: 5, fill: '#FCD34D' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="text-base font-bold text-violet-800 mb-4">🥧 Attendance Breakdown</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={data?.attendanceSummary || []} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={100}
                  label={({ status, count }) => `${status}: ${count}`}>
                  {(data?.attendanceSummary || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend wrapperStyle={{ fontFamily: 'Nunito', fontWeight: 700 }} />
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-base font-bold text-violet-800 mb-4">📊 Weekly Attendance Comparison</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data?.attendanceByDate || []} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#FDE68A" />
              <XAxis dataKey="date" tickFormatter={d => formatDate(d).slice(0, 6)} tick={tickStyle} />
              <YAxis tick={tickStyle} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontFamily: 'Nunito', fontWeight: 700 }} />
              <Bar dataKey="PRESENT" fill="#4ADE80" radius={[6, 6, 0, 0]} />
              <Bar dataKey="ABSENT"  fill="#F87171" radius={[6, 6, 0, 0]} />
              <Bar dataKey="LATE"    fill="#FCD34D" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminAnalytics
