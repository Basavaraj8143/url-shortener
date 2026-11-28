import { SignUp } from '@clerk/react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import usePageTitle from '../hooks/usePageTitle'

export default function Register() {
  usePageTitle('Create account')
  const { user } = useAuth()
  if (user) return <Navigate to="/dashboard" replace />

  return (
    <main className="page auth-page animate-in">
      <div className="container auth-container">
        <SignUp
          routing="hash"
          signInUrl="/login"
          forceRedirectUrl="/dashboard"
          appearance={{ elements: { rootBox: 'clerk-auth-root', card: 'clerk-auth-card' } }}
        />
      </div>
    </main>
  )
}
