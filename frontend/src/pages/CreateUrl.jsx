import { useState } from 'react'
import { Link } from 'react-router-dom'
import client, { getApiError, getShortUrl } from '../api/client'

export default function CreateUrl() {
  const [longUrl, setLongUrl]         = useState('')
  const [customAlias, setCustomAlias] = useState('')
  const [expiryDays, setExpiryDays]   = useState('7')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [result, setResult]   = useState(null)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied]   = useState(false)

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
      setError(getApiError(err, 'Failed to create short URL'))
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
    <div className="page animate-in" style={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: 0 }}>
        <div className="card">
          <Link to="/dashboard" className="btn btn-secondary btn-small" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
            <span>← Back</span>
          </Link>

          <h2>✂ Create Short URL</h2>
          <p style={{ color: 'var(--color-ink-light)', marginBottom: '1.5rem', marginTop: '-0.5rem', fontStyle: 'italic' }}>
            Turn any long URL into a short, shareable link
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          {result ? (
            <div className="animate-in">
              <div className="result-box">
                <h3>✓ Your shortened URL is ready!</h3>
                <div className="short-url-display">
                  <span className="short-url-text">{result.url}</span>
                  <button
                    id="copy-result-btn"
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

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => { setResult(null); setLongUrl(''); setCustomAlias(''); setExpiryDays('7') }}
                >
                  <span>+ Create Another</span>
                </button>
                <Link to="/dashboard" className="btn">
                  <span>Go to My URLs →</span>
                </Link>
              </div>
            </div>
          ) : (
            <form id="create-url-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="cu-longUrl">Original URL</label>
                <input
                  id="cu-longUrl"
                  type="url"
                  required
                  autoFocus
                  className="form-input"
                  placeholder="https://example.com/very/long/url/here"
                  value={longUrl}
                  onChange={e => setLongUrl(e.target.value)}
                />
              </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="cu-expiry">Expires In (Days)</label>
                  <input
                    id="cu-expiry"
                    type="number"
                    min="1"
                    max="365"
                    required
                    className="form-input"
                    value={expiryDays}
                    onChange={e => setExpiryDays(e.target.value)}
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
                    <label className="form-label" htmlFor="cu-alias">Custom Alias (Optional)</label>
                    <input
                      id="cu-alias"
                      type="text"
                      className="form-input"
                      placeholder="my-custom-link"
                      value={customAlias}
                      onChange={e => setCustomAlias(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <button
                id="create-submit-btn"
                type="submit"
                disabled={loading}
                className="btn btn-full"
              >
                {loading ? <span className="spinner" /> : <span>✂ Shorten URL</span>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
