/**
 * Shared Tailwind Class Strings
 * =============================
 * 
 * Centralized Tailwind class strings for consistent styling across the app.
 * 
 * Why use this?
 * - DRY: Define once, use everywhere
 * - Consistency: All tables/cards look the same
 * - Easy updates: Change in one place, applies everywhere
 * 
 * Usage:
 *   import { tableHeaderClass } from '@/lib/styles'
 *   <th className={tableHeaderClass}>Header</th>
 */

// -----------------------------------------------------------------------------
// Table Styles (admin pages)
// -----------------------------------------------------------------------------

export const tableHeaderClass = 
  'px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'

export const tableCellClass = 
  'px-6 py-4 whitespace-nowrap text-sm'

export const tableRowHoverClass = 
  'hover:bg-accent/50'

// -----------------------------------------------------------------------------
// Card Styles
// -----------------------------------------------------------------------------

export const cardClass = 
  'bg-card rounded-lg shadow'

export const emptyStateClass = 
  'bg-card rounded-lg shadow p-8 text-center text-muted-foreground'

// -----------------------------------------------------------------------------
// Mobile Card Styles (admin pages)
// -----------------------------------------------------------------------------

export const mobileCardClass = 
  'bg-card rounded-lg shadow p-4'

