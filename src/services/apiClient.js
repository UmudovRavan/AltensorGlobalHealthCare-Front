// Altensor Healthcare — Unified API Client
const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '')

export const API_ORIGIN = /^https?:\/\//i.test(API_BASE_URL)
  ? new URL(API_BASE_URL).origin
  : ''

export function resolveMediaUrl(url) {
  if (!url || typeof url !== 'string') return ''
  if (/^(https?:|data:|blob:|\/\/)/i.test(url)) return url
  const normalized = url.startsWith('/') ? url : `/${url}`
  if (normalized.startsWith('/uploads/') && API_ORIGIN) {
    return `${API_ORIGIN}${normalized}`
  }
  return url
}

const TOKEN_KEY = 'altensor_access_token'
const REFRESH_TOKEN_KEY = 'altensor_refresh_token'
const USER_KEY = 'altensor_user'

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  getUser: () => {
    try {
      const raw = localStorage.getItem(USER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },
  setSession: (accessToken, refreshToken, user) => {
    if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken)
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  },
  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
}

let isRefreshing = false
let refreshSubscribers = []

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb)
}

function onRefreshed(newToken) {
  refreshSubscribers.forEach((cb) => cb(newToken))
  refreshSubscribers = []
}

async function refreshTokenCall() {
  const accessToken = tokenStorage.getAccessToken()
  const refreshToken = tokenStorage.getRefreshToken()
  if (!refreshToken) throw new Error('No refresh token available')

  const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accessToken, refreshToken }),
  })

  if (!res.ok) {
    tokenStorage.clearSession()
    throw new Error('Refresh token expired')
  }

  const json = await res.json()
  if (json?.success && json?.data?.accessToken) {
    tokenStorage.setSession(json.data.accessToken, json.data.refreshToken, json.data.user)
    return json.data.accessToken
  }
  tokenStorage.clearSession()
  throw new Error('Invalid refresh token response')
}

export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`
  const headers = {
    ...options.headers,
  }

  // Language header (read from localStorage or default to 'en')
  const activeLang = localStorage.getItem('altensor_lang') || 'en'
  if (!headers['Accept-Language']) {
    headers['Accept-Language'] = activeLang
  }

  // Token header
  const token = tokenStorage.getAccessToken()
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const isFormData = options.body instanceof FormData
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  const config = {
    ...options,
    headers,
  }

  let response = await fetch(url, config)

  // Auto Refresh Token on 401
  if (response.status === 401 && tokenStorage.getRefreshToken() && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh-token')) {
    if (!isRefreshing) {
      isRefreshing = true
      try {
        const newToken = await refreshTokenCall()
        isRefreshing = false
        onRefreshed(newToken)
      } catch (err) {
        isRefreshing = false
        window.dispatchEvent(new CustomEvent('altensor:auth_expired'))
        throw err
      }
    }

    // Wait for the refreshing token
    const retryToken = await new Promise((resolve) => {
      subscribeTokenRefresh((t) => resolve(t))
    })

    headers['Authorization'] = `Bearer ${retryToken}`
    response = await fetch(url, { ...config, headers })
  }

  const contentType = response.headers.get('content-type') || ''
  let result = null

  if (contentType.includes('application/json')) {
    result = await response.json()
  } else {
    result = await response.text()
  }

  if (!response.ok) {
    const error = new Error(result?.message || 'Server error')
    error.status = response.status
    error.errorCode = result?.errorCode || 'UNKNOWN_ERROR'
    error.errors = result?.errors || null
    error.raw = result
    throw error
  }

  return result
}

export const apiClient = {
  get: (endpoint, params) => {
    let url = endpoint
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          searchParams.append(k, v)
        }
      })
      const queryString = searchParams.toString()
      if (queryString) url += (url.includes('?') ? '&' : '?') + queryString
    }
    return apiRequest(url, { method: 'GET' })
  },
  post: (endpoint, data) => apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  postForm: (endpoint, formData) => apiRequest(endpoint, {
    method: 'POST',
    body: formData,
  }),
  upload: (endpoint, formData) => apiRequest(endpoint, {
    method: 'POST',
    body: formData,
  }),
  put: (endpoint, data) => apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  patch: (endpoint, data) => apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
}

export default apiClient


