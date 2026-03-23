const principles = [
    'Preparation comes before connection',
    'Faith is foundational',
    'Character matters more than appearance',
    'Readiness comes before matching',
    'The platform is an equipment ecosystem',
    'Growth matters more than transactions',
]

export default function CorePrinciples() {
    return (
        <section className="section section--primary">
            <div className="container">
                <div className="text-center" style={{ marginBottom: 'var(--space-12)' }}>
                    <h2 style={{ marginBottom: 'var(--space-4)' }}>Core Principles</h2>
                    <p style={{
                        fontSize: 'var(--text-lg)',
                        opacity: 0.9,
                        maxWidth: '600px',
                        margin: '0 auto',
                    }}>
                        These truths guide everything we do at Align.
                    </p>
                </div>

                <div style={{
                    maxWidth: '700px',
                    margin: '0 auto',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-8)',
                }}>
                    {principles.map((principle, index) => (
                        <div key={index} className="principle-item">
                            <div className="principle-item__number">{index + 1}</div>
                            <p className="principle-item__text" style={{ color: 'var(--color-white)', marginBottom: 0 }}>
                                {principle}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
