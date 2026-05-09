import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { StatCard } from '../../components/common/Card'
import { getClasses, getSubjects, getQuizzes } from '../../api/staff'
import { useAuth } from '../../context/AuthContext'
import { IconSchool, IconBook, IconClipboard, IconUsers } from '../../components/common/Icons'

const StaffDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({ classes: 0, subjects: 0, quizzes: 0, students: 0 })

  useEffect(() => {
    Promise.all([getClasses(), getSubjects(), getQuizzes()])
      .then(([c, s, q]) => {
        const classes = c.data.data
        setStats({
          classes:  classes.length,
          students: classes.reduce((acc, cls) => acc + (cls._count?.classStudents || 0), 0),
          subjects: s.data.data.length,
          quizzes:  q.data.data.length
        })
      }).catch(() => {})
  }, [])

  const profile = user?.staffProfile
  const name    = profile?.firstName || 'Teacher'

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        <div className="relative overflow-hidden p-6 border border-indigo-900/40"
          style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #0D0926 100%)' }}>
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-indigo-500/10" />
          <div className="absolute top-4 right-20 w-12 h-12 rounded-full bg-indigo-400/10" />
          <div className="relative z-10">
            <span className="inline-flex items-center text-[10px] font-medium tracking-widest uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-1 mb-3">
              Staff Portal
            </span>
            <p className="text-lg font-medium text-white">Good day, {name}</p>
            <p className="text-sm text-white/40 mt-0.5">{profile?.designation || 'Staff Member'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <StatCard label="My Classes"      value={stats.classes}  icon={IconSchool}     color="primary" />
          <StatCard label="Total Students"  value={stats.students} icon={IconUsers}      color="green"   />
          <StatCard label="Subjects"        value={stats.subjects} icon={IconBook}       color="blue"    />
          <StatCard label="Quizzes Created" value={stats.quizzes}  icon={IconClipboard}  color="purple"  />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StaffDashboard
