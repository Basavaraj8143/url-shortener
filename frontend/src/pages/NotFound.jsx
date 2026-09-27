import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  const [seconds, setSeconds] = useState(10)
  const navigate = useNavigate()

  // Auto-redirect countdown
  useEffect(() => {
    if (seconds <= 0) { navigate('/'); return }
    const t = setTimeout(() => setSeconds(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds, navigate])

  return (
    <div className="nf-page">
      {/* Paper texture dots */}
      <div className="nf-bg" aria-hidden="true" />

      <div className="nf-card">

        {/* SVG Illustration */}
        <div className="nf-illustration" aria-hidden="true">
          <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Chain link left */}
            <rect x="20" y="88" width="90" height="24" rx="12" stroke="#d97706" strokeWidth="4" fill="#fef3c7"/>
            <rect x="90" y="88" width="30" height="24" rx="0" fill="#fef3c7" stroke="none"/>

            {/* Chain link right */}
            <rect x="210" y="88" width="90" height="24" rx="12" stroke="#d97706" strokeWidth="4" fill="#fef3c7"/>
            <rect x="210" y="88" width="30" height="24" rx="0" fill="#fef3c7" stroke="none"/>

            {/* Broken gap — jagged ends */}
            <path d="M118 96 L130 100 L122 108 L136 112" stroke="#b45309" strokeWidth="3" strokeLinecap="round"/>
            <path d="M202 96 L190 100 L198 108 L184 112" stroke="#b45309" strokeWidth="3" strokeLinecap="round"/>

            {/* Scissors body */}
            <g transform="translate(140, 60) rotate(45)">
              {/* Blade 1 */}
              <ellipse cx="0" cy="-30" rx="6" ry="32" fill="#d97706" opacity="0.9"/>
              {/* Blade 2 */}
              <ellipse cx="0" cy="30" rx="6" ry="32" fill="#b45309" opacity="0.9"/>
              {/* Screw */}
              <circle cx="0" cy="0" r="7" fill="#7c2d12" stroke="#fef3c7" strokeWidth="2"/>
              <circle cx="0" cy="0" r="3" fill="#fef3c7"/>
              {/* Handle 1 */}
              <ellipse cx="-14" cy="-52" rx="10" ry="14" stroke="#d97706" strokeWidth="3" fill="none"/>
              {/* Handle 2 */}
              <ellipse cx="14" cy="52" rx="10" ry="14" stroke="#b45309" strokeWidth="3" fill="none"/>
            </g>

            {/* Floating paper tag */}
            <g transform="translate(220, 30) rotate(12)">
              <rect x="0" y="0" width="64" height="44" rx="6" fill="#fffbeb" stroke="#d97706" strokeWidth="2"/>
              <line x1="32" y1="0" x2="32" y2="-14" stroke="#d97706" strokeWidth="2" strokeDasharray="3 2"/>
              <circle cx="32" cy="-16" r="3" fill="#d97706"/>
              <text x="32" y="20" textAnchor="middle" fontFamily="Georgia, serif" fontSize="13" fontWeight="bold" fill="#b45309">404</text>
              <line x1="10" y1="30" x2="54" y2="30" stroke="#e7dfd5" strokeWidth="1.5"/>
              <line x1="10" y1="37" x2="40" y2="37" stroke="#e7dfd5" strokeWidth="1.5"/>
            </g>

            {/* Small sparkles */}
            <text x="60"  y="70"  fontSize="14" fill="#d97706" opacity="0.6">✦</text>
            <text x="250" y="150" fontSize="10" fill="#b45309" opacity="0.5">✦</text>
            <text x="30"  y="150" fontSize="8"  fill="#d97706" opacity="0.4">✦</text>
          </svg>
        </div>

        {/* 404 number */}
        <div className="nf-number">404</div>

        <h1 className="nf-title">Oops — link snipped!</h1>

        <p className="nf-desc">
          The page you&apos;re looking for has been cut a bit too short,
          moved, or never existed.
        </p>

        {/* Countdown bar */}
        <div className="nf-countdown">
          <div className="nf-countdown-bar">
            <div
              className="nf-countdown-fill"
              style={{ width: `${(seconds / 10) * 100}%` }}
            />
          </div>
          <p className="nf-countdown-text">
            Redirecting to home in <strong>{seconds}s</strong>…
          </p>
        </div>

        {/* Actions */}
        <div className="nf-actions">
          <Link to="/" className="btn">
            <span>← Back to Home</span>
          </Link>
          <Link to="/dashboard" className="btn btn-secondary">
            <span>My URLs</span>
          </Link>
          <button className="btn btn-secondary" onClick={() => window.history.back()}>
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  )
}
