import { SUPPORTED_BY } from '../../data/homeData'
import { useTranslation } from '../../hooks/useTranslation'

export default function SupportedSection() {
  const { t } = useTranslation()
  return (
    <section className="mt-[90px] md:mt-[120px]">
      <div className="zm-container">
        <h2 className="text-[4.8rem] font-semibold leading-[1] text-[#0c3a94] md:text-[8.2rem]">
          {t('home.supportedTitle', 'Supported by')}
        </h2>

        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4 md:gap-12">
          {SUPPORTED_BY.map((org) => (
            <a
              key={org.name}
              href={org.href}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center text-center transition-transform hover:-translate-y-1"
            >
              <div className="flex h-[100px] items-center justify-center">
                <img
                  src={org.logo}
                  alt={org.name}
                  className="max-h-[92px] w-auto object-contain"
                />
              </div>
              <span className="mt-4 text-[1.4rem] font-bold text-[#0c3a94] group-hover:text-[#3665f6]">
                {org.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

