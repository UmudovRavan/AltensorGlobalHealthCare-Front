import { apiClient, tokenStorage } from './apiClient'

/**
 * Decode JWT payload safely without external dependencies
 */
export function parseJwtPayload(token) {
  if (!token || typeof token !== 'string') return null
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

/**
 * Check if current user/token carries the Admin role
 */
export function hasAdminRole(user, token) {
  const activeToken = token || tokenStorage.getAccessToken()
  const activeUser = user || tokenStorage.getUser()

  const userRoles = Array.isArray(activeUser?.roles)
    ? activeUser.roles
    : activeUser?.role
      ? [activeUser.role]
      : []

  if (userRoles.some((r) => String(r).toLowerCase() === 'admin')) {
    return true
  }

  const payload = parseJwtPayload(activeToken)
  if (!payload) return false

  const claimRole =
    payload.role ||
    payload.roles ||
    payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']

  if (Array.isArray(claimRole)) {
    return claimRole.some((r) => String(r).toLowerCase() === 'admin')
  }
  if (typeof claimRole === 'string') {
    return claimRole.toLowerCase() === 'admin'
  }
  return false
}

const adminService = {
  // Dashboard
  async getDashboard() {
    const res = await apiClient.get('/admin/dashboard')
    return res?.data
  },

  // Inquiries (via CoordinatorController, authorized for Admin)
  async getInquiries({ status, search, page = 1, pageSize = 20 } = {}) {
    const params = new URLSearchParams()
    if (status !== undefined && status !== '' && status !== 'ALL') {
      params.append('status', status)
    }
    if (search) params.append('search', search)
    params.append('page', String(page))
    params.append('pageSize', String(pageSize))
    const res = await apiClient.get(`/coordinator/inquiries?${params.toString()}`)
    return res?.data || { items: [], totalCount: 0 }
  },

  async getInquiryById(id) {
    const res = await apiClient.get(`/coordinator/inquiries/${id}`)
    return res?.data
  },

  async updateInquiryStatus(id, status) {
    return apiClient.patch(`/coordinator/inquiries/${id}/status`, { status: Number(status) })
  },

  async assignDoctor(id, doctorId) {
    return apiClient.post(`/coordinator/inquiries/${id}/assign`, { doctorId })
  },

  async createOffer(inquiryId, offerData) {
    const formData = new FormData()
    formData.append('InquiryId', inquiryId)
    if (offerData.clinicId) formData.append('ClinicId', offerData.clinicId)
    if (offerData.doctorId) formData.append('DoctorId', offerData.doctorId)
    formData.append('Title', offerData.title || 'Official Clinic Treatment Offer')
    if (offerData.notes || offerData.text) {
      formData.append('Text', offerData.notes || offerData.text)
    }
    formData.append('MedicalTreatmentPrice', String(offerData.treatmentCost || 0))
    formData.append('AccommodationPrice', String(offerData.accommodationCost || 0))
    formData.append('AirportTransferPrice', String(offerData.transferCost || 0))
    formData.append('AirplaneTicketPrice', String(offerData.flightCost || 0))
    formData.append('Currency', offerData.currency || 'EUR')
    const res = await apiClient.upload(`/coordinator/inquiries/${inquiryId}/offers`, formData)
    return res?.data
  },

  async sendOffer(offerId) {
    return apiClient.post(`/coordinator/offers/${offerId}/send`, {})
  },

  async withdrawOffer(offerId) {
    return apiClient.post(`/coordinator/offers/${offerId}/withdraw`, {})
  },

  async getMessages(inquiryId) {
    const res = await apiClient.get(`/coordinator/inquiries/${inquiryId}/messages`)
    return res?.data || []
  },

  async sendMessage(inquiryId, messageText) {
    const res = await apiClient.post(`/coordinator/inquiries/${inquiryId}/messages`, {
      body: messageText,
    })
    return res?.data
  },

  // Clinics
  async getClinics() {
    const res = await apiClient.get('/admin/clinics')
    return res?.data || []
  },

  async createClinic(data) {
    const res = await apiClient.post('/admin/clinics', data)
    return res?.data
  },

  async updateClinic(id, data) {
    const res = await apiClient.put(`/admin/clinics/${id}`, data)
    return res?.data
  },

  async deleteClinic(id) {
    return apiClient.delete(`/admin/clinics/${id}`)
  },

  async uploadClinicLogo(id, file) {
    const formData = new FormData()
    formData.append('file', file)
    const res = await apiClient.upload(`/admin/clinics/${id}/logo`, formData)
    return res?.data
  },

  async uploadClinicCover(id, file) {
    const formData = new FormData()
    formData.append('file', file)
    const res = await apiClient.upload(`/admin/clinics/${id}/cover`, formData)
    return res?.data
  },

  // Doctors
  async getDoctors() {
    try {
      const res = await apiClient.get('/public/doctors')
      if (Array.isArray(res?.data)) return res.data
    } catch {
      // Fallback: aggregate doctors from clinic details if /public/doctors fails
    }
    const clinicsRes = await apiClient.get('/public/clinics')
    const clinics = clinicsRes?.data || []
    const details = await Promise.all(
      clinics.map((c) => apiClient.get(`/public/clinics/${c.slug}`).catch(() => null))
    )
    return details.flatMap((d) =>
      (d?.data?.doctors || []).map((doc) => ({
        ...doc,
        clinicName: doc.clinicName || d?.data?.name || '',
      }))
    )
  },

  async createDoctor(data) {
    const res = await apiClient.post('/admin/doctors', data)
    return res?.data
  },

  async updateDoctor(id, data) {
    const res = await apiClient.put(`/admin/doctors/${id}`, data)
    return res?.data
  },

  async deleteDoctor(id) {
    return apiClient.delete(`/admin/doctors/${id}`)
  },

  async uploadDoctorPhoto(id, file) {
    const formData = new FormData()
    formData.append('file', file)
    const res = await apiClient.upload(`/admin/doctors/${id}/photo`, formData)
    return res?.data
  },

  // Categories & Services
  async getCategories() {
    const res = await apiClient.get('/public/categories')
    return res?.data || []
  },

  async getAdminCategories() {
    const res = await apiClient.get('/admin/categories')
    return res?.data || []
  },

  async createCategory(data) {
    const res = await apiClient.post('/admin/categories', data)
    return res?.data
  },

  async updateCategory(id, data) {
    const res = await apiClient.put(`/admin/categories/${id}`, data)
    return res?.data
  },

  async deleteCategory(id) {
    return apiClient.delete(`/admin/categories/${id}`)
  },

  async getAdminServices(params) {
    const res = await apiClient.get('/admin/services', params)
    return res?.data || []
  },

  async getAdminServiceById(id) {
    const res = await apiClient.get(`/admin/services/${id}`)
    return res?.data
  },

  async createService(data) {
    const res = await apiClient.post('/admin/services', data)
    return res?.data
  },

  async updateService(id, data) {
    const res = await apiClient.put(`/admin/services/${id}`, data)
    return res?.data
  },

  async deleteService(id) {
    return apiClient.delete(`/admin/services/${id}`)
  },

  async uploadServiceHeroImage(id, file) {
    const formData = new FormData()
    formData.append('file', file)
    const res = await apiClient.upload(`/admin/services/${id}/hero-image`, formData)
    return res?.data
  },

  async uploadServicePromoBanner(id, file) {
    const formData = new FormData()
    formData.append('file', file)
    const res = await apiClient.upload(`/admin/services/${id}/promo-banner`, formData)
    return res?.data
  },

  async setClinicPrice(data) {
    const res = await apiClient.post('/admin/services/price', data)
    return res?.data
  },

  async deleteClinicPrice(serviceId, clinicId) {
    return apiClient.delete(`/admin/services/${serviceId}/clinics/${clinicId}`)
  },

  async assignServiceDoctors(serviceId, doctorIds) {
    const res = await apiClient.put(`/admin/services/${serviceId}/doctors`, { doctorIds })
    return res?.data
  },

  // Procedure & General FAQs
  async getAdminFaqs(medicalServiceId) {
    const res = await apiClient.get('/admin/faq', medicalServiceId ? { medicalServiceId } : undefined)
    return res?.data || []
  },

  async createFaq(data) {
    const res = await apiClient.post('/admin/faq', data)
    return res?.data
  },

  async updateFaq(id, data) {
    const res = await apiClient.put(`/admin/faq/${id}`, data)
    return res?.data
  },

  async deleteFaq(id) {
    return apiClient.delete(`/admin/faq/${id}`)
  },

  // About Us & CMS
  async getAdminPages() {
    const res = await apiClient.get('/admin/pages')
    return res?.data || []
  },

  async getAdminPageBySlug(slug) {
    const res = await apiClient.get(`/admin/pages/${encodeURIComponent(slug)}`)
    return res?.data
  },

  async upsertPage(data) {
    const res = await apiClient.post('/admin/pages', data)
    return res?.data
  },

  async deletePage(slug) {
    return apiClient.delete(`/admin/pages/${encodeURIComponent(slug)}`)
  },

  async getPillars() {
    const res = await apiClient.get('/admin/pillars')
    return res?.data || []
  },

  async createPillar(data) {
    const res = await apiClient.post('/admin/pillars', data)
    return res?.data
  },

  async updatePillar(id, data) {
    const res = await apiClient.put(`/admin/pillars/${id}`, data)
    return res?.data
  },

  async deletePillar(id) {
    return apiClient.delete(`/admin/pillars/${id}`)
  },

  async getTeamMembers() {
    const res = await apiClient.get('/admin/team')
    return res?.data || []
  },

  async createTeamMember(data) {
    const res = await apiClient.post('/admin/team', data)
    return res?.data
  },

  async updateTeamMember(id, data) {
    const res = await apiClient.put(`/admin/team/${id}`, data)
    return res?.data
  },

  async deleteTeamMember(id) {
    return apiClient.delete(`/admin/team/${id}`)
  },

  async uploadTeamPhoto(id, file) {
    const formData = new FormData()
    formData.append('file', file)
    const res = await apiClient.upload(`/admin/team/${id}/photo`, formData)
    return res?.data
  },

  async getHowItWorksSteps() {
    const res = await apiClient.get('/admin/how-it-works')
    return res?.data || []
  },

  async createStep(data) {
    const res = await apiClient.post('/admin/how-it-works', data)
    return res?.data
  },

  async updateStep(id, data) {
    const res = await apiClient.put(`/admin/how-it-works/${id}`, data)
    return res?.data
  },

  async deleteStep(id) {
    return apiClient.delete(`/admin/how-it-works/${id}`)
  },

  async getContactMessages(params) {
    const res = await apiClient.get('/admin/contact-messages', params)
    return res?.data || []
  },

  async markContactHandled(id) {
    const res = await apiClient.patch(`/admin/contact-messages/${id}/handled`, {})
    return res?.data
  },

  // Packages
  async getPackages() {
    const res = await apiClient.get('/public/packages')
    return res?.data || []
  },

  async createPackage(data) {
    const res = await apiClient.post('/admin/packages', data)
    return res?.data
  },

  async deletePackage(id) {
    return apiClient.delete(`/admin/packages/${id}`)
  },

  async uploadPackageCover(id, file) {
    const formData = new FormData()
    formData.append('file', file)
    const res = await apiClient.upload(`/admin/packages/${id}/cover`, formData)
    return res?.data
  },
}

export default adminService

