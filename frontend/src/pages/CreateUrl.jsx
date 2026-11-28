import { Link } from 'react-router-dom'
import UrlForm from '../components/UrlForm'
import useCreateUrl from '../hooks/useCreateUrl'
import useCopyToClipboard from '../hooks/useCopyToClipboard'
import usePageTitle from '../hooks/usePageTitle'
import { formatDateTime } from '../utils/format'

export default function CreateUrl() {
  usePageTitle('Create short link')
  const form = useCreateUrl()
  const { result, error, reset } = form
  const { copied, copy } = useCopyToClipboard()

  return (
    <main className="page page-centered animate-in">
      <div className="container">
        <div className="card">
          <Link to="/dashboard" className="btn btn-secondary btn-small back-link">
            <span>← Back</span>
          </Link>

          <h2>Create short link</h2>
          <p className="page-subtitle">Turn any long URL into a short, shareable link</p>

          {result ? (
            <div className="animate-in">
              <div className="result-box" role="status" aria-live="polite">
                <span className="result-label">YOUR SHORT LINK IS READY</span>
                <div className="short-url-display">
                  <span className="short-url-text">{result.url}</span>
                  <button
                    id="copy-result-btn"
                    type="button"
                    onClick={() => copy(result.url)}
                    className={`copy-btn ${copied ? 'copied' : ''}`}
                  >
                    {copied ? 'Copied ✓' : 'Copy link'}
                  </button>
                </div>
                {result.expiresAt && <p className="result-expiry">Expires {formatDateTime(result.expiresAt)}</p>}
              </div>

              <div className="create-result-actions">
                <button className="btn btn-secondary" onClick={reset}>
                  <span>Create another</span>
                </button>
                <Link to="/dashboard" className="btn">
                  <span>Go to my links →</span>
                </Link>
              </div>
            </div>
          ) : (
            <UrlForm form={form} idPrefix="cu" errorMessage={error} autoFocus />
          )}
        </div>
      </div>
    </main>
  )
}
