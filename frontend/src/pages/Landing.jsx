import { useState } from 'react'
import { Link } from 'react-router-dom'
import client, { getApiError, getShortUrl } from '../api/client'
import { useAuth } from '../context/AuthContext'

const steps = [
  { number: '01', title: 'Paste a URL', description: 'Start with the destination you want people to visit.' },
  { number: '02', title: 'Set your options', description: 'Choose a custom alias or set how long the link stays active.' },
  { number: '03', title: 'Share and track', description: 'Copy your short link and check its click count in your dashboard.' },
]

export default function Landing() {
  const [longUrl, setLongUrl] = useState('')
  const [customAlias, setCustomAlias] = useState('')
  const [expiryDays, setExpiryDays] = useState('7')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const { user } = useAuth()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setResult(null)
    setLoading(true)

    const payload = { longUrl }
    if (customAlias.trim()) payload.customAlias = customAlias.trim()
    if (expiryDays) payload.expiryDays = Number(expiryDays)

    try {
      const { data } = await client.post('/api/urls', payload)
      setResult({ url: getShortUrl(data.shortCode), expiresAt: data.expiresAt })
    } catch (err) {
      setError(getApiError(err, 'We could not shorten that link. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(result.url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Could not copy the link. Select and copy it instead.')
    }
  }

  return (
    <main className="landing-page">
      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-copy">
          <h1 id="landing-title">Shorten a<br /><span>long link.</span></h1>
          <p className="landing-intro">Turn a long address into a short link, then manage it and check its clicks from your dashboard.</p>
          <div className="landing-proof">
            <span className="proof-mark" aria-hidden="true">✓</span>
            <span>Custom aliases · Click counts · Expiry controls</span>
          </div>
        </div>

        <div className="shortener-card">
          <div className="shortener-heading">
            <div>
              <span className="section-kicker">CREATE A LINK</span>
              <h2>Paste your destination</h2>
            </div>
            <span className="link-icon" aria-hidden="true">↗</span>
          </div>

          {user ? (
            <>
              <form onSubmit={handleSubmit} id="landing-shorten-form" aria-label="Create a short link">
                <label className="form-label" htmlFor="landing-url">Your destination URL</label>
                <div className="url-input-wrap">
                  <span aria-hidden="true">↗</span>
                  <input id="landing-url" type="url" required className="form-input" placeholder="https://example.com/your-page" value={longUrl} onChange={event => setLongUrl(event.target.value)} />
                </div>
                <button type="button" className="advanced-toggle" onClick={() => setShowAdvanced(value => !value)} aria-expanded={showAdvanced} aria-controls="landing-advanced-options">
                  <span aria-hidden="true">{showAdvanced ? '−' : '+'}</span> {showAdvanced ? 'Hide options' : 'Customize your link'}
                </button>
                {showAdvanced && (
                  <div className="landing-advanced" id="landing-advanced-options">
                    <div className="form-group">
                      <label className="form-label" htmlFor="landing-alias">Custom alias <span>(optional)</span></label>
                      <input id="landing-alias" type="text" className="form-input" placeholder="my-link" value={customAlias} onChange={event => setCustomAlias(event.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="landing-expiry">Expires in <span>(days)</span></label>
                      <input id="landing-expiry" type="number" min="1" max="365" required className="form-input" value={expiryDays} onChange={event => setExpiryDays(event.target.value)} />
                    </div>
                  </div>
                )}
                {error && <div className="alert alert-error" role="alert">{error}</div>}
                <button id="landing-shorten-btn" type="submit" disabled={loading} className="btn btn-full landing-submit">
                  {loading ? <><span className="spinner" /> Creating your link</> : <>Shorten URL <span aria-hidden="true">→</span></>}
                </button>
              </form>
              {result && (
                <div className="result-box" role="status" aria-live="polite">
                  <span className="result-label">YOUR SHORT LINK IS READY</span>
                  <div className="short-url-display">
                    <a className="short-url-text" href={result.url} target="_blank" rel="noreferrer">{result.url}</a>
                    <button id="landing-copy-btn" type="button" onClick={handleCopy} className={`copy-btn ${copied ? 'copied' : ''}`}>{copied ? 'Copied ✓' : 'Copy link'}</button>
                  </div>
                  {result.expiresAt && <p className="result-expiry">Available until {new Date(result.expiresAt).toLocaleDateString()}</p>}
                </div>
              )}
              <p className="shortener-footnote">Links you create are saved to your dashboard.</p>
            </>
          ) : (
            <div className="signed-out-prompt">
              <p>An account is required to create and manage short links.</p>
              <Link to="/login" className="btn btn-full landing-submit">Sign in <span aria-hidden="true">→</span></Link>
              <p className="prompt-note">New to Snip? <Link to="/register">Create an account</Link></p>
            </div>
          )}
        </div>
      </section>

      <section className="features-section" aria-labelledby="features-title">
        <div className="features-heading">
          <div>
            <span className="section-kicker">HOW IT WORKS</span>
            <h2 id="features-title">From long URL to ready to share.</h2>
          </div>
          <p>Three straightforward steps to create and manage a link.</p>
        </div>
        <div className="feature-grid">
          {steps.map(step => (
            <article className="feature-card" key={step.number}>
              <span className="feature-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

    </main>
  )
}
