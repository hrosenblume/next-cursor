/**
 * Back Link Component
 * ===================
 * 
 * A consistent "← Back" link used across pages.
 * Provides uniform styling and touch-friendly target size (44px min).
 * 
 * Usage:
 *   <BackLink href="/admin/users" label="Back to Users" />
 */

import Link from 'next/link'

interface BackLinkProps {
  href: string
  label?: string
}

export function BackLink({ href, label = 'Back' }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center min-h-[44px] px-3 py-2 -mx-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors mb-4"
    >
      ← {label}
    </Link>
  )
}

