import { CheckCircle2, Phone } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useUI } from '../hooks/useUI'
import { BRAND } from '../data/brand'
import { NAV_ABOUT_ITEMS } from '../data/navigation'

const PILLARS = [
  {
    title: 'Easy to use',
    desc: 'Find your treatment, specialist, or clinic and submit a free inquiry in minutes.',
  },
  {
    title: 'Supported',
    desc: 'Your personal patient coordinator assists you at every step from initial inquiry to follow-up.',
  },
  {
    title: 'Customized',
    desc: 'Tailored treatment plans plus optional travel, hotel accommodation, and airport transfers.',
  },
  {
    title: 'Protected',
    desc: `${BRAND.name} is fully GDPR compliant so your medical documentation remains private and secure.`,
  },
  {
    title: 'Without added costs',
    desc: 'Using our platform and patient coordination service is 100% free with transparent clinic pricing.',
  },
  {
    title: 'Accessible',
    desc: 'Direct access to leading private clinics and English-speaking doctors with minimal waiting times.',
  },
]

const SUBPAGE_COPY = {
  'how-it-works': {
    title: 'How it works',
    subtitle: "You don't need a diagnosis to take the first step",
    paragraphs: [
      `Send a free inquiry through ${BRAND.name} describing your symptoms or desired treatment. You can optionally attach medical documentation such as MRI scans or laboratory findings.`,
      'Partner clinics prepare transparent offers directly without middleman markups. Once you choose an option, our patient coordinator arranges appointments, flights, hotel stay, and local transfers.',
    ],
  },
  'airline-partner': {
    title: 'Airline partner',
    subtitle: 'Seamless flights with Croatia Airlines',
    paragraphs: [
      `${BRAND.name} partners with Croatia Airlines to provide convenient travel options and discounted fares for patients and accompanying family members traveling to Zagreb.`,
    ],
  },
  'obzor-holidays-travel-partner': {
    title: 'Obzor Holidays - Travel partner',
    subtitle: 'Curated accommodation, transfers & city experiences',
    paragraphs: [
      'Together with Obzor Holidays, we coordinate vetted hotel stays near your clinic, private airport transfers, and tailored leisure arrangements for patients and companions.',
    ],
  },
  'official-editorial-partner': {
    title: 'Official Editorial Partner',
    subtitle: 'Medically reviewed healthcare guidance',
    paragraphs: [
      `All patient guides and clinical overviews on ${BRAND.name} are prepared in collaboration with our specialist medical partners to ensure clarity and accuracy.`,
    ],
  },
}

