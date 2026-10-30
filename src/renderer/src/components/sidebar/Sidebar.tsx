import React, { useState } from 'react'
import {
  Sun,
  Star,
  Calendar,
  CheckSquare,
  List as ListIcon,
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

  // Calculate counts for smart lists
  const myDayCount = tasks.filter((t) => !t.completed && t.isMyDay && t.myDayDate === today).length
  const importantCount = tasks.filter((t) => !t.completed && t.isImportant).length
  const plannedCount = tasks.filter((t) => !t.completed && t.dueDate).length
  const tasksCount = tasks.filter((t) => !t.completed && t.listId === SYSTEM_LIST_IDS.TASKS).length

  const smartLists = [
    {
      id: SYSTEM_LIST_IDS.MY_DAY,
      title: t('myDay'),
      icon: Sun,
      color: 'text-blue-500',
      activeBg: 'bg-blue-50/80 text-blue-700 font-medium',
      count: myDayCount
    },
    {
      id: SYSTEM_LIST_IDS.IMPORTANT,
      title: t('important'),
      icon: Star,
      color: 'text-red-500',
      activeBg: 'bg-red-50/80 text-red-700 font-medium',
      count: importantCount
    },
    {
      id: SYSTEM_LIST_IDS.PLANNED,
      title: t('planned'),
      icon: Calendar,
      color: 'text-emerald-500',
      activeBg: 'bg-emerald-50/80 text-emerald-700 font-medium',
      count: plannedCount
    },
    {
      id: SYSTEM_LIST_IDS.TASKS,
      title: t('tasks'),
      icon: CheckSquare,
      color: 'text-indigo-500',
      activeBg: 'bg-indigo-50/80 text-indigo-700 font-medium',
      count: tasksCount
    }
  ]

  const customLists = lists.filter((l) => !l.isSystem)

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
    <aside className="w-64 bg-slate-50 border-e border-slate-200 flex flex-col h-full select-none shrink-0">
      {/* Search Bar */}
      <div className="p-3 border-b border-slate-200/80">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full text-xs ps-9 pe-7 py-2 bg-white rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute end-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Nav List Items */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
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
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                isActive ? item.activeBg : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${item.color}`} />
                <span>{item.title}</span>
              </div>
              {item.count > 0 && (
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-200/80 px-1.5 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
            </button>
          )
        })}

        {/* Custom Lists Divider */}
        <div className="pt-4 pb-1 px-3">
          <div className="border-t border-slate-200/80 mb-2"></div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {t('customLists')}
          </span>
        </div>

        {/* Custom Lists */}
        {customLists.map((list) => {
          const isActive = activeListId === list.id && !searchQuery
          const count = tasks.filter((t) => !t.completed && t.listId === list.id).length

          return (
            <div
              key={list.id}
              className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
              onClick={() => {
                setSearchQuery('')
                setActiveListId(list.id)
              }}
            >
              <div className="flex items-center gap-3 truncate">
                <ListIcon className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="truncate">{list.title}</span>
              </div>

              <div className="flex items-center gap-1">
                {count > 0 && (
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-200/80 px-1.5 py-0.5 rounded-full">
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
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-600 transition-opacity rounded"
                  title={t('deleteList')}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}

        {/* New List Form */}
        {isCreatingList ? (
          <form onSubmit={handleCreateList} className="px-2 pt-2">
            <input
              type="text"
              autoFocus
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsCreatingList(false)
              }}
              placeholder={t('newListPlaceholder')}
              className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-blue-400 text-slate-800 placeholder-slate-400 focus:outline-none ring-1 ring-blue-400"
            />
          </form>
        ) : (
          <button
            onClick={() => setIsCreatingList(true)}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-600 hover:text-blue-600 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('newList')}</span>
          </button>
        )}
      </div>

      {/* Footer: Language and Workspace info */}
      <div className="p-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 bg-slate-100/60">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
            AN
          </div>
          <span className="truncate max-w-[110px] font-medium text-slate-700">Abolfazl</span>
        </div>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-xs"
          title={t('language')}
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="font-semibold text-[11px]">{locale === 'fa' ? 'FA' : 'EN'}</span>
        </button>
      </div>
    </aside>
  )
}
