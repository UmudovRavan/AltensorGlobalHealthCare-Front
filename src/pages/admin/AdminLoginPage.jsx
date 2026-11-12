import { ArrowLeft, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AltensorLogo from '../../components/common/AltensorLogo'
import { useAuth } from '../../hooks/useAuth'
import { useTranslation } from '../../hooks/useTranslation'
import { hasAdminRole } from '../../services/adminService'

export default function AdminLoginPage({ onAdminAuthenticated }) {
  const { login, logout } = useAuth()
  const { t, language, setLanguage } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await login({ email: email.trim(), password })
      const loggedUser = res?.data?.user
      const accessToken = res?.data?.accessToken

      if (!hasAdminRole(loggedUser, accessToken)) {
        await logout()
        setError(
          'Access denied: Your account does not have Administrator privileges.'
        )
        return
      }

      if (onAdminAuthenticated) {
        onAdminAuthenticated()
      }
    } catch (err) {
      setError(
        err?.message || 'Invalid email or password. Please check your credentials.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafbfc] px-4 py-12">
      <div className="mb-8 flex flex-col items-center">
        <Link to="/en" className="transition-opacity hover:opacity-85">
          <AltensorLogo className="h-12 w-auto" />
        </Link>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#eef2ff] px-4 py-1.5 text-[1.2rem] font-bold tracking-wider text-[#3665f6] uppercase">
          <ShieldCheck className="h-4 w-4" />
          <span>{t('admin.login.badge')}</span>
        </div>
        <div className="mt-3 inline-flex rounded-full border border-[#d6deeb] bg-white p-1 shadow-2xs">
          {['en', 'az'].map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setLanguage(code)}
              className={`cursor-pointer rounded-full px-3.5 py-1 text-[1.15rem] font-bold uppercase transition-colors ${
                language === code ? 'bg-[#3665f6] text-white' : 'text-[#64748b] hover:text-[#0c3a94]'
              }`}
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-[460px] rounded-[12px] border border-[#e8edf5] bg-white p-8 shadow-[0_12px_36px_rgba(12,58,148,0.08)] sm:p-10">
        <div className="mb-7">
          <h1 className="text-[3.2rem] font-bold tracking-tight text-[#0c3a94]">
            {t('admin.login.title')}
          </h1>
          <p className="mt-1.5 text-[1.4rem] text-[#707070]">
            {t('admin.login.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-[1.3rem] font-bold text-[#0a295b]">
              {t('admin.login.email')}
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@altensorglobalhealthcare.com"
              className="w-full rounded-[8px] border border-[#d1d5db] bg-[#f8faff] px-4 py-3 text-[1.45rem] text-[#0a295b] outline-none transition-colors focus:border-[#3665f6] focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[1.3rem] font-bold text-[#0a295b]">
              {t('admin.login.password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-[8px] border border-[#d1d5db] bg-[#f8faff] px-4 py-3 pr-12 text-[1.45rem] text-[#0a295b] outline-none transition-colors focus:border-[#3665f6] focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label="Toggle password visibility"
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-[#707070] hover:text-[#3665f6]"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-[1.35rem] font-semibold text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="zm-btn zm-btn-green w-full rounded-[8px] !py-3.5 !text-[1.45rem] font-bold uppercase tracking-wider disabled:opacity-60"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <Lock className="h-4 w-4" />
              {loading ? 'Signing in...' : 'Login to Admin Panel'}
            </span>
          </button>
        </form>

        <div className="mt-7 border-t border-[#e8edf5] pt-5 text-center">
          <Link
            to="/en"
            className="inline-flex items-center gap-2 text-[1.35rem] font-semibold text-[#3665f6] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Altensor Healthcare</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

