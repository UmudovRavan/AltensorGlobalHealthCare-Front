import { useEffect, useState } from 'react'
import { authService } from '../services/authService'
import { tokenStorage } from '../services/apiClient'
import { AuthContext } from './authStore'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokenStorage.getUser())
  const [token, setToken] = useState(() => tokenStorage.getAccessToken())
  const [loading, setLoading] = useState(false)

  const isAuthenticated = Boolean(user && token)

  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null)
      setToken(null)
      tokenStorage.clearSession()
    }
    window.addEventListener('altensor:auth_expired', handleAuthExpired)
    return () => window.removeEventListener('altensor:auth_expired', handleAuthExpired)
  }, [])

  const login = async (credentials) => {
    setLoading(true)
    try {
      const res = await authService.login(credentials)
      if (res?.data) {
        setUser(res.data.user)
        setToken(res.data.accessToken)
      }
      return res
    } finally {
      setLoading(false)
    }
  }

  const register = async (data) => {
    setLoading(true)
    try {
      return await authService.register(data)
    } finally {
      setLoading(false)
    }
  }

  const confirmEmail = async (data) => {
    setLoading(true)
    try {
      const res = await authService.confirmEmail(data)
      if (res?.data) {
        setUser(res.data.user)
        setToken(res.data.accessToken)
      }
      return res
    } finally {
      setLoading(false)
    }
  }

  const resendCode = async (data) => {
    return authService.resendCode(data)
  }

  const logout = async () => {
    setLoading(true)
    try {
      await authService.logout()
    } finally {
      setUser(null)
      setToken(null)
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        confirmEmail,
        resendCode,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

