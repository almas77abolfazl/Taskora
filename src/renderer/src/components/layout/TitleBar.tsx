import React from 'react'
import { Minus, Square, X, CheckSquare } from 'lucide-react'
import { useI18n } from '../../i18n/context'

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
    <header className="h-9 select-none bg-slate-900 text-slate-300 flex items-center justify-between px-3 text-xs border-b border-slate-800 shrink-0 [app-region:drag]">
      {/* App branding */}
      <div className="flex items-center gap-2 [app-region:no-drag]">
        <CheckSquare className="w-4 h-4 text-blue-400" />
        <span className="font-semibold text-slate-100 tracking-wide">Microsoft To Do</span>
      </div>

      {/* Window Controls */}
      <div
        className={`flex items-center gap-1 [app-region:no-drag] ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}
      >
        <button
          onClick={handleMinimize}
          className="w-7 h-6 flex items-center justify-center rounded hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          title="Minimize"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleMaximize}
          className="w-7 h-6 flex items-center justify-center rounded hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          title="Maximize"
        >
          <Square className="w-3 h-3" />
        </button>
        <button
          onClick={handleClose}
          className="w-7 h-6 flex items-center justify-center rounded hover:bg-red-600 text-slate-400 hover:text-white transition-colors"
          title="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  )
}

