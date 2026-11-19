import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client, { getShortUrl } from '../api/client'
import { useAuth } from '../context/AuthContext'

function Icon({ name, size = 16 }) {
  const paths = {
    link: <><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" /><path d="M14 11a5 5 0 0 0-7.07 0l-3 3A5 5 0 0 0 11 21.07l1.72-1.72" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    copy: <><rect x="8" y="8" width="13" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
    chart: <><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-5 5" /></>,
    trash: <><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="m19 6-1 14H6L5 6" /><path d="M10 11v5M14 11v5" /></>,
    clicks: <><path d="m5 3 14 9-7 1-3 7L5 3Z" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  }

  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

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
    const short = getShortUrl(url.shortCode)
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
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem' }}>
          <div>
            <h2 className="dashboard-title" style={{ marginBottom: '0.25rem', color: 'var(--color-ink)' }}>My links</h2>
            <p style={{ color: 'var(--color-ink-light)', fontSize: '0.9rem' }}>
              Welcome back, <strong>{user?.username}</strong> · {urls.length} link{urls.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link to="/dashboard/new" id="create-url-btn" className="btn">
            <span className="button-with-icon"><Icon name="plus" /> Create short link</span>
          </Link>
        </div>

        {alert && <div className={`alert alert-${alert.type}`} style={{ marginTop: '1rem' }}>{alert.msg}</div>}

        {/* URL List Card */}
        <div className="card card-wide">
          {loading && <div className="skeleton" />}
          {error   && <div className="alert alert-error">{error}</div>}

          {!loading && !error && urls.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon"><Icon name="link" size={30} /></div>
              <p>No URLs yet. Create your first one!</p>
              <Link to="/dashboard/new" className="btn"><span>✂ Create Short URL</span></Link>
            </div>
          )}

          {!loading && urls.length > 0 && (
            <div className="url-list">
              {[...urls]
                .sort((a, b) => {
                  const aExpired = a.expiresAt && new Date(a.expiresAt) < new Date()
                  const bExpired = b.expiresAt && new Date(b.expiresAt) < new Date()
                  return Number(Boolean(aExpired)) - Number(Boolean(bExpired))
                })
                .map(url => {
                const shortUrl = getShortUrl(url.shortCode)
                const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date()
                return (
                  <div key={url.id} className="url-item" style={{ opacity: isExpired ? 0.65 : 1 }}>
                    <div className="url-item-header">
                      <div style={{ flex: 1 }}>
                        <a
                          className="url-short-link"
                          href={shortUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Open short link"
                        >
                          <Icon name="link" />{' '}
                          {shortUrl}
                          {copiedId === url.id && <span style={{ marginLeft: 8, fontSize: '0.8rem', color: 'var(--color-success)' }}>✓ Copied!</span>}
                        </a>
                        <div className="url-original">→ {url.longUrl}</div>
                      </div>
                      <div className="url-actions">
                        <button
                          className="btn btn-secondary btn-small"
                          onClick={() => handleCopy(url, url.id)}
                        >
                          <Icon name="copy" />{' '}
                          {copiedId === url.id ? 'Copied' : 'Copy'}
                        </button>
                        <button
                          className="btn btn-secondary btn-small"
                          onClick={() => handleViewStats(url.id)}
                        >
                          <span className="button-with-icon"><Icon name="chart" /> Stats</span>
                        </button>
                        <button
                          className="btn btn-danger btn-small"
                          onClick={() => handleDelete(url.id)}
                        >
                          <span className="button-with-icon"><Icon name="trash" /> Delete</span>
                        </button>
                      </div>
                    </div>

                    <div className="url-meta">
                      <div className="url-meta-item"><Icon name="clicks" /><span>{url.clickCount ?? 0} clicks</span></div>
                      <div className="url-meta-item"><Icon name="calendar" /><span>{new Date(url.createdAt).toLocaleDateString()}</span></div>
                      {url.expiresAt && (
                        <div className="url-meta-item">
                          <Icon name="clock" />
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
                            <h3 className="button-with-icon"><Icon name="chart" /> Statistics</h3>
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
