import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { getClasses, markAttendance, getClassAttendance } from '../../api/staff'
import toast from 'react-hot-toast'
import { Save, Loader2 } from 'lucide-react'

const STATUS_BTN = {
  PRESENT: { active: 'bg-emerald-100 border-emerald-400 text-emerald-700 font-bold', label: 'P' },
  ABSENT:  { active: 'bg-rose-100 border-rose-400 text-rose-700 font-bold',           label: 'A' },
  LATE:    { active: 'bg-amber-100 border-amber-400 text-amber-700 font-bold',         label: 'L' }
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
      toast.success('Attendance saved! ✅')
    } catch { toast.error('Failed to save attendance') }
    finally { setSubmitting(false) }
  }

  const counts = { P: Object.values(attendance).filter(s => s === 'PRESENT').length, A: Object.values(attendance).filter(s => s === 'ABSENT').length, L: Object.values(attendance).filter(s => s === 'LATE').length }

  if (loading) return <DashboardLayout title="Attendance"><LoadingSpinner fullScreen /></DashboardLayout>

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

        {loadingStudents ? (
          <div className="flex justify-center py-10"><LoadingSpinner size="lg" /></div>
        ) : students.length === 0 ? (
          <EmptyState message="No students enrolled in this class" emoji="👨‍🎓" />
        ) : (
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-violet-800">👨‍🎓 {students.length} Students</h3>
              <div className="flex gap-2">
                <span className="badge-green">✓ {counts.P} Present</span>
                <span className="badge-red">✗ {counts.A} Absent</span>
                <span className="badge-yellow">◷ {counts.L} Late</span>
              </div>
            </div>

            <div className="divide-y-2 divide-orange-50">
              {students.map(s => (
                <div key={s.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-sm">
                      {s.firstName[0]}{s.lastName[0]}
                    </div>
                    <span className="text-sm font-bold text-gray-800">{s.firstName} {s.lastName}</span>
                  </div>
                  <div className="flex gap-2">
                    {['PRESENT', 'ABSENT', 'LATE'].map(status => (
                      <button key={status} onClick={() => setAttendance(p => ({ ...p, [s.id]: status }))}
                        className={`w-9 h-9 rounded-xl text-xs border-2 transition-all font-bold ${
                          attendance[s.id] === status ? STATUS_BTN[status].active : 'bg-white border-gray-200 text-gray-400 hover:border-orange-200'
                        }`}>
                        {STATUS_BTN[status].label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleSave} disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {submitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Attendance</>}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default StaffAttendance
