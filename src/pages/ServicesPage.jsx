import { ChevronDown, ChevronRight, MapPin, ShieldCheck, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import RichContent from '../components/common/RichContent'
import SectionLoader from '../components/common/SectionLoader'
import FaqSection from '../components/sections/FaqSection'
import { BRAND } from '../data/brand'
import { useTranslation } from '../hooks/useTranslation'
import { useUI } from '../hooks/useUI'
import { resolveMediaUrl } from '../services/apiClient'
import catalogService from '../services/catalogService'

function normalizeCategoryTree(cat) {
  return {
    id: cat.id || cat.slug,
    slug: cat.slug,
    title: cat.title || cat.name,
    description: cat.description || '',
    subCategories: (cat.subCategories || cat.subcategories || []).map((sub) => ({
      id: sub.id || sub.slug,
      slug: sub.slug,
      title: sub.title || sub.name,
      description: sub.description || '',
      services: (sub.services || []).map((s) => ({
        id: s.id || s.slug,
        slug: s.slug,
        title: s.title || s.name,
        startingPrice: s.startingPrice ?? s.priceFrom ?? null,
      })),
    })),
  }
}

function SplitSection({ title, children }) {
  return (
    <div className="grid grid-cols-1 gap-6 border-b border-[#e8e8e8] py-10 md:grid-cols-12 md:gap-10">
      <div className="md:col-span-3">
        <h2 className="text-[2.2rem] font-bold text-[#0c3a94]">{title}</h2>
      </div>
      <div className="md:col-span-9">{children}</div>
    </div>
  )
}

function ReviewsBlock({ reviews }) {
  if (!Array.isArray(reviews) || reviews.length === 0) return null
  return (
    <SplitSection title="Patient reviews">
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={20}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
        }}
        className="pb-10"
      >
        {reviews.map((rev, idx) => (
          <SwiperSlide key={rev.id || idx}>
            <div className="flex h-full flex-col justify-between rounded-[12px] border border-[#e8e8e8] bg-white p-6 shadow-sm">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[1.6rem] font-bold text-[#0c3a94]">
                      {rev.patientName || rev.authorName || 'Verified Patient'}
                    </div>
                    {rev.country && (
                      <div className="text-[1.25rem] text-[#666666]">{rev.country}</div>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#eef8e6] px-3 py-1 text-[1.15rem] font-semibold text-[#4e8a2c]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified patient
                  </span>
                </div>
                <div className="mt-3 flex gap-1 text-[#f59e0b]">
                  {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-3 text-[1.45rem] leading-[1.6] text-[#555555]">
                  {rev.comment || rev.text}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </SplitSection>
  )
}

function CoordinatorBanner({ coordinator, onAction, subject, t }) {
  const name = coordinator?.fullName || BRAND.coordinator.fullName
  const role = coordinator?.role || BRAND.coordinator.role
  const photo = resolveMediaUrl(coordinator?.photoUrl) || BRAND.coordinator.portrait

  return (
    <div className="mt-14 flex flex-col items-center justify-between gap-6 rounded-[12px] bg-[#3665f6] p-8 text-white md:flex-row md:p-10">
      <div className="flex items-center gap-5">
        <img
          src={photo}
          alt={name}
          className="h-[74px] w-[74px] shrink-0 rounded-full border-2 border-white/40 object-cover"
        />
        <div>
          <div className="text-[1.25rem] font-bold uppercase tracking-wider text-[#b9f38b]">
            {role} · {name}
          </div>
          <h3 className="mt-1 text-[2.2rem] font-bold md:text-[2.6rem]">
            {t('services.needHelp')}
          </h3>
          <p className="mt-1 text-[1.45rem] text-white/90">
            {t('services.needHelpSub')}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onAction(subject)}
        className="zm-btn zm-btn-green-on-blue shrink-0"
      >
        <span>{t('services.fillOutForm')}</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

export default function ServicesPage() {
  const { category, sub, procedure } = useParams()
  const { openInquiry, language } = useUI()
  const { t } = useTranslation()

  const [loading, setLoading] = useState(true)
  const [directoryCats, setDirectoryCats] = useState([])
  const [categoryData, setCategoryData] = useState(null)
  const [subcategoryData, setSubcategoryData] = useState(null)
  const [procedureData, setProcedureData] = useState(null)
  const [openFaqIdx, setOpenFaqIdx] = useState(0)

  useEffect(() => {
    let ignore = false

    const load = async () => {
      if (category === 'eu-patients') {
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        if (!category) {
          const list = await catalogService.getCategories()
          if (!ignore) {
            setDirectoryCats(Array.isArray(list) ? list.map(normalizeCategoryTree) : [])
          }
        } else if (category && sub && procedure) {
          const detail = await catalogService.getServiceDetail(procedure)
          if (!ignore) setProcedureData(detail || null)
        } else if (category && sub) {
          const subDetail = await catalogService.getSubcategoryDetail(category, sub)
          if (!ignore) setSubcategoryData(subDetail || null)
        } else if (category) {
          const catDetail = await catalogService.getCategoryDetail(category)
          if (!ignore) setCategoryData(catDetail || null)
        }
      } catch {
        if (!ignore) {
          setDirectoryCats([])
          setCategoryData(null)
          setSubcategoryData(null)
          setProcedureData(null)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [category, sub, procedure, language])

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
            Through {BRAND.name}, you receive transparent medical invoices, official clinical
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

  // 4. PROCEDURE DETAIL VIEW (/en/services/:category/:sub/:procedure)
  if (category && sub && procedure) {
    if (loading) {
      return <SectionLoader fullPage />
    }
    if (!procedureData) {
      return (
        <div className="zm-container py-20 text-center">
          <h1 className="text-[3.2rem] font-bold text-[#0c3a94]">Procedure not found</h1>
          <p className="mt-2 text-[1.55rem] text-[#666666]">
            This procedure has not been added in the Admin Panel yet.
          </p>
          <Link to="/en/services" className="zm-btn zm-btn-green mt-6 inline-flex">
            <span>Back to Services</span>
          </Link>
        </div>
      )
    }

    const procTitle = procedureData.title
    const startingPrice = procedureData.startingPrice ?? procedureData.priceFrom
    const clinics = procedureData.availableClinics || []
    const doctors = procedureData.availableDoctors || []
    const reviews = procedureData.reviews || []
    const faqs = procedureData.faqs || []

    return (
      <div className="zm-container py-14">
        <nav className="mb-6 text-[1.3rem] text-[#666666]">
          <Link to="/en" className="text-[#3665f6] hover:underline">Home</Link> /{' '}
          <Link to="/en/services" className="text-[#3665f6] hover:underline">Services</Link> /{' '}
          <Link to={`/en/services/${category}`} className="text-[#3665f6] hover:underline">
            {procedureData.parentCategoryTitle || category}
          </Link>{' '}
          /{' '}
          <Link to={`/en/services/${category}/${sub}`} className="text-[#3665f6] hover:underline">
            {procedureData.categoryTitle || sub}
          </Link>{' '}
          / <span>{procTitle}</span>
        </nav>

        <div className="flex flex-col justify-between gap-6 border-b border-[#e8e8e8] pb-10 md:flex-row md:items-end">
          <div>
            {procedureData.categoryTitle && (
              <span className="inline-block rounded-[4px] bg-[#f0f4ff] px-3 py-1 text-[1.2rem] font-bold uppercase text-[#3665f6]">
                {procedureData.categoryTitle}
              </span>
            )}
            <h1 className="mt-3 text-[3.8rem] font-bold leading-[1.08] text-[#0c3a94] md:text-[5.8rem]">
              {procTitle}
            </h1>
            {startingPrice != null && (
              <p className="mt-2 text-[1.8rem] font-semibold text-[#7fbb58]">
                Starting from €{startingPrice}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => openInquiry(procTitle)}
            className="zm-btn zm-btn-green shrink-0"
          >
            <span>Send inquiry</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {(procedureData.about || procedureData.heroImageUrl) && (
          <SplitSection title="About">
            <RichContent content={procedureData.about} />
            {procedureData.heroImageUrl && (
              <img
                src={resolveMediaUrl(procedureData.heroImageUrl)}
                alt={procTitle}
                className="mt-6 max-h-[380px] w-full rounded-[12px] object-cover"
              />
            )}
          </SplitSection>
        )}

        {procedureData.candidate && (
          <SplitSection title="Candidate">
            <RichContent content={procedureData.candidate} />
          </SplitSection>
        )}

        {procedureData.preparation && (
          <SplitSection title="Preparation">
            <RichContent content={procedureData.preparation} />
          </SplitSection>
        )}

        {procedureData.steps && (
          <SplitSection title="Treatment">
            <RichContent content={procedureData.steps} />
          </SplitSection>
        )}

        {procedureData.result && (
          <SplitSection title="Result">
            <RichContent content={procedureData.result} />
          </SplitSection>
        )}

        {procedureData.precautions && (
          <SplitSection title="Precautions">
            <RichContent content={procedureData.precautions} />
          </SplitSection>
        )}

        {procedureData.packageInfo && (
          <SplitSection title="Treatment package">
            <RichContent content={procedureData.packageInfo} />
          </SplitSection>
        )}

        {procedureData.relatedPackage && (
          <SplitSection title="Traveling from abroad?">
            <div className="flex flex-col justify-between gap-6 rounded-[12px] border border-[#dce4f5] bg-[#f8faff] p-6 md:flex-row md:items-center">
              <div>
                <h3 className="text-[2rem] font-bold text-[#0c3a94]">
                  {procedureData.relatedPackage.title}
                </h3>
                {procedureData.relatedPackage.description && (
                  <p className="mt-2 text-[1.45rem] text-[#555555]">
                    {procedureData.relatedPackage.description}
                  </p>
                )}
              </div>
              {procedureData.promoBannerUrl && (
                <img
                  src={resolveMediaUrl(procedureData.promoBannerUrl)}
                  alt={procedureData.relatedPackage.title}
                  className="h-[110px] w-[180px] rounded-[8px] object-cover"
                />
              )}
            </div>
          </SplitSection>
        )}

        {clinics.length > 0 && (
          <SplitSection title="Available clinics">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {clinics.map((clinic) => (
                <div
                  key={clinic.id || clinic.slug}
                  className="flex flex-col justify-between rounded-[12px] border border-[#e8e8e8] p-5 shadow-sm"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-[1.9rem] font-bold text-[#0c3a94]">{clinic.name}</h3>
                      {clinic.priceFrom != null && (
                        <span className="shrink-0 rounded-[6px] bg-[#eef8e6] px-3 py-1 text-[1.3rem] font-bold text-[#4e8a2c]">
                          From €{clinic.priceFrom}
                        </span>
                      )}
                    </div>
                    {clinic.city && (
                      <div className="mt-1 flex items-center gap-1.5 text-[1.3rem] text-[#666666]">
                        <MapPin className="h-4 w-4 text-[#3665f6]" />
                        {clinic.city}
                      </div>
                    )}
                    {clinic.description && (
                      <p className="mt-2.5 line-clamp-3 text-[1.4rem] text-[#555555]">
                        {clinic.description}
                      </p>
                    )}
                  </div>
                  <Link
                    to={`/en/clinics/${clinic.slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-[1.4rem] font-semibold text-[#3665f6] hover:underline"
                  >
                    View profile <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </SplitSection>
        )}

        {doctors.length > 0 && (
          <SplitSection title="Specialist doctors">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {doctors.map((doc) => (
                <Link
                  key={doc.id || doc.slug}
                  to={`/en/doctors/${doc.slug || doc.id}`}
                  className="group overflow-hidden rounded-[12px] border border-[#e8e8e8] bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="aspect-[9/16] w-full overflow-hidden bg-[#f4f7fc]">
                    {(doc.photoUrl || doc.image) && (
                      <img
                        src={resolveMediaUrl(doc.photoUrl || doc.image)}
                        alt={doc.fullName || doc.name}
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-[1.2rem] font-bold uppercase text-[#3665f6]">
                      {doc.specialization || doc.specialty}
                    </div>
                    <h3 className="mt-1 text-[1.75rem] font-bold text-[#0c3a94] group-hover:text-[#3665f6]">
                      {doc.fullName || doc.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </SplitSection>
        )}

        <ReviewsBlock reviews={reviews} />

        {faqs.length > 0 && (
          <SplitSection title="F.A.Q.">
            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIdx === idx
                return (
                  <div
                    key={faq.id || idx}
                    className="overflow-hidden rounded-[10px] border border-[#e8e8e8] bg-white"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? -1 : idx)}
                      className="flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left text-[1.6rem] font-bold text-[#0c3a94]"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180 text-[#3665f6]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-[#f0f0f0] px-5 py-4">
                        <RichContent content={faq.answer} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </SplitSection>
        )}

        <CoordinatorBanner
          coordinator={procedureData.primaryCoordinator}
          onAction={openInquiry}
          subject={procTitle}
          t={t}
        />
      </div>
    )
  }

  // 3. SUBCATEGORY VIEW (/en/services/:category/:sub)
  if (category && sub) {
    if (loading) {
      return <SectionLoader fullPage />
    }
    if (!subcategoryData) {
      return (
        <div className="zm-container py-20 text-center">
          <h1 className="text-[3.2rem] font-bold text-[#0c3a94]">Subcategory not found</h1>
          <p className="mt-2 text-[1.55rem] text-[#666666]">
            This subcategory has not been added in the Admin Panel yet.
          </p>
          <Link to="/en/services" className="zm-btn zm-btn-green mt-6 inline-flex">
            <span>Back to Services</span>
          </Link>
        </div>
      )
    }

    const subTitle = subcategoryData.title
    const procedures = subcategoryData.services || []
    const clinics = subcategoryData.clinics || []
    const doctors = subcategoryData.doctors || []
    const reviews = subcategoryData.reviews || []

    return (
      <div className="zm-container py-14">
        <nav className="mb-6 text-[1.3rem] text-[#666666]">
          <Link to="/en" className="text-[#3665f6] hover:underline">Home</Link> /{' '}
          <Link to="/en/services" className="text-[#3665f6] hover:underline">Services</Link> /{' '}
          <Link to={`/en/services/${category}`} className="text-[#3665f6] hover:underline">
            {subcategoryData.parentCategoryTitle || category}
          </Link>{' '}
          / <span>{subTitle}</span>
        </nav>

        <div className="flex flex-col justify-between gap-6 border-b border-[#e8e8e8] pb-10 md:flex-row md:items-end">
          <div>
            <h1 className="text-[4rem] font-bold leading-[1.08] text-[#0c3a94] md:text-[6rem]">
              {subTitle}
            </h1>
            {subcategoryData.description && (
              <p className="mt-3 max-w-[780px] text-[1.6rem] text-[#555555]">
                {subcategoryData.description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => openInquiry(subTitle)}
            className="zm-btn zm-btn-green shrink-0"
          >
            <span>Send inquiry</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <SplitSection title="Procedures">
          {procedures.length === 0 ? (
            <p className="text-[1.5rem] text-[#666666]">No procedures added in this subcategory yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {procedures.map((proc) => (
                <Link
                  key={proc.slug}
                  to={`/en/services/${category}/${sub}/${proc.slug}`}
                  className="flex items-center justify-between rounded-[10px] border border-[#e8e8e8] p-4 transition-colors hover:border-[#3665f6] hover:bg-[#f8faff]"
                >
                  <span className="text-[1.55rem] font-semibold text-[#0c3a94]">
                    {proc.title || proc.name}
                  </span>
                  {proc.startingPrice != null && (
                    <span className="rounded-[6px] bg-[#eef8e6] px-2.5 py-1 text-[1.2rem] font-bold text-[#4e8a2c]">
                      From €{proc.startingPrice}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </SplitSection>

        {clinics.length > 0 && (
          <SplitSection title="Clinics">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {clinics.map((clinic) => (
                <Link
                  key={clinic.slug}
                  to={`/en/clinics/${clinic.slug}`}
                  className="rounded-[12px] border border-[#e8e8e8] p-5 hover:border-[#3665f6]"
                >
                  <h3 className="text-[1.8rem] font-bold text-[#0c3a94]">{clinic.name}</h3>
                  {clinic.description && (
                    <p className="mt-2 line-clamp-3 text-[1.4rem] text-[#555555]">
                      {clinic.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </SplitSection>
        )}

        {doctors.length > 0 && (
          <SplitSection title="Doctors">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {doctors.map((doc) => (
                <Link
                  key={doc.id || doc.slug}
                  to={`/en/doctors/${doc.slug || doc.id}`}
                  className="rounded-[12px] border border-[#e8e8e8] p-4 hover:border-[#3665f6]"
                >
                  <div className="text-[1.2rem] font-bold uppercase text-[#3665f6]">
                    {doc.specialization || doc.specialty}
                  </div>
                  <div className="mt-1 text-[1.7rem] font-bold text-[#0c3a94]">
                    {doc.fullName || doc.name}
                  </div>
                </Link>
              ))}
            </div>
          </SplitSection>
        )}

        <ReviewsBlock reviews={reviews} />

        <CoordinatorBanner
          coordinator={subcategoryData.primaryCoordinator}
          onAction={openInquiry}
          subject={subTitle}
          t={t}
        />
      </div>
    )
  }

  // 2. CATEGORY VIEW (/en/services/:category)
  if (category) {
    if (loading) {
      return <SectionLoader fullPage />
    }
    if (!categoryData) {
      return (
        <div className="zm-container py-20 text-center">
          <h1 className="text-[3.2rem] font-bold text-[#0c3a94]">Category not found</h1>
          <p className="mt-2 text-[1.55rem] text-[#666666]">
            This category has not been added in the Admin Panel yet.
          </p>
          <Link to="/en/services" className="zm-btn zm-btn-green mt-6 inline-flex">
            <span>Back to Services</span>
          </Link>
        </div>
      )
    }

    const activeCat = normalizeCategoryTree(categoryData)
    const clinics = categoryData.clinics || []
    const doctors = categoryData.doctors || []
    const reviews = categoryData.reviews || []

    return (
      <div className="zm-container py-14">
        <nav className="mb-6 text-[1.3rem] text-[#666666]">
          <Link to="/en" className="text-[#3665f6] hover:underline">Home</Link> /{' '}
          <Link to="/en/services" className="text-[#3665f6] hover:underline">Services</Link> /{' '}
          <span>{activeCat.title}</span>
        </nav>

        <div className="flex flex-col justify-between gap-6 border-b border-[#e8e8e8] pb-10 md:flex-row md:items-end">
          <div>
            <h1 className="text-[4.2rem] font-bold leading-[1.08] text-[#0c3a94] md:text-[6.8rem]">
              {activeCat.title}
            </h1>
            {activeCat.description && (
              <p className="mt-3 max-w-[780px] text-[1.6rem] text-[#555555]">
                {activeCat.description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => openInquiry(activeCat.title)}
            className="zm-btn zm-btn-green shrink-0"
          >
            <span>Send inquiry</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <SplitSection title="Procedures">
          {activeCat.subCategories.length === 0 ? (
            <p className="text-[1.5rem] text-[#666666]">No subcategories or procedures added yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {activeCat.subCategories.map((subItem) => (
                <div key={subItem.slug} className="rounded-[12px] border border-[#e8e8e8] p-5">
                  <Link
                    to={`/en/services/${activeCat.slug}/${subItem.slug}`}
                    className="text-[1.8rem] font-bold text-[#0c3a94] hover:text-[#3665f6]"
                  >
                    {subItem.title}
                  </Link>
                  {subItem.services.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {subItem.services.map((proc) => (
                        <li key={proc.slug}>
                          <Link
                            to={`/en/services/${activeCat.slug}/${subItem.slug}/${proc.slug}`}
                            className="text-[1.4rem] text-[#555555] hover:text-[#3665f6] hover:underline"
                          >
                            {proc.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </SplitSection>

        {clinics.length > 0 && (
          <SplitSection title="Clinics">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {clinics.map((clinic) => (
                <div
                  key={clinic.slug}
                  className="rounded-[12px] border border-[#e8e8e8] p-5 shadow-sm"
                >
                  {clinic.coverUrl && (
                    <img
                      src={resolveMediaUrl(clinic.coverUrl)}
                      alt={clinic.name}
                      className="mb-3 h-[160px] w-full rounded-[8px] object-cover"
                    />
                  )}
                  <h3 className="text-[1.9rem] font-bold text-[#0c3a94]">{clinic.name}</h3>
                  {clinic.description && (
                    <p className="mt-2 line-clamp-3 text-[1.4rem] text-[#555555]">
                      {clinic.description}
                    </p>
                  )}
                  <Link
                    to={`/en/clinics/${clinic.slug}`}
                    className="mt-3 inline-flex items-center gap-1 text-[1.4rem] font-semibold text-[#3665f6] hover:underline"
                  >
                    View profile <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </SplitSection>
        )}

        {doctors.length > 0 && (
          <SplitSection title="Doctors">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {doctors.map((doc) => (
                <Link
                  key={doc.id || doc.slug}
                  to={`/en/doctors/${doc.slug || doc.id}`}
                  className="group overflow-hidden rounded-[12px] border border-[#e8e8e8] bg-white shadow-sm"
                >
                  <div className="aspect-[9/16] w-full overflow-hidden bg-[#f4f7fc]">
                    {(doc.photoUrl || doc.image) && (
                      <img
                        src={resolveMediaUrl(doc.photoUrl || doc.image)}
                        alt={doc.fullName || doc.name}
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-[1.2rem] font-bold uppercase text-[#3665f6]">
                      {doc.specialization || doc.specialty}
                    </div>
                    <h3 className="mt-1 text-[1.75rem] font-bold text-[#0c3a94]">
                      {doc.fullName || doc.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </SplitSection>
        )}

        <ReviewsBlock reviews={reviews} />

        <CoordinatorBanner
          coordinator={categoryData.primaryCoordinator}
          onAction={openInquiry}
          subject={activeCat.title}
          t={t}
        />
      </div>
    )
  }

  // 1. ALL SERVICES DIRECTORY (/en/services)
  return (
    <div className="zm-container py-16">
      <nav className="mb-6 text-[1.3rem] text-[#666666]">
        <Link to="/en" className="text-[#3665f6] hover:underline">{t('services.home')}</Link> /{' '}
        <span>{t('services.title')}</span>
      </nav>

      <h1 className="text-[4.4rem] font-bold leading-[1.08] text-[#0c3a94] md:text-[7rem]">
        {t('services.title')}
      </h1>
      <p className="mt-4 max-w-[780px] text-[1.8rem] text-[#555555]">
        {t('services.subtitle')}
      </p>

      {loading ? (
        <SectionLoader />
      ) : directoryCats.length === 0 ? (
        <div className="mt-14 rounded-[12px] border border-dashed border-[#dce4f5] bg-[#fafcff] p-12 text-center text-[1.6rem] text-[#666666]">
          {t('services.emptyDirectory')}
        </div>
      ) : (
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {directoryCats.map((cat) => (
            <div
              key={cat.slug}
              className="flex flex-col justify-between rounded-[12px] border border-[#e8e8e8] bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
            >
              <div>
                <Link
                  to={`/en/services/${cat.slug}`}
                  className="text-[2.4rem] font-bold text-[#3665f6] hover:text-[#0c3a94]"
                >
                  {cat.title}
                </Link>
                <div className="mt-4 space-y-3">
                  {cat.subCategories.map((subItem) => (
                    <div key={subItem.slug}>
                      <Link
                        to={`/en/services/${cat.slug}/${subItem.slug}`}
                        className="text-[1.45rem] font-bold text-[#0c3a94] hover:text-[#3665f6]"
                      >
                        {subItem.title}
                      </Link>
                      {subItem.services.length > 0 && (
                        <ul className="mt-1 space-y-1 pl-3">
                          {subItem.services.slice(0, 4).map((proc) => (
                            <li key={proc.slug}>
                              <Link
                                to={`/en/services/${cat.slug}/${subItem.slug}/${proc.slug}`}
                                className="text-[1.3rem] text-[#666666] hover:text-[#3665f6]"
                              >
                                {proc.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Link to={`/en/services/${cat.slug}`} className="zm-btn zm-btn-green zm-btn-xs mt-6">
                <span>{t('services.exploreCategory')}</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
