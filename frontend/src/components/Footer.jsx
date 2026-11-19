import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Footer() {
  const { user } = useAuth()

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-branding">
          <Link to="/" className="footer-brand">Snip<span>·</span></Link>
          <p>Short links, simply managed.</p>
        </div>
        <nav className="site-footer-links" aria-label="Footer navigation">
          <Link to="/">Home</Link>
          {user ? <Link to="/dashboard">My links</Link> : <Link to="/login">Sign in</Link>}
        </nav>
        <span className="site-footer-copyright">© {new Date().getFullYear()} Snip</span>
      </div>
    </footer>
  )
}
