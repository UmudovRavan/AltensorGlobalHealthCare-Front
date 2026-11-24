import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import ErrorBoundary from './components/common/ErrorBoundary'
import GlobalLoader from './components/common/GlobalLoader'
import { AuthProvider } from './context/AuthContext'
import { UIProvider } from './context/UIContext'
import AppRouter from './router/AppRouter'

const INITIAL_HOLD_MS = 1100
const ROUTE_HOLD_MS = 750
const REDUCED_MOTION_HOLD_MS = 250
const FAILSAFE_TIMEOUT_MS = 3500
const EXIT_DURATION_MS = 450
const REDUCED_MOTION_EXIT_MS = 150

function isTopLevelRoute(pathname) {
  const segments = pathname.split('/').filter(Boolean)
  // Top-level pages: '/', '/en', '/en/services', '/en/doctors', '/en/about-us', '/admin', etc.
  // Subpages like '/en/services/dentistry' or '/en/doctors/slug' have 3+ segments.
  return segments.length <= 2
}

function AppContent() {
  const { pathname } = useLocation()
  const [loaderPhase, setLoaderPhase] = useState('loading') // 'loading' | 'exiting' | 'done'
  const lastCompletedPathRef = useRef(null)
  const exitStartedRef = useRef(false)

  useEffect(() => {
    const isInitialMount = lastCompletedPathRef.current === null
    const routeChanged = lastCompletedPathRef.current !== pathname

    if (!isInitialMount && (!routeChanged || !isTopLevelRoute(pathname))) {
      return undefined
    }

    exitStartedRef.current = false
    setLoaderPhase('loading')

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    const baseHoldMs = isInitialMount ? INITIAL_HOLD_MS : ROUTE_HOLD_MS
    const minHoldMs = prefersReducedMotion ? REDUCED_MOTION_HOLD_MS : baseHoldMs
    const exitMs = prefersReducedMotion ? REDUCED_MOTION_EXIT_MS : EXIT_DURATION_MS

    // Don't block on slow external images; DOM ready + minimal hold is enough
    let domReady = !isInitialMount || document.readyState !== 'loading'
    let minHoldElapsed = false
    let exitTimer = null

    const triggerReveal = () => {
      if (exitStartedRef.current) return
      exitStartedRef.current = true
      lastCompletedPathRef.current = pathname
      setLoaderPhase('exiting')
      exitTimer = window.setTimeout(() => {
        setLoaderPhase('done')
      }, exitMs)
    }

    const tryReveal = () => {
      if (domReady && minHoldElapsed) {
        triggerReveal()
      }
    }

    const handleDomReady = () => {
      domReady = true
      tryReveal()
    }

    if (!domReady) {
      document.addEventListener('DOMContentLoaded', handleDomReady, { once: true })
    }

    const minHoldTimer = window.setTimeout(() => {
      minHoldElapsed = true
      tryReveal()
    }, minHoldMs)

    const failsafeTimer = window.setTimeout(() => {
      triggerReveal()
    }, FAILSAFE_TIMEOUT_MS)

    return () => {
      document.removeEventListener('DOMContentLoaded', handleDomReady)
      window.clearTimeout(minHoldTimer)
      window.clearTimeout(failsafeTimer)
      if (exitTimer) window.clearTimeout(exitTimer)
    }
  }, [pathname])

  useEffect(() => {
    const isBlocked = loaderPhase === 'loading'
    document.documentElement.style.overflow = isBlocked ? 'hidden' : ''
    document.body.style.overflow = isBlocked ? 'hidden' : ''

    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [loaderPhase])

  const isAppReady = loaderPhase !== 'loading'

  return (
    <>
      <GlobalLoader
        visible={loaderPhase !== 'done'}
        exiting={loaderPhase === 'exiting'}
      />
      <div
        id="app-shell"
        className="alt-app-shell"
        data-ready={isAppReady ? 'true' : 'false'}
        aria-hidden={!isAppReady}
      >
        <ErrorBoundary resetKey={pathname}>
          <AppRouter />
        </ErrorBoundary>
      </div>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>
          <AppContent />
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
