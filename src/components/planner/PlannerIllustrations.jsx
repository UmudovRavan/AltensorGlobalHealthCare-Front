export function WorldMapWatermark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 600"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full object-cover opacity-[0.045]"
      preserveAspectRatio="xMidYMid slice"
    >
      <g fill="#0c3a94">
        <path d="M120 130c35-22 95-28 145-12 30 10 52 38 40 65-12 26-48 36-68 62-16 21-10 52-32 68-20 15-48 5-64-15-18-24-38-55-35-88 2-32-12-65 14-80z" />
        <path d="M250 340c28-14 68-4 85 24 18 28 24 68 8 102-14 30-42 62-62 56-18-5-26-42-34-72-10-36-22-96 3-110z" />
        <path d="M510 110c42-18 98-14 140 8 28 15 44 45 28 68-15 22-48 20-76 26-34 8-68 24-96 10-28-14-30-98 4-112z" />
        <path d="M530 245c36-12 82 2 104 34 22 32 16 78-6 112-20 30-50 48-74 36-24-12-26-54-32-88-6-36-20-84 8-94z" />
        <path d="M680 120c68-26 168-22 238 14 48 24 72 72 48 110-22 35-72 34-114 48-42 14-74 44-112 36-38-8-64-56-72-98-8-40-36-92 12-110z" />
        <path d="M900 370c34-16 78-6 96 22 18 28 6 66-22 82-28 16-66 6-84-20-18-26-24-68 10-84z" />
      </g>
    </svg>
  )
}

