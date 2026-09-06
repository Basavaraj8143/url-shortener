import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [urls, setUrls]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [alert, setAlert]       = useState(null)
  const [statsId, setStatsId]   = useState(null)
  const [stats, setStats]       = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    client.get('/api/urls')
      .then(res => setUrls(res.data))
      .catch(() => setError('Failed to load URLs'))
      .finally(() => setLoading(false))
  }, [])

  function showAlert(msg, type = 'success') {
    setAlert({ msg, type })
    setTimeout(() => setAlert(null), 4000)
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this URL?')) return
    try {
      await client.delete(`/api/urls/${id}`)
      setUrls(prev => prev.filter(u => u.id !== id))
      showAlert('✓ URL deleted successfully')
    } catch {
      showAlert('Failed to delete URL', 'error')
    }
  }

  async function handleCopy(url, id) {
    const short = `${window.location.origin}/${url.shortCode}`
    await navigator.clipboard.writeText(short)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  async function handleViewStats(id) {
    if (statsId === id) { setStatsId(null); setStats(null); return }
    setStatsId(id)
    setStats(null)
    setStatsLoading(true)
    try {
      const res = await client.get(`/api/urls/${id}/stats`)
      setStats(res.data)
    } catch {
      showAlert('Failed to load stats', 'error')
      setStatsId(null)
    } finally {
      setStatsLoading(false)
    }
  }

  return (
    <div className="page animate-in" style={{ paddingBottom: '3rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.25rem', color: 'var(--color-ink)' }}>📎 My Shortened URLs</h2>
            <p style={{ color: 'var(--color-ink-light)', fontSize: '0.9rem' }}>
              Welcome back, <strong>{user?.username}</strong> · {urls.length} link{urls.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link to="/dashboard/new" id="create-url-btn" className="btn">
            <span>✂ Create Short URL</span>
          </Link>
        </div>

        {alert && <div className={`alert alert-${alert.type}`} style={{ marginTop: '1rem' }}>{alert.msg}</div>}

        {/* URL List Card */}
        <div className="card card-wide">
          {loading && <div className="skeleton" />}
          {error   && <div className="alert alert-error">{error}</div>}

          {!loading && !error && urls.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🔗</div>
              <p>No URLs yet. Create your first one!</p>
              <Link to="/dashboard/new" className="btn"><span>✂ Create Short URL</span></Link>
            </div>
          )}

          {!loading && urls.length > 0 && (
            <div className="url-list">
              {urls.map(url => {
                const shortUrl = `${window.location.origin}/${url.shortCode}`
                const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date()
                return (
                  <div key={url.id} className="url-item" style={{ opacity: isExpired ? 0.65 : 1 }}>
                    <div className="url-item-header">
                      <div style={{ flex: 1 }}>
                        <span
                          className="url-short-link"
                          onClick={() => handleCopy(url, url.id)}
                          title="Click to copy"
                        >
                          {shortUrl}
                          {copiedId === url.id && <span style={{ marginLeft: 8, fontSize: '0.8rem', color: 'var(--color-success)' }}>✓ Copied!</span>}
                        </span>
                        <div className="url-original">→ {url.longUrl}</div>
                      </div>
                      <div className="url-actions">
                        <button
                          className="btn btn-secondary btn-small"
                          onClick={() => handleViewStats(url.id)}
                        >
                          <span>📊 Stats</span>
                        </button>
                        <button
                          className="btn btn-danger btn-small"
                          onClick={() => handleDelete(url.id)}
                        >
                          <span>🗑</span>
                        </button>
                      </div>
                    </div>

                    <div className="url-meta">
                      <div className="url-meta-item"><span>👆</span><span>{url.clickCount ?? 0} clicks</span></div>
                      <div className="url-meta-item"><span>📅</span><span>{new Date(url.createdAt).toLocaleDateString()}</span></div>
                      {url.expiresAt && (
                        <div className="url-meta-item">
                          <span>⏰</span>
                          <span style={{ color: isExpired ? 'var(--color-error)' : 'inherit' }}>
                            {isExpired ? 'Expired ' : 'Expires '}{new Date(url.expiresAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Inline Stats Panel */}
                    {statsId === url.id && (
                      <div className="stats-panel">
                        {statsLoading ? (
                          <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                            <span className="spinner spinner-ink" />
                          </div>
                        ) : stats && (
                          <>
                            <h3>📊 Statistics</h3>
                            <div className="stats-row">
                              <div className="stats-item">
                                <span className="stats-label">Total Clicks</span>
                                <span className="stats-click">{stats.clicks ?? 0}</span>
                              </div>
                              <div className="stats-item">
                                <span className="stats-label">Created</span>
                                <span className="stats-value">{new Date(stats.createdAt).toLocaleString()}</span>
                              </div>
                              <div className="stats-item">
                                <span className="stats-label">Expires</span>
                                <span className="stats-value">
                                  {stats.expiresAt ? new Date(stats.expiresAt).toLocaleString() : 'Never'}
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
