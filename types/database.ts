import { Prisma } from '@prisma/client'

// User with profile
export type UserWithProfile = Prisma.UserGetPayload<{
  include: { profile: true }
}>

// Profile with all relations
export type ProfileWithRelations = Prisma.ProfileGetPayload<{
  include: {
    photos: true
    pillarScores: true
    reflections: true
    user: {
      select: {
        tier: true
        lastActiveAt: true
      }
    }
  }
}>

// Profile for discovery (public view)
export type DiscoveryProfile = Prisma.ProfileGetPayload<{
  include: {
    pillarScores: true
    user: {
      select: {
        tier: true
        lastActiveAt: true
      }
    }
  }
}>

// Match with users and profiles
export type MatchWithUsers = Prisma.MatchGetPayload<{
  include: {
    sender: {
      include: {
        profile: {
          include: {
            photos: true
          }
        }
      }
    }
    receiver: {
      include: {
        profile: {
          include: {
            photos: true
          }
        }
      }
    }
  }
}>

// Conversation with messages and participants
export type ConversationWithMessages = Prisma.ConversationGetPayload<{
  include: {
    messages: {
      include: {
        sender: {
          select: {
            id: true
            profile: {
              select: {
                firstName: true
                photos: {
                  where: { isPrimary: true }
                  take: 1
                }
              }
            }
          }
        }
      }
    }
    participants: {
      include: {
        user: {
          select: {
            id: true
            profile: {
              select: {
                firstName: true
                photos: {
                  where: { isPrimary: true }
                  take: 1
                }
              }
            }
          }
        }
      }
    }
  }
}>

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  code?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  page: number
  totalPages: number
  totalItems: number
  hasMore: boolean
}

// Discovery/browse response
export interface DiscoveryProfileResponse {
  id: string
  userId: string
  displayName: string
  age: number
  city: string
  state: string
  bio: string | null
  pillarScores: {
    pillar: string
    selfScore: number
  }[]
  lastActive: Date
}

// Match request/response
export interface MatchRequest {
  targetUserId: string
}

export interface MatchResponse {
  id: string
  status: string
  isMutual: boolean
  matchedAt?: Date
}

// Message types
export interface SendMessageRequest {
  content: string
}

export interface MessageResponse {
  id: string
  senderId: string
  senderName: string
  content: string
  createdAt: Date
  isRead: boolean
}

// ==================== ADMIN TYPES ====================

// AdminAction with relations for audit log display
export type AdminActionWithRelations = Prisma.AdminActionGetPayload<{
  include: {
    target: {
      select: {
        email: true
        profile: {
          select: {
            firstName: true
            lastName: true
          }
        }
      }
    }
    admin: {
      select: {
        email: true
        profile: {
          select: {
            firstName: true
            lastName: true
          }
        }
      }
    }
  }
}>

// Report with reporter and reported user details
export type ReportWithUsers = Prisma.ReportGetPayload<{
  include: {
    reporter: {
      select: {
        id: true
        email: true
        profile: {
          select: {
            firstName: true
            lastName: true
            photos: {
              where: { isPrimary: true }
              take: 1
            }
          }
        }
      }
    }
    reported: {
      select: {
        id: true
        email: true
        status: true
        profile: {
          select: {
            firstName: true
            lastName: true
            photos: {
              where: { isPrimary: true }
              take: 1
            }
          }
        }
      }
    }
  }
}>

// Full user detail for admin view
export type AdminUserDetail = Prisma.UserGetPayload<{
  include: {
    profile: {
      include: {
        photos: true
        pillarScores: true
        pillarResponses: true
        reflections: true
        growthPosts: true
      }
    }
    sentMatches: {
      select: {
        id: true
        status: true
        receiverId: true
        createdAt: true
        matchedAt: true
      }
    }
    receivedMatches: {
      select: {
        id: true
        status: true
        senderId: true
        createdAt: true
        matchedAt: true
      }
    }
    adminActionsReceived: {
      include: {
        admin: {
          select: {
            email: true
          }
        }
      }
    }
    reportsReceived: true
    reportsSubmitted: true
    appeals: true
  }
}>

// Photo pending moderation
export type PhotoPendingModeration = Prisma.PhotoGetPayload<{
  include: {
    profile: {
      select: {
        firstName: true
        lastName: true
        userId: true
      }
    }
  }
}>

// Admin dashboard stats
export interface AdminDashboardStats {
  totalUsers: number
  activeToday: number
  pendingPhotos: number
  openReports: number
  pendingAppeals: number
  activeMatches: number
  waitlistSize: number
  unreadFeedback: number
}

// Admin user list item (lightweight for table display)
export interface AdminUserListItem {
  id: string
  email: string
  role: string
  status: string
  tier: string
  createdAt: Date
  lastActiveAt: Date
  profile: {
    firstName: string
    lastName: string
    displayName: string | null
    gender: string
    isComplete: boolean
    isVerified: boolean
    isActive: boolean
    photos: { url: string; isPrimary: boolean }[]
  } | null
}
