import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Modal from '../../components/common/Modal'
import EmptyState from '../../components/common/EmptyState'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getClasses, createClass, createSubject } from '../../api/staff'
import toast from 'react-hot-toast'
import { IconPlus, IconSchool, IconUsers, IconBook, IconSpinner, IconChevronDown, IconChevronUp } from '../../components/common/Icons'

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
    try { await createClass(classForm); toast.success('Class created'); setClassModal(false); setClassForm({ name: '', grade: '', section: '' }); load() }
    catch { toast.error('Failed to create class') }
    finally { setSubmitting(false) }
  }

  const handleCreateSubject = async (e) => {
    e.preventDefault(); setSubmitting(true)
    try { await createSubject(subjectForm); toast.success('Subject added'); setSubjectModal(false); setSubjectForm({ name: '', description: '', classId: '' }); load() }
    catch { toast.error('Failed to create subject') }
    finally { setSubmitting(false) }
  }

  return (
    <DashboardLayout title="My Classes">
      <div className="space-y-5">
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => { setSubjectForm(p => ({ ...p, classId: classes[0]?.id || '' })); setSubjectModal(true) }}
            className="btn-secondary flex items-center gap-2"
          >
            <IconBook size={15} strokeWidth={1.5} /> Add Subject
          </button>
          <button onClick={() => setClassModal(true)} className="btn-violet flex items-center gap-2">
            <IconPlus size={15} strokeWidth={1.5} /> New Class
          </button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : classes.length === 0 ? (
          <EmptyState message="No classes yet. Create your first class!" icon={IconSchool} />
        ) : (
          <div className="space-y-3">
            {classes.map((cls) => (
              <div key={cls.id} className="card">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedClass(expandedClass === cls.id ? null : cls.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <IconSchool size={18} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{cls.name}</h3>
                      <p className="text-xs text-gray-500">Grade {cls.grade}{cls.section ? ` · Section ${cls.section}` : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                      <IconUsers size={13} strokeWidth={1.5} />
                      {cls._count?.classStudents || 0}
                    </div>
                    {expandedClass === cls.id
                      ? <IconChevronUp size={16} className="text-gray-400" strokeWidth={1.5} />
                      : <IconChevronDown size={16} className="text-gray-400" strokeWidth={1.5} />}
                  </div>
                </div>

                {expandedClass === cls.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-4 animate-fade-in">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Subjects</p>
                      {cls.subjects?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {cls.subjects.map(s => (
                            <span key={s.id} className="badge-blue">{s.name}</span>
                          ))}
                        </div>
                      ) : <p className="text-xs text-gray-400">No subjects added yet</p>}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                        Students ({cls.classStudents?.length || 0})
                      </p>
                      {cls.classStudents?.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {cls.classStudents.slice(0, 6).map(cs => (
                            <div key={cs.id} className="border border-gray-200 px-3 py-2 text-xs text-gray-700 bg-gray-50">
                              {cs.student.firstName} {cs.student.lastName}
                            </div>
                          ))}
                          {cls.classStudents.length > 6 && (
                            <div className="border border-gray-200 px-3 py-2 text-xs text-gray-500 bg-gray-50">
                              +{cls.classStudents.length - 6} more
                            </div>
                          )}
                        </div>
                      ) : <p className="text-xs text-gray-400">No students enrolled</p>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={classModal} onClose={() => setClassModal(false)} title="Create New Class">
        <form onSubmit={handleCreateClass} className="space-y-4">
          <div><label className="label">Class Name</label><input className="input-field" value={classForm.name} onChange={e => setClassForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Sunflower Class" required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Grade</label><input className="input-field" value={classForm.grade} onChange={e => setClassForm(p => ({ ...p, grade: e.target.value }))} placeholder="e.g. KG1" required /></div>
            <div><label className="label">Section</label><input className="input-field" value={classForm.section} onChange={e => setClassForm(p => ({ ...p, section: e.target.value }))} placeholder="e.g. A" /></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setClassModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-violet flex-1 flex items-center justify-center gap-2">
              {submitting ? <IconSpinner size={14} /> : null} Create
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={subjectModal} onClose={() => setSubjectModal(false)} title="Add Subject">
        <form onSubmit={handleCreateSubject} className="space-y-4">
          <div>
            <label className="label">Class</label>
            <select className="input-field" value={subjectForm.classId} onChange={e => setSubjectForm(p => ({ ...p, classId: e.target.value }))} required>
              <option value="">Select class...</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name} (Grade {c.grade})</option>)}
            </select>
          </div>
          <div><label className="label">Subject Name</label><input className="input-field" value={subjectForm.name} onChange={e => setSubjectForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Mathematics" required /></div>
          <div><label className="label">Description</label><textarea className="input-field" rows={2} value={subjectForm.description} onChange={e => setSubjectForm(p => ({ ...p, description: e.target.value }))} /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setSubjectModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-violet flex-1 flex items-center justify-center gap-2">
              {submitting ? <IconSpinner size={14} /> : null} Add Subject
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}

export default StaffClasses
