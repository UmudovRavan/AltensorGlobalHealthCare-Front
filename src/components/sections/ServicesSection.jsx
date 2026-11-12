import { Link } from 'react-router-dom'
import { BRAND } from '../../data/brand'
import { HOME_FEATURED_SERVICES } from '../../data/services'
import { SwiperArrowIcon } from '../common/ZagrebIcons'

export default function ServicesSection() {
  return (
    <section className="mt-[100px]">
      <div className="zm-container">
        <h2 className="text-[4.2rem] font-semibold leading-[1.1] text-[#0c3a94] md:text-[7rem]">
          {BRAND.name} medical services
        </h2>
        <p className="mt-4 max-w-[920px] text-[1.9rem] font-medium leading-[1.4] text-[#0c3a94] md:text-[2.6rem]">
          Not sure which service is right for you? Contact our patient coordinator
          and he will assist you.
        </p>

        <div className="mt-[60px] grid grid-cols-1 gap-x-[40px] gap-y-[50px] md:grid-cols-2 lg:grid-cols-3 xl:gap-x-[90px] xl:gap-y-[70px]">
          {HOME_FEATURED_SERVICES.map((cat) => (
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
                <span>More details</span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Full-bleed Blue Explore Banner */}
      <div className="mt-[80px] w-full bg-[#3665f6] py-[60px] px-[15px] text-center">
        <h3 className="text-[2.4rem] font-semibold text-white md:text-[2.6rem]">
          Explore all our medical services
        </h3>
        <div className="mt-6">
          <Link
            to="/en/services"
            className="zm-btn zm-btn-green-on-blue inline-flex items-center gap-2"
          >
            <span>View all</span>
            <SwiperArrowIcon className="zm-btn-arrow h-[14px] w-[10px]" />
          </Link>
        </div>
      </div>
    </section>
  )
}

