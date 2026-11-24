import { useTranslation } from '../../hooks/useTranslation'
import { useUI } from '../../hooks/useUI'
import { BRAND } from '../../data/brand'

export default function CoordinatorSection() {
  const { openInquiry } = useUI()
  const { t } = useTranslation()

  return (
    <section className="mt-[130px] md:mt-[200px]">
      <div className="zm-container">
        <div className="flex flex-col items-start gap-10 md:flex-row md:items-stretch md:gap-[75px]">
          <div className="w-full max-w-[300px] shrink-0 overflow-hidden rounded-[8px]">
            <img
              src={BRAND.coordinator.portrait}
              alt={BRAND.coordinator.caption}
              className="h-[420px] w-full object-cover md:h-[450px]"
            />
          </div>

          <div className="flex flex-col justify-start py-4">
            <div>
              <h3 className="text-[2.4rem] font-semibold text-[#0c3a94] md:text-[2.6rem]">
                {t('home.coordinatorTitle')}
              </h3>
              <p className="mt-4 max-w-[660px] text-[1.6rem] leading-[1.65] text-[#555555]">
                {t('home.coordinatorBody')}
              </p>
              <button
                type="button"
                onClick={() => openInquiry()}
                className="zm-btn zm-btn-green zm-btn-sm mt-7"
              >
                <span>{t('services.fillOutForm', 'Fill out the form')}</span>
              </button>
            </div>

            <p className="mt-12 text-[1.8rem] font-medium text-[#0c3a94]">
              {BRAND.coordinator.caption}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
