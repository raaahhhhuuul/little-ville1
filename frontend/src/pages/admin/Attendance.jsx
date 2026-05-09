import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Table from '../../components/common/Table'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import { getStaffAttendance, markStaffAttendance, getUsers } from '../../api/admin'
import toast from 'react-hot-toast'
import { IconPlus, IconSpinner } from '../../components/common/Icons'
import { formatDate, MONTHS, currentMonth, currentYear } from '../../utils/helpers'

const AdminAttendance = () => {
  const [records, setRecords]     = useState([])
  const [staffList, setStaffList] = useState([])
  const [loading, setLoading]     = useState(true)
  const [month, setMonth]         = useState(currentMonth)
  const [year, setYear]           = useState(currentYear)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm]           = useState({ staffId: '', date: new Date().toISOString().slice(0, 10), status: 'PRESENT', notes: '' })
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    setLoading(true)
    try { const res = await getStaffAttendance({ month, year }); setRecords(res.data.data) }
    catch { toast.error('Failed to load attendance') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [month, year])
  useEffect(() => { getUsers({ role: 'STAFF' }).then(res => setStaffList(res.data.data.users)).catch(() => {}) }, [])

  const handleMark = async (e) => {
    e.preventDefault(); setSubmitting(true)
    try { await markStaffAttendance(form); toast.success('Attendance marked'); setModalOpen(false); load() }
    catch { toast.error('Failed to mark attendance') }
    finally { setSubmitting(false) }
  }

  const statusBadge = { PRESENT: 'green', ABSENT: 'red', LATE: 'yellow' }

  const columns = [
    { key: 'staff',   header: 'Staff Member', render: r => `${r.staff.firstName} ${r.staff.lastName}` },
    { key: 'date',    header: 'Date',         render: r => formatDate(r.date) },
    { key: 'status',  header: 'Status',       render: r => <Badge variant={statusBadge[r.status]}>{r.status}</Badge> },
    { key: 'checkIn', header: 'Check In',     render: r => r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : '—' },
    { key: 'notes',   header: 'Notes',        render: r => r.notes || '—' }
  ]

  return (
    <DashboardLayout title="Staff Attendance">
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div className="flex gap-3">
            <select className="input-field w-40" value={month} onChange={e => setMonth(Number(e.target.value))}>
              {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <select className="input-field w-28" value={year} onChange={e => setYear(Number(e.target.value))}>
              {[currentYear, currentYear - 1, currentYear - 2].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <button onClick={() => setModalOpen(true)} className="btn-violet flex items-center gap-2">
            <IconPlus size={15} strokeWidth={1.5} /> Mark Attendance
          </button>
        </div>

        <div className="card p-0">
          <Table columns={columns} data={records} loading={loading} emptyMessage="No attendance records" />
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Mark Staff Attendance">
        <form onSubmit={handleMark} className="space-y-4">
          <div>
            <label className="label">Staff Member</label>
            <select className="input-field" value={form.staffId} onChange={e => setForm(p => ({ ...p, staffId: e.target.value }))} required>
              <option value="">Select staff...</option>
              {staffList.map(s => (
                <option key={s.id} value={s.staffProfile?.id}>
                  {s.staffProfile ? `${s.staffProfile.firstName} ${s.staffProfile.lastName}` : s.email}
                </option>
              ))}
            </select>
          </div>
          <div><label className="label">Date</label><input type="date" className="input-field" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required /></div>
          <div>
            <label className="label">Status</label>
            <select className="input-field" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
              <option value="LATE">Late</option>
            </select>
          </div>
          <div><label className="label">Notes</label><textarea className="input-field" rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-violet flex-1 flex items-center justify-center gap-2">
              {submitting ? <IconSpinner size={14} /> : null} Save
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}

export default AdminAttendance
