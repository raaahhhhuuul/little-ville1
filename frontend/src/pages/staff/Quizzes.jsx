import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Modal from '../../components/common/Modal'
import Badge from '../../components/common/Badge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { getQuizzes, createQuiz, updateQuiz, getSubjects } from '../../api/staff'
import toast from 'react-hot-toast'
import { Plus, BookOpen, Loader2, Eye, Send, Trash2, PlusCircle, X } from 'lucide-react'
import { formatDate } from '../../utils/helpers'

const emptyQuestion = { text: '', options: ['', '', '', ''], correctAnswer: 0 }

const StaffQuizzes = () => {
  const [quizzes, setQuizzes] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', subjectId: '', timeLimit: '', dueDate: '',
    questions: [{ ...emptyQuestion }]
  })

  const load = () => {
    Promise.all([getQuizzes(), getSubjects()])
      .then(([q, s]) => { setQuizzes(q.data.data); setSubjects(s.data.data) })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const addQuestion = () => setForm(p => ({ ...p, questions: [...p.questions, { ...emptyQuestion, options: ['', '', '', ''] }] }))
  const removeQuestion = (i) => setForm(p => ({ ...p, questions: p.questions.filter((_, idx) => idx !== i) }))

  const updateQuestion = (i, field, value) => {
    setForm(p => {
      const qs = [...p.questions]
      qs[i] = { ...qs[i], [field]: value }
      return { ...p, questions: qs }
    })
  }

  const updateOption = (qi, oi, value) => {
    setForm(p => {
      const qs = [...p.questions]
      const opts = [...qs[qi].options]
      opts[oi] = value
      qs[qi] = { ...qs[qi], options: opts }
      return { ...p, questions: qs }
    })
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await createQuiz({ ...form, timeLimit: form.timeLimit ? Number(form.timeLimit) : undefined })
      toast.success('Quiz created')
      setModalOpen(false)
      setForm({ title: '', description: '', subjectId: '', timeLimit: '', dueDate: '', questions: [{ ...emptyQuestion }] })
      load()
    } catch {
      toast.error('Failed to create quiz')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePublish = async (quiz) => {
    try {
      await updateQuiz(quiz.id, { isPublished: !quiz.isPublished })
      toast.success(quiz.isPublished ? 'Quiz unpublished' : 'Quiz published!')
      load()
    } catch {
      toast.error('Failed to update quiz')
    }
  }

  if (loading) return <DashboardLayout title="Quizzes"><LoadingSpinner fullScreen /></DashboardLayout>

  return (
    <DashboardLayout title="Quiz Management">
      <div className="space-y-5">
        <div className="flex justify-end">
          <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Create Quiz
          </button>
        </div>

        {quizzes.length === 0 ? (
          <EmptyState message="No quizzes yet" icon={BookOpen} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {quizzes.map(q => (
              <div key={q.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{q.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{q.subject?.name} · {q.subject?.class?.name}</p>
                  </div>
                  <Badge variant={q.isPublished ? 'green' : 'gray'}>{q.isPublished ? 'Live' : 'Draft'}</Badge>
                </div>
                <div className="text-xs text-gray-500 space-y-1 mb-4">
                  <div>{(q.questions || []).length} questions</div>
                  {q.timeLimit && <div>{q.timeLimit} min time limit</div>}
                  {q.dueDate && <div>Due: {formatDate(q.dueDate)}</div>}
                  <div>{q._count?.submissions || 0} submissions</div>
                </div>
                <button
                  onClick={() => handlePublish(q)}
                  className={`w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    q.isPublished
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  <Send size={13} />
                  {q.isPublished ? 'Unpublish' : 'Publish'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Quiz" size="lg">
        <form onSubmit={handleCreate} className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="label">Title *</label>
              <input className="input-field" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Subject *</label>
              <select className="input-field" value={form.subjectId} onChange={e => setForm(p => ({ ...p, subjectId: e.target.value }))} required>
                <option value="">Select subject...</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.class?.name})</option>)}
              </select>
            </div>
            <div>
              <label className="label">Time Limit (min)</label>
              <input type="number" className="input-field" value={form.timeLimit} onChange={e => setForm(p => ({ ...p, timeLimit: e.target.value }))} min="1" />
            </div>
            <div className="col-span-2">
              <label className="label">Due Date</label>
              <input type="datetime-local" className="input-field" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Questions</h4>
              <button type="button" onClick={addQuestion} className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700">
                <PlusCircle size={16} /> Add Question
              </button>
            </div>

            {form.questions.map((q, qi) => (
              <div key={qi} className="border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Q{qi + 1}</span>
                  {form.questions.length > 1 && (
                    <button type="button" onClick={() => removeQuestion(qi)} className="text-red-400 hover:text-red-600">
                      <X size={16} />
                    </button>
                  )}
                </div>
                <input
                  className="input-field"
                  placeholder="Question text..."
                  value={q.text}
                  onChange={e => updateQuestion(qi, 'text', e.target.value)}
                  required
                />
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${qi}`}
                        checked={q.correctAnswer === oi}
                        onChange={() => updateQuestion(qi, 'correctAnswer', oi)}
                        className="accent-primary-600"
                      />
                      <input
                        className="input-field flex-1"
                        placeholder={`Option ${oi + 1}`}
                        value={opt}
                        onChange={e => updateOption(qi, oi, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400">Select the radio button next to the correct answer</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2 sticky bottom-0 bg-white">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {submitting ? <Loader2 size={14} className="animate-spin" /> : null} Create Quiz
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}

export default StaffQuizzes
