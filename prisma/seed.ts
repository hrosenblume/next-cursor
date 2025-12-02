/**
 * Database Seed Script
 * ====================
 * 
 * Creates the initial admin user in the database.
 * 
 * This script reads ADMIN_EMAIL and ADMIN_NAME from environment variables
 * and creates a user with role="admin" if they don't already exist.
 * 
 * Usage:
 *   npm run db:seed       - Seed SQLite (development)
 *   npm run db:seed:prod  - Seed PostgreSQL (production)
 * 
 * The seed is idempotent - running it multiple times is safe.
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminName = process.env.ADMIN_NAME

  if (!adminEmail) {
    console.log('⚠ ADMIN_EMAIL not set in environment, skipping seed')
    console.log('  Set ADMIN_EMAIL in .env.local to create an admin user')
    return
  }

  // Normalize email to lowercase
  const email = adminEmail.toLowerCase().trim()

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    console.log(`· Admin user already exists: ${email}`)
    
    // Ensure they have admin role
    if (existingUser.role !== 'admin') {
      await prisma.user.update({
        where: { email },
        data: { role: 'admin' },
      })
      console.log(`✓ Updated ${email} to admin role`)
    }
    return
  }

  // Create admin user
  await prisma.user.create({
    data: {
      email,
      name: adminName || null,
      role: 'admin',
    },
  })

  console.log(`✓ Created admin user: ${email}`)
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })

