import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSidebar } from '../../context/SidebarContext'
import { logout } from '../../api/auth'
import toast from 'react-hot-toast'
import {
  IconLayoutDashboard, IconUsers, IconClipboard, IconDollar, IconBell, IconBarChart,
  IconBook, IconGraduation, IconCheckSquare, IconUser, IconLogOut, IconX, IconSchool,
  IconChevronLeft, IconChevronRight
} from '../common/Icons'

// ── Nav definitions ──────────────────────────────────────────────────────────

const adminNav = [
  { to: '/portal/admin/dashboard',     icon: IconLayoutDashboard, label: 'Dashboard',      end: true },
  { to: '/portal/admin/users',         icon: IconUsers,           label: 'Users'                     },
  { to: '/portal/admin/attendance',    icon: IconClipboard,       label: 'Staff Attendance'          },
  { to: '/portal/admin/salary',        icon: IconDollar,          label: 'Salary'                    },
  { to: '/portal/admin/notifications', icon: IconBell,            label: 'Notifications'             },
  { to: '/portal/admin/analytics',     icon: IconBarChart,        label: 'Analytics'                 },
]

const staffNav = [
  { to: '/portal/staff/dashboard',     icon: IconLayoutDashboard, label: 'Dashboard',   end: true },
  { to: '/portal/staff/classes',       icon: IconSchool,          label: 'Classes'               },
  { to: '/portal/staff/attendance',    icon: IconClipboard,       label: 'Attendance'            },
  { to: '/portal/staff/quizzes',       icon: IconBook,            label: 'Quizzes'               },
  { to: '/portal/staff/notifications', icon: IconBell,            label: 'Notifications'         },
  { to: '/portal/staff/profile',       icon: IconUser,            label: 'Profile'               },
]

const studentNav = [
  { to: '/dashboard',     icon: IconLayoutDashboard, label: 'Dashboard',     end: true, color: 'bg-orange-400'  },
  { to: '/attendance',    icon: IconClipboard,       label: 'Attendance',              color: 'bg-emerald-400' },
  { to: '/subjects',      icon: IconBook,            label: 'Subjects',                color: 'bg-sky-400'     },
  { to: '/quizzes',       icon: IconCheckSquare,     label: 'Quizzes',                 color: 'bg-violet-400'  },
  { to: '/notifications', icon: IconBell,            label: 'Notifications',           color: 'bg-rose-400'    },
  { to: '/profile',       icon: IconUser,            label: 'Profile',                 color: 'bg-amber-500'   },
]

const navMap  = { ADMIN: adminNav, STAFF: staffNav, STUDENT: studentNav }
const roleMeta = {
  ADMIN:   { label: 'Administrator', tag: 'ADMIN'   },
  STAFF:   { label: 'Staff Member',  tag: 'STAFF'   },
  STUDENT: { label: 'Student',       tag: 'STUDENT' },
}

const STUDENT_BG = 'linear-gradient(160deg, #FF6F61 0%, #FF8C42 50%, #FFBB33 100%)'
const PORTAL_BG  = 'linear-gradient(180deg, #0B0720 0%, #170F3E 60%, #0E0B26 100%)'

// ── Student Sidebar ──────────────────────────────────────────────────────────

