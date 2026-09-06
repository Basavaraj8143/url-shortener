import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm]       = useState({ username: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await client.post('/login', form)
      login(res.data.token, res.data.username)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page animate-in" style={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: 0 }}>
        <div className="card">
          <h2>🔐 Welcome Back</h2>

          {error && <div className="alert alert-error">{error}</div>}

          <form id="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-username">Username</label>
              <input
                id="login-username"
                name="username"
                type="text"
                required
                autoFocus
                className="form-input"
                placeholder="Your username"
                value={form.username}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                name="password"
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="btn btn-full"
            >
              {loading ? <span className="spinner" /> : <span>Login</span>}
            </button>
          </form>

          <div className="auth-toggle">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="auth-link">Register here</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
