import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/authService'
import { tokenStorage } from '../services/apiClient'

const PROFILE_STORAGE_PREFIX = 'altensor_profile_'

function getProfileStorageKey(user) {
  const id = user?.id || user?.email
  return id ? `${PROFILE_STORAGE_PREFIX}${id}` : null
}

function readLocalProfile(user) {
  const key = getProfileStorageKey(user)
  if (!key) return {}
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeLocalProfile(user, profileData) {
  const key = getProfileStorageKey(user)
  if (!key) return
  try {
    localStorage.setItem(key, JSON.stringify(profileData))
  } catch {
    // ignore storage quota errors
  }
}

function formatDateInput(value) {
  if (!value) return ''
  const str = String(value)
  return str.includes('T') ? str.split('T')[0] : str
}

function stripAzPrefix(phone) {
  if (!phone) return ''
  const trimmed = String(phone).trim()
  if (trimmed.startsWith('+994')) return trimmed.slice(4).trim()
  if (trimmed.startsWith('994') && trimmed.length > 9) return trimmed.slice(3).trim()
  return trimmed
}

export default function ProfilePage() {
  const { user, setUser } = useAuth()

  const initialLocal = readLocalProfile(user)

  const [firstName, setFirstName] = useState(() => initialLocal.firstName ?? user?.firstName ?? '')
  const [lastName, setLastName] = useState(() => initialLocal.lastName ?? user?.lastName ?? '')
  const [email, setEmail] = useState(() => user?.email ?? '')
  const [dateOfBirth, setDateOfBirth] = useState(() =>
    formatDateInput(initialLocal.dateOfBirth ?? user?.dateOfBirth)
  )
  const [phoneNumber, setPhoneNumber] = useState(() =>
    stripAzPrefix(initialLocal.phoneNumber ?? user?.phoneNumber)
  )
  const [country, setCountry] = useState(() => initialLocal.country ?? user?.country ?? '')
  const [medicalNotes, setMedicalNotes] = useState(() => initialLocal.medicalNotes ?? user?.medicalNotes ?? '')

  const [loadingProfile, setLoadingProfile] = useState(true)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let ignore = false

    authService
      .getCurrentUser()
      .then((res) => {
        if (ignore) return
        const backendUser = res?.data
        if (!backendUser) return

        const localOverrides = readLocalProfile(backendUser)
        const mergedUser = { ...backendUser, ...localOverrides }

        setFirstName(mergedUser.firstName ?? '')
        setLastName(mergedUser.lastName ?? '')
        setEmail(mergedUser.email ?? '')
        setDateOfBirth(formatDateInput(mergedUser.dateOfBirth))
        setPhoneNumber(stripAzPrefix(mergedUser.phoneNumber))
        setCountry(mergedUser.country ?? '')
        setMedicalNotes(mergedUser.medicalNotes ?? '')

        setUser(mergedUser)
        tokenStorage.setSession(null, null, mergedUser)
      })
      .catch((err) => {
        console.error('Failed to load profile from backend:', err)
      })
      .finally(() => {
        if (!ignore) setLoadingProfile(false)
      })

    return () => {
      ignore = true
    }
  }, [setUser])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveError('')
    setSavedSuccess(false)

    try {
      const normalizedPhone = phoneNumber.trim()
        ? `+994${stripAzPrefix(phoneNumber.trim())}`
        : ''

      const updatedFields = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        fullName: `${firstName.trim()} ${lastName.trim()}`.trim(),
        dateOfBirth: dateOfBirth || null,
        phoneNumber: normalizedPhone,
        country: country.trim(),
        medicalNotes: medicalNotes,
      }

      const nextUser = {
        ...(user || {}),
        ...updatedFields,
      }

      writeLocalProfile(nextUser, updatedFields)
      setUser(nextUser)
      tokenStorage.setSession(null, null, nextUser)

      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 4000)
    } catch (err) {
      setSaveError(err?.message || 'Failed to save profile changes.')
    } finally {
      setIsSaving(false)
    }
  }

  const fullName = `${firstName} ${lastName}`.trim() || user?.fullName || email || 'Patient'

  return (
    <div className="min-h-screen bg-[#fafbfc] pt-[100px] pb-[120px]">
      <div className="mx-auto max-w-[1240px] px-6">
        {/* Breadcrumbs matching ZagrebMed */}
        <nav className="mb-6 flex items-center gap-2 text-[1.3rem] text-[#707070]">
          <Link to="/en" className="flex items-center text-[#707070] transition-colors hover:text-[#3665f6]">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </Link>
          <span className="text-[#c0c0c0]">•</span>
          <span className="font-semibold text-[#0a295b]">My Profile</span>
        </nav>

        {/* 3-Column Profile Form matching ZagrebMed 1:1 */}
        <form onSubmit={handleSaveProfile} className="space-y-12">
          <div className="grid grid-cols-1 gap-10 rounded-[12px] border border-[#e8edf5] bg-white p-8 shadow-xs md:grid-cols-12">
            {/* Left Column: Welcome & User Status (4 cols) */}
            <div className="border-b border-[#e9ecef] pb-6 md:col-span-4 md:border-b-0 md:border-r md:pr-8">
              <h2 className="text-[1.8rem] font-semibold text-[#0c3a94]">Welcome</h2>
              <h3 className="mt-1 break-words text-[3.8rem] font-semibold tracking-tight text-[#3665f6] sm:text-[5.2rem]">
                {fullName}
              </h3>
              {user?.createdAt && (
                <p className="mt-4 text-[1.4rem] text-[#666666]">
                  Joined {new Date(user.createdAt).toLocaleString()}
                </p>
              )}
              <div className="mt-4 flex items-center gap-2">
                <span className="text-[1.4rem] font-medium text-[#707070]">User is</span>
                <span className="rounded-full bg-[#e8f5e9] px-3 py-0.5 text-[1.3rem] font-bold tracking-wider text-[#7fbb58] uppercase">
                  ACTIVE
                </span>
              </div>

              <div className="mt-8 rounded-[8px] bg-[#f8faff] p-4 text-[1.3rem] text-[#666666]">
                <p className="font-bold text-[#0c3a94]">Altensor Digital Health Record</p>
                <p className="mt-1">
                  Your profile and medical data are secured according to strict GDPR and European medical confidentiality standards.
                </p>
              </div>
            </div>

            {/* Middle Column: Basic Profile (4 cols) */}
            <div className="space-y-6 border-b border-[#e9ecef] pb-6 md:col-span-4 md:border-b-0 md:border-r md:pr-8">
              <div className="flex items-center justify-between">
                <h3 className="text-[2.2rem] font-semibold text-[#0c3a94]">
                  Basic profile
                </h3>
                {loadingProfile && (
                  <span className="text-[1.2rem] text-[#707070]">Syncing...</span>
                )}
              </div>

              <div>
                <label className="block text-[1.3rem] font-bold text-[#707070]">
                  Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-[8px] border border-[#e0e0e0] px-4 py-2.5 text-[1.4rem] text-[#0a295b] focus:border-[#3665f6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[1.3rem] font-bold text-[#707070]">
                  Surname
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-[8px] border border-[#e0e0e0] px-4 py-2.5 text-[1.4rem] text-[#0a295b] focus:border-[#3665f6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[1.3rem] font-bold text-[#707070]">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="mt-1.5 w-full cursor-not-allowed rounded-[8px] border border-[#e0e0e0] bg-[#f5f5f5] px-4 py-2.5 text-[1.4rem] text-[#777777]"
                />
                <span className="mt-1 block text-[1.1rem] text-[#999999]">
                  Verified account email cannot be changed directly.
                </span>
              </div>
            </div>

            {/* Right Column: Additional profile information (4 cols) */}
            <div className="space-y-6 md:col-span-4">
              <h3 className="text-[2.2rem] font-semibold text-[#0c3a94]">
                Additional profile information
              </h3>

              <div>
                <label className="block text-[1.3rem] font-bold text-[#707070]">
                  Date of birth
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="mt-1.5 w-full rounded-[8px] border border-[#e0e0e0] px-4 py-2.5 text-[1.4rem] text-[#0a295b] focus:border-[#3665f6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[1.3rem] font-bold text-[#707070]">
                  Contact mobile number
                </label>
                <div className="mt-1.5 flex items-center overflow-hidden rounded-[8px] border border-[#e0e0e0] focus-within:border-[#3665f6]">
                  <div className="flex items-center gap-1.5 border-r border-[#e0e0e0] bg-[#f8faff] px-3 py-2.5 text-[1.4rem] font-semibold text-[#0a295b]">
                    <span>🇦🇿</span>
                    <span>+994</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="50 123 45 67"
                    className="w-full px-3 py-2.5 text-[1.4rem] text-[#0a295b] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[1.3rem] font-bold text-[#707070]">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Enter your country"
                  className="mt-1.5 w-full rounded-[8px] border border-[#e0e0e0] px-4 py-2.5 text-[1.4rem] text-[#0a295b] focus:border-[#3665f6] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Full-Width Bottom Section: Medical notes */}
          <div className="rounded-[12px] border border-[#e8edf5] bg-white p-8 shadow-xs">
            <h3 className="text-[3.6rem] font-semibold text-[#3665f6]">
              Medical notes
            </h3>
            <p className="mt-1 text-[1.4rem] text-[#707070]">
              Describe your medical background, current symptoms, allergies, or previous surgeries to assist our doctors at Altensor Healthcare.
            </p>

            <textarea
              rows={6}
              value={medicalNotes}
              onChange={(e) => setMedicalNotes(e.target.value)}
              placeholder="Add your medical history or specific medical requests here..."
              className="mt-4 w-full rounded-[8px] border border-[#c7c7c7] p-4 text-[1.4rem] text-[#0a295b] focus:border-[#3665f6] focus:outline-none"
            />

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                {savedSuccess && (
                  <div className="flex items-center gap-2 rounded-[8px] bg-[#e8f5e9] px-4 py-2 text-[1.4rem] font-bold text-[#2e7d32]">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Profile updated successfully!</span>
                  </div>
                )}
                {saveError && (
                  <div className="rounded-[8px] bg-[#ffebee] px-4 py-2 text-[1.4rem] font-bold text-[#c62828]">
                    {saveError}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="zm-btn zm-btn-green inline-flex cursor-pointer items-center justify-center rounded-[8px] px-8 py-3.5 text-[1.4rem] font-bold uppercase tracking-wider text-white shadow-xs disabled:opacity-60"
              >
                <span>{isSaving ? 'Saving...' : 'Save profile'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
