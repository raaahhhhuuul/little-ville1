import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Badge from '../../components/common/Badge'
import Table from '../../components/common/Table'
import { getAttendance } from '../../api/student'
import { MONTHS, currentMonth, currentYear, formatDate } from '../../utils/helpers'
import { IconCheckCircle, IconXCircle, IconClock } from '../../components/common/Icons'

const StudentAttendance = () => {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [month, setMonth]     = useState(currentMonth)
  const [year, setYear]       = useState(currentYear)

  useEffect(() => {
    setLoading(true)
    getAttendance({ month, year })
      .then(res => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [month, year])

  const statusBadge = { PRESENT: 'green', ABSENT: 'red', LATE: 'yellow' }
  const summary     = data?.summary

  const columns = [
    { key: 'date',   header: 'Date',   render: r => formatDate(r.date) },
    { key: 'class',  header: 'Class',  render: r => r.class?.name || '—' },
    { key: 'status', header: 'Status', render: r => <Badge variant={statusBadge[r.status]}>{r.status}</Badge> },
    { key: 'notes',  header: 'Notes',  render: r => r.notes || '—' }
  ]

  return (
    <DashboardLayout title="My Attendance">
      <div className="space-y-5">
        {/* Filter row */}
        <div className="flex gap-3">
          <select className="input-field w-40 rounded-xl" value={month} onChange={e => setMonth(Number(e.target.value))}>
            {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <select className="input-field w-28 rounded-xl" value={year} onChange={e => setYear(Number(e.target.value))}>
            {[currentYear, currentYear - 1].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Overall rate */}
            <div className="bg-white rounded-2xl p-5 text-center border-2 border-orange-100">
              <p className="font-display text-3xl text-orange-500">{summary.percentage}%</p>
              <p className="text-xs text-gray-500 mt-1">Attendance Rate</p>
            </div>
            {/* Present */}
            <div className="bg-emerald-400 rounded-2xl p-5 text-center text-white">
              <div className="w-9 h-9 bg-white/25 rounded-full flex items-center justify-center mx-auto mb-2">
                <IconCheckCircle size={17} className="text-white" strokeWidth={2} />
              </div>
              <p className="text-2xl font-medium">{summary.present}</p>
              <p className="text-xs text-white/80 mt-0.5">Present</p>
            </div>
            {/* Absent */}
            <div className="bg-rose-400 rounded-2xl p-5 text-center text-white">
              <div className="w-9 h-9 bg-white/25 rounded-full flex items-center justify-center mx-auto mb-2">
                <IconXCircle size={17} className="text-white" strokeWidth={2} />
              </div>
              <p className="text-2xl font-medium">{summary.absent}</p>
              <p className="text-xs text-white/80 mt-0.5">Absent</p>
            </div>
            {/* Late */}
            <div className="bg-amber-400 rounded-2xl p-5 text-center text-white">
              <div className="w-9 h-9 bg-white/25 rounded-full flex items-center justify-center mx-auto mb-2">
                <IconClock size={17} className="text-white" strokeWidth={2} />
              </div>
              <p className="text-2xl font-medium">{summary.late}</p>
              <p className="text-xs text-white/80 mt-0.5">Late</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
          <Table columns={columns} data={data?.records} loading={loading} emptyMessage="No attendance records this month" />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StudentAttendance
