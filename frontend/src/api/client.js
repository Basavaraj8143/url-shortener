import axios from 'axios'

// In production, set VITE_API_BASE_URL to the public Render backend URL.
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

let clerkTokenGetter = null

export function setClerkTokenGetter(getter) {
  clerkTokenGetter = getter
}

client.interceptors.request.use(async config => {
  const token = clerkTokenGetter ? await clerkTokenGetter() : null
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

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
