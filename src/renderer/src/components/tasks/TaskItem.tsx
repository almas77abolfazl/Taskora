import React from 'react'
import { Check, Star, Calendar, Sun, Folder } from 'lucide-react'
import { Task } from '@core/domain/entities'
import { useTasks } from '../../context/TaskContext'
import { useI18n } from '../../i18n/context'

interface TaskItemProps {
  task: Task
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleTaskComplete, toggleTaskImportant, selectedTaskId, setSelectedTaskId, lists } =
    useTasks()
  const { t, formatRelativeDate } = useI18n()

  const isSelected = selectedTaskId === task.id
  const completedSubtasksCount = task.subtasks.filter((s) => s.completed).length
  const totalSubtasksCount = task.subtasks.length

  const list = lists.find((l) => l.id === task.listId)

  // Check if overdue
  const isOverdue =
    task.dueDate &&
    !task.completed &&
    new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0)

  return (
    <div
      onClick={() => setSelectedTaskId(task.id)}
      className={`group flex items-center justify-between px-3.5 py-2.5 rounded-lg border transition-all duration-150 cursor-pointer select-none ${
        isSelected
          ? 'bg-blue-50/40 border-blue-400/80 shadow-xs ring-1 ring-blue-500/20'
          : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-2xs'
      } ${task.completed ? 'opacity-65 bg-slate-50/60' : 'opacity-100'}`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Completion Checkbox */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            toggleTaskComplete(task.id)
          }}
          className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-150 ${
            task.completed
              ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
              : 'border-slate-300 hover:border-slate-600 text-transparent hover:text-slate-400 bg-white'
          }`}
          title={task.completed ? t('markIncomplete') : t('markComplete')}
        >
          <Check className="w-2.5 h-2.5 stroke-[3]" />
        </button>

        {/* Title and metadata */}
        <div className="flex flex-col min-w-0 flex-1">
          <span
            className={`text-xs sm:text-[13px] tracking-tight truncate transition-all duration-150 ${
              task.completed
                ? 'line-through text-slate-400 font-normal'
                : 'text-slate-900 font-medium'
            }`}
          >
            {task.title}
          </span>

          {/* Metadata badges */}
          {(totalSubtasksCount > 0 || task.dueDate || task.isMyDay || (list && !list.isSystem)) && (
            <div className="flex items-center gap-2.5 mt-0.5 text-[11px] text-slate-500 flex-wrap">
              {/* Custom list badge */}
              {list && !list.isSystem && (
                <span className="flex items-center gap-1 text-slate-600 font-normal">
                  <Folder className="w-3 h-3 text-slate-400" />
                  <span>{list.title}</span>
                </span>
              )}

              {/* Subtasks counter */}
              {totalSubtasksCount > 0 && (
                <span className="flex items-center gap-1 text-slate-500">
                  <span className="font-mono text-[10px]">
                    {completedSubtasksCount}/{totalSubtasksCount}
                  </span>
                </span>
              )}

              {/* My Day indicator */}
              {task.isMyDay && (
                <span className="flex items-center gap-1 text-blue-700 font-medium">
                  <Sun className="w-3 h-3 text-blue-600" />
                  <span>{t('myDay')}</span>
                </span>
              )}

              {/* Due Date pill */}
              {task.dueDate && (
                <span
                  className={`flex items-center gap-1 font-medium ${
                    isOverdue ? 'text-amber-700 font-semibold' : 'text-slate-600'
                  }`}
                >
                  <Calendar className="w-3 h-3" />
                  <span>{formatRelativeDate(task.dueDate)}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Important Star button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          toggleTaskImportant(task.id)
        }}
        className={`p-1.5 rounded-md transition-colors ms-2 ${
          task.isImportant
            ? 'text-amber-500 hover:text-amber-600'
            : 'text-slate-300 hover:text-slate-500 group-hover:text-slate-400'
        }`}
        title={t('important')}
      >
        <Star
          className={`w-4 h-4 transition-transform duration-150 ${
            task.isImportant ? 'fill-amber-500 scale-105' : 'stroke-[1.5]'
          }`}
        />
      </button>
    </div>
  )
}
