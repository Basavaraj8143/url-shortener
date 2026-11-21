import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, isLoaded } = useAuth()
  if (!isLoaded) {
    return <div className="page auth-loading"><span className="spinner spinner-ink" aria-label="Loading account" /></div>
  }
  return user ? children : <Navigate to="/login" replace />
}
