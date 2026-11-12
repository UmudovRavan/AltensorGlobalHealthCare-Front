import { useUI } from '../../hooks/useUI'
import { PLAN_STEPS } from '../../data/homeData'
import { SwiperArrowIcon } from '../common/ZagrebIcons'

export default function PlanSection() {
  const { openInquiry } = useUI()

  return (
    <section className="mt-[150px] w-full bg-[#3665f6] py-[90px] md:mt-[250px] md:py-[120px]">
      <div className="zm-container">
        <h2 className="text-[5.2rem] font-bold leading-none text-white md:text-[9rem]">
          Let&apos;s plan
          <span className="mt-2 block text-[2.6rem] font-bold text-[#7fbb58] md:text-[3.6rem]">
            your medical trip
          </span>
        </h2>

        <p className="mt-6 max-w-[960px] text-[1.6rem] leading-[1.65] text-white/95">
          Explore your medical treatment options with the leading medical facilities
          in Zagreb. Sending an inquiry is completely free and you will be put in
          touch directly with the relevant medical facilities. Choose the needed
          treatment, or in case you are not sure which treatment is right for you
          describe your symptoms and we will put you in touch with the clinic.
        </p>

        <div className="mt-8">
          <button
            type="button"
            onClick={() => openInquiry()}
            className="zm-btn zm-btn-green-on-blue inline-flex items-center gap-3"
          >
            <span>1. Send inquiry</span>
            <SwiperArrowIcon className="zm-btn-arrow h-[14px] w-[9px]" />
          </button>
        </div>

        <div className="mt-[80px]">
          <h3 className="text-[3.2rem] font-bold leading-tight text-white md:text-[4rem]">
            Your
            <span className="block text-[2.4rem] font-bold text-[#7fbb58] md:text-[2.8rem]">
              next steps
            </span>
          </h3>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PLAN_STEPS.map((step) => (
              <div key={step.title} className="step-card">
                <h4 className="text-[2rem] font-semibold text-[#0c3a94]">
                  {step.title}
                </h4>
                <p className="mt-3 text-[1.4rem] leading-[1.55] text-[#555555]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
