import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/*
 * Supabase Storage configuration
 * ──────────────────────────────────────────────────────────────────────────
 * Bucket name : reflection-photos
 * Visibility  : PUBLIC — photos are user-chosen attachments, no privacy reason
 *               to gate them behind signed URLs.
 *
 * Manual setup required in the Supabase dashboard (one-time):
 *   1. Go to Storage → New bucket
 *   2. Name: reflection-photos
 *   3. Public bucket: ON
 *   4. No additional RLS policies needed — uploads go through the service
 *      role key server-side, which bypasses RLS entirely.
 *
 * Required environment variables:
 *   NEXT_PUBLIC_SUPABASE_URL      e.g. https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY     from Supabase dashboard → Settings → API
 * ──────────────────────────────────────────────────────────────────────────
 */

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
])

const MAX_BYTES = 10 * 1024 * 1024 // 10 MB
const BUCKET = 'reflection-photos'

export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // ── Config ────────────────────────────────────────────────────────────────
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    console.error('[growth-posts/photo] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    return NextResponse.json({ error: 'Storage is not configured on the server' }, { status: 500 })
  }

  // ── Parse multipart body ──────────────────────────────────────────────────
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Failed to parse file upload' }, { status: 400 })
  }

  const file = formData.get('photo') as File | null
  if (!file) {
    return NextResponse.json({ error: 'No photo file provided' }, { status: 400 })
  }

  // ── MIME type validation ──────────────────────────────────────────────────
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: 'File type not allowed. Please upload a JPEG, PNG, WebP, HEIC, or HEIF image.' },
      { status: 400 }
    )
  }

  // ── Size validation ───────────────────────────────────────────────────────
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Photo must be under 10 MB' }, { status: 413 })
  }

  // ── Build storage path: {userId}/{timestamp}-{sanitized-filename} ─────────
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase()
  const path = `${session.user.id}/${Date.now()}-${safeName}`

  const buffer = await file.arrayBuffer()

  // ── Upload to Supabase Storage via REST API ───────────────────────────────
  const uploadUrl = `${supabaseUrl}/storage/v1/object/${BUCKET}/${path}`
  let uploadRes: Response
  try {
    uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': file.type,
        'x-upsert': 'false',
      },
      body: buffer,
    })
  } catch (e) {
    console.error('[growth-posts/photo] Supabase Storage network error:', e)
    return NextResponse.json({ error: 'Could not reach storage service. Please try again.' }, { status: 502 })
  }

  if (!uploadRes.ok) {
    const detail = await uploadRes.text().catch(() => '')
    console.error('[growth-posts/photo] Supabase upload failed:', uploadRes.status, detail)
    return NextResponse.json(
      { error: 'Photo could not be saved. Please try again.' },
      { status: 502 }
    )
  }

  // ── Return public URL ─────────────────────────────────────────────────────
  const url = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${path}`
  return NextResponse.json({ success: true, url })
}
