import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import EmptyState from '../../components/common/EmptyState'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getSubjects } from '../../api/student'
import { BookOpen, User } from 'lucide-react'

const StudentSubjects = () => {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSubjects()
      .then(res => setSubjects(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout title="My Subjects"><LoadingSpinner fullScreen /></DashboardLayout>

  return (
    <DashboardLayout title="My Subjects">
      {subjects.length === 0 ? (
        <EmptyState message="No subjects assigned yet" icon={BookOpen} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {subjects.map(s => (
            <div key={s.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-primary-100 rounded-xl">
                  <BookOpen size={20} className="text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{s.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{s.class?.name}</p>
                  {s.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{s.description}</p>}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <User size={13} />
                {s.staff ? `${s.staff.firstName} ${s.staff.lastName}` : 'No teacher assigned'}
              </div>
              {s.quizzes?.length > 0 && (
                <div className="mt-2 flex items-center gap-1">
                  <span className="badge-blue">{s.quizzes.length} quiz{s.quizzes.length > 1 ? 'zes' : ''}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

export default StudentSubjects
