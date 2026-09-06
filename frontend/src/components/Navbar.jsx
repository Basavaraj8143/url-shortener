import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          Snip<span className="navbar-scissors">✂</span>
        </Link>

        <nav className="navbar-links">
          {user ? (
            <>
              <span className="navbar-user">👤 {user.username}</span>
              <Link to="/dashboard" className="nav-pill">
                <span>My URLs</span>
              </Link>
              <button onClick={handleLogout} className="nav-pill">
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="nav-pill"><span>Login</span></Link>
              <Link to="/register" className="nav-pill active"><span>Register</span></Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
