import { Link } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'
import { SwiperArrowIcon } from '../common/ZagrebIcons'

export default function RefundSection() {
  const { t } = useTranslation()
  return (
    <section className="mt-[140px] md:mt-[200px]">
      <div className="zm-container">
        <div className="max-w-[780px]">
          <h2 className="text-[4.8rem] font-semibold leading-[1] text-[#0c3a94] md:text-[8.2rem]">
            {t('home.refundTitle')}
          </h2>
          <p className="mt-4 text-[1.6rem] leading-[1.65] text-[#555555]">
            {t('home.refundBody')}
          </p>
          <div className="mt-7">
            <Link
              to="/en/services/eu-patients"
              className="zm-btn zm-btn-green zm-btn-sm inline-flex items-center gap-2"
            >
              <span>{t('common.learnMore', 'Learn more')}</span>
              <SwiperArrowIcon className="zm-btn-arrow h-[12px] w-[8px]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

