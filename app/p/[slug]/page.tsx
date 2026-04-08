import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Slug → human-readable category label for the eyebrow
const EYEBROW_LABELS: Record<string, string> = {
  'about':                 'Our Story',
  'faq':                   'Support',
  'privacy-policy':        'Legal',
  'terms-of-service':      'Legal',
  'community-guidelines':  'Community',
  'the-framework':         'The Framework',
}

function getEyebrow(slug: string): string {
  return EYEBROW_LABELS[slug] ?? 'ALIGN'
}

async function getCmsPage(slug: string) {
  return prisma.cmsPage.findUnique({
    where: { slug, status: 'PUBLISHED' },
  })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getCmsPage(slug)
  if (!page) return {}

  return {
    title: `${page.title} | ALIGN`,
    description: page.description || undefined,
  }
}

export default async function CmsPageView({ params }: PageProps) {
  const { slug } = await params
  const page = await getCmsPage(slug)

  if (!page) {
    notFound()
  }

  // Strip any leading <h1>…</h1> from content — the hero banner renders the title
  const content = page.content.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, '')

  return (
    <>
      {page.showHeader && <Header />}
      <main style={{ paddingTop: page.showHeader ? 'var(--header-height)' : undefined }}>

        {/* Hero banner */}
        <section className="cms-hero">
          <div className="container">
            <p className="cms-hero__eyebrow">{getEyebrow(slug)}</p>
            <h1 className="cms-hero__title">{page.title}</h1>
          </div>
        </section>

        {/* Prose content */}
        <section className="section section--cream">
          <div className="container">
            <div
              className="cms-prose"
              style={{ maxWidth: '760px', margin: '0 auto' }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </section>

      </main>
      {page.showFooter && <Footer />}
    </>
  )
}
