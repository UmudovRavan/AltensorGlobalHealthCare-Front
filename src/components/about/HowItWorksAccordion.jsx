import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import RichContent from '../common/RichContent'

export default function HowItWorksAccordion({ steps = [] }) {
  const [openIdx, setOpenIdx] = useState(0)

  if (!Array.isArray(steps) || steps.length === 0) return null

  return (
    <div className="space-y-3">
      {steps.map((step, idx) => {
        const isOpen = openIdx === idx
        return (
          <div
            key={step.id || step.stepNumber || idx}
            className="overflow-hidden rounded-[12px] border border-[#e8e8e8] bg-white shadow-sm"
          >
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? -1 : idx)}
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-[#f8faff]"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3665f6] text-[1.4rem] font-bold text-white">
                  {step.stepNumber || idx + 1}
                </span>
                <span className="text-[1.75rem] font-bold text-[#0c3a94]">{step.title}</span>
              </div>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-[#0c3a94] transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-[#3665f6]' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="border-t border-[#f0f0f0] px-6 py-5">
                <RichContent content={step.content} />
                {step.ctaLabel && step.ctaUrl && (
                  <Link
                    to={step.ctaUrl}
                    className="zm-btn zm-btn-green zm-btn-sm mt-4 inline-flex"
                  >
                    <span>{step.ctaLabel}</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
