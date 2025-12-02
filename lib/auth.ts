/**
 * Authentication Configuration
 * ============================
 * 
 * NextAuth.js v5 configuration with Google OAuth.
 * 
 * Features:
 * - Google OAuth sign-in
 * - Allowlist model: Only users in the database can sign in
 * - Role-based access: "admin" or "user" roles
 * - Helper functions for protecting API routes
 * 
 * Setup:
 * 1. Create Google OAuth credentials at https://console.cloud.google.com
 * 2. Add credentials to .env.local (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
 * 3. Add redirect URIs for each environment (see .env.example)
 * 4. Run npm run db:seed to create the initial admin user
 * 
 * Usage in API routes:
 *   export const GET = withSession(async (request) => { ... })
 *   export const POST = withAdmin(async (request) => { ... })
 */

import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from './db'

// Extend the session type to include role
declare module 'next-auth' {
  interface Session {
    user: {
      email?: string | null
      name?: string | null
      image?: string | null
      role?: string
    }
  }
}

// Email normalization helper
export const normalizeEmail = (email: string) => email.toLowerCase().trim()

// NextAuth v5 configuration
export const { handlers, signIn, signOut, auth } = NextAuth({
  // Required for proxies (ngrok, Cloudflare Tunnel)
  trustHost: true,
  
  // Only add Google provider if credentials exist (allows app to start without config)
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          authorization: {
            params: {
              // Always show account picker (useful when testing multiple accounts)
              prompt: 'select_account',
            },
          },
        })]
      : []),
  ],
  
  callbacks: {
    // Only allow sign-in if user exists in database
    async signIn({ user }) {
      if (!user.email) return false
      const dbUser = await prisma.user.findUnique({
        where: { email: normalizeEmail(user.email) },
      })
      return !!dbUser
    },
    
    // Add role to session from database
    async session({ session }) {
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: normalizeEmail(session.user.email) },
          select: { role: true },
        })
        session.user.role = dbUser?.role || 'user'
      }
      return session
    },
  },
  
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
})

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

/** Check if user has admin role */
export async function isAdmin(email: string | null | undefined): Promise<boolean> {
  if (!email) return false
  const user = await prisma.user.findUnique({
    where: { email: normalizeEmail(email) },
    select: { role: true },
  })
  return user?.role === 'admin'
}

// -----------------------------------------------------------------------------
// API Response Helpers
// -----------------------------------------------------------------------------

export const unauthorized = () => 
  NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

export const forbidden = () => 
  NextResponse.json({ error: 'Admin access required' }, { status: 403 })

export const notFound = () => 
  NextResponse.json({ error: 'Not found' }, { status: 404 })

export const badRequest = (error: string) => 
  NextResponse.json({ error }, { status: 400 })

// -----------------------------------------------------------------------------
// Session Helpers
// -----------------------------------------------------------------------------

/** Get current session (returns null if not authenticated) */
export const requireSession = () => auth()

/** Get session and verify admin role (returns null if not admin) */
export async function requireAdmin() {
  const session = await requireSession()
  if (!session) return null
  return (await isAdmin(session.user?.email)) ? session : null
}

// -----------------------------------------------------------------------------
// Higher-Order Auth Wrappers for API Routes
// -----------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiHandler = (request: NextRequest, context?: any) => Promise<Response>

/** Wrap API route to require authentication */
export function withSession(handler: ApiHandler): ApiHandler {
  return async (request, context) => {
    const session = await requireSession()
    if (!session) return unauthorized()
    return handler(request, context)
  }
}

/** Wrap API route to require admin role */
export function withAdmin(handler: ApiHandler): ApiHandler {
  return async (request, context) => {
    const session = await requireAdmin()
    if (!session) return unauthorized()
    return handler(request, context)
  }
}

