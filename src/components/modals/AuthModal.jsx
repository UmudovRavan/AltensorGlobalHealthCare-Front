import { AlertCircle, CheckCircle2, ChevronDown, Loader2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BRAND } from '../../data/brand'
import { useAuth } from '../../hooks/useAuth'
import { useUI } from '../../hooks/useUI'
import { authService } from '../../services/authService'

const COUNTRY_CODES = [
  { code: 'AZ', dial: '+994', flag: '/flags/az.svg', name: 'Azerbaijan' },
  { code: 'GB', dial: '+44', flag: '/flags/en.svg', name: 'United Kingdom' },
  { code: 'RU', dial: '+7', flag: '/flags/ru.svg', name: 'Russia' },
  { code: 'TR', dial: '+90', flag: 'https://www.zagrebmed.com/assets/flags/hr.svg', name: 'Turkey' },
  { code: 'HR', dial: '+385', flag: 'https://www.zagrebmed.com/assets/flags/hr.svg', name: 'Croatia' },
  { code: 'DE', dial: '+49', flag: 'https://www.zagrebmed.com/assets/flags/de.svg', name: 'Germany' },
  { code: 'IT', dial: '+39', flag: 'https://www.zagrebmed.com/assets/flags/it.svg', name: 'Italy' },
  { code: 'US', dial: '+1', flag: '/flags/en.svg', name: 'United States' },
]

