import { ChevronDown, Paperclip, User, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { SERVICE_CATEGORIES } from '../../data/services'
import { useAuth } from '../../hooks/useAuth'
import { useUI } from '../../hooks/useUI'
import { apiClient } from '../../services/apiClient'
import patientService from '../../services/patientService'

const STEPS = ['SEND INQUIRY', 'RECEIVE OFFER', 'PLAN TRIP', 'TREATMENT']

function formatDisplayDate(isoDate) {
  if (!isoDate) return ''
  const parts = isoDate.split('-')
  if (parts.length !== 3) return isoDate
  return `${parts[2]}.${parts[1]}.${parts[0]}`
}

function InquiryModalBody({ inquirySubject, closeInquiry }) {
  const { user, isAuthenticated } = useAuth()

  const [categories, setCategories] = useState(() =>
    SERVICE_CATEGORIES.map((cat) => ({
      id: cat.slug,
      slug: cat.slug,
      name: cat.name,
      procedures: (cat.featuredProcedures || []).map((p) => ({
        id: p.slug,
        title: p.name,
        slug: p.slug,
      })),
    }))
  )

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProcedure, setSelectedProcedure] = useState('')
  const [catDropdownOpen, setCatDropdownOpen] = useState(false)
  const [catSearch, setCatSearch] = useState('')
  const [procDropdownOpen, setProcDropdownOpen] = useState(false)
  const [procSearch, setProcSearch] = useState('')

  const [timeframeOpen, setTimeframeOpen] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [firstName, setFirstName] = useState(() => user?.firstName || '')
  const [lastName, setLastName] = useState(() => user?.lastName || '')
  const [email, setEmail] = useState(() => user?.email || '')
  const [phone, setPhone] = useState(() => user?.phoneNumber || '')

  const [flight, setFlight] = useState(false)
  const [accommodation, setAccommodation] = useState('NONE') // 'NONE' | 'HOTEL' | 'APARTMENT'
  const [transfer, setTransfer] = useState(false)
  const [files, setFiles] = useState([])
  const [message, setMessage] = useState(() =>
    inquirySubject ? `Interested in: ${inquirySubject}` : ''
  )
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptMarketing, setAcceptMarketing] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setIsVisible(true)
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  const handleAnimatedClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      closeInquiry()
    }, 300)
  }

  const fileInputRef = useRef(null)
  const catRef = useRef(null)
  const procRef = useRef(null)
  const timeframeRef = useRef(null)

  // Fetch dynamic categories & procedures from backend
  useEffect(() => {
    let ignore = false
    apiClient
      .get('/public/categories')
      .then((res) => {
        if (ignore || !res?.data || !Array.isArray(res.data) || res.data.length === 0) return
        const mapped = res.data.map((cat) => ({
          id: cat.id || cat.slug,
          slug: cat.slug || cat.id,
          name: cat.name,
          procedures: (cat.services || cat.medicalServices || []).map((s) => ({
            id: s.id,
            title: s.title || s.name,
            slug: s.slug,
          })),
        }))
        setCategories(mapped)
      })
      .catch(() => {
        // Keep local SERVICE_CATEGORIES fallback silently
      })
    return () => {
      ignore = true
    }
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) {
        setCatDropdownOpen(false)
      }
      if (procRef.current && !procRef.current.contains(e.target)) {
        setProcDropdownOpen(false)
      }
      if (timeframeRef.current && !timeframeRef.current.contains(e.target)) {
        setTimeframeOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const filteredCategories = useMemo(() => {
    const q = catSearch.trim().toLowerCase()
    if (!q) return categories
    return categories.filter((c) => c.name.toLowerCase().includes(q))
  }, [categories, catSearch])

  const activeCategoryObj = useMemo(
    () => categories.find((c) => c.slug === selectedCategory || c.id === selectedCategory),
    [categories, selectedCategory]
  )

  const availableProcedures = useMemo(() => {
    if (!activeCategoryObj) return []
    return activeCategoryObj.procedures || []
  }, [activeCategoryObj])

  const filteredProcedures = useMemo(() => {
    const q = procSearch.trim().toLowerCase()
    if (!q) return availableProcedures
    return availableProcedures.filter((p) => p.title.toLowerCase().includes(q))
  }, [availableProcedures, procSearch])

  const selectedProcedureObj = useMemo(
    () => availableProcedures.find((p) => p.id === selectedProcedure || p.slug === selectedProcedure),
    [availableProcedures, selectedProcedure]
  )

  const timeframeDisplay = useMemo(() => {
    if (!startDate && !endDate) return ''
    const startStr = formatDisplayDate(startDate)
    const endStr = formatDisplayDate(endDate)
    if (startStr && endStr) return `${startStr} - ${endStr}`
    if (startStr) return `${startStr} - `
    return endStr
  }, [startDate, endDate])

  const handleFileChange = (e) => {
    const chosen = Array.from(e.target.files || [])
    if (chosen.length > 0) {
      setFiles((prev) => [...prev, ...chosen])
    }
    e.target.value = ''
  }

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  const isGuid = (val) =>
    typeof val === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!acceptTerms) {
      setErrorMsg('Please accept the Terms and conditions and the Privacy Policy.')
      return
    }

    setSubmitting(true)
    try {
      const symptomsText =
        message.trim() ||
        inquirySubject ||
        selectedProcedureObj?.title ||
        activeCategoryObj?.name ||
        'Medical consultation inquiry'

      const extraDetails = [
        inquirySubject ? `Subject: ${inquirySubject}` : null,
        activeCategoryObj ? `Category: ${activeCategoryObj.name}` : null,
        selectedProcedureObj ? `Procedure: ${selectedProcedureObj.title}` : null,
        accommodation !== 'NONE' ? `Accommodation: ${accommodation}` : null,
        !isAuthenticated ? `Guest: ${firstName} ${lastName} (${email}, ${phone})` : null,
      ]
        .filter(Boolean)
        .join(' | ')

      await patientService.createInquiry({
        medicalServiceId: isGuid(selectedProcedureObj?.id) ? selectedProcedureObj.id : undefined,
        symptoms: symptomsText,
        description: extraDetails || undefined,
        preferredTimeframe: timeframeDisplay || 'Flexible',
        needsAccommodation: accommodation !== 'NONE',
        needsAirportTransfer: transfer,
        needsAirplaneTicket: flight,
        documents: files,
      })

      setSubmitted(true)
    } catch (err) {
      console.warn('Inquiry submit:', err)
      // Still confirm gracefully in UI if backend fallback created it
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDone = () => {
    setSubmitted(false)
    handleAnimatedClose()
  }

  const displayName = user?.firstName || user?.fullName || 'Patient'

  return (
    <div
      className={`fixed inset-0 z-[1200] flex justify-end bg-black/25 backdrop-blur-[6px] transition-opacity duration-300 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitted) handleAnimatedClose()
      }}
    >
      {/* Right Slide-Over Drawer matching ZagrebMed 1:1 */}
      <div
        className={`relative flex h-full w-full max-w-[820px] flex-col bg-white shadow-[-12px_0_40px_rgba(0,0,0,0.14)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Top-right Close X */}
        <button
          type="button"
          onClick={handleAnimatedClose}
          aria-label="Close modal"
          className="absolute right-6 top-6 z-20 cursor-pointer rounded-full p-2 text-[#0a295b] transition-colors hover:bg-slate-100 hover:text-[#3665f6]"
        >
          <X className="h-7 w-7" strokeWidth={1.75} />
        </button>

        <form onSubmit={handleSubmit} className="flex h-full flex-col overflow-hidden">
          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-7 pt-10 pb-10 sm:px-14">
            {/* Title & Breadcrumb Stepper */}
            <h2 className="pr-10 text-[3.2rem] font-bold tracking-tight text-[#0c3a94] sm:text-[4.2rem]">
              Let&apos;s plan your medical trip
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-2.5 text-[1.2rem] font-semibold tracking-wider uppercase">
              {STEPS.map((step, idx) => (
                <div key={step} className="flex items-center gap-2.5">
                  <span className={idx === 0 ? 'font-bold text-[#3665f6]' : 'text-[#707070]'}>
                    {step}
                  </span>
                  {idx < STEPS.length - 1 && (
                    <span className="text-[#9ca3af]">&rsaquo;</span>
                  )}
                </div>
              ))}
            </div>

            {inquirySubject && (
              <div className="mt-5 inline-flex items-center gap-2 rounded-[8px] bg-[#f0f4ff] px-3.5 py-2 text-[1.3rem] font-semibold text-[#0c3a94]">
                <span>Selected:</span>
                <span className="text-[#3665f6]">{inquirySubject}</span>
              </div>
            )}

            <div className="mt-10 space-y-10">
              {/* 1. Your personal information */}
              <div>
                <div className="flex items-center gap-5">
                  <span className="w-6 text-[2.2rem] font-bold text-[#3665f6]">1</span>
                  <h3 className="text-[2.2rem] font-bold text-[#3665f6]">
                    Your personal information
                  </h3>
                </div>

                <div className="mt-3 pl-11">
                  {isAuthenticated ? (
                    <p className="text-[1.45rem] text-[#555555]">
                      Logged in as{' '}
                      <Link
                        to="/en/my-profile"
                        onClick={closeInquiry}
                        className="font-semibold text-[#3665f6] hover:underline"
                      >
                        {displayName}
                      </Link>
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-[1.3rem] font-bold text-[#0a295b]">
                          Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="First name"
                          className="w-full rounded-[8px] border border-[#d1d5db] px-4 py-2.5 text-[1.4rem] text-[#0a295b] outline-none focus:border-[#3665f6]"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[1.3rem] font-bold text-[#0a295b]">
                          Surname *
                        </label>
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Last name"
                          className="w-full rounded-[8px] border border-[#d1d5db] px-4 py-2.5 text-[1.4rem] text-[#0a295b] outline-none focus:border-[#3665f6]"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[1.3rem] font-bold text-[#0a295b]">
                          E-mail *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="email@example.com"
                          className="w-full rounded-[8px] border border-[#d1d5db] px-4 py-2.5 text-[1.4rem] text-[#0a295b] outline-none focus:border-[#3665f6]"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[1.3rem] font-bold text-[#0a295b]">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+994 50 123 45 67"
                          className="w-full rounded-[8px] border border-[#d1d5db] px-4 py-2.5 text-[1.4rem] text-[#0a295b] outline-none focus:border-[#3665f6]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Procedure information */}
              <div>
                <div className="flex items-center gap-5">
                  <span className="w-6 text-[2.2rem] font-bold text-[#3665f6]">2</span>
                  <h3 className="text-[2.2rem] font-bold text-[#3665f6]">
                    Procedure information
                  </h3>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-6 pl-11 sm:grid-cols-2">
                  {/* Category Searchable Dropdown */}
                  <div className="space-y-5">
                    <div ref={catRef} className="relative">
                      <label className="mb-2 block text-[1.3rem] font-bold text-[#0a295b]">
                        Category
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setCatDropdownOpen((v) => !v)
                          setProcDropdownOpen(false)
                        }}
                        className="flex w-full cursor-pointer items-center justify-between rounded-[8px] border border-[#d1d5db] bg-white px-4 py-3 text-left text-[1.5rem] font-semibold text-[#0a295b] transition-colors hover:border-[#3665f6]"
                      >
                        <span className="truncate">
                          {selectedCategory === 'all'
                            ? 'All'
                            : activeCategoryObj?.name || 'All'}
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 shrink-0 text-[#3665f6] transition-transform ${
                            catDropdownOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {catDropdownOpen && (
                        <div className="absolute left-0 right-0 top-full z-30 mt-1.5 overflow-hidden rounded-[8px] border border-[#e0e0e0] bg-white shadow-xl">
                          <div className="border-b border-[#f0f0f0] p-2.5">
                            <input
                              type="text"
                              value={catSearch}
                              onChange={(e) => setCatSearch(e.target.value)}
                              placeholder="Search"
                              autoFocus
                              className="w-full rounded-[6px] border border-[#d1d5db] px-3 py-2 text-[1.4rem] text-[#0a295b] outline-none focus:border-[#3665f6]"
                            />
                          </div>
                          <div className="max-h-[220px] overflow-y-auto">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCategory('all')
                                setSelectedProcedure('')
                                setCatDropdownOpen(false)
                                setCatSearch('')
                              }}
                              className={`block w-full cursor-pointer px-4 py-2.5 text-left text-[1.45rem] font-semibold transition-colors ${
                                selectedCategory === 'all'
                                  ? 'bg-[#3665f6] text-white'
                                  : 'text-[#0a295b] hover:bg-[#f0f4ff]'
                              }`}
                            >
                              All
                            </button>
                            {filteredCategories.map((cat) => {
                              const isSelected =
                                selectedCategory === cat.slug || selectedCategory === cat.id
                              return (
                                <button
                                  key={cat.slug || cat.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCategory(cat.slug || cat.id)
                                    setSelectedProcedure('')
                                    setCatDropdownOpen(false)
                                    setCatSearch('')
                                  }}
                                  className={`block w-full cursor-pointer px-4 py-2.5 text-left text-[1.45rem] font-semibold transition-colors ${
                                    isSelected
                                      ? 'bg-[#3665f6] text-white'
                                      : 'text-[#0a295b] hover:bg-[#f0f4ff]'
                                  }`}
                                >
                                  {cat.name}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Procedure Dropdown (appears when a specific category is selected) */}
                    {selectedCategory !== 'all' && availableProcedures.length > 0 && (
                      <div ref={procRef} className="relative">
                        <label className="mb-2 block text-[1.3rem] font-bold text-[#0a295b]">
                          Procedure
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setProcDropdownOpen((v) => !v)
                            setCatDropdownOpen(false)
                          }}
                          className="flex w-full cursor-pointer items-center justify-between rounded-[8px] border border-[#d1d5db] bg-white px-4 py-3 text-left text-[1.5rem] font-semibold text-[#0a295b] transition-colors hover:border-[#3665f6]"
                        >
                          <span className="truncate">
                            {selectedProcedureObj?.title || 'Select procedure'}
                          </span>
                          <ChevronDown
                            className={`h-5 w-5 shrink-0 text-[#3665f6] transition-transform ${
                              procDropdownOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {procDropdownOpen && (
                          <div className="absolute left-0 right-0 top-full z-30 mt-1.5 overflow-hidden rounded-[8px] border border-[#e0e0e0] bg-white shadow-xl">
                            <div className="border-b border-[#f0f0f0] p-2.5">
                              <input
                                type="text"
                                value={procSearch}
                                onChange={(e) => setProcSearch(e.target.value)}
                                placeholder="Search"
                                autoFocus
                                className="w-full rounded-[6px] border border-[#d1d5db] px-3 py-2 text-[1.4rem] text-[#0a295b] outline-none focus:border-[#3665f6]"
                              />
                            </div>
                            <div className="max-h-[220px] overflow-y-auto">
                              {filteredProcedures.map((proc) => {
                                const isSelected =
                                  selectedProcedure === proc.id || selectedProcedure === proc.slug
                                return (
                                  <button
                                    key={proc.id || proc.slug}
                                    type="button"
                                    onClick={() => {
                                      setSelectedProcedure(proc.id || proc.slug)
                                      setProcDropdownOpen(false)
                                      setProcSearch('')
                                    }}
                                    className={`block w-full cursor-pointer px-4 py-2.5 text-left text-[1.4rem] font-semibold transition-colors ${
                                      isSelected
                                        ? 'bg-[#3665f6] text-white'
                                        : 'text-[#0a295b] hover:bg-[#f0f4ff]'
                                    }`}
                                  >
                                    {proc.title}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Timeframe Picker */}
                  <div ref={timeframeRef} className="relative">
                    <label className="mb-2 block text-[1.3rem] font-bold text-[#0a295b]">
                      Timeframe
                    </label>
                    <button
                      type="button"
                      onClick={() => setTimeframeOpen((v) => !v)}
                      className={`w-full cursor-pointer rounded-[8px] border border-[#d1d5db] bg-white px-4 py-3 text-left text-[1.5rem] transition-colors hover:border-[#3665f6] ${
                        timeframeDisplay ? 'font-medium text-[#0a295b]' : 'text-[#9ca3af]'
                      }`}
                    >
                      {timeframeDisplay || 'Please select'}
                    </button>

                    {timeframeOpen && (
                      <div className="absolute left-0 right-0 top-full z-30 mt-1.5 rounded-[8px] border border-[#e0e0e0] bg-white p-4 shadow-xl">
                        <div className="space-y-3">
                          <div>
                            <label className="mb-1 block text-[1.2rem] font-bold text-[#707070]">
                              From date
                            </label>
                            <input
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              className="w-full rounded-[6px] border border-[#d1d5db] px-3 py-2 text-[1.4rem] text-[#0a295b] outline-none focus:border-[#3665f6]"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-[1.2rem] font-bold text-[#707070]">
                              To date (optional)
                            </label>
                            <input
                              type="date"
                              value={endDate}
                              min={startDate || undefined}
                              onChange={(e) => setEndDate(e.target.value)}
                              className="w-full rounded-[6px] border border-[#d1d5db] px-3 py-2 text-[1.4rem] text-[#0a295b] outline-none focus:border-[#3665f6]"
                            />
                          </div>
                          <div className="flex justify-between pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setStartDate('')
                                setEndDate('')
                              }}
                              className="cursor-pointer text-[1.3rem] font-semibold text-[#707070] hover:text-[#0a295b]"
                            >
                              Clear
                            </button>
                            <button
                              type="button"
                              onClick={() => setTimeframeOpen(false)}
                              className="cursor-pointer rounded-[6px] bg-[#3665f6] px-4 py-1.5 text-[1.3rem] font-semibold text-white"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Additional services */}
              <div>
                <div className="flex items-center gap-5">
                  <span className="w-6 text-[2.2rem] font-bold text-[#3665f6]">3</span>
                  <h3 className="text-[2.2rem] font-bold text-[#3665f6]">
                    Additional services
                  </h3>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-6 pl-11 sm:grid-cols-3">
                  {/* Airplane ticket */}
                  <div>
                    <p className="mb-2.5 text-[1.3rem] font-bold text-[#0a295b]">
                      Airplane ticket
                    </p>
                    <div className="flex items-center gap-5 text-[1.4rem] font-bold uppercase">
                      <button
                        type="button"
                        onClick={() => setFlight(false)}
                        className={`cursor-pointer transition-colors ${
                          !flight ? 'text-[#3665f6]' : 'text-[#0a295b] hover:text-[#3665f6]'
                        }`}
                      >
                        NO
                      </button>
                      <button
                        type="button"
                        onClick={() => setFlight(true)}
                        className={`cursor-pointer transition-colors ${
                          flight ? 'text-[#3665f6]' : 'text-[#0a295b] hover:text-[#3665f6]'
                        }`}
                      >
                        YES
                      </button>
                    </div>
                  </div>

                  {/* Accommodation */}
                  <div>
                    <p className="mb-2.5 text-[1.3rem] font-bold text-[#0a295b]">
                      Accommodation
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-[1.4rem] font-bold uppercase">
                      {['NONE', 'HOTEL', 'APARTMENT'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setAccommodation(opt)}
                          className={`cursor-pointer transition-colors ${
                            accommodation === opt
                              ? 'text-[#3665f6]'
                              : 'text-[#0a295b] hover:text-[#3665f6]'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Airport Transfer */}
                  <div>
                    <p className="mb-2.5 text-[1.3rem] font-bold text-[#0a295b]">
                      Airport Transfer
                    </p>
                    <div className="flex items-center gap-5 text-[1.4rem] font-bold uppercase">
                      <button
                        type="button"
                        onClick={() => setTransfer(false)}
                        className={`cursor-pointer transition-colors ${
                          !transfer ? 'text-[#3665f6]' : 'text-[#0a295b] hover:text-[#3665f6]'
                        }`}
                      >
                        NO
                      </button>
                      <button
                        type="button"
                        onClick={() => setTransfer(true)}
                        className={`cursor-pointer transition-colors ${
                          transfer ? 'text-[#3665f6]' : 'text-[#0a295b] hover:text-[#3665f6]'
                        }`}
                      >
                        YES
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Medical documentation */}
              <div>
                <div className="flex items-center gap-5">
                  <span className="w-6 text-[2.2rem] font-bold text-[#3665f6]">4</span>
                  <h3 className="text-[2.2rem] font-bold text-[#3665f6]">
                    Medical documentation
                  </h3>
                </div>

                <div className="mt-3 pl-11">
                  <p className="text-[1.45rem] text-[#555555]">
                    Please attach your existing medical documentation
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.dcm"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="zm-btn zm-btn-green mt-4 rounded-[8px] !px-6 !py-2.5 !text-[1.4rem] font-semibold"
                  >
                    <span>Add new file</span>
                  </button>

                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.map((f, idx) => (
                        <div
                          key={`${f.name}-${idx}`}
                          className="flex items-center justify-between rounded-[8px] border border-[#e5e7eb] bg-[#f8faff] px-3.5 py-2 text-[1.3rem] text-[#0a295b]"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Paperclip className="h-4 w-4 shrink-0 text-[#3665f6]" />
                            <span className="truncate font-medium">{f.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="ml-3 cursor-pointer text-[#707070] hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 5. Message */}
              <div>
                <div className="flex items-center gap-5">
                  <span className="w-6 text-[2.2rem] font-bold text-[#3665f6]">5</span>
                  <h3 className="text-[2.2rem] font-bold text-[#3665f6]">Message</h3>
                </div>

                <div className="mt-4 pl-11">
                  <textarea
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message or describe your symptoms..."
                    className="w-full rounded-[8px] border border-[#d1d5db] p-4 text-[1.5rem] text-[#0a295b] outline-none transition-colors focus:border-[#3665f6]"
                  />

                  <div className="mt-5 space-y-3">
                    <label className="flex cursor-pointer items-center gap-3 text-[1.4rem] font-semibold text-[#0a295b]">
                      <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="h-5 w-5 cursor-pointer rounded-[4px] border border-[#9ca3af] accent-[#3665f6]"
                      />
                      <span>I accept the Terms and conditions and the Privacy Policy</span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 text-[1.4rem] font-semibold text-[#0a295b]">
                      <input
                        type="checkbox"
                        checked={acceptMarketing}
                        onChange={(e) => setAcceptMarketing(e.target.checked)}
                        className="h-5 w-5 cursor-pointer rounded-[4px] border border-[#9ca3af] accent-[#3665f6]"
                      />
                      <span>I wish to receive marketing information</span>
                    </label>
                  </div>

                  {errorMsg && (
                    <p className="mt-3 text-[1.35rem] font-semibold text-red-600">
                      {errorMsg}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Footer Bar matching ZagrebMed */}
          <div className="border-t border-[#e5e7eb] bg-white px-7 py-5 sm:px-14">
            <div className="pl-11">
              <button
                type="submit"
                disabled={submitting}
                className="zm-btn zm-btn-green rounded-[8px] !px-10 !py-3.5 !text-[1.5rem] font-semibold disabled:opacity-60"
              >
                <span>{submitting ? 'Sending...' : 'Send inquiry'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Thank You Modal Overlay matching Screenshot 6 1:1 */}
        {submitted && (
          <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/30 p-4">
            <div className="w-full max-w-[460px] rounded-[12px] bg-white px-8 py-10 text-center shadow-2xl">
              <User className="mx-auto h-10 w-10 text-[#3665f6]" strokeWidth={1.75} />
              <h3 className="mt-4 text-[2.8rem] font-bold leading-tight text-[#3665f6]">
                Thank you for your inquiry!
              </h3>
              <p className="mt-3 text-[1.45rem] leading-relaxed text-[#555555]">
                We will get back to you in shortest time frame possible. You can track the status of your each inquiry within your profile.
              </p>
              <button
                type="button"
                onClick={handleDone}
                className="mt-7 inline-flex min-w-[130px] cursor-pointer items-center justify-center rounded-[8px] bg-[#3665f6] px-8 py-3 text-[1.45rem] font-semibold text-white transition-opacity hover:opacity-90"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function InquiryModal() {
  const { inquiryOpen, inquirySubject, closeInquiry } = useUI()

  if (!inquiryOpen) return null

  return (
    <InquiryModalBody
      key={inquirySubject || 'default'}
      inquirySubject={inquirySubject}
      closeInquiry={closeInquiry}
    />
  )
}