export function CategoryIllustration({ id }) {
  switch (id) {
    case 'hair-transplant':
      return (
        <svg viewBox="0 0 128 112" className="h-[96px] w-[112px]" aria-hidden="true">
          <defs>
            <radialGradient id="ht-shadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="ht-scalp-top" cx="42%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#fde0cb" />
              <stop offset="55%" stopColor="#ecc0a1" />
              <stop offset="100%" stopColor="#cf9673" />
            </radialGradient>
            <linearGradient id="ht-scalp-rim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dfa785" />
              <stop offset="100%" stopColor="#b57756" />
            </linearGradient>
            <linearGradient id="ht-pen-body" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="30%" stopColor="#f1f5f9" />
              <stop offset="60%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <linearGradient id="ht-pen-tip" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
          </defs>
          {/* Soft floor shadow */}
          <ellipse cx="60" cy="88" rx="44" ry="12" fill="url(#ht-shadow)" />
          {/* 3D Scalp base */}
          <path d="M18 70 a42 18 0 0 0 84 0 v6 a42 18 0 0 1 -84 0 z" fill="url(#ht-scalp-rim)" />
          <ellipse cx="60" cy="70" rx="42" ry="18" fill="url(#ht-scalp-top)" />
          {/* Pores */}
          <g fill="#b57756" opacity="0.5">
            <ellipse cx="34" cy="70" rx="1.6" ry="0.9" />
            <ellipse cx="48" cy="76" rx="1.6" ry="0.9" />
            <ellipse cx="62" cy="73" rx="1.8" ry="1" />
            <ellipse cx="75" cy="76" rx="1.6" ry="0.9" />
            <ellipse cx="86" cy="70" rx="1.5" ry="0.8" />
            <ellipse cx="42" cy="63" rx="1.5" ry="0.8" />
            <ellipse cx="71" cy="63" rx="1.5" ry="0.8" />
          </g>
          {/* Realistic curved hair strands */}
          <g fill="none" stroke="#1e1b18" strokeWidth="1.7" strokeLinecap="round">
            <path d="M34 70 q-4-11 -1-19" />
            <path d="M42 63 q-2-10 1-17" />
            <path d="M48 76 q-2-12 2-20" />
            <path d="M71 63 q2-11 5-18" />
            <path d="M75 76 q3-11 6-19" />
            <path d="M86 70 q4-10 6-16" />
          </g>
          {/* 3D Metallic Choi Implanter Pen */}
          <g transform="translate(86, 12) rotate(32)">
            <rect x="0" y="0" width="12" height="6" rx="2" fill="#475569" />
            <rect x="2" y="6" width="8" height="4" fill="#94a3b8" />
            <rect x="-1" y="10" width="14" height="32" rx="3" fill="url(#ht-pen-body)" />
            <rect x="1.5" y="42" width="9" height="8" rx="1.5" fill="url(#ht-pen-tip)" />
            <rect x="4" y="50" width="4" height="8" rx="1" fill="#64748b" />
            <line x1="6" y1="58" x2="6" y2="70" stroke="#475569" strokeWidth="1.5" />
          </g>
        </svg>
      )

    case 'dental':
      return (
        <svg viewBox="0 0 128 112" className="h-[96px] w-[112px]" aria-hidden="true">
          <defs>
            <radialGradient id="dt-shadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="dt-gum" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f9a8a8" />
              <stop offset="45%" stopColor="#e57373" />
              <stop offset="100%" stopColor="#c64b4b" />
            </linearGradient>
            <linearGradient id="dt-bone" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <linearGradient id="dt-titanium" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="30%" stopColor="#cbd5e1" />
              <stop offset="55%" stopColor="#f8fafc" />
              <stop offset="80%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <radialGradient id="dt-crown" cx="38%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </radialGradient>
          </defs>
          <ellipse cx="64" cy="98" rx="38" ry="8" fill="url(#dt-shadow)" />
          {/* 3D Gum & Bone block */}
          <path d="M28 60 q36-9 72 0 v26 c0 6-14 11-36 11 s-36-5-36-11 z" fill="url(#dt-gum)" />
          <path d="M35 66 q29-6 58 0 v18 c0 4-12 8-29 8 s-29-4-29-8 z" fill="url(#dt-bone)" opacity="0.9" />
          {/* Titanium Implant Screw */}
          <path d="M55 52 h18 l-2 36 c0 3-14 3-14 0 z" fill="url(#dt-titanium)" />
          <g stroke="#334155" strokeWidth="1.4" opacity="0.75">
            <line x1="55" y1="58" x2="73" y2="60" />
            <line x1="55" y1="64" x2="73" y2="66" />
            <line x1="56" y1="70" x2="72" y2="72" />
            <line x1="56" y1="76" x2="72" y2="78" />
            <line x1="57" y1="82" x2="71" y2="84" />
          </g>
          {/* Glossy 3D Tooth Crown */}
          <path
            d="M41 28 c0-11 10-16 23-12 c13-4 23 1 23 12 c0 12-4 21-8 25 c-2 2-8 3-15 3 s-13-1-15-3 c-4-4-8-13-8-25z"
            fill="url(#dt-crown)"
            stroke="#cbd5e1"
            strokeWidth="1.2"
          />
          <ellipse cx="54" cy="24" rx="5" ry="9" fill="#ffffff" opacity="0.85" />
        </svg>
      )

    case 'cosmetic':
      return (
        <svg viewBox="0 0 128 112" className="h-[96px] w-[112px]" aria-hidden="true">
          <defs>
            <radialGradient id="cs-shadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="cs-face" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="60%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <linearGradient id="cs-scalpel" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>
          <ellipse cx="64" cy="96" rx="34" ry="8" fill="url(#cs-shadow)" />
          {/* 3D Sculpted Face Profile */}
          <path
            d="M40 18 c22 0 36 14 36 32 c0 5 4 9 5 13 c1 3-3 5-5 7 c1 3 2 5 0 8 c-2 3-7 5-10 8 c-4 4-10 6-20 6 c-8 0-12-8-12-22 c0-22-6-52 6-52z"
            fill="url(#cs-face)"
            stroke="#94a3b8"
            strokeWidth="1.4"
          />
          {/* Ear detail */}
          <path d="M44 48 c-4 0-6 6-4 12 c2 5 6 4 7 1" fill="none" stroke="#94a3b8" strokeWidth="1.4" />
          {/* Surgical Contour Markings */}
          <path
            d="M49 40 q14 14 7 34"
            fill="none"
            stroke="#3665f6"
            strokeWidth="1.8"
            strokeDasharray="3.5 3.5"
            strokeLinecap="round"
          />
          <path
            d="M58 55 q10 2 14 0"
            fill="none"
            stroke="#7fbb58"
            strokeWidth="1.4"
            strokeDasharray="2.5 2.5"
            strokeLinecap="round"
          />
          {/* 3D Surgical Scalpel */}
          <g transform="translate(80, 62) rotate(-42)">
            <rect x="0" y="0" width="38" height="6" rx="2.5" fill="url(#cs-scalpel)" />
            <path d="M0 1 l-13 3.5 c3 1.5 8 1.5 13 0.5 z" fill="#f8fafc" stroke="#64748b" strokeWidth="0.9" />
          </g>
        </svg>
      )

    case 'eye':
      return (
        <svg viewBox="0 0 128 112" className="h-[96px] w-[112px]" aria-hidden="true">
          <defs>
            <radialGradient id="ey-shadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="ey-sclera" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="75%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </radialGradient>
            <radialGradient id="ey-iris" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="55%" stopColor="#0369a1" />
              <stop offset="100%" stopColor="#0c3a94" />
            </radialGradient>
          </defs>
          <ellipse cx="64" cy="90" rx="38" ry="8" fill="url(#ey-shadow)" />
          {/* Eye outer contour */}
          <path
            d="M16 54 q48-34 96 0 q-48 34-96 0 z"
            fill="url(#ey-sclera)"
            stroke="#94a3b8"
            strokeWidth="1.6"
          />
          {/* Eyelashes */}
          <g stroke="#334155" strokeWidth="1.3" strokeLinecap="round">
            <line x1="30" y1="42" x2="26" y2="36" />
            <line x1="42" y1="36" x2="39" y2="29" />
            <line x1="56" y1="33" x2="55" y2="26" />
            <line x1="72" y1="33" x2="73" y2="26" />
            <line x1="86" y1="36" x2="89" y2="29" />
            <line x1="98" y1="42" x2="102" y2="36" />
          </g>
          {/* Detailed Iris */}
          <circle cx="64" cy="54" r="20" fill="url(#ey-iris)" />
          <circle cx="64" cy="54" r="16" fill="none" stroke="#7dd3fc" strokeWidth="1" strokeDasharray="1.5 2.5" opacity="0.7" />
          {/* Pupil */}
          <circle cx="64" cy="54" r="8.5" fill="#090d16" />
          {/* Glossy corneal reflections */}
          <circle cx="70" cy="48" r="3.5" fill="#ffffff" opacity="0.9" />
          <circle cx="57" cy="60" r="1.6" fill="#ffffff" opacity="0.6" />
          {/* Glowing Green Laser Beam */}
          <line x1="28" y1="18" x2="64" y2="54" stroke="#4ade80" strokeWidth="4.5" strokeLinecap="round" opacity="0.35" />
          <line x1="28" y1="18" x2="64" y2="54" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
          <circle cx="64" cy="54" r="4" fill="#4ade80" opacity="0.55" />
        </svg>
      )

    case 'weight-loss':
      return (
        <svg viewBox="0 0 128 112" className="h-[96px] w-[112px]" aria-hidden="true">
          <defs>
            <radialGradient id="wl-shadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="wl-stomach" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fecaca" />
              <stop offset="45%" stopColor="#ea8c7a" />
              <stop offset="100%" stopColor="#b95443" />
            </radialGradient>
            <radialGradient id="wl-balloon" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="45%" stopColor="#93c5fd" />
              <stop offset="100%" stopColor="#3b82f6" />
            </radialGradient>
          </defs>
          <ellipse cx="64" cy="96" rx="36" ry="8" fill="url(#wl-shadow)" />
          {/* 3D Anatomical Stomach */}
          <path
            d="M46 14 v16 c0 8-16 14-16 32 c0 18 14 27 33 25 c22-2 32-16 32-30 c0-15-12-23-24-23 c-7 0-11-4-11-11 v-9 z"
            fill="url(#wl-stomach)"
            stroke="#a84839"
            strokeWidth="1.4"
          />
          {/* Subtle stomach specular highlight */}
          <path
            d="M37 56 c0-10 7-16 12-18"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.35"
          />
          {/* 3D Translucent Gastric Balloon */}
          <circle cx="65" cy="58" r="15" fill="url(#wl-balloon)" opacity="0.9" stroke="#2563eb" strokeWidth="1.2" />
          <ellipse cx="60" cy="52" rx="5" ry="3" transform="rotate(-25 60 52)" fill="#ffffff" opacity="0.8" />
        </svg>
      )

    case 'ivf':
      return (
        <svg viewBox="0 0 128 112" className="h-[96px] w-[112px]" aria-hidden="true">
          <defs>
            <radialGradient id="ivf-shadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="ivf-dish" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <radialGradient id="ivf-cell" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="55%" stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#0284c7" />
            </radialGradient>
          </defs>
          <ellipse cx="60" cy="86" rx="42" ry="12" fill="url(#ivf-shadow)" />
          {/* 3D Glass Petri Dish */}
          <path d="M20 62 a40 19 0 0 0 80 0 v8 a40 19 0 0 1 -80 0 z" fill="#cbd5e1" opacity="0.7" />
          <ellipse cx="60" cy="62" rx="40" ry="19" fill="url(#ivf-dish)" stroke="#94a3b8" strokeWidth="1.5" />
          <ellipse cx="60" cy="62" rx="34" ry="15" fill="#eef6ff" opacity="0.8" />
          {/* 3D Embryo Morula Cluster */}
          <g>
            <circle cx="54" cy="60" r="7.5" fill="url(#ivf-cell)" />
            <circle cx="65" cy="60" r="7.5" fill="url(#ivf-cell)" />
            <circle cx="59" cy="53" r="7" fill="url(#ivf-cell)" />
            <circle cx="59" cy="66" r="7" fill="url(#ivf-cell)" />
            <circle cx="59" cy="59" r="5" fill="#bae6fd" opacity="0.8" />
          </g>
          {/* Glass Micropipette */}
          <line x1="106" y1="16" x2="70" y2="54" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
          <line x1="106" y1="16" x2="70" y2="54" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )

    case 'checkup':
    default:
      return (
        <svg viewBox="0 0 128 112" className="h-[96px] w-[112px]" aria-hidden="true">
          <defs>
            <radialGradient id="cu-shadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="cu-card" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
          </defs>
          <ellipse cx="64" cy="94" rx="36" ry="8" fill="url(#cu-shadow)" />
          <rect x="28" y="18" width="72" height="68" rx="14" fill="url(#cu-card)" stroke="#cbd5e1" strokeWidth="1.5" />
          <circle cx="64" cy="52" r="22" fill="#eef3ff" />
          <path d="M64 38 v28 M50 52 h28" stroke="#7fbb58" strokeWidth="7" strokeLinecap="round" />
        </svg>
      )
  }
}

