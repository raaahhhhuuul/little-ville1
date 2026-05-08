import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { logout } from '../../api/auth'
import toast from 'react-hot-toast'
import {
  LayoutDashboard, Users, ClipboardList, DollarSign, Bell, BarChart3,
  BookOpen, GraduationCap, CheckSquare, User, LogOut, X, School
} from 'lucide-react'

const adminNav = [
  { to: '/admin',              icon: LayoutDashboard, label: 'Dashboard',       end: true },
  { to: '/admin/users',        icon: Users,           label: 'Users'                      },
  { to: '/admin/attendance',   icon: ClipboardList,   label: 'Staff Attendance'           },
  { to: '/admin/salary',       icon: DollarSign,      label: 'Salary'                     },
  { to: '/admin/notifications',icon: Bell,            label: 'Notifications'              },
  { to: '/admin/analytics',    icon: BarChart3,       label: 'Analytics'                  }
]

const staffNav = [
  { to: '/staff',               icon: LayoutDashboard, label: 'Dashboard',  end: true },
  { to: '/staff/classes',       icon: School,          label: 'Classes'               },
  { to: '/staff/attendance',    icon: ClipboardList,   label: 'Attendance'            },
  { to: '/staff/quizzes',       icon: BookOpen,        label: 'Quizzes'               },
  { to: '/staff/notifications', icon: Bell,            label: 'Notifications'         }
]

const studentNav = [
  { to: '/student',               icon: LayoutDashboard, label: 'Dashboard',     end: true },
  { to: '/student/attendance',    icon: ClipboardList,   label: 'Attendance'               },
  { to: '/student/subjects',      icon: BookOpen,        label: 'Subjects'                 },
  { to: '/student/quizzes',       icon: CheckSquare,     label: 'Quizzes'                  },
  { to: '/student/notifications', icon: Bell,            label: 'Notifications'            },
  { to: '/student/profile',       icon: User,            label: 'Profile'                  }
]

const navMap   = { ADMIN: adminNav, STAFF: staffNav, STUDENT: studentNav }
const roleMeta = {
  ADMIN:   { label: 'Administrator', emoji: '👑' },
  STAFF:   { label: 'Staff Member',  emoji: '🍎' },
  STUDENT: { label: 'Student',       emoji: '🎒' }
}

const Sidebar = ({ mobileOpen, onClose }) => {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const nav       = navMap[user?.role] || []
  const meta      = roleMeta[user?.role] || {}

  const handleLogout = async () => {
    await logout()
    toast.success('See you next time! 👋')
    navigate('/login')
  }

  const profile     = user?.studentProfile || user?.staffProfile
  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : user?.email?.split('@')[0]

  const initials = displayName?.slice(0, 2).toUpperCase()

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-white/15">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg shrink-0">
            <GraduationCap size={24} className="text-violet-600" />
          </div>
          <div>
            <p className="font-display text-2xl text-white leading-none">Little Ville</p>
            <p className="text-white/55 text-xs font-semibold mt-0.5 tracking-wide uppercase">
              Learning Together
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {nav.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-white text-violet-700 shadow-lg shadow-black/10 scale-[1.02]'
                  : 'text-white/70 hover:bg-white/15 hover:text-white hover:scale-[1.01]'
              }`
            }
          >
            <Icon size={18} strokeWidth={isActive => isActive ? 2.5 : 2} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User / logout */}
      <div className="px-4 pb-5 pt-3 border-t border-white/15">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 border border-white/30">
            <span className="text-white text-sm font-bold">{initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-bold truncate">{displayName}</p>
            <p className="text-white/55 text-xs flex items-center gap-1">
              {meta.emoji} {meta.label}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold
                     text-white/65 hover:bg-white/15 hover:text-white transition-all duration-200"
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
      <aside
        className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-30 shadow-2xl"
        style={{ background: 'linear-gradient(160deg, #7C3AED 0%, #5B21B6 60%, #4C1D95 100%)' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <aside
            className="relative flex flex-col w-64 h-full shadow-2xl animate-slide-in"
            style={{ background: 'linear-gradient(160deg, #7C3AED 0%, #5B21B6 60%, #4C1D95 100%)' }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/15 text-white hover:bg-white/25 transition-colors"
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
