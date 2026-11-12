import { apiClient, tokenStorage } from './apiClient'

export const authService = {
  // Login
  async login(credentials) {
    const res = await apiClient.post('/auth/login', credentials)
    if (res?.success && res?.data?.accessToken) {
      tokenStorage.setSession(res.data.accessToken, res.data.refreshToken, res.data.user)
    }
    return res
  },

  // Register
  async register(data) {
    return apiClient.post('/auth/register', data)
  },

  // Confirm Email with 6-digit code
  async confirmEmail(data) {
    const res = await apiClient.post('/auth/confirm-email', data)
    if (res?.success && res?.data?.accessToken) {
      tokenStorage.setSession(res.data.accessToken, res.data.refreshToken, res.data.user)
    }
    return res
  },

  // Resend 6-digit code
  async resendCode(data) {
    return apiClient.post('/auth/resend-code', data)
  },

  // Current logged in user info
  async getCurrentUser() {
    return apiClient.get('/auth/me')
  },

  // Logout
  async logout() {
    try {
      await apiClient.post('/auth/logout', {})
    } catch {
      // ignore network/auth errors during logout
    } finally {
      tokenStorage.clearSession()
    }
  },

  // Forgot password
  async forgotPassword(data) {
    return apiClient.post('/auth/forgot-password', data)
  },

  // Reset password
  async resetPassword(data) {
    return apiClient.post('/auth/reset-password', data)
  },
}

