import { useState } from 'react'

// Shared "create a short link" form. State and submit logic come from
// useCreateUrl(); each page decides what to show after a link is created.
export default function UrlForm({ form, idPrefix, errorMessage, autoFocus = false }) {
  const {
    longUrl, setLongUrl,
    customAlias, setCustomAlias,
    expiryDays, setExpiryDays,
    loading, submit,
  } = form
  const [showAdvanced, setShowAdvanced] = useState(false)
  const advancedId = `${idPrefix}-advanced-options`

  return (
    <form onSubmit={submit} id={`${idPrefix}-shorten-form`} aria-label="Create a short link">
      <label className="form-label" htmlFor={`${idPrefix}-url`}>Your destination URL</label>
      <div className="url-input-wrap">
        <span aria-hidden="true">↗</span>
        <input
          id={`${idPrefix}-url`}
          type="url"
          required
          autoFocus={autoFocus}
          pattern="https?://.+"
          title="Enter a full link starting with http:// or https://"
          className="form-input"
          placeholder="https://example.com/your-page"
          value={longUrl}
          onChange={event => setLongUrl(event.target.value)}
        />
      </div>
      <button
        type="button"
        className="advanced-toggle"
        onClick={() => setShowAdvanced(value => !value)}
        aria-expanded={showAdvanced}
        aria-controls={advancedId}
      >
        <span aria-hidden="true">{showAdvanced ? '−' : '+'}</span> {showAdvanced ? 'Hide options' : 'Customize your link'}
      </button>
      {showAdvanced && (
        <div className="landing-advanced" id={advancedId}>
          <div className="form-group">
            <label className="form-label" htmlFor={`${idPrefix}-alias`}>Custom alias <span>(optional)</span></label>
            <input
              id={`${idPrefix}-alias`}
              type="text"
              pattern="[a-zA-Z0-9_\-]+"
              minLength={3}
              maxLength={30}
              title="3 to 30 characters: letters, numbers, underscore or hyphen"
              className="form-input"
              placeholder="my-link"
              value={customAlias}
              onChange={event => setCustomAlias(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor={`${idPrefix}-expiry`}>Expires in <span>(days)</span></label>
            <input
              id={`${idPrefix}-expiry`}
              type="number"
              min="1"
              max="365"
              required
              className="form-input"
              value={expiryDays}
              onChange={event => setExpiryDays(event.target.value)}
            />
          </div>
        </div>
      )}
      {errorMessage && <div className="alert alert-error" role="alert">{errorMessage}</div>}
      <button id={`${idPrefix}-shorten-btn`} type="submit" disabled={loading} className="btn btn-full landing-submit">
        {loading ? <><span className="spinner" /> Creating your link</> : <>Shorten link <span aria-hidden="true">→</span></>}
      </button>
    </form>
  )
}
