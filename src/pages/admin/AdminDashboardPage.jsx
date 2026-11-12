import {
  Building2,
  ExternalLink,
  FileText,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Pencil,
  Plus,
  Search,
  Send,
  Stethoscope,
  Trash2,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminDashboardOverview from '../../components/admin/AdminDashboardOverview'
import AdminEntityModal from '../../components/admin/AdminEntityModal'
import AltensorLogo from '../../components/common/AltensorLogo'
import { useAuth } from '../../hooks/useAuth'
import { useTranslation } from '../../hooks/useTranslation'
import adminService, { hasAdminRole } from '../../services/adminService'
import AdminLoginPage from './AdminLoginPage'

const INQUIRY_STATUSES = [
  { value: 1, label: 'Submitted' },
  { value: 2, label: 'In Review' },
  { value: 3, label: 'Processing' },
  { value: 4, label: 'Offer Received' },
  { value: 5, label: 'Accepted' },
  { value: 6, label: 'Declined' },
  { value: 7, label: 'Closed' },
  { value: 8, label: 'Cancelled' },
]

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function AdminDashboardPage() {
  const { user, token, isAuthenticated, logout } = useAuth()
  const { t, language, setLanguage } = useTranslation()
  const isAdmin = isAuthenticated && hasAdminRole(user, token)

  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  // Data states
  const [dashboard, setDashboard] = useState(null)
  const [inquiries, setInquiries] = useState([])
  const [inqSearch, setInqSearch] = useState('')
  const [inqStatusFilter, setInqStatusFilter] = useState('ALL')
  const [clinics, setClinics] = useState([])
  const [doctors, setDoctors] = useState([])
  const [doctorsApiError, setDoctorsApiError] = useState(false)
  const [categories, setCategories] = useState([])
  const [packages, setPackages] = useState([])

  // Inquiry management drawer state
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [inqMessages, setInqMessages] = useState([])
  const [replyText, setReplyText] = useState('')
  const [sendingReply, setSendingReply] = useState(false)
  const sendingReplyRef = useRef(false)
  const [assignDoctorId, setAssignDoctorId] = useState('')
  const [newStatus, setNewStatus] = useState(1)
  const [offerForm, setOfferForm] = useState({
    clinicId: '',
    treatmentCost: '',
    accommodationCost: '0',
    transferCost: '0',
    flightCost: '0',
    notes: '',
  })

  // Creation & edit modals
  const [modalType, setModalType] = useState(null) // 'clinic' | 'doctor' | 'category' | 'service' | 'package'
  const [editingEntity, setEditingEntity] = useState(null) // { type: 'clinic' | 'doctor', data }
  const [modalSubmitting, setModalSubmitting] = useState(false)
  const [clinicLogoFile, setClinicLogoFile] = useState(null)
  const [clinicCoverFile, setClinicCoverFile] = useState(null)
  const [doctorPhotoFile, setDoctorPhotoFile] = useState(null)
  const [packageCoverFile, setPackageCoverFile] = useState(null)
  const [clinicForm, setClinicForm] = useState({
    name: '',
    slug: '',
    city: 'Zagreb',
    address: '',
    phone: '',
    email: '',
    descriptionEn: '',
    displayOrder: 1,
  })
  const [doctorForm, setDoctorForm] = useState({
    clinicId: '',
    fullName: '',
    titleEn: '',
    specializationEn: '',
    experienceYears: 10,
    email: '',
    phone: '',
    bioEn: '',
    displayOrder: 1,
  })
  const [categoryForm, setCategoryForm] = useState({
    titleAz: '',
    titleEn: '',
    titleRu: '',
    slug: '',
    descriptionEn: '',
    displayOrder: 1,
  })
  const [serviceForm, setServiceForm] = useState({
    categoryId: '',
    titleAz: '',
    titleEn: '',
    slug: '',
    aboutEn: '',
    durationText: '1-2 hours',
    isMostSearched: false,
    displayOrder: 1,
  })
  const [packageForm, setPackageForm] = useState({
    titleAz: '',
    titleEn: '',
    slug: '',
    descriptionEn: '',
    includesEn: '',
    priceFrom: 1500,
    currency: 'EUR',
    displayOrder: 1,
  })

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  const loadTabData = useCallback(async () => {
    if (!isAdmin) return
    setLoading(true)
    try {
      if (activeTab === 'dashboard') {
        const [dash, inqData] = await Promise.all([
          adminService.getDashboard(),
          adminService.getInquiries({ pageSize: 50 }).catch(() => ({ items: [] })),
        ])
        setDashboard(dash)
        setInquiries(inqData?.items || [])
      } else if (activeTab === 'inquiries') {
        const [inqData, docList, clinicList] = await Promise.all([
          adminService.getInquiries({ status: inqStatusFilter, search: inqSearch }),
          adminService.getDoctors().catch(() => {
            setDoctorsApiError(true)
            return []
          }),
          adminService.getClinics(),
        ])
        setInquiries(inqData?.items || [])
        setDoctors(docList || [])
        setClinics(clinicList || [])
      } else if (activeTab === 'clinics') {
        const list = await adminService.getClinics()
        setClinics(list || [])
      } else if (activeTab === 'doctors') {
        setDoctorsApiError(false)
        const [docList, clinicList] = await Promise.all([
          adminService.getDoctors().catch(() => {
            setDoctorsApiError(true)
            return []
          }),
          adminService.getClinics(),
        ])
        setDoctors(docList || [])
        setClinics(clinicList || [])
      } else if (activeTab === 'categories') {
        const catList = await adminService.getCategories()
        setCategories(catList || [])
      } else if (activeTab === 'packages') {
        const pkgList = await adminService.getPackages()
        setPackages(pkgList || [])
      }
    } catch (err) {
      console.error('Admin load error:', err)
    } finally {
      setLoading(false)
    }
  }, [activeTab, inqSearch, inqStatusFilter, isAdmin, language])

  useEffect(() => {
    loadTabData()
  }, [loadTabData])

  if (!isAdmin) {
    return <AdminLoginPage onAdminAuthenticated={() => loadTabData()} />
  }

  const openManageInquiry = async (inqId) => {
    try {
      const [detail, msgs, docList, clinicList] = await Promise.all([
        adminService.getInquiryById(inqId),
        adminService.getMessages(inqId),
        doctors.length
          ? Promise.resolve(doctors)
          : adminService.getDoctors().catch(() => []),
        clinics.length ? Promise.resolve(clinics) : adminService.getClinics(),
      ])
      setSelectedInquiry(detail)
      setInqMessages(msgs || [])
      setDoctors(docList || [])
      setClinics(clinicList || [])
      setNewStatus(detail?.status ?? 1)
      setAssignDoctorId(detail?.assignedDoctorId || docList?.[0]?.id || '')
      setOfferForm((prev) => ({
        ...prev,
        clinicId: detail?.clinicId || clinicList?.[0]?.id || '',
      }))
    } catch (err) {
      showToast(err?.message || 'Could not load inquiry details')
    }
  }

  const handleStatusUpdate = async () => {
    if (!selectedInquiry) return
    try {
      await adminService.updateInquiryStatus(selectedInquiry.id, newStatus)
      showToast('Inquiry status updated!')
      openManageInquiry(selectedInquiry.id)
      loadTabData()
    } catch (err) {
      showToast(err?.message || 'Status update failed')
    }
  }

  const handleAssignDoctor = async () => {
    if (!selectedInquiry || !assignDoctorId) return
    try {
      await adminService.assignDoctor(selectedInquiry.id, assignDoctorId)
      showToast('Doctor assigned successfully!')
      openManageInquiry(selectedInquiry.id)
      loadTabData()
    } catch (err) {
      showToast(err?.message || 'Assign doctor failed')
    }
  }

  const handleCreateAndSendOffer = async (e) => {
    e.preventDefault()
    if (!selectedInquiry) return
    try {
      const created = await adminService.createOffer(selectedInquiry.id, {
        ...offerForm,
        doctorId: assignDoctorId || undefined,
      })
      if (created?.id) {
        await adminService.sendOffer(created.id)
      }
      showToast('Official offer created and sent to patient!')
      setOfferForm({
        clinicId: offerForm.clinicId,
        treatmentCost: '',
        accommodationCost: '0',
        transferCost: '0',
        flightCost: '0',
        notes: '',
      })
      openManageInquiry(selectedInquiry.id)
      loadTabData()
    } catch (err) {
      showToast(err?.message || 'Failed to create/send offer')
    }
  }

  const handleSendAdminReply = async (e) => {
    e.preventDefault()
    if (!selectedInquiry || !replyText.trim() || sendingReplyRef.current) return
    sendingReplyRef.current = true
    setSendingReply(true)
    const textToSend = replyText.trim()
    setReplyText('')
    try {
      const msg = await adminService.sendMessage(selectedInquiry.id, textToSend)
      setInqMessages((prev) => [...prev, msg])
      showToast('Reply sent to patient!')
    } catch (err) {
      setReplyText(textToSend)
      showToast(err?.message || 'Failed to send reply')
    } finally {
      sendingReplyRef.current = false
      setSendingReply(false)
    }
  }

  const resetModalState = () => {
    setModalType(null)
    setEditingEntity(null)
    setClinicLogoFile(null)
    setClinicCoverFile(null)
    setDoctorPhotoFile(null)
    setPackageCoverFile(null)
  }

  const openCreateClinic = () => {
    setEditingEntity(null)
    setClinicLogoFile(null)
    setClinicCoverFile(null)
    setClinicForm({
      name: '',
      slug: '',
      city: 'Zagreb',
      address: '',
      phone: '',
      email: '',
      descriptionEn: '',
      displayOrder: 1,
    })
    setModalType('clinic')
  }

  const openEditClinic = (c) => {
    setEditingEntity({ type: 'clinic', data: c })
    setClinicLogoFile(null)
    setClinicCoverFile(null)
    setClinicForm({
      name: c.name || '',
      slug: c.slug || '',
      city: c.city || 'Zagreb',
      address: c.address || '',
      phone: c.phone || '',
      email: c.email || '',
      descriptionEn: c.description || c.descriptionEn || '',
      displayOrder: c.displayOrder || 1,
    })
    setModalType('clinic')
  }

  const openCreateDoctor = () => {
    setEditingEntity(null)
    setDoctorPhotoFile(null)
    setDoctorForm({
      clinicId: clinics?.[0]?.id || '',
      fullName: '',
      titleEn: '',
      specializationEn: '',
      experienceYears: 10,
      email: '',
      phone: '',
      bioEn: '',
      displayOrder: 1,
    })
    setModalType('doctor')
  }

  const openEditDoctor = (d) => {
    setEditingEntity({ type: 'doctor', data: d })
    setDoctorPhotoFile(null)
    setDoctorForm({
      clinicId: d.clinicId || clinics?.[0]?.id || '',
      fullName: d.fullName || '',
      titleEn: d.title || d.titleEn || '',
      specializationEn: d.specialization || d.specializationEn || '',
      experienceYears: d.experienceYears ?? 10,
      email: d.email || '',
      phone: d.phone || '',
      bioEn: d.bio || d.bioEn || '',
      displayOrder: d.displayOrder || 1,
    })
    setModalType('doctor')
  }

  // Create & Update handlers
  const handleCreateClinic = async (e) => {
    e.preventDefault()
    if (modalSubmitting) return
    setModalSubmitting(true)
    try {
      const isEdit = editingEntity?.type === 'clinic'
      const payload = {
        ...clinicForm,
        slug: clinicForm.slug || slugify(clinicForm.name),
        descriptionAz: clinicForm.descriptionAz || clinicForm.descriptionEn,
        ...(isEdit ? { isActive: editingEntity.data?.isActive ?? true } : {}),
      }
      const saved = isEdit
        ? await adminService.updateClinic(editingEntity.data.id, payload)
        : await adminService.createClinic(payload)
      const targetId = saved?.id || editingEntity?.data?.id
      if (targetId && clinicLogoFile) {
        await adminService.uploadClinicLogo(targetId, clinicLogoFile)
      }
      if (targetId && clinicCoverFile) {
        await adminService.uploadClinicCover(targetId, clinicCoverFile)
      }
      resetModalState()
      showToast(isEdit ? 'Clinic updated!' : 'Clinic created!')
      loadTabData()
    } catch (err) {
      showToast(err?.message || 'Failed to save clinic')
    } finally {
      setModalSubmitting(false)
    }
  }

  const handleCreateDoctor = async (e) => {
    e.preventDefault()
    if (modalSubmitting) return
    setModalSubmitting(true)
    try {
      const isEdit = editingEntity?.type === 'doctor'
      const payload = {
        ...doctorForm,
        titleAz: doctorForm.titleAz || doctorForm.titleEn,
        specializationAz: doctorForm.specializationAz || doctorForm.specializationEn,
        bioAz: doctorForm.bioAz || doctorForm.bioEn,
        experienceYears: Number(doctorForm.experienceYears) || 0,
        ...(isEdit ? { isActive: editingEntity.data?.isActive ?? true } : {}),
      }
      const saved = isEdit
        ? await adminService.updateDoctor(editingEntity.data.id, payload)
        : await adminService.createDoctor(payload)
      const targetId = saved?.id || editingEntity?.data?.id
      if (targetId && doctorPhotoFile) {
        await adminService.uploadDoctorPhoto(targetId, doctorPhotoFile)
      }
      resetModalState()
      showToast(isEdit ? 'Doctor updated!' : 'Doctor added!')
      loadTabData()
    } catch (err) {
      showToast(err?.message || 'Failed to save doctor')
    } finally {
      setModalSubmitting(false)
    }
  }

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    if (modalSubmitting) return
    setModalSubmitting(true)
    try {
      await adminService.createCategory({
        ...categoryForm,
        titleAz: categoryForm.titleAz || categoryForm.titleEn,
        slug: categoryForm.slug || slugify(categoryForm.titleEn || categoryForm.titleAz),
      })
      resetModalState()
      showToast('Category created!')
      loadTabData()
    } catch (err) {
      showToast(err?.message || 'Failed to create category')
    } finally {
      setModalSubmitting(false)
    }
  }

  const handleCreateService = async (e) => {
    e.preventDefault()
    if (modalSubmitting) return
    setModalSubmitting(true)
    try {
      await adminService.createService({
        ...serviceForm,
        titleAz: serviceForm.titleAz || serviceForm.titleEn,
        slug: serviceForm.slug || slugify(serviceForm.titleEn || serviceForm.titleAz),
      })
      resetModalState()
      showToast('Medical service created!')
      loadTabData()
    } catch (err) {
      showToast(err?.message || 'Failed to create service')
    } finally {
      setModalSubmitting(false)
    }
  }

  const handleCreatePackage = async (e) => {
    e.preventDefault()
    if (modalSubmitting) return
    setModalSubmitting(true)
    try {
      const saved = await adminService.createPackage({
        ...packageForm,
        titleAz: packageForm.titleAz || packageForm.titleEn,
        slug: packageForm.slug || slugify(packageForm.titleEn || packageForm.titleAz),
        priceFrom: Number(packageForm.priceFrom) || 0,
      })
      if (saved?.id && packageCoverFile) {
        await adminService.uploadPackageCover(saved.id, packageCoverFile)
      }
      resetModalState()
      showToast('Treatment package created!')
      loadTabData()
    } catch (err) {
      showToast(err?.message || 'Failed to create package')
    } finally {
      setModalSubmitting(false)
    }
  }

  const navItems = [
    { id: 'dashboard', label: t('admin.nav.dashboard'), icon: LayoutDashboard },
    { id: 'inquiries', label: t('admin.nav.inquiries'), icon: FileText },
    { id: 'clinics', label: t('admin.nav.clinics'), icon: Building2 },
    { id: 'doctors', label: t('admin.nav.doctors'), icon: Stethoscope },
    { id: 'categories', label: t('admin.nav.categories'), icon: FolderTree },
    { id: 'packages', label: t('admin.nav.packages'), icon: Package },
  ]

  return (
    <div className="flex min-h-screen bg-[#fafbfc] text-[#0a295b]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed right-6 bottom-6 z-[1500] rounded-[8px] bg-[#0c3a94] px-5 py-3 text-[1.4rem] font-semibold text-white shadow-xl">
          {toast}
        </div>
      )}

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[265px] flex-col border-r border-[#e8edf5] bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-[#e8edf5] px-6">
          <Link to="/en">
            <AltensorLogo className="h-9 w-auto" />
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="cursor-pointer p-1 text-[#707070] lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="px-4 py-5">
          <p className="mb-3 px-3 text-[1.1rem] font-bold tracking-wider text-[#9ca3af] uppercase">
            Admin Console
          </p>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = activeTab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-[8px] px-4 py-3 text-left text-[1.4rem] font-semibold transition-colors ${
                    active
                      ? 'bg-[#3665f6] text-white'
                      : 'text-[#0a295b] hover:bg-[#f0f4ff] hover:text-[#3665f6]'
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-[#e8edf5] p-4 space-y-2">
          <Link
            to="/en"
            className="flex w-full items-center gap-3 rounded-[8px] px-4 py-2.5 text-[1.35rem] font-semibold text-[#0c3a94] hover:bg-[#f0f4ff]"
          >
            <ExternalLink className="h-4 w-4" />
            <span>{t('common.backToWebsite')}</span>
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full cursor-pointer items-center gap-3 rounded-[8px] px-4 py-2.5 text-[1.35rem] font-semibold text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            <span>{t('common.signOut')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Top Bar */}
        <header className="flex h-[76px] items-center justify-between border-b border-[#e8edf5] bg-white px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="cursor-pointer rounded-[8px] border border-[#e8edf5] p-2 text-[#0a295b] lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-[2.2rem] font-bold text-[#0c3a94]">
              {navItems.find((i) => i.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex rounded-full border border-[#dbe4f3] bg-[#f8faff] p-0.5">
              {['en', 'az'].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLanguage(code)}
                  className={`cursor-pointer rounded-full px-3 py-1 text-[1.15rem] font-bold uppercase transition-colors ${
                    language === code
                      ? 'bg-[#3665f6] text-white shadow-2xs'
                      : 'text-[#64748b] hover:text-[#0c3a94]'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
            <span className="hidden rounded-full bg-[#e8f5e9] px-3 py-1 text-[1.2rem] font-bold text-[#2e7d32] sm:inline-block">
              {t('admin.roleBadge')}
            </span>
            <span className="text-[1.4rem] font-semibold text-[#0a295b]">
              {user?.fullName || user?.email}
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3665f6] border-t-transparent" />
            </div>
          ) : (
            <>
              {/* TAB 1: DASHBOARD */}
              {activeTab === 'dashboard' && dashboard && (
                <AdminDashboardOverview
                  dashboard={dashboard}
                  inquiries={inquiries}
                  onNavigateTab={setActiveTab}
                  onOpenManageInquiry={openManageInquiry}
                  onOpenCreateClinic={openCreateClinic}
                  onOpenCreateDoctor={openCreateDoctor}
                />
              )}

              {/* TAB 2: INQUIRIES */}
              {activeTab === 'inquiries' && (
                <div className="rounded-[12px] border border-[#e8edf5] bg-white p-6 shadow-xs">
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="relative w-full max-w-[340px]">
                      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                      <input
                        type="text"
                        value={inqSearch}
                        onChange={(e) => setInqSearch(e.target.value)}
                        placeholder="Search by number or symptoms..."
                        className="w-full rounded-[8px] border border-[#d1d5db] py-2.5 pl-10 pr-4 text-[1.4rem] outline-none focus:border-[#3665f6]"
                      />
                    </div>
                    <select
                      value={inqStatusFilter}
                      onChange={(e) => setInqStatusFilter(e.target.value)}
                      className="rounded-[8px] border border-[#d1d5db] px-4 py-2.5 text-[1.4rem] font-semibold outline-none focus:border-[#3665f6]"
                    >
                      <option value="ALL">All Statuses</option>
                      {INQUIRY_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[780px] border-collapse text-left">
                      <thead>
                        <tr className="border-b border-[#e5e7eb] text-[1.2rem] font-bold text-[#707070] uppercase">
                          <th className="py-3 pr-4">Inquiry</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Offers</th>
                          <th className="px-4 py-3">Docs</th>
                          <th className="px-4 py-3">Procedure</th>
                          <th className="py-3 pl-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e5e7eb] text-[1.4rem]">
                        {inquiries.map((inq) => (
                          <tr key={inq.id}>
                            <td className="py-4 pr-4 font-bold text-[#0a295b]">
                              #{inq.inquiryNumber}
                            </td>
                            <td className="px-4 py-4 font-semibold text-[#3665f6]">
                              {inq.statusText}
                            </td>
                            <td className="px-4 py-4 font-semibold text-[#0a295b]">
                              {inq.offersCount ?? 0}
                            </td>
                            <td className="px-4 py-4">{inq.documentsCount ?? 0}</td>
                            <td className="max-w-[240px] truncate px-4 py-4">
                              {inq.serviceTitle || inq.symptoms}
                            </td>
                            <td className="py-4 pl-4 text-right">
                              <button
                                type="button"
                                onClick={() => openManageInquiry(inq.id)}
                                className="cursor-pointer rounded-[8px] border border-[#3665f6] px-5 py-2 text-[1.3rem] font-semibold text-[#3665f6] hover:bg-[#3665f6] hover:text-white"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: CLINICS */}
              {activeTab === 'clinics' && (
                <div className="rounded-[12px] border border-[#e8edf5] bg-white p-6 shadow-xs">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-[2rem] font-bold text-[#0c3a94]">
                      Partner Clinics ({clinics.length})
                    </h2>
                    <button
                      type="button"
                      onClick={openCreateClinic}
                      className="zm-btn zm-btn-green rounded-[8px] !px-6 !py-2.5 !text-[1.35rem]"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Add Clinic
                      </span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {clinics.map((c) => (
                      <div
                        key={c.id}
                        className="flex flex-col justify-between overflow-hidden rounded-[12px] border border-[#e8edf5] bg-[#fafbfc] transition-shadow hover:shadow-md"
                      >
                        <div>
                          {c.coverImageUrl && (
                            <div className="h-[120px] w-full overflow-hidden bg-[#e8edf5]">
                              <img
                                src={c.coverImageUrl}
                                alt={c.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div className="p-5">
                            <div className="flex items-center gap-3">
                              {c.logoUrl && (
                                <img
                                  src={c.logoUrl}
                                  alt={`${c.name} logo`}
                                  className="h-11 w-11 shrink-0 rounded-[8px] border border-[#e8edf5] bg-white object-contain p-1"
                                />
                              )}
                              <div>
                                <h3 className="text-[1.75rem] font-bold text-[#0c3a94]">{c.name}</h3>
                                <p className="text-[1.25rem] font-semibold text-[#3665f6]">
                                  {c.city || 'Zagreb'}
                                </p>
                              </div>
                            </div>
                            <p className="mt-2.5 line-clamp-2 text-[1.35rem] text-[#555555]">
                              {c.description || c.address}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-[#e8edf5] bg-white px-5 py-3">
                          <button
                            type="button"
                            onClick={() => openEditClinic(c)}
                            className="inline-flex cursor-pointer items-center gap-1.5 text-[1.3rem] font-semibold text-[#3665f6] hover:underline"
                          >
                            <Pencil className="h-4 w-4" /> Edit &amp; Photos
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await adminService.deleteClinic(c.id)
                              showToast('Clinic deleted')
                              loadTabData()
                            }}
                            className="inline-flex cursor-pointer items-center gap-1.5 text-[1.3rem] font-semibold text-red-600 hover:underline"
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: DOCTORS */}
              {activeTab === 'doctors' && (
                <div className="rounded-[12px] border border-[#e8edf5] bg-white p-6 shadow-xs">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-[2rem] font-bold text-[#0c3a94]">
                      Medical Specialists ({doctors.length})
                    </h2>
                    <button
                      type="button"
                      onClick={openCreateDoctor}
                      className="zm-btn zm-btn-green rounded-[8px] !px-6 !py-2.5 !text-[1.35rem]"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Add Doctor
                      </span>
                    </button>
                  </div>
                  {doctorsApiError && (
                    <div className="mb-6 rounded-[8px] border border-amber-300 bg-amber-50 p-4 text-[1.35rem] text-amber-900">
                      <strong>Backend API Notice:</strong> <code>GET /api/public/doctors</code> returned HTTP 500 (missing <code>.Include(d =&gt; d.Clinic)</code> in <code>PublicPortalService.cs</code>). You can still add new doctors below, and the list will appear automatically once the backend fix is applied.
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {doctors.map((d) => (
                      <div
                        key={d.id}
                        className="flex flex-col justify-between overflow-hidden rounded-[12px] border border-[#e8edf5] bg-[#fafbfc] transition-shadow hover:shadow-md"
                      >
                        <div className="flex items-start gap-4 p-5">
                          {d.photoUrl ? (
                            <img
                              src={d.photoUrl}
                              alt={d.fullName}
                              className="h-16 w-16 shrink-0 rounded-full border border-[#dbe4f3] object-cover"
                            />
                          ) : (
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#e6eeff] text-[1.8rem] font-bold text-[#0c3a94]">
                              {d.fullName?.charAt(0) || 'D'}
                            </div>
                          )}
                          <div className="min-w-0">
                            <h3 className="truncate text-[1.7rem] font-bold text-[#0c3a94]">
                              {d.fullName}
                            </h3>
                            <p className="mt-0.5 text-[1.3rem] font-semibold text-[#3665f6]">
                              {d.specialization || d.title}
                            </p>
                            <p className="mt-1 text-[1.25rem] text-[#707070]">
                              {d.clinicName} • {d.experienceYears} yrs exp
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-[#e8edf5] bg-white px-5 py-3">
                          <button
                            type="button"
                            onClick={() => openEditDoctor(d)}
                            className="inline-flex cursor-pointer items-center gap-1.5 text-[1.3rem] font-semibold text-[#3665f6] hover:underline"
                          >
                            <Pencil className="h-4 w-4" /> Edit &amp; Photo
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await adminService.deleteDoctor(d.id)
                              showToast('Doctor deleted')
                              loadTabData()
                            }}
                            className="inline-flex cursor-pointer items-center gap-1.5 text-[1.3rem] font-semibold text-red-600 hover:underline"
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: CATEGORIES & SERVICES */}
              {activeTab === 'categories' && (
                <div className="rounded-[12px] border border-[#e8edf5] bg-white p-6 shadow-xs">
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-[2rem] font-bold text-[#0c3a94]">
                      Medical Categories & Services
                    </h2>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setModalType('category')}
                        className="cursor-pointer rounded-[8px] border border-[#3665f6] px-5 py-2.5 text-[1.35rem] font-semibold text-[#3665f6] hover:bg-[#3665f6] hover:text-white"
                      >
                        + Add Category
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setServiceForm((prev) => ({
                            ...prev,
                            categoryId: categories?.[0]?.id || '',
                          }))
                          setModalType('service')
                        }}
                        className="zm-btn zm-btn-green rounded-[8px] !px-5 !py-2.5 !text-[1.35rem]"
                      >
                        <span>+ Add Service</span>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="rounded-[10px] border border-[#e8edf5] bg-[#fafbfc] p-5"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-[1.7rem] font-bold text-[#0c3a94]">{cat.name}</h3>
                          <button
                            type="button"
                            onClick={async () => {
                              await adminService.deleteCategory(cat.id)
                              showToast('Category deleted')
                              loadTabData()
                            }}
                            className="cursor-pointer text-[1.3rem] font-semibold text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                        {cat.services && cat.services.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {cat.services.map((srv) => (
                              <span
                                key={srv.id}
                                className="inline-flex items-center gap-2 rounded-full border border-[#d1d5db] bg-white px-3.5 py-1 text-[1.25rem] font-semibold text-[#0a295b]"
                              >
                                {srv.title}
                                <button
                                  type="button"
                                  onClick={async () => {
                                    await adminService.deleteService(srv.id)
                                    showToast('Service deleted')
                                    loadTabData()
                                  }}
                                  className="cursor-pointer text-red-500 hover:text-red-700"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: PACKAGES */}
              {activeTab === 'packages' && (
                <div className="rounded-[12px] border border-[#e8edf5] bg-white p-6 shadow-xs">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-[2rem] font-bold text-[#0c3a94]">
                      All-In-One Treatment Packages ({packages.length})
                    </h2>
                    <button
                      type="button"
                      onClick={() => setModalType('package')}
                      className="zm-btn zm-btn-green rounded-[8px] !px-6 !py-2.5 !text-[1.35rem]"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Add Package
                      </span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className="flex flex-col justify-between overflow-hidden rounded-[12px] border border-[#e8edf5] bg-[#fafbfc] transition-shadow hover:shadow-md"
                      >
                        <div>
                          {pkg.coverImageUrl && (
                            <div className="h-[120px] w-full overflow-hidden bg-[#e8edf5]">
                              <img
                                src={pkg.coverImageUrl}
                                alt={pkg.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div className="p-5">
                            <h3 className="text-[1.75rem] font-bold text-[#0c3a94]">{pkg.title}</h3>
                            <p className="mt-1 text-[1.6rem] font-bold text-[#7fbb58]">
                              From € {pkg.priceFrom?.toLocaleString()}
                            </p>
                            <p className="mt-2 line-clamp-2 text-[1.35rem] text-[#555555]">
                              {pkg.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-end border-t border-[#e8edf5] bg-white px-5 py-3">
                          <button
                            type="button"
                            onClick={async () => {
                              await adminService.deletePackage(pkg.id)
                              showToast('Package deleted')
                              loadTabData()
                            }}
                            className="inline-flex cursor-pointer items-center gap-1.5 text-[1.3rem] font-semibold text-red-600 hover:underline"
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* INQUIRY MANAGEMENT SLIDE-OVER DRAWER */}
      {selectedInquiry && (
        <div
          className="fixed inset-0 z-[1300] flex justify-end bg-black/30 backdrop-blur-[4px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedInquiry(null)
          }}
        >
          <div className="relative flex h-full w-full max-w-[720px] flex-col overflow-y-auto bg-white p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedInquiry(null)}
              className="absolute right-6 top-6 cursor-pointer rounded-full p-2 text-[#0a295b] hover:bg-slate-100"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-[2.8rem] font-bold text-[#0c3a94]">
              Inquiry #{selectedInquiry.inquiryNumber}
            </h2>
            <p className="mt-1 text-[1.45rem] font-semibold text-[#3665f6]">
              Patient: {selectedInquiry.patientName} ({selectedInquiry.patientEmail})
            </p>
            <p className="mt-3 rounded-[8px] bg-[#f8faff] p-4 text-[1.4rem] text-[#0a295b]">
              <strong>Symptoms / Message:</strong> {selectedInquiry.symptoms}
            </p>

            {/* Status & Doctor Assignment */}
            <div className="mt-6 grid grid-cols-1 gap-4 rounded-[10px] border border-[#e8edf5] p-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[1.25rem] font-bold text-[#707070] uppercase">
                  Status
                </label>
                <div className="flex gap-2">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(Number(e.target.value))}
                    className="flex-1 rounded-[8px] border border-[#d1d5db] px-3 py-2 text-[1.35rem]"
                  >
                    {INQUIRY_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleStatusUpdate}
                    className="cursor-pointer rounded-[8px] bg-[#3665f6] px-4 py-2 text-[1.3rem] font-semibold text-white"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[1.25rem] font-bold text-[#707070] uppercase">
                  Assign Doctor
                </label>
                <div className="flex gap-2">
                  <select
                    value={assignDoctorId}
                    onChange={(e) => setAssignDoctorId(e.target.value)}
                    className="flex-1 rounded-[8px] border border-[#d1d5db] px-3 py-2 text-[1.35rem]"
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.fullName}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAssignDoctor}
                    className="cursor-pointer rounded-[8px] bg-[#7fbb58] px-4 py-2 text-[1.3rem] font-semibold text-white"
                  >
                    Assign
                  </button>
                </div>
              </div>
            </div>

            {/* Sent Offers History */}
            {selectedInquiry.offers && selectedInquiry.offers.length > 0 && (
              <div className="mt-6 rounded-[10px] border border-[#3665f6]/30 bg-[#f8faff] p-5">
                <h3 className="text-[1.7rem] font-bold text-[#0c3a94]">
                  Sent Offers ({selectedInquiry.offers.length})
                </h3>
                <div className="mt-3 space-y-3">
                  {selectedInquiry.offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="rounded-[8px] border border-[#e5e7eb] bg-white p-4 text-[1.35rem]"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-bold text-[#0c3a94]">
                          {offer.clinicName || 'Clinic Offer'}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-[#eef2ff] px-3 py-0.5 text-[1.15rem] font-bold text-[#3665f6]">
                            {offer.statusText || 'Sent'}
                          </span>
                          {offer.status === 1 && (
                            <button
                              type="button"
                              onClick={async () => {
                                await adminService.sendOffer(offer.id)
                                showToast('Offer sent to patient!')
                                openManageInquiry(selectedInquiry.id)
                                loadTabData()
                              }}
                              className="cursor-pointer rounded-[6px] bg-[#7fbb58] px-3 py-1 text-[1.15rem] font-bold text-white"
                            >
                              Send Now
                            </button>
                          )}
                          {offer.status === 2 && (
                            <button
                              type="button"
                              onClick={async () => {
                                await adminService.withdrawOffer(offer.id)
                                showToast('Offer withdrawn')
                                openManageInquiry(selectedInquiry.id)
                                loadTabData()
                              }}
                              className="cursor-pointer rounded-[6px] border border-red-300 px-3 py-1 text-[1.15rem] font-bold text-red-600 hover:bg-red-50"
                            >
                              Withdraw
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-[#555555] sm:grid-cols-4">
                        <div>
                          <span className="block text-[1.1rem] font-bold uppercase text-[#9ca3af]">
                            Treatment
                          </span>
                          <span className="font-bold text-[#0a295b]">
                            € {(offer.medicalTreatmentPrice ?? 0).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[1.1rem] font-bold uppercase text-[#9ca3af]">
                            Hotel
                          </span>
                          <span className="font-bold text-[#0a295b]">
                            € {(offer.accommodationPrice ?? 0).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[1.1rem] font-bold uppercase text-[#9ca3af]">
                            Transfer
                          </span>
                          <span className="font-bold text-[#0a295b]">
                            € {(offer.airportTransferPrice ?? 0).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[1.1rem] font-bold uppercase text-[#9ca3af]">
                            Total
                          </span>
                          <span className="font-bold text-[#3665f6]">
                            € {(offer.totalPrice ?? 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Create & Send Official Offer */}
            <form
              onSubmit={handleCreateAndSendOffer}
              className="mt-6 rounded-[10px] border border-[#e8edf5] p-5"
            >
              <h3 className="text-[1.7rem] font-bold text-[#0c3a94]">
                Send Official Clinic Offer
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="col-span-2 sm:col-span-3">
                  <label className="mb-1 block text-[1.2rem] font-bold text-[#707070]">
                    Clinic
                  </label>
                  <select
                    required
                    value={offerForm.clinicId}
                    onChange={(e) => setOfferForm({ ...offerForm, clinicId: e.target.value })}
                    className="w-full rounded-[8px] border border-[#d1d5db] px-3 py-2 text-[1.35rem]"
                  >
                    <option value="">Select Clinic</option>
                    {clinics.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[1.2rem] font-bold text-[#707070]">
                    Treatment (€)
                  </label>
                  <input
                    type="number"
                    required
                    value={offerForm.treatmentCost}
                    onChange={(e) =>
                      setOfferForm({ ...offerForm, treatmentCost: e.target.value })
                    }
                    className="w-full rounded-[8px] border border-[#d1d5db] px-3 py-2 text-[1.35rem]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[1.2rem] font-bold text-[#707070]">
                    Hotel (€)
                  </label>
                  <input
                    type="number"
                    value={offerForm.accommodationCost}
                    onChange={(e) =>
                      setOfferForm({ ...offerForm, accommodationCost: e.target.value })
                    }
                    className="w-full rounded-[8px] border border-[#d1d5db] px-3 py-2 text-[1.35rem]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[1.2rem] font-bold text-[#707070]">
                    Transfer (€)
                  </label>
                  <input
                    type="number"
                    value={offerForm.transferCost}
                    onChange={(e) =>
                      setOfferForm({ ...offerForm, transferCost: e.target.value })
                    }
                    className="w-full rounded-[8px] border border-[#d1d5db] px-3 py-2 text-[1.35rem]"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="zm-btn zm-btn-green mt-4 rounded-[8px] !px-6 !py-2.5 !text-[1.35rem]"
              >
                <span>Create &amp; Send Offer</span>
              </button>
            </form>

            {/* Attached Medical Documents */}
            {selectedInquiry.documents && selectedInquiry.documents.length > 0 && (
              <div className="mt-6 rounded-[10px] border border-[#e8edf5] p-5">
                <h3 className="text-[1.7rem] font-bold text-[#0c3a94]">
                  Attached Medical Documents ({selectedInquiry.documents.length})
                </h3>
                <div className="mt-3 space-y-2">
                  {selectedInquiry.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-[8px] bg-[#f8faff] px-3.5 py-2 text-[1.35rem]"
                    >
                      <span className="font-semibold text-[#0a295b]">
                        {doc.originalFileName}
                      </span>
                      <span className="text-[1.2rem] text-[#707070]">
                        {doc.sizeBytes ? `${Math.round(doc.sizeBytes / 1024)} KB` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="mt-6 rounded-[10px] border border-[#e8edf5] p-5">
              <h3 className="text-[1.7rem] font-bold text-[#0c3a94]">Messages</h3>
              <div className="mt-3 max-h-[200px] space-y-2 overflow-y-auto">
                {inqMessages.map((m) => (
                  <div key={m.id} className="rounded-[8px] bg-[#f8faff] p-3 text-[1.35rem]">
                    <span className="font-bold text-[#3665f6]">{m.senderName}: </span>
                    <span>{m.body || m.messageText}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendAdminReply} className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write reply to patient..."
                  className="flex-1 rounded-[8px] border border-[#d1d5db] px-3.5 py-2 text-[1.35rem]"
                />
                <button
                  type="submit"
                  disabled={sendingReply || !replyText.trim()}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-[8px] bg-[#3665f6] px-5 py-2 text-[1.35rem] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send className="h-4 w-4" /> {sendingReply ? 'Sending...' : 'Send'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CREATION & EDIT MODALS */}
      <AdminEntityModal
        modalType={modalType}
        editingEntity={editingEntity}
        submitting={modalSubmitting}
        onClose={resetModalState}
        clinics={clinics}
        categories={categories}
        clinicForm={clinicForm}
        setClinicForm={setClinicForm}
        clinicLogoFile={clinicLogoFile}
        setClinicLogoFile={setClinicLogoFile}
        clinicCoverFile={clinicCoverFile}
        setClinicCoverFile={setClinicCoverFile}
        onSubmitClinic={handleCreateClinic}
        doctorForm={doctorForm}
        setDoctorForm={setDoctorForm}
        doctorPhotoFile={doctorPhotoFile}
        setDoctorPhotoFile={setDoctorPhotoFile}
        onSubmitDoctor={handleCreateDoctor}
        categoryForm={categoryForm}
        setCategoryForm={setCategoryForm}
        onSubmitCategory={handleCreateCategory}
        serviceForm={serviceForm}
        setServiceForm={setServiceForm}
        onSubmitService={handleCreateService}
        packageForm={packageForm}
        setPackageForm={setPackageForm}
        packageCoverFile={packageCoverFile}
        setPackageCoverFile={setPackageCoverFile}
        onSubmitPackage={handleCreatePackage}
      />
    </div>
  )
}

