import { Link } from 'react-router-dom'
import { DOCTORS } from '../../data/doctors'
import { SwiperArrowIcon } from '../common/ZagrebIcons'

export default function DoctorsSection() {
  const featured = DOCTORS.slice(0, 4)

  return (
    <section className="mt-[130px] md:mt-[200px]">
      <div className="zm-container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-[4.8rem] font-semibold leading-[1] text-[#0c3a94] md:text-[8.2rem]">
              Doctors
            </h2>
            <p className="mt-3 text-[2rem] font-medium text-[#0c3a94] md:text-[2.6rem]">
              Award winning doctors for medical excellence
            </p>
          </div>

          <Link
            to="/en/doctors"
            className="zm-btn zm-btn-green zm-btn-sm shrink-0 self-start md:self-auto"
          >
            <span>View all</span>
            <SwiperArrowIcon className="zm-btn-arrow h-[12px] w-[8px]" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((doc) => (
            <div
              key={doc.slug}
              className="group flex flex-col rounded-[12px] border border-[#3665f6] bg-white p-[20px] transition-shadow duration-300 hover:shadow-lg"
            >
              <Link
                to={`/en/doctors/${doc.slug}`}
                className="block h-[200px] w-full overflow-hidden rounded-[8px]"
              >
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </Link>

              <p className="mt-5 text-[1.2rem] font-bold uppercase tracking-wide text-[#3665f6]">
                {doc.specialty}
              </p>

              <Link
                to={`/en/doctors/${doc.slug}`}
                className="mt-2 text-[2.4rem] font-semibold leading-[1.2] text-[#0a295b] transition-colors duration-[400ms] group-hover:text-[#3665f6] md:text-[2.6rem]"
              >
                {doc.name}
              </Link>

              {doc.shortBio && (
                <p className="mt-3 text-[1.4rem] leading-relaxed text-[#555555]">
                  {doc.shortBio}
                </p>
              )}

              <div className="mt-auto pt-6 text-right">
                <Link
                  to={`/en/doctors/${doc.slug}`}
                  className="inline-flex items-center justify-end text-[1.2rem] font-bold text-[#3665f6]"
                >
                  <span>View profile</span>
                  <SwiperArrowIcon className="h-[13px] w-0 overflow-hidden pl-0 transition-all duration-[400ms] group-hover:w-[16px] group-hover:pl-[6px]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