export function HairGraftDiagram({ level }) {
  const thinningRadius = level === 1 ? 8 : level === 2 ? 13 : level === 3 ? 18 : 23
  return (
    <svg viewBox="0 0 80 80" className="h-[64px] w-[64px]" aria-hidden="true">
      <ellipse cx="40" cy="42" rx="24" ry="28" fill="#f3d4be" stroke="#d4a382" strokeWidth="1.5" />
      <path
        d="M18 45 c0-20 12-30 22-30 s22 10 22 30 c0 12-8 22-22 22 s-22-10-22-22z"
        fill="#334155"
      />
      <ellipse cx="40" cy="34" rx={thinningRadius * 0.8} ry={thinningRadius} fill="#f3d4be" />
      <circle cx="40" cy="34" r={thinningRadius * 0.45} fill="#e8be9e" opacity="0.6" />
    </svg>
  )
}

export function HairTechniqueIcon({ id }) {
  return (
    <svg viewBox="0 0 60 60" className="h-[46px] w-[46px] shrink-0" aria-hidden="true">
      <circle cx="30" cy="30" r="26" fill="#eef3ff" />
      {id === 'fue' && (
        <g stroke="#0c3a94" strokeWidth="2.2" strokeLinecap="round">
          <line x1="20" y1="38" x2="20" y2="24" />
          <line x1="30" y1="38" x2="30" y2="20" />
          <line x1="40" y1="38" x2="40" y2="24" />
          <circle cx="30" cy="42" r="3" fill="#7fbb58" stroke="none" />
        </g>
      )}
      {id === 'sapphire-fue' && (
        <polygon points="30,14 42,28 30,46 18,28" fill="#3665f6" opacity="0.85" />
      )}
      {id === 'dhi' && (
        <g transform="translate(26, 12) rotate(25)">
          <rect x="0" y="0" width="8" height="26" rx="3" fill="#0c3a94" />
          <line x1="4" y1="26" x2="4" y2="36" stroke="#7fbb58" strokeWidth="2.4" />
        </g>
      )}
      {id === 'beard-eyebrow' && (
        <path
          d="M16 32 q14 14 28 0"
          fill="none"
          stroke="#0c3a94"
          strokeWidth="4"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}

export function ToothButton({ toothNumber, treatments, onToggle, treatmentTypes }) {
  const isSelected = treatments.length > 0
  const primaryTreatment = isSelected
    ? treatmentTypes.find((t) => t.id === treatments[0])
    : null

  return (
    <button
      type="button"
      onClick={() => onToggle(toothNumber)}
      title={`Tooth ${toothNumber}${isSelected ? ` (${treatments.join(', ')})` : ''}`}
      className={`group relative flex h-[54px] w-[34px] cursor-pointer flex-col items-center justify-between rounded-[8px] border p-1 transition-all sm:h-[60px] sm:w-[38px] ${
        isSelected
          ? 'shadow-sm'
          : 'border-[#dce4f5] bg-white hover:border-[#3665f6] hover:bg-[#f6f9ff]'
      }`}
      style={
        isSelected && primaryTreatment
          ? {
              borderColor: primaryTreatment.borderColor,
              backgroundColor: primaryTreatment.bgLight,
            }
          : undefined
      }
    >
      <svg viewBox="0 0 28 32" className="h-[26px] w-[22px]" aria-hidden="true">
        <path
          d="M6 6 c0-3 4-4 8-2 c4-2 8-1 8 2 c0 6-2 10-3 14 c-1 5-2 9-3 9 s-2-5-2-7 c0 2-1 7-2 7 s-2-4-3-9 c-1-4-3-8-3-14z"
          fill={isSelected && primaryTreatment ? primaryTreatment.color : '#f1f5f9'}
          stroke={isSelected && primaryTreatment ? primaryTreatment.borderColor : '#94a3b8'}
          strokeWidth="1.5"
        />
      </svg>
      <span
        className={`text-[1.05rem] font-bold leading-none ${
          isSelected ? 'text-[#0a295b]' : 'text-[#555555]'
        }`}
      >
        {toothNumber}
      </span>
      {treatments.length > 1 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0c3a94] text-[0.9rem] font-bold text-white">
          {treatments.length}
        </span>
      )}
    </button>
  )
}
