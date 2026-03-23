/**
 * Gemini AI Integration Types
 * Type definitions for AI-powered features in the Align platform
 */

// Six Pillars Enumeration
export type Pillar = 'SPIRITUAL' | 'MENTAL' | 'PHYSICAL' | 'FINANCIAL' | 'APPEARANCE' | 'INTIMACY'

// Pillar scores for a user profile
export interface PillarScores {
  SPIRITUAL: number
  MENTAL: number
  PHYSICAL: number
  FINANCIAL: number
  APPEARANCE: number
  INTIMACY: number
}

// User profile data for AI analysis
export interface UserProfileData {
  id: string
  firstName: string
  pillars: PillarScores
  reflections: string[]
  bio?: string
  preferences?: {
    ageMin?: number
    ageMax?: number
    location?: string
  }
}

// Compatibility Analysis Types
export interface CompatibilityResult {
  score: number // 0-100 overall compatibility score
  pillarsAlignment: PillarScores // Alignment score for each pillar
  insights: string[] // 3-5 key compatibility points
  growthAreas: string[] // Areas for mutual development
  strengths: string[] // Complementary strengths
}

export interface CompatibilityRequest {
  userProfile: UserProfileData
  targetProfile: UserProfileData
}

// Content Moderation Types
export type ContentType = 'message' | 'bio' | 'reflection' | 'comment'

export interface ModerationResult {
  approved: boolean
  flags: ModerationFlag[]
  suggestions?: string[]
  severity: 'none' | 'low' | 'medium' | 'high'
}

export interface ModerationFlag {
  type: 'inappropriate' | 'suggestive' | 'spam' | 'authenticity' | 'harassment' | 'other'
  description: string
  confidence: number // 0-1
}

export interface ModerationRequest {
  content: string
  contentType: ContentType
  userId?: string
}

// Growth Recommendations Types
export interface GrowthRecommendation {
  pillar: Pillar
  action: string
  reason: string
  resources?: string[]
  priority: 'high' | 'medium' | 'low'
}

export interface RecommendationContext {
  userProfile: UserProfileData
  recentActivity?: ActivityLog[]
  preferences?: UserPreferences
}

export interface ActivityLog {
  pillar: Pillar
  action: string
  timestamp: Date
}

export interface UserPreferences {
  focusAreas?: Pillar[]
  learningStyle?: 'reading' | 'video' | 'interactive'
  timeCommitment?: 'minimal' | 'moderate' | 'intensive'
}

// API Response Types
export interface GeminiAPIResponse<T> {
  success: boolean
  data?: T
  error?: string
  metadata?: {
    modelUsed: string
    tokensUsed: number
    processingTime: number
  }
}

// Prompt Configuration
export interface PromptConfig {
  systemPrompt: string
  userPrompt: string
  temperature?: number
  maxTokens?: number
}
