import { Link } from 'react-router-dom'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useUI } from '../../hooks/useUI'
import { HERO_SLIDES } from '../../data/homeData'

export default function HeroSection() {
  const { openInquiry } = useUI()

  return (
    <section className="relative h-[calc(100vh-70px)] min-h-[580px] max-h-[780px] w-full overflow-hidden bg-white">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="hero-swiper h-full w-full"
      >
        {HERO_SLIDES.map((slide) => (
          <SwiperSlide key={slide.id} className="relative h-full w-full bg-white">
            {/* Right-aligned hero photo */}
            <div className="absolute inset-y-0 right-0 w-full md:left-[30%] md:w-[70%]">
              <img
                src={slide.image}
                alt={slide.titleLines.map((l) => l.text).join(' ')}
                className="h-full w-full object-cover object-center"
              />
            </div>

            {/* White-to-transparent horizontal overlay */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, #ffffff 0%, #ffffff 40%, rgba(255,255,255,0) 68%, rgba(255,255,255,0) 100%)',
              }}
            />
            {/* Mobile subtle readability scrim */}
            <div className="pointer-events-none absolute inset-0 bg-white/70 md:hidden" />

            {/* Content Container */}
            <div className="zm-container relative z-10 flex h-full items-center">
              <div className="max-w-[590px] py-10">
                <h1 className="text-[3.8rem] font-bold leading-[1.1] tracking-tight text-[#0c3a94] sm:text-[5rem] lg:text-[6.2rem]">
                  {slide.titleLines.map((line, idx) => (
                    <span
                      key={idx}
                      className={`block ${
                        line.highlight ? 'text-[#3665f6]' : 'text-[#0c3a94]'
                      }`}
                    >
                      {line.text}
                    </span>
                  ))}
                </h1>

                <h3 className="mt-5 max-w-[490px] text-[1.6rem] font-semibold leading-[1.6] text-[#0c3a94]">
                  {slide.subtitle}
                </h3>

                <div className="mt-8">
                  {slide.ctaType === 'inquiry' ? (
                    <button
                      type="button"
                      onClick={() => openInquiry()}
                      className="zm-btn zm-btn-green"
                    >
                      <span>{slide.ctaLabel}</span>
                    </button>
                  ) : (
                    <Link to={slide.ctaTo} className="zm-btn zm-btn-green">
                      <span>{slide.ctaLabel}</span>
                    </Link>
                  )}
                </div>

                {slide.logos.length > 0 && (
                  <div className="mt-9 flex flex-wrap items-center gap-6">
                    {slide.logos.map((logo) => (
                      <img
                        key={logo.src}
                        src={logo.src}
                        alt={logo.alt}
                        className="h-[34px] w-auto object-contain opacity-95 md:h-[40px]"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
