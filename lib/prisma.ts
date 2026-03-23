import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    // During build time, return a stub client that will fail at runtime
    // This allows Next.js to build without a database connection
    console.warn('DATABASE_URL not set - using stub Prisma client for build')
    return new Proxy({} as PrismaClient, {
      get() {
        throw new Error('DATABASE_URL is not configured')
      },
    })
  }

  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)

  return new PrismaClient({ adapter })
}

// Lazy initialization - only create when first accessed
let _prisma: PrismaClient | undefined

export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    if (!_prisma) {
      _prisma = globalForPrisma.prisma ?? createPrismaClient()
      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = _prisma
      }
    }
    return (_prisma as unknown as Record<string, unknown>)[prop as string]
  },
})
