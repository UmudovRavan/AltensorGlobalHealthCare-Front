import { MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BRAND } from '../../data/brand'
import { useTranslation } from '../../hooks/useTranslation'
import catalogService from '../../services/catalogService'
import { NewsletterIcon } from './ZagrebIcons'

export default function FloatingWidgets() {
  const { t } = useTranslation()
  const [popupOpen, setPopupOpen] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const dismissed = sessionStorage.getItem('altensor_newsletter_dismissed')
    if (!dismissed) {
      const timer = setTimeout(() => setPopupOpen(true), 2400)
      return () => clearTimeout(timer)
    }
  }, [])

  const dismissPopup = () => {
    sessionStorage.setItem('altensor_newsletter_dismissed', '1')
    setPopupOpen(false)
  }

  const handlePopupSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    try {
      await catalogService.subscribeNewsletter(email.trim())
    } catch {
      // Keep friendly confirmation even if backend is offline
    }
    setSubscribed(true)
    setTimeout(() => {
      dismissPopup()
    }, 1500)
  }

  return (
    <>
      {/* Newsletter Popup */}
      {popupOpen && (
        <div className="fixed right-4 bottom-[90px] z-[890] w-[calc(100vw-2rem)] max-w-[320px] rounded-[8px] border border-[#e8e8e8] bg-[#f9f9f9] p-6 text-center shadow-[0_31px_10px_-22px_rgba(0,0,0,0.15)] sm:right-7">
          <div className="mx-auto mb-3 flex justify-center text-[#7fbb58]">
            <NewsletterIcon className="h-[52px] w-[52px]" />
          </div>
          <h4 className="text-[2.2rem] font-bold text-[#3665f6]">{t('widgets.newsletterTitle')}</h4>
          <p className="mt-1 text-[1.2rem] font-semibold text-[#0a295b]">
            {t('widgets.newsletterSub')}
          </p>

          {subscribed ? (
            <p className="mt-4 text-[1.4rem] font-semibold text-[#7fbb58]">
              {t('widgets.thanksSubscribing')}
            </p>
          ) : (
            <form onSubmit={handlePopupSubmit} className="mt-4 space-y-2.5">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('widgets.emailPlaceholder')}
                className="w-full rounded-[6px] border border-[#c7c7c7] bg-white px-3.5 py-2.5 text-[1.35rem] outline-none focus:border-[#3665f6]"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 cursor-pointer rounded-[6px] bg-[#7fbb58] py-2 text-[1.3rem] font-semibold text-white transition-colors hover:bg-[#3665f6]"
                >
                  {t('widgets.subscribe')}
                </button>
                <button
                  type="button"
                  onClick={dismissPopup}
                  className="flex-1 cursor-pointer rounded-[6px] bg-[#d71920] py-2 text-[1.3rem] font-semibold text-white transition-opacity hover:opacity-90"
                >
                  {t('widgets.notInterested')}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Circular Floating WhatsApp Button */}
      <a
        href={BRAND.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="fixed right-5 bottom-5 z-[950] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_rgba(37,211,102,0.45)] transition-transform duration-300 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0c3a94] sm:right-7 sm:bottom-7"
      >
        <MessageCircle className="h-7 w-7 fill-current" />
      </a>
    </>
  )
}
