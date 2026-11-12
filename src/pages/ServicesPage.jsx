import { ChevronRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import FaqSection from '../components/sections/FaqSection'
import { useUI } from '../hooks/useUI'
import { BRAND } from '../data/brand'
import { CLINICS } from '../data/clinics'
import { DOCTORS } from '../data/doctors'
import { SERVICE_CATEGORIES } from '../data/services'

export default function ServicesPage() {
  const { category, procedure } = useParams()
  const { openInquiry } = useUI()

  // EU Patients page
  if (category === 'eu-patients') {
    return (
      <div className="zm-container py-16">
        <nav className="mb-6 text-[1.3rem] text-[#666666]">
          <Link to="/en" className="text-[#3665f6] hover:underline">Home</Link> /{' '}
          <Link to="/en/services" className="text-[#3665f6] hover:underline">Services</Link> /{' '}
          <span>EU Patients refund</span>
        </nav>

        <h1 className="text-[4.6rem] font-bold leading-[1.08] text-[#0c3a94] md:text-[7rem]">
          EU Patients refund
        </h1>
        <p className="mt-4 max-w-[820px] text-[2rem] font-medium text-[#0c3a94]">
          Cross-Border Healthcare Directive — avoid long waiting lists and receive timely care.
        </p>
        <div className="mt-8 max-w-[860px] space-y-5 text-[1.6rem] leading-[1.7] text-[#555555]">
          <p>
            Under EU Directive 2011/24/EU on patients’ rights in cross-border healthcare,
            European residents are entitled to seek planned medical treatment in another EU
            member state and apply for reimbursement from their national health insurance fund
            up to the cost of equivalent domestic care.
          </p>
          <p>
            Through {BRAND.name}, you receive full transparent medical invoices, official clinical
            documentation in English, and dedicated coordinator guidance so your reimbursement
            request is straightforward.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openInquiry('EU Patients Cross-Border Refund Inquiry')}
          className="zm-btn zm-btn-green mt-8"
        >
          <span>Send inquiry</span>
          <ChevronRight className="h-4 w-4" />
        </button>

        <FaqSection compact />
      </div>
    )
  }

  // Procedure detail view
  if (category && procedure) {
    const cat = SERVICE_CATEGORIES.find((c) => c.slug === category) || SERVICE_CATEGORIES[0]
    const proc =
      cat.featuredProcedures.find((p) => p.slug === procedure) || {
        name: procedure.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        price: 'Upon medical evaluation',
      }

    return (
      <div className="zm-container py-16">
        <nav className="mb-6 text-[1.3rem] text-[#666666]">
          <Link to="/en" className="text-[#3665f6] hover:underline">Home</Link> /{' '}
          <Link to="/en/services" className="text-[#3665f6] hover:underline">Services</Link> /{' '}
          <Link to={`/en/services/${cat.slug}`} className="text-[#3665f6] hover:underline">
            {cat.name}
          </Link>{' '}
          / <span>{proc.name}</span>
        </nav>

        <div className="flex flex-col justify-between gap-6 border-b border-[#e8e8e8] pb-10 md:flex-row md:items-end">
          <div>
            <span className="inline-block rounded-[4px] bg-[#f0f4ff] px-3 py-1 text-[1.2rem] font-bold uppercase text-[#3665f6]">
              {cat.name}
            </span>
            <h1 className="mt-3 text-[3.8rem] font-bold leading-[1.1] text-[#0c3a94] md:text-[5.8rem]">
              {proc.name}
            </h1>
            {proc.price && (
              <p className="mt-3 text-[2rem] font-bold text-[#7fbb58]">{proc.price}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => openInquiry(proc.name)}
            className="zm-btn zm-btn-green shrink-0"
          >
            <span>Send inquiry</span>
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {[
            {
              title: 'About the procedure',
              body: `${proc.name} is performed by experienced board-certified specialists within the ${BRAND.name} partner hospital network using modern diagnostic and surgical protocols.`,
            },
            {
              title: 'Ideal candidate',
              body: 'Patients seeking specialist evaluation, minimal waiting times, and individualized treatment planning with full English-language coordination.',
            },
            {
              title: 'Preparation',
              body: 'Upload any recent MRI, X-ray, ultrasound, or laboratory findings via our secure inquiry form for a preliminary specialist review prior to travel.',
            },
            {
              title: 'Treatment & Recovery',
              body: 'Your dedicated patient coordinator schedules all pre-operative exams, specialist consultations, hospital admission, and structured post-procedure follow-up.',
            },
          ].map((block) => (
            <div
              key={block.title}
              className="rounded-[12px] border border-[#e8e8e8] bg-white p-7"
            >
              <h2 className="text-[2.2rem] font-bold text-[#0c3a94]">{block.title}</h2>
              <p className="mt-3 text-[1.5rem] leading-[1.65] text-[#555555]">
                {block.body}
              </p>
            </div>
          ))}
        </div>

        <FaqSection compact />
      </div>
    )
  }

  // Category page
  if (category) {
    const cat = SERVICE_CATEGORIES.find((c) => c.slug === category) || SERVICE_CATEGORIES[0]
    return (
      <div className="zm-container py-16">
        <nav className="mb-6 text-[1.3rem] text-[#666666]">
          <Link to="/en" className="text-[#3665f6] hover:underline">Home</Link> /{' '}
          <Link to="/en/services" className="text-[#3665f6] hover:underline">Services</Link> /{' '}
          <span>{cat.name}</span>
        </nav>

        <div className="flex flex-col justify-between gap-6 border-b border-[#e8e8e8] pb-10 md:flex-row md:items-end">
          <div>
            <h1 className="text-[4.4rem] font-bold leading-[1.08] text-[#0c3a94] md:text-[6.8rem]">
              {cat.name}
            </h1>
            <p className="mt-4 max-w-[760px] text-[1.7rem] leading-[1.6] text-[#555555]">
              {cat.description}
            </p>
          </div>
          <button
            type="button"
            onClick={() => openInquiry(cat.name)}
            className="zm-btn zm-btn-green shrink-0"
          >
            <span>Send inquiry</span>
          </button>
        </div>

        {/* Subcategories */}
        <div className="mt-12">
          <h2 className="text-[2.8rem] font-bold text-[#0c3a94]">Specialties & Procedures</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cat.subcategories.map((sub) => (
              <div
                key={sub.slug}
                id={sub.slug}
                className="rounded-[12px] border border-[#e8e8e8] bg-white p-6 shadow-xs"
              >
                <h3 className="text-[2rem] font-bold text-[#3665f6]">{sub.name}</h3>
                <p className="mt-2 text-[1.4rem] text-[#555555]">
                  Consultation, diagnostics, and personalized {sub.name.toLowerCase()} treatment options.
                </p>
                <button
                  type="button"
                  onClick={() => openInquiry(`${cat.name} — ${sub.name}`)}
                  className="mt-4 cursor-pointer text-[1.3rem] font-bold text-[#7fbb58] hover:underline"
                >
                  Request offer ›
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Featured procedures */}
        {cat.featuredProcedures.length > 0 && (
          <div className="mt-14">
            <h2 className="text-[2.8rem] font-bold text-[#0c3a94]">Popular Procedures</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              {cat.featuredProcedures.map((proc) => (
                <Link
                  key={proc.slug}
                  to={`/en/services/${cat.slug}/${proc.subSlug}/${proc.slug}`}
                  className="flex flex-col justify-between rounded-[12px] border border-[#3665f6] p-6 transition-shadow hover:shadow-md"
                >
                  <div>
                    <h3 className="text-[2rem] font-bold text-[#0a295b]">{proc.name}</h3>
                    <p className="mt-2 text-[1.5rem] font-semibold text-[#7fbb58]">
                      {proc.price}
                    </p>
                  </div>
                  <span className="mt-5 text-[1.3rem] font-bold text-[#3665f6]">
                    View details ›
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Linked Doctors & Clinics */}
        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-[2.6rem] font-bold text-[#0c3a94]">Specialist Doctors</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {DOCTORS.slice(0, 2).map((doc) => (
                <Link
                  key={doc.slug}
                  to={`/en/doctors/${doc.slug}`}
                  className="flex items-center gap-4 rounded-[12px] border border-[#e8e8e8] p-4 hover:border-[#3665f6]"
                >
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="h-16 w-16 rounded-[8px] object-cover"
                  />
                  <div>
                    <p className="text-[1.1rem] font-bold uppercase text-[#3665f6]">
                      {doc.specialty}
                    </p>
                    <p className="text-[1.6rem] font-bold text-[#0a295b]">{doc.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-[2.6rem] font-bold text-[#0c3a94]">Partner Clinics</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {CLINICS.slice(0, 2).map((clinic) => (
                <Link
                  key={clinic.slug}
                  to={`/en/clinics/${clinic.slug}`}
                  className="flex items-center gap-4 rounded-[12px] border border-[#e8e8e8] p-4 hover:border-[#3665f6]"
                >
                  <img
                    src={clinic.image}
                    alt={clinic.name}
                    className="h-16 w-16 rounded-[8px] object-cover"
                  />
                  <div>
                    <p className="text-[1.7rem] font-bold text-[#0a295b]">{clinic.name}</p>
                    <p className="text-[1.2rem] text-[#555555]">{clinic.address}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <FaqSection compact />
      </div>
    )
  }

  // Full directory (/en/services)
  return (
    <div className="zm-container py-16">
      <nav className="mb-6 text-[1.3rem] text-[#666666]">
        <Link to="/en" className="text-[#3665f6] hover:underline">Home</Link> /{' '}
        <span>Services</span>
      </nav>

      <h1 className="text-[4.6rem] font-bold leading-[1.08] text-[#0c3a94] md:text-[7.2rem]">
        Medical services
      </h1>
      <p className="mt-4 max-w-[820px] text-[2rem] font-medium text-[#0c3a94]">
        Explore all 21 medical specialties and over 600 procedures available across the{' '}
        {BRAND.name} partner network.
      </p>

      <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {SERVICE_CATEGORIES.map((cat) => (
          <div
            key={cat.slug}
            className="flex flex-col rounded-[12px] border border-[#e8e8e8] bg-white p-7 transition-shadow hover:shadow-md"
          >
            <Link
              to={`/en/services/${cat.slug}`}
              className="text-[2.4rem] font-bold text-[#3665f6] hover:text-[#0c3a94]"
            >
              {cat.name}
            </Link>
            <p className="mt-2 text-[1.4rem] leading-[1.55] text-[#555555]">
              {cat.description}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {cat.subcategories.slice(0, 5).map((sub) => (
                <li key={sub.slug}>
                  <Link
                    to={`/en/services/${cat.slug}#${sub.slug}`}
                    className="inline-block rounded-[4px] bg-[#f4f7ff] px-2.5 py-1 text-[1.2rem] font-medium text-[#0a295b] hover:bg-[#3665f6] hover:text-white"
                  >
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to={`/en/services/${cat.slug}`}
              className="zm-btn zm-btn-green zm-btn-xs mt-auto self-start pt-5"
              style={{ marginTop: '20px' }}
            >
              <span>More details</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
