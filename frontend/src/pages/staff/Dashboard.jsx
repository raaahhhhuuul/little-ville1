import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { StatCard } from '../../components/common/Card'
import { getClasses, getSubjects, getQuizzes } from '../../api/staff'
import { useAuth } from '../../context/AuthContext'
import { School, BookOpen, ClipboardList, Users } from 'lucide-react'

const StaffDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({ classes: 0, subjects: 0, quizzes: 0, students: 0 })

  useEffect(() => {
    Promise.all([getClasses(), getSubjects(), getQuizzes()])
      .then(([c, s, q]) => {
        const classes = c.data.data
        const totalStudents = classes.reduce((acc, cls) => acc + (cls._count?.classStudents || 0), 0)
        setStats({ classes: classes.length, subjects: s.data.data.length, quizzes: q.data.data.length, students: totalStudents })
      })
      .catch(() => {})
  }, [])

  const profile = user?.staffProfile
  const name = profile ? `${profile.firstName} ${profile.lastName}` : 'Staff'

  return (
    <DashboardLayout title="Staff Dashboard">
      <div className="space-y-6">
        <div className="card bg-gradient-to-r from-primary-600 to-primary-700 border-0 text-white">
          <h2 className="text-xl font-bold">Welcome back, {name}!</h2>
          <p className="text-primary-100 text-sm mt-1">{profile?.designation || 'Teacher'}</p>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="My Classes" value={stats.classes} icon={School} color="primary" />
          <StatCard label="Total Students" value={stats.students} icon={Users} color="green" />
          <StatCard label="Subjects" value={stats.subjects} icon={BookOpen} color="blue" />
          <StatCard label="Quizzes Created" value={stats.quizzes} icon={ClipboardList} color="purple" />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StaffDashboard
