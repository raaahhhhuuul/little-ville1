import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Badge from '../../components/common/Badge'
import Table from '../../components/common/Table'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getAttendance } from '../../api/student'
import { MONTHS, currentMonth, currentYear, formatDate } from '../../utils/helpers'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

const StudentAttendance = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState(currentMonth)
  const [year, setYear] = useState(currentYear)

  useEffect(() => {
    setLoading(true)
    getAttendance({ month, year })
      .then(res => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [month, year])

  const statusBadge = { PRESENT: 'green', ABSENT: 'red', LATE: 'yellow' }
  const summary = data?.summary

  const columns = [
    { key: 'date', header: 'Date', render: r => formatDate(r.date) },
    { key: 'class', header: 'Class', render: r => r.class?.name || '—' },
    { key: 'status', header: 'Status', render: r => <Badge variant={statusBadge[r.status]}>{r.status}</Badge> },
    { key: 'notes', header: 'Notes', render: r => r.notes || '—' }
  ]

  return (
    <DashboardLayout title="My Attendance">
      <div className="space-y-5">
        <div className="flex gap-3">
          <select className="input-field w-40" value={month} onChange={e => setMonth(Number(e.target.value))}>
            {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <select className="input-field w-28" value={year} onChange={e => setYear(Number(e.target.value))}>
            {[currentYear, currentYear - 1].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="card text-center">
              <p className="text-2xl font-bold text-gray-900">{summary.percentage}%</p>
              <p className="text-xs text-gray-500 mt-1">Attendance Rate</p>
            </div>
            <div className="card text-center flex flex-col items-center gap-1">
              <CheckCircle size={20} className="text-green-500" />
              <p className="text-2xl font-bold text-green-600">{summary.present}</p>
              <p className="text-xs text-gray-500">Present</p>
            </div>
            <div className="card text-center flex flex-col items-center gap-1">
              <XCircle size={20} className="text-red-500" />
              <p className="text-2xl font-bold text-red-600">{summary.absent}</p>
              <p className="text-xs text-gray-500">Absent</p>
            </div>
            <div className="card text-center flex flex-col items-center gap-1">
              <Clock size={20} className="text-yellow-500" />
              <p className="text-2xl font-bold text-yellow-600">{summary.late}</p>
              <p className="text-xs text-gray-500">Late</p>
            </div>
          </div>
        )}

        <div className="card p-0">
          <Table columns={columns} data={data?.records} loading={loading} emptyMessage="No attendance records this month" />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StudentAttendance
