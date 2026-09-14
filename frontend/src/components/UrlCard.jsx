import { useState } from 'react'
import { Link } from 'react-router-dom'
import client, { getShortUrl } from '../api/client'

export default function UrlCard({ url, onDelete }) {
  const [copied, setCopied]     = useState(false)
  const [deleting, setDeleting] = useState(false)

  const shortUrl  = getShortUrl(url.shortCode)
  const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date()

  async function handleCopy() {
    await navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleDelete() {
    if (!window.confirm('Delete this short URL?')) return
    setDeleting(true)
    try {
      await client.delete(`/api/urls/${url.id}`)
      onDelete(url.id)
    } catch {
      setDeleting(false)
    }
  }

  return (
    <div className="url-item" style={{ opacity: isExpired ? 0.65 : 1 }}>
      <div className="url-item-header">
        <div style={{ flex: 1 }}>
          <span className="url-short-link" onClick={handleCopy} title="Click to copy">
            {shortUrl}
            {copied && <span style={{ marginLeft: 8, fontSize: '0.8rem', color: 'var(--color-success)' }}>✓ Copied!</span>}
          </span>
          <div className="url-original">→ {url.longUrl}</div>
        </div>
        <div className="url-actions">
          <Link to={`/dashboard/stats/${url.id}`} className="btn btn-secondary btn-small">
            <span>📊 Stats</span>
          </Link>
          <button onClick={handleDelete} disabled={deleting} className="btn btn-danger btn-small">
            {deleting ? <span className="spinner" style={{ borderTopColor: 'white' }} /> : <span>🗑</span>}
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
    </div>
  )
}
