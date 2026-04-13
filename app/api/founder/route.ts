import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifyFounderApplication } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, gender, city, state } = body

    if (!name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    if (!email?.trim()) return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    if (!phone?.trim()) return NextResponse.json({ error: 'Phone is required' }, { status: 400 })
    if (!gender) return NextResponse.json({ error: 'Gender is required' }, { status: 400 })
    if (!city?.trim()) return NextResponse.json({ error: 'City is required' }, { status: 400 })
    if (!state?.trim()) return NextResponse.json({ error: 'State is required' }, { status: 400 })

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    const existing = await prisma.founderApplication.findUnique({
      where: { email: email.trim().toLowerCase() },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'An application with this email already exists.' },
        { status: 409 }
      )
    }

    const application = await prisma.founderApplication.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        gender,
        city: city.trim(),
        state: state.trim(),
      },
    })

    notifyFounderApplication({
      name: application.name,
      email: application.email,
      phone: application.phone,
      city: application.city,
      state: application.state,
      createdAt: application.createdAt,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Founder application error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
