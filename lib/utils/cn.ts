/**
 * Class Name Utility
 * ==================
 * 
 * Merges Tailwind CSS classes intelligently using clsx and tailwind-merge.
 * 
 * Why use this?
 * - Handles conditional classes: cn('base', condition && 'active')
 * - Merges conflicting Tailwind classes correctly: cn('p-4', 'p-2') → 'p-2'
 * - Standard pattern used by shadcn/ui components
 * 
 * Usage:
 *   import { cn } from '@/lib/utils/cn'
 *   <div className={cn('base-class', isActive && 'active', className)} />
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

