/**
 * Centered Page Layout
 * ====================
 * 
 * A full-screen container that centers its children both vertically and horizontally.
 * Useful for login pages, error pages, and loading states.
 * 
 * Usage:
 *   <CenteredPage>
 *     <div>Centered content</div>
 *   </CenteredPage>
 */

import { cn } from '@/lib/utils/cn'

interface CenteredPageProps {
  children: React.ReactNode
  className?: string
}

export function CenteredPage({ children, className }: CenteredPageProps) {
  return (
    <div className={cn('min-h-screen flex items-center justify-center', className)}>
      {children}
    </div>
  )
}

