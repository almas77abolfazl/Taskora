import React, { useState } from 'react'
import {
  Sun,
  Star,
  Calendar,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Search,
  Folder
} from 'lucide-react'
import { useTasks } from '../../context/TaskContext'
import { useI18n } from '../../i18n/context'
import { QuickAddInput } from './QuickAddInput'
import { TaskItem } from './TaskItem'
import { SYSTEM_LIST_IDS } from '@core/domain/entities'

export const TaskView: React.FC = () => {
  const { filteredTasks, activeList, activeListId, searchQuery } = useTasks()
  const { t, formatDate } = useI18n()
  const [isCompletedExpanded, setIsCompletedExpanded] = useState(true)

  const activeTasks = filteredTasks.filter((t) => !t.completed)
  const completedTasks = filteredTasks.filter((t) => t.completed)
  const totalInView = activeTasks.length + completedTasks.length

  const getListBadge = () => {
    switch (activeListId) {
      case SYSTEM_LIST_IDS.MY_DAY:
        return {
          icon: <Sun className="w-5 h-5 text-white stroke-[2]" />,
          gradient: 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/20'
        }
      case SYSTEM_LIST_IDS.IMPORTANT:
        return {
          icon: <Star className="w-5 h-5 text-white fill-white/20 stroke-[2]" />,
          gradient: 'bg-gradient-to-br from-rose-500 to-pink-600 shadow-rose-500/20'
        }
      case SYSTEM_LIST_IDS.PLANNED:
        return {
          icon: <Calendar className="w-5 h-5 text-white stroke-[2]" />,
          gradient: 'bg-gradient-to-br from-teal-500 to-emerald-600 shadow-teal-500/20'
        }
      case SYSTEM_LIST_IDS.TASKS:
        return {
          icon: <CheckSquare className="w-5 h-5 text-white stroke-[2]" />,
          gradient: 'bg-gradient-to-br from-indigo-500 to-sky-600 shadow-indigo-500/20'
        }
      default:
        return {
          icon: <Folder className="w-5 h-5 text-white stroke-[2]" />,
          gradient: 'bg-gradient-to-br from-slate-600 to-slate-800 shadow-slate-500/20'
        }
    }
  }

  const getListTitle = () => {
    if (searchQuery.trim()) {
      return `${t('search')}: "${searchQuery}"`
    }
    switch (activeListId) {
      case SYSTEM_LIST_IDS.MY_DAY:
        return t('myDay')
      case SYSTEM_LIST_IDS.IMPORTANT:
        return t('important')
      case SYSTEM_LIST_IDS.PLANNED:
        return t('planned')
      case SYSTEM_LIST_IDS.TASKS:
        return t('tasks')
      default:
        return activeList?.title ?? t('tasks')
    }
  }

  const badge = getListBadge()
  const todayFormatted = formatDate(new Date())

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fafbfc] overflow-hidden select-none">
      {/* View Header with distinctive hero styling */}
      <div className="px-7 pt-6 pb-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {searchQuery ? (
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-md">
                <Search className="w-5 h-5 stroke-[2]" />
              </div>
            ) : (
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${badge.gradient}`}
              >
                {badge.icon}
              </div>
            )}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {getListTitle()}
              </h1>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">{todayFormatted}</p>
            </div>
          </div>

          {/* Completion Progress pill */}
          {totalInView > 0 && !searchQuery && (
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200/80 shadow-2xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-mono font-semibold text-slate-600">
                {completedTasks.length}/{totalInView} {t('completedCount')}
              </span>
            </div>
          )}
        </div>

        {/* Quick Add Input Bar */}
        {!searchQuery && (
          <div className="mt-4">
            <QuickAddInput />
          </div>
        )}
      </div>

      {/* Task List Container */}
      <div className="flex-1 overflow-y-auto px-7 pb-6 space-y-1.5">
        {activeTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}

        {/* Empty State */}
        {activeTasks.length === 0 && completedTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center select-none">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-400 mb-3 border border-slate-200/80 shadow-xs">
              <CheckCircle2 className="w-7 h-7 stroke-[1.4] text-indigo-500/70" />
            </div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-800">
              {searchQuery ? t('emptySearchTitle') : t('emptyTasksTitle')}
            </h3>
            <p className="text-[11px] text-slate-400 max-w-xs mt-1 leading-relaxed">
              {!searchQuery && t('emptyTasksSubtitle')}
            </p>
          </div>
        )}

        {/* Completed Section Divider */}
        {completedTasks.length > 0 && (
          <div className="pt-3">
            <button
              onClick={() => setIsCompletedExpanded(!isCompletedExpanded)}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-slate-700 transition-colors py-1 select-none cursor-pointer"
            >
              {isCompletedExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
              <span>
                {t('completedTasks')} ({completedTasks.length})
              </span>
            </button>

            {isCompletedExpanded && (
              <div className="mt-1.5 space-y-1.5">
                {completedTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
