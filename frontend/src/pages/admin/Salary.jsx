import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import { getSalaries, manageSalary, getUsers } from '../../api/admin'
import toast from 'react-hot-toast'
import { Plus, Loader2, DollarSign } from 'lucide-react'
import { MONTHS, currentMonth, currentYear, getMonthName } from '../../utils/helpers'

const AdminSalary = () => {
  const [salaries, setSalaries]     = useState([])
  const [staffList, setStaffList]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [yearFilter, setYearFilter] = useState(currentYear)
  const [modalOpen, setModalOpen]   = useState(false)
  const [form, setForm] = useState({
    staffId: '', month: currentMonth, year: currentYear,
    baseSalary: '', deductions: '0', bonus: '0', reason: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    setLoading(true)
    try { const res = await getSalaries({ year: yearFilter }); setSalaries(res.data.data) }
    catch { toast.error('Failed to load salaries') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [yearFilter])
  useEffect(() => { getUsers({ role: 'STAFF' }).then(res => setStaffList(res.data.data.users)).catch(() => {}) }, [])

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true)
    try {
      await manageSalary({ ...form, month: Number(form.month), year: Number(form.year), baseSalary: Number(form.baseSalary), deductions: Number(form.deductions), bonus: Number(form.bonus) })
      toast.success('Salary record saved! 💰'); setModalOpen(false); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save salary') }
    finally { setSubmitting(false) }
  }

  const net = ((Number(form.baseSalary) || 0) - (Number(form.deductions) || 0) + (Number(form.bonus) || 0))

  const columns = [
    { key: 'staff',       header: 'Staff',        render: r => `${r.staff.firstName} ${r.staff.lastName}` },
    { key: 'period',      header: 'Period',        render: r => `${getMonthName(r.month)} ${r.year}` },
    { key: 'baseSalary',  header: 'Base Salary',   render: r => `$${r.baseSalary.toFixed(2)}` },
    { key: 'deductions',  header: 'Deductions',    render: r => <span className="text-rose-600 font-bold">-${r.deductions.toFixed(2)}</span> },
    { key: 'bonus',       header: 'Bonus',         render: r => <span className="text-emerald-600 font-bold">+${r.bonus.toFixed(2)}</span> },
    { key: 'netSalary',   header: 'Net Salary',    render: r => <span className="font-black text-violet-700">${r.netSalary.toFixed(2)}</span> },
    { key: 'reason',      header: 'Reason',        render: r => r.reason || '—' }
  ]

  return (
    <DashboardLayout title="Salary Management">
      <div className="space-y-5">
        <div className="flex justify-between items-center gap-3">
          <select className="input-field w-28" value={yearFilter} onChange={e => setYearFilter(Number(e.target.value))}>
            {[currentYear, currentYear - 1, currentYear - 2].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Salary
          </button>
        </div>

        <div className="card p-0 overflow-hidden">
          <Table columns={columns} data={salaries} loading={loading} emptyMessage="No salary records" />
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="💰 Salary Record">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Staff Member *</label>
            <select className="input-field" value={form.staffId} onChange={e => setForm(p => ({ ...p, staffId: e.target.value }))} required>
              <option value="">Select staff...</option>
              {staffList.map(s => <option key={s.id} value={s.staffProfile?.id}>{s.staffProfile ? `${s.staffProfile.firstName} ${s.staffProfile.lastName}` : s.email}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Month *</label>
              <select className="input-field" value={form.month} onChange={e => setForm(p => ({ ...p, month: e.target.value }))}>
                {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Year *</label>
              <input type="number" className="input-field" value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} required />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="label">Base Salary *</label><input type="number" step="0.01" className="input-field" value={form.baseSalary} onChange={e => setForm(p => ({ ...p, baseSalary: e.target.value }))} required min="0" /></div>
            <div><label className="label">Deductions</label><input type="number" step="0.01" className="input-field" value={form.deductions} onChange={e => setForm(p => ({ ...p, deductions: e.target.value }))} min="0" /></div>
            <div><label className="label">Bonus</label><input type="number" step="0.01" className="input-field" value={form.bonus} onChange={e => setForm(p => ({ ...p, bonus: e.target.value }))} min="0" /></div>
          </div>
          <div className="bg-gradient-to-r from-violet-50 to-orange-50 rounded-2xl p-4 border-2 border-orange-100 flex items-center justify-between">
            <span className="text-sm font-bold text-violet-700">Net Salary</span>
            <span className="text-2xl font-black text-violet-700">${net.toFixed(2)}</span>
          </div>
          <div><label className="label">Reason / Notes</label><textarea className="input-field" rows={2} value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {submitting ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><DollarSign size={14} /> Save</>}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}

export default AdminSalary
