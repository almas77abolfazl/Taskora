import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { Locale, TranslationDictionary } from './types'
import { en } from './locales/en'
import { fa } from './locales/fa'
import { formatDate, formatRelativeDate } from '../lib/date-utils'

interface I18nContextValue {
  locale: Locale
  direction: 'rtl' | 'ltr'
  setLocale: (locale: Locale) => void
  t: (key: keyof TranslationDictionary) => string
  formatDate: (date: string | Date) => string
  formatRelativeDate: (date: string | Date) => string
}

const translations: Record<Locale, TranslationDictionary> = { en, fa }

const I18nContext = createContext<I18nContextValue | null>(null)

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('app_locale') as Locale | null
    if (saved === 'en' || saved === 'fa') return saved
    return 'fa' // Default to Persian
  })

  const direction = locale === 'fa' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.dir = direction
    document.documentElement.lang = locale
    localStorage.setItem('app_locale', locale)
  }, [locale, direction])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
  }

  const t = (key: keyof TranslationDictionary): string => {
    return translations[locale][key] ?? en[key] ?? key
  }

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      direction,
      setLocale,
      t,
      formatDate: (date) => formatDate(date, locale),
      formatRelativeDate: (date) => formatRelativeDate(date, locale)
    }),
    [locale, direction]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
