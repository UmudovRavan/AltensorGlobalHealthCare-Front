import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import patientService from '../services/patientService'

export default function InquiriesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)

  const loadInquiries = useCallback(async () => {
    try {
      const data = await patientService.getInquiries()
      setInquiries(data.items || [])
    } catch (err) {
      console.error('Failed to load inquiries:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadInquiries()
  }, [loadInquiries])

  const displayName =
    user?.fullName ||
    `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
    user?.email ||
    'Patient'

  const getStatusLabel = (status, statusText) => {
    if (statusText) return statusText
    switch (status) {
      case 1:
        return 'Submitted'
      case 2:
        return 'In Review'
      case 3:
        return 'Processing'
      case 4:
        return 'Offer Received'
      case 5:
        return 'Accepted'
      case 6:
        return 'Declined'
      case 7:
        return 'Closed'
      case 8:
        return 'Cancelled'
      default:
        return 'In Review'
    }
  }

  return (
    <div className="min-h-[75vh] bg-white pt-[110px] pb-[120px]">
      <div className="mx-auto max-w-[1240px] px-6">
        {/* Breadcrumbs matching ZagrebMed 1:1 */}
        <nav className="mb-8 flex items-center gap-3 text-[1.35rem] text-[#707070]">
          <Link
            to="/en"
            className="flex items-center text-[#0a295b] transition-colors hover:text-[#3665f6]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </Link>
          <span className="text-[#c0c0c0]">•</span>
          <Link
            to="/en/my-profile"
            className="font-medium text-[#0a295b] transition-colors hover:text-[#3665f6]"
          >
            My Profile
          </Link>
          <span className="text-[#c0c0c0]">•</span>
          <span className="font-medium text-[#3665f6]">Inquiries</span>
        </nav>

        {/* Welcome Header matching ZagrebMed 1:1 */}
        <div className="mb-14">
          <h2 className="text-[1.8rem] font-bold text-[#0c3a94]">Welcome back</h2>
          <h1 className="mt-1 text-[4.2rem] font-bold tracking-tight text-[#3665f6] sm:text-[5.2rem]">
            {displayName}
          </h1>
        </div>

        {/* Clean Table matching ZagrebMed 1:1 */}
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#3665f6] border-t-transparent" />
          </div>
        ) : inquiries.length === 0 ? (
          <div className="border-t border-[#e5e7eb] py-14 text-center">
            <p className="text-[1.6rem] text-[#666666]">
              You have not submitted any inquiries yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="py-4 pr-6 text-[1.2rem] font-semibold tracking-wider text-[#707070] uppercase">
                    INQUIRY
                  </th>
                  <th className="px-6 py-4 text-[1.2rem] font-semibold tracking-wider text-[#707070] uppercase">
                    STATUS
                  </th>
                  <th className="px-6 py-4 text-[1.2rem] font-semibold tracking-wider text-[#707070] uppercase">
                    ASSIGNED HOSPITAL
                  </th>
                  <th className="px-6 py-4 text-[1.2rem] font-semibold tracking-wider text-[#707070] uppercase">
                    PROCEDURE
                  </th>
                  <th className="py-4 pl-6 text-right" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb]">
                {inquiries.map((inq) => {
                  const refCode = inq.inquiryNumber?.startsWith('#')
                    ? inq.inquiryNumber
                    : `#${inq.inquiryNumber || inq.id?.slice(0, 4)}`
                  const statusLabel = getStatusLabel(inq.status, inq.statusText)

                  return (
                    <tr key={inq.id} className="bg-white">
                      <td className="py-6 pr-6 text-[1.5rem] font-bold text-[#0a295b]">
                        {refCode}
                      </td>
                      <td className="px-6 py-6 text-[1.5rem] font-semibold text-[#3665f6]">
                        {statusLabel}
                      </td>
                      <td className="px-6 py-6 text-[1.5rem] font-bold text-[#0a295b]">
                        {inq.clinicName || 'Viaorto'}
                      </td>
                      <td className="max-w-[260px] px-6 py-6 text-[1.5rem] font-bold text-[#0a295b]">
                        {inq.serviceTitle || inq.symptoms || 'Medical Consultation'}
                      </td>
                      <td className="py-6 pl-6 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/en/my-profile/${inq.id}`)}
                          className="inline-flex cursor-pointer items-center justify-center rounded-[8px] border border-[#3665f6] bg-white px-7 py-2.5 text-[1.4rem] font-semibold text-[#3665f6] transition-colors hover:bg-[#3665f6] hover:text-white"
                        >
                          View Inquiry
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
