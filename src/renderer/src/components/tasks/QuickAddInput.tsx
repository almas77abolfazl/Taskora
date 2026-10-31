import React, { useState } from 'react'
import { Plus, Circle } from 'lucide-react'
import { useTasks } from '../../context/TaskContext'
import { useI18n } from '../../i18n/context'

export const QuickAddInput: React.FC = () => {
  const { createTask, activeList } = useTasks()
  const { t } = useI18n()
  const [title, setTitle] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    await createTask(title.trim())
    setTitle('')
  }

  const placeholderText = activeList
    ? `${t('addTaskPlaceholder')} "${activeList.title}"`
    : t('addTask')

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center bg-white rounded-xl border transition-all duration-200 shadow-2xs ${
        isFocused
          ? 'border-indigo-500 ring-2 ring-indigo-500/15 shadow-sm'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      <div className="ps-3.5 flex items-center justify-center pointer-events-none text-slate-400">
        {isFocused ? (
          <Circle className="w-4 h-4 text-indigo-500 stroke-[1.8]" />
        ) : (
          <Plus className="w-4 h-4 text-slate-400 stroke-[2]" />
        )}
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholderText}
        className="w-full text-xs sm:text-[13px] py-2.5 px-3 bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none"
      />

      {title.trim() && (
        <div className="flex items-center gap-1.5 pe-2">
          <kbd className="hidden sm:inline-block text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5">
            Enter
          </kbd>
          <button
            type="submit"
            className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-2xs cursor-pointer"
          >
            {t('add')}
          </button>
        </div>
      )}
    </form>
  )
}
