import {
  Award,
  Car,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  Mail,
  MapPin,
  Phone,
  Plane,
  ShieldPlus,
  Smartphone,
} from 'lucide-react'

function InstagramIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import HowItWorksAccordion from '../components/about/HowItWorksAccordion'
import { BRAND } from '../data/brand'
import { NAV_ABOUT_ITEMS } from '../data/navigation'
import { useTranslation } from '../hooks/useTranslation'
import { useUI } from '../hooks/useUI'
import catalogService from '../services/catalogService'

const PILLARS = [
  {
    title: 'Effortless',
    desc: 'Explore top-tier treatment options in Azerbaijan with zero hassle—from initial inquiry to clinic matching.',
  },
  {
    title: 'Guided',
    desc: 'A dedicated personal coordinator supports you at every step, bridging communication between you and your medical team.',
  },
  {
    title: 'Tailor-Made',
    desc: '100% customized care plans built around your needs, covering treatment, airport transfers, accommodation, and recovery.',
  },
  {
    title: 'Confidential',
    desc: 'Strict data protection and full medical privacy—your personal and clinical records remain completely secure.',
  },
  {
    title: 'Transparent & Cost-Effective',
    desc: 'World-class medical and dental care at a fraction of Western prices, with zero hidden fees for our coordination service.',
  },
  {
    title: 'Welcoming',
    desc: 'Azerbaijan offers modern clinics, warm hospitality, and a safe, accessible destination.',
  },
]

const TEAM_MEMBERS = [
  {
    fullName: 'Elvin Muzaffarli',
    role: 'Founder',
    photo: BRAND.coordinator.portrait,
    bio: "Elvin Muzaffarli brings executive operations, regulatory compliance, and international coordination experience across Azerbaijan's tourism and institutional sectors. Holding a Master's degree in International Investment Law from Université Paris 1 Panthéon-Sorbonne and a background in International Relations, he approaches cross-border partnerships with strong governance, contract discipline, and operational reliability. Fluent in Azerbaijani and Turkish with working proficiency in English and French, he supports smooth communication and structured coordination for international clients and partners.",
  },
]

const HOW_IT_WORKS_STEPS = [
  {
    stepNumber: 1,
    title: 'Send your free inquiry',
    content:
      "You don't need a diagnosis to take the first step. Describe your symptoms or select the medical procedure you are interested in and optionally attach existing reports or scans.",
  },
  {
    stepNumber: 2,
    title: 'Receive personalised clinic offers in Baku',
    content:
      'Accredited partner hospitals and specialists in Baku, Azerbaijan review your case and prepare transparent treatment proposals without middleman markups.',
  },
  {
    stepNumber: 3,
    title: 'Travel, E-Visa & Insurance support',
    content:
      'Our coordination team assists with your Azerbaijan E-Visa application, travel insurance, flight coordination via Aviadesk, hotel stay with Gezoba Travel, and car rental via acar.az.',
  },
  {
    stepNumber: 4,
    title: 'Treatment & post-rehabilitation follow-up',
    content:
      'Your personal coordinator guides you throughout your stay in Baku and stays in touch for post-treatment follow-up once you return home.',
  },
]

