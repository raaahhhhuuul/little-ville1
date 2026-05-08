import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Modal from '../../components/common/Modal'
import EmptyState from '../../components/common/EmptyState'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getClasses, createClass, createSubject } from '../../api/staff'
import toast from 'react-hot-toast'
import { Plus, School, Users, BookOpen, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

const gradeColors = ['from-orange-400 to-amber-500', 'from-sky-400 to-blue-500', 'from-emerald-400 to-teal-500', 'from-violet-400 to-purple-500', 'from-rose-400 to-pink-500']

const StaffClasses = () => {
  const [classes, setClasses]             = useState([])
  const [loading, setLoading]             = useState(true)
  const [classModal, setClassModal]       = useState(false)
  const [subjectModal, setSubjectModal]   = useState(false)
  const [expandedClass, setExpandedClass] = useState(null)
  const [classForm, setClassForm]         = useState({ name: '', grade: '', section: '' })
  const [subjectForm, setSubjectForm]     = useState({ name: '', description: '', classId: '' })
  const [submitting, setSubmitting]       = useState(false)

  const load = async () => {
    setLoading(true)
    try { const res = await getClasses(); setClasses(res.data.data) }
    catch { toast.error('Failed to load classes') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleCreateClass = async (e) => {
    e.preventDefault(); setSubmitting(true)
    try { await createClass(classForm); toast.success('Class created! 🏫'); setClassModal(false); setClassForm({ name: '', grade: '', section: '' }); load() }
    catch { toast.error('Failed to create class') }
    finally { setSubmitting(false) }
  }

  const handleCreateSubject = async (e) => {
    e.preventDefault(); setSubmitting(true)
    try { await createSubject(subjectForm); toast.success('Subject added! 📚'); setSubjectModal(false); setSubjectForm({ name: '', description: '', classId: '' }); load() }
    catch { toast.error('Failed to create subject') }
    finally { setSubmitting(false) }
  }

  if (loading) return <DashboardLayout title="Classes"><LoadingSpinner fullScreen /></DashboardLayout>

  return (
    <DashboardLayout title="My Classes">
      <div className="space-y-5">
        <div className="flex gap-3 justify-end">
          <button onClick={() => { setSubjectForm(p => ({ ...p, classId: classes[0]?.id || '' })); setSubjectModal(true) }}
            className="btn-secondary flex items-center gap-2">
            <BookOpen size={16} /> Add Subject
          </button>
          <button onClick={() => setClassModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> New Class
          </button>
        </div>

        {classes.length === 0 ? (
          <EmptyState message="No classes yet. Create your first class!" emoji="🏫" />
        ) : (
          <div className="space-y-4">
            {classes.map((cls, idx) => (
              <div key={cls.id} className="card hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedClass(expandedClass === cls.id ? null : cls.id)}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${gradeColors[idx % gradeColors.length]} rounded-2xl flex items-center justify-center shadow-md shrink-0`}>
                      <School size={22} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{cls.name}</h3>
                      <p className="text-sm text-gray-500 font-medium">Grade {cls.grade}{cls.section ? ` · Section ${cls.section}` : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-200">
                      <Users size={13} /> {cls._count?.classStudents || 0}
                    </div>
                    {expandedClass === cls.id
                      ? <ChevronUp size={18} className="text-violet-400" />
                      : <ChevronDown size={18} className="text-gray-400" />}
                  </div>
                </div>

                {expandedClass === cls.id && (
                  <div className="mt-5 pt-4 border-t-2 border-orange-100 space-y-4 animate-fade-in">
                    <div>
                      <h4 className="text-sm font-bold text-violet-700 mb-2">📚 Subjects</h4>
                      {cls.subjects?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {cls.subjects.map(s => (
                            <span key={s.id} className="badge-blue">{s.name}</span>
                          ))}
                        </div>
                      ) : <p className="text-sm text-gray-400 font-medium">No subjects added yet</p>}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-violet-700 mb-2">👨‍🎓 Students ({cls.classStudents?.length || 0})</h4>
                      {cls.classStudents?.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {cls.classStudents.slice(0, 6).map(cs => (
                            <div key={cs.id} className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-sm font-semibold text-amber-800">
                              {cs.student.firstName} {cs.student.lastName}
                            </div>
                          ))}
                          {cls.classStudents.length > 6 && (
                            <div className="bg-violet-50 border border-violet-200 rounded-xl px-3 py-2 text-sm font-bold text-violet-600">
                              +{cls.classStudents.length - 6} more
                            </div>
                          )}
                        </div>
                      ) : <p className="text-sm text-gray-400 font-medium">No students enrolled</p>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={classModal} onClose={() => setClassModal(false)} title="🏫 Create New Class">
        <form onSubmit={handleCreateClass} className="space-y-4">
          <div><label className="label">Class Name *</label><input className="input-field" value={classForm.name} onChange={e => setClassForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Sunflower Class" required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Grade *</label><input className="input-field" value={classForm.grade} onChange={e => setClassForm(p => ({ ...p, grade: e.target.value }))} placeholder="e.g. KG1" required /></div>
            <div><label className="label">Section</label><input className="input-field" value={classForm.section} onChange={e => setClassForm(p => ({ ...p, section: e.target.value }))} placeholder="e.g. A" /></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setClassModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {submitting ? <Loader2 size={14} className="animate-spin" /> : null} Create
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={subjectModal} onClose={() => setSubjectModal(false)} title="📚 Add Subject">
        <form onSubmit={handleCreateSubject} className="space-y-4">
          <div>
            <label className="label">Class *</label>
            <select className="input-field" value={subjectForm.classId} onChange={e => setSubjectForm(p => ({ ...p, classId: e.target.value }))} required>
              <option value="">Select class...</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name} (Grade {c.grade})</option>)}
            </select>
          </div>
          <div><label className="label">Subject Name *</label><input className="input-field" value={subjectForm.name} onChange={e => setSubjectForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Mathematics" required /></div>
          <div><label className="label">Description</label><textarea className="input-field" rows={2} value={subjectForm.description} onChange={e => setSubjectForm(p => ({ ...p, description: e.target.value }))} /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setSubjectModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {submitting ? <Loader2 size={14} className="animate-spin" /> : null} Add Subject
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}

export default StaffClasses
