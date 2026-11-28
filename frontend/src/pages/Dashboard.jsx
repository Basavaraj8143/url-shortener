import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'
import Icon from '../components/Icon'
import UrlCard from '../components/UrlCard'

function isExpired(url) {
  return url.expiresAt && new Date(url.expiresAt) < new Date()
}

export default function Dashboard() {
  const { user } = useAuth()
  const [urls, setUrls]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [alert, setAlert]     = useState(null)

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

  const sortedUrls = [...urls].sort((a, b) => Number(Boolean(isExpired(a))) - Number(Boolean(isExpired(b))))

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
              {sortedUrls.map(url => (
                <UrlCard key={url.id} url={url} onDelete={handleDelete} onNotify={showAlert} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
