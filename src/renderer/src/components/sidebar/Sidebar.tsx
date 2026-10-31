import React, { useState, useEffect } from 'react'
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
import { ProfileModal } from '../profile/ProfileModal'

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
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [userName, setUserName] = useState('Abolfazl')

  useEffect(() => {
    const saved = localStorage.getItem('taskora_user_name')
    if (saved) {
      setUserName(saved)
    }
  }, [])

  const handleSaveUserName = (newName: string) => {
    setUserName(newName)
    localStorage.setItem('taskora_user_name', newName)
  }

  const getInitials = (nameStr: string) => {
    const parts = nameStr.trim().split(/\s+/)
    if (parts.length === 0 || !parts[0]) return 'AN'
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    const first = parts[0][0] ?? ''
    const second = parts[1]?.[0] ?? ''
    return (first + second).toUpperCase()
  }

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
      iconColor: 'text-amber-500 fill-amber-500/15',
      activeBg: 'bg-amber-50/70 text-amber-950 font-semibold border border-amber-200/60 shadow-2xs',
      badgeColor: 'bg-amber-100 text-amber-800',
      count: myDayCount
    },
    {
      id: SYSTEM_LIST_IDS.IMPORTANT,
      title: t('important'),
      icon: Star,
      iconColor: 'text-rose-500 fill-rose-500/15',
      activeBg: 'bg-rose-50/70 text-rose-950 font-semibold border border-rose-200/60 shadow-2xs',
      badgeColor: 'bg-rose-100 text-rose-800',
      count: importantCount
    },
    {
      id: SYSTEM_LIST_IDS.PLANNED,
      title: t('planned'),
      icon: Calendar,
      iconColor: 'text-teal-600',
      activeBg: 'bg-teal-50/70 text-teal-950 font-semibold border border-teal-200/60 shadow-2xs',
      badgeColor: 'bg-teal-100 text-teal-800',
      count: plannedCount
    },
    {
      id: SYSTEM_LIST_IDS.TASKS,
      title: t('tasks'),
      icon: CheckSquare,
      iconColor: 'text-indigo-600',
      activeBg: 'bg-indigo-50/70 text-indigo-950 font-semibold border border-indigo-200/60 shadow-2xs',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      count: tasksCount
    }
  ]

  const customLists = lists.filter((l) => !l.isSystem)

  // Curated color pips for custom lists
  const dotColors = [
    'bg-indigo-500',
    'bg-teal-500',
    'bg-rose-500',
    'bg-amber-500',
    'bg-sky-500',
    'bg-violet-500'
  ]

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
    <aside className="w-64 bg-[#f8fafc] border-e border-slate-200/80 flex flex-col h-full select-none shrink-0 font-sans">
      {/* Search Bar with Shortcut hint */}
      <div className="p-3 border-b border-slate-200/70">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute start-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full text-xs ps-8 pe-12 py-1.5 bg-white rounded-lg border border-slate-200/90 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-2xs transition-all"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute end-2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="absolute end-2 text-[10px] text-slate-400 font-mono pointer-events-none bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5">
              Ctrl F
            </kbd>
          )}
        </div>
      </div>

      {/* Nav List Items */}
      <div className="flex-1 overflow-y-auto px-2.5 py-2.5 space-y-1">
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
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all duration-150 cursor-pointer ${
                isActive
                  ? item.activeBg
                  : 'text-slate-700 hover:bg-slate-200/50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${item.iconColor} stroke-[2] shrink-0`} />
                <span className="font-medium truncate">{item.title}</span>
              </div>
              {item.count > 0 && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-semibold ${
                    isActive ? item.badgeColor : 'text-slate-500 bg-slate-200/60'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          )
        })}

        {/* Custom Lists Header */}
        <div className="pt-4 pb-1.5 px-3 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {t('customLists')}
          </span>
          <button
            onClick={() => setIsCreatingList(true)}
            className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer transition-colors"
            title={t('newList')}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Custom Lists */}
        {customLists.map((list, index) => {
          const isActive = activeListId === list.id && !searchQuery
          const count = tasks.filter((t) => !t.completed && t.listId === list.id).length
          const dotColor = dotColors[index % dotColors.length]

          return (
            <div
              key={list.id}
              className={`group flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-slate-200/80 text-slate-950 font-semibold shadow-2xs'
                  : 'text-slate-700 hover:bg-slate-200/40 hover:text-slate-900'
              }`}
              onClick={() => {
                setSearchQuery('')
                setActiveListId(list.id)
              }}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className={`w-2 h-2 rounded-full shrink-0 shadow-2xs ${dotColor}`} />
                <span className="truncate">{list.title}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {count > 0 && (
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-200/50 px-1.5 py-0.2 rounded-full">
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
                  className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-rose-600 transition-opacity rounded cursor-pointer"
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
          <form onSubmit={handleCreateList} className="px-1 pt-1">
            <input
              type="text"
              autoFocus
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsCreatingList(false)
              }}
              placeholder={t('newListPlaceholder')}
              className="w-full text-xs px-3 py-1.5 bg-white rounded-lg border border-indigo-400 text-slate-800 placeholder-slate-400 focus:outline-none ring-1 ring-indigo-400 shadow-2xs"
            />
          </form>
        ) : (
          <button
            onClick={() => setIsCreatingList(true)}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-200/40 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-slate-400" />
            <span>{t('newList')}</span>
          </button>
        )}
      </div>

      {/* Footer: Profile / Workspace and Language toggle */}
      <div className="p-3 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500 bg-white/70 backdrop-blur-xs">
        {/* User Profile Pill (Opens ProfileModal) */}
        <button
          onClick={() => setIsProfileOpen(true)}
          className="flex items-center gap-2.5 p-1 -m-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-start min-w-0 flex-1 me-2"
          title={t('profile')}
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center font-bold text-[10px] tracking-tight shrink-0 shadow-2xs">
            {getInitials(userName)}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="truncate text-xs font-semibold text-slate-800 leading-tight">
              {userName}
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1 leading-tight">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>{t('offlineStorage')}</span>
            </span>
          </div>
        </button>

        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs text-[11px] font-semibold cursor-pointer shrink-0"
          title={t('language')}
        >
          <Globe className="w-3 h-3 text-slate-500" />
          <span>{locale === 'fa' ? 'FA' : 'EN'}</span>
        </button>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userName={userName}
        onSaveUserName={handleSaveUserName}
      />
    </aside>
  )
}
