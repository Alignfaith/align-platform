'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  User, MapPin, Camera, Save, ArrowLeft, Loader2, CheckCircle2,
  Shield, Briefcase, GraduationCap, Upload, AlertCircle, Globe
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { US_STATES, COUNTRIES, EDUCATION_OPTIONS } from '@/lib/location-data'
import CityAutocomplete from '@/components/CityAutocomplete'

// Resize image client-side using canvas, returns a JPEG blob
async function resizeImageToJpeg(file: File, maxPx = 800): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      let { width, height } = img
      if (width > maxPx || height > maxPx) {
        if (width >= height) {
          height = Math.round((height * maxPx) / width)
          width = maxPx
        } else {
          width = Math.round((width * maxPx) / height)
          height = maxPx
        }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) { reject(new Error('Canvas not supported')); return }
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Image conversion failed'))),
        'image/jpeg',
        0.82
      )
    }
    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Could not load image')) }
    img.src = objectUrl
  })
}

export default function ProfileEditPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    country: 'United States',
    state: '',
    city: '',
    profession: '',
    education: '',
    relationshipGoal: 'MARRIAGE',
  })

  // Photo state
  const [identityPhotoUrl, setIdentityPhotoUrl] = useState<string | null>(null)
  const [identityPhotoApproved, setIdentityPhotoApproved] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)

  // Human verification state
  const [humanVerified, setHumanVerified] = useState(false)
  const [verificationSubmitted, setVerificationSubmitted] = useState(false)
  const [verificationPreview, setVerificationPreview] = useState<string | null>(null)
  const [uploadingVerification, setUploadingVerification] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const verificationInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/profile/me')
        .then((r) => r.json())
        .then((d) => {
          if (d && d.id) {
            setFormData({
              displayName: d.displayName ?? '',
              bio: d.bio ?? '',
              country: d.country ?? 'United States',
              state: d.state ?? '',
              city: d.city ?? '',
              profession: d.profession ?? '',
              education: d.education ?? '',
              relationshipGoal: d.relationshipGoal ?? 'MARRIAGE',
            })
            setIdentityPhotoUrl(d.identityPhotoUrl ?? null)
            setIdentityPhotoApproved(d.identityPhotoApproved ?? false)
            setHumanVerified(d.humanVerified ?? false)
            setVerificationSubmitted(!!d.humanVerificationPhotoUrl)
          } else {
            setFormData(prev => ({ ...prev, displayName: session?.user?.name ?? '' }))
          }
        })
        .catch(() => {
          setFormData(prev => ({ ...prev, displayName: session?.user?.name ?? '' }))
        })
        .finally(() => setLoadingProfile(false))
    }
  }, [status, session])

  const isUS = formData.country === 'United States'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Reset input so the same file can be re-selected
    e.target.value = ''

    setPhotoError(null)
    setUploadingPhoto(true)

    try {
      const blob = await resizeImageToJpeg(file)
      setPhotoPreview(URL.createObjectURL(blob))
      const fd = new FormData()
      fd.append('photo', blob, 'photo.jpg')
      const res = await fetch('/api/profile/photo', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setIdentityPhotoUrl(data.url)
      setIdentityPhotoApproved(false)
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : 'Upload failed')
      setPhotoPreview(null)
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleVerificationSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    setVerificationError(null)
    setUploadingVerification(true)

    try {
      const blob = await resizeImageToJpeg(file)
      setVerificationPreview(URL.createObjectURL(blob))
      const fd = new FormData()
      fd.append('photo', blob, 'photo.jpg')
      const res = await fetch('/api/profile/verification', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setVerificationSubmitted(true)
    } catch (err) {
      setVerificationError(err instanceof Error ? err.message : 'Upload failed')
      setVerificationPreview(null)
    } finally {
      setUploadingVerification(false)
    }
  }

  if (status === 'loading' || loadingProfile) {
    return (
      <>
        <Header />
        <main style={{ paddingTop: 'var(--header-height)' }}>
          <section className="section section--cream" style={{ minHeight: 'calc(100vh - var(--header-height))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Loading your profile...</p>
          </section>
        </main>
      </>
    )
  }

  const displayPhoto = photoPreview ?? identityPhotoUrl

  return (
    <>
      <Header />
      <main style={{ paddingTop: 'var(--header-height)' }}>
        <section className="section section--cream" style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
          <div className="container">
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {/* Header */}
              <div style={{ marginBottom: 'var(--space-8)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <Link href="/dashboard" className="btn btn--glass btn--sm" style={{ padding: 'var(--space-2)' }}>
                  <ArrowLeft size={20} />
                </Link>
                <div>
                  <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-primary)', marginBottom: 0 }}>
                    Edit Your Profile
                  </h1>
                  <p style={{ color: 'var(--color-slate)', marginBottom: 0 }}>
                    Let your community see your intentionality.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: 'var(--space-8)' }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                  {/* Identity Photo */}
                  <div className="card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
                    <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto var(--space-4)' }}>
                      <div style={{
                        width: '100%', height: '100%', borderRadius: '50%',
                        backgroundColor: 'var(--color-blush)', border: '4px solid white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden', boxShadow: 'var(--shadow-md)',
                      }}>
                        {displayPhoto ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={displayPhoto} alt="Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <User size={64} color="var(--color-primary)" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        disabled={uploadingPhoto}
                        style={{
                          position: 'absolute', bottom: 0, right: 0,
                          width: '36px', height: '36px', borderRadius: '50%',
                          backgroundColor: 'var(--color-primary)', color: 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: '2px solid white', cursor: 'pointer',
                        }}
                      >
                        {uploadingPhoto ? <Loader2 size={16} className="animate-spin" /> : <Camera size={18} />}
                      </button>
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoSelect}
                        style={{ display: 'none' }}
                      />
                    </div>
                    <h4 style={{ marginBottom: 'var(--space-1)' }}>Photo</h4>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-slate)', marginBottom: 'var(--space-2)' }}>
                      For internal use only. Not visible to members until admin-approved.
                    </p>
                    {identityPhotoUrl && (
                      <div style={{
                        fontSize: 'var(--text-xs)',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        display: 'inline-block',
                        backgroundColor: identityPhotoApproved ? '#dcfce7' : '#fef9c3',
                        color: identityPhotoApproved ? '#15803d' : '#92400e',
                      }}>
                        {identityPhotoApproved ? 'Approved' : 'Pending review'}
                      </div>
                    )}
                    {photoError && (
                      <p style={{ fontSize: 'var(--text-xs)', color: '#b91c1c', marginTop: 'var(--space-2)' }}>{photoError}</p>
                    )}
                  </div>

                  {/* Human Verification */}
                  <div className="card" style={{ padding: 'var(--space-6)' }}>
                    <h4 style={{ marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <Shield size={18} color="var(--color-primary)" />
                      Human Proof
                    </h4>

                    {humanVerified ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3)', backgroundColor: '#dcfce7', borderRadius: 'var(--radius-md)' }}>
                        <CheckCircle2 size={18} color="#15803d" />
                        <p style={{ fontSize: 'var(--text-sm)', color: '#15803d', marginBottom: 0, fontWeight: 600 }}>Verified human</p>
                      </div>
                    ) : verificationSubmitted ? (
                      <div style={{ padding: 'var(--space-3)', backgroundColor: '#fef9c3', borderRadius: 'var(--radius-md)' }}>
                        <p style={{ fontSize: 'var(--text-sm)', color: '#92400e', marginBottom: 0, fontWeight: 600 }}>Under review</p>
                        <p style={{ fontSize: 'var(--text-xs)', color: '#92400e', marginBottom: 0 }}>Admin will review your selfie soon.</p>
                      </div>
                    ) : (
                      <>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-slate)', marginBottom: 'var(--space-3)' }}>
                          Take a selfie holding a piece of paper with your username written on it.
                        </p>
                        {verificationPreview && (
                          <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 'var(--space-3)' }}>
                            <Image src={verificationPreview} alt="Verification preview" fill style={{ objectFit: 'cover' }} unoptimized />
                          </div>
                        )}
                        {verificationError && (
                          <p style={{ fontSize: 'var(--text-xs)', color: '#b91c1c', marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <AlertCircle size={12} /> {verificationError}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => verificationInputRef.current?.click()}
                          disabled={uploadingVerification}
                          className="btn btn--secondary btn--sm"
                          style={{ width: '100%' }}
                        >
                          {uploadingVerification ? <><Loader2 size={14} className="animate-spin" /> Uploading...</> : <><Upload size={14} /> Upload Selfie</>}
                        </button>
                        <input
                          ref={verificationInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleVerificationSelect}
                          style={{ display: 'none' }}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                  {/* Basic Information */}
                  <div className="card" style={{ padding: 'var(--space-6)' }}>
                    <h3 style={{ marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-rose-light)', paddingBottom: 'var(--space-2)' }}>
                      Basic Information
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                      <div className="form-group">
                        <label className="form-label">Display Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.displayName}
                          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                          placeholder="e.g. John Nashville"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Relationship Goal</label>
                        <select
                          className="form-input"
                          value={formData.relationshipGoal}
                          onChange={(e) => setFormData({ ...formData, relationshipGoal: e.target.value })}
                        >
                          <option value="MARRIAGE">Marriage Minded</option>
                          <option value="SERIOUS_DATING">Intentional Dating</option>
                          <option value="DISCERNING">Focused Discernment</option>
                        </select>
                      </div>
                    </div>

                    {/* Location */}
                    <div style={{ marginTop: 'var(--space-4)' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Globe size={14} /> Country
                        </label>
                        <select
                          className="form-input"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value, state: '', city: '' })}
                        >
                          {COUNTRIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div className="form-group">
                          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={14} /> {isUS ? 'State' : 'State / Province'}
                          </label>
                          {isUS ? (
                            <select
                              className="form-input"
                              value={formData.state}
                              onChange={(e) => setFormData({ ...formData, state: e.target.value, city: '' })}
                            >
                              <option value="">Select a state</option>
                              {US_STATES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              className="form-input"
                              value={formData.state}
                              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                              placeholder="State / Province"
                            />
                          )}
                        </div>

                        <div className="form-group">
                          <label className="form-label">City</label>
                          <CityAutocomplete
                            value={formData.city}
                            onChange={(city) => setFormData({ ...formData, city })}
                            state={isUS ? formData.state : ''}
                            placeholder={isUS && !formData.state ? 'Select a state first' : 'Enter your city'}
                            disabled={false}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional & Academic */}
                  <div className="card" style={{ padding: 'var(--space-6)' }}>
                    <h3 style={{ marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-rose-light)', paddingBottom: 'var(--space-2)' }}>
                      Professional & Academic
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Briefcase size={14} /> Profession
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.profession}
                          onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                          placeholder="What do you do?"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <GraduationCap size={14} /> Education
                        </label>
                        <select
                          className="form-input"
                          value={formData.education}
                          onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                        >
                          <option value="">Select level</option>
                          {EDUCATION_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="card" style={{ padding: 'var(--space-6)' }}>
                    <h3 style={{ marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-rose-light)', paddingBottom: 'var(--space-2)' }}>
                      About Your Journey
                    </h3>
                    <div className="form-group">
                      <label className="form-label">Bio (The "Why" behind your growth)</label>
                      <textarea
                        className="form-input form-textarea"
                        style={{ minHeight: '120px' }}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Share how God is working in your life and what you are preparing for..."
                      />
                    </div>
                  </div>

                  {error && (
                    <p style={{ color: '#B91C1C', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <AlertCircle size={16} /> {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className={`btn ${success ? 'btn--success' : 'btn--primary'} btn--lg`}
                    disabled={isSaving}
                    style={{ width: '100%' }}
                  >
                    {isSaving ? <Loader2 size={24} className="animate-spin" /> :
                      success ? <><CheckCircle2 size={24} /> Profile Saved</> :
                        <><Save size={24} /> Save Profile Changes</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
