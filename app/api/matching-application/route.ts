import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  PROFILE_PHOTOS_BUCKET,
  ALLOWED_IMAGE_TYPES,
  storagePath,
  uploadToStorage,
  StorageUploadError,
} from '@/lib/storage'

// GET — check if current user already has an application
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const app = await prisma.matchingApplication.findUnique({
      where: { userId: session.user.id },
      select: { id: true, status: true, submittedAt: true },
    })
    return NextResponse.json({ application: app })
  } catch (error) {
    console.error('[GET /api/matching-application]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

function calcAge(dob: Date): number {
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
  return age
}

// POST — submit intake form
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Already submitted?
    const existing = await prisma.matchingApplication.findUnique({ where: { userId: session.user.id } })
    if (existing) return NextResponse.json({ error: 'You have already submitted an application' }, { status: 409 })

    const formData = await req.formData()
    const get = (k: string) => (formData.get(k) as string | null) ?? ''

    const dateOfBirth = new Date(get('dateOfBirth'))
    if (isNaN(dateOfBirth.getTime())) return NextResponse.json({ error: 'Invalid date of birth' }, { status: 400 })

    const age = calcAge(dateOfBirth)
    const hasChildren = get('hasChildren') === 'Yes'
    const childrenCount = hasChildren ? parseInt(get('childrenCount')) || 0 : null
    const childrenRaw = get('children')
    const children = childrenRaw ? JSON.parse(childrenRaw) : null
    const householdMembersRaw = get('householdMembers')
    const householdMembers = householdMembersRaw ? JSON.parse(householdMembersRaw) : []

    // Required field check
    const required: [string, string][] = [
      ['churchFrequency', get('churchFrequency')],
      ['maritalStatus', get('maritalStatus')],
      ['dateOfBirth', get('dateOfBirth')],
      ['hasChildren', get('hasChildren')],
      ['openToPartnerChildren', get('openToPartnerChildren')],
      ['city', get('city')],
      ['state', get('state')],
      ['willingToRelocate', get('willingToRelocate')],
      ['homeOwnership', get('homeOwnership')],
      ['profession', get('profession')],
      ['incomeRange', get('incomeRange')],
      ['fitnessLevel', get('fitnessLevel')],
      ['lookingToMarry', get('lookingToMarry')],
      ['marriageTimeline', get('marriageTimeline')],
      ['appearanceDescription', get('appearanceDescription')],
      ['partnerPhysicalAttrs', get('partnerPhysicalAttrs')],
      ['nonNegotiables', get('nonNegotiables')],
      ['conflictHandling', get('conflictHandling')],
      ['idealPartnership', get('idealPartnership')],
    ]
    for (const [field, val] of required) {
      if (!val?.trim()) return NextResponse.json({ error: `${field} is required` }, { status: 400 })
    }

    let photoUrl: string | undefined
    let photoPublicId: string | undefined
    const photo = formData.get('photo') as File | null
    if (photo && photo.size > 0) {
      if (!ALLOWED_IMAGE_TYPES.has(photo.type)) {
        return NextResponse.json(
          { error: 'File type not allowed. Please upload a JPEG, PNG, WebP, HEIC, or HEIF image.' },
          { status: 400 }
        )
      }
      if (photo.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: 'Photo must be under 10 MB' }, { status: 413 })
      }
      const path = storagePath('applications', session.user.id, photo.name || 'photo.jpg')
      try {
        photoUrl = await uploadToStorage(PROFILE_PHOTOS_BUCKET, path, await photo.arrayBuffer(), photo.type)
        photoPublicId = path
      } catch (e) {
        if (e instanceof StorageUploadError) {
          return NextResponse.json({ error: e.message }, { status: e.httpStatus })
        }
        return NextResponse.json({ error: 'Storage is not configured on the server' }, { status: 500 })
      }
    }

    const application = await prisma.matchingApplication.create({
      data: {
        userId: session.user.id,
        isChristian: get('isChristian') === 'Yes',
        denomination: get('denomination') || null,
        churchFrequency: get('churchFrequency'),
        maritalStatus: get('maritalStatus'),
        dateOfBirth,
        age,
        hasChildren,
        childrenCount,
        children,
        openToPartnerChildren: get('openToPartnerChildren'),
        openToPartnerChildrenOther: get('openToPartnerChildrenOther') || null,
        city: get('city').trim(),
        state: get('state').trim(),
        willingToRelocate: get('willingToRelocate'),
        homeOwnership: get('homeOwnership'),
        householdMembers,
        pets: get('pets'),
        profession: get('profession').trim(),
        incomeRange: get('incomeRange'),
        fitnessLevel: get('fitnessLevel'),
        lookingToMarry: get('lookingToMarry'),
        marriageTimeline: get('marriageTimeline').trim(),
        appearanceDescription: get('appearanceDescription').trim(),
        partnerPhysicalAttrs: get('partnerPhysicalAttrs').trim(),
        nonNegotiables: get('nonNegotiables').trim(),
        conflictHandling: get('conflictHandling').trim(),
        idealPartnership: get('idealPartnership').trim(),
        photoUrl,
        photoPublicId,
      },
    })

    return NextResponse.json({ id: application.id }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/matching-application]', error)
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }
}
