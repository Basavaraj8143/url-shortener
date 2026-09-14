import axios from 'axios'

// In production (Vercel), set VITE_API_BASE_URL to your Render backend URL:
//   e.g. https://url-shortener-xyz.onrender.com
// In development, leave it empty — Vite proxy handles it.
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT on every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// On 401 → clear auth and redirect to login
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthRequest = ['/login', '/register'].includes(err.config?.url)
    if (err.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export function getApiError(error, fallback) {
  return error.response?.data?.error
    ?? error.response?.data?.message
    ?? fallback
}

export function getShortUrl(shortCode) {
  const baseUrl = API_BASE_URL || window.location.origin
  return `${baseUrl}/${shortCode}`
}

export default client
