import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { handleApiError } from '@/lib/errors'

const PAGES = [
  {
    slug: 'about',
    title: 'About Align',
    description: 'Learn about Align and our mission to help Christian singles build lasting relationships through personal growth.',
    content: `<p>Align is a faith-based relationship platform built on the belief that lasting love starts with personal growth. We help Christian singles develop across six core pillars — Spiritual, Mental, Physical, Financial, Appearance, and Intimacy — before and during the process of finding a partner.</p>
<p>This page is coming soon with the full story.</p>`,
  },
  {
    slug: 'the-framework',
    title: 'The Framework',
    description: 'Discover the Six Pillars Framework — Align\'s approach to relational fitness and intentional relationships.',
    content: `<p>The Six Pillars Framework is the foundation of everything we do at Align. It is a holistic model for relational fitness that evaluates personal readiness across six dimensions of life.</p>
<p>Full framework content coming soon.</p>`,
  },
  {
    slug: 'faq',
    title: 'Frequently Asked Questions',
    description: 'Answers to common questions about Align, membership, and the Six Pillars Framework.',
    content: `<p>Have questions about Align? We have answers.</p>
<p>Full FAQ content coming soon. In the meantime, reach out through our contact page.</p>`,
  },
  {
    slug: 'terms-of-service',
    title: 'Terms of Service',
    description: 'Align Terms of Service.',
    content: `<p>By using Align, you agree to these terms. Please read them carefully.</p>
<p>Full terms of service content coming soon.</p>`,
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    description: 'Align Privacy Policy — how we handle your data.',
    content: `<p>Your privacy matters to us. This policy explains how we collect, use, and protect your information.</p>
<p>Full privacy policy content coming soon.</p>`,
  },
  {
    slug: 'community-guidelines',
    title: 'Community Guidelines',
    description: 'Align Community Guidelines — standards for respectful engagement on the platform.',
    content: `<p>Align is a community built on faith, respect, and intentional growth. These guidelines exist to protect that environment for everyone.</p>
<p>Full community guidelines coming soon.</p>`,
  },
]

export async function POST() {
  try {
    const session = await requireAdmin()

    const results = await Promise.all(
      PAGES.map((page) =>
        prisma.cmsPage.upsert({
          where: { slug: page.slug },
          update: {},  // don't overwrite if already exists
          create: {
            slug: page.slug,
            title: page.title,
            content: page.content,
            description: page.description,
            status: 'PUBLISHED',
            showHeader: true,
            showFooter: true,
            createdBy: session.user.id,
            publishedAt: new Date(),
          },
        })
      )
    )

    return NextResponse.json({
      success: true,
      seeded: results.map((p) => ({ slug: p.slug, title: p.title })),
    })
  } catch (error) {
    return handleApiError(error)
  }
}
