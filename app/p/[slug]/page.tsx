import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
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

        {/* Meet the Founder — only on /p/about */}
        {slug === 'about' && (
          <section style={{
            backgroundColor: 'var(--color-bg-secondary)',
            padding: '80px 24px',
          }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <p style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-primary)',
                marginBottom: '40px',
                textAlign: 'center',
              }}>
                Meet the Founder
              </p>

              <div
                className="founder-layout"
                style={{ display: 'flex', gap: '56px', alignItems: 'flex-start' }}
              >
                {/* Photo */}
                <div className="founder-photo">
                  <Image
                    src="/images/thomas-marks.png"
                    alt="Thomas Marks"
                    width={240}
                    height={300}
                    style={{ objectFit: 'contain', objectPosition: 'top' }}
                    priority
                  />
                </div>

                {/* Bio */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 className="founder-bio__name">Thomas Marks</h2>
                  <p className="founder-bio__title">Founder &amp; Author</p>
                  <p className="founder-bio__body">
                    Thomas Marks is the founder of ALIGN and the author of{' '}
                    <em>Relationship Fitness</em>. Led by God to build a platform where
                    Christians could grow together — not just read about growth alone —
                    Thomas created ALIGN on the conviction that the person you become
                    determines the relationship you attract.
                  </p>
                  <a
                    href="https://a.co/d/09qpJCAh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="founder-bio__cta"
                  >
                    Get the Book
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

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
