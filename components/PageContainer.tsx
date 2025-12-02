/**
 * Page Container
 * ==============
 * 
 * Consistent page wrapper with centered content and standard padding.
 * 
 * Width options:
 * - '2xl' (672px) - Content pages, articles
 * - '5xl' (1024px) - Dashboard pages, admin
 * 
 * Usage:
 *   <PageContainer>Content here</PageContainer>
 *   <PageContainer width="5xl">Wide dashboard</PageContainer>
 */

import { cn } from '@/lib/utils/cn'

interface PageContainerProps {
  children: React.ReactNode
  width?: '2xl' | '5xl'
  className?: string
}

const widthClasses = {
  '2xl': 'max-w-2xl',
  '5xl': 'max-w-5xl',
}

export function PageContainer({ children, width = '2xl', className }: PageContainerProps) {
  return (
    <div className={cn(`${widthClasses[width]} mx-auto px-6 py-16`, className)}>
      {children}
    </div>
  )
}

