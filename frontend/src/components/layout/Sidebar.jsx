import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { logout } from '../../api/auth'
import toast from 'react-hot-toast'
import {
  LayoutDashboard, Users, ClipboardList, DollarSign, Bell, BarChart3,
  BookOpen, GraduationCap, CheckSquare, User, LogOut, X, School
} from 'lucide-react'

const adminNav = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/attendance', icon: ClipboardList, label: 'Staff Attendance' },
  { to: '/admin/salary', icon: DollarSign, label: 'Salary' },
  { to: '/admin/notifications', icon: Bell, label: 'Notifications' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' }
]

const staffNav = [
  { to: '/staff', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/staff/classes', icon: School, label: 'Classes' },
  { to: '/staff/attendance', icon: ClipboardList, label: 'Attendance' },
  { to: '/staff/quizzes', icon: BookOpen, label: 'Quizzes' },
  { to: '/staff/notifications', icon: Bell, label: 'Notifications' }
]

const studentNav = [
  { to: '/student', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/student/attendance', icon: ClipboardList, label: 'Attendance' },
  { to: '/student/subjects', icon: BookOpen, label: 'Subjects' },
  { to: '/student/quizzes', icon: CheckSquare, label: 'Quizzes' },
  { to: '/student/notifications', icon: Bell, label: 'Notifications' },
  { to: '/student/profile', icon: User, label: 'Profile' }
]

const navMap = { ADMIN: adminNav, STAFF: staffNav, STUDENT: studentNav }

const Sidebar = ({ mobileOpen, onClose }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const nav = navMap[user?.role] || []

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const profile = user?.studentProfile || user?.staffProfile
  const displayName = profile ? `${profile.firstName} ${profile.lastName}` : user?.email?.split('@')[0]
  const roleLabel = { ADMIN: 'Administrator', STAFF: 'Staff Member', STUDENT: 'Student' }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <GraduationCap size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight">KinderCare</p>
            <p className="text-white/60 text-xs">Management System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {nav.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">
              {displayName?.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-medium truncate">{displayName}</p>
            <p className="text-white/60 text-xs">{roleLabel[user?.role]}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white transition-all"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-60 bg-gradient-to-b from-primary-800 to-primary-900 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <aside className="relative flex flex-col w-60 h-full bg-gradient-to-b from-primary-800 to-primary-900 shadow-xl animate-slide-in">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20"
            >
              <X size={16} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}

export default Sidebar