const StudentSidebar = ({ nav, collapsed, onClose, displayName, initials, onLogout }) => (
  <div className="flex flex-col h-full relative">
    {/* Bubbles — scoped overflow so they don't clip the tab toggle */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      <div className="absolute w-40 h-40 rounded-full bg-white/10 -top-12 -right-14" />
      <div className="absolute w-24 h-24 rounded-full bg-white/10 top-16 -left-8" />
      <div className="absolute w-16 h-16 rounded-full bg-white/15 top-[42%] right-2" />
      <div className="absolute w-32 h-32 rounded-full bg-white/10 bottom-[28%] -left-12" />
      <div className="absolute w-12 h-12 rounded-full bg-white/20 bottom-28 right-5" />
      <div className="absolute w-8  h-8  rounded-full bg-white/15 bottom-10 left-8" />
      <div className="absolute w-6  h-6  rounded-full bg-white/10 top-[30%] left-3" />
    </div>

    {/* Logo */}
    <div className="relative z-10 px-4 pt-5 pb-4 border-b border-white/20">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="w-9 h-9 bg-white/30 rounded-full flex items-center justify-center shrink-0 shadow-sm">
          <IconGraduation size={18} className="text-white" strokeWidth={1.5} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-display text-xl text-white leading-none whitespace-nowrap">Little Ville</p>
            <p className="text-white/60 text-[10px] font-medium mt-0.5 tracking-widest uppercase whitespace-nowrap">
              Student Portal
            </p>
          </div>
        )}
      </div>
    </div>

    {/* Nav */}
    <nav className="relative z-10 flex-1 px-2 py-3 space-y-1 overflow-y-auto">
      {nav.map(({ to, icon: Icon, label, end, color }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onClose}
          title={collapsed ? label : undefined}
          className="block"
        >
          {({ isActive }) => (
            <div className={`flex items-center transition-all duration-150 text-sm font-medium rounded-xl ${
              collapsed ? 'justify-center py-2.5 px-1' : 'gap-3 px-2.5 py-2.5'
            } ${isActive ? 'bg-white/25 text-white' : 'text-white/70 hover:text-white hover:bg-white/15'}`}>
              <div className={`rounded-full flex items-center justify-center shrink-0 transition-colors ${
                collapsed ? 'w-8 h-8' : 'w-7 h-7'
              } ${isActive ? color : 'bg-white/20'}`}>
                <Icon size={collapsed ? 16 : 14} strokeWidth={2} />
              </div>
              {!collapsed && <span className="truncate">{label}</span>}
            </div>
          )}
        </NavLink>
      ))}
    </nav>

    {/* User */}
    <div className="relative z-10 px-2 pb-4 pt-3 border-t border-white/20">
      {!collapsed && (
        <div className="flex items-center gap-2.5 mb-2.5 bg-white/15 rounded-2xl px-3 py-2.5">
          <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-medium">{initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-xs font-medium truncate leading-tight">{displayName}</p>
            <p className="text-white/50 text-[10px] mt-0.5">Student</p>
          </div>
        </div>
      )}
      <button
        onClick={onLogout}
        title={collapsed ? 'Sign Out' : undefined}
        className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-colors ${collapsed ? 'justify-center' : ''}`}
      >
        <IconLogOut size={15} className="shrink-0" />
        {!collapsed && <span>Sign Out</span>}
      </button>
    </div>
  </div>
)

// ── Portal Sidebar (Staff + Admin) ───────────────────────────────────────────

const portalAccent = {
  ADMIN: {
    strip:    'from-violet-600 via-violet-500 to-purple-500',
    glow:     'rgba(139,92,246,0.18)',
    iconBg:   'rgba(124,58,237,0.3)',
    activeBg: 'bg-violet-500/15',
    border:   'border-violet-400',
    avatarBg: 'linear-gradient(135deg,#7C3AED,#6D28D9)',
    tag:      'text-violet-300 border-violet-500/40 bg-violet-500/15',
    portal:   'Admin Portal',
  },
  STAFF: {
    strip:    'from-indigo-600 via-indigo-500 to-blue-500',
    glow:     'rgba(99,102,241,0.18)',
    iconBg:   'rgba(99,102,241,0.3)',
    activeBg: 'bg-indigo-500/15',
    border:   'border-indigo-400',
    avatarBg: 'linear-gradient(135deg,#6366F1,#4338CA)',
    tag:      'text-indigo-300 border-indigo-500/40 bg-indigo-500/15',
    portal:   'Staff Portal',
  },
}

const PortalSidebar = ({ nav, role, collapsed, onClose, displayName, initials, meta, onLogout }) => {
  const a = portalAccent[role] || portalAccent.STAFF

  return (
    <div className="flex flex-col h-full relative">
      {/* Top accent strip */}
      <div className={`h-[3px] w-full bg-gradient-to-r ${a.strip} shrink-0`} />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 75% 0%, ${a.glow} 0%, transparent 55%)` }}
      />

      {/* Logo */}
      <div className="relative z-10 px-4 pt-5 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className="w-9 h-9 flex items-center justify-center shrink-0 border border-white/10"
            style={{ background: a.iconBg }}
          >
            <IconGraduation size={17} className="text-white" strokeWidth={1.5} />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-display text-xl text-white leading-none whitespace-nowrap">Little Ville</p>
              <p className="text-white/25 text-[10px] font-medium mt-0.5 tracking-widest uppercase whitespace-nowrap">
                {a.portal}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex-1 px-1 py-3 space-y-0.5 overflow-y-auto">
        {nav.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            title={collapsed ? label : undefined}
            className="block"
          >
            {({ isActive }) => (
              <div className={`flex items-center text-sm font-medium transition-all duration-150 border-l-2 ${
                collapsed ? 'justify-center py-3 px-1' : 'gap-3 px-3 py-2.5'
              } ${
                isActive
                  ? `${a.activeBg} text-white ${a.border}`
                  : 'text-white/40 hover:text-white/75 hover:bg-white/5 border-transparent'
              }`}>
                <Icon size={16} strokeWidth={1.5} className="shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="relative z-10 px-2 pb-4 pt-3 border-t border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2.5 mb-2 px-1.5">
            <div
              className="w-7 h-7 flex items-center justify-center shrink-0"
              style={{ background: a.avatarBg }}
            >
              <span className="text-white text-[10px] font-medium">{initials}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white/80 text-xs font-medium truncate leading-tight">{displayName}</p>
              <span className={`inline-flex items-center text-[9px] font-medium tracking-widest uppercase border px-1.5 py-0.5 mt-0.5 ${a.tag}`}>
                {meta.tag}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          title={collapsed ? 'Sign Out' : undefined}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <IconLogOut size={15} className="shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  )
}

// ── Sidebar controller ───────────────────────────────────────────────────────

const SidebarContent = ({ onClose }) => {
  const { user, setUser, startLogout } = useAuth()
  const { collapsed }                  = useSidebar()
  const navigate                       = useNavigate()

  const nav  = navMap[user?.role]   || []
  const meta = roleMeta[user?.role] || {}

  const onLogout = async () => {
    const wasStudent = user?.role === 'STUDENT'
    startLogout()
    await logout()
    setUser(null)
    toast.success('Signed out successfully')
    navigate(wasStudent ? '/login' : '/portal/login', { replace: true })
  }

  const profile     = user?.studentProfile || user?.staffProfile
  const displayName = profile ? `${profile.firstName} ${profile.lastName}` : user?.email?.split('@')[0]
  const initials    = displayName?.slice(0, 2).toUpperCase()

  const shared = { nav, collapsed, onClose, displayName, initials, onLogout }

  return user?.role === 'STUDENT'
    ? <StudentSidebar {...shared} />
    : <PortalSidebar  {...shared} role={user?.role} meta={meta} />
}

// ── Collapse tab toggle ──────────────────────────────────────────────────────

const CollapseTab = ({ collapsed, onToggle, isStudent }) => (
  <button
    onClick={onToggle}
    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    className={`hidden lg:flex absolute -right-[14px] top-1/2 -translate-y-1/2 z-20
      w-[14px] h-14 rounded-r-2xl items-center justify-center shadow-lg
      transition-all duration-200 hover:w-[18px]`}
    style={
      isStudent
        ? { background: 'linear-gradient(160deg, #FF8C42, #FF6F61)' }
        : { background: '#170F3E', border: '1px solid rgba(255,255,255,0.12)', borderLeft: 'none' }
    }
  >
    {collapsed
      ? <IconChevronRight size={9} className={isStudent ? 'text-white' : 'text-white/50'} />
      : <IconChevronLeft  size={9} className={isStudent ? 'text-white' : 'text-white/50'} />}
  </button>
)

// ── Exported component ───────────────────────────────────────────────────────

const Sidebar = () => {
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar()
  const { user }                                               = useAuth()

  const isStudent    = user?.role === 'STUDENT'
  const sidebarBg    = isStudent ? STUDENT_BG : PORTAL_BG
  const desktopWidth = collapsed ? 'w-sidebar-sm' : 'w-sidebar'

  return (
    <>
      {/* Desktop — flex row participant, fills viewport height via parent h-screen */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 z-30 ${desktopWidth} transition-width duration-300 relative`}
        style={{ background: sidebarBg }}
      >
        <CollapseTab
          collapsed={collapsed}
          onToggle={() => setCollapsed(p => !p)}
          isStudent={isStudent}
        />
        <SidebarContent onClose={undefined} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside
            className="relative flex flex-col w-sidebar h-full shadow-2xl animate-slide-in"
            style={{ background: sidebarBg }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-white/50 hover:text-white transition-colors z-10"
            >
              <IconX size={16} />
            </button>
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  )
}

export default Sidebar
