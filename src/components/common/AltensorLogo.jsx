import logoSvg from '../../assets/img/logo.svg'

export default function AltensorLogo({ compact = false, className = '' }) {
  if (compact) {
    return (
      <img
        src={logoSvg}
        alt="Altensor Global Healthcare"
        className={`h-[42px] w-[42px] object-contain ${className}`}
      />
    )
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <img
        src={logoSvg}
        alt="Altensor Global Healthcare"
        className="h-[58px] w-[58px] shrink-0 object-contain"
      />
      <div className="hidden flex-col leading-none xl:flex">
        <span className="text-[1.6rem] font-black tracking-tight text-[#0c3a94]">
          ALTENSOR
        </span>
        <span className="text-[0.95rem] font-bold tracking-[0.14em] text-[#7fbb58] uppercase">
          HEALTHCARE
        </span>
      </div>
    </div>
  )
}
