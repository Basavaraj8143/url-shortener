import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import client from '../api/client'

export default function UrlStats() {
  const { id } = useParams()
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    client.get(`/api/urls/${id}/stats`)
      .then(res => setStats(res.data))
      .catch(() => setError('Failed to load stats. You may not own this link.'))
      .finally(() => setLoading(false))
  }, [id])

  const isExpired = stats?.expiresAt && new Date(stats.expiresAt) < new Date()

  return (
    <div className="page animate-in" style={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: 0 }}>
        <div style={{ marginBottom: '1rem' }}>
          <Link to="/dashboard" className="btn btn-secondary btn-small">
            <span>← Back to Dashboard</span>
          </Link>
        </div>

        {loading && (
          <div className="card" style={{ textAlign: 'center' }}>
            <span className="spinner spinner-ink" style={{ width: 36, height: 36 }} />
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        {stats && (
          <div className="card">
            <h2>📊 URL Statistics</h2>

            {/* Click count hero */}
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
              border: '2px dashed var(--color-accent)',
              borderRadius: 12,
              marginBottom: '1.5rem'
            }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 10vw, 6rem)',
                color: 'var(--color-accent)',
                lineHeight: 1,
                marginBottom: '0.5rem'
              }}>
                {stats.clicks ?? 0}
              </div>
              <div style={{ color: 'var(--color-ink-light)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Total Clicks
              </div>
            </div>

            {/* Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: '📅 Created At', value: new Date(stats.createdAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' }) },
                { label: '⏰ Expires At', value: stats.expiresAt ? new Date(stats.expiresAt).toLocaleString('en-IN', { dateStyle: 'long' }) : 'Never (no expiry set)' },
                { label: '🔗 Status',     value: isExpired ? '🔴 Expired' : '🟢 Active & Live' },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.875rem 1rem',
                  background: 'var(--color-paper)',
                  borderRadius: 8,
                  border: '1px solid var(--color-border)',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <span style={{ color: 'var(--color-ink-light)', fontSize: '0.9rem' }}>{label}</span>
                  <span style={{ fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <Link to="/dashboard" className="btn btn-secondary">
                <span>← Back to Dashboard</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
