import { Link } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'
import { PLAN_STEPS } from '../../data/homeData'
import { SwiperArrowIcon } from '../common/ZagrebIcons'

export default function PlanSection() {
  const { t } = useTranslation()

  return (
    <section className="mt-[150px] w-full bg-[#3665f6] py-[90px] md:mt-[250px] md:py-[120px]">
      <div className="zm-container">
        <h2 className="text-[5.2rem] font-bold leading-none text-white md:text-[9rem]">
          {t('home.planTitle')}
          <span className="mt-2 block text-[2.6rem] font-bold text-[#7fbb58] md:text-[3.6rem]">
            {t('home.planSubtitle')}
          </span>
        </h2>

        <p className="mt-6 max-w-[960px] text-[1.6rem] leading-[1.65] text-white/95">
          {t('home.planDesc')}
        </p>

        <div className="mt-8">
          <Link
            to="/en/plan"
            className="zm-btn zm-btn-green-on-blue inline-flex items-center gap-3"
          >
            <span>
              {t('home.planCtaGuest')}
            </span>
            <SwiperArrowIcon className="zm-btn-arrow h-[14px] w-[9px]" />
          </Link>
        </div>

        <div className="mt-[80px]">
          <h3 className="text-[3.2rem] font-bold leading-tight text-white md:text-[4rem]">
            {t('home.nextSteps')}
            <span className="block text-[2.4rem] font-bold text-[#7fbb58] md:text-[2.8rem]">
              {t('home.nextStepsSub')}
            </span>
          </h3>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PLAN_STEPS.map((step, idx) => {
              const num = idx + 2
              return (
                <div key={step.title} className="step-card">
                  <h4 className="text-[2rem] font-semibold text-[#0c3a94]">
                    {t(`home.step${num}Title`, step.title)}
                  </h4>
                  <p className="mt-3 text-[1.4rem] leading-[1.55] text-[#555555]">
                    {t(`home.step${num}Desc`, step.description)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
