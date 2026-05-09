import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { KinderStatCard } from '../../components/common/Card'
import { getAttendance, getSubjects, getQuizzes, getNotifications } from '../../api/student'
import { useAuth } from '../../context/AuthContext'
import { IconClipboard, IconBook, IconCheckSquare, IconBell, IconStar } from '../../components/common/Icons'

const StudentDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({ attendancePct: 0, subjects: 0, pendingQuizzes: 0, unreadNotifs: 0 })

  useEffect(() => {
    Promise.all([getAttendance(), getSubjects(), getQuizzes(), getNotifications()])
      .then(([att, sub, quiz, notif]) => {
        const summary = att.data.data.summary
        setStats({
          attendancePct:  summary?.percentage || 0,
          subjects:       sub.data.data.length,
          pendingQuizzes: quiz.data.data.filter(q => !q.isSubmitted).length,
          unreadNotifs:   notif.data.data.filter(n => !n.isRead).length
        })
      }).catch(() => {})
  }, [])

  const name = user?.studentProfile?.firstName || 'Student'

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-5">
        {/* Welcome banner */}
        <div className="rounded-2xl p-6 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #FF8C42 0%, #FF6F61 60%, #FF5252 100%)' }}>
          <div className="relative z-10">
            <p className="font-display text-2xl text-white leading-tight">Hello, {name}!</p>
            <p className="text-sm text-white/80 mt-1">Here's your learning progress this month.</p>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full" />
          <div className="absolute -right-2 top-8 w-14 h-14 bg-white/10 rounded-full" />
          <div className="absolute right-20 -bottom-4 w-20 h-20 bg-white/10 rounded-full" />
          <div className="absolute -left-4 bottom-0 w-16 h-16 bg-white/08 rounded-full" />
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <KinderStatCard label="Attendance"      value={`${stats.attendancePct}%`} icon={IconClipboard}  color="green"   />
          <KinderStatCard label="Subjects"        value={stats.subjects}            icon={IconBook}        color="blue"    />
          <KinderStatCard label="Pending Quizzes" value={stats.pendingQuizzes}      icon={IconCheckSquare} color="yellow"  />
          <KinderStatCard label="Notifications"   value={stats.unreadNotifs}        icon={IconBell}        color="purple"  />
        </div>

        {/* Quick tip */}
        <div className="bg-white rounded-2xl p-4 border-2 border-amber-100 flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
            <IconStar size={16} className="text-amber-500" strokeWidth={2} />
          </div>
          <p className="text-sm text-gray-600">Keep up the great work! Check your quizzes and subjects to stay on track.</p>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StudentDashboard
