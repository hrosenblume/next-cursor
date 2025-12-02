/**
 * Prisma Client Singleton
 * =======================
 * 
 * Creates a single Prisma client instance for the entire application.
 * 
 * In development, Next.js hot-reloads and would create multiple Prisma clients,
 * causing connection issues. This pattern stores the client on `globalThis`
 * to reuse the same instance across hot reloads.
 * 
 * In production, a single instance is created normally.
 * 
 * Usage:
 *   import { prisma } from '@/lib/db'
 *   const users = await prisma.user.findMany()
 */

import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

