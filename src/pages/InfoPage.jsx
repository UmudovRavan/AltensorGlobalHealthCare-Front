import { Link, useParams, useSearchParams } from 'react-router-dom'
import { BRAND } from '../data/brand'
import { CLINICS } from '../data/clinics'
import { DOCTORS } from '../data/doctors'
import { NAV_ALTENSOR_ITEMS } from '../data/navigation'
import { SERVICE_CATEGORIES } from '../data/services'
import { useUI } from '../hooks/useUI'

const ALTENSOR_CONTENT = {
  'medical-concierge': {
    title: 'Medical Concierge',
    text: 'Dedicated patient coordinators guide you from your first inquiry through specialist matching, transparent clinic quotes, appointment scheduling, and post-treatment follow-up.',
  },
  'travel-and-accommodation': {
    title: 'Travel & Accommodation',
    text: 'Discounted partner flights, vetted hotel accommodations near your clinic, private airport transfers, and family travel support organized in one seamless itinerary.',
  },
  'zagreb-gastro': {
    title: 'Zagreb gastro',
    text: 'Discover authentic Croatian cuisine, Michelin-recommended bistros, farm-to-table markets like Dolac, and patient-friendly dining options.',
  },
  '10-things-to-do-and-see-in-zagreb': {
    title: '10 things to do and see in Zagreb',
    text: 'Stroll the historic Upper Town, visit St. Mark’s Church, ride the iconic funicular, relax in Maksimir Park, and enjoy vibrant coffee-house culture.',
  },
  '24-hours-in-zagreb': {
    title: '24 hours in Zagreb',
    text: 'A curated one-day itinerary connecting peaceful green promenades, museums, and relaxed dining tailored around medical check-ups or recovery.',
  },
  'zagreb-for-families': {
    title: 'Zagreb for families',
    text: 'Family-friendly parks, the Zagreb Zoo, interactive museums, and safe pedestrian zones for patients traveling with loved ones.',
  },
  'events-in-zagreb': {
    title: 'Events in Zagreb',
    text: 'Seasonal cultural festivals, open-air concerts, and Advent in Zagreb experiences throughout the calendar year.',
  },
}

const SYMPTOMS = [
  { name: 'Joint & Knee Pain', category: 'orthopaedics' },
  { name: 'Chest Pain & Palpitations', category: 'internal-medicine' },
  { name: 'Dental Pain & Missing Teeth', category: 'dentistry' },
  { name: 'Chronic Back & Spine Pain', category: 'interventional-radiology' },
  { name: 'Skin Lesions & Acne', category: 'dermatology' },
  { name: 'Varicose Veins', category: 'vascular-surgery' },
]

