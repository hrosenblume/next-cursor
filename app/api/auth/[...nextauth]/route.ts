/**
 * NextAuth.js API Route
 * =====================
 * 
 * Handles all authentication-related API endpoints:
 * - /api/auth/signin
 * - /api/auth/signout
 * - /api/auth/callback/google
 * - /api/auth/session
 * - etc.
 * 
 * Configuration is in lib/auth.ts
 */

import { handlers } from '@/lib/auth'

export const { GET, POST } = handlers

