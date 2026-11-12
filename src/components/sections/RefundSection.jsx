import { Link } from 'react-router-dom'
import { SwiperArrowIcon } from '../common/ZagrebIcons'

export default function RefundSection() {
  return (
    <section className="mt-[140px] md:mt-[200px]">
      <div className="zm-container">
        <div className="max-w-[780px]">
          <h2 className="text-[4.8rem] font-semibold leading-[1] text-[#0c3a94] md:text-[8.2rem]">
            EU Patients refund
          </h2>
          <h3 className="mt-4 text-[2.6rem] font-semibold text-[#0c3a94] md:text-[3.6rem]">
            Fill the survey
          </h3>
          <p className="mt-4 text-[1.6rem] leading-[1.65] text-[#555555]">
            European residents can now avoid the long waiting lists and get medical
            care in Zagreb in the best private clinics without any waiting time.
          </p>
          <div className="mt-7">
            <Link
              to="/en/services/eu-patients"
              className="zm-btn zm-btn-green zm-btn-sm inline-flex items-center gap-2"
            >
              <span>Find out more</span>
              <SwiperArrowIcon className="zm-btn-arrow h-[12px] w-[8px]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

