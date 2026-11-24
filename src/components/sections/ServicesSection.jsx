import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BRAND } from '../../data/brand'
import { useTranslation } from '../../hooks/useTranslation'
import { useUI } from '../../hooks/useUI'
import catalogService from '../../services/catalogService'
import SectionLoader from '../common/SectionLoader'
import { SwiperArrowIcon } from '../common/ZagrebIcons'

function normalizeHomeCategory(cat) {
  const subs = cat.subCategories || cat.subcategories || []
  const collected = subs.flatMap((sub) =>
    (sub.services || []).map((proc) => ({
      slug: proc.slug,
      name: proc.title || proc.name,
      subSlug: sub.slug,
    }))
  )
  return {
    slug: cat.slug,
    name: cat.title || cat.name,
    featuredProcedures: collected.slice(0, 5),
  }
}

export default function ServicesSection() {
  const { language } = useUI()
  const { t } = useTranslation()
  const [featuredCats, setFeaturedCats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    setLoading(true)
    catalogService
      .getCategories({ homeOnly: true })
      .then(async (list) => {
        if (ignore) return
        let source = Array.isArray(list) ? list : []
        if (source.length === 0) {
          const all = await catalogService.getCategories().catch(() => [])
          source = Array.isArray(all) ? all.slice(0, 6) : []
        }
        if (!ignore) {
          setFeaturedCats(source.map(normalizeHomeCategory))
        }
      })
      .catch(() => {
        if (!ignore) setFeaturedCats([])
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [language])

  return (
    <section className="mt-[100px]">
      <div className="zm-container">
        <h2 className="text-[4.2rem] font-semibold leading-[1.1] text-[#0c3a94] md:text-[7rem]">
          {BRAND.name} {t('home.servicesTitle', 'medical services')}
        </h2>
        <p className="mt-4 max-w-[920px] text-[1.9rem] font-medium leading-[1.4] text-[#0c3a94] md:text-[2.6rem]">
          {t('home.servicesSubtitle')}
        </p>

        {loading ? (
          <SectionLoader />
        ) : featuredCats.length === 0 ? (
          <div className="mt-[50px] rounded-[12px] border border-dashed border-[#dce4f5] bg-[#fafcff] p-10 text-center text-[1.55rem] text-[#666666]">
            {t('home.servicesEmpty')}
          </div>
        ) : (
          <div className="mt-[60px] grid grid-cols-1 gap-x-[40px] gap-y-[50px] md:grid-cols-2 lg:grid-cols-3 xl:gap-x-[90px] xl:gap-y-[70px]">
            {featuredCats.map((cat) => (
              <div key={cat.slug} className="flex flex-col items-start">
                <Link
                  to={`/en/services/${cat.slug}`}
                  className="text-[2.6rem] font-semibold text-[#3665f6] transition-colors hover:text-[#0c3a94]"
                >
                  {cat.name}
                </Link>

                <ul className="mt-4 space-y-2.5">
                  {cat.featuredProcedures.map((proc) => (
                    <li key={proc.slug}>
                      <Link
                        to={`/en/services/${cat.slug}/${proc.subSlug}/${proc.slug}`}
                        className="text-[1.4rem] text-[#666666] transition-colors hover:text-[#3665f6]"
                      >
                        {proc.name}
                      </Link>
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/en/services/${cat.slug}`}
                  className="zm-btn zm-btn-green zm-btn-xs mt-5"
                >
                  <span>{t('home.moreDetails', 'More details')}</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full-bleed Blue Explore Banner */}
      <div className="mt-[80px] w-full bg-[#3665f6] py-[60px] px-[15px] text-center">
        <h3 className="text-[2.4rem] font-semibold text-white md:text-[2.6rem]">
          {t('home.exploreAllServices')}
        </h3>
        <div className="mt-6">
          <Link
            to="/en/services"
            className="zm-btn zm-btn-green-on-blue inline-flex items-center gap-2"
          >
            <span>{t('common.viewAll', 'View all')}</span>
            <SwiperArrowIcon className="zm-btn-arrow h-[14px] w-[10px]" />
          </Link>
        </div>
      </div>
    </section>
  )
}
