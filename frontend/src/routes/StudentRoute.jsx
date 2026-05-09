import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const StudentRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'STUDENT') return <Navigate to="/portal/login" replace />
  return children
}

export default StudentRoute
