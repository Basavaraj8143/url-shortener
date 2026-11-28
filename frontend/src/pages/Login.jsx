import { SignIn } from '@clerk/react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import usePageTitle from '../hooks/usePageTitle'

export default function Login() {
  usePageTitle('Sign in')
  const { user } = useAuth()
  if (user) return <Navigate to="/dashboard" replace />

  return (
    <main className="page auth-page animate-in">
      <div className="container auth-container">
        <SignIn
          routing="hash"
          signUpUrl="/register"
          forceRedirectUrl="/dashboard"
          appearance={{ elements: { rootBox: 'clerk-auth-root', card: 'clerk-auth-card' } }}
        />
      </div>
    </main>
  )
}
