import { Link } from 'react-router-dom'
import UrlForm from '../components/UrlForm'
import { useAuth } from '../context/AuthContext'
import useCreateUrl from '../hooks/useCreateUrl'
import useCopyToClipboard from '../hooks/useCopyToClipboard'
import usePageTitle from '../hooks/usePageTitle'
import { formatDate } from '../utils/format'

const steps = [
  { number: '01', title: 'Paste a URL', description: 'Start with the destination you want people to visit.' },
  { number: '02', title: 'Set your options', description: 'Choose a custom alias or set how long the link stays active.' },
  { number: '03', title: 'Share and track', description: 'Copy your short link and check its click count in your dashboard.' },
]

export default function Landing() {
  usePageTitle()
  const form = useCreateUrl()
  const { result, error } = form
  const { copied, copyFailed, copy } = useCopyToClipboard()
  const { user } = useAuth()
  const errorMessage = error || (copyFailed ? 'Could not copy the link. Select and copy it instead.' : '')

  function handleCopy() {
    copy(result.url)
  }

  return (
    <main className="landing-page">
      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-copy">
          <h1 id="landing-title">Shorten a<br /><span>long link.</span></h1>
          <p className="landing-intro">Turn a long address into a short link, then manage it and check its clicks from your dashboard.</p>
          <div className="landing-proof">
            <span className="proof-mark" aria-hidden="true">✓</span>
            <span>Custom aliases · Click counts · Expiry controls</span>
          </div>
        </div>

        <div className="shortener-card">
          <div className="shortener-heading">
            <div>
              <span className="section-kicker">CREATE A LINK</span>
              <h2>Paste your destination</h2>
            </div>
            <span className="link-icon" aria-hidden="true">↗</span>
          </div>

          {user ? (
            <>
              <UrlForm form={form} idPrefix="landing" errorMessage={errorMessage} />
              {result && (
                <div className="result-box" role="status" aria-live="polite">
                  <span className="result-label">YOUR SHORT LINK IS READY</span>
                  <div className="short-url-display">
                    <a className="short-url-text" href={result.url} target="_blank" rel="noreferrer">{result.url}</a>
                    <button id="landing-copy-btn" type="button" onClick={handleCopy} className={`copy-btn ${copied ? 'copied' : ''}`}>{copied ? 'Copied ✓' : 'Copy link'}</button>
                  </div>
                  {result.expiresAt && <p className="result-expiry">Available until {formatDate(result.expiresAt)}</p>}
                </div>
              )}
              <p className="shortener-footnote">Links you create are saved to your dashboard.</p>
            </>
          ) : (
            <div className="signed-out-prompt">
              <p>An account is required to create and manage short links.</p>
              <Link to="/login" className="btn btn-full landing-submit">Sign in <span aria-hidden="true">→</span></Link>
              <p className="prompt-note">New to Snip? <Link to="/register">Create an account</Link></p>
            </div>
          )}
        </div>
      </section>

      <section className="features-section" aria-labelledby="features-title">
        <div className="features-heading">
          <div>
            <span className="section-kicker">HOW IT WORKS</span>
            <h2 id="features-title">From long URL to ready to share.</h2>
          </div>
          <p>Three straightforward steps to create and manage a link.</p>
        </div>
        <div className="feature-grid">
          {steps.map(step => (
            <article className="feature-card" key={step.number}>
              <span className="feature-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

    </main>
  )
}
