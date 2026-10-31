import React, { useState } from 'react'
import { ArrowRight, ArrowLeft, Globe } from 'lucide-react'
import { useI18n } from '../../i18n/context'
import { BrandLogo } from '../common/BrandLogo'

interface OnboardingModalProps {
  isOpen: boolean
  onComplete: (name: string) => void
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const { t, locale, setLocale, direction } = useI18n()
  const [name, setName] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const chosenName = name.trim() || (locale === 'fa' ? 'فضای کاری من' : 'My Workspace')
    onComplete(chosenName)
  }

  const handleSkip = () => {
    const defaultName = locale === 'fa' ? 'فضای کاری من' : 'My Workspace'
    onComplete(defaultName)
  }

  const toggleLanguage = () => {
    setLocale(locale === 'fa' ? 'en' : 'fa')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm select-none">
      <div
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden p-6 sm:p-7 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Language switch top-right */}
        <div className="w-full flex justify-end mb-2">
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer"
          >
            <Globe className="w-3 h-3 text-slate-500" />
            <span>{locale === 'fa' ? 'English' : 'فارسی'}</span>
          </button>
        </div>

        {/* Brand Logo with ambient glow */}
        <div className="mb-4 relative">
          <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 blur-xl scale-125" />
          <BrandLogo size={52} className="relative shadow-lg" />
        </div>

        {/* Welcome titles */}
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          {t('welcomeTitle')}
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
          {t('welcomeSubtitle')}
        </p>

        {/* Name Input Form */}
        <form onSubmit={handleSubmit} className="w-full mt-5 space-y-3">
          <input
            type="text"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('profileNamePlaceholder')}
            className="w-full text-xs sm:text-[13px] px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-center font-medium"
          />

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20 cursor-pointer active:scale-98"
          >
            <span>{t('getStarted')}</span>
            {direction === 'rtl' ? (
              <ArrowLeft className="w-3.5 h-3.5" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="w-full text-[11px] text-slate-400 hover:text-slate-600 py-1 transition-colors cursor-pointer block"
          >
            {t('skipForNow')}
          </button>
        </form>
      </div>
    </div>
  )
}
