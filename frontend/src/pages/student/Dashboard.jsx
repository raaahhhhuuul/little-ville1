import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { StatCard } from '../../components/common/Card'
import { getAttendance, getSubjects, getQuizzes, getNotifications } from '../../api/student'
import { useAuth } from '../../context/AuthContext'
import { ClipboardList, BookOpen, CheckSquare, Bell } from 'lucide-react'

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

  const profile  = user?.studentProfile
  const name     = profile ? profile.firstName : 'Student'

  return (
    <DashboardLayout title="My Dashboard">
      <div className="space-y-6">
        <div className="rounded-3xl p-6 text-white shadow-lg relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #38BDF8 0%, #6366F1 100%)' }}>
          <div className="relative z-10">
            <p className="font-display text-3xl">Hello, {name}! 🎒</p>
            <p className="text-white/75 text-sm mt-1 font-semibold">Keep up the great work — you're doing amazing!</p>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full" />
          <div className="absolute -right-2 bottom-2 w-16 h-16 bg-white/10 rounded-full" />
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="Attendance"       value={`${stats.attendancePct}%`} icon={ClipboardList} color="green"   />
          <StatCard label="Subjects"         value={stats.subjects}            icon={BookOpen}      color="blue"    />
          <StatCard label="Pending Quizzes"  value={stats.pendingQuizzes}      icon={CheckSquare}   color="yellow"  />
          <StatCard label="Notifications"    value={stats.unreadNotifs}        icon={Bell}          color="purple"  />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StudentDashboard
