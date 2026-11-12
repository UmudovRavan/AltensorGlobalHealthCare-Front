import { Mail, MessageCircle, Phone, Send, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUI } from '../../hooks/useUI'
import { BRAND } from '../../data/brand'
import { ChatBubbleIcon, NewsletterIcon } from './ZagrebIcons'

export default function FloatingWidgets() {
  const { openInquiry } = useUI()
  const [fabOpen, setFabOpen] = useState(false)
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

  const handlePopupSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setTimeout(() => {
      dismissPopup()
    }, 1500)
  }

  return (
    <>
      {/* Newsletter Popup */}
      {popupOpen && !fabOpen && (
        <div className="fixed right-5 bottom-[90px] z-[890] w-[320px] rounded-[8px] border border-[#e8e8e8] bg-[#f9f9f9] p-6 text-center shadow-[0_31px_10px_-22px_rgba(0,0,0,0.15)] sm:right-7">
          <div className="mx-auto mb-3 flex justify-center text-[#7fbb58]">
            <NewsletterIcon className="h-[52px] w-[52px]" />
          </div>
          <h4 className="text-[2.2rem] font-bold text-[#3665f6]">Newsletter</h4>
          <p className="mt-1 text-[1.2rem] font-semibold text-[#0a295b]">
            I wish to receive marketing information
          </p>

          {subscribed ? (
            <p className="mt-4 rounded-[6px] bg-[#eef8e6] px-3 py-2 text-[1.3rem] font-semibold text-[#4e8a2c]">
              Thank you for subscribing!
            </p>
          ) : (
            <form onSubmit={handlePopupSubmit} className="mt-4 space-y-3">
              <label htmlFor="popup-newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="popup-newsletter-email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Please type your email address"
                className="w-full rounded-[6px] border border-[#c7c7c7] bg-white px-3 py-2 text-[1.3rem] text-[#0a295b] outline-none focus:border-[#3665f6]"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 cursor-pointer rounded-[6px] bg-[#7fbb58] py-2 text-[1.3rem] font-semibold text-white transition-colors hover:bg-[#3665f6]"
                >
                  Subscribe
                </button>
                <button
                  type="button"
                  onClick={dismissPopup}
                  className="flex-1 cursor-pointer rounded-[6px] bg-[#d71920] py-2 text-[1.3rem] font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Not interested
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Floating Send Inquiry Pill & Menu */}
      <div className="fixed right-5 bottom-5 z-[950] flex flex-col items-end gap-2.5 sm:right-7 sm:bottom-7">
        {fabOpen && (
          <div className="flex flex-col items-end gap-2 rounded-[12px] border border-[#e8e8e8] bg-white p-3 shadow-2xl">
            <Link
              to="/en/about-us/contact"
              onClick={() => setFabOpen(false)}
              className="flex w-44 items-center gap-2.5 rounded-[8px] px-3 py-2 text-[1.35rem] font-semibold text-[#0a295b] hover:bg-[#f0f4ff] hover:text-[#3665f6]"
            >
              <Mail className="h-4 w-4 text-[#3665f6]" />
              <span>Contact us</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                setFabOpen(false)
                openInquiry()
              }}
              className="flex w-44 cursor-pointer items-center gap-2.5 rounded-[8px] px-3 py-2 text-left text-[1.35rem] font-semibold text-[#0a295b] hover:bg-[#f0f4ff] hover:text-[#3665f6]"
            >
              <Send className="h-4 w-4 text-[#7fbb58]" />
              <span>Send inquiry</span>
            </button>
            <a
              href={`mailto:${BRAND.email}`}
              className="flex w-44 items-center gap-2.5 rounded-[8px] px-3 py-2 text-[1.35rem] font-semibold text-[#0a295b] hover:bg-[#f0f4ff] hover:text-[#3665f6]"
            >
              <Mail className="h-4 w-4 text-[#3665f6]" />
              <span>Email</span>
            </a>
            <a
              href={`tel:${BRAND.phone.replace(/\s+/g, '')}`}
              className="flex w-44 items-center gap-2.5 rounded-[8px] px-3 py-2 text-[1.35rem] font-semibold text-[#0a295b] hover:bg-[#f0f4ff] hover:text-[#3665f6]"
            >
              <Phone className="h-4 w-4 text-[#3665f6]" />
              <span>Telephone</span>
            </a>
            <a
              href={BRAND.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="flex w-44 items-center gap-2.5 rounded-[8px] px-3 py-2 text-[1.35rem] font-semibold text-[#0a295b] hover:bg-[#f0f4ff] hover:text-[#3665f6]"
            >
              <MessageCircle className="h-4 w-4 text-[#22d698]" />
              <span>WhatsApp</span>
            </a>
          </div>
        )}

        <button
          type="button"
          onClick={() => setFabOpen((prev) => !prev)}
          className="flex h-[50px] cursor-pointer items-center gap-2.5 rounded-full bg-[#7fbb58] px-5 text-[1.4rem] font-semibold text-white shadow-lg transition-all duration-[400ms] hover:bg-[#3665f6]"
        >
          {fabOpen ? (
            <>
              <X className="h-5 w-5 transition-transform duration-300" />
              <span>Close</span>
            </>
          ) : (
            <>
              <ChatBubbleIcon className="h-[20px] w-[20px]" />
              <span>Send inquiry</span>
            </>
          )}
        </button>
      </div>
    </>
  )
}
