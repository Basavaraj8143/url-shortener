import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import client, { getApiError } from '../api/client'
import { useAuth } from '../context/AuthContext'
import Icon from '../components/Icon'
import UrlCard from '../components/UrlCard'
import usePageTitle from '../hooks/usePageTitle'
import { hasExpired } from '../utils/format'

export default function Dashboard() {
  usePageTitle('My links')
  const { user } = useAuth()
  const [urls, setUrls]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [alert, setAlert]     = useState(null)

  const alertTimer = useRef(null)

  useEffect(() => {
    let ignore = false
    client.get('/api/urls')
      .then(res => { if (!ignore) setUrls(res.data) })
      .catch(err => { if (!ignore) setError(getApiError(err, 'Failed to load links')) })
      .finally(() => { if (!ignore) setLoading(false) })
    return () => {
      ignore = true
      clearTimeout(alertTimer.current)
    }
  }, [])

  function showAlert(msg, type = 'success') {
    clearTimeout(alertTimer.current)
    setAlert({ msg, type })
    alertTimer.current = setTimeout(() => setAlert(null), 4000)
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this link? This cannot be undone.')) return
    try {
      await client.delete(`/api/urls/${id}`)
      setUrls(prev => prev.filter(u => u.id !== id))
      showAlert('Link deleted')
    } catch {
      showAlert('Failed to delete link', 'error')
    }
  }

  const sortedUrls = [...urls].sort((a, b) => Number(hasExpired(a.expiresAt)) - Number(hasExpired(b.expiresAt)))

  return (
    <main className="page dashboard-page animate-in">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h2 className="dashboard-title">My links</h2>
            <p className="dashboard-subtitle">
              Welcome back, <strong>{user?.username}</strong> · {urls.length} link{urls.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link to="/dashboard/new" id="create-url-btn" className="btn">
            <span className="button-with-icon"><Icon name="plus" /> Create short link</span>
          </Link>
        </div>

        {alert && <div role="alert" className={`alert alert-${alert.type} dashboard-alert`}>{alert.msg}</div>}

        {/* URL List Card */}
        <div className="card card-wide">
          {loading && <div className="skeleton" />}
          {error   && <div role="alert" className="alert alert-error">{error}</div>}

          {!loading && !error && urls.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon"><Icon name="link" size={30} /></div>
              <p>No links yet. Create your first one!</p>
              <Link to="/dashboard/new" className="btn"><span className="button-with-icon"><Icon name="plus" /> Create short link</span></Link>
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
    </main>
  )
}
