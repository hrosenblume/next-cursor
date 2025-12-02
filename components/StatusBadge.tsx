/**
 * Status Badge Component
 * ======================
 * 
 * Colored badge for displaying status/role information.
 * Uses consistent color coding across the admin interface.
 * 
 * Colors:
 * - admin: Purple
 * - user: Default secondary
 * 
 * Usage:
 *   <StatusBadge status="admin" />
 */

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'

const statusStyles: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-800',
  user: 'bg-secondary text-secondary-foreground',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge 
      variant="outline" 
      className={cn(statusStyles[status] || statusStyles.user)}
    >
      {status}
    </Badge>
  )
}

