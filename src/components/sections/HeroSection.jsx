import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import slideVideo from '../../assets/Video/slideVideo.mp4'
import { useTranslation } from '../../hooks/useTranslation'

// Placeholder mobile video path — replace with a <3MB transcoded file when available
const MOBILE_VIDEO_SRC = slideVideo

export default function HeroSection() {
  const { t } = useTranslation()
  const videoRef = useRef(null)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const onResize = () => setIsMobile(mq.matches)
    mq.addEventListener?.('change', onResize)

    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => {
      if (reducedMq.matches) {
        videoRef.current?.pause()
      } else {
        videoRef.current?.play().catch(() => {})
      }
    }
    syncMotion()
    reducedMq.addEventListener?.('change', syncMotion)

    return () => {
      mq.removeEventListener?.('change', onResize)
      reducedMq.removeEventListener?.('change', syncMotion)
    }
  }, [])

  return (
    <section
      className="hero-video-overlay hero-section relative w-full overflow-hidden bg-[#051432]"
      aria-label="Altensor Global Healthcare Hero"
    >
      {/* Full-screen Background Video (decorative, shifted so airplane sits in upper-center/right sky) */}
      <video
        ref={videoRef}
        src={isMobile ? MOBILE_VIDEO_SRC : slideVideo}
        poster="/images/hero-poster.webp"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-[1.08] object-cover object-[65%_20%]"
      />

      {/* In-Flow Bottom-Left Editorial Block (never collides with fixed Header or upper airplane) */}
      <div className="relative z-[2] w-full md:max-w-[min(920px,60vw)]">
        <h1 className="hero-reveal hero-h1 text-white" style={{ animationDelay: '0s' }}>
          <span className="block">
            {t('home.heroVideoLine1', 'Dünya səviyyəli')}{' '}
            <span className="text-[#7fb4ff]">
              {t('home.heroVideoLine1Highlight', 'tibbi xidmət')}
            </span>
          </span>
          <span className="block">
            {t('home.heroVideoLine2', 'Bakıda, sizə özəl yanaşma')}
          </span>
        </h1>

        <p
          className="hero-reveal mt-[20px] max-w-[540px] leading-[1.55] text-white/80"
          style={{
            fontSize: 'clamp(16px, 1.3vw, 20px)',
            animationDelay: '0.15s',
          }}
        >
          {t(
            'home.heroVideoSub',
            'Azərbaycanda aparıcı tərəfdaş klinikalar, təcrübəli həkimlər və tam tibbi səyahət koordinasiyası.'
          )}
        </p>

        <div
          className="hero-reveal mt-[32px] flex flex-wrap items-center gap-6"
          style={{ animationDelay: '0.3s' }}
        >
          <Link
            to="/en/plan"
            className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/35 bg-white/[0.14] px-[32px] py-[16px] text-[1.55rem] font-semibold text-white backdrop-blur-[14px] transition-all duration-300 hover:bg-white hover:text-[#0a295b]"
          >
            {t('home.heroQuote', 'Pulsuz Təklif Alın')}
          </Link>

          <Link
            to="/en/clinics"
            className="group inline-flex items-center gap-2 text-[1.55rem] font-semibold text-white/90 transition-colors duration-300 hover:text-white"
          >
            <span>{t('home.heroClinicsLink', 'Klinikalara bax')}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Centered Scroll Indicator (only on >=768px wide AND >=800px tall) */}
      <div
        className="hero-scroll-indicator pointer-events-none absolute bottom-5 left-1/2 z-[2] -translate-x-1/2 flex-col items-center gap-1.5"
        aria-hidden="true"
      >
        <span className="text-[1rem] font-semibold tracking-[0.2em] text-white/60 uppercase">
          {t('home.heroScroll', 'Scroll')}
        </span>
        <span className="hero-scroll-line block h-5 w-[1.5px] rounded-full bg-white/75" />
      </div>
    </section>
  )
}
