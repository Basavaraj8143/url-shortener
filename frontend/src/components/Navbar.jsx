import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          Snip<span className="navbar-scissors">✂</span>
        </Link>

        <button
          className={`navbar-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="toggle-bar" />
          <span className="toggle-bar" />
          <span className="toggle-bar" />
        </button>

        <nav className={`navbar-links ${menuOpen ? 'show' : ''}`}>
          {user ? (
            <>
              <span className="navbar-user">👤 {user.username}</span>
              <Link to="/dashboard" className="nav-pill" onClick={closeMenu}>
                <span>My URLs</span>
              </Link>
              <button onClick={handleLogout} className="nav-pill">
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-pill" onClick={closeMenu}><span>Login</span></Link>
              <Link to="/register" className="nav-pill active" onClick={closeMenu}><span>Register</span></Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
