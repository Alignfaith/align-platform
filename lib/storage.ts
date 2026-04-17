/*
 * Supabase Storage — server-side upload utility.
 * Used by all photo upload API routes. Never import this on the client.
 *
 * ─── Bucket layout ───────────────────────────────────────────────────────────
 *
 *   profile-photos  (PUBLIC — create in Supabase dashboard if it doesn't exist)
 *     identity/{userId}/{timestamp}-{filename}      profile identity photos
 *     verification/{userId}/{timestamp}-{filename}  human verification selfies
 *     stories/{userId}/{timestamp}-{filename}       alignment story photos
 *     applications/{userId}/{timestamp}-{filename}  matching application photos
 *
 *   reflection-photos  (PUBLIC — already exists)
 *     {userId}/{timestamp}-{filename}
 *
 * ─── Required env vars ───────────────────────────────────────────────────────
 *   NEXT_PUBLIC_SUPABASE_URL     e.g. https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY    Supabase → Settings → API → service_role key
 */

export const PROFILE_PHOTOS_BUCKET = 'profile-photos'
export const REFLECTION_PHOTOS_BUCKET = 'reflection-photos'

export const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
])

/** Thrown when Supabase Storage rejects or cannot be reached. */
export class StorageUploadError extends Error {
  constructor(
    message: string,
    public readonly httpStatus: number = 502,
  ) {
    super(message)
    this.name = 'StorageUploadError'
  }
}

/**
 * Returns a storage path: `{folder}/{userId}/{timestamp}-{safeName}`
 * e.g. storagePath('identity', 'abc123', 'photo.jpg') → 'identity/abc123/1720000000000-photo.jpg'
 */
export function storagePath(folder: string, userId: string, originalName: string): string {
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase()
  return `${folder}/${userId}/${Date.now()}-${safeName}`
}

/**
 * Uploads raw bytes to Supabase Storage and returns the public URL.
 * Throws StorageUploadError on network failure or non-2xx response.
 * Throws a plain Error if env vars are missing (500-level).
 */
export async function uploadToStorage(
  bucket: string,
  path: string,
  data: ArrayBuffer,
  contentType: string,
): Promise<string> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    throw new Error('Storage is not configured: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set')
  }

  const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${path}`

  let res: Response
  try {
    res = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': contentType,
        'x-upsert': 'false',
      },
      body: data,
    })
  } catch (e) {
    console.error('[storage] Network error reaching Supabase Storage:', e)
    throw new StorageUploadError('Could not reach storage service. Please try again.', 502)
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    console.error(`[storage] Upload failed (${res.status}):`, detail)
    throw new StorageUploadError('Photo could not be saved. Please try again.', 502)
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}
