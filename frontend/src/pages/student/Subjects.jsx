import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { getSubjects } from '../../api/student'
import { IconBook } from '../../components/common/Icons'

const palette = [
  { border: 'border-orange-300',  icon: 'bg-orange-100',  iconText: 'text-orange-500',  badge: 'bg-orange-50 text-orange-700'   },
  { border: 'border-sky-300',     icon: 'bg-sky-100',     iconText: 'text-sky-500',     badge: 'bg-sky-50 text-sky-700'         },
  { border: 'border-emerald-300', icon: 'bg-emerald-100', iconText: 'text-emerald-500', badge: 'bg-emerald-50 text-emerald-700' },
  { border: 'border-violet-300',  icon: 'bg-violet-100',  iconText: 'text-violet-500',  badge: 'bg-violet-50 text-violet-700'   },
  { border: 'border-rose-300',    icon: 'bg-rose-100',    iconText: 'text-rose-500',    badge: 'bg-rose-50 text-rose-700'       },
  { border: 'border-amber-300',   icon: 'bg-amber-100',   iconText: 'text-amber-500',   badge: 'bg-amber-50 text-amber-700'     },
]

const StudentSubjects = () => {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    getSubjects()
      .then(res => setSubjects(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout title="My Subjects">
      <div className="space-y-5">
        {/* Header stat */}
        <div className="bg-white rounded-2xl p-5 flex items-center gap-4 border-2 border-sky-100">
          <div className="w-12 h-12 bg-sky-400 rounded-full flex items-center justify-center shrink-0">
            <IconBook size={22} className="text-white" strokeWidth={2} />
          </div>
          <div>
            <p className="font-display text-3xl text-sky-500 leading-none">{subjects.length}</p>
            <p className="text-sm text-gray-500 mt-0.5">Enrolled Subjects</p>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : subjects.length === 0 ? (
          <EmptyState message="No subjects enrolled yet" icon={IconBook} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {subjects.map((subject, idx) => {
              const c = palette[idx % palette.length]
              return (
                <div key={subject.id} className={`bg-white rounded-2xl p-5 border-2 ${c.border} hover:shadow-md transition-shadow`}>
                  <div className={`w-10 h-10 ${c.icon} rounded-full flex items-center justify-center mb-3`}>
                    <IconBook size={18} className={c.iconText} strokeWidth={2} />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 truncate">{subject.name}</h3>
                  {subject.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{subject.description}</p>
                  )}
                  {subject.class && (
                    <div className={`mt-3 inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${c.badge}`}>
                      {subject.class.name} · Grade {subject.class.grade}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default StudentSubjects
