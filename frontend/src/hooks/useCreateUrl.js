import { useState } from 'react'
import client, { getApiError, getShortUrl } from '../api/client'

// Form state + submit logic shared by the landing page and the create page.
// Markup stays in each page; only the logic lives here.
export default function useCreateUrl(fallbackError = 'We could not shorten that link. Please try again.') {
  const [longUrl, setLongUrl]         = useState('')
  const [customAlias, setCustomAlias] = useState('')
  const [expiryDays, setExpiryDays]   = useState('7')
  const [result, setResult]           = useState(null)
  const [error, setError]             = useState('')
  const [loading, setLoading]         = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    setResult(null)
    setLoading(true)

    // Expiry is mandatory (1-365 days, matching the backend); fall back to the 7-day default.
    const payload = { longUrl, expiryDays: Number(expiryDays) || 7 }
    if (customAlias.trim()) payload.customAlias = customAlias.trim()

    try {
      const { data } = await client.post('/api/urls', payload)
      setResult({ url: getShortUrl(data.shortCode), expiresAt: data.expiresAt })
    } catch (err) {
      setError(getApiError(err, fallbackError))
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setResult(null)
    setError('')
    setLongUrl('')
    setCustomAlias('')
    setExpiryDays('7')
  }

  return {
    longUrl, setLongUrl,
    customAlias, setCustomAlias,
    expiryDays, setExpiryDays,
    result, error, loading,
    submit, reset,
  }
}
