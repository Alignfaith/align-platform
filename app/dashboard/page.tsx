'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { User, Heart, MessageCircle, Settings, Crown, Users, Shield } from 'lucide-react'
import Link from 'next/link'

import ReflectionEngine from '@/components/ReflectionEngine'

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
    }, [status, router])

    if (status === 'loading') {
        return (
            <>
                <Header />
                <main style={{ paddingTop: 'var(--header-height)' }}>
                    <section className="section section--cream" style={{ minHeight: 'calc(100vh - var(--header-height))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <p>Loading...</p>
                    </section>
                </main>
            </>
        )
    }

    if (!session) {
        return null
    }

    const isAdmin = session.user.role === 'ADMIN'
    const profileComplete = session.user.profileComplete

    return (
        <>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)' }}>
                <section className="section section--cream" style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
                    <div className="container">
                        {/* Welcome Header */}
                        <div style={{ marginBottom: 'var(--space-8)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <h1 style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: 'var(--text-4xl)',
                                    color: 'var(--color-primary)',
                                    marginBottom: 'var(--space-2)',
                                }}>
                                    Dashboard
                                </h1>
                                <p style={{ color: 'var(--color-slate)', marginBottom: 0 }}>
                                    Your Relational Fitness Training Ground
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ color: 'var(--color-primary)', fontWeight: 600, marginBottom: 0 }}>
                                    {session.user.name || session.user.email}
                                </p>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-slate)', marginBottom: 0 }}>
                                    Readiness Score: <strong style={{ color: 'var(--color-accent)' }}>74</strong>
                                </p>
                            </div>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
                            gap: 'var(--space-8)',
                            alignItems: 'start'
                        }}>
                            {/* Left Column: Growth & Reflections */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                                {/* Profile Incomplete Alert */}
                                {!profileComplete && (
                                    <div style={{
                                        backgroundColor: 'var(--color-blush)',
                                        border: '2px solid var(--color-primary)',
                                        borderRadius: 'var(--radius-lg)',
                                        padding: 'var(--space-6)',
                                    }}>
                                        <h3 style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
                                            Complete Your Profile
                                        </h3>
                                        <p style={{ color: 'var(--color-charcoal)', marginBottom: 'var(--space-4)' }}>
                                            Finish setting up your profile to start discovering matches.
                                        </p>
                                        <Link href="/profile/setup" className="btn btn--primary">
                                            Complete Profile
                                        </Link>
                                    </div>
                                )}

                                {/* Reflection Engine */}
                                <ReflectionEngine />

                                {/* Growth Feed Placeholder */}
                                <div className="card" style={{ padding: 'var(--space-6)' }}>
                                    <h3 style={{ marginBottom: 'var(--space-4)' }}>Weekly Proof of Growth</h3>
                                    <div style={{
                                        padding: 'var(--space-12)',
                                        textAlign: 'center',
                                        backgroundColor: 'rgba(0,0,0,0.02)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '2px dashed var(--color-rose-light)'
                                    }}>
                                        <p style={{ color: 'var(--color-slate)', marginBottom: 0 }}>
                                            Your proof of growth updates will appear here.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Status & Navigation */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                                {/* Tier Status */}
                                <div style={{
                                    backgroundColor: 'white',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: 'var(--space-6)',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                        <Crown size={24} color="var(--color-accent)" />
                                        <h3 style={{ marginBottom: 0 }}>
                                            {session.user.tier === 'FREE' && 'Free Member'}
                                            {session.user.tier === 'TIER_1' && 'Tier 1 Member'}
                                            {session.user.tier === 'TIER_2' && 'Tier 2 Member'}
                                        </h3>
                                    </div>
                                    {session.user.tier === 'FREE' && (
                                        <p style={{ color: 'var(--color-slate)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                                            Free members focus on private personal growth. Upgrade to unlock community features and discovery.
                                        </p>
                                    )}
                                    <Link href="/pricing" className="btn btn--secondary btn--sm" style={{ width: '100%' }}>
                                        {session.user.tier === 'FREE' ? 'Upgrade Training' : 'Manage Subscription'}
                                    </Link>
                                </div>

                                {/* Quick Links */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                    {/* My Profile */}
                                    <Link href="/profile/edit" style={{ textDecoration: 'none' }}>
                                        <div className="card" style={{ padding: 'var(--space-4)', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--color-rose-light)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                                <User size={20} color="var(--color-primary)" />
                                                <span style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>My Profile</span>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Phased Discovery (Matches) */}
                                    <Link href="/matches" style={{ textDecoration: 'none' }}>
                                        <div className="card" style={{ padding: 'var(--space-4)', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--color-rose-light)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                                <Heart size={20} color="var(--color-primary)" />
                                                <span style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>Phased Discovery</span>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Messages */}
                                    <Link href="/messages" style={{ textDecoration: 'none' }}>
                                        <div className="card" style={{ padding: 'var(--space-4)', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--color-rose-light)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                                <MessageCircle size={20} color="var(--color-primary)" />
                                                <span style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>Conversations</span>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Settings */}
                                    <Link href="/settings" style={{ textDecoration: 'none' }}>
                                        <div className="card" style={{ padding: 'var(--space-4)', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--color-rose-light)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                                <Settings size={20} color="var(--color-primary)" />
                                                <span style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>Settings</span>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Admin Panel */}
                                    {isAdmin && (
                                        <Link href="/admin" style={{ textDecoration: 'none' }}>
                                            <div className="card" style={{ padding: 'var(--space-4)', cursor: 'pointer', transition: 'all 0.2s', border: '2px solid var(--color-primary)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                                    <Shield size={20} color="var(--color-primary)" />
                                                    <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Admin Panel</span>
                                                </div>
                                            </div>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
