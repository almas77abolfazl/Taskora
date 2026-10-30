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
      className={`relative flex items-center bg-white rounded-lg border transition-all duration-150 shadow-2xs ${
        isFocused
          ? 'border-slate-400 ring-1 ring-slate-400'
          : 'border-slate-200/80 hover:border-slate-300'
      }`}
    >
      <div className="ps-3 flex items-center justify-center pointer-events-none text-slate-400">
        {isFocused ? (
          <Circle className="w-3.5 h-3.5 text-slate-400 stroke-[1.5]" />
        ) : (
          <Plus className="w-3.5 h-3.5 text-slate-500 stroke-[2]" />
        )}
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholderText}
        className="w-full text-xs sm:text-[13px] py-2.5 px-2.5 bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none"
      />

      {title.trim() && (
        <button
          type="submit"
          className="me-2 px-2.5 py-1 bg-slate-800 text-white rounded text-[11px] font-medium hover:bg-slate-700 transition-colors shadow-2xs"
        >
          {t('add')}
        </button>
      )}
    </form>
  )
}
