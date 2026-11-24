import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'
import { useUI } from '../../hooks/useUI'
import { apiClient, resolveMediaUrl } from '../../services/apiClient'
import SectionLoader from '../common/SectionLoader'
import { SwiperArrowIcon } from '../common/ZagrebIcons'

export default function DoctorsSection() {
  const { language } = useUI()
  const { t } = useTranslation()
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    setLoading(true)
    apiClient
      .get('/public/doctors')
      .then((res) => {
        if (ignore) return
        const items = Array.isArray(res?.data) ? res.data : []
        setFeatured(
          items.slice(0, 4).map((d) => ({
            slug: d.slug || d.id,
            name: d.fullName || d.name,
            specialty: d.specialization || d.title || '',
            shortBio: d.shortBio || d.bio || '',
            image: resolveMediaUrl(d.photoUrl) || d.image || '',
          }))
        )
      })
      .catch(() => {
        if (!ignore) setFeatured([])
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
              {t('nav.doctors', 'Doctors')}
            </h2>
            <p className="mt-3 text-[2rem] font-medium text-[#0c3a94] md:text-[2.6rem]">
              {t('home.doctorsSubtitle')}
            </p>
          </div>

          <Link
            to="/en/doctors"
            className="zm-btn zm-btn-green zm-btn-sm shrink-0 self-start md:self-auto"
          >
            <span>{t('common.viewAll', 'View all')}</span>
            <SwiperArrowIcon className="zm-btn-arrow h-[12px] w-[8px]" />
          </Link>
        </div>

        {loading ? (
          <SectionLoader />
        ) : featured.length === 0 ? (
          <div className="mt-12 rounded-[12px] border border-dashed border-[#dce4f5] bg-[#fafcff] p-10 text-center text-[1.55rem] text-[#666666]">
            {t('home.doctorsEmpty', 'No doctors added yet.')}
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((doc) => (
              <div
                key={doc.slug}
                className="group flex flex-col rounded-[12px] border border-[#3665f6] bg-white p-[20px] transition-shadow duration-300 hover:shadow-lg"
              >
                <Link
                  to={`/en/doctors/${doc.slug}`}
                  className="block aspect-[9/16] w-full overflow-hidden rounded-[8px] bg-[#f4f7fc]"
                >
                  {doc.image && (
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </Link>

                <p className="mt-5 text-[1.2rem] font-bold uppercase tracking-wide text-[#3665f6]">
                  {doc.specialty}
                </p>

                <Link
                  to={`/en/doctors/${doc.slug}`}
                  className="mt-2 text-[2.4rem] font-semibold leading-[1.2] text-[#0a295b] transition-colors duration-[400ms] group-hover:text-[#3665f6] md:text-[2.6rem]"
                >
                  {doc.name}
                </Link>

                {doc.shortBio && (
                  <p className="mt-3 line-clamp-3 text-[1.4rem] leading-relaxed text-[#555555]">
                    {doc.shortBio}
                  </p>
                )}

                <div className="mt-auto pt-6 text-right">
                  <Link
                    to={`/en/doctors/${doc.slug}`}
                    className="inline-flex items-center justify-end text-[1.2rem] font-bold text-[#3665f6]"
                  >
                    <span>{t('home.viewDoctor', 'View profile')}</span>
                    <SwiperArrowIcon className="h-[13px] w-0 overflow-hidden pl-0 transition-all duration-[400ms] group-hover:w-[16px] group-hover:pl-[6px]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
