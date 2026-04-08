import type { Metadata } from 'next'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'

export const metadata: Metadata = {
  metadataBase: new URL('https://alignfaith.com'),
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketingNav />
      <main style={{ paddingTop: '64px' }}>{children}</main>
      <MarketingFooter />
    </>
  )
}
