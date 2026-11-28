import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isCompact, setIsCompact] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const accountMenuRef = useRef(null)
  const isRegisterPage = location.pathname === '/register'

  useEffect(() => {
    function updateNavbar() {
      setIsCompact(window.scrollY > 24)
    }

    window.addEventListener('scroll', updateNavbar, { passive: true })
    updateNavbar()
    return () => window.removeEventListener('scroll', updateNavbar)
  }, [])

  useEffect(() => {
    if (!accountOpen) return undefined

    function closeOnOutsideClick(event) {
      if (!accountMenuRef.current?.contains(event.target)) setAccountOpen(false)
    }

    function closeOnEscape(event) {
      if (event.key === 'Escape') setAccountOpen(false)
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [accountOpen])

  function closeMenu() {
    setMenuOpen(false)
    setAccountOpen(false)
  }

  async function handleLogout() {
    closeMenu()
    await logout()
    navigate('/')
  }

  return (
    <header className={`navbar${isCompact ? ' navbar-compact' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={closeMenu} aria-label="Snip home">
          <span>Snip</span>
          <svg className="navbar-scissors" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="m8.2 8.2 12.3 12.3M14.5 9.5 20.5 3.5M8.2 15.8 12 12" /></svg>
        </Link>

        <button className={`navbar-toggle ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(open => !open)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
          <span className="toggle-bar" /><span className="toggle-bar" /><span className="toggle-bar" />
        </button>

        <nav className={`navbar-links ${menuOpen ? 'show' : ''}`} aria-label="Main navigation">
          {user ? (
            <>
              <NavLink to="/dashboard" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={closeMenu}>My links</NavLink>
              <div className="account-menu-wrap" ref={accountMenuRef}>
                <button
                  type="button"
                  className="account-trigger"
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                  aria-controls="account-menu"
                  onClick={() => setAccountOpen(open => !open)}
                >
                  <span className="user-avatar">{user.username?.[0]?.toUpperCase() ?? 'U'}</span>
                  <span className="account-name">{user.username}</span>
                  <svg className={`account-chevron${accountOpen ? ' open' : ''}`} aria-hidden="true" viewBox="0 0 16 16" fill="none"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                {accountOpen && (
                  <div className="account-dropdown" id="account-menu" role="menu">
                    <div className="account-dropdown-heading">
                      <span className="account-dropdown-label">SIGNED IN AS</span>
                      <strong>{user.username}</strong>
                    </div>
                    <button type="button" role="menuitem" onClick={handleLogout} className="account-logout">Log out <span aria-hidden="true">↗</span></button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {!isRegisterPage && location.pathname !== '/login' && (
                <Link to="/login" className="nav-link" onClick={closeMenu}>Sign in</Link>
              )}
              <Link to={isRegisterPage ? '/login' : '/register'} className="nav-cta" onClick={closeMenu}>{isRegisterPage ? 'Go to login' : 'Get started'} <span aria-hidden="true">→</span></Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
