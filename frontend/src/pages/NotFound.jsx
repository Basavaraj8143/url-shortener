import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="page animate-in" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
    }}>
      <div className="container" style={{ paddingTop: 0 }}>
        <div className="card" style={{ maxWidth: 500 }}>

          {/* Scissors icon */}
          <div style={{
            fontSize: '5rem',
            marginBottom: '1rem',
            animation: 'snip 2s ease-in-out infinite',
            display: 'inline-block',
          }}>
            ✂
          </div>

          {/* 404 number */}
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(5rem, 15vw, 8rem)',
            color: 'var(--color-accent)',
            lineHeight: 1,
            marginBottom: '0.5rem',
            letterSpacing: '-0.04em',
          }}>
            404
          </div>

          <h2 style={{ marginBottom: '0.75rem' }}>Page not found</h2>

          <p style={{
            color: 'var(--color-ink-light)',
            marginBottom: '2rem',
            lineHeight: 1.7,
            fontStyle: 'italic',
          }}>
            Looks like this link was snipped a bit too short.<br />
            The page you&apos;re looking for doesn&apos;t exist.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn">
              <span>← Back to Home</span>
            </Link>
            <Link to="/dashboard" className="btn btn-secondary">
              <span>My URLs</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
