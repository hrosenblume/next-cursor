/**
 * Page Loader
 * ===========
 * 
 * Full-screen loading spinner for page transitions.
 * Shows a pulsing dot animation centered on the page.
 * 
 * Usage:
 *   if (loading) return <PageLoader />
 */

import { CenteredPage } from './CenteredPage'

export function PageLoader() {
  return (
    <CenteredPage>
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-75" />
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-150" />
      </div>
    </CenteredPage>
  )
}