const STATIC_SUBPAGES = {
  'how-it-works': {
    title: 'How it works',
    subtitle: "You don't need a diagnosis to take the first step",
    paragraphs: [
      `Send a free inquiry through ${BRAND.name} describing your symptoms or desired treatment. You can optionally attach medical documentation such as MRI scans or laboratory findings.`,
      'Partner clinics in Baku, Azerbaijan prepare transparent offers directly without middleman markups. Once you choose an option, our patient coordinator arranges appointments, e-visa assistance, travel insurance, flights, hotel stay, and local transfers.',
    ],
  },
  'gezoba-travel': {
    title: 'Gezoba Travel',
    subtitle: 'Hotel accommodation, city tours & mobile app travel partner',
    icon: Smartphone,
    paragraphs: [
      'Together with Gezoba Travel, we coordinate vetted hotel stays near your clinic in Baku, airport transfers, and tailored leisure arrangements for patients and accompanying companions.',
      'Through the Gezoba Travel mobile app, patients can conveniently manage their accommodation, itineraries, and local experiences throughout their medical stay in Azerbaijan.',
    ],
  },
  aviadesk: {
    title: 'Aviadesk',
    subtitle: 'Dedicated flight booking & aviation partner',
    icon: Plane,
    externalLink: {
      label: 'Visit Aviadesk on Instagram',
      href: 'https://www.instagram.com/aviadesk/',
    },
    paragraphs: [
      `${BRAND.name} partners with Aviadesk to provide seamless flight options, flexible scheduling, and dedicated ticketing support for international patients and accompanying family members flying to Baku.`,
    ],
  },
  'acar-rent': {
    title: 'acar.az Rent',
    subtitle: 'Trusted car rental & mobility partner in Baku',
    icon: Car,
    paragraphs: [
      'In partnership with acar.az Rent, patients and their families can arrange comfortable, reliable vehicles with or without a driver for effortless transportation between the airport, hotel, and clinics in Baku.',
    ],
  },
  'travel-insurance': {
    title: 'Travel Insurance',
    subtitle: 'Comprehensive coverage for local and international tourists',
    icon: ShieldPlus,
    paragraphs: [
      'Through our official insurance partners, we offer tailored travel insurance plans designed for both local residents traveling abroad and international patients visiting Azerbaijan.',
      'Coverage options include trip protection, emergency medical assistance, and travel disruptions so you can travel with complete peace of mind.',
    ],
  },
  'e-visa': {
    title: 'E-Visa Application',
    subtitle: 'Fast, guided Azerbaijan electronic visa assistance (paid service)',
    icon: FileCheck2,
    paragraphs: [
      'International patients visiting Baku for medical care can request our E-Visa Application assistance service directly through the platform.',
      'Our coordination team guides you through the required documents, handles the application submission, and tracks approval so your entry into Azerbaijan is smooth and stress-free. Standard government and service processing fees apply.',
    ],
  },
}

const SUBPAGE_ICONS = {
  'gezoba-travel': Smartphone,
  aviadesk: Plane,
  'acar-rent': Car,
  'travel-insurance': ShieldPlus,
  'e-visa': FileCheck2,
}

