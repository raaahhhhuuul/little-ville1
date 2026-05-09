import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Pinwheel } from './components/common/LoadingSpinner'
import StudentRoute from './routes/StudentRoute'
import PortalRoute from './routes/PortalRoute'
import AdminRoute from './routes/AdminRoute'

// Auth pages
import StudentLogin  from './pages/auth/Login'
import StudentSignup from './pages/auth/Signup'
import PortalLogin   from './pages/portal/Login'
import StaffSignup   from './pages/portal/Signup'

// Admin pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminAttendance from './pages/admin/Attendance'
import AdminSalary from './pages/admin/Salary'
import AdminNotifications from './pages/admin/Notifications'
import AdminAnalytics from './pages/admin/Analytics'

// Staff pages
import StaffDashboard from './pages/staff/Dashboard'
import StaffAttendance from './pages/staff/Attendance'
import StaffClasses from './pages/staff/Classes'
import StaffQuizzes from './pages/staff/Quizzes'
import StaffNotifications from './pages/staff/Notifications'
import StaffProfile from './pages/staff/Profile'

// Student pages
import StudentDashboard from './pages/student/Dashboard'
import StudentAttendance from './pages/student/Attendance'
import StudentSubjects from './pages/student/Subjects'
import StudentQuizzes from './pages/student/Quizzes'
import StudentNotifications from './pages/student/Notifications'
import StudentProfile from './pages/student/Profile'

// Startup screen — shown only during initial auth check
const StartupScreen = ({ exiting }) => (
  <div
    className={`fixed inset-0 z-[100] flex flex-col items-center justify-center ${exiting ? 'animate-startup-exit' : 'animate-fade-in'}`}
    style={{ background: 'linear-gradient(160deg, #FFFBEB 0%, #F3F0FF 60%, #EEF2FF 100%)' }}
  >
    <div className="flex flex-col items-center gap-5">
      <div style={{ animation: 'spin 1.8s linear infinite' }}>
        <Pinwheel size={88} />
      </div>
      <div className="text-center">
        <h1 className="font-display text-4xl text-violet-700 leading-none">Little Ville</h1>
        <p className="text-amber-600 text-xs font-medium mt-2 tracking-widest uppercase">
          Kindergarten Management
        </p>
      </div>
      <div className="flex gap-1.5">
        {['bg-orange-400', 'bg-violet-400', 'bg-sky-400'].map((c, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 ${c} animate-bounce`}
            style={{ animationDelay: `${i * 120}ms`, animationDuration: '0.8s' }}
          />
        ))}
      </div>
    </div>
  </div>
)

const AppRoutes = () => {
  const { loading, loggingOut } = useAuth()
  const [showStartup, setShowStartup] = useState(true)
  const [exiting, setExiting]         = useState(false)

  useEffect(() => {
    if (loggingOut) {
      // Logout started — bring the screen back
      setShowStartup(true)
      setExiting(false)
    } else if (!loading && showStartup) {
      // Auth resolved (initial load or post-logout) — exit the screen
      setExiting(true)
      const t = setTimeout(() => setShowStartup(false), 450)
      return () => clearTimeout(t)
    }
  }, [loading, loggingOut, showStartup])

  return (
    <>
      <Routes>
        {/* ── Student Portal ─────────────────────────────────── */}
        <Route path="/login"  element={<StudentLogin />} />
        <Route path="/signup" element={<StudentSignup />} />
        <Route path="/dashboard" element={<StudentRoute><StudentDashboard /></StudentRoute>} />
        <Route path="/attendance" element={<StudentRoute><StudentAttendance /></StudentRoute>} />
        <Route path="/subjects" element={<StudentRoute><StudentSubjects /></StudentRoute>} />
        <Route path="/quizzes" element={<StudentRoute><StudentQuizzes /></StudentRoute>} />
        <Route path="/notifications" element={<StudentRoute><StudentNotifications /></StudentRoute>} />
        <Route path="/profile" element={<StudentRoute><StudentProfile /></StudentRoute>} />

        {/* ── Staff/Admin Portal ─────────────────────────────── */}
        <Route path="/portal/login"   element={<PortalLogin />} />
        <Route path="/portal/signup"  element={<StaffSignup />} />
        <Route path="/portal"         element={<Navigate to="/portal/login" replace />} />

        <Route path="/portal/staff/dashboard" element={<PortalRoute><StaffDashboard /></PortalRoute>} />
        <Route path="/portal/staff/classes" element={<PortalRoute><StaffClasses /></PortalRoute>} />
        <Route path="/portal/staff/attendance" element={<PortalRoute><StaffAttendance /></PortalRoute>} />
        <Route path="/portal/staff/quizzes" element={<PortalRoute><StaffQuizzes /></PortalRoute>} />
        <Route path="/portal/staff/notifications" element={<PortalRoute><StaffNotifications /></PortalRoute>} />
        <Route path="/portal/staff/profile" element={<PortalRoute><StaffProfile /></PortalRoute>} />

        <Route path="/portal/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/portal/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/portal/admin/attendance" element={<AdminRoute><AdminAttendance /></AdminRoute>} />
        <Route path="/portal/admin/salary" element={<AdminRoute><AdminSalary /></AdminRoute>} />
        <Route path="/portal/admin/notifications" element={<AdminRoute><AdminNotifications /></AdminRoute>} />
        <Route path="/portal/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />

        {/* ── Root & catch-all ───────────────────────────────── */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      {showStartup && <StartupScreen exiting={exiting} />}
    </>
  )
}

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
)

export default App
