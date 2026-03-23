import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Generate secure random string
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const randomValues = new Uint8Array(length)
  crypto.getRandomValues(randomValues)
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length]
  }
  return result
}

// Generate invite code (shorter, user-friendly)
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Excludes ambiguous chars
  let result = ''
  const randomValues = new Uint8Array(8)
  crypto.getRandomValues(randomValues)
  for (let i = 0; i < 8; i++) {
    result += chars[randomValues[i] % chars.length]
  }
  return result
}

// Validation schemas
export const emailSchema = z.string().email('Invalid email address').toLowerCase().trim()

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[0-9]/, 'Password must contain a number')

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(50, 'Name must be 50 characters or less')
  .trim()

// Sanitize HTML to prevent XSS
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

// Calculate age from birthdate
export function calculateAge(birthDate: Date): number {
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

// Validate age is within range
export function isValidAge(birthDate: Date, minAge: number = 18, maxAge: number = 120): boolean {
  const age = calculateAge(birthDate)
  return age >= minAge && age <= maxAge
}
