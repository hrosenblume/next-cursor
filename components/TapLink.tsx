/**
 * Tap Link Component
 * ==================
 * 
 * A Link component optimized for iOS Safari touch handling.
 * 
 * Problem: iOS Safari fires click events even during scroll, causing
 * accidental navigation when users are trying to scroll.
 * 
 * Solution: Track touch movement and only navigate if finger moved < 10px
 * (a tap vs a scroll gesture).
 * 
 * Works with both internal routes (Next.js navigation) and external URLs.
 * 
 * Usage:
 *   <TapLink href="/about">About</TapLink>
 *   <TapLink href="https://example.com">External</TapLink>
 */

'use client'

import { useRef, ComponentProps } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type TapLinkProps = ComponentProps<typeof Link> & {
  href: string
}

export function TapLink({ href, children, ...props }: TapLinkProps) {
  const router = useRouter()
  const touchStartY = useRef(0)

  const isExternal = typeof href === 'string' && 
    (href.startsWith('http') || href.startsWith('mailto:'))

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const moved = Math.abs(e.changedTouches[0].clientY - touchStartY.current)
    if (moved < 10) {
      e.preventDefault()
      if (isExternal) {
        window.location.href = href
      } else {
        router.push(href)
      }
    }
  }

  if (isExternal) {
    return (
      <a
        href={href}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <Link
      href={href}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      {...props}
    >
      {children}
    </Link>
  )
}

