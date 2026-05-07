import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RoleRoute = ({ children, roles }) => {
  const { user } = useAuth()
  if (!user || !roles.includes(user.role)) {
    const redirectMap = { ADMIN: '/admin', STAFF: '/staff', STUDENT: '/student' }
    return <Navigate to={redirectMap[user?.role] || '/login'} replace />
  }
  return children
}

export default RoleRoute
