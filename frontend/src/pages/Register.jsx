import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import client, { getApiError } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Register() {
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
      const res = await client.post('/register', form)
      login(res.data.token, res.data.username)
      navigate('/dashboard')
    } catch (err) {
      setError(getApiError(err, 'Registration failed. Username may already be taken.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page animate-in" style={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: 0 }}>
        <div className="card">
          <h2>✍ Create Account</h2>

          {error && <div className="alert alert-error">{error}</div>}

          <form id="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-username">Username</label>
              <input
                id="reg-username"
                name="username"
                type="text"
                required
                autoFocus
                minLength={3}
                className="form-input"
                placeholder="Choose a username"
                value={form.username}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                name="password"
                type="password"
                required
                minLength={6}
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              disabled={loading}
              className="btn btn-full"
            >
              {loading ? <span className="spinner" /> : <span>Create Account</span>}
            </button>
          </form>

          <div className="auth-toggle">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Login here</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
