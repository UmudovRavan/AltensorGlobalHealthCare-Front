import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { UIContext } from './uiStore'

export function UIProvider({ children }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [inquirySubject, setInquirySubject] = useState('')
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [searchOpen, setSearchOpen] = useState(false)
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('altensor_lang')
    return saved === 'az' || saved === 'en' || saved === 'ru' ? saved : 'en'
  })

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const setLanguage = (code) => {
    const next = code === 'az' || code === 'ru' ? code : 'en'
    localStorage.setItem('altensor_lang', next)
    setLanguageState(next)
  }

  const openInquiry = (subject = '') => {
    if (!isAuthenticated) {
      navigate('/en/plan', { state: { subject } })
      return
    }
    setInquirySubject(subject)
    setInquiryOpen(true)
  }

  const closeInquiry = () => {
    setInquiryOpen(false)
    setInquirySubject('')
  }

  const openAuth = (mode = 'login') => {
    setAuthMode(mode)
    setAuthOpen(true)
  }

  const closeAuth = () => setAuthOpen(false)

  return (
    <UIContext.Provider
      value={{
        inquiryOpen,
        inquirySubject,
        openInquiry,
        closeInquiry,
        authOpen,
        authMode,
        setAuthMode,
        openAuth,
        closeAuth,
        searchOpen,
        setSearchOpen,
        language,
        setLanguage,
      }}
    >
      {children}
    </UIContext.Provider>
  )
}
