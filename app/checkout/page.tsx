'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'

function CheckoutInner() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') as 'TIER_1' | 'TIER_2' | null
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      const redirect = plan ? `/checkout?plan=${plan}` : '/pricing'
      router.replace(`/login?redirect=${encodeURIComponent(redirect)}`)
      return
    }

    if (!plan || !['TIER_1', 'TIER_2'].includes(plan)) {
      router.replace('/pricing')
      return
    }

    fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.url) {
          window.location.href = data.url
        } else {
          setError(data.error || 'Something went wrong. Please try again.')
        }
      })
      .catch(() => setError('Something went wrong. Please try again.'))
  }, [status, plan, router])

  if (error) {
    return (
      <main style={{ paddingTop: 'var(--header-height)' }}>
        <div style={{ padding: 'var(--space-20)', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-error)', marginBottom: 'var(--space-4)' }}>{error}</p>
          <a href="/pricing" style={{ color: 'var(--color-primary)' }}>Back to pricing</a>
        </div>
      </main>
    )
  }

  return (
    <main style={{ paddingTop: 'var(--header-height)' }}>
      <div style={{ padding: 'var(--space-20)', textAlign: 'center', color: 'var(--color-slate)' }}>
        <p>Redirecting to secure checkout...</p>
      </div>
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <main style={{ paddingTop: 'var(--header-height)' }}>
          <div style={{ padding: 'var(--space-20)', textAlign: 'center', color: 'var(--color-slate)' }}>
            <p>Loading...</p>
          </div>
        </main>
      }>
        <CheckoutInner />
      </Suspense>
    </>
  )
}
