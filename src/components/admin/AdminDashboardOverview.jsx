import {
  Activity,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Euro,
  FileText,
  Plus,
  Stethoscope,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from '../../hooks/useTranslation'

const STATUS_COLORS = {
  Submitted: '#3665f6',
  'In Review': '#8b5cf6',
  Processing: '#f59e0b',
  'Offer Received': '#06b6d4',
  Accepted: '#7fbb58',
  Declined: '#ef4444',
  Closed: '#64748b',
  Cancelled: '#94a3b8',
}

function getStatusBadgeClass(statusText = '') {
  const s = statusText.toLowerCase()
  if (s.includes('accept') || s.includes('qəbul')) {
    return 'bg-[#ecfdf3] text-[#15803d] border-[#bbf7d0]'
  }
  if (s.includes('offer') || s.includes('təklif')) {
    return 'bg-[#ecfeff] text-[#0e7490] border-[#a5f3fc]'
  }
  if (s.includes('process') || s.includes('review')) {
    return 'bg-[#fefce8] text-[#a16207] border-[#fde68a]'
  }
  if (s.includes('declin') || s.includes('cancel')) {
    return 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]'
  }
  return 'bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]'
}

function InteractiveDonutChart({ title, subtitle, segments, centerValue, centerLabel }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)

  const total = segments.reduce((sum, seg) => sum + seg.value, 0)
  const size = 188
  const strokeWidth = 24
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  let cumulativePercent = 0
  const arcs = segments
    .filter((s) => s.value > 0)
    .map((seg, idx) => {
      const percent = total > 0 ? seg.value / total : 0
      const dashLength = percent * circumference
      const gap = segments.filter((s) => s.value > 0).length > 1 ? 3 : 0
      const visibleDash = Math.max(0, dashLength - gap)
      const offset = -cumulativePercent * circumference
      cumulativePercent += percent
      return {
        ...seg,
        idx,
        percent: Math.round(percent * 100),
        dashArray: `${visibleDash} ${circumference - visibleDash}`,
        dashOffset: offset,
      }
    })

  const activeSeg = hoveredIdx !== null ? arcs.find((a) => a.idx === hoveredIdx) : null

  return (
    <div className="flex flex-col justify-between rounded-[16px] border border-[#e5ecf6] bg-white p-6 shadow-xs transition-shadow hover:shadow-md">
      <div>
        <h3 className="text-[1.75rem] font-bold text-[#0c3a94]">{title}</h3>
        <p className="mt-0.5 text-[1.25rem] text-[#64748b]">{subtitle}</p>
      </div>

      <div className="my-5 flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90 transform">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#eef2f8"
              strokeWidth={strokeWidth}
            />
            {arcs.map((arc) => {
              const isHovered = hoveredIdx === arc.idx
              return (
                <circle
                  key={arc.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={arc.color}
                  strokeWidth={isHovered ? strokeWidth + 5 : strokeWidth}
                  strokeDasharray={arc.dashArray}
                  strokeDashoffset={arc.dashOffset}
                  strokeLinecap="round"
                  className="cursor-pointer transition-all duration-300"
                  style={{
                    opacity: hoveredIdx !== null && !isHovered ? 0.45 : 1,
                  }}
                  onMouseEnter={() => setHoveredIdx(arc.idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              )
            })}
          </svg>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <span className="text-[2.6rem] leading-none font-extrabold text-[#0c3a94]">
              {activeSeg ? `${activeSeg.percent}%` : centerValue}
            </span>
            <span className="mt-1.5 max-w-[110px] truncate text-[1.15rem] font-semibold text-[#64748b]">
              {activeSeg ? `${activeSeg.label} (${activeSeg.value})` : centerLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 border-t border-[#f1f5f9] pt-4">
        {segments.map((seg, idx) => {
          const pct = total > 0 ? Math.round((seg.value / total) * 100) : 0
          return (
            <div
              key={seg.label}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="flex cursor-pointer items-center justify-between rounded-[8px] px-2 py-1 text-[1.25rem] transition-colors hover:bg-[#f8faff]"
            >
              <span className="flex items-center gap-2 font-medium text-[#334155]">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: seg.color }}
                />
                {seg.label}
              </span>
              <span className="font-bold text-[#0c3a94]">
                {seg.value}{' '}
                <span className="text-[1.1rem] font-medium text-[#94a3b8]">({pct}%)</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function AdminDashboardOverview({
  dashboard,
  inquiries,
  onNavigateTab,
  onOpenManageInquiry,
  onOpenCreateClinic,
  onOpenCreateDoctor,
}) {
  const { t } = useTranslation()
  const totalInquiries = dashboard?.totalInquiries ?? 0
  const activeInquiries = dashboard?.activeInquiries ?? 0
  const totalOffers = dashboard?.totalOffers ?? 0
  const acceptedOffers = dashboard?.acceptedOffers ?? 0
  const pendingOffers = Math.max(0, totalOffers - acceptedOffers)
  const offerAcceptanceRate =
    totalOffers > 0 ? Math.round((acceptedOffers / totalOffers) * 100) : 0
  const activeRatio =
    totalInquiries > 0 ? Math.round((activeInquiries / totalInquiries) * 100) : 0

  // Build status breakdown from inquiries list (or recentInquiries fallback)
  const sourceInquiries =
    Array.isArray(inquiries) && inquiries.length > 0
      ? inquiries
      : dashboard?.recentInquiries || []

  const statusCounts = sourceInquiries.reduce((acc, item) => {
    const key = item.statusText || 'Submitted'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  const statusSegments = Object.entries(statusCounts).map(([label, value], i) => ({
    label,
    value,
    color:
      STATUS_COLORS[label] ||
      ['#3665f6', '#7fbb58', '#f59e0b', '#06b6d4', '#8b5cf6'][i % 5],
  }))

  if (statusSegments.length === 0) {
    statusSegments.push({ label: t('admin.overview.noInquiriesYet'), value: 1, color: '#cbd5e1' })
  }

  const offerSegments =
    totalOffers > 0
      ? [
          { label: t('admin.overview.acceptedOffersLabel'), value: acceptedOffers, color: '#7fbb58' },
          { label: t('admin.overview.pendingOffersLabel'), value: pendingOffers, color: '#3665f6' },
        ]
      : [{ label: t('admin.overview.noOffersSent'), value: 1, color: '#cbd5e1' }]

  const kpiCards = [
    {
      label: t('admin.overview.totalInquiries'),
      value: totalInquiries,
      sub: `${activeInquiries} ${t('admin.overview.activeSub')}`,
      icon: FileText,
      iconBg: 'bg-[#eef3ff] text-[#3665f6]',
      valueColor: 'text-[#0c3a94]',
    },
    {
      label: t('admin.overview.registeredPatients'),
      value: dashboard?.totalPatients ?? 0,
      sub: t('admin.overview.verifiedAccounts'),
      icon: Users,
      iconBg: 'bg-[#f3e8ff] text-[#7e22ce]',
      valueColor: 'text-[#0c3a94]',
    },
    {
      label: t('admin.overview.partnerNetwork'),
      value: `${dashboard?.totalClinics ?? 0} / ${dashboard?.totalDoctors ?? 0}`,
      sub: t('admin.overview.clinicsDoctorsSub'),
      icon: Building2,
      iconBg: 'bg-[#ecfeff] text-[#0891b2]',
      valueColor: 'text-[#0c3a94]',
    },
    {
      label: t('admin.overview.acceptedVolume'),
      value: `€ ${(dashboard?.totalAcceptedVolume || 0).toLocaleString()}`,
      sub: `${acceptedOffers} / ${totalOffers} ${t('admin.overview.offersAccepted')}`,
      icon: Euro,
      iconBg: 'bg-[#ecfdf3] text-[#16a34a]',
      valueColor: 'text-[#7fbb58]',
    },
  ]

  const networkBars = [
    {
      label: t('admin.overview.activeInquiryRate'),
      value: `${activeRatio}%`,
      percent: activeRatio,
      color: '#3665f6',
      icon: Activity,
    },
    {
      label: t('admin.overview.offerAcceptanceRate'),
      value: `${offerAcceptanceRate}%`,
      percent: offerAcceptanceRate,
      color: '#7fbb58',
      icon: CheckCircle2,
    },
    {
      label: t('admin.overview.doctorCoverage'),
      value: `${dashboard?.totalDoctors ?? 0} / ${dashboard?.totalClinics ?? 0}`,
      percent: Math.min(
        100,
        dashboard?.totalClinics
          ? Math.round(((dashboard?.totalDoctors || 0) / (dashboard.totalClinics * 3)) * 100)
          : 0
      ),
      color: '#06b6d4',
      icon: Stethoscope,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Executive Welcome Banner */}
      <div className="relative overflow-hidden rounded-[18px] bg-gradient-to-r from-[#0c3a94] via-[#1748ad] to-[#2b62e8] p-7 text-white shadow-lg">
        <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-[#7fbb58]/20 blur-2xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-[1.15rem] font-semibold tracking-wide uppercase backdrop-blur-xs">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#7fbb58]" />
              {t('admin.overview.badge')}
            </span>
            <h2 className="mt-3 text-[2.6rem] leading-tight font-extrabold">
              {t('admin.overview.title')}
            </h2>
            <p className="mt-1.5 max-w-[600px] text-[1.4rem] text-white/85">
              {t('admin.overview.subtitle')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenCreateClinic}
              className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] bg-white/15 px-4 py-2.5 text-[1.35rem] font-semibold text-white ring-1 ring-white/25 transition-colors hover:bg-white/25"
            >
              <Plus className="h-4 w-4" /> {t('admin.overview.addClinic')}
            </button>
            <button
              type="button"
              onClick={onOpenCreateDoctor}
              className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] bg-white/15 px-4 py-2.5 text-[1.35rem] font-semibold text-white ring-1 ring-white/25 transition-colors hover:bg-white/25"
            >
              <Plus className="h-4 w-4" /> {t('admin.overview.addDoctor')}
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('inquiries')}
              className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] bg-[#7fbb58] px-5 py-2.5 text-[1.35rem] font-bold text-white shadow-sm transition-colors hover:bg-[#6ea849]"
            >
              {t('admin.overview.manageInquiries')} <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="rounded-[16px] border border-[#e5ecf6] bg-white p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[1.2rem] font-bold tracking-wider text-[#64748b] uppercase">
                    {card.label}
                  </p>
                  <p className={`mt-2 text-[3rem] leading-tight font-extrabold ${card.valueColor}`}>
                    {card.value}
                  </p>
                </div>
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] ${card.iconBg}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-[1.25rem] font-medium text-[#64748b]">
                <TrendingUp className="h-3.5 w-3.5 text-[#7fbb58]" />
                {card.sub}
              </p>
            </div>
          )
        })}
      </div>

      {/* Donut Charts & Pipeline Analytics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <InteractiveDonutChart
          title={t('admin.overview.statusDonutTitle')}
          subtitle={t('admin.overview.statusDonutSub')}
          segments={statusSegments}
          centerValue={sourceInquiries.length}
          centerLabel={t('admin.overview.trackedInquiries')}
        />

        <InteractiveDonutChart
          title={t('admin.overview.offerDonutTitle')}
          subtitle={t('admin.overview.offerDonutSub')}
          segments={offerSegments}
          centerValue={`${offerAcceptanceRate}%`}
          centerLabel={t('admin.overview.acceptanceRate')}
        />

        {/* Operational Health & Capacity Card */}
        <div className="flex flex-col justify-between rounded-[16px] border border-[#e5ecf6] bg-white p-6 shadow-xs transition-shadow hover:shadow-md">
          <div>
            <h3 className="text-[1.75rem] font-bold text-[#0c3a94]">
              {t('admin.overview.perfTitle')}
            </h3>
            <p className="mt-0.5 text-[1.25rem] text-[#64748b]">
              {t('admin.overview.perfSub')}
            </p>

            <div className="mt-6 space-y-5">
              {networkBars.map((bar) => {
                const BarIcon = bar.icon
                return (
                  <div key={bar.label}>
                    <div className="mb-1.5 flex items-center justify-between text-[1.3rem]">
                      <span className="flex items-center gap-2 font-semibold text-[#0a295b]">
                        <BarIcon className="h-4 w-4 text-[#3665f6]" />
                        {bar.label}
                      </span>
                      <span className="font-bold text-[#0c3a94]">{bar.value}</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-[#eef2f8]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(4, bar.percent)}%`,
                          backgroundColor: bar.color,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#f1f5f9] pt-5">
            <div className="rounded-[12px] bg-[#f8faff] p-3.5">
              <p className="text-[1.15rem] font-semibold text-[#64748b]">
                {t('admin.overview.sentOffers')}
              </p>
              <p className="mt-0.5 text-[2.2rem] font-extrabold text-[#0c3a94]">{totalOffers}</p>
            </div>
            <div className="rounded-[12px] bg-[#f3fbf0] p-3.5">
              <p className="text-[1.15rem] font-semibold text-[#4d7c2c]">
                {t('admin.overview.accepted')}
              </p>
              <p className="mt-0.5 text-[2.2rem] font-extrabold text-[#7fbb58]">
                {acceptedOffers}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Inquiries Table */}
      <div className="rounded-[16px] border border-[#e5ecf6] bg-white p-6 shadow-xs">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-[2rem] font-bold text-[#0c3a94]">
              {t('admin.overview.recentTitle')}
            </h2>
            <p className="text-[1.25rem] text-[#64748b]">{t('admin.overview.recentSub')}</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('inquiries')}
            className="inline-flex cursor-pointer items-center gap-1 rounded-[8px] bg-[#f0f5ff] px-4 py-2 text-[1.3rem] font-semibold text-[#3665f6] transition-colors hover:bg-[#3665f6] hover:text-white"
          >
            {t('admin.overview.viewAll')} <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e5e7eb] text-[1.15rem] font-bold tracking-wider text-[#64748b] uppercase">
                <th className="py-3 pr-4">{t('admin.overview.colInquiry')}</th>
                <th className="px-4 py-3">{t('admin.overview.colStatus')}</th>
                <th className="px-4 py-3">{t('admin.overview.colOffers')}</th>
                <th className="px-4 py-3">{t('admin.overview.colProcedure')}</th>
                <th className="py-3 pl-4 text-right">{t('admin.overview.colAction')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[1.35rem]">
              {(dashboard?.recentInquiries || []).map((inq) => (
                <tr key={inq.id} className="transition-colors hover:bg-[#f8faff]">
                  <td className="py-4 pr-4 font-bold text-[#0a295b]">#{inq.inquiryNumber}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-[1.2rem] font-semibold ${getStatusBadgeClass(inq.statusText)}`}
                    >
                      {inq.statusText}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-semibold text-[#0a295b]">
                    <span className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-full bg-[#eef3ff] px-2.5 text-[1.2rem] font-bold text-[#3665f6]">
                      {inq.offersCount ?? 0}
                    </span>
                  </td>
                  <td className="max-w-[280px] truncate px-4 py-4 text-[#475569]">
                    {inq.serviceTitle || inq.symptoms}
                  </td>
                  <td className="py-4 pl-4 text-right">
                    <button
                      type="button"
                      onClick={() => onOpenManageInquiry(inq.id)}
                      className="cursor-pointer rounded-[8px] border border-[#3665f6] px-4 py-1.5 text-[1.25rem] font-semibold text-[#3665f6] transition-colors hover:bg-[#3665f6] hover:text-white"
                    >
                      {t('admin.overview.manage')}
                    </button>
                  </td>
                </tr>
              ))}
              {(!dashboard?.recentInquiries || dashboard.recentInquiries.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[1.35rem] text-[#64748b]">
                    {t('admin.overview.noRecent')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

