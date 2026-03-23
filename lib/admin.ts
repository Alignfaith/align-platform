import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AuthenticationError, AuthorizationError } from '@/lib/errors'
import { AdminActionType } from '@prisma/client'

/**
 * Verify the current user is an authenticated admin.
 * Throws AuthenticationError (401) if no session, AuthorizationError (403) if not admin.
 * Returns the session for use in the calling route.
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    throw new AuthenticationError()
  }

  if (session.user.role !== 'ADMIN') {
    throw new AuthorizationError('Admin access required')
  }

  return session
}

/**
 * Create an AdminAction audit record for any admin mutation.
 * Every state-changing admin action must call this.
 */
export async function performAdminAction(
  adminId: string,
  targetId: string,
  action: AdminActionType,
  reason: string,
  metadata?: Record<string, string | number | boolean | null>,
  expiresAt?: Date
) {
  return prisma.adminAction.create({
    data: {
      adminId,
      targetId,
      action,
      reason,
      metadata: metadata ?? undefined,
      expiresAt: expiresAt ?? undefined,
    },
  })
}

/**
 * Calculate report severity based on category.
 * Higher severity = more urgent for admin review.
 *   3 = critical (UNDERAGE)
 *   2 = high (HARASSMENT)
 *   1 = medium (INAPPROPRIATE_PHOTO, INAPPROPRIATE_MESSAGE, FAKE_PROFILE)
 *   0 = low (SPAM, OFFENSIVE_BIO, OTHER)
 */
export function calculateReportSeverity(category: string): number {
  switch (category) {
    case 'UNDERAGE':
      return 3
    case 'HARASSMENT':
      return 2
    case 'INAPPROPRIATE_PHOTO':
    case 'INAPPROPRIATE_MESSAGE':
    case 'FAKE_PROFILE':
      return 1
    case 'SPAM':
    case 'OFFENSIVE_BIO':
    case 'OTHER':
    default:
      return 0
  }
}

/**
 * Standard pagination params extracted from URL search params.
 */
export function getPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '25')))
  const skip = (page - 1) * limit
  return { page, limit, skip }
}

/**
 * Build a standard paginated response object.
 */
export function paginatedResponse<T>(items: T[], total: number, page: number, limit: number) {
  return {
    items,
    page,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    hasMore: page * limit < total,
  }
}
