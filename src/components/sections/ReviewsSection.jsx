import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { PATIENT_REVIEWS } from '../../data/homeData'
import { useTranslation } from '../../hooks/useTranslation'
import {
  StarGoldIcon,
  SwiperArrowIcon,
  VerifiedBadgeIcon,
} from '../common/ZagrebIcons'

export default function ReviewsSection() {
  const swiperRef = useRef(null)
  const { t } = useTranslation()

  return (
    <section className="mt-[120px] md:mt-[180px]">
      <div className="zm-container">
        <h2 className="text-[3.6rem] font-semibold leading-[1.15] text-[#0c3a94] md:text-[5rem]">
          {t('home.reviewsTitle')}
        </h2>

        <div className="mt-10">
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper
            }}
            slidesPerView={1}
            loop
            className="w-full"
          >
            {PATIENT_REVIEWS.map((review) => (
              <SwiperSlide key={review.id}>
                <div className="py-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-[2rem] font-bold text-[#0a295b]">
                      {review.author}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 text-[1.3rem] font-semibold text-[#22d698]">
                      <VerifiedBadgeIcon />
                      <span>{t('services.verifiedPatient', 'Verified patient')}</span>
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <StarGoldIcon key={i} />
                      ))}
                    </div>
                    <span className="text-[1.2rem] font-semibold text-[#666666]">
                      Review from{' '}
                      <span className="text-[#3665f6]">Google</span>
                    </span>
                  </div>

                  <div className="mt-3 space-y-1 text-[1.4rem] text-[#555555]">
                    {review.doctor && (
                      <p>
                        Doctor:{' '}
                        <Link
                          to={review.doctorTo}
                          className="font-semibold text-[#3665f6] hover:underline"
                        >
                          {review.doctor}
                        </Link>
                      </p>
                    )}
                    <p>
                      Procedure:{' '}
                      <Link
                        to={review.procedureTo}
                        className="font-semibold text-[#3665f6] hover:underline"
                      >
                        {review.procedure}
                      </Link>
                    </p>
                    <p>
                      Hospital:{' '}
                      <Link
                        to={review.hospitalTo}
                        className="font-semibold text-[#3665f6] hover:underline"
                      >
                        {review.hospital}
                      </Link>
                    </p>
                  </div>

                  <p className="mt-5 max-w-[1150px] text-[1.6rem] leading-[1.65] text-[#555555]">
                    {review.text}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="mt-8 flex items-center justify-between">
            <Link
              to="/en/patient-reviews"
              className="zm-btn zm-btn-green zm-btn-sm inline-flex items-center gap-2"
            >
              <span>View all</span>
              <SwiperArrowIcon className="zm-btn-arrow h-[12px] w-[8px]" />
            </Link>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                aria-label="Previous review"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#e8e8e8] text-[#0c3a94] transition-colors duration-300 hover:border-[#3665f6] hover:text-[#3665f6]"
              >
                <SwiperArrowIcon className="h-[15px] w-[10px] rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                aria-label="Next review"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#e8e8e8] text-[#0c3a94] transition-colors duration-300 hover:border-[#3665f6] hover:text-[#3665f6]"
              >
                <SwiperArrowIcon className="h-[15px] w-[10px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

