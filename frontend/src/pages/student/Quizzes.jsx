import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Modal from '../../components/common/Modal'
import Badge from '../../components/common/Badge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { getQuizzes, getQuiz, submitQuiz } from '../../api/student'
import toast from 'react-hot-toast'
import { BookOpen, Clock, CheckCircle, Loader2, Star } from 'lucide-react'
import { formatDate } from '../../utils/helpers'

const StudentQuizzes = () => {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  const load = () => {
    getQuizzes()
      .then(res => setQuizzes(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const startQuiz = async (quizId) => {
    try {
      const res = await getQuiz(quizId)
      setActiveQuiz(res.data.data)
      setAnswers({})
      setResult(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot open quiz')
    }
  }

  const handleSubmit = async () => {
    const questions = activeQuiz.questions || []
    if (Object.keys(answers).length < questions.length) {
      toast.error('Please answer all questions')
      return
    }
    setSubmitting(true)
    try {
      const answersArr = questions.map((_, i) => answers[i] ?? null)
      const res = await submitQuiz(activeQuiz.id, answersArr)
      setResult(res.data.data)
      toast.success('Quiz submitted!')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <DashboardLayout title="My Quizzes"><LoadingSpinner fullScreen /></DashboardLayout>

  const pending = quizzes.filter(q => !q.isSubmitted)
  const completed = quizzes.filter(q => q.isSubmitted)

  return (
    <DashboardLayout title="My Quizzes">
      <div className="space-y-6">
        {pending.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Pending ({pending.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {pending.map(q => (
                <div key={q.id} className="card border-l-4 border-l-primary-500">
                  <h4 className="font-semibold text-gray-900">{q.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{q.subject?.name}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                    {q.timeLimit && <span className="flex items-center gap-1"><Clock size={12} />{q.timeLimit}m</span>}
                    {q.dueDate && <span>Due: {formatDate(q.dueDate)}</span>}
                    <span>{(q.questions || []).length} Qs</span>
                  </div>
                  <button onClick={() => startQuiz(q.id)} className="btn-primary w-full mt-4 text-sm py-2">
                    Start Quiz
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {completed.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Completed ({completed.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {completed.map(q => (
                <div key={q.id} className="card opacity-80">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{q.title}</h4>
                      <p className="text-xs text-gray-500">{q.subject?.name}</p>
                    </div>
                    <CheckCircle size={18} className="text-green-500 shrink-0" />
                  </div>
                  {q.submission?.score !== null && q.submission?.score !== undefined && (
                    <div className="mt-3 flex items-center gap-2">
                      <Star size={14} className="text-yellow-500" />
                      <span className="font-bold text-gray-900">{q.submission.score.toFixed(1)}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {quizzes.length === 0 && <EmptyState message="No quizzes available" icon={BookOpen} />}
      </div>

      {/* Quiz Modal */}
      <Modal isOpen={!!activeQuiz && !result} onClose={() => { setActiveQuiz(null); setResult(null) }} title={activeQuiz?.title || ''} size="lg">
        {activeQuiz && (
          <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-1">
            <p className="text-sm text-gray-500">{activeQuiz.subject?.name} · {(activeQuiz.questions || []).length} questions</p>

            {(activeQuiz.questions || []).map((q, qi) => (
              <div key={qi} className="border border-gray-200 rounded-xl p-4 space-y-3">
                <p className="font-medium text-gray-900 text-sm">{qi + 1}. {q.text}</p>
                <div className="space-y-2">
                  {(q.options || []).map((opt, oi) => (
                    <label key={oi} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      answers[qi] === oi ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name={`q-${qi}`}
                        checked={answers[qi] === oi}
                        onChange={() => setAnswers(p => ({ ...p, [qi]: oi }))}
                        className="accent-primary-600"
                      />
                      <span className="text-sm text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2 sticky bottom-0">
              {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : 'Submit Quiz'}
            </button>
          </div>
        )}
      </Modal>

      {/* Result Modal */}
      <Modal isOpen={!!result} onClose={() => { setResult(null); setActiveQuiz(null) }} title="Quiz Result">
        {result && (
          <div className="text-center space-y-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
              result.score >= 70 ? 'bg-green-100' : result.score >= 50 ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <span className={`text-2xl font-bold ${
                result.score >= 70 ? 'text-green-600' : result.score >= 50 ? 'text-yellow-600' : 'text-red-600'
              }`}>{result.score?.toFixed(0)}%</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-lg">
                {result.score >= 70 ? 'Great job!' : result.score >= 50 ? 'Good effort!' : 'Keep practicing!'}
              </p>
              <p className="text-gray-500 text-sm mt-1">You scored {result.score?.toFixed(1)}% on this quiz</p>
            </div>
            <button onClick={() => { setResult(null); setActiveQuiz(null) }} className="btn-primary w-full">Done</button>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}

export default StudentQuizzes
