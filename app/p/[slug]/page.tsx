import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
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
    title: `${page.title} - Align`,
    description: page.description || undefined,
  }
}

export default async function CmsPageView({ params }: PageProps) {
  const { slug } = await params
  const page = await getCmsPage(slug)

  if (!page) {
    notFound()
  }

  return (
    <>
      {page.showHeader && <Header />}
      <main style={{ paddingTop: page.showHeader ? 'var(--header-height)' : undefined }}>
        <section className="section section--white">
          <div className="container">
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h1 style={{ marginBottom: 'var(--space-6)' }}>{page.title}</h1>
              <div
                style={{
                  fontSize: 'var(--text-base)',
                  lineHeight: 'var(--leading-relaxed)',
                  color: 'var(--color-text-primary)',
                }}
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </div>
          </div>
        </section>
      </main>
      {page.showFooter && <Footer />}
    </>
  )
}
