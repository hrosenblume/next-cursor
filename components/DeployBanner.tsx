/**
 * Deploy Banner
 * =============
 * 
 * Development-only floating icon that links to the deployment guide.
 * 
 * Visibility rules:
 * - Hidden in production (NODE_ENV === 'production')
 * - Hidden on /deploy/* routes (already viewing the guide)
 * - Hidden once deployment is confirmed (APP_ID match at production URL)
 * 
 * The deployment check runs in the background and caches results
 * to avoid repeated network requests.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { RocketIcon } from '@/components/Icons'

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const STORAGE_KEY = 'deploy-banner-status'
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour
const FETCH_TIMEOUT_MS = 5000 // 5 seconds

const HIDDEN_PATH_PREFIXES = ['/deploy'] as const

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type CachedStatus = {
  deployed: boolean
  cachedAt: number
}

type DeploymentStatusResponse = {
  deployed: boolean
  reason?: string
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function isDevEnvironment(): boolean {
  return process.env.NODE_ENV === 'development'
}

function shouldHideForPath(pathname: string | null): boolean {
  if (!pathname) return false
  return HIDDEN_PATH_PREFIXES.some(prefix => pathname.startsWith(prefix))
}

function getCachedStatus(): CachedStatus | null {
  if (typeof window === 'undefined') return null
  
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    
    const cached = JSON.parse(raw) as CachedStatus
    const isExpired = Date.now() - cached.cachedAt > CACHE_TTL_MS
    
    return isExpired ? null : cached
  } catch {
    return null
  }
}

function setCachedStatus(deployed: boolean): void {
  if (typeof window === 'undefined') return
  
  const status: CachedStatus = {
    deployed,
    cachedAt: Date.now(),
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(status))
  } catch {
    // Storage full or unavailable — fail silently
  }
}

async function fetchDeploymentStatus(signal: AbortSignal): Promise<DeploymentStatusResponse> {
  const response = await fetch('/api/deployment-status', { signal })
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  
  return response.json()
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function DeployBanner() {
  const pathname = usePathname()
  const [isHovered, setIsHovered] = useState(false)
  const [isDeployed, setIsDeployed] = useState<boolean>(() => {
    // Check cache on initial render to avoid flash
    const cached = getCachedStatus()
    return cached?.deployed ?? false
  })

  const checkDeploymentStatus = useCallback(async (controller: AbortController) => {
    // Skip if we already know it's deployed
    const cached = getCachedStatus()
    if (cached?.deployed) {
      setIsDeployed(true)
      return
    }

    try {
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
      const data = await fetchDeploymentStatus(controller.signal)
      clearTimeout(timeoutId)
      
      setCachedStatus(data.deployed)
      
      if (data.deployed) {
        setIsDeployed(true)
      }
    } catch (error) {
      // Silently fail — keep showing banner on network errors
      if (error instanceof Error && error.name !== 'AbortError') {
        console.debug('[DeployBanner] Status check failed:', error.message)
      }
    }
  }, [])

  useEffect(() => {
    if (!isDevEnvironment()) return

    const controller = new AbortController()
    checkDeploymentStatus(controller)

    return () => controller.abort()
  }, [checkDeploymentStatus])

  // Early returns for visibility rules
  if (!isDevEnvironment()) return null
  if (shouldHideForPath(pathname)) return null
  if (isDeployed) return null

  return (
    <div 
      className="fixed bottom-4 right-4 z-[9999]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip */}
      <Link
        href="/deploy"
        className={`
          absolute bottom-full right-0 mb-2 whitespace-nowrap
          bg-popover text-popover-foreground
          px-3 py-2 rounded-lg shadow-lg border
          text-sm font-medium
          transition-all duration-200 ease-out
          ${isHovered 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-1 pointer-events-none'
          }
        `}
      >
        View Deploy Guide →
      </Link>

      {/* Floating Icon Button */}
      <Link
        href="/deploy"
        className="
          flex items-center justify-center
          w-10 h-10 rounded-full
          bg-gradient-to-br from-primary to-green-500
          text-primary-foreground
          shadow-lg hover:shadow-xl
          transition-all duration-200
          hover:scale-105 active:scale-95
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
        "
        aria-label="View Deploy Guide"
      >
        <RocketIcon className="w-5 h-5" />
      </Link>
    </div>
  )
}
