import { Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BRAND } from '../../data/brand'
import { EU_BADGE_URL } from '../../data/homeData'
import { FOOTER_NAVIGATE, FOOTER_RESOURCES } from '../../data/navigation'
import { useTranslation } from '../../hooks/useTranslation'
import AltensorLogo from '../common/AltensorLogo'
import { SwiperArrowIcon } from '../common/ZagrebIcons'

const CURRENT_YEAR = new Date().getFullYear()

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="mt-[100px] w-full">
      <div className="bg-[#3665f6] pt-[80px] pb-[140px] text-white md:pt-[100px] md:pb-[190px]">
        <div className="zm-container">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-6">
            {/* Navigate */}
            <div>
              <h4 className="mb-5 text-[1.8rem] font-bold">{t('footer.navigate')}</h4>
              <ul className="space-y-2.5 text-[1.4rem] text-white/90">
                {FOOTER_NAVIGATE.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="transition-opacity hover:underline hover:opacity-80"
                    >
                      {item.labelKey ? t(item.labelKey, item.label) : item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="mb-5 text-[1.8rem] font-bold">{t('footer.resources')}</h4>
              <ul className="space-y-2.5 text-[1.4rem] text-white/90">
                {FOOTER_RESOURCES.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="transition-opacity hover:underline hover:opacity-80"
                    >
                      {item.labelKey ? t(item.labelKey, item.label) : item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden md:block" />

            {/* Coordinator Block */}
            <div className="md:col-span-3">
              <div className="flex flex-col items-start gap-6 sm:flex-row">
                <img
                  src={BRAND.coordinator.avatar}
                  alt={BRAND.coordinator.name}
                  className="h-[80px] w-[80px] shrink-0 rounded-full object-cover shadow-md"
                />
                <div className="flex-1">
                  <h3 className="text-[3.2rem] font-bold leading-tight">
                    {BRAND.coordinator.name}
                  </h3>
                  <p className="mt-1 text-[1.1rem] font-bold uppercase tracking-[0.08em] text-white/90">
                    {t('about.founderRole', BRAND.coordinator.role)}
                  </p>
                  <p className="mt-3 max-w-[360px] text-[1.4rem] leading-relaxed text-white/90">
                    {t('footerExtra.coordinatorHelp')}
                  </p>

                  <a
                    href={`tel:${BRAND.phone.replace(/\s+/g, '')}`}
                    className="mt-4 inline-flex items-center gap-2 text-[1.6rem] font-bold hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    <span>{BRAND.phone}</span>
                  </a>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      to="/en/about-us/contact"
                      className="zm-btn zm-btn-green-on-blue zm-btn-sm inline-flex items-center gap-2"
                    >
                      <span>{t('nav.contact')}</span>
                      <SwiperArrowIcon className="zm-btn-arrow h-[10px] w-[7px]" />
                    </Link>
                    <a
                      href={BRAND.whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      className="zm-btn zm-btn-green-on-blue zm-btn-sm inline-flex items-center gap-2"
                    >
                      <span>Whatsapp</span>
                      <SwiperArrowIcon className="zm-btn-arrow h-[10px] w-[7px]" />
                    </a>
                  </div>

                  <div className="mt-7">
                    <p className="mb-3 text-[1.6rem] font-bold">{t('footerExtra.followUs')}</p>
                    <div className="flex flex-wrap gap-2.5">
                      <a
                        href={BRAND.socials.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-[6px] bg-white px-4 py-1.5 text-[1.2rem] font-semibold text-[#3665f6] transition-transform hover:-translate-y-0.5"
                      >
                        Facebook
                      </a>
                      <a
                        href={BRAND.socials.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-[6px] bg-white px-4 py-1.5 text-[1.2rem] font-semibold text-[#3665f6] transition-transform hover:-translate-y-0.5"
                      >
                        Instagram
                      </a>
                      <a
                        href={BRAND.socials.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-[6px] bg-white px-4 py-1.5 text-[1.2rem] font-semibold text-[#3665f6] transition-transform hover:-translate-y-0.5"
                      >
                        LinkedIn
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom White Bar */}
      <div className="flex min-h-[90px] items-center bg-white py-4">
        <div className="zm-container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-4">
            <Link to="/en" aria-label={BRAND.name}>
              <AltensorLogo compact />
            </Link>
            <p className="text-[1.2rem] text-[#555555]">
              Copyright {CURRENT_YEAR} {BRAND.name} · {t('footer.rights')}
            </p>
          </div>
          <img
            src={EU_BADGE_URL}
            alt="Funded by the European Union"
            className="h-[46px] w-auto object-contain"
          />
        </div>
      </div>
    </footer>
  )
}
