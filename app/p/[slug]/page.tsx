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

        {/* Meet the Founder — only on /p/about */}
        {slug === 'about' && (
          <section style={{
            backgroundColor: 'var(--color-bg-secondary)',
            borderTop: '1px solid var(--color-border-subtle)',
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

              <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '56px',
                alignItems: 'flex-start',
              }}
                className="founder-layout"
              >
                {/* Photo */}
                <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
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
                  <h2 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                    fontWeight: 800,
                    color: 'var(--color-text-primary)',
                    lineHeight: 1.1,
                    margin: '0 0 8px',
                  }}>
                    Thomas Marks
                  </h2>
                  <p style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--color-primary)',
                    margin: '0 0 24px',
                  }}>
                    Founder &amp; Author
                  </p>
                  <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '1rem',
                    lineHeight: 1.8,
                    margin: '0 0 32px',
                    maxWidth: '560px',
                  }}>
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
                    style={{
                      display: 'inline-block',
                      backgroundColor: 'var(--color-primary)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      padding: '12px 28px',
                      borderRadius: 'var(--radius-md)',
                      textDecoration: 'none',
                      letterSpacing: '0.02em',
                    }}
                  >
                    Get the Book
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

      </main>
      {page.showFooter && <Footer />}
    </>
  )
}
