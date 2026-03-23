import { Camera, Lock, ShieldCheck } from 'lucide-react'

export default function PhotoPolicy() {
    return (
        <section className="section section--white">
            <div className="container">
                <div className="grid-2col">
                    <div>
                        <h2 style={{ marginBottom: 'var(--space-4)' }}>
                            Photos Come Later.<br />
                            <span style={{ color: 'var(--color-primary)' }}>By Design.</span>
                        </h2>
                        <p style={{
                            fontSize: 'var(--text-lg)',
                            color: 'var(--color-slate)',
                            marginBottom: 'var(--space-6)',
                        }}>
                            Unlike other platforms, photos are not shown initially on Align.
                            This is intentional—we want you to connect based on character, values,
                            and pillar alignment first.
                        </p>
                        <p style={{
                            color: 'var(--color-slate)',
                            marginBottom: 'var(--space-6)',
                        }}>
                            Photos unlock only in <strong>Stage Two</strong>, after mutual interest
                            and intentional conversation have been established.
                        </p>

                        <div style={{
                            backgroundColor: 'var(--color-blush)',
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--space-6)',
                        }}>
                            <h4 style={{
                                marginBottom: 'var(--space-3)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                            }}>
                                <ShieldCheck size={20} color="var(--color-primary)" />
                                Photo Standards
                            </h4>
                            <ul style={{
                                listStyle: 'none',
                                fontSize: 'var(--text-sm)',
                                color: 'var(--color-charcoal)',
                            }}>
                                <li style={{ padding: 'var(--space-1) 0' }}>• No bikini or swimsuit photos</li>
                                <li style={{ padding: 'var(--space-1) 0' }}>• No shirtless or topless photos</li>
                                <li style={{ padding: 'var(--space-1) 0' }}>• No sexually suggestive images</li>
                                <li style={{
                                    padding: 'var(--space-2) 0 0',
                                    fontWeight: '600',
                                    color: 'var(--color-primary)',
                                }}>
                                    Violations result in removal.
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-6)',
                    }}>
                        <div className="card">
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-4)',
                                marginBottom: 'var(--space-4)',
                            }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: 'var(--radius-full)',
                                    backgroundColor: 'var(--color-blush)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Lock size={24} color="var(--color-primary)" />
                                </div>
                                <h4 style={{ marginBottom: 0 }}>Stage One</h4>
                            </div>
                            <p style={{ color: 'var(--color-slate)', marginBottom: 0 }}>
                                Connect through pillars and values. No photos visible.
                                Focus on alignment and genuine interest.
                            </p>
                        </div>

                        <div className="card" style={{ borderColor: 'var(--color-primary)', borderWidth: '2px', borderStyle: 'solid' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-4)',
                                marginBottom: 'var(--space-4)',
                            }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: 'var(--radius-full)',
                                    backgroundColor: 'var(--color-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Camera size={24} color="var(--color-white)" />
                                </div>
                                <h4 style={{ marginBottom: 0 }}>Stage Two</h4>
                            </div>
                            <p style={{ color: 'var(--color-slate)', marginBottom: 0 }}>
                                After mutual interest and meaningful conversation,
                                photos are unlocked naturally.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

