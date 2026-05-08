import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Modal from '../../components/common/Modal'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { getQuizzes, getQuiz, submitQuiz } from '../../api/student'
import toast from 'react-hot-toast'
import { BookOpen, Clock, CheckCircle, Loader2, Star } from 'lucide-react'
import { formatDate } from '../../utils/helpers'

const scoreStyle = (score) => {
  if (score >= 70) return { ring: 'bg-emerald-100 border-4 border-emerald-400', text: 'text-emerald-600', msg: 'Amazing work! 🌟' }
  if (score >= 50) return { ring: 'bg-amber-100 border-4 border-amber-400',    text: 'text-amber-600',   msg: 'Good effort! 👍' }
  return                  { ring: 'bg-rose-100 border-4 border-rose-400',       text: 'text-rose-600',    msg: 'Keep practicing! 💪' }
}

const StudentQuizzes = () => {
  const [quizzes, setQuizzes]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [answers, setAnswers]     = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult]       = useState(null)

  const load = () => { getQuizzes().then(res => setQuizzes(res.data.data)).catch(() => {}).finally(() => setLoading(false)) }

  useEffect(() => { load() }, [])

  const startQuiz = async (quizId) => {
    try { const res = await getQuiz(quizId); setActiveQuiz(res.data.data); setAnswers({}); setResult(null) }
    catch (err) { toast.error(err.response?.data?.message || 'Cannot open quiz') }
  }

  const handleSubmit = async () => {
    const questions = activeQuiz.questions || []
    if (Object.keys(answers).length < questions.length) { toast.error('Please answer all questions'); return }
    setSubmitting(true)
    try { const res = await submitQuiz(activeQuiz.id, questions.map((_, i) => answers[i] ?? null)); setResult(res.data.data); toast.success('Quiz submitted! 🎉'); load() }
    catch (err) { toast.error(err.response?.data?.message || 'Submission failed') }
    finally { setSubmitting(false) }
  }

  if (loading) return <DashboardLayout title="My Quizzes"><LoadingSpinner fullScreen /></DashboardLayout>

  const pending   = quizzes.filter(q => !q.isSubmitted)
  const completed = quizzes.filter(q => q.isSubmitted)

  return (
    <DashboardLayout title="My Quizzes">
      <div className="space-y-6">
        {pending.length > 0 && (
          <div>
            <h3 className="font-bold text-violet-800 mb-3">📝 Pending ({pending.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {pending.map(q => (
                <div key={q.id} className="card border-l-4 border-l-orange-400 hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-gray-800">{q.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">{q.subject?.name}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 font-semibold">
                    {q.timeLimit && <span className="flex items-center gap-1"><Clock size={12} />{q.timeLimit}m</span>}
                    {q.dueDate   && <span>📅 {formatDate(q.dueDate)}</span>}
                    <span>📋 {(q.questions || []).length} Qs</span>
                  </div>
                  <button onClick={() => startQuiz(q.id)} className="btn-primary w-full mt-4 text-sm py-2">
                    🚀 Start Quiz
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {completed.length > 0 && (
          <div>
            <h3 className="font-bold text-violet-800 mb-3">✅ Completed ({completed.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {completed.map(q => (
                <div key={q.id} className="card opacity-85 border-l-4 border-l-emerald-400">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-gray-800">{q.title}</h4>
                      <p className="text-xs text-gray-500 font-medium">{q.subject?.name}</p>
                    </div>
                    <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                  </div>
                  {q.submission?.score != null && (
                    <div className="mt-3 flex items-center gap-2 bg-amber-50 rounded-2xl px-3 py-2 border border-amber-200">
                      <Star size={16} className="text-amber-500 fill-amber-400" />
                      <span className="font-black text-amber-700 text-lg">{q.submission.score.toFixed(1)}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {quizzes.length === 0 && <EmptyState message="No quizzes available yet" emoji="📝" />}
      </div>

      {/* Quiz Modal */}
      <Modal isOpen={!!activeQuiz && !result} onClose={() => { setActiveQuiz(null); setResult(null) }} title={`📝 ${activeQuiz?.title || ''}`} size="lg">
        {activeQuiz && (
          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
            <p className="text-sm text-gray-500 font-semibold">{activeQuiz.subject?.name} · {(activeQuiz.questions || []).length} questions</p>

            {(activeQuiz.questions || []).map((q, qi) => (
              <div key={qi} className="border-2 border-orange-100 rounded-2xl p-4 space-y-3 bg-amber-50/30">
                <p className="font-bold text-gray-800 text-sm">{qi + 1}. {q.text}</p>
                <div className="space-y-2">
                  {(q.options || []).map((opt, oi) => (
                    <label key={oi} className={`flex items-center gap-3 p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                      answers[qi] === oi ? 'border-orange-400 bg-orange-50 text-orange-800' : 'border-gray-200 hover:border-orange-200'
                    }`}>
                      <input type="radio" name={`q-${qi}`} checked={answers[qi] === oi}
                        onChange={() => setAnswers(p => ({ ...p, [qi]: oi }))} className="accent-orange-500 w-4 h-4" />
                      <span className="text-sm font-medium text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2 sticky bottom-0">
              {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : '🚀 Submit Quiz'}
            </button>
          </div>
        )}
      </Modal>

      {/* Result Modal */}
      <Modal isOpen={!!result} onClose={() => { setResult(null); setActiveQuiz(null) }} title="Quiz Result 🎯">
        {result && (() => { const s = scoreStyle(result.score); return (
          <div className="text-center space-y-5 py-4">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${s.ring}`}>
              <span className={`text-3xl font-black ${s.text}`}>{result.score?.toFixed(0)}%</span>
            </div>
            <div>
              <p className="font-display text-2xl text-violet-700">{s.msg}</p>
              <p className="text-gray-500 text-sm mt-1 font-medium">You scored {result.score?.toFixed(1)}% on this quiz</p>
            </div>
            <button onClick={() => { setResult(null); setActiveQuiz(null) }} className="btn-primary w-full">Done</button>
          </div>
        )})()}
      </Modal>
    </DashboardLayout>
  )
}

export default StudentQuizzes
