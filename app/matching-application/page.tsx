'use client'

import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// ─── US States ───────────────────────────────────────────────────────────────

const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming','Washington D.C.']

// ─── Section wrapper ─────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 'var(--space-8)' }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)', margin: '0 0 var(--space-5)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {children}
      </div>
    </div>
  )
}

// ─── Field wrappers ───────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }
const hintStyle: React.CSSProperties = { fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginLeft: 'var(--space-1)' }
const baseInput: React.CSSProperties = { width: '100%', padding: '10px 14px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none' }

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}{required && <span style={{ color: 'var(--color-primary)', marginLeft: 4 }}>*</span>}{hint && <span style={hintStyle}>{hint}</span>}</label>
      {children}
    </div>
  )
}

function Select({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder?: string }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{ ...baseInput, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%236b7280' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

function Textarea({ value, onChange, placeholder, rows = 4 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ ...baseInput, resize: 'vertical' }} />
}

// ─── Form state type ──────────────────────────────────────────────────────────

interface ChildEntry { sex: string; age: string }

interface FormState {
  isChristian: string
  denomination: string
  churchFrequency: string
  maritalStatus: string
  dateOfBirth: string
  hasChildren: string
  childrenCount: string
  children: ChildEntry[]
  openToPartnerChildren: string
  openToPartnerChildrenOther: string
  city: string
  state: string
  willingToRelocate: string
  homeOwnership: string
  householdMembers: string[]
  pets: string
  profession: string
  incomeRange: string
  fitnessLevel: string
  lookingToMarry: string
  marriageTimeline: string
  appearanceDescription: string
  partnerPhysicalAttrs: string
  nonNegotiables: string
  conflictHandling: string
  idealPartnership: string
  photo: File | null
}

const INITIAL: FormState = {
  isChristian: '', denomination: '', churchFrequency: '', maritalStatus: '',
  dateOfBirth: '', hasChildren: '', childrenCount: '', children: [],
  openToPartnerChildren: '', openToPartnerChildrenOther: '',
  city: '', state: '', willingToRelocate: '',
  homeOwnership: '', householdMembers: [], pets: '',
  profession: '', incomeRange: '', fitnessLevel: '',
  lookingToMarry: '', marriageTimeline: '', appearanceDescription: '',
  partnerPhysicalAttrs: '', nonNegotiables: '', conflictHandling: '',
  idealPartnership: '', photo: null,
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MatchingApplicationPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [form, setForm] = useState<FormState>(INITIAL)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [alreadySubmitted, setAlreadySubmitted] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?redirect=/matching-application')
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetch('/api/matching-application').then(r => r.json()).then(d => {
        if (d.application) setAlreadySubmitted(true)
      }).catch(() => {})
    }
  }, [session])

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm(f => ({ ...f, [key]: val }))

  // Sync children array length with childrenCount
  const setChildrenCount = (count: string) => {
    const n = parseInt(count) || 0
    const arr: ChildEntry[] = Array.from({ length: n }, (_, i) => form.children[i] ?? { sex: '', age: '' })
    setForm(f => ({ ...f, childrenCount: count, children: arr }))
  }

  const toggleHousehold = (val: string) => {
    setForm(f => {
      const current = f.householdMembers
      const updated = current.includes(val) ? current.filter(v => v !== val) : [...current, val]
      return { ...f, householdMembers: updated }
    })
  }

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    set('photo', file)
    const reader = new FileReader()
    reader.onload = () => setPhotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'photo') return
        if (k === 'children' || k === 'householdMembers') {
          fd.append(k, JSON.stringify(v))
        } else if (v !== null && v !== undefined) {
          fd.append(k, String(v))
        }
      })
      if (form.photo) fd.append('photo', form.photo)

      const res = await fetch('/api/matching-application', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Submission failed. Please check all fields.')
        return
      }
      setSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading') return null

  if (success) {
    return (
      <>
        <Header />
        <main style={{ paddingTop: 'var(--header-height)' }}>
          <div style={{ maxWidth: '640px', margin: '80px auto', padding: '48px 32px', textAlign: 'center', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)', borderRadius: '16px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '24px' }}>✓</div>
            <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', marginBottom: '16px' }}>Application Submitted</h1>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '32px' }}>
              Thank you for applying to our Professional Matching Service. We will review your application and reach out within 3–5 business days.
            </p>
            <a href="/dashboard" style={{ display: 'inline-block', padding: '12px 32px', background: 'var(--color-primary)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 700 }}>
              Return to Dashboard
            </a>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (alreadySubmitted) {
    return (
      <>
        <Header />
        <main style={{ paddingTop: 'var(--header-height)' }}>
          <div style={{ maxWidth: '640px', margin: '80px auto', padding: '48px 32px', textAlign: 'center', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)', borderRadius: '16px' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', marginBottom: '16px' }}>Application Already Submitted</h1>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '32px' }}>
              We already have your application on file. We will be in touch soon.
            </p>
            <a href="/dashboard" style={{ display: 'inline-block', padding: '12px 32px', background: 'var(--color-primary)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 700 }}>
              Return to Dashboard
            </a>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const numChildren = parseInt(form.childrenCount) || 0

  return (
    <>
      <Header />
      <main style={{ paddingTop: 'var(--header-height)' }}>
        {/* Hero */}
        <div style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border-subtle)', padding: '48px 32px 36px', textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '12px', fontWeight: 700 }}>Professional Matching Service</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--color-text-primary)', margin: '0 0 16px', lineHeight: 1.2 }}>Intake Application</h1>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            Please answer all questions honestly and thoroughly. This information helps us find the most compatible match for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px 80px' }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-error)', padding: '14px 18px', borderRadius: '10px', fontSize: 'var(--text-sm)', marginBottom: '32px' }}>
              {error}
            </div>
          )}

          {/* ── Section 1: Faith ── */}
          <Section title="1. Faith & Church">
            <Field label="Are you a Christian?" required>
              <Select value={form.isChristian} onChange={v => set('isChristian', v)} options={['Yes', 'No']} placeholder="Select…" />
            </Field>
            <Field label="What denomination or church do you attend?" hint="(optional)">
              <Select value={form.denomination} onChange={v => set('denomination', v)} options={['Baptist','Catholic','Non-denominational','Methodist','Pentecostal','Presbyterian','Church of Christ','AME','Other']} placeholder="Select…" />
            </Field>
            <Field label="How often do you attend church?" required>
              <Select value={form.churchFrequency} onChange={v => set('churchFrequency', v)} options={['Every week','2-3 times a month','Once a month','Rarely','Never']} placeholder="Select…" />
            </Field>
          </Section>

          {/* ── Section 2: Personal ── */}
          <Section title="2. Personal Information">
            <Field label="What is your marital status?" required>
              <Select value={form.maritalStatus} onChange={v => set('maritalStatus', v)} options={['Never married','Divorced','Widowed']} placeholder="Select…" />
            </Field>
            <Field label="What is your date of birth?" required hint="(age will be calculated automatically)">
              <input type="date" value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} required style={baseInput} max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]} />
              {form.dateOfBirth && (() => {
                const dob = new Date(form.dateOfBirth)
                const today = new Date()
                let age = today.getFullYear() - dob.getFullYear()
                const m = today.getMonth() - dob.getMonth()
                if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
                return <p style={{ margin: '6px 0 0', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Age: {age}</p>
              })()}
            </Field>
          </Section>

          {/* ── Section 3: Children ── */}
          <Section title="3. Children">
            <Field label="Do you have children?" required>
              <Select value={form.hasChildren} onChange={v => { set('hasChildren', v); if (v === 'No') setForm(f => ({ ...f, hasChildren: 'No', childrenCount: '', children: [] })) }} options={['Yes','No']} placeholder="Select…" />
            </Field>
            {form.hasChildren === 'Yes' && (
              <>
                <Field label="How many children do you have?" required>
                  <Select value={form.childrenCount} onChange={setChildrenCount} options={['1','2','3','4','5+']} placeholder="Select…" />
                </Field>
                {form.children.map((child, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '16px', background: 'var(--color-bg-elevated)', borderRadius: '10px', border: '1px solid var(--color-border-subtle)' }}>
                    <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-tertiary)', gridColumn: '1/-1' }}>Child {i + 1}</p>
                    <div>
                      <label style={labelStyle}>Sex</label>
                      <Select value={child.sex} onChange={v => { const c = [...form.children]; c[i] = { ...c[i], sex: v }; set('children', c) }} options={['Male','Female']} placeholder="Select…" />
                    </div>
                    <div>
                      <label style={labelStyle}>Age</label>
                      <input type="number" min="0" max="30" value={child.age} onChange={e => { const c = [...form.children]; c[i] = { ...c[i], age: e.target.value }; set('children', c) }} placeholder="Age" style={baseInput} />
                    </div>
                  </div>
                ))}
              </>
            )}
            <Field label="Are you open to a partner who has children?" required>
              <Select value={form.openToPartnerChildren} onChange={v => set('openToPartnerChildren', v)} options={['Yes if grown','Yes if over 12','No','Other']} placeholder="Select…" />
            </Field>
            {form.openToPartnerChildren === 'Other' && (
              <Field label="Please explain">
                <input type="text" value={form.openToPartnerChildrenOther} onChange={e => set('openToPartnerChildrenOther', e.target.value)} placeholder="Describe your preference…" style={baseInput} />
              </Field>
            )}
          </Section>

          {/* ── Section 4: Location ── */}
          <Section title="4. Location">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field label="City" required>
                <input type="text" value={form.city} onChange={e => set('city', e.target.value)} placeholder="Your city" style={baseInput} required />
              </Field>
              <Field label="State" required>
                <Select value={form.state} onChange={v => set('state', v)} options={US_STATES} placeholder="Select state…" />
              </Field>
            </div>
            <Field label="Are you willing to relocate?" required>
              <Select value={form.willingToRelocate} onChange={v => set('willingToRelocate', v)} options={['Yes','No','Maybe']} placeholder="Select…" />
            </Field>
          </Section>

          {/* ── Section 5: Home & Lifestyle ── */}
          <Section title="5. Home & Lifestyle">
            <Field label="Do you own or rent your home?" required>
              <Select value={form.homeOwnership} onChange={v => set('homeOwnership', v)} options={['Own','Rent']} placeholder="Select…" />
            </Field>
            <Field label="Who currently lives in your home?" hint="(select all that apply)" required>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                {['I live alone','My children','Roommates','Parents','Other family members'].map(opt => (
                  <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                    <input type="checkbox" checked={form.householdMembers.includes(opt)} onChange={() => toggleHousehold(opt)} style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)', cursor: 'pointer' }} />
                    {opt}
                  </label>
                ))}
              </div>
            </Field>
            <Field label="Do you have pets?" required>
              <Select value={form.pets} onChange={v => set('pets', v)} options={['No','Yes, dog','Yes, cat','Yes, both','Yes, other']} placeholder="Select…" />
            </Field>
          </Section>

          {/* ── Section 6: Career & Physical ── */}
          <Section title="6. Career & Physical">
            <Field label="What is your profession?" required>
              <input type="text" value={form.profession} onChange={e => set('profession', e.target.value)} placeholder="e.g. Nurse, Engineer, Teacher…" style={baseInput} required />
            </Field>
            <Field label="What is your annual income range?" required>
              <Select value={form.incomeRange} onChange={v => set('incomeRange', v)} options={['Under $30K','$30K–$50K','$50K–$75K','$75K–$100K','$100K–$150K','$150K–$200K','$200K+']} placeholder="Select…" />
            </Field>
            <Field label="How would you describe your physical fitness level?" required>
              <Select value={form.fitnessLevel} onChange={v => set('fitnessLevel', v)} options={['Very active','Active','Moderately active','Not very active']} placeholder="Select…" />
            </Field>
          </Section>

          {/* ── Section 7: Relationship Goals ── */}
          <Section title="7. Relationship Goals">
            <Field label="Are you looking to get married?" required>
              <Select value={form.lookingToMarry} onChange={v => set('lookingToMarry', v)} options={['Yes','No','Open to it']} placeholder="Select…" />
            </Field>
            <Field label="What is your timeline for marriage?" required>
              <Textarea value={form.marriageTimeline} onChange={v => set('marriageTimeline', v)} placeholder="e.g. Within 1-2 years, when the right person comes along…" />
            </Field>
            <Field label="How would you describe your appearance?" required>
              <Textarea value={form.appearanceDescription} onChange={v => set('appearanceDescription', v)} placeholder="Describe your physical appearance…" />
            </Field>
            <Field label="What physical attributes are important to you in a partner?" required>
              <Textarea value={form.partnerPhysicalAttrs} onChange={v => set('partnerPhysicalAttrs', v)} placeholder="Describe the physical qualities you look for…" />
            </Field>
            <Field label="What are your non-negotiables in a partner?" required>
              <Textarea value={form.nonNegotiables} onChange={v => set('nonNegotiables', v)} placeholder="List your absolute must-haves and deal-breakers…" />
            </Field>
            <Field label="How do you handle conflict in a relationship?" required>
              <Textarea value={form.conflictHandling} onChange={v => set('conflictHandling', v)} placeholder="Describe your approach to disagreements or conflict…" />
            </Field>
            <Field label="What does your ideal partnership look like day to day?" required>
              <Textarea value={form.idealPartnership} onChange={v => set('idealPartnership', v)} placeholder="Paint a picture of your ideal daily life with a partner…" />
            </Field>
          </Section>

          {/* ── Photo ── */}
          <Section title="8. Photo">
            <Field label="Upload a recent photo of yourself" hint="(optional, max 10 MB)">
              {photoPreview ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img src={photoPreview} alt="Preview" style={{ width: '160px', height: '160px', objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--color-border-subtle)' }} />
                  <button type="button" onClick={() => { set('photo', null); setPhotoPreview(null); if (fileRef.current) fileRef.current.value = '' }}
                    style={{ position: 'absolute', top: '-8px', right: '-8px', width: '26px', height: '26px', borderRadius: '50%', border: 'none', background: 'var(--color-error)', color: '#fff', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ✕
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => fileRef.current?.click()}
                  style={{ padding: '12px 20px', background: 'var(--color-bg-elevated)', border: '1px dashed var(--color-border-subtle)', borderRadius: '10px', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: 'var(--text-sm)' }}>
                  + Upload photo
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
            </Field>
          </Section>

          {/* ── Submit ── */}
          <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-6)' }}>
            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)', lineHeight: 1.6 }}>
              By submitting this application, you confirm that all information provided is accurate and truthful. We will review your application and contact you within 3–5 business days.
            </p>
            <button type="submit" disabled={submitting}
              style={{ width: '100%', padding: '14px', background: submitting ? 'rgba(185,28,28,0.5)' : 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: 'var(--text-base)', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', letterSpacing: '0.02em' }}>
              {submitting ? 'Submitting…' : 'Submit Application'}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </>
  )
}