export default function AuthModal() {
  const { authOpen, authMode, setAuthMode, closeAuth } = useUI()
  const { login, register, confirmEmail, resendCode, loading } = useAuth()

  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register form state
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [country, setCountry] = useState(COUNTRY_CODES[0])
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)

  // Confirm Email state
  const [targetEmail, setTargetEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  // Forgot / Reset password state
  const [forgotEmail, setForgotEmail] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')

  // Status & Feedback state
  const [errorMessage, setErrorMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [doneMessage, setDoneMessage] = useState('')

  // Countdown timer for code resend
  useEffect(() => {
    let interval = null
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [resendCooldown])

  if (!authOpen) return null

  const handleClose = () => {
    setErrorMessage('')
    setInfoMessage('')
    setDoneMessage('')
    setCountryDropdownOpen(false)
    closeAuth()
  }

  // 1. LOGIN SUBMIT
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setInfoMessage('')

    try {
      await login({
        email: loginEmail.trim(),
        password: loginPassword,
      })
      setDoneMessage(`Signed in to ${BRAND.name} patient portal.`)
      setTimeout(() => {
        handleClose()
      }, 1200)
    } catch (err) {
      if (err?.errorCode === 'EMAIL_NOT_CONFIRMED') {
        setTargetEmail(loginEmail.trim())
        setInfoMessage('Your email is not confirmed yet. Please enter the 6-digit verification code.')
        setResendCooldown(60)
        setAuthMode('confirm')
      } else {
        setErrorMessage(err?.message || 'Login failed. Please check your credentials.')
      }
    }
  }

  // 2. REGISTER SUBMIT
  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setInfoMessage('')

    if (!acceptTerms) {
      setErrorMessage('Please accept the Terms and conditions to continue.')
      return
    }

    const cleanPhone = phoneNumber.replace(/[\s()-]/g, '')
    const fullPhone = `${country.dial}${cleanPhone}`

    try {
      await register({
        firstName: name.trim(),
        lastName: surname.trim(),
        phoneNumber: fullPhone,
        email: email.trim(),
        password,
        acceptTerms: true,
        country: country.name,
      })

      setTargetEmail(email.trim())
      setInfoMessage(`Registration successful! A 6-digit verification code has been sent to ${email.trim()}.`)
      setResendCooldown(60)
      setAuthMode('confirm')
    } catch (err) {
      if (err?.errors && Array.isArray(err.errors) && err.errors.length > 0) {
        setErrorMessage(err.errors.map((e) => e.message).join(' | '))
      } else {
        setErrorMessage(err?.message || 'Registration failed. Please try again.')
      }
    }
  }

  // 3. CONFIRM EMAIL SUBMIT
  const handleConfirmSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setInfoMessage('')

    if (verificationCode.trim().length !== 6) {
      setErrorMessage('Please enter the full 6-digit confirmation code.')
      return
    }

    try {
      await confirmEmail({
        email: targetEmail.trim(),
        code: verificationCode.trim(),
      })
      setDoneMessage(`Account confirmed! Welcome to ${BRAND.name}.`)
      setTimeout(() => {
        handleClose()
      }, 1500)
    } catch (err) {
      setErrorMessage(err?.message || 'Invalid or expired confirmation code.')
    }
  }

  // 4. RESEND VERIFICATION CODE
  const handleResendCode = async () => {
    if (resendCooldown > 0) return
    setErrorMessage('')
    try {
      await resendCode({ email: targetEmail.trim() })
      setInfoMessage('A new 6-digit confirmation code was sent to your email.')
      setResendCooldown(60)
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to resend code.')
    }
  }

  // 5. FORGOT PASSWORD SUBMIT
  const handleForgotSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setInfoMessage('')

    try {
      await authService.forgotPassword({ email: forgotEmail.trim() })
      setTargetEmail(forgotEmail.trim())
      setInfoMessage(`Password reset code has been sent to ${forgotEmail.trim()}.`)
      setAuthMode('reset')
    } catch (err) {
      setErrorMessage(err?.message || 'Could not send reset code.')
    }
  }

  // 6. RESET PASSWORD SUBMIT
  const handleResetSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setInfoMessage('')

    try {
      await authService.resetPassword({
        email: targetEmail.trim(),
        code: resetCode.trim(),
        newPassword,
      })
      setDoneMessage('Password reset successfully! You can now log in.')
      setTimeout(() => {
        setDoneMessage('')
        setAuthMode('login')
      }, 1500)
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to reset password.')
    }
  }

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-[430px] rounded-[10px] bg-white p-[36px] shadow-[0_15px_40px_rgba(0,0,0,0.2)]">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute right-6 top-6 cursor-pointer text-[#0c3a94] transition-opacity hover:opacity-75"
        >
          <X className="h-6 w-6 stroke-[2]" />
        </button>

        {/* Global Feedback Banner */}
        {errorMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-[6px] border border-[#fca5a5] bg-[#fff1f2] p-3 text-[1.3rem] font-semibold text-[#dc2626]">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {infoMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-[6px] border border-[#93c5fd] bg-[#eff6ff] p-3 text-[1.3rem] font-medium text-[#1e40af]">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#3b82f6]" />
            <span>{infoMessage}</span>
          </div>
        )}

        {doneMessage ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-[#7fbb58]" />
            <p className="mt-4 text-[1.7rem] font-bold text-[#0c3a94]">
              {doneMessage}
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="zm-btn zm-btn-green mt-6 w-full"
            >
              <span>Continue</span>
            </button>
          </div>
        ) : authMode === 'login' ? (
          /* ================= LOGIN VIEW (1:1 with Screenshot 1) ================= */
          <div>
            <h2 className="text-[3.2rem] font-bold leading-none text-[#0c3a94]">
              Login
            </h2>

            <form onSubmit={handleLoginSubmit} className="mt-8 space-y-4">
              <div>
                <input
                  type="text"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="E-mail"
                  className="w-full rounded-[6px] border border-[#d5e2f7] bg-[#edf3fe] px-4 py-3 text-[1.5rem] font-medium text-[#0a295b] outline-none transition-colors focus:border-[#3665f6] focus:bg-white"
                />
              </div>

              <div>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-[6px] border border-[#d5e2f7] bg-[#edf3fe] px-4 py-3 text-[1.5rem] font-medium text-[#0a295b] outline-none transition-colors focus:border-[#3665f6] focus:bg-white"
                />
              </div>

              {/* Row with LOGIN button & FORGOT PASSWORD */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="zm-btn zm-btn-green flex items-center gap-2"
                  style={{
                    padding: '9px 24px',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                  }}
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin text-white" />}
                  <span>LOGIN</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage('')
                    setInfoMessage('')
                    setAuthMode('forgot')
                  }}
                  className="cursor-pointer text-[1.15rem] font-bold uppercase tracking-wider text-[#707070] transition-colors hover:text-[#0c3a94]"
                >
                  FORGOT PASSWORD?
                </button>
              </div>
            </form>

            {/* Bottom Register prompt */}
            <div className="mt-8 border-t border-transparent pt-2">
              <p className="text-[1.5rem] font-bold text-black">
                If you don’t have an account, please register.
              </p>
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('')
                  setInfoMessage('')
                  setAuthMode('register')
                }}
                className="mt-2.5 cursor-pointer text-[1.4rem] font-bold uppercase text-[#3665f6] hover:underline"
              >
                REGISTER
              </button>
            </div>
          </div>
        ) : authMode === 'register' ? (
          /* ================= REGISTER VIEW (1:1 with Screenshot 2) ================= */
          <div>
            <h2 className="text-[3.2rem] font-bold leading-none text-[#0c3a94]">
              Register
            </h2>

            <form onSubmit={handleRegisterSubmit} className="mt-7 space-y-3.5" autoComplete="off">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Name"
                  autoComplete="given-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-[6px] border border-[#cccccc] bg-white px-4 py-3 text-[1.5rem] text-[#0a295b] outline-none transition-colors focus:border-[#3665f6]"
                />
              </div>

              <div>
                <input
                  type="text"
                  required
                  placeholder="Surname"
                  autoComplete="family-name"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="w-full rounded-[6px] border border-[#cccccc] bg-white px-4 py-3 text-[1.5rem] text-[#0a295b] outline-none transition-colors focus:border-[#3665f6]"
                />
              </div>

              {/* Phone with Country Code */}
              <div className="relative flex rounded-[6px] border border-[#cccccc] bg-white focus-within:border-[#3665f6]">
                <button
                  type="button"
                  onClick={() => setCountryDropdownOpen((prev) => !prev)}
                  className="flex cursor-pointer items-center gap-1.5 border-r border-[#cccccc] px-3.5 py-3 hover:bg-[#f8faff]"
                >
                  <img
                    src={country.flag}
                    alt={country.name}
                    className="h-4 w-6 rounded-[2px] object-cover shadow-xs"
                  />
                  <ChevronDown className="h-3 w-3 text-[#666666]" />
                </button>

                {countryDropdownOpen && (
                  <div className="absolute left-0 top-[48px] z-50 max-h-[220px] w-[260px] overflow-y-auto rounded-[8px] border border-[#e8e8e8] bg-white py-2 shadow-xl">
                    {COUNTRY_CODES.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          setCountry(c)
                          setCountryDropdownOpen(false)
                        }}
                        className="flex w-full cursor-pointer items-center gap-3 px-3.5 py-2 text-left text-[1.35rem] font-semibold text-[#0a295b] hover:bg-[#f4f7ff]"
                      >
                        <img
                          src={c.flag}
                          alt={c.name}
                          className="h-4 w-6 rounded-[2px] object-cover"
                        />
                        <span className="flex-1">{c.name}</span>
                        <span className="text-[#3665f6]">{c.dial}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex flex-1 items-center px-3">
                  <span className="text-[1.5rem] font-semibold text-black">
                    {country.dial}
                  </span>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="50 123 45 67"
                    className="ml-2 w-full bg-transparent py-3 text-[1.5rem] text-[#0a295b] outline-none"
                  />
                </div>
              </div>

              <div>
                <input
                  type="email"
                  required
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-[6px] border border-[#cccccc] bg-white px-4 py-3 text-[1.5rem] text-[#0a295b] outline-none focus:border-[#3665f6]"
                />
              </div>

              <div>
                <input
                  type="password"
                  required
                  placeholder="Password (min. 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-[6px] border border-[#cccccc] bg-white px-4 py-3 text-[1.5rem] text-[#0a295b] outline-none focus:border-[#3665f6]"
                />
              </div>

              {/* Terms and conditions Checkbox */}
              <div className="pt-1">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    required
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 h-5 w-5 shrink-0 rounded-[4px] accent-[#3665f6]"
                  />
                  <span className="text-[1.4rem] font-bold leading-[1.35] text-black">
                    I accept the{' '}
                    <Link
                      to="/en/terms-and-conditions"
                      onClick={handleClose}
                      className="text-black hover:underline"
                    >
                      Terms and conditions
                    </Link>{' '}
                    and the{' '}
                    <Link
                      to="/en/privacy-policy"
                      onClick={handleClose}
                      className="text-black hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              {/* REGISTER Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="zm-btn zm-btn-green flex items-center gap-2"
                  style={{
                    padding: '9px 24px',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                  }}
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin text-white" />}
                  <span>REGISTER</span>
                </button>
              </div>
            </form>

            {/* Bottom Login prompt */}
            <div className="mt-7">
              <p className="text-[1.5rem] font-bold text-black">
                If you already have account. Please login.
              </p>
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('')
                  setInfoMessage('')
                  setAuthMode('login')
                }}
                className="mt-2.5 cursor-pointer text-[1.4rem] font-bold uppercase text-[#3665f6] hover:underline"
              >
                LOGIN
              </button>
            </div>
          </div>
        ) : authMode === 'confirm' ? (
          /* ================= CONFIRM EMAIL (TƏSDİQLƏMƏ) VIEW ================= */
          <div>
            <h2 className="text-[3.2rem] font-bold leading-none text-[#0c3a94]">
              Confirm Email
            </h2>
            <p className="mt-3 text-[1.4rem] leading-[1.6] text-[#555555]">
              Please enter the 6-digit verification code sent to{' '}
              <strong className="text-[#0c3a94]">{targetEmail}</strong>
            </p>

            <form onSubmit={handleConfirmSubmit} className="mt-6 space-y-4">
              <div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  autoFocus
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full rounded-[6px] border border-[#d5e2f7] bg-[#edf3fe] px-4 py-3 text-center font-mono text-[2.4rem] font-bold tracking-[10px] text-[#0a295b] outline-none transition-colors focus:border-[#3665f6] focus:bg-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="zm-btn zm-btn-green flex w-full items-center justify-center gap-2"
                  style={{
                    padding: '11px 24px',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                  }}
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin text-white" />}
                  <span>VERIFY & ACTIVATE</span>
                </button>
              </div>
            </form>

            <div className="mt-6 flex items-center justify-between border-t border-[#f0f0f0] pt-4 text-[1.3rem]">
              <button
                type="button"
                disabled={resendCooldown > 0}
                onClick={handleResendCode}
                className={`font-semibold transition-colors ${
                  resendCooldown > 0
                    ? 'cursor-not-allowed text-[#999999]'
                    : 'cursor-pointer text-[#3665f6] hover:underline'
                }`}
              >
                {resendCooldown > 0
                  ? `Resend code in ${resendCooldown}s`
                  : 'Resend code'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setErrorMessage('')
                  setInfoMessage('')
                  setAuthMode('login')
                }}
                className="cursor-pointer font-bold uppercase text-[#707070] hover:text-[#0c3a94]"
              >
                BACK TO LOGIN
              </button>
            </div>
          </div>
        ) : authMode === 'forgot' ? (
          /* ================= FORGOT PASSWORD VIEW ================= */
          <div>
            <h2 className="text-[3.2rem] font-bold leading-none text-[#0c3a94]">
              Forgot Password
            </h2>
            <p className="mt-3 text-[1.4rem] leading-[1.6] text-[#555555]">
              Please type your email address and we will send you password reset instructions.
            </p>

            <form onSubmit={handleForgotSubmit} className="mt-6 space-y-4">
              <div>
                <input
                  type="email"
                  required
                  placeholder="E-mail"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full rounded-[6px] border border-[#cccccc] bg-white px-4 py-3 text-[1.5rem] text-[#0a295b] outline-none focus:border-[#3665f6]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="zm-btn zm-btn-green flex items-center gap-2"
                  style={{
                    padding: '9px 24px',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                  }}
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin text-white" />}
                  <span>SEND</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="cursor-pointer text-[1.3rem] font-bold uppercase text-[#3665f6] hover:underline"
                >
                  BACK TO LOGIN
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ================= RESET PASSWORD VIEW ================= */
          <div>
            <h2 className="text-[3.2rem] font-bold leading-none text-[#0c3a94]">
              Reset Password
            </h2>
            <p className="mt-3 text-[1.4rem] leading-[1.6] text-[#555555]">
              Enter the 6-digit code sent to <strong className="text-[#0c3a94]">{targetEmail}</strong> and your new password.
            </p>

            <form onSubmit={handleResetSubmit} className="mt-6 space-y-4">
              <div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="6-digit Code"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full rounded-[6px] border border-[#cccccc] bg-white px-4 py-3 text-center font-mono text-[2rem] font-bold tracking-[6px] text-[#0a295b] outline-none focus:border-[#3665f6]"
                />
              </div>

              <div>
                <input
                  type="password"
                  required
                  placeholder="New Password (min 8 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-[6px] border border-[#cccccc] bg-white px-4 py-3 text-[1.5rem] text-[#0a295b] outline-none focus:border-[#3665f6]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="zm-btn zm-btn-green flex items-center gap-2"
                  style={{
                    padding: '9px 24px',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                  }}
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin text-white" />}
                  <span>RESET PASSWORD</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="cursor-pointer text-[1.3rem] font-bold uppercase text-[#3665f6] hover:underline"
                >
                  BACK TO LOGIN
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
