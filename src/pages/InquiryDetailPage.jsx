import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SERVICE_CATEGORIES } from '../data/services'
import { useAuth } from '../hooks/useAuth'
import { useTranslation } from '../hooks/useTranslation'
import { apiClient } from '../services/apiClient'
import patientService from '../services/patientService'

function formatShortDate(dateValue) {
  if (!dateValue) return '12.11.2026'
  const d = new Date(dateValue)
  if (Number.isNaN(d.getTime())) return String(dateValue)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}.${month}.${year}`
}

function formatDateTime(dateValue) {
  if (!dateValue) return ''
  const d = new Date(dateValue)
  if (Number.isNaN(d.getTime())) return String(dateValue)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const mins = String(d.getMinutes()).padStart(2, '0')
  const secs = String(d.getSeconds()).padStart(2, '0')
  return `${day}.${month}.${year} ${hours}:${mins}:${secs}`
}

const ALL_PROCEDURES = SERVICE_CATEGORIES.flatMap((cat) =>
  (cat.featuredProcedures || []).map((p) => ({
    id: p.slug,
    title: p.name,
    category: cat.name,
  }))
)

export default function InquiryDetailPage() {
  const { inquiryId } = useParams()
  const { user } = useAuth()
  const { t } = useTranslation()

  const [inquiry, setInquiry] = useState(null)
  const [offers, setOffers] = useState([])
  const [messages, setMessages] = useState([])
  const [replyText, setReplyText] = useState('')
  const [sendingMsg, setSendingMsg] = useState(false)
  const [uploadingDoc, setUploadingDoc] = useState(false)
  const [offerAccepted, setOfferAccepted] = useState(false)
  const [loading, setLoading] = useState(true)

  const [selectedProcTitle, setSelectedProcTitle] = useState('')
  const [backendProcedures, setBackendProcedures] = useState([])
  const [procUpdated, setProcUpdated] = useState(false)
  const [updatingProc, setUpdatingProc] = useState(false)

  const fileInputRef = useRef(null)
  const chatBottomRef = useRef(null)
  const sendingMsgRef = useRef(false)

  const loadInquiryData = useCallback(async () => {
    try {
      const [inq, offList, msgList, catRes] = await Promise.all([
        patientService.getInquiryById(inquiryId),
        patientService.getOffers(inquiryId),
        patientService.getMessages(inquiryId),
        apiClient.get('/public/categories').catch(() => null),
      ])
      setInquiry(inq)
      setSelectedProcTitle(inq?.serviceTitle || 'Dental implants all-in-one package')
      setOffers(offList || [])
      setMessages(msgList || [])

      if (Array.isArray(catRes?.data)) {
        const procs = catRes.data.flatMap((c) =>
          (c.services || c.medicalServices || []).map((s) => ({
            id: s.id,
            title: s.title || s.name,
            category: c.name,
          }))
        )
        if (procs.length > 0) setBackendProcedures(procs)
      }
    } catch (err) {
      console.error('Failed to load inquiry details:', err)
    } finally {
      setLoading(false)
    }
  }, [inquiryId])

  useEffect(() => {
    loadInquiryData()
  }, [loadInquiryData])

  const handleUpdateProcedure = async () => {
    if (!selectedProcTitle || selectedProcTitle === inquiry?.serviceTitle) return
    setUpdatingProc(true)
    try {
      const matched = backendProcedures.find((p) => p.title === selectedProcTitle)
      if (matched?.id) {
        await patientService.updateInquiryProcedure(inquiryId, matched.id)
      }
      setInquiry((prev) => ({ ...prev, serviceTitle: selectedProcTitle }))
      setProcUpdated(true)
      setTimeout(() => setProcUpdated(false), 3000)
    } catch (err) {
      console.error('Failed to update procedure:', err)
    } finally {
      setUpdatingProc(false)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!replyText.trim() || sendingMsg || sendingMsgRef.current) return

    sendingMsgRef.current = true
    setSendingMsg(true)
    const textToSend = replyText.trim()
    setReplyText('')
    try {
      const newMsg = await patientService.sendMessage(inquiryId, textToSend)
      setMessages((prev) => [...prev, newMsg])
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (err) {
      setReplyText(textToSend)
      console.error('Failed to send message:', err)
    } finally {
      sendingMsgRef.current = false
      setSendingMsg(false)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingDoc(true)
    try {
      const uploaded = await patientService.uploadDocument(inquiryId, file)
      setInquiry((prev) => ({
        ...prev,
        documents: [...(prev?.documents || []), uploaded],
      }))
    } catch (err) {
      console.error('File upload failed:', err)
    } finally {
      setUploadingDoc(false)
      e.target.value = ''
    }
  }

  const handleDeleteDocument = async (docId) => {
    try {
      await patientService.deleteDocument(inquiryId, docId)
      setInquiry((prev) => ({
        ...prev,
        documents: (prev?.documents || []).filter((d) => d.id !== docId),
      }))
    } catch (err) {
      console.error('Failed to delete doc:', err)
    }
  }

  const handleAcceptOffer = async (offerId) => {
    try {
      await patientService.acceptOffer(offerId)
      setOfferAccepted(true)
      setOffers((prev) =>
        prev.map((o) => (o.id === offerId ? { ...o, status: 'Accepted' } : o))
      )
    } catch (err) {
      console.error('Failed to accept offer:', err)
    }
  }

  const handleDeclineOffer = async (offerId) => {
    try {
      await patientService.declineOffer(offerId)
      setOffers((prev) =>
        prev.map((o) => (o.id === offerId ? { ...o, status: 'Declined' } : o))
      )
    } catch (err) {
      console.error('Failed to decline offer:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-white pt-[110px]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3665f6] border-t-transparent" />
      </div>
    )
  }

  if (!inquiry) {
    return (
      <div className="min-h-[75vh] bg-white pt-[140px] text-center">
        <h2 className="text-[2.6rem] font-bold text-[#0c3a94]">
          {t('inquiryDetail.notFound', 'Inquiry Not Found')}
        </h2>
        <Link
          to="/en/my-profile/inquiries"
          className="mt-6 inline-block rounded-[8px] bg-[#3665f6] px-6 py-3 text-[1.4rem] font-semibold text-white"
        >
          {t('inquiryDetail.backToInquiries', 'Back to Inquiries')}
        </Link>
      </div>
    )
  }

  const refCode = inquiry.inquiryNumber?.startsWith('#')
    ? inquiry.inquiryNumber
    : `#${inquiry.inquiryNumber || '7551'}`
  const statusLabel = inquiry.statusText || t('inquiries.statusInReview', 'In Review')
  const activeOffer = offers[0]
  const isProcDirty = selectedProcTitle !== (inquiry.serviceTitle || '')
  const procedureOptions = Array.from(
    new Set(
      [
        inquiry.serviceTitle,
        ...backendProcedures.map((p) => p.title),
        ...ALL_PROCEDURES.map((p) => p.title),
      ].filter(Boolean)
    )
  )
  const displayName = user?.fullName || inquiry?.patientName || t('inquiries.patientFallback', 'Patient')

  return (
    <div className="min-h-[80vh] bg-white pt-[110px] pb-[120px]">
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
            {t('common.myProfile', 'My Profile')}
          </Link>
          <span className="text-[#c0c0c0]">•</span>
          <span className="font-medium text-[#3665f6]">{refCode}</span>
        </nav>

        {/* Top Summary Header matching ZagrebMed 1:1 */}
        <div className="pb-10">
          <div className="flex flex-wrap items-center gap-6 text-[1.5rem]">
            <span className="font-bold text-[#0a295b]">{refCode}</span>
            <span className="font-bold text-[#0a295b]">
              {t('inquiryDetail.requested', 'Requested')}{' '}
              <span className="ml-2 text-[#3665f6]">
                {formatShortDate(inquiry.createdAt)}
              </span>
            </span>
          </div>

          <h1 className="mt-2 text-[4.2rem] font-bold tracking-tight text-[#0c3a94] sm:text-[5rem]">
            {inquiry.clinicName || 'Viaorto'}
          </h1>

          <div className="mt-2 flex items-center gap-4 text-[1.5rem]">
            <span className="font-bold text-[#0a295b]">{t('inquiryDetail.status', 'Status')}</span>
            <span className="font-bold text-[#3665f6]">{statusLabel}</span>
          </div>

          <div className="mt-7">
            <span className="inline-block rounded-[8px] bg-[#3665f6] px-7 py-3 text-[1.45rem] font-semibold text-white">
              {activeOffer
                ? offerAccepted || activeOffer.status === 'Accepted'
                  ? t('inquiryDetail.offerAccepted', 'Offer Accepted')
                  : t('inquiryDetail.officialOfferAvailable', 'Official Offer Available')
                : t('inquiryDetail.noOffersAvailable', 'No offers available')}
            </span>
          </div>
        </div>

        <hr className="border-t border-[#e5e7eb]" />

        {/* 2-Column Content Section matching ZagrebMed 1:1 */}
        <div className="mt-12 grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* LEFT COLUMN: General procedure information + Message + Attached documents */}
          <div>
            <div className="inline-block rounded-[8px] border border-[#3665f6] px-6 py-2.5 text-[1.6rem] font-semibold text-[#3665f6]">
              {t('inquiryDetail.generalProcedureInfo', 'General procedure information')}
            </div>

            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-[170px_1fr] sm:items-center sm:gap-4">
                <span className="text-[1.25rem] font-bold tracking-wider text-[#0a295b] uppercase">
                  {t('inquiryDetail.category', 'CATEGORY')}
                </span>
                <span className="text-[1.5rem] font-semibold text-[#3665f6]">
                  {inquiry.categoryName || 'All-In-One Packages'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-[170px_1fr] sm:items-start sm:gap-4">
                <span className="pt-3 text-[1.25rem] font-bold tracking-wider text-[#0a295b] uppercase">
                  {t('inquiryDetail.procedure', 'PROCEDURE')}
                </span>
                <div>
                  <select
                    value={selectedProcTitle}
                    onChange={(e) => setSelectedProcTitle(e.target.value)}
                    className="w-full max-w-[360px] rounded-[8px] border border-[#d1d5db] bg-white px-4 py-3 text-[1.5rem] font-semibold text-[#0a295b] outline-none focus:border-[#3665f6]"
                  >
                    {procedureOptions.map((title) => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>

                  <div className="mt-3 flex items-center gap-3">
                    <button
                      type="button"
                      disabled={!isProcDirty || updatingProc}
                      onClick={handleUpdateProcedure}
                      className={`rounded-[8px] px-6 py-2.5 text-[1.4rem] font-semibold text-white transition-colors ${
                        isProcDirty
                          ? 'cursor-pointer bg-[#3665f6] hover:bg-[#0c3a94]'
                          : 'cursor-not-allowed bg-[#bcbcbc]'
                      }`}
                    >
                      {updatingProc
                        ? t('inquiryDetail.updating', 'Updating...')
                        : t('inquiryDetail.update', 'Update')}
                    </button>
                    {procUpdated && (
                      <span className="text-[1.3rem] font-semibold text-[#7fbb58]">
                        {t('inquiryDetail.updated', 'Updated!')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-[170px_1fr] sm:items-center sm:gap-4">
                <span className="text-[1.25rem] font-bold tracking-wider text-[#0a295b] uppercase">
                  {t('inquiryDetail.timeframe', 'TIMEFRAME')}
                </span>
                <span className="text-[1.5rem] font-semibold text-[#3665f6]">
                  {inquiry.preferredTimeframe || t('inquiryDetail.flexible', 'Flexible')}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-[170px_1fr] sm:items-center sm:gap-4">
                <span className="text-[1.25rem] font-bold tracking-wider text-[#0a295b] uppercase">
                  {t('inquiryDetail.accommodation', 'ACCOMMODATION')}
                </span>
                <span className="text-[1.5rem] font-semibold text-[#3665f6]">
                  {inquiry.needsAccommodation
                    ? t('inquiryDetail.yes', 'Yes')
                    : t('inquiryDetail.none', 'None')}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-[170px_1fr] sm:items-center sm:gap-4">
                <span className="text-[1.25rem] font-bold tracking-wider text-[#0a295b] uppercase">
                  {t('inquiryDetail.airplaneTicket', 'AIRPLANE TICKET')}
                </span>
                <span className="text-[1.5rem] font-semibold text-[#3665f6]">
                  {inquiry.needsAirplaneTicket
                    ? t('inquiryDetail.yes', 'Yes')
                    : t('inquiryDetail.no', 'No')}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-[170px_1fr] sm:items-center sm:gap-4">
                <span className="text-[1.25rem] font-bold tracking-wider text-[#0a295b] uppercase">
                  {t('inquiryDetail.airportTransfer', 'AIRPORT TRANSFER')}
                </span>
                <span className="text-[1.5rem] font-semibold text-[#3665f6]">
                  {inquiry.needsAirportTransfer
                    ? t('inquiryDetail.yes', 'Yes')
                    : t('inquiryDetail.no', 'No')}
                </span>
              </div>
            </div>

            {/* Patient Initial Message */}
            <div className="mt-10">
              <h4 className="text-[1.5rem] font-bold text-[#0c3a94]">
                {t('inquiryDetail.message', 'Message')}
              </h4>
              <p className="mt-2 whitespace-pre-wrap text-[1.45rem] text-[#555555]">
                {inquiry.symptoms || t('inquiryDetail.noMessageProvided', 'No message provided.')}
              </p>
            </div>

            {/* Attached documents */}
            <div className="mt-12">
              <div className="inline-block rounded-[8px] border border-[#3665f6] px-6 py-2.5 text-[1.6rem] font-semibold text-[#3665f6]">
                {t('inquiryDetail.attachedDocuments', 'Attached documents')}
              </div>

              <p className="mt-4 text-[1.45rem] text-[#555555]">
                {t('inquiryDetail.attachDocsHint', 'Please attach your existing medical documentation')}
              </p>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.dcm"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingDoc}
                className="zm-btn zm-btn-green mt-4 rounded-[8px] !px-6 !py-2.5 !text-[1.4rem] font-semibold"
              >
                <span>
                  {uploadingDoc
                    ? t('inquiryDetail.uploading', 'Uploading...')
                    : t('inquiryDetail.addNewFile', 'Add new file')}
                </span>
              </button>

              {inquiry.documents && inquiry.documents.length > 0 && (
                <div className="mt-5 space-y-2.5">
                  {inquiry.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-[8px] border border-[#e5e7eb] bg-[#f8faff] px-4 py-2.5 text-[1.4rem]"
                    >
                      <span className="truncate font-medium text-[#0a295b]">
                        {doc.originalFileName || doc.fileName}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="ml-3 cursor-pointer text-[1.3rem] font-semibold text-red-500 hover:underline"
                      >
                        {t('inquiryDetail.remove', 'Remove')}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Official Offer Card (only shown when clinic sends an offer) */}
            {activeOffer && (
              <div className="mt-12 rounded-[10px] border border-[#3665f6] bg-[#f8faff] p-6">
                <h4 className="text-[1.8rem] font-bold text-[#0c3a94]">
                  {t('inquiryDetail.officialClinicOffer', 'Official Clinic Offer')} — {activeOffer.clinicName}
                </h4>
                <div className="mt-4 space-y-2 border-t border-[#e5e7eb] pt-4 text-[1.45rem]">
                  <div className="flex justify-between">
                    <span className="text-[#555555]">
                      {t('inquiryDetail.treatmentCost', 'Treatment Cost')}
                    </span>
                    <span className="font-bold text-[#0a295b]">
                      € {(activeOffer.medicalTreatmentPrice ?? activeOffer.treatmentPrice ?? 0).toLocaleString()}
                    </span>
                  </div>
                  {(activeOffer.accommodationPrice ?? 0) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#555555]">
                        {t('inquiryDetail.accommodationLabel', 'Accommodation')}
                      </span>
                      <span className="font-bold text-[#0a295b]">
                        € {activeOffer.accommodationPrice.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {(activeOffer.airportTransferPrice ?? 0) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#555555]">
                        {t('inquiryDetail.airportTransferLabel', 'Airport Transfer')}
                      </span>
                      <span className="font-bold text-[#0a295b]">
                        € {activeOffer.airportTransferPrice.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {(activeOffer.airplaneTicketPrice ?? 0) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#555555]">
                        {t('inquiryDetail.airplaneTicketLabel', 'Airplane Ticket')}
                      </span>
                      <span className="font-bold text-[#0a295b]">
                        € {activeOffer.airplaneTicketPrice.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-[#e5e7eb] pt-2">
                    <span className="font-bold text-[#0a295b]">
                      {t('inquiryDetail.totalPackage', 'Total Package')}
                    </span>
                    <span className="font-bold text-[#3665f6]">
                      € {(activeOffer.totalPrice ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                {!offerAccepted && activeOffer.status !== 'Accepted' && (
                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleAcceptOffer(activeOffer.id)}
                      className="zm-btn zm-btn-green rounded-[8px] !px-6 !py-2.5 !text-[1.35rem] font-semibold"
                    >
                      <span>{t('inquiryDetail.acceptOffer', 'Accept Offer')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeclineOffer(activeOffer.id)}
                      className="cursor-pointer rounded-[8px] border border-[#d1d5db] bg-white px-6 py-2.5 text-[1.35rem] font-semibold text-[#555555] hover:bg-gray-50"
                    >
                      {t('inquiryDetail.decline', 'Decline')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Messages */}
          <div>
            <div className="inline-block rounded-[8px] border border-[#3665f6] px-6 py-2.5 text-[1.6rem] font-semibold text-[#3665f6]">
              {t('inquiryDetail.messages', 'Messages')}
            </div>

            <form onSubmit={handleSendMessage} className="mt-8">
              <label className="block text-[1.4rem] font-semibold text-[#3665f6]">
                {t('inquiryDetail.yourMessage', 'Your message')}
              </label>
              <textarea
                rows={5}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="mt-2 w-full rounded-[8px] border border-[#9ca3af] p-4 text-[1.45rem] text-[#0a295b] outline-none transition-colors focus:border-[#3665f6]"
              />
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={sendingMsg || !replyText.trim()}
                  className={`rounded-[8px] px-8 py-2.5 text-[1.45rem] font-semibold text-white transition-colors ${
                    replyText.trim()
                      ? 'cursor-pointer bg-[#3665f6] hover:bg-[#0c3a94]'
                      : 'cursor-not-allowed bg-[#bcbcbc]'
                  }`}
                >
                  {sendingMsg
                    ? t('inquiryDetail.sending', 'Sending...')
                    : t('inquiryDetail.reply', 'Reply')}
                </button>
              </div>
            </form>

            {messages.length > 0 && (
              <div className="mt-8 space-y-8">
                {[...messages].reverse().map((msg) => {
                  const isPatient = msg.senderRole === 'Patient'
                  return (
                    <div key={msg.id}>
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#3665f6] text-white">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-[1.5rem] font-bold leading-tight text-[#3665f6]">
                            {isPatient
                              ? displayName
                              : msg.senderName || t('inquiryDetail.coordinator', 'Coordinator')}
                          </div>
                          <div className="mt-0.5 text-[1.15rem] font-bold text-[#0a295b]">
                            {formatDateTime(msg.createdAtUtc || msg.sentAt)}
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 whitespace-pre-wrap text-[1.45rem] text-[#555555]">
                        {msg.body || msg.messageText}
                      </p>
                    </div>
                  )
                })}
                <div ref={chatBottomRef} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
