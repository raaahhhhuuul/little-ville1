import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import RoleRoute from './routes/RoleRoute'

import Login from './pages/auth/Login'

import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminAttendance from './pages/admin/Attendance'
import AdminSalary from './pages/admin/Salary'
import AdminNotifications from './pages/admin/Notifications'
import AdminAnalytics from './pages/admin/Analytics'

import StaffDashboard from './pages/staff/Dashboard'
import StaffAttendance from './pages/staff/Attendance'
import StaffClasses from './pages/staff/Classes'
import StaffQuizzes from './pages/staff/Quizzes'
import StaffNotifications from './pages/staff/Notifications'
import StaffProfile from './pages/staff/Profile'

import StudentDashboard from './pages/student/Dashboard'
import StudentAttendance from './pages/student/Attendance'
import StudentSubjects from './pages/student/Subjects'
import StudentQuizzes from './pages/student/Quizzes'
import StudentNotifications from './pages/student/Notifications'
import StudentProfile from './pages/student/Profile'

const App = () => (
  <AuthProvider>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute><RoleRoute roles={['ADMIN']}><AdminDashboard /></RoleRoute></ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute><RoleRoute roles={['ADMIN']}><AdminUsers /></RoleRoute></ProtectedRoute>
      } />
      <Route path="/admin/attendance" element={
        <ProtectedRoute><RoleRoute roles={['ADMIN']}><AdminAttendance /></RoleRoute></ProtectedRoute>
      } />
      <Route path="/admin/salary" element={
        <ProtectedRoute><RoleRoute roles={['ADMIN']}><AdminSalary /></RoleRoute></ProtectedRoute>
      } />
      <Route path="/admin/notifications" element={
        <ProtectedRoute><RoleRoute roles={['ADMIN']}><AdminNotifications /></RoleRoute></ProtectedRoute>
      } />
      <Route path="/admin/analytics" element={
        <ProtectedRoute><RoleRoute roles={['ADMIN']}><AdminAnalytics /></RoleRoute></ProtectedRoute>
      } />

      {/* Staff Routes */}
      <Route path="/staff" element={
        <ProtectedRoute><RoleRoute roles={['STAFF']}><StaffDashboard /></RoleRoute></ProtectedRoute>
      } />
      <Route path="/staff/attendance" element={
        <ProtectedRoute><RoleRoute roles={['STAFF']}><StaffAttendance /></RoleRoute></ProtectedRoute>
      } />
      <Route path="/staff/classes" element={
        <ProtectedRoute><RoleRoute roles={['STAFF']}><StaffClasses /></RoleRoute></ProtectedRoute>
      } />
      <Route path="/staff/quizzes" element={
        <ProtectedRoute><RoleRoute roles={['STAFF']}><StaffQuizzes /></RoleRoute></ProtectedRoute>
      } />
      <Route path="/staff/notifications" element={
        <ProtectedRoute><RoleRoute roles={['STAFF']}><StaffNotifications /></RoleRoute></ProtectedRoute>
      } />
      <Route path="/staff/profile" element={
        <ProtectedRoute><RoleRoute roles={['STAFF']}><StaffProfile /></RoleRoute></ProtectedRoute>
      } />

      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute><RoleRoute roles={['STUDENT']}><StudentDashboard /></RoleRoute></ProtectedRoute>
      } />
      <Route path="/student/attendance" element={
        <ProtectedRoute><RoleRoute roles={['STUDENT']}><StudentAttendance /></RoleRoute></ProtectedRoute>
      } />
      <Route path="/student/subjects" element={
        <ProtectedRoute><RoleRoute roles={['STUDENT']}><StudentSubjects /></RoleRoute></ProtectedRoute>
      } />
      <Route path="/student/quizzes" element={
        <ProtectedRoute><RoleRoute roles={['STUDENT']}><StudentQuizzes /></RoleRoute></ProtectedRoute>
      } />
      <Route path="/student/notifications" element={
        <ProtectedRoute><RoleRoute roles={['STUDENT']}><StudentNotifications /></RoleRoute></ProtectedRoute>
      } />
      <Route path="/student/profile" element={
        <ProtectedRoute><RoleRoute roles={['STUDENT']}><StudentProfile /></RoleRoute></ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </AuthProvider>
)

export default App
