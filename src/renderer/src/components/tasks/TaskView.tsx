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

  const getListIcon = () => {
    switch (activeListId) {
      case SYSTEM_LIST_IDS.MY_DAY:
        return <Sun className="w-5 h-5 text-blue-600 stroke-[2]" />
      case SYSTEM_LIST_IDS.IMPORTANT:
        return <Star className="w-5 h-5 text-amber-500 fill-amber-500/20 stroke-[2]" />
      case SYSTEM_LIST_IDS.PLANNED:
        return <Calendar className="w-5 h-5 text-emerald-600 stroke-[2]" />
      case SYSTEM_LIST_IDS.TASKS:
        return <CheckSquare className="w-5 h-5 text-slate-700 stroke-[2]" />
      default:
        return <Folder className="w-5 h-5 text-slate-600 stroke-[2]" />
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

  const todayFormatted = formatDate(new Date())

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fbfbfb] overflow-hidden select-none">
      {/* View Header */}
      <div className="px-6 pt-5 pb-3 shrink-0">
        <div className="flex items-center gap-3">
          {searchQuery ? <Search className="w-5 h-5 text-slate-600 stroke-[2]" /> : getListIcon()}
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {getListTitle()}
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">{todayFormatted}</p>
          </div>
        </div>

        {/* Quick Add Input */}
        {!searchQuery && (
          <div className="mt-3.5">
            <QuickAddInput />
          </div>
        )}
      </div>

      {/* Task List Container */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-1.5">
        {activeTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}

        {/* Empty State */}
        {activeTasks.length === 0 && completedTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center select-none">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-2.5 border border-slate-200/60">
              <CheckCircle2 className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-xs font-semibold text-slate-700">
              {searchQuery ? t('emptySearchTitle') : t('emptyTasksTitle')}
            </h3>
            <p className="text-[11px] text-slate-400 max-w-xs mt-0.5">
              {!searchQuery && t('emptyTasksSubtitle')}
            </p>
          </div>
        )}

        {/* Completed Section Divider */}
        {completedTasks.length > 0 && (
          <div className="pt-3">
            <button
              onClick={() => setIsCompletedExpanded(!isCompletedExpanded)}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-slate-700 transition-colors py-1 select-none"
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
