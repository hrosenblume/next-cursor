/**
 * Formatting Utilities
 * ====================
 * 
 * Helper functions for formatting dates, numbers, and other values.
 */

const MINUTE = 60_000
const HOUR = 3_600_000
const DAY = 86_400_000

/**
 * Format an ISO date string as relative time (e.g., "5m ago", "2d ago")
 */
export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate)
  const diffMs = Date.now() - date.getTime()
  const mins = Math.floor(diffMs / MINUTE)
  const hours = Math.floor(diffMs / HOUR)
  const days = Math.floor(diffMs / DAY)

  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

/**
 * Format a date object as a readable string
 * @param short - If true, uses abbreviated month (Jan vs January)
 */
export function formatDate(date: Date, short = false): string {
  return date.toLocaleDateString('en-US', {
    month: short ? 'short' : 'long',
    year: 'numeric',
  })
}

/**
 * Format a number with K/M suffix for large values
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
  return num.toString()
}

/**
 * Format a date as time or date+time depending on if it's today
 */
export function formatSavedTime(date: Date): string {
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  if (isToday) {
    return date.toLocaleTimeString()
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

