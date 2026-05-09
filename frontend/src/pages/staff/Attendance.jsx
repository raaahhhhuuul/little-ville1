import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { getClasses, markAttendance, getClassAttendance } from '../../api/staff'
import toast from 'react-hot-toast'
import { IconSave, IconSpinner, IconUsers } from '../../components/common/Icons'

const STATUS_STYLES = {
  PRESENT: { active: 'bg-emerald-50 border-emerald-400 text-emerald-700', label: 'P' },
  ABSENT:  { active: 'bg-rose-50 border-rose-400 text-rose-700',          label: 'A' },
  LATE:    { active: 'bg-amber-50 border-amber-400 text-amber-700',        label: 'L' }
}

const StaffAttendance = () => {
  const [classes, setClasses]               = useState([])
  const [selectedClass, setSelectedClass]   = useState('')
  const [date, setDate]                     = useState(new Date().toISOString().slice(0, 10))
  const [students, setStudents]             = useState([])
  const [attendance, setAttendance]         = useState({})
  const [loading, setLoading]               = useState(true)
  const [submitting, setSubmitting]         = useState(false)
  const [loadingStudents, setLoadingStudents] = useState(false)

  useEffect(() => {
    getClasses()
      .then(res => { setClasses(res.data.data); if (res.data.data.length > 0) setSelectedClass(res.data.data[0].id) })
      .catch(() => toast.error('Failed to load classes'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedClass) return
    const cls = classes.find(c => c.id === selectedClass)
    if (!cls) return
    const studentsInClass = cls.classStudents?.map(cs => cs.student) || []
    setStudents(studentsInClass)
    const defaultAtt = {}
    studentsInClass.forEach(s => { defaultAtt[s.id] = 'PRESENT' })
    setAttendance(defaultAtt)
    setLoadingStudents(true)
    getClassAttendance(selectedClass, date)
      .then(res => { const ex = {}; res.data.data.forEach(r => { ex[r.studentId] = r.status }); setAttendance(prev => ({ ...prev, ...ex })) })
      .catch(() => {}).finally(() => setLoadingStudents(false))
  }, [selectedClass, date, classes])

  const handleSave = async () => {
    setSubmitting(true)
    try {
      await markAttendance({ classId: selectedClass, attendances: students.map(s => ({ studentId: s.id, date, status: attendance[s.id] || 'PRESENT' })) })
      toast.success('Attendance saved')
    } catch { toast.error('Failed to save attendance') }
    finally { setSubmitting(false) }
  }

  const counts = {
    P: Object.values(attendance).filter(s => s === 'PRESENT').length,
    A: Object.values(attendance).filter(s => s === 'ABSENT').length,
    L: Object.values(attendance).filter(s => s === 'LATE').length
  }

  return (
    <DashboardLayout title="Mark Attendance">
      <div className="space-y-5">
        <div className="card">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="label">Class</label>
              <select className="input-field" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name} (Grade {c.grade})</option>)}
              </select>
            </div>
            <div>
              <label className="label">Date</label>
              <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : loadingStudents ? (
          <LoadingSpinner />
        ) : students.length === 0 ? (
          <EmptyState message="No students enrolled in this class" icon={IconUsers} />
        ) : (
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{students.length} students</span>
              <div className="flex gap-2">
                <span className="badge-green">{counts.P} Present</span>
                <span className="badge-red">{counts.A} Absent</span>
                <span className="badge-yellow">{counts.L} Late</span>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {students.map(s => (
                <div key={s.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-medium shrink-0">
                      {s.firstName[0]}{s.lastName[0]}
                    </div>
                    <span className="text-sm text-gray-800">{s.firstName} {s.lastName}</span>
                  </div>
                  <div className="flex gap-1.5">
                    {['PRESENT', 'ABSENT', 'LATE'].map(status => (
                      <button
                        key={status}
                        onClick={() => setAttendance(p => ({ ...p, [s.id]: status }))}
                        className={`w-8 h-8 text-xs border transition-colors font-medium ${
                          attendance[s.id] === status ? STATUS_STYLES[status].active : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                        }`}
                      >
                        {STATUS_STYLES[status].label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleSave} disabled={submitting} className="btn-violet w-full flex items-center justify-center gap-2">
              {submitting ? <><IconSpinner size={15} /> Saving...</> : <><IconSave size={15} strokeWidth={1.5} /> Save Attendance</>}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default StaffAttendance