export default function AboutPage() {
  const { subpage } = useParams()
  const { openInquiry } = useUI()
  const [contactSent, setContactSent] = useState(false)
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })

  const activePath = subpage ? `/en/about-us/${subpage}` : '/en/about-us'

  const renderContent = () => {
    if (subpage === 'contact') {
      return (
        <div>
          <h1 className="text-[4.4rem] font-bold leading-[1.08] text-[#0c3a94] md:text-[6.8rem]">
            Contact
          </h1>
          <p className="mt-3 text-[1.8rem] text-[#555555]">
            Have a question? Send a message or reach our patient coordinator directly.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              {contactSent ? (
                <div className="rounded-[12px] border border-[#6bbe47] bg-[#f4fbf0] p-8 text-center">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-[#7fbb58]" />
                  <h3 className="mt-3 text-[2.2rem] font-bold text-[#0c3a94]">
                    Message sent!
                  </h3>
                  <p className="mt-2 text-[1.5rem] text-[#555555]">
                    {BRAND.coordinator.name} will get back to you shortly.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    setContactSent(true)
                  }}
                  className="space-y-5 rounded-[12px] border border-[#e8e8e8] bg-white p-7"
                >
                  <div>
                    <label className="mb-1.5 block text-[1.35rem] font-semibold text-[#0a295b]">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, name: e.target.value })
                      }
                      className="w-full rounded-[8px] border border-[#c7c7c7] px-4 py-3 text-[1.5rem] outline-none focus:border-[#3665f6]"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[1.35rem] font-semibold text-[#0a295b]">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, email: e.target.value })
                      }
                      className="w-full rounded-[8px] border border-[#c7c7c7] px-4 py-3 text-[1.5rem] outline-none focus:border-[#3665f6]"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[1.35rem] font-semibold text-[#0a295b]">
                      Your message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, message: e.target.value })
                      }
                      className="w-full rounded-[8px] border border-[#c7c7c7] p-4 text-[1.5rem] outline-none focus:border-[#3665f6]"
                    />
                  </div>
                  <button type="submit" className="zm-btn zm-btn-green">
                    <span>SEND</span>
                  </button>
                </form>
              )}
            </div>

            <div className="rounded-[12px] bg-[#3665f6] p-8 text-white lg:col-span-2">
              <img
                src={BRAND.coordinator.avatar}
                alt={BRAND.coordinator.name}
                className="h-20 w-20 rounded-full object-cover"
              />
              <h3 className="mt-4 text-[2.8rem] font-bold">
                {BRAND.coordinator.name}
              </h3>
              <p className="text-[1.15rem] font-bold uppercase tracking-wider text-white/85">
                {BRAND.coordinator.role}
              </p>
              <p className="mt-3 text-[1.45rem] leading-relaxed text-white/90">
                Here to help you with all your medical needs and any other questions,
                call or text.
              </p>
              <a
                href={`tel:${BRAND.phone.replace(/\s+/g, '')}`}
                className="mt-5 inline-flex items-center gap-2 text-[1.6rem] font-bold hover:underline"
              >
                <Phone className="h-4 w-4" />
                <span>{BRAND.phone}</span>
              </a>
              <div className="mt-6">
                <a
                  href={BRAND.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="zm-btn zm-btn-green-on-blue zm-btn-sm"
                >
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (subpage && SUBPAGE_COPY[subpage]) {
      const info = SUBPAGE_COPY[subpage]
      return (
        <div>
          <h1 className="text-[4.4rem] font-bold leading-[1.08] text-[#0c3a94] md:text-[6.8rem]">
            {info.title}
          </h1>
          <h2 className="mt-4 text-[2.4rem] font-semibold text-[#3665f6]">
            {info.subtitle}
          </h2>
          <div className="mt-6 space-y-5 text-[1.65rem] leading-[1.7] text-[#555555]">
            {info.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <button
            type="button"
            onClick={() => openInquiry(info.title)}
            className="zm-btn zm-btn-green mt-8"
          >
            <span>Send inquiry</span>
          </button>
        </div>
      )
    }

    return (
      <div>
        <h1 className="text-[4.4rem] font-bold leading-[1.08] text-[#0c3a94] md:text-[6.8rem]">
          About {BRAND.name}
        </h1>
        <p className="mt-5 max-w-[800px] text-[1.8rem] leading-[1.65] text-[#555555]">
          {BRAND.name} unites leading private hospitals, polyclinics, and over 250
          specialist doctors into one transparent patient coordination platform—making
          world-class diagnostics, surgery, and medical travel effortless.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-[10px] border border-[#f4f4f4] bg-white p-6 shadow-xs"
            >
              <h3 className="text-[2rem] font-bold text-[#0c3a94]">{pillar.title}</h3>
              <p className="mt-2.5 text-[1.45rem] leading-[1.6] text-[#555555]">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-6 rounded-[12px] border border-[#e8e8e8] bg-[#f8faff] p-8 sm:flex-row">
          <img
            src={BRAND.coordinator.avatar}
            alt={BRAND.coordinator.fullName}
            className="h-24 w-24 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="text-[1.2rem] font-bold uppercase text-[#3665f6]">
              {BRAND.coordinator.role}
            </p>
            <h3 className="text-[2.4rem] font-bold text-[#0a295b]">
              {BRAND.coordinator.fullName}
            </h3>
            <p className="mt-1 text-[1.5rem] text-[#555555]">
              Dedicated point of contact for international treatment planning and
              concierge logistics.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openInquiry()}
            className="zm-btn zm-btn-green shrink-0"
          >
            <span>Send inquiry</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="zm-container py-16">
      <nav className="mb-8 text-[1.3rem] text-[#666666]">
        <Link to="/en" className="text-[#3665f6] hover:underline">Home</Link> /{' '}
        <Link to="/en/about-us" className="text-[#3665f6] hover:underline">About Us</Link>
        {subpage ? ` / ${subpage.replace(/-/g, ' ')}` : ''}
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
        <aside className="space-y-2 lg:col-span-1">
          <Link
            to="/en/about-us"
            className={`block rounded-[8px] px-4 py-3 text-[1.45rem] font-semibold ${
              activePath === '/en/about-us'
                ? 'bg-[#3665f6] text-white'
                : 'bg-[#f4f4f4] text-[#0a295b] hover:bg-[#eaf0ff]'
            }`}
          >
            About Us
          </Link>
          {NAV_ABOUT_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`block rounded-[8px] px-4 py-3 text-[1.45rem] font-semibold ${
                activePath === item.to
                  ? 'bg-[#3665f6] text-white'
                  : 'bg-[#f4f4f4] text-[#0a295b] hover:bg-[#eaf0ff]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </aside>

        <div className="lg:col-span-3">{renderContent()}</div>
      </div>
    </div>
  )
}