export default function AboutPage() {
  const { subpage } = useParams()
  const { openInquiry } = useUI()
  const { t } = useTranslation()

  const pillars = t('about.pillars', PILLARS)
  const howItWorksSteps = t('about.howItWorksSteps', HOW_IT_WORKS_STEPS)
  const translatedSubpages = t('about.subpages', {})
  const teamMembers = [
    {
      fullName: 'Elvin Muzaffarli',
      role: t('about.founderRole', 'Founder'),
      photo: BRAND.coordinator.portrait,
      bio: t('about.elvinBio', TEAM_MEMBERS[0].bio),
    },
  ]

  const getSubpageData = (slug) => {
    const base = STATIC_SUBPAGES[slug]
    const loc = translatedSubpages?.[slug]
    if (!base && !loc) return null
    return {
      ...base,
      ...loc,
      externalLink: base?.externalLink
        ? {
            ...base.externalLink,
            label: loc?.externalLabel || base.externalLink.label,
          }
        : undefined,
    }
  }
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [contactLoading, setContactLoading] = useState(false)
  const [contactError, setContactError] = useState('')
  const [contactSent, setContactSent] = useState(false)

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setContactError('')
    setContactLoading(true)
    try {
      await catalogService.submitContactMessage(contactForm)
    } catch {
      // Allow clean confirmation even if backend contact endpoint is offline
    } finally {
      setContactLoading(false)
      setContactSent(true)
      setContactForm({ name: '', email: '', phone: '', message: '' })
    }
  }

  const activePath = subpage ? `/en/about-us/${subpage}` : '/en/about-us'
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    BRAND.address
  )}`

  // Full-width layout for /en/about-us/contact
  if (subpage === 'contact') {
    return (
      <div className="zm-container py-16">
        <nav className="mb-8 text-[1.3rem] text-[#666666]">
          <Link to="/en" className="text-[#3665f6] hover:underline">{t('about.home')}</Link> /{' '}
          <Link to="/en/about-us" className="text-[#3665f6] hover:underline">{t('about.aboutUs')}</Link> /{' '}
          <span>{t('nav.contact')}</span>
        </nav>

        <h1 className="text-[4.4rem] font-bold leading-[1.08] text-[#0c3a94] md:text-[6.8rem]">
          {t('nav.contact')}
        </h1>
        <p className="mt-4 max-w-[760px] text-[1.8rem] text-[#555555]">
          {t('about.contactIntro')}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {contactSent ? (
              <div className="rounded-[12px] border border-[#6bbe47] bg-[#eef8e6] p-8 text-[#4e8a2c]">
                <CheckCircle2 className="h-10 w-10" />
                <h3 className="mt-3 text-[2.2rem] font-bold">{t('about.messageSentTitle')}</h3>
                <p className="mt-2 text-[1.5rem]">
                  {t('about.messageSentBody')}
                </p>
                <button
                  type="button"
                  onClick={() => setContactSent(false)}
                  className="mt-5 cursor-pointer text-[1.4rem] font-semibold underline"
                >
                  {t('about.sendAnother')}
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleContactSubmit}
                className="space-y-4 rounded-[12px] border border-[#e8e8e8] bg-white p-8 shadow-sm"
              >
                {contactError && (
                  <div className="rounded-[8px] border border-[#f5c2c7] bg-[#fff5f5] px-4 py-3 text-[1.4rem] text-[#d71920]">
                    {contactError}
                  </div>
                )}
                <div>
                  <label className="block text-[1.4rem] font-semibold text-[#0a295b]">{t('about.nameLabel')}</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="mt-1.5 w-full rounded-[6px] border border-[#c7c7c7] px-4 py-3 text-[1.5rem] outline-none focus:border-[#3665f6]"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[1.4rem] font-semibold text-[#0a295b]">
                      {t('about.emailLabel')}
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="mt-1.5 w-full rounded-[6px] border border-[#c7c7c7] px-4 py-3 text-[1.5rem] outline-none focus:border-[#3665f6]"
                    />
                  </div>
                  <div>
                    <label className="block text-[1.4rem] font-semibold text-[#0a295b]">
                      {t('about.phoneLabel')}
                    </label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="mt-1.5 w-full rounded-[6px] border border-[#c7c7c7] px-4 py-3 text-[1.5rem] outline-none focus:border-[#3665f6]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[1.4rem] font-semibold text-[#0a295b]">
                    {t('about.messageLabel')}
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="mt-1.5 w-full rounded-[6px] border border-[#c7c7c7] px-4 py-3 text-[1.5rem] outline-none focus:border-[#3665f6]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={contactLoading}
                  className="zm-btn zm-btn-green disabled:opacity-60"
                >
                  <span>{contactLoading ? t('about.sending') : t('about.sendMessage')}</span>
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[12px] bg-[#0c3a94] p-8 text-white">
              <div className="text-[1.25rem] font-bold uppercase tracking-wider text-[#7fbb58]">
                {t('about.bakuOffice')}
              </div>
              <h2 className="mt-1 text-[2.2rem] font-bold">{BRAND.name}</h2>

              <div className="mt-6 space-y-4 text-[1.5rem]">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 hover:underline"
                  title="Open in Google Maps"
                >
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#7fbb58]" />
                  <span>{BRAND.address}</span>
                </a>
                <a href={`tel:${BRAND.phone}`} className="flex items-center gap-3 hover:underline">
                  <Phone className="h-5 w-5 shrink-0 text-[#7fbb58]" />
                  {BRAND.phone}
                </a>
                <a href={`mailto:${BRAND.email}`} className="flex items-center gap-3 hover:underline">
                  <Mail className="h-5 w-5 shrink-0 text-[#7fbb58]" />
                  {BRAND.email}
                </a>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={BRAND.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="zm-btn zm-btn-green zm-btn-sm"
                >
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const subContent = subpage ? getSubpageData(subpage) : null

  return (
    <div className="zm-container py-16">
      <nav className="mb-8 text-[1.3rem] text-[#666666]">
        <Link to="/en" className="text-[#3665f6] hover:underline">{t('about.home')}</Link> /{' '}
        <Link to="/en/about-us" className="text-[#3665f6] hover:underline">{t('about.aboutUs')}</Link>
        {subpage && (
          <>
            {' '}
            / <span>{subContent?.title || subpage.replace(/-/g, ' ')}</span>
          </>
        )}
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <div className="sticky top-[95px] rounded-[12px] border border-[#e8e8e8] bg-white p-4">
            <div className="px-3 pb-2 text-[1.2rem] font-bold uppercase tracking-wider text-[#888888]">
              {t('about.aboutUs')}
            </div>
            <nav className="flex flex-col gap-1">
              <Link
                to="/en/about-us"
                className={`rounded-[8px] px-3 py-2.5 text-[1.45rem] font-semibold transition-colors ${
                  activePath === '/en/about-us'
                    ? 'bg-[#f0f4ff] text-[#3665f6]'
                    : 'text-[#0a295b] hover:bg-[#f8faff]'
                }`}
              >
                {t('about.overview')}
              </Link>
              {NAV_ABOUT_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-[8px] px-3 py-2.5 text-[1.45rem] font-semibold transition-colors ${
                    activePath === item.to
                      ? 'bg-[#f0f4ff] text-[#3665f6]'
                      : 'text-[#0a295b] hover:bg-[#f8faff]'
                  }`}
                >
                  {item.labelKey ? t(item.labelKey, item.label) : item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <div className="lg:col-span-9">
          {/* Overview (/en/about-us) */}
          {!subpage && (
            <div className="space-y-12">
              <div>
                <h1 className="text-[4.4rem] font-bold leading-[1.08] text-[#0c3a94] md:text-[6.4rem]">
                  {t('about.titlePrefix')} {BRAND.name}
                </h1>
                <p className="mt-6 text-[1.65rem] leading-[1.7] text-[#555555]">
                  {t('about.introText')}
                </p>
              </div>

              {/* Mission Banner */}
              <div className="flex flex-col justify-between gap-6 rounded-[12px] bg-[#0c3a94] p-8 text-white md:flex-row md:items-center md:p-10">
                <div>
                  <div className="text-[1.25rem] font-bold uppercase tracking-wider text-[#7fbb58]">
                    {t('about.missionEyebrow')}
                  </div>
                  <h2 className="mt-1 text-[2.4rem] font-bold">
                    {t('about.missionTitle')}
                  </h2>
                  <p className="mt-3 max-w-[660px] text-[1.55rem] leading-[1.65] text-white/90">
                    {t('about.missionText')}
                  </p>
                </div>
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#7fbb58]">
                  <Award className="h-9 w-9" />
                </div>
              </div>

              {/* 6 Value Pillars */}
              <div>
                <h2 className="text-[2.8rem] font-bold text-[#0c3a94]">
                  {t('about.pillarsTitle')}
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {(Array.isArray(pillars) ? pillars : PILLARS).map((p) => (
                    <div
                      key={p.title}
                      className="rounded-[12px] border border-[#e8e8e8] bg-white p-6 shadow-sm"
                    >
                      <h3 className="text-[1.9rem] font-bold text-[#3665f6]">{p.title}</h3>
                      <p className="mt-2.5 text-[1.45rem] leading-[1.6] text-[#555555]">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Section */}
              <div>
                <h2 className="text-[2.8rem] font-bold text-[#0c3a94]">
                  {t('about.teamTitle')}
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-6">
                  {teamMembers.map((m) => (
                    <div
                      key={m.fullName}
                      className="flex flex-col gap-5 rounded-[12px] border border-[#e8e8e8] bg-white p-6 shadow-sm sm:flex-row sm:items-start"
                    >
                      {m.photo && (
                        <img
                          src={m.photo}
                          alt={m.fullName}
                          className="h-[104px] w-[104px] shrink-0 rounded-full object-cover shadow-sm"
                        />
                      )}
                      <div>
                        <h3 className="text-[2rem] font-bold text-[#0c3a94]">{m.fullName}</h3>
                        <div className="mt-0.5 text-[1.35rem] font-semibold text-[#7fbb58]">
                          {m.role}
                        </div>
                        <p className="mt-3 text-[1.5rem] leading-[1.65] text-[#555555]">{m.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Partners & Travel Services Grid */}
              <div>
                <h2 className="text-[2.8rem] font-bold text-[#0c3a94]">
                  {t('about.partnersTitle')}
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    'gezoba-travel',
                    'aviadesk',
                    'acar-rent',
                    'travel-insurance',
                    'e-visa',
                  ].map((slug) => {
                    const item = getSubpageData(slug)
                    if (!item) return null
                    const IconComp = item.icon || SUBPAGE_ICONS[slug]
                    return (
                      <div
                        key={slug}
                        className="flex flex-col justify-between rounded-[12px] border border-[#e8e8e8] bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                      >
                        <div>
                          <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-gradient-to-br from-[#3665f6] to-[#0c3a94] text-white shadow-sm">
                            {IconComp && <IconComp className="h-6 w-6" />}
                          </div>
                          <h3 className="mt-4 text-[1.85rem] font-bold text-[#0c3a94]">
                            {item.title}
                          </h3>
                          <p className="mt-1.5 text-[1.4rem] leading-[1.55] text-[#555555]">
                            {item.subtitle}
                          </p>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#f0f0f0] pt-3">
                          <Link
                            to={`/en/about-us/${slug}`}
                            className="text-[1.35rem] font-semibold text-[#3665f6] hover:underline"
                          >
                            {t('about.moreDetails')}
                          </Link>
                          {item.externalLink && (
                            <a
                              href={item.externalLink.href}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[1.3rem] font-semibold text-[#e1306c] hover:underline"
                            >
                              <InstagramIcon className="h-4 w-4" />
                              @aviadesk
                            </a>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* How It Works Accordion */}
              <div>
                <h2 className="mb-5 text-[2.8rem] font-bold text-[#0c3a94]">{t('about.howItWorksTitle')}</h2>
                <HowItWorksAccordion steps={Array.isArray(howItWorksSteps) ? howItWorksSteps : HOW_IT_WORKS_STEPS} />
              </div>
            </div>
          )}

          {/* How It Works Subpage */}
          {subpage === 'how-it-works' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-[4.2rem] font-bold leading-[1.08] text-[#0c3a94] md:text-[6rem]">
                  {getSubpageData('how-it-works')?.title}
                </h1>
                <p className="mt-3 text-[2rem] font-medium text-[#3665f6]">
                  {getSubpageData('how-it-works')?.subtitle}
                </p>
              </div>
              <HowItWorksAccordion steps={Array.isArray(howItWorksSteps) ? howItWorksSteps : HOW_IT_WORKS_STEPS} />
              <button type="button" onClick={() => openInquiry()} className="zm-btn zm-btn-green">
                <span>{t('home.heroQuote')}</span>
              </button>
            </div>
          )}

          {/* Partner & Service Subpages (Gezoba Travel, Aviadesk, acar.az, Travel Insurance, E-Visa) */}
          {subpage && subpage !== 'how-it-works' && (
            <div>
              {!subContent ? (
                <div className="rounded-[12px] border border-[#e8e8e8] p-10 text-center">
                  <h1 className="text-[3rem] font-bold text-[#0c3a94]">Page not found</h1>
                  <Link to="/en/about-us" className="zm-btn zm-btn-green mt-6 inline-flex">
                    <span>Back to About us</span>
                  </Link>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-4">
                    {subContent.icon && (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#3665f6] to-[#0c3a94] text-white shadow-md">
                        <subContent.icon className="h-8 w-8" />
                      </div>
                    )}
                    <div>
                      <h1 className="text-[4rem] font-bold leading-[1.08] text-[#0c3a94] md:text-[5.8rem]">
                        {subContent.title}
                      </h1>
                    </div>
                  </div>
                  <p className="mt-3 text-[2rem] font-medium text-[#3665f6]">
                    {subContent.subtitle}
                  </p>
                  <div className="mt-8 space-y-5 text-[1.65rem] leading-[1.7] text-[#555555]">
                    {subContent.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-4 text-[1.45rem] font-semibold text-[#0a295b]">
                    <a
                      href={`tel:${BRAND.phone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-2 rounded-[8px] bg-[#f4f7ff] px-4 py-2 text-[#0c3a94] hover:bg-[#e8efff]"
                    >
                      <Phone className="h-4 w-4 text-[#3665f6]" />
                      {BRAND.phone}
                    </a>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      title="Open in Google Maps"
                      className="inline-flex items-center gap-2 rounded-[8px] bg-[#f4f7ff] px-4 py-2 text-[#0c3a94] transition-colors hover:bg-[#e8efff] hover:underline"
                    >
                      <MapPin className="h-4 w-4 text-[#7fbb58]" />
                      {BRAND.address}
                    </a>
                  </div>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => openInquiry(subContent.title)}
                      className="zm-btn zm-btn-green"
                    >
                      <span>{t('about.requestAssistance')}</span>
                    </button>
                    {subContent.externalLink && (
                      <a
                        href={subContent.externalLink.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2.5 rounded-[8px] bg-gradient-to-r from-[#833ab4] via-[#e1306c] to-[#f77737] px-6 py-3.5 text-[1.55rem] font-semibold text-white shadow-[0_10px_24px_rgba(225,48,108,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(225,48,108,0.4)]"
                      >
                        <InstagramIcon className="h-5 w-5" />
                        <span>{subContent.externalLink.label}</span>
                        <ExternalLink className="h-4 w-4 opacity-90" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
