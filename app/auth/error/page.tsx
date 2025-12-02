/**
 * Auth Error Page
 * ===============
 * 
 * Shown when authentication fails.
 * Common reasons: user not in allowlist, OAuth error, etc.
 */

'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CenteredPage } from '@/components/CenteredPage'
import { Suspense } from 'react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: Record<string, string> = {
    AccessDenied: 'You are not authorized to sign in. Contact an admin to get access.',
    Configuration: 'There is a problem with the server configuration.',
    Verification: 'The verification link has expired or has already been used.',
    Default: 'An error occurred during authentication.',
  }

  const message = errorMessages[error || ''] || errorMessages.Default

  return (
    <CenteredPage className="bg-background">
      <div className="max-w-md w-full space-y-8 p-8 text-center">
        <h1 className="text-title font-bold text-red-600">
          Authentication Error
        </h1>
        <p className="text-body text-gray-600 dark:text-gray-400">
          {message}
        </p>
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-opacity"
        >
          Go Home
        </Link>
      </div>
    </CenteredPage>
  )
}

export default function AuthError() {
  return (
    <Suspense fallback={<CenteredPage><p>Loading...</p></CenteredPage>}>
      <AuthErrorContent />
    </Suspense>
  )
}

