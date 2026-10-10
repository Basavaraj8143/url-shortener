import { useState } from 'react'
import { Link } from 'react-router-dom'
import client, { getApiError, getShortUrl } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Landing() {
  const [longUrl, setLongUrl]       = useState('')
  const [customAlias, setCustomAlias] = useState('')
   const [expiryDays, setExpiryDays] = useState('7')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [result, setResult]   = useState(null)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied]   = useState(false)
  const { user } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setResult(null)
    setLoading(true)

    const payload = { longUrl }
    if (customAlias.trim()) payload.customAlias = customAlias.trim()
     if (expiryDays) payload.expiryDays = Number(expiryDays)
    try {
      const res = await client.post('/api/urls', payload)
       setResult({
         url: getShortUrl(res.data.shortCode),
         expiresAt: res.data.expiresAt,
       })
    } catch (err) {
      setError(getApiError(err, 'Failed to shorten URL. Try again.'))
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
     await navigator.clipboard.writeText(result.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="page animate-in" style={{ paddingBottom: '2rem' }}>
      {/* Header */}
      <header style={{ textAlign: 'center', padding: '4rem 2rem 1rem' }}>
        <h1>Elegant URL Shortening</h1>
        <p style={{ color: 'var(--color-ink-light)', fontStyle: 'italic', fontSize: '1.1rem', marginTop: '0.5rem' }}>
          Handcrafted with care, powered by Java &amp; Redis
        </p>
      </header>

      <div className="container" style={{ paddingTop: 0 }}>
        {/* Shorten Card */}
        <div className="card">
          {user ? (
            <>
              <h2>✨ Shorten Your Link</h2>

              {error && <div className="alert alert-error">{error}</div>}

              <form onSubmit={handleSubmit} id="landing-shorten-form">
            <div className="form-group">
              <label className="form-label" htmlFor="landing-url">Original URL</label>
              <input
                id="landing-url"
                type="url"
                required
                className="form-input"
                placeholder="https://example.com/very/long/url/here"
                value={longUrl}
                onChange={e => setLongUrl(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="advanced-toggle"
              onClick={() => setShowAdvanced(v => !v)}
            >
              ⚙ {showAdvanced ? 'Hide' : 'Advanced'} Options
            </button>

            {showAdvanced && (
              <div className="advanced-options">
                <div className="form-group">
                  <label className="form-label" htmlFor="landing-alias">Custom Alias (Optional)</label>
                  <input
                    id="landing-alias"
                    type="text"
                    className="form-input"
                    placeholder="my-custom-link"
                    value={customAlias}
                    onChange={e => setCustomAlias(e.target.value)}
                  />
                </div>
                     <div className="form-group">
                       <label className="form-label" htmlFor="landing-expiry">Expires In (Days)</label>
                       <input
                         id="landing-expiry"
                         type="number"
                         min="1"
                         max="365"
                         required
                         className="form-input"
                         value={expiryDays}
                         onChange={e => setExpiryDays(e.target.value)}
                       />
                     </div>
              </div>
            )}

            <button
              id="landing-shorten-btn"
              type="submit"
              disabled={loading}
              className="btn btn-full"
            >
              {loading
                ? <span className="spinner" />
                : <span>✂ Shorten URL</span>
              }
            </button>
              </form>

              {result && (
                <div className="result-box">
                  <h3>✓ Your shortened URL is ready!</h3>
                  <div className="short-url-display">
                    <span className="short-url-text">{result}</span>
                    <button
                      id="landing-copy-btn"
                      onClick={handleCopy}
                      className={`copy-btn ${copied ? 'copied' : ''}`}
                    >
                      {copied ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                   <p style={{ color: 'var(--color-ink-light)', marginTop: '0.75rem', fontSize: '0.9rem' }}>
                     Expires {new Date(result.expiresAt).toLocaleString()}
                   </p>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <h2>✨ Shorten Your Link</h2>
              <p style={{ color: 'var(--color-ink-light)', marginBottom: '1.5rem' }}>
                Sign in to create and manage your short URLs.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/login" className="btn">
                  <span>Login to Shorten</span>
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  <span>Create Account</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Why Snip?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: '✂', title: 'Instant Shortening',  desc: 'Generate short links in milliseconds with Redis-powered caching.' },
              { icon: '📊', title: 'Click Analytics',     desc: 'Track every click with real-time counters per short link.' },
              { icon: '🎯', title: 'Custom Aliases',      desc: 'Create branded links like /myresume instead of random codes.' },
              { icon: '⏰', title: 'Expiry Control',      desc: 'Set links to expire automatically after a chosen number of days.' },
              { icon: '🔒', title: 'JWT Auth',            desc: 'Secure multi-user accounts with industry-standard JWT tokens.' },
              { icon: '🐳', title: 'Docker Ready',        desc: 'Ship the entire stack with a single docker compose up.' },
            ].map(f => (
              <div key={f.title} className="card" style={{ margin: 0, maxWidth: '100%' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--color-ink-light)', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>Handcrafted with ♥ using Java, Spring Boot, MySQL &amp; Redis</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
          <a href="https://github.com/Basavaraj8143/url-shortener" target="_blank" rel="noreferrer">View on GitHub</a>
        </p>
      </footer>
    </div>
  )
}