export function ZagrebPage() {
  const { subpage } = useParams()
  const active = ALTENSOR_CONTENT[subpage] || {
    title: BRAND.name,
    text: `${BRAND.name} unites leading private hospitals, polyclinics, and top specialist doctors into one transparent healthcare coordination platform—combining clinical excellence with personalized travel and concierge care.`,
  }

  return (
    <div className="zm-container py-16">
      <nav className="mb-8 text-[1.3rem] text-[#666666]">
        <Link to="/en" className="text-[#3665f6] hover:underline">Home</Link> /{' '}
        <Link to="/en/altensor-healthcare" className="text-[#3665f6] hover:underline">
          {BRAND.name}
        </Link>
        {subpage ? ` / ${active.title}` : ''}
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
        <aside className="space-y-2 lg:col-span-1">
          <Link
            to="/en/altensor-healthcare"
            className={`block rounded-[8px] px-4 py-3 text-[1.45rem] font-semibold ${
              !subpage
                ? 'bg-[#3665f6] text-white'
                : 'bg-[#f4f4f4] text-[#0a295b] hover:bg-[#eaf0ff]'
            }`}
          >
            {BRAND.name} Overview
          </Link>
          {NAV_ALTENSOR_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`block rounded-[8px] px-4 py-3 text-[1.45rem] font-semibold ${
                item.to.endsWith(`/${subpage}`)
                  ? 'bg-[#3665f6] text-white'
                  : 'bg-[#f4f4f4] text-[#0a295b] hover:bg-[#eaf0ff]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </aside>

        <div className="lg:col-span-3">
          <h1 className="text-[4.4rem] font-bold leading-[1.08] text-[#0c3a94] md:text-[6.8rem]">
            {active.title}
          </h1>
          <p className="mt-6 max-w-[780px] text-[1.75rem] leading-[1.7] text-[#555555]">
            {active.text}
          </p>
        </div>
      </div>
    </div>
  )
}

export function SymptomsPage() {
  const { openInquiry } = useUI()
  return (
    <div className="zm-container py-16">
      <nav className="mb-6 text-[1.3rem] text-[#666666]">
        <Link to="/en" className="text-[#3665f6] hover:underline">Home</Link> /{' '}
        <span>Medical Symptoms</span>
      </nav>

      <h1 className="text-[4.4rem] font-bold leading-[1.08] text-[#0c3a94] md:text-[6.8rem]">
        Medical symptoms
      </h1>
      <p className="mt-3 max-w-[780px] text-[1.8rem] text-[#555555]">
        Not sure which specialist to book? Choose a symptom area or ask {BRAND.name} to
        match you with the right clinic.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SYMPTOMS.map((sym) => (
          <div
            key={sym.name}
            className="flex flex-col justify-between rounded-[12px] border border-[#e8e8e8] bg-white p-7"
          >
            <h2 className="text-[2.2rem] font-bold text-[#0c3a94]">{sym.name}</h2>
            <div className="mt-6 flex items-center gap-4">
              <Link
                to={`/en/services/${sym.category}`}
                className="text-[1.4rem] font-bold text-[#3665f6] hover:underline"
              >
                Explore specialty ›
              </Link>
              <button
                type="button"
                onClick={() => openInquiry(`Symptoms: ${sym.name}`)}
                className="zm-btn zm-btn-green zm-btn-xs"
              >
                <span>Ask coordinator</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LegalPage({ type }) {
  const title = type === 'terms' ? 'Terms And Conditions' : 'Privacy Policy'
  return (
    <div className="zm-container py-16">
      <nav className="mb-6 text-[1.3rem] text-[#666666]">
        <Link to="/en" className="text-[#3665f6] hover:underline">Home</Link> /{' '}
        <span>{title}</span>
      </nav>

      <h1 className="text-[4.2rem] font-bold text-[#0c3a94] md:text-[6rem]">
        {title}
      </h1>
      <div className="mt-8 max-w-[840px] space-y-5 text-[1.6rem] leading-[1.75] text-[#555555]">
        <p>
          {BRAND.name} operates in full compliance with EU General Data Protection
          Regulation (GDPR) standards. Any personal or medical documentation shared
          during an inquiry is encrypted and shared exclusively with the medical
          facility you select.
        </p>
        <p>
          Platform coordination is free of charge for patients. Clinical pricing,
          medical diagnosis, and treatment consent are established directly between the
          patient and the treating healthcare provider.
        </p>
      </div>
    </div>
  )
}

export function SearchResultsPage() {
  const [params, setParams] = useSearchParams()
  const q = (params.get('q') || '').trim()
  const lower = q.toLowerCase()

  const services = SERVICE_CATEGORIES.filter((s) =>
    s.name.toLowerCase().includes(lower) || s.description.toLowerCase().includes(lower),
  )
  const doctors = DOCTORS.filter(
    (d) =>
      d.name.toLowerCase().includes(lower) || d.specialty.toLowerCase().includes(lower),
  )
  const clinics = CLINICS.filter(
    (c) => c.name.toLowerCase().includes(lower) || c.summary.toLowerCase().includes(lower),
  )

  return (
    <div className="zm-container py-16">
      <h1 className="text-[4.2rem] font-bold text-[#0c3a94] md:text-[6rem]">
        Search results
      </h1>
      <input
        type="text"
        value={q}
        onChange={(e) => setParams({ q: e.target.value })}
        placeholder="Type of treatment / offer / doctor"
        className="mt-6 w-full max-w-[540px] rounded-[8px] border border-[#c7c7c7] px-5 py-3 text-[1.6rem] outline-none focus:border-[#3665f6]"
      />

      <div className="mt-10 space-y-10">
        {services.length > 0 && (
          <div>
            <h2 className="text-[2.4rem] font-bold text-[#3665f6]">Services ({services.length})</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <Link
                  key={s.slug}
                  to={`/en/services/${s.slug}`}
                  className="rounded-[10px] border border-[#e8e8e8] p-5 hover:border-[#3665f6]"
                >
                  <p className="text-[1.8rem] font-bold text-[#0a295b]">{s.name}</p>
                  <p className="mt-1 text-[1.35rem] text-[#555555]">{s.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {doctors.length > 0 && (
          <div>
            <h2 className="text-[2.4rem] font-bold text-[#3665f6]">Doctors ({doctors.length})</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {doctors.map((d) => (
                <Link
                  key={d.slug}
                  to={`/en/doctors/${d.slug}`}
                  className="rounded-[10px] border border-[#3665f6] p-4"
                >
                  <p className="text-[1.1rem] font-bold uppercase text-[#3665f6]">{d.specialty}</p>
                  <p className="mt-1 text-[1.8rem] font-bold text-[#0a295b]">{d.name}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {clinics.length > 0 && (
          <div>
            <h2 className="text-[2.4rem] font-bold text-[#3665f6]">Clinics ({clinics.length})</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              {clinics.map((c) => (
                <Link
                  key={c.slug}
                  to={`/en/clinics/${c.slug}`}
                  className="rounded-[10px] border border-[#e8e8e8] p-5 hover:border-[#3665f6]"
                >
                  <p className="text-[2rem] font-bold text-[#0a295b]">{c.name}</p>
                  <p className="mt-1 text-[1.35rem] text-[#555555]">{c.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {services.length === 0 && doctors.length === 0 && clinics.length === 0 && (
          <p className="text-[1.6rem] text-[#555555]">
            No matching results found for &ldquo;{q}&rdquo;.
          </p>
        )}
      </div>
    </div>
  )
}
