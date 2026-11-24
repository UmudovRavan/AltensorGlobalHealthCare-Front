import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MOST_SEARCHED } from '../../data/homeData'
import { useTranslation } from '../../hooks/useTranslation'

export default function SearchSection() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/en/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <section className="my-[120px] w-full bg-[#3665f6] py-[90px] md:my-[180px] md:py-[110px]">
      <div className="zm-container">
        <h2 className="text-[4.8rem] font-semibold leading-[1] text-white md:text-[8.2rem]">
          {t('common.search', 'Search')}
        </h2>
        <p className="mt-4 text-[2.2rem] font-medium text-white/95 md:text-[3.6rem]">
          {t('home.searchTitle')}
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex max-w-[1040px] flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="home-search-input" className="sr-only">
            {t('home.searchTitle')}
          </label>
          <input
            id="home-search-input"
            name="search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('home.searchPlaceholder')}
            className="flex-1 rounded-[8px] bg-white px-6 py-4 text-[1.6rem] text-[#0a295b] outline-none placeholder:text-[#888888]"
          />
          <button type="submit" className="zm-btn zm-btn-green-on-blue shrink-0">
            <span>{t('home.searchButton', 'Search')}</span>
          </button>
        </form>

        <div className="mt-6">
          <p className="text-[1.1rem] font-bold uppercase tracking-[0.08em] text-white/80">
            MOST SEARCHED FOR
          </p>
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
            {MOST_SEARCHED.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-[1.4rem] font-medium text-white underline-offset-4 hover:underline"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

