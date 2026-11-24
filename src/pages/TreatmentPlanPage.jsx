import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Eraser,
  Eye,
  FileText,
  MessageCircle,
  Paperclip,
  ShieldCheck,
  Trash2,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AltensorLogo from '../components/common/AltensorLogo'
import {
  CategoryIllustration,
  HairGraftDiagram,
  HairTechniqueIcon,
  ToothButton,
  WorldMapWatermark,
} from '../components/planner/PlannerIllustrations'
import { BRAND } from '../data/brand'
import { useTranslation } from '../hooks/useTranslation'
import { getPlannerLocale } from '../i18n/plannerTranslations'
import {
  APPLICATION_TERMS_SECTIONS,
  CHECKUP_PACKAGES,
  COMMON_CONDITIONS,
  COSMETIC_HEALTH_FLAGS,
  COSMETIC_PROCEDURES,
  COUNTRY_CODES,
  DENTAL_TREATMENT_TYPES,
  EYE_PROCEDURES,
  HAIR_GRAFTS,
  HAIR_TECHNIQUES,
  HOSPITAL_PREFERENCES,
  IVF_CYCLES,
  LOWER_JAW_TEETH,
  PLANNER_STEPS,
  PREFERRED_CITIES,
  PROPOSAL_EXCLUSIONS,
  TREATMENT_CATEGORIES,
  TREATMENT_TIMELINES,
  UPPER_JAW_TEETH,
  WEIGHT_LOSS_PROCEDURES,
  WEIGHT_RELATED_CONDITIONS,
} from '../data/plannerData'

function RadioPill({ selected, onClick, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-3 rounded-[10px] border px-4 py-3.5 text-left text-[1.45rem] font-semibold transition-all ${
        selected
          ? 'border-[#3665f6] bg-[#eef3ff] text-[#0c3a94] shadow-sm'
          : 'border-[#dce4f5] bg-white text-[#0a295b] hover:border-[#3665f6]/60 hover:bg-[#f8faff]'
      } ${className}`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
          selected ? 'border-[#3665f6] bg-[#3665f6] text-white' : 'border-[#cbd5e1] bg-white'
        }`}
      >
        {selected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
      </span>
      <span>{children}</span>
    </button>
  )
}

function YesNoGroup({ value, onChange, yesLabel = 'Yes', noLabel = 'No' }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <RadioPill selected={value === 'yes'} onClick={() => onChange('yes')}>
        {yesLabel}
      </RadioPill>
      <RadioPill selected={value === 'no'} onClick={() => onChange('no')}>
        {noLabel}
      </RadioPill>
    </div>
  )
}

