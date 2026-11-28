import { Link } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'
import './NotFound.css'

export default function NotFound() {
  usePageTitle('Page not found')
  return (
    <main className="nf-page">
      <div className="nf-bg" aria-hidden="true" />

      <div className="nf-card">

        {/* SVG Illustration */}
        <div className="nf-illustration" aria-hidden="true">
          <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Chain link left */}
            <rect x="20" y="88" width="90" height="24" rx="12" stroke="var(--color-accent)" strokeWidth="4" fill="var(--color-paper)"/>
            <rect x="90" y="88" width="30" height="24" rx="0" fill="var(--color-paper)" stroke="none"/>

            {/* Chain link right */}
            <rect x="210" y="88" width="90" height="24" rx="12" stroke="var(--color-accent)" strokeWidth="4" fill="var(--color-paper)"/>
            <rect x="210" y="88" width="30" height="24" rx="0" fill="var(--color-paper)" stroke="none"/>

            {/* Broken gap — jagged ends */}
            <path d="M118 96 L130 100 L122 108 L136 112" stroke="var(--color-accent-dark)" strokeWidth="3" strokeLinecap="round"/>
            <path d="M202 96 L190 100 L198 108 L184 112" stroke="var(--color-accent-dark)" strokeWidth="3" strokeLinecap="round"/>

            {/* Scissors body */}
            <g transform="translate(140, 60) rotate(45)">
              <ellipse cx="0" cy="-30" rx="6" ry="32" fill="var(--color-accent)" opacity="0.9"/>
              <ellipse cx="0" cy="30" rx="6" ry="32" fill="var(--color-accent-dark)" opacity="0.9"/>
              <circle cx="0" cy="0" r="7" fill="var(--color-ink)" stroke="var(--color-paper)" strokeWidth="2"/>
              <circle cx="0" cy="0" r="3" fill="var(--color-paper)"/>
              <ellipse cx="-14" cy="-52" rx="10" ry="14" stroke="var(--color-accent)" strokeWidth="3" fill="none"/>
              <ellipse cx="14" cy="52" rx="10" ry="14" stroke="var(--color-accent-dark)" strokeWidth="3" fill="none"/>
            </g>

            {/* Floating paper tag */}
            <g transform="translate(220, 30) rotate(12)">
              <rect x="0" y="0" width="64" height="44" rx="6" fill="var(--color-white)" stroke="var(--color-accent)" strokeWidth="2"/>
              <line x1="32" y1="0" x2="32" y2="-14" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="3 2"/>
              <circle cx="32" cy="-16" r="3" fill="var(--color-accent)"/>
              <text x="32" y="20" textAnchor="middle" fontFamily="Georgia, serif" fontSize="13" fontWeight="bold" fill="var(--color-accent-dark)">404</text>
              <line x1="10" y1="30" x2="54" y2="30" stroke="var(--color-border)" strokeWidth="1.5"/>
              <line x1="10" y1="37" x2="40" y2="37" stroke="var(--color-border)" strokeWidth="1.5"/>
            </g>

            {/* Small sparkles */}
            <text x="60"  y="70"  fontSize="14" fill="var(--color-accent)" opacity="0.6">✦</text>
            <text x="250" y="150" fontSize="10" fill="var(--color-accent-dark)" opacity="0.5">✦</text>
            <text x="30"  y="150" fontSize="8"  fill="var(--color-accent)" opacity="0.4">✦</text>
          </svg>
        </div>

        <div className="nf-number">404</div>

        <h1 className="nf-title">Oops — link snipped!</h1>

        <p className="nf-desc">
          The page you&apos;re looking for has been cut a bit too short,
          moved, or never existed.
        </p>

        <div className="nf-actions">
          <Link to="/" className="btn">
            <span>← Back to home</span>
          </Link>
          <Link to="/dashboard" className="btn btn-secondary">
            <span>My links</span>
          </Link>
          <button className="btn btn-secondary" onClick={() => window.history.back()}>
            <span>Go back</span>
          </button>
        </div>
      </div>
    </main>
  )
}
