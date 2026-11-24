import { apiClient } from './apiClient'

const catalogService = {
  async getCategories({ headerOnly, homeOnly } = {}) {
    const params = new URLSearchParams()
    if (headerOnly !== undefined) params.append('headerOnly', String(Boolean(headerOnly)))
    if (homeOnly !== undefined) params.append('homeOnly', String(Boolean(homeOnly)))
    const qs = params.toString()
    const res = await apiClient.get(`/public/categories${qs ? `?${qs}` : ''}`)
    return res?.data || []
  },

  async getCategoryDetail(categorySlug) {
    const res = await apiClient.get(`/public/categories/${encodeURIComponent(categorySlug)}`)
    return res?.data || null
  },

  async getSubcategoryDetail(categorySlug, subSlug) {
    const res = await apiClient.get(
      `/public/categories/${encodeURIComponent(categorySlug)}/${encodeURIComponent(subSlug)}`
    )
    return res?.data || null
  },

  async getServiceDetail(procedureSlug) {
    const res = await apiClient.get(`/public/services/${encodeURIComponent(procedureSlug)}`)
    return res?.data || null
  },

  async getMostSearchedServices() {
    const res = await apiClient.get('/public/services/most-searched')
    return res?.data || []
  },

  async getAboutUsData() {
    const res = await apiClient.get('/public/about-us')
    return res?.data || null
  },

  async getAboutMenuPages() {
    const res = await apiClient.get('/public/pages?parentSlug=about-us')
    return res?.data || []
  },

  async getCmsPage(slug) {
    const res = await apiClient.get(`/public/pages/${encodeURIComponent(slug)}`)
    return res?.data || null
  },

  async getHowItWorks() {
    const res = await apiClient.get('/public/how-it-works')
    return res?.data || []
  },

  async getClinics() {
    const res = await apiClient.get('/public/clinics')
    return res?.data || []
  },

  async getPartners() {
    const res = await apiClient.get('/public/partners')
    return res?.data || []
  },

  async submitContactMessage(payload) {
    const res = await apiClient.post('/public/contact', payload)
    return res?.data || res
  },

  async subscribeNewsletter(email) {
    const res = await apiClient.post('/public/newsletter', { email })
    return res?.data || res
  },
}

export default catalogService
