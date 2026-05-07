import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import Badge from '../../components/common/Badge'
import { getUsers, createUser, deactivateUser, reactivateUser } from '../../api/admin'
import toast from 'react-hot-toast'
import { Plus, UserX, UserCheck, Loader2 } from 'lucide-react'
import { formatDate } from '../../utils/helpers'

const INITIAL_FORM = {
  email: '', password: '', role: 'STUDENT', firstName: '', lastName: '',
  designation: '', phone: '', salary: '', guardianName: '', guardianPhone: ''
}

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await getUsers({ role: roleFilter || undefined })
      setUsers(res.data.data.users)
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [roleFilter])

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = { ...form }
      if (form.role === 'STAFF') payload.salary = Number(form.salary) || 0
      if (form.role !== 'STAFF') { delete payload.designation; delete payload.salary }
      if (form.role !== 'STUDENT') { delete payload.guardianName; delete payload.guardianPhone }
      await createUser(payload)
      toast.success('User created successfully')
      setModalOpen(false)
      setForm(INITIAL_FORM)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggle = async (user) => {
    try {
      if (user.isActive) {
        await deactivateUser(user.id)
        toast.success('User deactivated')
      } else {
        await reactivateUser(user.id)
        toast.success('User reactivated')
      }
      load()
    } catch {
      toast.error('Action failed')
    }
  }

  const roleBadge = { ADMIN: 'purple', STAFF: 'blue', STUDENT: 'green' }

  const columns = [
    {
      key: 'name', header: 'Name',
      render: (u) => {
        const p = u.studentProfile || u.staffProfile
        return p ? `${p.firstName} ${p.lastName}` : '—'
      }
    },
    { key: 'email', header: 'Email' },
    {
      key: 'role', header: 'Role',
      render: (u) => <Badge variant={roleBadge[u.role]}>{u.role}</Badge>
    },
    {
      key: 'status', header: 'Status',
      render: (u) => <Badge variant={u.isActive ? 'green' : 'red'}>{u.isActive ? 'Active' : 'Inactive'}</Badge>
    },
    { key: 'createdAt', header: 'Joined', render: (u) => formatDate(u.createdAt) },
    {
      key: 'actions', header: '',
      render: (u) => (
        <button
          onClick={() => handleToggle(u)}
          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${
            u.isActive
              ? 'bg-red-50 text-red-600 hover:bg-red-100'
              : 'bg-green-50 text-green-600 hover:bg-green-100'
          }`}
        >
          {u.isActive ? <><UserX size={13} /> Deactivate</> : <><UserCheck size={13} /> Activate</>}
        </button>
      )
    }
  ]

  return (
    <DashboardLayout title="User Management">
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex gap-2">
            {['', 'ADMIN', 'STAFF', 'STUDENT'].map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  roleFilter === r ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {r || 'All'}
              </button>
            ))}
          </div>
          <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add User
          </button>
        </div>

        <div className="card p-0">
          <Table columns={columns} data={users} loading={loading} emptyMessage="No users found" />
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New User">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">First Name *</label>
              <input className="input-field" value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Last Name *</label>
              <input className="input-field" value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} required />
            </div>
          </div>
          <div>
            <label className="label">Email *</label>
            <input type="email" className="input-field" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Password *</label>
            <input type="password" className="input-field" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={6} />
          </div>
          <div>
            <label className="label">Role *</label>
            <select className="input-field" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
              <option value="STUDENT">Student</option>
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          {form.role === 'STAFF' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Designation</label>
                <input className="input-field" value={form.designation} onChange={e => setForm(p => ({ ...p, designation: e.target.value }))} />
              </div>
              <div>
                <label className="label">Base Salary</label>
                <input type="number" className="input-field" value={form.salary} onChange={e => setForm(p => ({ ...p, salary: e.target.value }))} />
              </div>
            </div>
          )}
          {form.role === 'STUDENT' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Guardian Name</label>
                <input className="input-field" value={form.guardianName} onChange={e => setForm(p => ({ ...p, guardianName: e.target.value }))} />
              </div>
              <div>
                <label className="label">Guardian Phone</label>
                <input className="input-field" value={form.guardianPhone} onChange={e => setForm(p => ({ ...p, guardianPhone: e.target.value }))} />
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {submitting ? <><Loader2 size={14} className="animate-spin" /> Creating...</> : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}

export default AdminUsers
