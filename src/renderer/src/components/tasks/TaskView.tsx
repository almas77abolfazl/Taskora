import React, { useState } from 'react'
import {
  Sun,
  Star,
  Calendar,
  CheckSquare,
  List as ListIcon,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Search
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
        return <Sun className="w-6 h-6 text-blue-500" />
      case SYSTEM_LIST_IDS.IMPORTANT:
        return <Star className="w-6 h-6 text-red-500" />
      case SYSTEM_LIST_IDS.PLANNED:
        return <Calendar className="w-6 h-6 text-emerald-500" />
      case SYSTEM_LIST_IDS.TASKS:
        return <CheckSquare className="w-6 h-6 text-indigo-500" />
      default:
        return <ListIcon className="w-6 h-6 text-blue-600" />
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
    <div className="flex-1 flex flex-col h-full bg-slate-50/50 overflow-hidden">
      {/* View Header */}
      <div className="px-6 pt-6 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          {searchQuery ? <Search className="w-6 h-6 text-blue-600" /> : getListIcon()}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              {getListTitle()}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{todayFormatted}</p>
          </div>
        </div>

        {/* Quick Add Input (hidden when actively searching) */}
        {!searchQuery && (
          <div className="mt-4">
            <QuickAddInput />
          </div>
        )}
      </div>

      {/* Task List Container */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-2">
        {activeTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}

        {/* Empty State */}
        {activeTasks.length === 0 && completedTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center select-none">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 mb-3 border border-blue-100">
              <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700">
              {searchQuery ? t('emptySearchTitle') : t('emptyTasksTitle')}
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              {!searchQuery && t('emptyTasksSubtitle')}
            </p>
          </div>
        )}

        {/* Completed Section Divider */}
        {completedTasks.length > 0 && (
          <div className="pt-4">
            <button
              onClick={() => setIsCompletedExpanded(!isCompletedExpanded)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors py-1.5 select-none"
            >
              {isCompletedExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <span>
                {t('completedTasks')} ({completedTasks.length})
              </span>
            </button>

            {isCompletedExpanded && (
              <div className="mt-2 space-y-2">
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

