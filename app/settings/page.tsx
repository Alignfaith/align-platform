'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
    Settings, Bell, Lock, CreditCard,
    LogOut, ChevronRight, User, Shield,
    Eye, EyeOff, Mail
} from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
    }, [status, router])

    if (status === 'loading') {
        return <div style={{ padding: 'var(--space-20) 0', textAlign: 'center' }}>Loading your preferences...</div>
    }

    if (!session) return null

    return (
        <>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)' }}>
                <section className="section section--cream" style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
                    <div className="container">
                        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                            <div style={{ marginBottom: 'var(--space-8)' }}>
                                <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
                                    Settings & Privacy
                                </h1>
                                <p style={{ color: 'var(--color-slate)' }}>Manage your account, membership, and visibility.</p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                {/* Membership Section */}
                                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                                    <div style={{ padding: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-rose-light)' }}>
                                        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-blush)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <CreditCard size={20} color="var(--color-primary)" />
                                            </div>
                                            <div>
                                                <h4 style={{ marginBottom: 0 }}>Membership Status</h4>
                                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-slate)', marginBottom: 0 }}>Current plan: {session.user.tier}</p>
                                            </div>
                                        </div>
                                        <Link href="/pricing" className="btn btn--secondary btn--sm">Manage</Link>
                                    </div>
                                    <div style={{ padding: 'var(--space-4) var(--space-6)', backgroundColor: 'rgba(0,0,0,0.01)' }}>
                                        <Link href="/pricing" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                                            View benefits of other tiers <ChevronRight size={14} />
                                        </Link>
                                    </div>
                                </div>

                                {/* Account Section */}
                                <div className="card" style={{ padding: 'var(--space-6)' }}>
                                    <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                        <User size={20} color="var(--color-primary)" />
                                        Account Security
                                    </h3>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <p style={{ fontWeight: 600, marginBottom: 0 }}>Email Address</p>
                                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)', marginBottom: 0 }}>{session.user.email}</p>
                                            </div>
                                            <button className="btn btn--glass btn--sm">Change</button>
                                        </div>

                                        <div style={{ height: '1px', backgroundColor: 'var(--color-rose-light)' }}></div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <p style={{ fontWeight: 600, marginBottom: 0 }}>Password</p>
                                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)', marginBottom: 0 }}>Last changed 3 months ago</p>
                                            </div>
                                            <Link href="/forgot-password" style={{ textDecoration: 'none' }} className="btn btn--glass btn--sm">Reset</Link>
                                        </div>

                                        <div style={{ height: '1px', backgroundColor: 'var(--color-rose-light)' }}></div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <p style={{ fontWeight: 600, marginBottom: 0 }}>Two-Factor Authentication</p>
                                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)', marginBottom: 0 }}>Recommended for Tier 2 members</p>
                                            </div>
                                            <button className="btn btn--glass btn--sm">Enable</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Visibility Section */}
                                <div className="card" style={{ padding: 'var(--space-6)' }}>
                                    <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                        <Eye size={20} color="var(--color-primary)" />
                                        Visibility & Privacy
                                    </h3>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>Ecosystem Visibility</p>
                                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)', marginBottom: 0 }}>
                                                    When enabled, other members in your discovery range can see your blurred profile.
                                                </p>
                                            </div>
                                            <div style={{ position: 'relative', width: '48px', height: '24px', backgroundColor: 'var(--color-primary)', borderRadius: '12px', cursor: 'pointer' }}>
                                                <div style={{ position: 'absolute', top: '2px', right: '2px', width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%' }}></div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>Incognito Growth</p>
                                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)', marginBottom: 0 }}>
                                                    Your growth reflections will only be visible to you and admin verified growth partners.
                                                </p>
                                            </div>
                                            <div style={{ position: 'relative', width: '48px', height: '24px', backgroundColor: '#e2e8f0', borderRadius: '12px', cursor: 'pointer' }}>
                                                <div style={{ position: 'absolute', top: '2px', left: '2px', width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Dangerous Zone */}
                                <div style={{ marginTop: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                    <button
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className="btn btn--outline-primary"
                                        style={{ width: '100%', justifyContent: 'center' }}
                                    >
                                        <LogOut size={18} /> Sign Out of Platform
                                    </button>

                                    <button className="btn btn--glass" style={{ width: '100%', justifyContent: 'center', color: '#B91C1C' }}>
                                        Deactivate Account
                                    </button>
                                </div>
                            </div>

                            <p style={{ textAlign: 'center', marginTop: 'var(--space-12)', fontSize: 'var(--text-xs)', color: 'var(--color-slate)' }}>
                                Align v0.1.0-alpha • Nashville, TN • Built for Purpose
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
