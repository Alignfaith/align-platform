'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
    Users, Shield, Heart, Info, Lock,
    ChevronRight, Sparkles, MapPin, Search
} from 'lucide-react'
import Link from 'next/link'

// Mock data for Phased Discovery
const DISCOVERY_PROFILES = [
    {
        id: '1',
        displayName: 'John D.',
        age: 32,
        city: 'Nashville',
        state: 'TN',
        readinessScore: 88,
        mainPillar: 'SPIRITUAL',
        compatibility: 92,
        phase: 1, // Only basic info revealed
        blurredImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&blur=20',
    },
    {
        id: '2',
        displayName: 'Sarah M.',
        age: 28,
        city: 'Atlanta',
        state: 'GA',
        readinessScore: 74,
        mainPillar: 'MENTAL',
        compatibility: 85,
        phase: 1,
        blurredImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400&blur=20',
    },
    {
        id: '3',
        displayName: 'David K.',
        age: 35,
        city: 'Austin',
        state: 'TX',
        readinessScore: 91,
        mainPillar: 'FINANCIAL',
        compatibility: 78,
        phase: 1,
        blurredImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&blur=20',
    }
]

export default function MatchesPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')

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
                    <div style={{ padding: 'var(--space-20) 0', textAlign: 'center' }}>
                        <p>Loading your training ground...</p>
                    </div>
                </main>
            </>
        )
    }

    if (!session) return null

    const isFreeTier = session.user.tier === 'FREE'

    return (
        <>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)' }}>
                <section className="section section--cream" style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
                    <div className="container">
                        {/* Page Header */}
                        <div style={{ marginBottom: 'var(--space-8)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                                <Users size={20} color="var(--color-primary)" />
                                <span style={{ textTransform: 'uppercase', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--color-primary)' }}>
                                    The Ecosystem
                                </span>
                            </div>
                            <h1 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'var(--text-4xl)',
                                color: 'var(--color-primary)',
                                marginBottom: 'var(--space-2)'
                            }}>
                                Phased Discovery
                            </h1>
                            <p style={{ color: 'var(--color-slate)', maxWidth: '600px' }}>
                                meaningful connection is earned through growth. Discovery phases reveal more about a person as you both evolve.
                            </p>
                        </div>

                        {/* Tier Warning */}
                        {isFreeTier && (
                            <div style={{
                                backgroundColor: 'var(--color-primary)',
                                color: 'white',
                                padding: 'var(--space-6)',
                                borderRadius: 'var(--radius-lg)',
                                marginBottom: 'var(--space-8)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Lock size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ color: 'white', marginBottom: 'var(--space-1)' }}>Discovery Locked</h4>
                                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-sm)', marginBottom: 0 }}>
                                            Upgrade to Tier 1 to see community profiles and start your Phased Discovery.
                                        </p>
                                    </div>
                                </div>
                                <Link href="/pricing" className="btn btn--white btn--sm">
                                    Upgrade Plan
                                </Link>
                            </div>
                        )}

                        {/* Filters & Search */}
                        <div style={{
                            display: 'flex',
                            gap: 'var(--space-4)',
                            marginBottom: 'var(--space-8)',
                            flexWrap: 'wrap'
                        }}>
                            <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
                                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-slate)' }} />
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Search by pillar or growth focus..."
                                    style={{ paddingLeft: '40px' }}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    disabled={isFreeTier}
                                />
                            </div>
                            <button className="btn btn--outline-primary btn--sm" disabled={isFreeTier}>
                                Filter by Pillar
                            </button>
                            <button className="btn btn--outline-primary btn--sm" disabled={isFreeTier}>
                                Distance
                            </button>
                        </div>

                        {/* Discovery Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: 'var(--space-6)',
                            opacity: isFreeTier ? 0.6 : 1,
                            pointerEvents: isFreeTier ? 'none' : 'auto'
                        }}>
                            {DISCOVERY_PROFILES.map((profile) => (
                                <div key={profile.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                    {/* Profile Image (Blurred) */}
                                    <div style={{
                                        height: '240px',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <img
                                            src={profile.blurredImage}
                                            alt={profile.displayName}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.6))',
                                            padding: 'var(--space-4)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'flex-end'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                                <div>
                                                    <h3 style={{ color: 'white', marginBottom: 'var(--space-1)' }}>
                                                        {profile.displayName}, {profile.age}
                                                    </h3>
                                                    <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 'var(--text-sm)', marginBottom: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <MapPin size={14} /> {profile.city}, {profile.state}
                                                    </p>
                                                </div>
                                                <div style={{
                                                    backgroundColor: 'var(--color-accent)',
                                                    color: 'white',
                                                    padding: 'var(--space-1) var(--space-2)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    fontSize: 'var(--text-xs)',
                                                    fontWeight: 800
                                                }}>
                                                    {profile.compatibility}% Align
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{
                                            position: 'absolute',
                                            top: 'var(--space-4)',
                                            right: 'var(--space-4)',
                                            backgroundColor: 'rgba(255,255,255,0.9)',
                                            padding: 'var(--space-2) var(--space-3)',
                                            borderRadius: 'var(--radius-full)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-2)',
                                            backdropFilter: 'blur(4px)',
                                            boxShadow: 'var(--shadow-sm)'
                                        }}>
                                            <Sparkles size={14} color="var(--color-primary)" />
                                            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-primary)' }}>
                                                Phase {profile.phase}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Profile Details */}
                                    <div style={{ padding: 'var(--space-6)', flex: 1 }}>
                                        <div style={{ marginBottom: 'var(--space-4)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)' }}>Primary Pillar</span>
                                                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-charcoal)' }}>{profile.mainPillar}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)' }}>Readiness Score</span>
                                                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)' }}>{profile.readinessScore}/100</span>
                                            </div>
                                        </div>

                                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)', fontStyle: 'italic', marginBottom: 'var(--space-6)' }}>
                                            "Committed to growing in mental discipline and creating a home environment that honors God..."
                                        </p>

                                        <button className="btn btn--primary btn--sm" style={{ width: '100%' }}>
                                            Express Interest
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Empty/Locked State Info */}
                        <div style={{
                            marginTop: 'var(--space-12)',
                            padding: 'var(--space-8)',
                            backgroundColor: 'white',
                            borderRadius: 'var(--radius-xl)',
                            textAlign: 'center',
                            border: '1px solid var(--color-rose-light)'
                        }}>
                            <Info size={32} color="var(--color-primary)" style={{ marginBottom: 'var(--space-4)' }} />
                            <h3 style={{ marginBottom: 'var(--space-2)' }}>How Phased Discovery Works</h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: 'var(--space-6)',
                                marginTop: 'var(--space-6)',
                                textAlign: 'left'
                            }}>
                                <div>
                                    <h5 style={{ color: 'var(--color-primary)' }}>Phase 1: Alignment</h5>
                                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)', marginBottom: 0 }}>
                                        See basic info, location, and alignment scores. Photos are blurred to focus on character.
                                    </p>
                                </div>
                                <div>
                                    <h5 style={{ color: 'var(--color-primary)' }}>Phase 2: Engagement</h5>
                                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)', marginBottom: 0 }}>
                                        Exchanging interests and sharing proof of growth. Photos become slightly clearer.
                                    </p>
                                </div>
                                <div>
                                    <h5 style={{ color: 'var(--color-primary)' }}>Phase 3: Connection</h5>
                                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)', marginBottom: 0 }}>
                                        One-on-one communication unlocked. Full profiles and clear photos revealed.
                                    </p>
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
