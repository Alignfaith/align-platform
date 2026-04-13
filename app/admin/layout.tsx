import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { prisma } from '@/lib/prisma'

export const metadata = {
  title: 'Admin - ALIGN',
}

async function getQueueCounts() {
  try {
    const [pendingPhotos, openReports, pendingAppeals, pendingFounders] = await Promise.all([
      prisma.photo.count({ where: { isApproved: false, moderatedAt: null } }),
      prisma.report.count({ where: { status: 'OPEN' } }),
      prisma.appeal.count({ where: { status: 'PENDING' } }),
      prisma.founderApplication.count({ where: { status: 'PENDING' } }),
    ])
    return { pendingPhotos, openReports, pendingAppeals, pendingFounders }
  } catch {
    return { pendingPhotos: 0, openReports: 0, pendingAppeals: 0, pendingFounders: 0 }
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  const ADMIN_EMAIL = 'thomas@dstormpg.com'
  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.email === ADMIN_EMAIL

  if (!isAdmin) {
    redirect('/')
  }

  const counts = await getQueueCounts()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-primary)' }}>
      <AdminSidebar
        pendingPhotos={counts.pendingPhotos}
        openReports={counts.openReports}
        pendingAppeals={counts.pendingAppeals}
        pendingFounders={counts.pendingFounders}
      />
      <main
        style={{
          flex: 1,
          padding: 'var(--space-6) var(--space-8)',
          maxWidth: '1400px',
          overflow: 'auto',
        }}
      >
        {children}
      </main>
    </div>
  )
}
