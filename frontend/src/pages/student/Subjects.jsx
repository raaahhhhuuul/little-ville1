import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { getSubjects } from '../../api/student'

const subjectColors = [
  { bg: 'from-orange-400 to-amber-500',  light: 'bg-orange-50 border-orange-200',  text: 'text-orange-700'  },
  { bg: 'from-sky-400 to-blue-500',      light: 'bg-sky-50 border-sky-200',        text: 'text-sky-700'     },
  { bg: 'from-emerald-400 to-teal-500',  light: 'bg-emerald-50 border-emerald-200',text: 'text-emerald-700' },
  { bg: 'from-violet-400 to-purple-500', light: 'bg-violet-50 border-violet-200',  text: 'text-violet-700'  },
  { bg: 'from-rose-400 to-pink-500',     light: 'bg-rose-50 border-rose-200',      text: 'text-rose-700'    },
  { bg: 'from-amber-400 to-yellow-500',  light: 'bg-amber-50 border-amber-200',    text: 'text-amber-700'   },
]

const subjectEmojis = ['📐', '📚', '🔬', '🎨', '🌍', '🎵', '💻', '⚽', '🧪', '📖']

const StudentSubjects = () => {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    getSubjects()
      .then(res => setSubjects(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout title="My Subjects"><LoadingSpinner fullScreen /></DashboardLayout>

  return (
    <DashboardLayout title="My Subjects">
      <div className="space-y-5">
        {/* Summary */}
        <div className="card flex items-center gap-4 py-4">
          <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-md">
            <span className="text-2xl">📚</span>
          </div>
          <div>
            <p className="text-3xl font-black text-gray-800">{subjects.length}</p>
            <p className="text-sm font-semibold text-gray-500">Enrolled Subjects</p>
          </div>
        </div>

        {subjects.length === 0 ? (
          <EmptyState message="No subjects enrolled yet" emoji="📚" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {subjects.map((subject, idx) => {
              const color = subjectColors[idx % subjectColors.length]
              const emoji = subjectEmojis[idx % subjectEmojis.length]
              return (
                <div key={subject.id} className="card hover:scale-[1.02] transition-transform duration-200">
                  {/* Header */}
                  <div className={`w-full h-2 rounded-full bg-gradient-to-r ${color.bg} mb-4`} />
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${color.bg} rounded-2xl flex items-center justify-center shadow-md shrink-0`}>
                      <span className="text-xl">{emoji}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-gray-800 truncate">{subject.name}</h3>
                      {subject.description && (
                        <p className="text-xs text-gray-500 mt-0.5 font-medium line-clamp-2">{subject.description}</p>
                      )}
                    </div>
                  </div>
                  {subject.class && (
                    <div className={`mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${color.light} ${color.text}`}>
                      🏫 {subject.class.name} · Grade {subject.class.grade}
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
