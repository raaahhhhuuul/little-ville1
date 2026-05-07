import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Badge from '../../components/common/Badge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { getClasses, markAttendance, getClassAttendance } from '../../api/staff'
import toast from 'react-hot-toast'
import { Save, Loader2 } from 'lucide-react'

const StaffAttendance = () => {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [loadingStudents, setLoadingStudents] = useState(false)

  useEffect(() => {
    getClasses()
      .then(res => {
        setClasses(res.data.data)
        if (res.data.data.length > 0) setSelectedClass(res.data.data[0].id)
      })
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
      .then(res => {
        const existing = {}
        res.data.data.forEach(r => { existing[r.studentId] = r.status })
        setAttendance(prev => ({ ...prev, ...existing }))
      })
      .catch(() => {})
      .finally(() => setLoadingStudents(false))
  }, [selectedClass, date, classes])

  const handleSave = async () => {
    setSubmitting(true)
    try {
      const attendances = students.map(s => ({
        studentId: s.id,
        date,
        status: attendance[s.id] || 'PRESENT'
      }))
      await markAttendance({ classId: selectedClass, attendances })
      toast.success('Attendance saved successfully')
    } catch {
      toast.error('Failed to save attendance')
    } finally {
      setSubmitting(false)
    }
  }

  const statusColor = { PRESENT: 'bg-green-50 border-green-300 text-green-700', ABSENT: 'bg-red-50 border-red-300 text-red-700', LATE: 'bg-yellow-50 border-yellow-300 text-yellow-700' }

  if (loading) return <DashboardLayout title="Attendance"><LoadingSpinner fullScreen /></DashboardLayout>

  return (
    <DashboardLayout title="Mark Attendance">
      <div className="space-y-5">
        <div className="card">
          <div className="flex flex-col sm:flex-row gap-3">
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
          <div className="flex justify-center py-8"><LoadingSpinner size="lg" /></div>
        ) : students.length === 0 ? (
          <EmptyState message="No students enrolled in this class" />
        ) : (
          <div className="card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{students.length} Students</h3>
              <div className="flex gap-2 text-xs">
                <span className="badge-green">P: {Object.values(attendance).filter(s => s === 'PRESENT').length}</span>
                <span className="badge-red">A: {Object.values(attendance).filter(s => s === 'ABSENT').length}</span>
                <span className="badge-yellow">L: {Object.values(attendance).filter(s => s === 'LATE').length}</span>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {students.map(s => (
                <div key={s.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                      {s.firstName[0]}{s.lastName[0]}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{s.firstName} {s.lastName}</span>
                  </div>
                  <div className="flex gap-2">
                    {['PRESENT', 'ABSENT', 'LATE'].map(status => (
                      <button
                        key={status}
                        onClick={() => setAttendance(p => ({ ...p, [s.id]: status }))}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                          attendance[s.id] === status ? statusColor[status] : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                        }`}
                      >
                        {status[0]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleSave} disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {submitting ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default StaffAttendance
