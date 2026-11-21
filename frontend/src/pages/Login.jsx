import { SignIn } from '@clerk/react'

export default function Login() {
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
