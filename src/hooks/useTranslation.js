import { useCallback } from 'react'
import { useUI } from './useUI'
import { getTranslation } from '../i18n/translations'

export function useTranslation() {
  const { language, setLanguage } = useUI()

  const t = useCallback(
    (key, fallback) => getTranslation(language, key, fallback),
    [language]
  )

  return { t, language, setLanguage }
}

