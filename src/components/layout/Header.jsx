import { ChevronDown, LogOut, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LANGUAGES, NAV_ABOUT_ITEMS, NAV_ALTENSOR_ITEMS } from '../../data/navigation'
import { useAuth } from '../../hooks/useAuth'
import { useTranslation } from '../../hooks/useTranslation'
import { useUI } from '../../hooks/useUI'
import catalogService from '../../services/catalogService'
import AltensorLogo from '../common/AltensorLogo'
import { SearchSpriteIcon } from '../common/ZagrebIcons'

function normalizeHeaderCategory(cat) {
  return {
    slug: cat.slug,
    name: cat.title || cat.name,
    subcategories: (cat.subCategories || cat.subcategories || []).map((sub) => ({
      slug: sub.slug,
      name: sub.title || sub.name,
    })),
  }
}

export default function Header() {
  const { pathname } = useLocation()
  const { openAuth, setSearchOpen, language, setLanguage } = useUI()
  const { t } = useTranslation()
  const { user, isAuthenticated, logout } = useAuth()
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [headerCategories, setHeaderCategories] = useState([])
  const aboutMenuItems = NAV_ABOUT_ITEMS
  const [activeServiceCat, setActiveServiceCat] = useState(null)
  const [scrolled, setScrolled] = useState(
    () => typeof window !== 'undefined' && window.scrollY > 40
  )

  const isHome = pathname === '/' || pathname === '/en'
  const isTransparent = isHome && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    let ignore = false
    catalogService
      .getCategories({ headerOnly: true })
      .then((list) => {
        if (ignore) return
        const mapped = Array.isArray(list) ? list.map(normalizeHeaderCategory) : []
        setHeaderCategories(mapped)
        setActiveServiceCat((prev) => mapped.find((c) => c.slug === prev?.slug) || mapped[0] || null)
      })
      .catch(() => {
        if (!ignore) {
          setHeaderCategories([])
          setActiveServiceCat(null)
        }
      })

    return () => {
      ignore = true
    }
  }, [language])
  const [langOpen, setLangOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileAccordion, setMobileAccordion] = useState(null)
  const headerRef = useRef(null)
  const langCloseTimerRef = useRef(null)

  const openLangMenu = () => {
    if (langCloseTimerRef.current) {
      clearTimeout(langCloseTimerRef.current)
      langCloseTimerRef.current = null
    }
    setLangOpen(true)
  }

  const scheduleLangClose = () => {
    if (langCloseTimerRef.current) clearTimeout(langCloseTimerRef.current)
    langCloseTimerRef.current = setTimeout(() => {
      setLangOpen(false)
    }, 180)
  }

  useEffect(() => {
    const handleOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setActiveDropdown(null)
        setLangOpen(false)
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0]

  const closeAllMenus = () => {
    setActiveDropdown(null)
    setLangOpen(false)
    setMobileOpen(false)
  }

  const navLinkClass = `text-[1.4rem] font-bold uppercase tracking-wide transition-colors duration-300 ${
    isTransparent
      ? 'text-white/95 hover:text-[#7fb4ff]'
      : 'text-black hover:text-[#3665f6]'
  }`

  return (
    <header
      ref={headerRef}
      className={`${
        isHome ? 'fixed inset-x-0 top-0' : 'sticky top-0'
      } z-[1000] h-[var(--header-h)] w-full transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgba(10,41,91,0.08)]'
      }`}
    >
      <div className="zm-container flex h-full items-center justify-between gap-4">
        <Link
          to="/en"
          onClick={closeAllMenus}
          className="shrink-0"
          aria-label="Altensor Healthcare Home"
        >
          <AltensorLogo light={isTransparent} />
        </Link>

        {/* Desktop Nav (5 items: Haqqımızda, Xidmətlər, Həkimlər, Klinikalar, Daha çox) */}
        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          {/* ABOUT US */}
          <div
            className="relative flex h-[var(--header-h)] items-center"
            onMouseEnter={() => setActiveDropdown('about')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link
              to="/en/about-us"
              onClick={closeAllMenus}
              className={`flex items-center gap-1 ${navLinkClass}`}
            >
              {t('nav.aboutUs')}
              <ChevronDown className="h-4 w-4 transition-transform duration-300" />
            </Link>
            {activeDropdown === 'about' && (
              <div className="zm-dropdown-anim absolute left-0 top-[64px] min-w-[260px] rounded-[4px] bg-white p-[15px] shadow-[0_15px_25px_-10px_rgba(0,0,0,0.2)]">
                {aboutMenuItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeAllMenus}
                    className="block px-[15px] py-[8px] text-[1.2rem] font-bold uppercase text-[#0a295b] transition-colors duration-300 hover:text-[#3665f6]"
                  >
                    {item.labelKey ? t(item.labelKey, item.label) : item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* SERVICES 2-level Mega Menu */}
          <div
            className="relative flex h-[70px] items-center"
            onMouseEnter={() => setActiveDropdown('services')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link
              to="/en/services"
              onClick={closeAllMenus}
              className={`flex items-center gap-1 ${navLinkClass}`}
            >
              {t('nav.services')}
              <ChevronDown className="h-4 w-4 transition-transform duration-300" />
            </Link>
            {activeDropdown === 'services' && (
              <div className="zm-dropdown-anim absolute left-[-160px] top-[64px] flex w-[760px] rounded-[4px] bg-white shadow-[0_15px_25px_-10px_rgba(0,0,0,0.2)]">
                {headerCategories.length === 0 ? (
                  <div className="w-full p-8 text-center text-[1.4rem] text-[#666666]">
                    No medical services added yet.
                  </div>
                ) : (
                  <>
                    <div className="max-h-[480px] w-[310px] overflow-y-auto border-r border-[#e8e8e8] py-3">
                      {headerCategories.map((cat) => {
                        const isActive = activeServiceCat?.slug === cat.slug
                        return (
                          <Link
                            key={cat.slug}
                            to={`/en/services/${cat.slug}`}
                            onClick={closeAllMenus}
                            onMouseEnter={() => setActiveServiceCat(cat)}
                            className={`flex items-center justify-between px-5 py-2 text-[1.25rem] font-bold uppercase transition-colors duration-200 ${
                              isActive
                                ? 'bg-[#f0f4ff] text-[#3665f6]'
                                : 'text-[#0a295b] hover:bg-[#f8faff] hover:text-[#3665f6]'
                            }`}
                          >
                            <span>{cat.name}</span>
                            <span className="text-[1.1rem] opacity-60">›</span>
                          </Link>
                        )
                      })}
                    </div>
                    {activeServiceCat && (
                      <div className="flex-1 p-6">
                        <div className="mb-3 flex items-center justify-between border-b border-[#e8e8e8] pb-3">
                          <Link
                            to={`/en/services/${activeServiceCat.slug}`}
                            onClick={closeAllMenus}
                            className="text-[1.8rem] font-bold text-[#0c3a94] hover:text-[#3665f6]"
                          >
                            {activeServiceCat.name}
                          </Link>
                          <Link
                            to={`/en/services/${activeServiceCat.slug}`}
                            onClick={closeAllMenus}
                            className="text-[1.2rem] font-semibold text-[#3665f6] hover:underline"
                          >
                            {t('common.viewAll')} ›
                          </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                          {activeServiceCat.subcategories.map((sub) => (
                            <Link
                              key={sub.slug}
                              to={`/en/services/${activeServiceCat.slug}/${sub.slug}`}
                              onClick={closeAllMenus}
                              className="py-1 text-[1.3rem] text-[#555555] transition-colors hover:text-[#3665f6]"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <Link
            to="/en/doctors"
            onClick={closeAllMenus}
            className={navLinkClass}
          >
            {t('nav.doctors')}
          </Link>

          <Link
            to="/en/clinics"
            onClick={closeAllMenus}
            className={navLinkClass}
          >
            {t('nav.clinics')}
          </Link>

          {/* EXPERIENCE AZERBAIJAN */}
          <a
            href="https://azerbaijan.travel/"
            target="_blank"
            rel="noreferrer"
            onClick={closeAllMenus}
            className={`flex items-center gap-2 whitespace-nowrap ${navLinkClass}`}
          >
            <img
              src="/images/azerbaijan-travel-logo.png"
              alt="Experience Azerbaijan"
              className="h-5 w-5 shrink-0 rounded-[4px] object-contain"
            />
            <span>EXPERIENCE AZERBAIJAN</span>
          </a>

          {/* MORE (Altensor Healthcare) */}
          <div
            className="relative flex h-[var(--header-h)] items-center"
            onMouseEnter={() => setActiveDropdown('more')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'more' ? null : 'more')}
              className={`flex cursor-pointer items-center gap-1 whitespace-nowrap ${navLinkClass}`}
            >
              {t('nav.more', 'More')}
              <ChevronDown className="h-4 w-4 transition-transform duration-300" />
            </button>
            {activeDropdown === 'more' && (
              <div className="zm-dropdown-anim absolute left-0 top-[64px] min-w-[290px] rounded-[6px] bg-white p-[15px] shadow-[0_15px_25px_-10px_rgba(0,0,0,0.2)]">
                <Link
                  to="/en/altensor-healthcare"
                  onClick={closeAllMenus}
                  className="block px-[15px] py-[8px] text-[1.25rem] font-bold uppercase text-[#0c3a94] transition-colors duration-300 hover:text-[#3665f6]"
                >
                  ALTENSOR HEALTHCARE
                </Link>
                {NAV_ALTENSOR_ITEMS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeAllMenus}
                    className="block px-[22px] py-[7px] text-[1.2rem] font-semibold uppercase text-[#0a295b] transition-colors duration-300 hover:text-[#3665f6]"
                  >
                    {item.labelKey ? t(item.labelKey, item.label) : item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right Header Utilities */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 ${
              isTransparent
                ? 'text-white hover:text-[#7fb4ff]'
                : 'text-[#7fbb58] hover:text-[#3665f6]'
            }`}
          >
            <SearchSpriteIcon className="h-[22px] w-[22px]" />
          </button>

          {/* 3-Language Selector (EN, AZ, RU) */}
          <div
            className="relative"
            onMouseEnter={openLangMenu}
            onMouseLeave={scheduleLangClose}
          >
            <button
              type="button"
              onClick={() => setLangOpen((prev) => !prev)}
              aria-label="Select language"
              className={`flex cursor-pointer items-center gap-2 rounded-full px-1.5 py-1 text-[1.4rem] font-bold uppercase transition-colors ${
                isTransparent
                  ? 'text-white hover:text-[#7fb4ff]'
                  : 'text-[#0a295b] hover:text-[#3665f6]'
              }`}
            >
              <img
                src={currentLang.flag}
                alt={currentLang.label}
                className="h-6 w-6 rounded-full object-cover shadow-xs"
              />
              <span>{currentLang.label}</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full z-50 pt-2">
                <div className="zm-dropdown-anim w-[112px] rounded-[10px] border border-[#e8e8e8] bg-white py-2 shadow-[0_15px_25px_-10px_rgba(0,0,0,0.2)]">
                  {LANGUAGES.map((lang) => {
                    const selected = lang.code === language
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang.code)
                          setLangOpen(false)
                        }}
                        className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left text-[1.4rem] font-bold uppercase transition-colors duration-200 hover:bg-[#f4f7ff] hover:text-[#3665f6] ${
                          selected ? 'bg-[#f4f7ff] text-[#3665f6]' : 'text-[#0a295b]'
                        }`}
                      >
                        <img
                          src={lang.flag}
                          alt={lang.label}
                          className="h-5 w-5 rounded-full object-cover"
                        />
                        <span>{lang.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Circular Profile Icon */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  aria-label="User Profile"
                  className={`flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full transition-transform duration-200 hover:scale-105 ${
                    isTransparent ? 'text-white' : 'text-[#3665f6]'
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-[38px] w-[38px]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="10" r="3" />
                    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                  </svg>
                </button>

                {profileDropdownOpen && (
                  <div className="zm-dropdown-anim absolute right-0 top-[42px] z-50 w-[240px] rounded-[10px_0_10px_10px] border border-[#e8edf5] bg-white shadow-[0_10px_25px_-10px_rgba(0,0,0,0.15)]">
                    <div className="border-b border-[#f0f0f0] px-6 py-4">
                      <p className="truncate text-[1.5rem] font-bold text-[#0c3a94]">
                        {user?.fullName || user?.firstName || 'Ravan Umudov'}
                      </p>
                      <p className="mt-0.5 truncate text-[1.2rem] text-[#666666]">
                        {user?.email || 'ravanumudov999@gmail.com'}
                      </p>
                      {user?.roles?.[0] && (
                        <span className="mt-2 inline-block rounded-[4px] bg-[#edf3fe] px-2 py-0.5 text-[1.1rem] font-bold uppercase tracking-wider text-[#3665f6]">
                          {user.roles[0]}
                        </span>
                      )}
                    </div>
                    <ul className="py-2">
                      <li>
                        <Link
                          to="/en/my-profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-6 py-3 text-[1.4rem] font-bold uppercase tracking-wider text-[#0a295b] transition-colors hover:bg-[#f4f7ff] hover:text-[#3665f6]"
                        >
                          {t('common.myProfile')}
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/en/my-profile/inquiries"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-6 py-3 text-[1.4rem] font-bold uppercase tracking-wider text-[#0a295b] transition-colors hover:bg-[#f4f7ff] hover:text-[#3665f6]"
                        >
                          {t('common.myInquiries')}
                        </Link>
                      </li>
                      <li className="border-t border-[#f5f5f5]">
                        <button
                          type="button"
                          onClick={() => {
                            logout()
                            setProfileDropdownOpen(false)
                          }}
                          className="flex w-full cursor-pointer items-center gap-2 px-6 py-3 text-left text-[1.4rem] font-bold uppercase tracking-wider text-[#d90429] transition-colors hover:bg-[#fff5f5]"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>{t('common.signOut')}</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* MY INQUIRIES Button (exact from screenshot, links to /en/my-profile/inquiries) */}
              <Link
                to="/en/my-profile/inquiries"
                className="hidden h-[40px] cursor-pointer items-center justify-center whitespace-nowrap rounded-[8px] bg-[#3665f6] px-5 text-[1.25rem] font-bold uppercase tracking-wide text-white shadow-xs transition-all hover:bg-[#2554e5] sm:inline-flex"
              >
                {t('common.myInquiries')}
              </Link>
            </div>
          ) : (
            <div
              className={`hidden items-center gap-2.5 text-[1.4rem] font-bold uppercase tracking-wide sm:inline-flex ${
                isTransparent ? 'text-white' : 'text-[#3665f6]'
              }`}
            >
              <button
                type="button"
                onClick={() => openAuth('login')}
                className="cursor-pointer transition-opacity duration-200 hover:opacity-80"
              >
                {t('common.signIn')}
              </button>
              <span className={isTransparent ? 'text-white/40' : 'text-[#cbd5e1]'}>|</span>
              <button
                type="button"
                onClick={() => openAuth('register')}
                className="cursor-pointer transition-opacity duration-200 hover:opacity-80"
              >
                {t('common.register')}
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle Menu"
            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-md lg:hidden ${
              isTransparent ? 'text-white' : 'text-[#0a295b]'
            }`}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-[70px] bottom-0 z-50 overflow-y-auto bg-white px-6 py-6 shadow-xl lg:hidden">
          <div className="flex flex-col gap-3">
            <div>
              <button
                type="button"
                onClick={() =>
                  setMobileAccordion(mobileAccordion === 'about' ? null : 'about')
                }
                className="flex w-full items-center justify-between py-2 text-[1.6rem] font-bold uppercase text-[#0a295b]"
              >
                ABOUT US
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    mobileAccordion === 'about' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {mobileAccordion === 'about' && (
                <div className="ml-3 flex flex-col gap-2 border-l-2 border-[#3665f6] pl-4">
                  <Link
                    to="/en/about-us"
                    onClick={closeAllMenus}
                    className="py-1 text-[1.4rem] text-[#3665f6]"
                  >
                    Overview
                  </Link>
                  {aboutMenuItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={closeAllMenus}
                      className="py-1 text-[1.4rem] text-[#555555]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() =>
                  setMobileAccordion(mobileAccordion === 'services' ? null : 'services')
                }
                className="flex w-full items-center justify-between py-2 text-[1.6rem] font-bold uppercase text-[#0a295b]"
              >
                SERVICES
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    mobileAccordion === 'services' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {mobileAccordion === 'services' && (
                <div className="ml-3 flex flex-col gap-1.5 border-l-2 border-[#3665f6] pl-4">
                  <Link
                    to="/en/services"
                    onClick={closeAllMenus}
                    className="py-1 text-[1.4rem] font-semibold text-[#3665f6]"
                  >
                    All Medical Services
                  </Link>
                  {headerCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/en/services/${cat.slug}`}
                      onClick={closeAllMenus}
                      className="py-1 text-[1.4rem] text-[#555555]"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/en/doctors"
              onClick={closeAllMenus}
              className="py-2 text-[1.6rem] font-bold uppercase text-[#0a295b]"
            >
              DOCTORS
            </Link>
            <Link
              to="/en/clinics"
              onClick={closeAllMenus}
              className="py-2 text-[1.6rem] font-bold uppercase text-[#0a295b]"
            >
              CLINICS
            </Link>
            <div>
              <button
                type="button"
                onClick={() =>
                  setMobileAccordion(mobileAccordion === 'altensor' ? null : 'altensor')
                }
                className="flex w-full items-center justify-between py-2 text-[1.6rem] font-bold uppercase text-[#0a295b]"
              >
                ALTENSOR HEALTHCARE
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    mobileAccordion === 'altensor' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {mobileAccordion === 'altensor' && (
                <div className="ml-3 flex flex-col gap-2 border-l-2 border-[#3665f6] pl-4">
                  {NAV_ALTENSOR_ITEMS.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={closeAllMenus}
                      className="py-1 text-[1.4rem] text-[#555555]"
                    >
                      {item.labelKey ? t(item.labelKey, item.label) : item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <a
              href="https://azerbaijan.travel/"
              target="_blank"
              rel="noreferrer"
              onClick={closeAllMenus}
              className="flex items-center gap-2.5 py-2 text-[1.6rem] font-bold uppercase text-[#0a295b]"
            >
              <img
                src="/images/azerbaijan-travel-logo.png"
                alt="Experience Azerbaijan"
                className="h-6 w-6 shrink-0 rounded-[4px] object-contain"
              />
              <span>{t('nav.experienceAzerbaijan', 'EXPERIENCE AZERBAIJAN')}</span>
            </a>

            <div className="mt-4 border-t border-[#e8e8e8] pt-4">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="rounded-[8px] bg-[#edf3fe] p-3">
                    <p className="text-[1.5rem] font-bold text-[#0c3a94]">
                      {user?.fullName || user?.firstName || 'User'}
                    </p>
                    <p className="text-[1.2rem] text-[#666666]">{user?.email}</p>
                  </div>
                  <Link
                    to="/en/my-profile"
                    onClick={closeAllMenus}
                    className="flex w-full items-center justify-center rounded-[8px] border border-[#3665f6] py-2.5 text-[1.4rem] font-bold uppercase text-[#3665f6]"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/en/my-profile/inquiries"
                    onClick={closeAllMenus}
                    className="flex w-full items-center justify-center rounded-[8px] bg-[#3665f6] py-3 text-[1.4rem] font-bold uppercase text-white shadow-xs"
                  >
                    MY INQUIRIES
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      closeAllMenus()
                      logout()
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-[8px] border border-[#d90429] py-2.5 text-[1.3rem] font-bold text-[#d90429]"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      closeAllMenus()
                      openAuth('login')
                    }}
                    className="zm-btn zm-btn-green w-full"
                  >
                    <span>{t('common.signIn')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closeAllMenus()
                      openAuth('register')
                    }}
                    className="flex w-full cursor-pointer items-center justify-center rounded-[8px] border border-[#3665f6] py-3 text-[1.4rem] font-bold uppercase text-[#3665f6]"
                  >
                    {t('common.register')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
