import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'
import { useUI } from '../../hooks/useUI'
import { apiClient, resolveMediaUrl } from '../../services/apiClient'
import SectionLoader from '../common/SectionLoader'
import { SwiperArrowIcon } from '../common/ZagrebIcons'

export default function ClinicsSection() {
  const { language } = useUI()
  const { t } = useTranslation()
  const [clinics, setClinics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    setLoading(true)
    apiClient
      .get('/public/clinics')
      .then((res) => {
        if (ignore) return
        const items = Array.isArray(res?.data) ? res.data : []
        setClinics(
          items.slice(0, 3).map((c) => ({
            slug: c.slug || c.id,
            name: c.name,
            summary: c.shortDescription || c.description || '',
            image: resolveMediaUrl(c.coverImageUrl) || resolveMediaUrl(c.logoUrl) || c.image || '',
          }))
        )
      })
      .catch(() => {
        if (!ignore) setClinics([])
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [language])

  return (
    <section className="mt-[130px] md:mt-[200px]">
      <div className="zm-container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-[4.8rem] font-semibold leading-[1] text-[#0c3a94] md:text-[8.2rem]">
              {t('nav.clinics', 'Clinics')}
            </h2>
            <p className="mt-3 text-[2rem] font-medium text-[#0c3a94] md:text-[2.6rem]">
              {t('home.clinicsSubtitle')}
            </p>
          </div>

          <Link
            to="/en/clinics"
            className="zm-btn zm-btn-green zm-btn-sm shrink-0 self-start md:self-auto"
          >
            <span>{t('common.viewAll', 'View all')}</span>
            <SwiperArrowIcon className="zm-btn-arrow h-[12px] w-[8px]" />
          </Link>
        </div>

        {loading ? (
          <SectionLoader />
        ) : clinics.length === 0 ? (
          <div className="mt-12 rounded-[12px] border border-dashed border-[#dce4f5] bg-[#fafcff] p-10 text-center text-[1.55rem] text-[#666666]">
            {t('home.clinicsEmpty', 'No clinics added yet.')}
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3">
            {clinics.map((clinic) => (
              <div key={clinic.slug} className="group flex flex-col items-start">
                <Link
                  to={`/en/clinics/${clinic.slug}`}
                  className="block h-[256px] w-full overflow-hidden rounded-[8px] bg-[#f4f7fc]"
                >
                  {clinic.image && (
                    <img
                      src={clinic.image}
                      alt={clinic.name}
                      className="h-full w-full object-cover transition-transform duration-[400ms] group-hover:scale-110"
                    />
                  )}
                </Link>

                <Link
                  to={`/en/clinics/${clinic.slug}`}
                  className="mt-5 text-[3.2rem] font-semibold leading-[1.2] text-[#0a295b] transition-colors duration-[400ms] group-hover:text-[#3665f6] md:text-[3.6rem]"
                >
                  {clinic.name}
                </Link>

                <p className="mt-3 line-clamp-3 text-[1.5rem] leading-[1.6] text-[#555555]">
                  {clinic.summary}
                </p>

                <Link
                  to={`/en/clinics/${clinic.slug}`}
                  className="zm-btn zm-btn-green zm-btn-sm mt-5"
                >
                  <span>{t('home.viewClinic', 'View profile')}</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
