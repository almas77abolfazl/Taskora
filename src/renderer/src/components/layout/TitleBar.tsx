import React from 'react'
import { Minus, Square, X } from 'lucide-react'
import { useI18n } from '../../i18n/context'
import { BrandLogo } from '../common/BrandLogo'

export const TitleBar: React.FC = () => {
  const { direction } = useI18n()

  const handleMinimize = () => {
    window.api?.window?.minimize()
  }

  const handleMaximize = () => {
    window.api?.window?.maximize()
  }

  const handleClose = () => {
    window.api?.window?.close()
  }

  return (
    <header className="h-9 select-none bg-slate-950 text-slate-300 flex items-center justify-between px-3 text-xs border-b border-slate-800/80 shrink-0 [app-region:drag]">
      {/* Brand & App Name */}
      <div className="flex items-center gap-2 [app-region:no-drag]">
        <BrandLogo className="w-4 h-4 shadow-sm" size={17} />
        <span className="font-semibold text-slate-100 tracking-wide text-xs">Taskora</span>
      </div>

      {/* Window Controls */}
      <div
        className={`flex items-center gap-0.5 [app-region:no-drag] ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}
      >
        <button
          onClick={handleMinimize}
          className="w-8 h-7 flex items-center justify-center rounded hover:bg-slate-800/90 text-slate-400 hover:text-slate-100 transition-colors"
          title="Minimize"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleMaximize}
          className="w-8 h-7 flex items-center justify-center rounded hover:bg-slate-800/90 text-slate-400 hover:text-slate-100 transition-colors"
          title="Maximize"
        >
          <Square className="w-3 h-3" />
        </button>
        <button
          onClick={handleClose}
          className="w-8 h-7 flex items-center justify-center rounded hover:bg-rose-600 text-slate-400 hover:text-white transition-colors"
          title="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  )
}
