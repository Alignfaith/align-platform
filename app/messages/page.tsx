'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
    MessageCircle, Shield, Lock, Send,
    MoreHorizontal, Search, User
} from 'lucide-react'
import Link from 'next/link'

// Mock data for Conversations
const MOCK_CONVERSATIONS = [
    {
        id: '1',
        displayName: 'Sarah M.',
        lastMessage: 'I really appreciated your reflection on spiritual discipline this week.',
        time: '2h ago',
        unread: true,
        phase: 3,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100',
    },
    {
        id: '2',
        displayName: 'David K.',
        lastMessage: 'How are you finding the financial pillar exercises?',
        time: '1d ago',
        unread: false,
        phase: 3,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
    }
]

export default function MessagesPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [selectedId, setSelectedId] = useState<string | null>(null)

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
                        <p>Opening your intentional conversations...</p>
                    </div>
                </main>
            </>
        )
    }

    if (!session) return null

    const isLocked = session.user.tier === 'FREE'

    return (
        <>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)' }}>
                <section className="section section--cream" style={{ minHeight: 'calc(100vh - var(--header-height))', padding: 'var(--space-8) 0' }}>
                    <div className="container">
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(300px, 1fr) 2fr',
                            gap: 'var(--space-6)',
                            height: 'calc(100vh - var(--header-height) - var(--space-16))',
                            backgroundColor: 'white',
                            borderRadius: 'var(--radius-2xl)',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-lg)',
                            border: '1px solid var(--color-rose-light)'
                        }}>
                            {/* Conversations Sidebar */}
                            <div style={{
                                borderRight: '1px solid var(--color-rose-light)',
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: 'rgba(0,0,0,0.01)'
                            }}>
                                <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid var(--color-rose-light)' }}>
                                    <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>Conversations</h2>
                                    <div style={{ position: 'relative' }}>
                                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-slate)' }} />
                                        <input
                                            type="text"
                                            className="form-input form-input--sm"
                                            placeholder="Search conversations..."
                                            style={{ paddingLeft: '36px' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ flex: 1, overflowY: 'auto' }}>
                                    {isLocked ? (
                                        <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
                                            <div style={{
                                                width: '48px', height: '48px', borderRadius: '50%',
                                                backgroundColor: 'var(--color-blush)', margin: '0 auto var(--space-4)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <Lock size={20} color="var(--color-primary)" />
                                            </div>
                                            <h4 style={{ marginBottom: 'var(--space-2)' }}>Messages Locked</h4>
                                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)', marginBottom: 'var(--space-4)' }}>
                                                Upgrade to start intentional conversations with your community.
                                            </p>
                                            <Link href="/pricing" className="btn btn--primary btn--sm" style={{ width: '100%' }}>
                                                Upgrade Now
                                            </Link>
                                        </div>
                                    ) : (
                                        MOCK_CONVERSATIONS.map((conv) => (
                                            <div
                                                key={conv.id}
                                                onClick={() => setSelectedId(conv.id)}
                                                style={{
                                                    padding: 'var(--space-4)',
                                                    cursor: 'pointer',
                                                    backgroundColor: selectedId === conv.id ? 'var(--color-blush)' : 'transparent',
                                                    borderLeft: selectedId === conv.id ? '4px solid var(--color-primary)' : '4px solid transparent',
                                                    transition: 'all 0.2s',
                                                    borderBottom: '1px solid var(--color-rose-light)'
                                                }}
                                            >
                                                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                                    <img
                                                        src={conv.avatar}
                                                        alt={conv.displayName}
                                                        style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--color-primary)' }}
                                                    />
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                            <span style={{ fontWeight: 700, color: 'var(--color-charcoal)' }}>{conv.displayName}</span>
                                                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-slate)' }}>{conv.time}</span>
                                                        </div>
                                                        <p style={{
                                                            fontSize: 'var(--text-sm)',
                                                            color: conv.unread ? 'var(--color-charcoal)' : 'var(--color-slate)',
                                                            fontWeight: conv.unread ? 600 : 400,
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            marginBottom: 0
                                                        }}>
                                                            {conv.lastMessage}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Chat Window */}
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {selectedId ? (
                                    <>
                                        {/* Chat Header */}
                                        <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-rose-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-blush)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <User size={20} color="var(--color-primary)" />
                                                </div>
                                                <div>
                                                    <h4 style={{ marginBottom: 0 }}>Sarah M.</h4>
                                                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', fontWeight: 600 }}>Phase 3 Connection</span>
                                                </div>
                                            </div>
                                            <button className="btn btn--glass btn--sm">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>

                                        {/* Messages area */}
                                        <div style={{ flex: 1, padding: 'var(--space-6)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', backgroundColor: 'var(--color-cream)' }}>
                                            <div style={{ alignSelf: 'center', padding: 'var(--space-2) var(--space-4)', backgroundColor: 'rgba(79, 70, 229, 0.1)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 600 }}>
                                                Phase 3 unlocked: full communication active
                                            </div>

                                            <div style={{ alignSelf: 'flex-start', maxWidth: '80%', padding: 'var(--space-3) var(--space-4)', backgroundColor: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', fontSize: 'var(--text-sm)' }}>
                                                Hello! I saw your post about the spiritual pillar. I've been struggling with daily quiet time too. How do you find balance?
                                            </div>

                                            <div style={{ alignSelf: 'flex-end', maxWidth: '80%', padding: 'var(--space-3) var(--space-4)', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', fontSize: 'var(--text-sm)' }}>
                                                It's definitely a journey! I've started setting my alarm 15 minutes earlier and leaving my phone in another room. It's transformed my mornings.
                                            </div>
                                        </div>

                                        {/* Input area */}
                                        <div style={{ padding: 'var(--space-6)', borderTop: '1px solid var(--color-rose-light)' }}>
                                            <form style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Type an intentional message..."
                                                />
                                                <button type="submit" className="btn btn--primary" style={{ padding: '0 var(--space-6)' }}>
                                                    <Send size={18} />
                                                </button>
                                            </form>
                                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-slate)', marginTop: 'var(--space-2)', textAlign: 'center' }}>
                                                Remember: Speak with grace and clarity. Protect each other's peace.
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-12)', textAlign: 'center', color: 'var(--color-slate)' }}>
                                        <MessageCircle size={48} color="var(--color-rose-light)" style={{ marginBottom: 'var(--space-4)' }} />
                                        <h3>Your Intentional Conversations</h3>
                                        <p style={{ maxWidth: '400px' }}>
                                            Select a connection from the sidebar to start communicating. All chats are monitored for adherence to community guidelines.
                                        </p>
                                        <div style={{ marginTop: 'var(--space-8)', padding: 'var(--space-6)', backgroundColor: 'var(--color-blush)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-primary)' }}>
                                            <Shield size={24} color="var(--color-primary)" style={{ marginBottom: 'var(--space-2)' }} />
                                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 600, marginBottom: 0 }}>
                                                Safety First: If any conversation feels inappropriate, use the block or report features immediately.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
