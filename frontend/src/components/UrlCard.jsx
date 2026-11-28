import { useState } from 'react'
import client, { getShortUrl } from '../api/client'
import Icon from './Icon'
import useCopyToClipboard from '../hooks/useCopyToClipboard'
import { formatDate, formatDateTime, hasExpired } from '../utils/format'

export default function UrlCard({ url, onDelete, onNotify }) {
  const { copied, copy } = useCopyToClipboard()
  const [statsOpen, setStatsOpen] = useState(false)
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)

  const shortUrl = getShortUrl(url.shortCode)
  const isExpired = hasExpired(url.expiresAt)

  async function handleCopy() {
    if (!(await copy(shortUrl))) onNotify('Could not copy the link', 'error')
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
    <div className={`url-item${isExpired ? ' url-item-expired' : ''}`}>
      <div className="url-item-header">
        <div>
          <a
            className="url-short-link"
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            title="Open short link"
          >
            <Icon name="link" />{' '}
            {shortUrl}
            {copied && <span className="copied-note">Copied ✓</span>}
          </a>
          <div className="url-original">→ {url.longUrl}</div>
        </div>
        <div className="url-actions">
          <button className="btn btn-secondary btn-small" onClick={handleCopy}>
            <Icon name="copy" />{' '}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button className="btn btn-secondary btn-small" onClick={handleToggleStats} aria-expanded={statsOpen}>
            <span className="button-with-icon"><Icon name="chart" /> Stats</span>
          </button>
          <button className="btn btn-danger btn-small" onClick={() => onDelete(url.id)} aria-label={`Delete ${shortUrl}`}>
            <span className="button-with-icon"><Icon name="trash" /> Delete</span>
          </button>
        </div>
      </div>

      <div className="url-meta">
        <div className="url-meta-item"><Icon name="clicks" /><span>{url.clickCount ?? 0} clicks</span></div>
        <div className="url-meta-item"><Icon name="calendar" /><span>{formatDate(url.createdAt)}</span></div>
        {url.expiresAt && (
          <div className="url-meta-item">
            <Icon name="clock" />
            <span className={isExpired ? 'is-expired' : undefined}>
              {isExpired ? 'Expired ' : 'Expires '}{formatDate(url.expiresAt)}
            </span>
          </div>
        )}
      </div>

      {statsOpen && (
        <div className="stats-panel">
          {statsLoading ? (
            <div className="stats-loading">
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
                  <span className="stats-value">{formatDateTime(stats.createdAt)}</span>
                </div>
                <div className="stats-item">
                  <span className="stats-label">Expires</span>
                  <span className="stats-value">
                    {stats.expiresAt ? formatDateTime(stats.expiresAt) : 'Never'}
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
