import React, { useState } from 'react'
import {
  Sun,
  Star,
  Calendar,
  CheckSquare,
  Plus,
  Trash2,
  Globe,
  Search,
  X
} from 'lucide-react'
import { useTasks } from '../../context/TaskContext'
import { useI18n } from '../../i18n/context'
import { SYSTEM_LIST_IDS } from '@core/domain/entities'
import { getTodayString } from '../../lib/date-utils'

export const Sidebar: React.FC = () => {
  const {
    lists,
    tasks,
    activeListId,
    setActiveListId,
    createList,
    deleteList,
    searchQuery,
    setSearchQuery
  } = useTasks()
  const { t, locale, setLocale } = useI18n()
  const [newListName, setNewListName] = useState('')
  const [isCreatingList, setIsCreatingList] = useState(false)

  const today = getTodayString()

  // Calculate task counts
  const myDayCount = tasks.filter((t) => !t.completed && t.isMyDay && t.myDayDate === today).length
  const importantCount = tasks.filter((t) => !t.completed && t.isImportant).length
  const plannedCount = tasks.filter((t) => !t.completed && t.dueDate).length
  const tasksCount = tasks.filter((t) => !t.completed && t.listId === SYSTEM_LIST_IDS.TASKS).length

  const smartLists = [
    {
      id: SYSTEM_LIST_IDS.MY_DAY,
      title: t('myDay'),
      icon: Sun,
      color: 'text-blue-600',
      count: myDayCount
    },
    {
      id: SYSTEM_LIST_IDS.IMPORTANT,
      title: t('important'),
      icon: Star,
      color: 'text-amber-500',
      count: importantCount
    },
    {
      id: SYSTEM_LIST_IDS.PLANNED,
      title: t('planned'),
      icon: Calendar,
      color: 'text-emerald-600',
      count: plannedCount
    },
    {
      id: SYSTEM_LIST_IDS.TASKS,
      title: t('tasks'),
      icon: CheckSquare,
      color: 'text-slate-700',
      count: tasksCount
    }
  ]

  const customLists = lists.filter((l) => !l.isSystem)

  // Palette of subtle, elegant dots for custom lists
  const dotColors = ['bg-indigo-500', 'bg-teal-500', 'bg-rose-500', 'bg-amber-500', 'bg-sky-500']

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newListName.trim()) return
    await createList(newListName.trim())
    setNewListName('')
    setIsCreatingList(false)
  }

  const toggleLanguage = () => {
    setLocale(locale === 'fa' ? 'en' : 'fa')
  }

  return (
    <aside className="w-60 bg-[#f9fafb] border-e border-slate-200/70 flex flex-col h-full select-none shrink-0 font-sans">
      {/* Search Bar with Shortcut hint */}
      <div className="p-3 border-b border-slate-200/60">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute start-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full text-xs ps-8 pe-12 py-1.5 bg-white rounded-md border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute end-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="absolute end-2 text-[10px] text-slate-400 font-mono pointer-events-none border border-slate-200 rounded px-1">
              Ctrl F
            </span>
          )}
        </div>
      </div>

      {/* Nav List Items */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {smartLists.map((item) => {
          const Icon = item.icon
          const isActive = activeListId === item.id && !searchQuery

          return (
            <button
              key={item.id}
              onClick={() => {
                setSearchQuery('')
                setActiveListId(item.id)
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors duration-100 ${
                isActive
                  ? 'bg-slate-200/70 text-slate-900 font-semibold'
                  : 'text-slate-700 hover:bg-slate-200/40 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${item.color} stroke-[1.8]`} />
                <span>{item.title}</span>
              </div>
              {item.count > 0 && (
                <span className="text-[11px] font-mono text-slate-500 px-1 py-0.2 rounded">
                  {item.count}
                </span>
              )}
            </button>
          )
        })}

        {/* Custom Lists Header */}
        <div className="pt-4 pb-1 px-2.5 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {t('customLists')}
          </span>
        </div>

        {/* Custom Lists */}
        {customLists.map((list, index) => {
          const isActive = activeListId === list.id && !searchQuery
          const count = tasks.filter((t) => !t.completed && t.listId === list.id).length
          const dotColor = dotColors[index % dotColors.length]

          return (
            <div
              key={list.id}
              className={`group flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors duration-100 cursor-pointer ${
                isActive
                  ? 'bg-slate-200/70 text-slate-900 font-semibold'
                  : 'text-slate-700 hover:bg-slate-200/40 hover:text-slate-900'
              }`}
              onClick={() => {
                setSearchQuery('')
                setActiveListId(list.id)
              }}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
                <span className="truncate">{list.title}</span>
              </div>

              <div className="flex items-center gap-1">
                {count > 0 && (
                  <span className="text-[11px] font-mono text-slate-500">
                    {count}
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (window.confirm(t('deleteListConfirm'))) {
                      deleteList(list.id)
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-rose-600 transition-opacity rounded"
                  title={t('deleteList')}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          )
        })}

        {/* New List Form */}
        {isCreatingList ? (
          <form onSubmit={handleCreateList} className="px-1 pt-1.5">
            <input
              type="text"
              autoFocus
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsCreatingList(false)
              }}
              placeholder={t('newListPlaceholder')}
              className="w-full text-xs px-2.5 py-1.5 bg-white rounded-md border border-slate-400 text-slate-800 placeholder-slate-400 focus:outline-none ring-1 ring-slate-400 shadow-xs"
            />
          </form>
        ) : (
          <button
            onClick={() => setIsCreatingList(true)}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-200/40 rounded-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-slate-400" />
            <span>{t('newList')}</span>
          </button>
        )}
      </div>

      {/* Footer: Language toggle and Workspace badge */}
      <div className="p-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 bg-slate-100/40">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-slate-800 text-slate-100 flex items-center justify-center font-bold text-[9px] tracking-tight">
            AN
          </div>
          <span className="truncate max-w-[100px] text-[11px] font-medium text-slate-700">Abolfazl</span>
        </div>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs text-[11px] font-semibold"
          title={t('language')}
        >
          <Globe className="w-3 h-3 text-slate-500" />
          <span>{locale === 'fa' ? 'FA' : 'EN'}</span>
        </button>
      </div>
    </aside>
  )
}
