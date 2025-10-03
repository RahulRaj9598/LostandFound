import { Navigate } from 'react-router-dom'
import { useAuth } from '../../stores/auth.js'

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useAuth(s => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />
  return children
}


