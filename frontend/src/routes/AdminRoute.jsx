import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/portal/login" replace />
  if (user.role === 'STUDENT') return <Navigate to="/login" replace />
  if (user.role !== 'ADMIN') return <Navigate to="/portal/staff/dashboard" replace />
  return children
}

export default AdminRoute
