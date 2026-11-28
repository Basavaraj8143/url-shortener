import { useState } from 'react'
import client, { getShortUrl } from '../api/client'
import Icon from './Icon'

export default function UrlCard({ url, onDelete, onNotify }) {
  const [copied, setCopied] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)

  const shortUrl = getShortUrl(url.shortCode)
  const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date()

  async function handleCopy() {
    await navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleToggleStats() {
    if (statsOpen) {
      setStatsOpen(false)
      setStats(null)
      return
    }
    setStatsOpen(true)
    setStatsLoading(true)
    try {
      const res = await client.get(`/api/urls/${url.id}/stats`)
      setStats(res.data)
    } catch {
      onNotify('Failed to load stats', 'error')
      setStatsOpen(false)
    } finally {
      setStatsLoading(false)
    }
  }

  return (
    <div className="url-item" style={{ opacity: isExpired ? 0.65 : 1 }}>
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
            {copied && <span style={{ marginLeft: 8, fontSize: '0.8rem', color: 'var(--color-success)' }}>✓ Copied!</span>}
          </a>
          <div className="url-original">→ {url.longUrl}</div>
        </div>
        <div className="url-actions">
          <button className="btn btn-secondary btn-small" onClick={handleCopy}>
            <Icon name="copy" />{' '}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button className="btn btn-secondary btn-small" onClick={handleToggleStats}>
            <span className="button-with-icon"><Icon name="chart" /> Stats</span>
          </button>
          <button className="btn btn-danger btn-small" onClick={() => onDelete(url.id)}>
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

      {statsOpen && (
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
}
