import { Link } from 'react-router-dom'
import { StarGoldIcon, VerifiedBadgeIcon } from '../components/common/ZagrebIcons'
import { BRAND } from '../data/brand'
import { PATIENT_REVIEWS } from '../data/homeData'

export default function ReviewsPage() {
  return (
    <div className="zm-container py-16">
      <nav className="mb-6 text-[1.3rem] text-[#666666]">
        <Link to="/en" className="text-[#3665f6] hover:underline">Home</Link> /{' '}
        <span>Patient Reviews</span>
      </nav>

      <h1 className="text-[4.4rem] font-semibold leading-[1.1] text-[#0c3a94] md:text-[7rem]">
        {BRAND.name} patient reviews
      </h1>
      <p className="mt-3 text-[1.8rem] text-[#555555]">
        Verified stories and feedback from international and local patients.
      </p>

      <div className="mt-12 space-y-8">
        {PATIENT_REVIEWS.map((review) => (
          <div
            key={review.id}
            className="rounded-[12px] border border-[#e8e8e8] bg-white p-8 shadow-xs"
          >
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-[2.2rem] font-bold text-[#0a295b]">
                {review.author}
              </h2>
              <span className="inline-flex items-center gap-1.5 text-[1.3rem] font-semibold text-[#22d698]">
                <VerifiedBadgeIcon />
                <span>Verified patient</span>
              </span>
            </div>

            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <StarGoldIcon key={i} />
                ))}
              </div>
              <span className="text-[1.2rem] font-semibold text-[#666666]">
                Review from <span className="text-[#3665f6]">Google</span>
              </span>
            </div>

            <div className="mt-3 space-y-1 text-[1.4rem] text-[#555555]">
              {review.doctor && (
                <p>
                  Doctor:{' '}
                  <Link
                    to={review.doctorTo}
                    className="font-semibold text-[#3665f6] hover:underline"
                  >
                    {review.doctor}
                  </Link>
                </p>
              )}
              <p>
                Procedure:{' '}
                <Link
                  to={review.procedureTo}
                  className="font-semibold text-[#3665f6] hover:underline"
                >
                  {review.procedure}
                </Link>
              </p>
              <p>
                Hospital:{' '}
                <Link
                  to={review.hospitalTo}
                  className="font-semibold text-[#3665f6] hover:underline"
                >
                  {review.hospital}
                </Link>
              </p>
            </div>

            <p className="mt-5 text-[1.6rem] leading-[1.7] text-[#555555]">
              {review.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

