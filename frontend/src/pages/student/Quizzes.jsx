import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Modal from '../../components/common/Modal'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { getQuizzes, getQuiz, submitQuiz } from '../../api/student'
import toast from 'react-hot-toast'
import { IconBook, IconClock, IconCheckCircle, IconSpinner, IconStar } from '../../components/common/Icons'
import { formatDate } from '../../utils/helpers'

const scoreStyle = (score) => {
  if (score >= 70) return { color: 'bg-emerald-400', msg: 'Great work!' }
  if (score >= 50) return { color: 'bg-amber-400',   msg: 'Good effort!' }
  return                  { color: 'bg-rose-400',     msg: 'Keep practicing!' }
}

const StudentQuizzes = () => {
  const [quizzes, setQuizzes]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [answers, setAnswers]       = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult]         = useState(null)

  const load = () => {
    getQuizzes().then(res => setQuizzes(res.data.data)).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const startQuiz = async (quizId) => {
    try { const res = await getQuiz(quizId); setActiveQuiz(res.data.data); setAnswers({}); setResult(null) }
    catch (err) { toast.error(err.response?.data?.message || 'Cannot open quiz') }
  }

  const handleSubmit = async () => {
    const questions = activeQuiz.questions || []
    if (Object.keys(answers).length < questions.length) { toast.error('Please answer all questions'); return }
    setSubmitting(true)
    try {
      const res = await submitQuiz(activeQuiz.id, questions.map((_, i) => answers[i] ?? null))
      setResult(res.data.data)
      toast.success('Quiz submitted!')
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Submission failed') }
    finally { setSubmitting(false) }
  }

  const pending   = quizzes.filter(q => !q.isSubmitted)
  const completed = quizzes.filter(q => q.isSubmitted)

  return (
    <DashboardLayout title="My Quizzes">
      <div className="space-y-6">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {pending.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Pending — {pending.length}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {pending.map(q => (
                    <div key={q.id} className="bg-white rounded-2xl p-5 border-2 border-orange-200 hover:border-orange-300 transition-all hover:shadow-md">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                        <IconBook size={18} className="text-orange-500" strokeWidth={2} />
                      </div>
                      <h4 className="text-sm font-medium text-gray-900">{q.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{q.subject?.name}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        {q.timeLimit && (
                          <span className="flex items-center gap-1">
                            <IconClock size={12} strokeWidth={2} />{q.timeLimit}m
                          </span>
                        )}
                        {q.dueDate && <span>Due {formatDate(q.dueDate)}</span>}
                        <span>{(q.questions || []).length} questions</span>
                      </div>
                      <button
                        onClick={() => startQuiz(q.id)}
                        className="btn-primary w-full mt-4 text-sm py-2.5 rounded-full"
                      >
                        Start Quiz
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {completed.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Completed — {completed.length}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {completed.map(q => (
                    <div key={q.id} className="bg-white rounded-2xl p-5 border-2 border-emerald-100 opacity-90">
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <IconCheckCircle size={18} className="text-emerald-500" strokeWidth={2} />
                        </div>
                      </div>
                      <h4 className="text-sm font-medium text-gray-900">{q.title}</h4>
                      <p className="text-xs text-gray-500">{q.subject?.name}</p>
                      {q.submission?.score != null && (
                        <div className="mt-3 flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full w-fit">
                          <IconStar size={13} className="text-amber-500" strokeWidth={2} />
                          <span className="text-sm font-medium text-amber-700">{q.submission.score.toFixed(1)}%</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {quizzes.length === 0 && <EmptyState message="No quizzes available yet" icon={IconBook} />}
          </>
        )}
      </div>

      {/* Quiz Modal */}
      <Modal
        isOpen={!!activeQuiz && !result}
        onClose={() => { setActiveQuiz(null); setResult(null) }}
        title={activeQuiz?.title || ''}
        size="lg"
      >
        {activeQuiz && (
          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
            <p className="text-xs text-gray-500">{activeQuiz.subject?.name} · {(activeQuiz.questions || []).length} questions</p>

            {(activeQuiz.questions || []).map((q, qi) => (
              <div key={qi} className="rounded-2xl border-2 border-gray-100 p-4 space-y-3 bg-gray-50">
                <p className="text-sm font-medium text-gray-900">{qi + 1}. {q.text}</p>
                <div className="space-y-2">
                  {(q.options || []).map((opt, oi) => (
                    <label
                      key={oi}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                        answers[qi] === oi
                          ? 'border-orange-400 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-200 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${qi}`}
                        checked={answers[qi] === oi}
                        onChange={() => setAnswers(p => ({ ...p, [qi]: oi }))}
                        className="accent-orange-500 w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary w-full flex items-center justify-center gap-2 rounded-full"
            >
              {submitting ? <><IconSpinner size={16} /> Submitting...</> : 'Submit Quiz'}
            </button>
          </div>
        )}
      </Modal>

      {/* Result Modal */}
      <Modal
        isOpen={!!result}
        onClose={() => { setResult(null); setActiveQuiz(null) }}
        title="Quiz Result"
      >
        {result && (() => {
          const s = scoreStyle(result.score)
          return (
            <div className="text-center space-y-5 py-4">
              <div className={`w-24 h-24 ${s.color} rounded-full flex items-center justify-center mx-auto shadow-md`}>
                <span className="text-2xl font-medium text-white">{result.score?.toFixed(0)}%</span>
              </div>
              <div>
                <p className="font-display text-xl text-gray-900">{s.msg}</p>
                <p className="text-sm text-gray-500 mt-1">You scored {result.score?.toFixed(1)}% on this quiz</p>
              </div>
              <button
                onClick={() => { setResult(null); setActiveQuiz(null) }}
                className="btn-primary w-full rounded-full"
              >
                Done
              </button>
            </div>
          )
        })()}
      </Modal>
    </DashboardLayout>
  )
}

export default StudentQuizzes
