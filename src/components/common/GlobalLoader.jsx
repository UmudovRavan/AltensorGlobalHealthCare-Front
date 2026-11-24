import logoSvg from '../../assets/img/logo.svg'
import { BRAND } from '../../data/brand'

/**
 * Full-screen, fully opaque branded loading overlay for Altensor Healthcare.
 * Blocks underlying content until the application is ready and reveals smoothly.
 */
export default function GlobalLoader({ visible = true, exiting = false }) {
  if (!visible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={!exiting}
      aria-label={`${BRAND.name} is loading`}
      className={`alt-loader-overlay ${exiting ? 'is-exiting' : ''}`}
    >
      {/* Subtle architectural background ambient aura (fully opaque base underneath) */}
      <div className="alt-loader-aura" aria-hidden="true" />

      <div className="alt-loader-content">
        <div className="alt-loader-emblem">
          <img
            src={logoSvg}
            alt={BRAND.name}
            className="h-[120px] w-[120px] object-contain sm:h-[148px] sm:w-[148px] md:h-[168px] md:w-[168px]"
          />
        </div>

        <div className="alt-loader-wordmark">
          <span className="text-[2.4rem] font-black tracking-tight text-[#0c3a94] sm:text-[3.1rem]">
            ALTENSOR
          </span>
          <span className="mt-1 text-[1.15rem] font-bold uppercase tracking-[0.26em] text-[#7fbb58] sm:text-[1.35rem]">
            HEALTHCARE
          </span>
        </div>

        <div className="alt-loader-divider" aria-hidden="true" />

        <p className="alt-loader-tagline">
          Medical Excellence &amp; Healthcare Coordination
        </p>
      </div>
    </div>
  )
}
