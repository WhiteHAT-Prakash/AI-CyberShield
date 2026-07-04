/**
 * Utility: formats ISO date strings to human-readable form
 */
export function formatDate(isoString) {
  if (!isoString) return 'N/A'
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

/**
 * Truncates a string to a maximum length with ellipsis
 */
export function truncate(str, maxLength = 80) {
  if (!str) return ''
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str
}

/**
 * Maps a numeric threat score (0–100) to a severity label and color class
 */
export function getThreatLevel(score) {
  if (score >= 80) return { label: 'Critical', color: 'text-cyber-danger',  badge: 'badge-danger'  }
  if (score >= 60) return { label: 'High',     color: 'text-cyber-warning', badge: 'badge-warning' }
  if (score >= 40) return { label: 'Medium',   color: 'text-cyber-sky',     badge: 'badge-info'    }
  return             { label: 'Low',      color: 'text-cyber-success', badge: 'badge-success' }
}

/**
 * Returns Tailwind color class for a password strength score (0–4)
 */
export function getPasswordStrengthColor(score) {
  const colors = ['text-cyber-danger', 'text-orange-400', 'text-cyber-warning', 'text-lime-400', 'text-cyber-success']
  return colors[score] || 'text-cyber-muted'
}

/**
 * Extracts a user-friendly API error message from an Axios error
 */
export function getErrorMessage(error) {
  return error?.response?.data?.detail
      || error?.response?.data?.message
      || error?.message
      || 'An unexpected error occurred.'
}
