// Shared date helpers. Uses the browser's default locale everywhere.
export function formatDate(value) {
  return new Date(value).toLocaleDateString()
}

export function formatDateTime(value) {
  return new Date(value).toLocaleString()
}

export function hasExpired(expiresAt) {
  return Boolean(expiresAt) && new Date(expiresAt) < new Date()
}
