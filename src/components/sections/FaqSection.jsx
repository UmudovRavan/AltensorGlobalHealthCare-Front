import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HOME_FAQS } from '../../data/homeData'
import { SwiperArrowIcon } from '../common/ZagrebIcons'

export default function FaqSection({ items = HOME_FAQS, compact = false }) {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx))
  }

  return (
    <section className={compact ? 'mt-12' : ''}>
      <div className="zm-container">
        <div className="rounded-[19px] bg-[#d4d4d4]/20 px-[28px] pt-[28px] pb-[20px] backdrop-blur-[8px] md:px-[50px] md:pt-[50px] md:pb-[34px]">
          <h2 className="text-[4.8rem] font-semibold leading-[1] text-[#0c3a94] md:text-[8.2rem]">
            F.A.Q.
          </h2>

          <div className="mt-8">
            {items.map((item, idx) => {
              const isOpen = openIndex === idx
              return (
                <div
                  key={item.q}
                  className="border-b border-[#dadada] last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    aria-expanded={isOpen}
                    className="flex w-full cursor-pointer items-center gap-4 py-5 text-left"
                  >
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center text-[#3665f6] transition-transform duration-200 ${
                        isOpen ? 'rotate-90' : ''
                      }`}
                    >
                      <SwiperArrowIcon className="h-[14px] w-[9px]" />
                    </div>
                    <span className="text-[1.6rem] font-bold text-[#0a295b]">
                      {item.q}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="pb-5 pl-9 pr-4 text-[1.5rem] leading-[1.65] text-[#555555]">
                      <p>
                        {item.a}{' '}
                        {item.linkTo && (
                          <Link
                            to={item.linkTo}
                            className="font-semibold text-[#3665f6] underline"
                          >
                            {item.linkLabel}
                          </Link>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

