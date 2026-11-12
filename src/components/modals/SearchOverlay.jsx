import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUI } from '../../hooks/useUI'
import { CLINICS } from '../../data/clinics'
import { DOCTORS } from '../../data/doctors'
import { MOST_SEARCHED } from '../../data/homeData'
import { SERVICE_CATEGORIES } from '../../data/services'

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useUI()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  if (!searchOpen) return null

  const trimmed = query.trim().toLowerCase()
  const matchingServices = trimmed
    ? SERVICE_CATEGORIES.filter((s) => s.name.toLowerCase().includes(trimmed)).slice(0, 5)
    : []
  const matchingDoctors = trimmed
    ? DOCTORS.filter(
        (d) =>
          d.name.toLowerCase().includes(trimmed) ||
          d.specialty.toLowerCase().includes(trimmed),
      ).slice(0, 4)
    : []
  const matchingClinics = trimmed
    ? CLINICS.filter((c) => c.name.toLowerCase().includes(trimmed)).slice(0, 3)
    : []

  const go = (to) => {
    setSearchOpen(false)
    setQuery('')
    navigate(to)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!trimmed) return
    go(`/en/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div className="fixed inset-0 z-[1200] flex items-start justify-center bg-[#0a295b]/75 px-4 pt-24 backdrop-blur-xs">
      <div className="relative w-full max-w-[780px] rounded-[12px] bg-white p-8 shadow-2xl">
        <button
          type="button"
          onClick={() => setSearchOpen(false)}
          aria-label="Close search"
          className="absolute right-5 top-5 cursor-pointer rounded-full p-2 text-[#555555] hover:bg-slate-100"
        >
          <X className="h-6 w-6" />
        </button>

        <h3 className="mb-4 text-[2.8rem] font-bold text-[#0c3a94]">Search</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#3665f6]" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type of treatment / offer / doctor"
              className="w-full rounded-[8px] border border-[#c7c7c7] py-3.5 pr-4 pl-12 text-[1.6rem] outline-none focus:border-[#3665f6]"
            />
          </div>
          <button type="submit" className="zm-btn zm-btn-green">
            <span>Search</span>
          </button>
        </form>

        {trimmed ? (
          <div className="mt-6 space-y-4">
            {matchingServices.length > 0 && (
              <div>
                <p className="mb-2 text-[1.2rem] font-bold uppercase text-[#3665f6]">
                  Services
                </p>
                <div className="flex flex-wrap gap-2">
                  {matchingServices.map((s) => (
                    <button
                      key={s.slug}
                      type="button"
                      onClick={() => go(`/en/services/${s.slug}`)}
                      className="cursor-pointer rounded-[6px] bg-[#f0f4ff] px-3.5 py-1.5 text-[1.4rem] font-semibold text-[#0c3a94] hover:bg-[#3665f6] hover:text-white"
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {matchingDoctors.length > 0 && (
              <div>
                <p className="mb-2 text-[1.2rem] font-bold uppercase text-[#3665f6]">
                  Doctors
                </p>
                <div className="flex flex-wrap gap-2">
                  {matchingDoctors.map((d) => (
                    <button
                      key={d.slug}
                      type="button"
                      onClick={() => go(`/en/doctors/${d.slug}`)}
                      className="cursor-pointer rounded-[6px] bg-[#f4f4f4] px-3.5 py-1.5 text-[1.4rem] font-semibold text-[#0a295b] hover:bg-[#3665f6] hover:text-white"
                    >
                      {d.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {matchingClinics.length > 0 && (
              <div>
                <p className="mb-2 text-[1.2rem] font-bold uppercase text-[#3665f6]">
                  Clinics
                </p>
                <div className="flex flex-wrap gap-2">
                  {matchingClinics.map((c) => (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => go(`/en/clinics/${c.slug}`)}
                      className="cursor-pointer rounded-[6px] bg-[#f4f4f4] px-3.5 py-1.5 text-[1.4rem] font-semibold text-[#0a295b] hover:bg-[#3665f6] hover:text-white"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {matchingServices.length === 0 &&
              matchingDoctors.length === 0 &&
              matchingClinics.length === 0 && (
                <p className="text-[1.4rem] text-[#666666]">
                  Press Search to view full directory results for &ldquo;{query}&rdquo;.
                </p>
              )}
          </div>
        ) : (
          <div className="mt-6">
            <p className="mb-2 text-[1.15rem] font-bold uppercase tracking-wider text-[#585858]">
              MOST SEARCHED FOR
            </p>
            <div className="flex flex-wrap gap-3">
              {MOST_SEARCHED.map((item) => (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => go(item.to)}
                  className="cursor-pointer text-[1.4rem] font-semibold text-[#3665f6] hover:underline"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
