import { useState } from 'react'
import { NewsletterIcon } from '../common/ZagrebIcons'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <section className="my-[120px] w-full bg-[#d4d4d4]/20 py-[80px] md:my-[180px] md:py-[100px]">
      <div className="zm-container">
        <div className="mx-auto max-w-[600px] text-center">
          <div className="flex justify-center text-[#7fbb58]">
            <NewsletterIcon className="h-[70px] w-[70px]" />
          </div>

          <h2 className="mt-5 text-[4.8rem] font-semibold leading-[1.05] text-[#3665f6] md:text-[8.2rem]">
            Newsletter
          </h2>
          <p className="mt-3 text-[1.8rem] font-bold text-[#0a295b]">
            I wish to receive marketing information
          </p>

          {subscribed ? (
            <div className="mt-8 rounded-[8px] bg-white p-5 text-[1.6rem] font-semibold text-[#6bbe47] shadow-sm">
              Thank you for subscribing to Altensor Healthcare updates!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <label htmlFor="section-newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="section-newsletter-email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Please type your email address"
                className="w-full rounded-[8px] border border-[#c7c7c7] bg-white px-5 py-4 text-center text-[1.6rem] text-[#0a295b] outline-none focus:border-[#3665f6]"
              />
              <button type="submit" className="zm-btn zm-btn-green">
                <span>Subscribe</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

