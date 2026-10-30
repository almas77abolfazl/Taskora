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
      className={`relative flex items-center bg-white rounded-xl border transition-all duration-200 shadow-xs ${
        isFocused
          ? 'border-blue-500 ring-2 ring-blue-500/10 shadow-sm'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      <div className="ps-3.5 flex items-center justify-center pointer-events-none text-slate-400">
        {isFocused ? (
          <Circle className="w-4 h-4 text-slate-400 stroke-[1.5]" />
        ) : (
          <Plus className="w-4 h-4 text-blue-600 stroke-[2]" />
        )}
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholderText}
        className="w-full text-xs sm:text-sm py-3 px-3 bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none"
      />

      {title.trim() && (
        <button
          type="submit"
          className="me-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
        >
          {t('add')}
        </button>
      )}
    </form>
  )
}