export default function TreatmentPlanPage() {
  const location = useLocation()
  const { t, language, setLanguage } = useTranslation()
  const pl = getPlannerLocale(language)
  const trOpt = (key) => pl.options[key] || key
  const initialSubject = location.state?.subject || ''

  const [step, setStep] = useState(1)
  const [category, setCategory] = useState('')
  const [stepError, setStepError] = useState('')

  // Step 2: Shared preferences
  const [preferredCity, setPreferredCity] = useState('baku')
  const [hospitalPref, setHospitalPref] = useState('no-preference')

  // Step 2: Hair Transplant
  const [hairGrafts, setHairGrafts] = useState('2000-3500')
  const [hairTechnique, setHairTechnique] = useState('fue')
  const [hairSecondSession, setHairSecondSession] = useState('no')
  const [hairExistingBeardOrPrev, setHairExistingBeardOrPrev] = useState('no')

  // Step 2: Dental
  const [activeDentalTool, setActiveDentalTool] = useState('implant')
  const [toothMap, setToothMap] = useState({})
  const [upperArch, setUpperArch] = useState('') // '', 'all-on-4', 'all-on-6'
  const [lowerArch, setLowerArch] = useState('') // '', 'all-on-4', 'all-on-6'
  const [dentalCleaning, setDentalCleaning] = useState('no')
  const [dentalNotSure, setDentalNotSure] = useState('no')
  const [dentalNotes, setDentalNotes] = useState('')

  // Step 2: Cosmetic
  const [cosmeticProc, setCosmeticProc] = useState('Liposuction')

  // Step 2: Eye
  const [eyeProc, setEyeProc] = useState('lasik')
  const [rightEye, setRightEye] = useState(true)
  const [leftEye, setLeftEye] = useState(true)

  // Step 2: Weight Loss
  const [weightLossProc, setWeightLossProc] = useState('Sleeve Gastrectomy')

  // Step 2: IVF
  const [ivfCycles, setIvfCycles] = useState('1 IVF Cycle')
  const [ivfPgt, setIvfPgt] = useState('no')

  // Step 2: Check-up
  const [checkupPkg, setCheckupPkg] = useState('executive-male')

  // Step 3: About You
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('')

  // Step 4: Health Info
  const [healthConsent, setHealthConsent] = useState(false)
  const [conditions, setConditions] = useState(['None of the above'])
  const [takingMed, setTakingMed] = useState('no')
  const [medDetails, setMedDetails] = useState('')
  const [smokingAlcohol, setSmokingAlcohol] = useState('Neither')
  const [prevSurgeries, setPrevSurgeries] = useState('no')
  const [prevSurgeriesDetails, setPrevSurgeriesDetails] = useState('')
  const [allergies, setAllergies] = useState('no')
  const [allergiesDetails, setAllergiesDetails] = useState('')
  const [pregnantOrBreastfeeding, setPregnantOrBreastfeeding] = useState('No')

  // Step 4: Treatment-specific health
  const [hairBloodThinners, setHairBloodThinners] = useState('no')
  const [hairScalpCondition, setHairScalpCondition] = useState('no')
  const [hairScalpDetails, setHairScalpDetails] = useState('')
  const [dentalGumDisease, setDentalGumDisease] = useState('no')
  const [cosmeticFlags, setCosmeticFlags] = useState(['None of the above'])
  const [eyePrevConditions, setEyePrevConditions] = useState('no')
  const [eyeContactLenses, setEyeContactLenses] = useState('no')
  const [eyeStablePrescription, setEyeStablePrescription] = useState('yes')
  const [weightHeightCm, setWeightHeightCm] = useState('')
  const [weightKg, setWeightKg] = useState('')
  const [weightConditions, setWeightConditions] = useState(['None of the above'])
  const [weightMentalHistory, setWeightMentalHistory] = useState('no')
  const [ivfPrevAttempts, setIvfPrevAttempts] = useState('0')
  const [ivfMaleFactor, setIvfMaleFactor] = useState('no')
  const [ivfAmhResult, setIvfAmhResult] = useState('')

  // Step 5: Photos & Files
  const [uploadedFiles, setUploadedFiles] = useState([])
  const fileInputRef = useRef(null)

  // Step 7: Contact Info
  const [email, setEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [countryCode, setCountryCode] = useState('+994')
  const [phone, setPhone] = useState('')
  const [commChannel, setCommChannel] = useState('WhatsApp')

  // Step 8: Agreement
  const [termsScrolledToEnd, setTermsScrolledToEnd] = useState(false)
  const [signatureName, setSignatureName] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [confirmAccuracy, setConfirmAccuracy] = useState(false)
  const termsBoxRef = useRef(null)

  // Step 9: Reference ID
  const [referenceCode] = useState(
    () => `ALT-${Math.floor(100000 + Math.random() * 900000)}`
  )

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const currentStepMeta = PLANNER_STEPS[step - 1] || PLANNER_STEPS[0]
  const currentCategoryObj = TREATMENT_CATEGORIES.find((c) => c.id === category)

  const toggleMultiOption = (list, setList, item, noneLabel = 'None of the above') => {
    if (item === noneLabel) {
      setList([noneLabel])
      return
    }
    const withoutNone = list.filter((x) => x !== noneLabel)
    if (withoutNone.includes(item)) {
      const next = withoutNone.filter((x) => x !== item)
      setList(next.length > 0 ? next : [noneLabel])
    } else {
      setList([...withoutNone, item])
    }
  }

  const handleToothToggle = (toothNumber) => {
    if (activeDentalTool === 'clear') {
      setToothMap((prev) => {
        const next = { ...prev }
        delete next[toothNumber]
        return next
      })
      return
    }
    setToothMap((prev) => {
      const current = prev[toothNumber] || []
      const exists = current.includes(activeDentalTool)
      const nextTreatments = exists
        ? current.filter((t) => t !== activeDentalTool)
        : [...current, activeDentalTool]
      const nextMap = { ...prev }
      if (nextTreatments.length === 0) {
        delete nextMap[toothNumber]
      } else {
        nextMap[toothNumber] = nextTreatments
      }
      return nextMap
    })
  }

  const requestSummaryText = useMemo(() => {
    switch (category) {
      case 'hair-transplant': {
        const graftLabel = pl.hairGrafts[hairGrafts] || HAIR_GRAFTS.find((g) => g.id === hairGrafts)?.label || ''
        const techLabel = pl.hairTechniques[hairTechnique]?.label || HAIR_TECHNIQUES.find((tItem) => tItem.id === hairTechnique)?.label || ''
        return `${graftLabel} · ${techLabel}`
      }
      case 'dental': {
        const toothCount = Object.keys(toothMap).length
        const arches = [
          upperArch ? `${pl.ui.dentalUpper} ${upperArch.toUpperCase()}` : null,
          lowerArch ? `${pl.ui.dentalLower} ${lowerArch.toUpperCase()}` : null,
        ].filter(Boolean)
        if (arches.length > 0) return `${pl.ui.dentalLabel} (${arches.join(', ')})`
        if (toothCount > 0) return `${pl.ui.dentalLabel} (${toothCount} ${pl.ui.dentalMarkedTeeth})`
        return pl.ui.dentalAssessment
      }
      case 'cosmetic':
        return trOpt(cosmeticProc)
      case 'eye': {
        const eyeLabel = pl.eyeProcs[eyeProc]?.label || EYE_PROCEDURES.find((e) => e.id === eyeProc)?.label || 'LASIK'
        const eyes = [rightEye && pl.ui.rightEye, leftEye && pl.ui.leftEye].filter(Boolean)
        return `${eyeLabel}${eyes.length ? ` (${eyes.join(' & ')})` : ''}`
      }
      case 'weight-loss':
        return trOpt(weightLossProc)
      case 'ivf':
        return `${trOpt(ivfCycles)}${ivfPgt === 'yes' ? pl.ui.pgtSuffix : ''}`
      case 'checkup':
        return pl.checkupPkgs[checkupPkg]?.label || CHECKUP_PACKAGES.find((p) => p.id === checkupPkg)?.label || pl.ui.healthCheckupFallback
      default:
        return initialSubject || pl.ui.defaultSummary
    }
  }, [
    category,
    hairGrafts,
    hairTechnique,
    toothMap,
    upperArch,
    lowerArch,
    cosmeticProc,
    eyeProc,
    rightEye,
    leftEye,
    weightLossProc,
    ivfCycles,
    ivfPgt,
    checkupPkg,
    initialSubject,
    pl,
  ])

  const handleSelectCategory = (catId) => {
    setCategory(catId)
    setStepError('')
    setStep(2)
  }

  const handleNext = () => {
    setStepError('')

    if (step === 2) {
      if (category === 'dental') {
        const hasTeeth = Object.keys(toothMap).length > 0
        if (!hasTeeth && !upperArch && !lowerArch && dentalNotSure !== 'yes') {
          setStepError(pl.ui.errDental)
          return
        }
      }
      if (category === 'eye' && !rightEye && !leftEye) {
        setStepError(pl.ui.errEye)
        return
      }
    }

    if (step === 3) {
      if (!firstName.trim() || !lastName.trim() || !dob || !gender) {
        setStepError(pl.ui.errAbout)
        return
      }
      if (!signatureName) {
        setSignatureName(`${firstName.trim()} ${lastName.trim()}`.trim())
      }
    }

    if (step === 4) {
      if (!healthConsent) {
        setStepError(pl.ui.errHealthConsent)
        return
      }
      if (category === 'weight-loss' && (!weightHeightCm || !weightKg)) {
        setStepError(pl.ui.errWeight)
        return
      }
    }

    if (step === 7) {
      if (!email.trim() || !confirmEmail.trim()) {
        setStepError(pl.ui.errEmailRequired)
        return
      }
      if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
        setStepError(pl.ui.errEmailMatch)
        return
      }
      if (!phone.trim()) {
        setStepError(pl.ui.errPhone)
        return
      }
    }

    if (step === 8) {
      if (!termsScrolledToEnd) {
        setStepError(pl.ui.errScrollTerms)
        return
      }
      if (!signatureName.trim()) {
        setStepError(pl.ui.errSignature)
        return
      }
      if (!acceptTerms || !confirmAccuracy) {
        setStepError(pl.ui.errCheckboxes)
        return
      }
    }

    setStep((s) => Math.min(9, s + 1))
  }

  const handleFileChange = (e) => {
    const incoming = Array.from(e.target.files || [])
    if (incoming.length === 0) return
    setUploadedFiles((prev) => [...prev, ...incoming].slice(0, 6))
  }

  const handleTermsScroll = () => {
    const el = termsBoxRef.current
    if (!el) return
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 16) {
      setTermsScrolledToEnd(true)
    }
  }

  const progressPct = Math.round((step / 9) * 100)

  return (
    <div className="relative flex min-h-screen flex-col bg-white text-[#0a295b]">
      <WorldMapWatermark />

      {/* Sticky Planner Header + Progress Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-[68px] max-w-[1140px] items-center justify-between px-5 sm:px-8">
          <Link to="/en" className="shrink-0" aria-label={pl.ui.backHomeAria}>
            <AltensorLogo />
          </Link>

          <div className="flex items-center gap-3 text-right">
            <div className="flex overflow-hidden rounded-full border border-[#dce4f5] bg-white text-[1.15rem] font-bold">
              {['en', 'az', 'ru'].map((lng) => (
                <button
                  key={lng}
                  type="button"
                  onClick={() => setLanguage(lng)}
                  className={`cursor-pointer px-2.5 py-1 uppercase transition-colors ${
                    language === lng ? 'bg-[#3665f6] text-white' : 'text-[#0a295b] hover:bg-[#eef3ff]'
                  }`}
                >
                  {lng}
                </button>
              ))}
            </div>
            <span className="rounded-full bg-[#eef3ff] px-3.5 py-1.5 text-[1.25rem] font-semibold text-[#0c3a94]">
              {t('planner.stepOf')} {step} {t('planner.of')} 9 · {pl.steps[currentStepMeta.key] || currentStepMeta.label}
            </span>
          </div>
        </div>

        {/* Thin Progress Bar */}
        <div className="h-[4px] w-full bg-[#e8eefb]">
          <div
            className="h-full bg-gradient-to-r from-[#3665f6] to-[#7fbb58] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </header>

      {/* Main Wizard Content */}
      <main className="relative z-10 mx-auto w-full max-w-[960px] flex-1 px-5 py-10 sm:px-8 sm:py-14">
        {/* STEP 1: TREATMENT CATEGORY */}
        {step === 1 && (
          <section>
            <div className="mx-auto max-w-[680px] text-center">
              <h1 className="text-[3rem] font-bold leading-[1.15] text-[#0c3a94] sm:text-[4rem]">
                {t('planner.step1Title')}
              </h1>
              <p className="mt-3 text-[1.65rem] font-medium text-[#555555]">
                {t('planner.step1Sub')}
              </p>
              <p className="mt-2 text-[1.4rem] text-[#666666]">
                {t('planner.step1Help')}
              </p>
              {initialSubject && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#3665f6]/25 bg-[#eef3ff] px-4 py-1.5 text-[1.3rem] font-semibold text-[#0c3a94]">
                  {t('planner.selectedTopic')}: {initialSubject}
                </div>
              )}
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {TREATMENT_CATEGORIES.map((cat) => {
                const catLoc = pl.categories[cat.id] || cat
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.id)}
                    className="group flex cursor-pointer flex-col items-center rounded-[14px] border border-[#e3eaf8] bg-white p-6 text-center shadow-[0_10px_28px_rgba(12,58,148,0.06)] transition-all duration-200 hover:-translate-y-1 hover:border-[#3665f6] hover:shadow-[0_16px_34px_rgba(54,101,246,0.14)]"
                  >
                    <div className="mb-3 flex h-[86px] items-center justify-center transition-transform duration-200 group-hover:scale-105">
                      <CategoryIllustration id={cat.id} />
                    </div>
                    <h2 className="text-[1.8rem] font-bold text-[#0c3a94] group-hover:text-[#3665f6]">
                      {catLoc.title}
                    </h2>
                    <p className="mt-2 text-[1.35rem] leading-[1.5] text-[#555555]">
                      {catLoc.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* STEP 2: TREATMENT-SPECIFIC DETAILS */}
        {step === 2 && (
          <section className="mx-auto max-w-[780px] space-y-8">
            <div>
              <h1 className="text-[2.8rem] font-bold text-[#0c3a94] sm:text-[3.4rem]">
                {pl.categories[category]?.title || currentCategoryObj?.title} {t('planner.detailsSuffix', 'details')}
              </h1>
              <p className="mt-1.5 text-[1.5rem] text-[#555555]">
                {t('planner.detailsSub')}
              </p>
            </div>

            {/* A. HAIR TRANSPLANT */}
            {category === 'hair-transplant' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-[1.75rem] font-bold text-[#0a295b]">
                    {pl.ui.hairGraftQ}
                  </h2>
                  <p className="mt-1 text-[1.35rem] text-[#666666]">
                    {pl.ui.hairGraftHelp}
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {HAIR_GRAFTS.map((item) => {
                      const active = hairGrafts === item.id
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setHairGrafts(item.id)}
                          className={`flex cursor-pointer items-center gap-4 rounded-[12px] border p-4 text-left transition-all ${
                            active
                              ? 'border-[#3665f6] bg-[#eef3ff] shadow-sm'
                              : 'border-[#dce4f5] bg-white hover:border-[#3665f6]/60'
                          }`}
                        >
                          <HairGraftDiagram level={item.densityLevel} />
                          <span className="text-[1.5rem] font-bold text-[#0c3a94]">
                            {pl.hairGrafts[item.id] || item.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h2 className="text-[1.75rem] font-bold text-[#0a295b]">{pl.ui.hairTechQ}</h2>
                  <div className="mt-3 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {HAIR_TECHNIQUES.map((tech) => {
                      const active = hairTechnique === tech.id
                      const techLoc = pl.hairTechniques[tech.id] || tech
                      return (
                        <button
                          key={tech.id}
                          type="button"
                          onClick={() => setHairTechnique(tech.id)}
                          className={`flex cursor-pointer items-start gap-3.5 rounded-[12px] border p-4 text-left transition-all ${
                            active
                              ? 'border-[#3665f6] bg-[#eef3ff] shadow-sm'
                              : 'border-[#dce4f5] bg-white hover:border-[#3665f6]/60'
                          }`}
                        >
                          <HairTechniqueIcon id={tech.id} />
                          <div>
                            <div className="text-[1.5rem] font-bold text-[#0c3a94]">
                              {techLoc.label}
                            </div>
                            <p className="mt-1 text-[1.3rem] leading-[1.45] text-[#555555]">
                              {techLoc.description}
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <h2 className="text-[1.6rem] font-bold text-[#0a295b]">
                    {pl.ui.hairSecondQ}
                  </h2>
                  <YesNoGroup
                    value={hairSecondSession}
                    onChange={setHairSecondSession}
                    yesLabel={pl.ui.yes}
                    noLabel={pl.ui.no}
                  />
                </div>

                <div className="space-y-2.5">
                  <h2 className="text-[1.6rem] font-bold text-[#0a295b]">
                    {pl.ui.hairPrevQ}
                  </h2>
                  <YesNoGroup
                    value={hairExistingBeardOrPrev}
                    onChange={setHairExistingBeardOrPrev}
                    yesLabel={pl.ui.yes}
                    noLabel={pl.ui.no}
                  />
                </div>
              </div>
            )}

            {/* B. DENTAL TREATMENTS */}
            {category === 'dental' && (
              <div className="space-y-7">
                <div>
                  <h2 className="text-[1.75rem] font-bold text-[#0a295b]">
                    {pl.ui.dentalMarkQ}
                  </h2>
                  <p className="mt-1 text-[1.35rem] text-[#666666]">
                    {pl.ui.dentalMarkHelp}
                  </p>

                  {/* Treatment Type Selector */}
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {DENTAL_TREATMENT_TYPES.map((tool) => {
                      const active = activeDentalTool === tool.id
                      const toolLoc = pl.dentalTypes[tool.id] || tool
                      return (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => setActiveDentalTool(tool.id)}
                          className={`flex cursor-pointer items-center gap-2 rounded-[10px] border px-3.5 py-2 text-[1.35rem] font-bold transition-all ${
                            active ? 'shadow-sm ring-2 ring-[#3665f6]/25' : 'bg-white'
                          }`}
                          style={{
                            borderColor: active ? tool.borderColor : '#dce4f5',
                            backgroundColor: active ? tool.bgLight : '#ffffff',
                            color: '#0a295b',
                          }}
                        >
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: tool.color }}
                          />
                          {toolLoc.label}
                        </button>
                      )
                    })}
                    <button
                      type="button"
                      onClick={() => setActiveDentalTool('clear')}
                      className={`flex cursor-pointer items-center gap-2 rounded-[10px] border px-3.5 py-2 text-[1.35rem] font-bold transition-all ${
                        activeDentalTool === 'clear'
                          ? 'border-[#d71920] bg-[#fff1f2] text-[#d71920]'
                          : 'border-[#dce4f5] bg-white text-[#555555]'
                      }`}
                    >
                      <Eraser className="h-4 w-4" />
                      {pl.ui.clear}
                    </button>
                  </div>

                  {/* Active Dental Tool Description */}
                  {activeDentalTool !== 'clear' && (
                    <div className="mt-3 rounded-[10px] border border-[#e3eaf8] bg-[#f8faff] px-4 py-2.5 text-[1.3rem] text-[#555555]">
                      <strong className="text-[#0c3a94]">
                        {pl.dentalTypes[activeDentalTool]?.label ||
                          DENTAL_TREATMENT_TYPES.find((item) => item.id === activeDentalTool)?.label}
                        :
                      </strong>{' '}
                      {pl.dentalTypes[activeDentalTool]?.description ||
                        DENTAL_TREATMENT_TYPES.find((item) => item.id === activeDentalTool)
                          ?.description}
                    </div>
                  )}

                  {/* Interactive Tooth Chart */}
                  <div className="mt-5 space-y-5 rounded-[14px] border border-[#dce4f5] bg-[#fbfcff] p-4 sm:p-6">
                    {/* Upper Jaw */}
                    <div>
                      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[1.25rem] font-bold tracking-wider text-[#0c3a94] uppercase">
                          {pl.ui.upperJaw}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {['all-on-4', 'all-on-6'].map((arch) => (
                            <button
                              key={arch}
                              type="button"
                              onClick={() => setUpperArch(upperArch === arch ? '' : arch)}
                              className={`cursor-pointer rounded-[8px] border px-3 py-1 text-[1.2rem] font-semibold transition-all ${
                                upperArch === arch
                                  ? 'border-[#3665f6] bg-[#3665f6] text-white'
                                  : 'border-[#dce4f5] bg-white text-[#0a295b] hover:border-[#3665f6]'
                              }`}
                            >
                              {arch === 'all-on-4' ? pl.ui.allOn4 : pl.ui.allOn6}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {UPPER_JAW_TEETH.map((tooth) => (
                          <ToothButton
                            key={tooth}
                            toothNumber={tooth}
                            treatments={toothMap[tooth] || []}
                            onToggle={handleToothToggle}
                            treatmentTypes={DENTAL_TREATMENT_TYPES}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-dashed border-[#d8e1f3]" />

                    {/* Lower Jaw */}
                    <div>
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {LOWER_JAW_TEETH.map((tooth) => (
                          <ToothButton
                            key={tooth}
                            toothNumber={tooth}
                            treatments={toothMap[tooth] || []}
                            onToggle={handleToothToggle}
                            treatmentTypes={DENTAL_TREATMENT_TYPES}
                          />
                        ))}
                      </div>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[1.25rem] font-bold tracking-wider text-[#0c3a94] uppercase">
                          {pl.ui.lowerJaw}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {['all-on-4', 'all-on-6'].map((arch) => (
                            <button
                              key={arch}
                              type="button"
                              onClick={() => setLowerArch(lowerArch === arch ? '' : arch)}
                              className={`cursor-pointer rounded-[8px] border px-3 py-1 text-[1.2rem] font-semibold transition-all ${
                                lowerArch === arch
                                  ? 'border-[#3665f6] bg-[#3665f6] text-white'
                                  : 'border-[#dce4f5] bg-white text-[#0a295b] hover:border-[#3665f6]'
                              }`}
                            >
                              {arch === 'all-on-4' ? pl.ui.allOn4 : pl.ui.allOn6}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-[1.55rem] font-bold text-[#0a295b]">
                    {pl.ui.dentalCleanQ}
                  </h3>
                  <p className="text-[1.3rem] text-[#666666]">
                    {pl.ui.dentalCleanHelp}
                  </p>
                  <YesNoGroup
                    value={dentalCleaning}
                    onChange={setDentalCleaning}
                    yesLabel={pl.ui.yes}
                    noLabel={pl.ui.no}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-[1.55rem] font-bold text-[#0a295b]">
                    {pl.ui.dentalNotSureQ}
                  </h3>
                  <p className="text-[1.3rem] text-[#666666]">
                    {pl.ui.dentalNotSureHelp}
                  </p>
                  <YesNoGroup
                    value={dentalNotSure}
                    onChange={setDentalNotSure}
                    yesLabel={pl.ui.yes}
                    noLabel={pl.ui.no}
                  />
                </div>

                <div>
                  <label className="block text-[1.45rem] font-bold text-[#0a295b]">
                    {pl.ui.dentalNotesLabel}
                  </label>
                  <textarea
                    rows={3}
                    value={dentalNotes}
                    onChange={(e) => setDentalNotes(e.target.value)}
                    placeholder={pl.ui.dentalNotesPlaceholder}
                    className="mt-2 w-full rounded-[10px] border border-[#c7c7c7] bg-white px-4 py-3 text-[1.45rem] outline-none focus:border-[#3665f6]"
                  />
                </div>
              </div>
            )}

            {/* C. COSMETIC SURGERY */}
            {category === 'cosmetic' && (
              <div>
                <h2 className="text-[1.75rem] font-bold text-[#0a295b]">
                  {pl.ui.cosmeticQ}
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {COSMETIC_PROCEDURES.map((proc) => (
                    <RadioPill
                      key={proc}
                      selected={cosmeticProc === proc}
                      onClick={() => setCosmeticProc(proc)}
                    >
                      {trOpt(proc)}
                    </RadioPill>
                  ))}
                </div>
              </div>
            )}

            {/* D. EYE TREATMENTS */}
            {category === 'eye' && (
              <div className="space-y-7">
                <div>
                  <h2 className="text-[1.75rem] font-bold text-[#0a295b]">
                    {pl.ui.eyeProcQ}
                  </h2>
                  <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {EYE_PROCEDURES.map((proc) => {
                      const active = eyeProc === proc.id
                      const procLoc = pl.eyeProcs[proc.id] || proc
                      return (
                        <button
                          key={proc.id}
                          type="button"
                          onClick={() => setEyeProc(proc.id)}
                          className={`cursor-pointer rounded-[12px] border p-4 text-left transition-all ${
                            active
                              ? 'border-[#3665f6] bg-[#eef3ff] shadow-sm'
                              : 'border-[#dce4f5] bg-white hover:border-[#3665f6]/60'
                          }`}
                        >
                          <div className="text-[1.55rem] font-bold text-[#0c3a94]">
                            {procLoc.label}
                          </div>
                          <p className="mt-1.5 text-[1.3rem] leading-[1.45] text-[#555555]">
                            {procLoc.description}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h2 className="text-[1.75rem] font-bold text-[#0a295b]">
                    {pl.ui.eyeWhichQ}
                  </h2>
                  <p className="mt-1 text-[1.35rem] text-[#666666]">
                    {pl.ui.eyeWhichHelp}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRightEye((v) => !v)}
                      className={`flex cursor-pointer flex-col items-center gap-2 rounded-[12px] border p-5 transition-all ${
                        rightEye
                          ? 'border-[#3665f6] bg-[#eef3ff] text-[#0c3a94]'
                          : 'border-[#dce4f5] bg-white text-[#555555]'
                      }`}
                    >
                      <Eye className="h-8 w-8" />
                      <span className="text-[1.5rem] font-bold">{pl.ui.rightEye}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLeftEye((v) => !v)}
                      className={`flex cursor-pointer flex-col items-center gap-2 rounded-[12px] border p-5 transition-all ${
                        leftEye
                          ? 'border-[#3665f6] bg-[#eef3ff] text-[#0c3a94]'
                          : 'border-[#dce4f5] bg-white text-[#555555]'
                      }`}
                    >
                      <Eye className="h-8 w-8" />
                      <span className="text-[1.5rem] font-bold">{pl.ui.leftEye}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* E. WEIGHT LOSS SURGERY */}
            {category === 'weight-loss' && (
              <div>
                <h2 className="text-[1.75rem] font-bold text-[#0a295b]">
                  {pl.ui.weightQ}
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {WEIGHT_LOSS_PROCEDURES.map((proc) => (
                    <RadioPill
                      key={proc}
                      selected={weightLossProc === proc}
                      onClick={() => setWeightLossProc(proc)}
                    >
                      {trOpt(proc)}
                    </RadioPill>
                  ))}
                </div>
              </div>
            )}

            {/* F. IVF TREATMENT */}
            {category === 'ivf' && (
              <div className="space-y-7">
                <div>
                  <h2 className="text-[1.75rem] font-bold text-[#0a295b]">{pl.ui.ivfCyclesQ}</h2>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {IVF_CYCLES.map((cycle) => (
                      <RadioPill
                        key={cycle}
                        selected={ivfCycles === cycle}
                        onClick={() => setIvfCycles(cycle)}
                      >
                        {trOpt(cycle)}
                      </RadioPill>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-[1.75rem] font-bold text-[#0a295b]">
                    {pl.ui.ivfPgtQ}
                  </h2>
                  <p className="mt-1 text-[1.35rem] leading-[1.5] text-[#666666]">
                    {pl.ui.ivfPgtHelp}
                  </p>
                  <div className="mt-3">
                    <YesNoGroup
                      value={ivfPgt}
                      onChange={setIvfPgt}
                      yesLabel={pl.ui.yes}
                      noLabel={pl.ui.no}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* G. CHECK-UP */}
            {category === 'checkup' && (
              <div>
                <h2 className="text-[1.75rem] font-bold text-[#0a295b]">
                  {pl.ui.checkupQ}
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  {CHECKUP_PACKAGES.map((pkg) => {
                    const active = checkupPkg === pkg.id
                    const pkgLoc = pl.checkupPkgs[pkg.id] || pkg
                    return (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setCheckupPkg(pkg.id)}
                        className={`cursor-pointer rounded-[12px] border p-4 text-left transition-all ${
                          active
                            ? 'border-[#3665f6] bg-[#eef3ff] shadow-sm'
                            : 'border-[#dce4f5] bg-white hover:border-[#3665f6]/60'
                        }`}
                      >
                        <div className="text-[1.55rem] font-bold text-[#0c3a94]">{pkgLoc.label}</div>
                        <p className="mt-1 text-[1.3rem] text-[#555555]">{pkgLoc.description}</p>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Shared City & Hospital Preferences */}
            <div className="space-y-6 border-t border-[#e8eefb] pt-7">
              <div>
                <h2 className="text-[1.7rem] font-bold text-[#0a295b]">{t('planner.preferredCity')}</h2>
                <p className="mt-1 text-[1.35rem] text-[#666666]">
                  {t('planner.preferredCitySub')}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {PREFERRED_CITIES.map((city) => (
                    <RadioPill
                      key={city.id}
                      selected={preferredCity === city.id}
                      onClick={() => setPreferredCity(city.id)}
                    >
                      {pl.cities[city.id] || city.label}
                    </RadioPill>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-[1.7rem] font-bold text-[#0a295b]">{t('planner.hospitalPref')}</h2>
                <p className="mt-1 text-[1.35rem] text-[#666666]">
                  {t('planner.hospitalPrefSub')}
                </p>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {HOSPITAL_PREFERENCES.map((pref) => {
                    const active = hospitalPref === pref.id
                    const prefLoc = pl.hospitals[pref.id] || pref
                    return (
                      <button
                        key={pref.id}
                        type="button"
                        onClick={() => setHospitalPref(pref.id)}
                        className={`cursor-pointer rounded-[12px] border p-4 text-left transition-all ${
                          active
                            ? 'border-[#3665f6] bg-[#eef3ff] shadow-sm'
                            : 'border-[#dce4f5] bg-white hover:border-[#3665f6]/60'
                        }`}
                      >
                        <div className="text-[1.5rem] font-bold text-[#0c3a94]">{prefLoc.label}</div>
                        <p className="mt-1 text-[1.28rem] text-[#555555]">{prefLoc.description}</p>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* STEP 3: ABOUT YOU */}
        {step === 3 && (
          <section className="mx-auto max-w-[640px] space-y-6">
            <div>
              <h1 className="text-[2.8rem] font-bold text-[#0c3a94] sm:text-[3.4rem]">
                {t('planner.aboutYou')}
              </h1>
              <p className="mt-1.5 text-[1.5rem] text-[#555555]">
                {t('planner.aboutYouSub')}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-[1.4rem] font-bold text-[#0a295b]">{t('planner.firstName')}</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t('planner.firstName')}
                  className="mt-1.5 w-full rounded-[10px] border border-[#c7c7c7] bg-white px-4 py-3 text-[1.5rem] outline-none focus:border-[#3665f6]"
                />
              </div>
              <div>
                <label className="block text-[1.4rem] font-bold text-[#0a295b]">{t('planner.lastName')}</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t('planner.lastName')}
                  className="mt-1.5 w-full rounded-[10px] border border-[#c7c7c7] bg-white px-4 py-3 text-[1.5rem] outline-none focus:border-[#3665f6]"
                />
              </div>
              <div>
                <label className="block text-[1.4rem] font-bold text-[#0a295b]">
                  {t('planner.dob')}
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="mt-1.5 w-full rounded-[10px] border border-[#c7c7c7] bg-white px-4 py-3 text-[1.5rem] outline-none focus:border-[#3665f6]"
                />
              </div>
              <div>
                <label className="block text-[1.4rem] font-bold text-[#0a295b]">{t('planner.gender')}</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="mt-1.5 w-full rounded-[10px] border border-[#c7c7c7] bg-white px-4 py-3 text-[1.5rem] outline-none focus:border-[#3665f6]"
                >
                  <option value="">{t('planner.select')}</option>
                  <option value="Male">{t('planner.male')}</option>
                  <option value="Female">{t('planner.female')}</option>
                  <option value="Other">{t('planner.other')}</option>
                  <option value="Prefer not to say">{t('planner.preferNotToSay')}</option>
                </select>
              </div>
            </div>
          </section>
        )}

        {/* STEP 4: HEALTH INFO */}
        {step === 4 && (
          <section className="mx-auto max-w-[740px] space-y-7">
            <div>
              <h1 className="text-[2.8rem] font-bold text-[#0c3a94] sm:text-[3.4rem]">
                {t('planner.healthTitle')}
              </h1>
              <p className="mt-1.5 text-[1.5rem] text-[#555555]">
                {t('planner.healthSub')}
              </p>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-[12px] border border-[#3665f6]/35 bg-[#eef3ff]/70 p-4">
              <input
                type="checkbox"
                checked={healthConsent}
                onChange={(e) => setHealthConsent(e.target.checked)}
                className="mt-1 h-5 w-5 shrink-0 accent-[#3665f6]"
              />
              <span className="text-[1.4rem] leading-[1.5] text-[#0a295b]">
                {pl.ui.healthConsentPrefix} {BRAND.name} {pl.ui.healthConsentMid}{' '}
                <Link to="/en/privacy-policy" className="font-semibold text-[#3665f6] underline">
                  {pl.ui.privacyPolicyLink}
                </Link>
                .
              </span>
            </label>

            {/* Common Questions */}
            <div className="space-y-6">
              <div>
                <h2 className="text-[1.6rem] font-bold text-[#0a295b]">
                  {pl.ui.conditionsQ}
                </h2>
                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {COMMON_CONDITIONS.map((cond) => (
                    <RadioPill
                      key={cond}
                      selected={conditions.includes(cond)}
                      onClick={() => toggleMultiOption(conditions, setConditions, cond)}
                    >
                      {trOpt(cond)}
                    </RadioPill>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <h2 className="text-[1.6rem] font-bold text-[#0a295b]">
                  {pl.ui.medQ}
                </h2>
                <YesNoGroup
                  value={takingMed}
                  onChange={setTakingMed}
                  yesLabel={pl.ui.yes}
                  noLabel={pl.ui.none}
                />
                {takingMed === 'yes' && (
                  <input
                    type="text"
                    value={medDetails}
                    onChange={(e) => setMedDetails(e.target.value)}
                    placeholder={pl.ui.medPlaceholder}
                    className="mt-2 w-full rounded-[10px] border border-[#c7c7c7] px-4 py-3 text-[1.45rem] outline-none focus:border-[#3665f6]"
                  />
                )}
              </div>

              <div>
                <h2 className="text-[1.6rem] font-bold text-[#0a295b]">
                  {pl.ui.smokingQ}
                </h2>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {['Neither', 'I smoke', 'I drink alcohol regularly', 'Both'].map((opt) => (
                    <RadioPill
                      key={opt}
                      selected={smokingAlcohol === opt}
                      onClick={() => setSmokingAlcohol(opt)}
                    >
                      {trOpt(opt)}
                    </RadioPill>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <h2 className="text-[1.6rem] font-bold text-[#0a295b]">
                  {pl.ui.surgeriesQ}
                </h2>
                <YesNoGroup
                  value={prevSurgeries}
                  onChange={setPrevSurgeries}
                  yesLabel={pl.ui.yes}
                  noLabel={pl.ui.none}
                />
                {prevSurgeries === 'yes' && (
                  <input
                    type="text"
                    value={prevSurgeriesDetails}
                    onChange={(e) => setPrevSurgeriesDetails(e.target.value)}
                    placeholder={pl.ui.surgeriesPlaceholder}
                    className="mt-2 w-full rounded-[10px] border border-[#c7c7c7] px-4 py-3 text-[1.45rem] outline-none focus:border-[#3665f6]"
                  />
                )}
              </div>

              <div className="space-y-2.5">
                <h2 className="text-[1.6rem] font-bold text-[#0a295b]">
                  {pl.ui.allergiesQ}
                </h2>
                <YesNoGroup
                  value={allergies}
                  onChange={setAllergies}
                  yesLabel={pl.ui.yes}
                  noLabel={pl.ui.none}
                />
                {allergies === 'yes' && (
                  <input
                    type="text"
                    value={allergiesDetails}
                    onChange={(e) => setAllergiesDetails(e.target.value)}
                    placeholder={pl.ui.allergiesPlaceholder}
                    className="mt-2 w-full rounded-[10px] border border-[#c7c7c7] px-4 py-3 text-[1.45rem] outline-none focus:border-[#3665f6]"
                  />
                )}
              </div>

              {/* Female-conditional question */}
              {gender === 'Female' && (
                <div>
                  <h2 className="text-[1.6rem] font-bold text-[#0a295b]">
                    {pl.ui.pregnantQ}
                  </h2>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {['Pregnant', 'Breastfeeding', 'No'].map((opt) => (
                      <RadioPill
                        key={opt}
                        selected={pregnantOrBreastfeeding === opt}
                        onClick={() => setPregnantOrBreastfeeding(opt)}
                      >
                        {trOpt(opt)}
                      </RadioPill>
                    ))}
                  </div>
                </div>
              )}

              {/* Treatment-Specific Health Questions */}
              {category === 'hair-transplant' && (
                <div className="space-y-6 border-t border-[#e8eefb] pt-6">
                  <div>
                    <h2 className="text-[1.6rem] font-bold text-[#0a295b]">
                      {pl.ui.hairBloodQ}
                    </h2>
                    <div className="mt-2.5">
                      <YesNoGroup
                        value={hairBloodThinners}
                        onChange={setHairBloodThinners}
                        yesLabel={pl.ui.yes}
                        noLabel={pl.ui.no}
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-[1.6rem] font-bold text-[#0a295b]">
                      {pl.ui.hairScalpQ}
                    </h2>
                    <div className="mt-2.5">
                      <YesNoGroup
                        value={hairScalpCondition}
                        onChange={setHairScalpCondition}
                        yesLabel={pl.ui.yes}
                        noLabel={pl.ui.none}
                      />
                    </div>
                    {hairScalpCondition === 'yes' && (
                      <input
                        type="text"
                        value={hairScalpDetails}
                        onChange={(e) => setHairScalpDetails(e.target.value)}
                        placeholder={pl.ui.pleaseDescribe}
                        className="mt-2.5 w-full rounded-[10px] border border-[#c7c7c7] px-4 py-3 text-[1.45rem] outline-none focus:border-[#3665f6]"
                      />
                    )}
                  </div>
                </div>
              )}

              {category === 'dental' && (
                <div className="border-t border-[#e8eefb] pt-6">
                  <h2 className="text-[1.6rem] font-bold text-[#0a295b]">
                    {pl.ui.dentalGumQ}
                  </h2>
                  <div className="mt-2.5">
                    <YesNoGroup
                      value={dentalGumDisease}
                      onChange={setDentalGumDisease}
                      yesLabel={pl.ui.yes}
                      noLabel={pl.ui.no}
                    />
                  </div>
                </div>
              )}

              {category === 'cosmetic' && (
                <div className="border-t border-[#e8eefb] pt-6">
                  <h2 className="text-[1.6rem] font-bold text-[#0a295b]">
                    {pl.ui.cosmeticFlagsQ}
                  </h2>
                  <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {COSMETIC_HEALTH_FLAGS.map((flag) => (
                      <RadioPill
                        key={flag}
                        selected={cosmeticFlags.includes(flag)}
                        onClick={() => toggleMultiOption(cosmeticFlags, setCosmeticFlags, flag)}
                      >
                        {trOpt(flag)}
                      </RadioPill>
                    ))}
                  </div>
                </div>
              )}

              {category === 'eye' && (
                <div className="space-y-6 border-t border-[#e8eefb] pt-6">
                  <div>
                    <h2 className="text-[1.6rem] font-bold text-[#0a295b]">
                      {pl.ui.eyeCondQ}
                    </h2>
                    <div className="mt-2.5">
                      <YesNoGroup
                        value={eyePrevConditions}
                        onChange={setEyePrevConditions}
                        yesLabel={pl.ui.yes}
                        noLabel={pl.ui.none}
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-[1.6rem] font-bold text-[#0a295b]">
                      {pl.ui.eyeLensQ}
                    </h2>
                    <div className="mt-2.5">
                      <YesNoGroup
                        value={eyeContactLenses}
                        onChange={setEyeContactLenses}
                        yesLabel={pl.ui.yes}
                        noLabel={pl.ui.no}
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-[1.6rem] font-bold text-[#0a295b]">
                      {pl.ui.eyeStableQ}
                    </h2>
                    <div className="mt-2.5">
                      <YesNoGroup
                        value={eyeStablePrescription}
                        onChange={setEyeStablePrescription}
                        yesLabel={pl.ui.yes}
                        noLabel={pl.ui.no}
                      />
                    </div>
                  </div>
                </div>
              )}

              {category === 'weight-loss' && (
                <div className="space-y-6 border-t border-[#e8eefb] pt-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[1.45rem] font-bold text-[#0a295b]">
                        {pl.ui.heightLabel}
                      </label>
                      <input
                        type="number"
                        min={100}
                        max={230}
                        value={weightHeightCm}
                        onChange={(e) => setWeightHeightCm(e.target.value)}
                        placeholder="e.g. 175"
                        className="mt-1.5 w-full rounded-[10px] border border-[#c7c7c7] px-4 py-3 text-[1.5rem] outline-none focus:border-[#3665f6]"
                      />
                    </div>
                    <div>
                      <label className="block text-[1.45rem] font-bold text-[#0a295b]">
                        {pl.ui.weightLabel}
                      </label>
                      <input
                        type="number"
                        min={40}
                        max={300}
                        value={weightKg}
                        onChange={(e) => setWeightKg(e.target.value)}
                        placeholder="e.g. 112"
                        className="mt-1.5 w-full rounded-[10px] border border-[#c7c7c7] px-4 py-3 text-[1.5rem] outline-none focus:border-[#3665f6]"
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-[1.6rem] font-bold text-[#0a295b]">
                      {pl.ui.weightCondQ}
                    </h2>
                    <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {WEIGHT_RELATED_CONDITIONS.map((item) => (
                        <RadioPill
                          key={item}
                          selected={weightConditions.includes(item)}
                          onClick={() =>
                            toggleMultiOption(weightConditions, setWeightConditions, item)
                          }
                        >
                          {trOpt(item)}
                        </RadioPill>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-[1.6rem] font-bold text-[#0a295b]">
                      {pl.ui.weightMentalQ}
                    </h2>
                    <div className="mt-2.5">
                      <YesNoGroup
                        value={weightMentalHistory}
                        onChange={setWeightMentalHistory}
                        yesLabel={pl.ui.yes}
                        noLabel={pl.ui.none}
                      />
                    </div>
                  </div>
                </div>
              )}

              {category === 'ivf' && (
                <div className="space-y-6 border-t border-[#e8eefb] pt-6">
                  <div>
                    <label className="block text-[1.5rem] font-bold text-[#0a295b]">
                      {pl.ui.ivfPrevLabel}
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={ivfPrevAttempts}
                      onChange={(e) => setIvfPrevAttempts(e.target.value)}
                      className="mt-1.5 w-full max-w-[200px] rounded-[10px] border border-[#c7c7c7] px-4 py-3 text-[1.5rem] outline-none focus:border-[#3665f6]"
                    />
                  </div>
                  <div>
                    <h2 className="text-[1.6rem] font-bold text-[#0a295b]">
                      {pl.ui.ivfMaleQ}
                    </h2>
                    <div className="mt-2.5">
                      <YesNoGroup
                        value={ivfMaleFactor}
                        onChange={setIvfMaleFactor}
                        yesLabel={pl.ui.yes}
                        noLabel={pl.ui.no}
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-[1.6rem] font-bold text-[#0a295b]">
                      {pl.ui.ivfAmhQ}
                    </h2>
                    <div className="mt-2.5">
                      <YesNoGroup
                        value={ivfAmhResult}
                        onChange={setIvfAmhResult}
                        yesLabel={pl.ui.yes}
                        noLabel={pl.ui.no}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* STEP 5: PHOTOS & FILES */}
        {step === 5 && (
          <section className="mx-auto max-w-[680px] space-y-6">
            <div>
              <h1 className="text-[2.8rem] font-bold text-[#0c3a94] sm:text-[3.4rem]">
                {t('planner.photosTitle')}
              </h1>
              <p className="mt-2 text-[1.5rem] leading-[1.6] text-[#555555]">
                {t('planner.photosSub')}
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.heic,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="rounded-[14px] border-2 border-dashed border-[#c7d7f8] bg-[#f8faff] p-8 text-center">
              <Paperclip className="mx-auto h-10 w-10 text-[#3665f6]" />
              <p className="mt-3 text-[1.5rem] font-semibold text-[#0c3a94]">
                {t('planner.attachPrompt')}
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-[10px] bg-[#3665f6] px-5 py-3 text-[1.45rem] font-semibold text-white transition-colors hover:bg-[#0c3a94]"
              >
                {t('planner.chooseFiles')}
              </button>
            </div>

            {uploadedFiles.length > 0 && (
              <ul className="space-y-2.5">
                {uploadedFiles.map((file, idx) => (
                  <li
                    key={`${file.name}-${idx}`}
                    className="flex items-center justify-between rounded-[10px] border border-[#dce4f5] bg-white px-4 py-3 text-[1.4rem]"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="h-5 w-5 shrink-0 text-[#3665f6]" />
                      <span className="truncate font-medium text-[#0a295b]">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setUploadedFiles((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="cursor-pointer text-[#d71920] hover:opacity-80"
                      aria-label={pl.ui.removeFileAria}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* STEP 6: PLAN & PRICE */}
        {step === 6 && (
          <section className="mx-auto max-w-[780px] space-y-8">
            <div>
              <h1 className="text-[2.8rem] font-bold text-[#0c3a94] sm:text-[3.4rem]">
                {t('planner.planTitle')}
              </h1>
              <p className="mt-1.5 text-[1.5rem] text-[#555555]">
                {t('planner.planSub')}
              </p>
            </div>

            {/* Process Timeline */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(pl.timelines[category] || pl.timelines.checkup || TREATMENT_TIMELINES[category] || TREATMENT_TIMELINES.checkup).map((item) => (
                <div
                  key={item.step}
                  className="rounded-[12px] border border-[#dce4f5] bg-white p-5 shadow-sm"
                >
                  <div className="inline-block rounded-full bg-[#eef3ff] px-3 py-1 text-[1.2rem] font-bold text-[#3665f6]">
                    {item.duration}
                  </div>
                  <h3 className="mt-2.5 text-[1.6rem] font-bold text-[#0c3a94]">{item.step}</h3>
                  <p className="mt-1.5 text-[1.35rem] leading-[1.5] text-[#555555]">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>

            {/* Request Summary & Pricing Box */}
            <div className="rounded-[14px] border border-[#3665f6]/25 bg-[#f5f8ff] p-6">
              <div className="text-[1.25rem] font-bold tracking-wider text-[#3665f6] uppercase">
                {t('planner.yourRequest')}
              </div>
              <div className="mt-1 text-[2rem] font-bold text-[#0c3a94]">{requestSummaryText}</div>
              <p className="mt-3 text-[1.45rem] leading-[1.6] text-[#0a295b]">
                {pl.ui.planOfferDesc}
              </p>
            </div>

            {/* Exclusions */}
            <div className="rounded-[14px] border border-[#e3eaf8] bg-white p-6">
              <h2 className="text-[1.7rem] font-bold text-[#0a295b]">
                {pl.ui.exclusionsTitle}
              </h2>
              <ul className="mt-3 space-y-2 text-[1.4rem] text-[#555555]">
                {(pl.exclusions || PROPOSAL_EXCLUSIONS).map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#7fbb58]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* STEP 7: CONTACT INFO */}
        {step === 7 && (
          <section className="mx-auto max-w-[640px] space-y-6">
            <div>
              <h1 className="text-[2.8rem] font-bold text-[#0c3a94] sm:text-[3.4rem]">
                {t('planner.contactTitle')}
              </h1>
              <p className="mt-1.5 text-[1.5rem] text-[#555555]">
                {t('planner.contactSub')}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[1.4rem] font-bold text-[#0a295b]">{t('planner.email')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1.5 w-full rounded-[10px] border border-[#c7c7c7] bg-white px-4 py-3 text-[1.5rem] outline-none focus:border-[#3665f6]"
                />
              </div>

              <div>
                <label className="block text-[1.4rem] font-bold text-[#0a295b]">
                  {t('planner.confirmEmail')}
                </label>
                <input
                  type="email"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1.5 w-full rounded-[10px] border border-[#c7c7c7] bg-white px-4 py-3 text-[1.5rem] outline-none focus:border-[#3665f6]"
                />
              </div>

              <div>
                <label className="block text-[1.4rem] font-bold text-[#0a295b]">
                  {t('planner.phone')}
                </label>
                <div className="mt-1.5 flex gap-2.5">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-[140px] shrink-0 rounded-[10px] border border-[#c7c7c7] bg-white px-3 py-3 text-[1.45rem] outline-none focus:border-[#3665f6]"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={`${c.code}-${c.name}`} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="7700 900000"
                    className="w-full rounded-[10px] border border-[#c7c7c7] bg-white px-4 py-3 text-[1.5rem] outline-none focus:border-[#3665f6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[1.4rem] font-bold text-[#0a295b]">
                  {pl.ui.commChannelLabel}
                </label>
                <div className="mt-2.5 grid grid-cols-3 gap-3">
                  {['WhatsApp', 'Email', 'Phone call'].map((ch) => (
                    <RadioPill
                      key={ch}
                      selected={commChannel === ch}
                      onClick={() => setCommChannel(ch)}
                    >
                      {trOpt(ch)}
                    </RadioPill>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* STEP 8: AGREEMENT */}
        {step === 8 && (
          <section className="mx-auto max-w-[700px] space-y-6">
            <div>
              <h1 className="text-[2.8rem] font-bold text-[#0c3a94] sm:text-[3.4rem]">
                {t('planner.termsTitle')}
              </h1>
              <p className="mt-1.5 text-[1.5rem] text-[#555555]">
                {t('planner.termsSub')}
              </p>
            </div>

            <div className="rounded-[12px] border border-[#dce4f5] bg-white shadow-sm">
              <div
                ref={termsBoxRef}
                onScroll={handleTermsScroll}
                className="max-h-[250px] space-y-4 overflow-y-auto p-5 text-[1.35rem] leading-[1.6] text-[#555555]"
              >
                {(pl.termsSections || APPLICATION_TERMS_SECTIONS).map((sec) => (
                  <div key={sec.title}>
                    <h3 className="font-bold text-[#0c3a94]">{sec.title}</h3>
                    <p className="mt-1">{sec.body}</p>
                  </div>
                ))}
              </div>
              {!termsScrolledToEnd && (
                <div className="flex items-center justify-between border-t border-[#e8eefb] bg-[#f8faff] px-5 py-2.5 text-[1.25rem] font-semibold text-[#3665f6]">
                  <span>{t('planner.scrollEnd')}</span>
                  <button
                    type="button"
                    onClick={() => setTermsScrolledToEnd(true)}
                    className="cursor-pointer underline hover:text-[#0c3a94]"
                  >
                    {t('planner.markAsRead')}
                  </button>
                </div>
              )}
            </div>

            <div className={`space-y-4 transition-opacity ${!termsScrolledToEnd ? 'opacity-50' : ''}`}>
              <div>
                <label className="block text-[1.4rem] font-bold text-[#0a295b]">
                  {t('planner.signatureLabel')}
                </label>
                <input
                  type="text"
                  disabled={!termsScrolledToEnd}
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  placeholder={pl.ui.signaturePlaceholder}
                  className="mt-1.5 w-full rounded-[10px] border border-[#c7c7c7] bg-white px-4 py-3 text-[1.5rem] outline-none focus:border-[#3665f6] disabled:cursor-not-allowed disabled:bg-[#f4f4f4]"
                />
              </div>

              <label className="flex cursor-pointer items-start gap-3 text-[1.4rem] text-[#0a295b]">
                <input
                  type="checkbox"
                  disabled={!termsScrolledToEnd}
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 h-5 w-5 shrink-0 accent-[#3665f6]"
                />
                <span>{t('planner.acceptTerms')}</span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 text-[1.4rem] text-[#0a295b]">
                <input
                  type="checkbox"
                  disabled={!termsScrolledToEnd}
                  checked={confirmAccuracy}
                  onChange={(e) => setConfirmAccuracy(e.target.checked)}
                  className="mt-1 h-5 w-5 shrink-0 accent-[#3665f6]"
                />
                <span>
                  {t('planner.confirmAccuracy')}
                </span>
              </label>
            </div>
          </section>
        )}

        {/* STEP 9: CONFIRMATION */}
        {step === 9 && (
          <section className="mx-auto max-w-[620px] rounded-[16px] border border-[#dce4f5] bg-white p-8 text-center shadow-[0_14px_40px_rgba(12,58,148,0.08)] sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eef8e6] text-[#7fbb58]">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h1 className="mt-5 text-[2.8rem] font-bold text-[#0c3a94]">
              {t('planner.confirmedTitle')}
            </h1>
            <p className="mt-2 text-[1.5rem] leading-[1.6] text-[#555555]">
              <strong>{firstName || pl.ui.guestFallback}</strong> · <strong>{requestSummaryText}</strong> ·{' '}
              <strong>{email}</strong> ({trOpt(commChannel)})
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#eef3ff] px-4 py-2 text-[1.35rem] font-bold text-[#0c3a94]">
              <ShieldCheck className="h-5 w-5 text-[#3665f6]" />
              {t('planner.reference')}: {referenceCode}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/en"
                className="zm-btn zm-btn-green inline-flex items-center gap-2"
              >
                <span>{t('planner.backHome')}</span>
              </Link>
            </div>
          </section>
        )}

        {/* Error Message */}
        {stepError && (
          <div className="mx-auto mt-6 flex max-w-[780px] items-center gap-2.5 rounded-[10px] border border-[#f5c2c7] bg-[#fff5f5] px-4 py-3 text-[1.4rem] font-medium text-[#d71920]">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>{stepError}</span>
          </div>
        )}

        {/* Step Navigation Buttons (Steps 2-8) */}
        {step >= 2 && step <= 8 && (
          <div className="mx-auto mt-10 flex max-w-[780px] items-center justify-between border-t border-[#e8eefb] pt-6">
            <button
              type="button"
              onClick={() => {
                setStepError('')
                setStep((s) => Math.max(1, s - 1))
              }}
              className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-[#dce4f5] bg-white px-5 py-3 text-[1.5rem] font-semibold text-[#0a295b] transition-colors hover:border-[#3665f6] hover:text-[#3665f6]"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('planner.back')}
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="zm-btn zm-btn-green inline-flex items-center gap-2"
            >
              <span>{step === 8 ? t('planner.submitApp') : t('planner.continue')}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </main>

      {/* Shared Planner Footer */}
      <footer className="relative z-10 border-t border-[#e8eefb] bg-white/90 py-5">
        <div className="mx-auto flex max-w-[1140px] flex-col items-center justify-between gap-3 px-5 text-[1.35rem] text-[#555555] sm:flex-row sm:px-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <span>{t('planner.footerQuestion')}</span>
            <a
              href={BRAND.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-[#25a244] hover:underline"
            >
              <MessageCircle className="h-4 w-4" />
              {t('planner.footerWhatsapp')}
            </a>
          </div>
          <div className="flex items-center gap-4 text-[1.3rem]">
            <Link to="/en/privacy-policy" className="hover:text-[#3665f6] hover:underline">
              {t('planner.privacyPolicy')}
            </Link>
            <span>·</span>
            <Link to="/en/terms-and-conditions" className="hover:text-[#3665f6] hover:underline">
              {t('planner.termsConditions')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
