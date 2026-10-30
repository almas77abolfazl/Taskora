import React from 'react'
import { Check, Star, Calendar, Sun, CheckSquare } from 'lucide-react'
import { Task } from '@core/domain/entities'
import { useTasks } from '../../context/TaskContext'
import { useI18n } from '../../i18n/context'

interface TaskItemProps {
  task: Task
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleTaskComplete, toggleTaskImportant, selectedTaskId, setSelectedTaskId, lists } =
    useTasks()
  const { formatRelativeDate } = useI18n()

  const isSelected = selectedTaskId === task.id
  const completedSubtasksCount = task.subtasks.filter((s) => s.completed).length
  const totalSubtasksCount = task.subtasks.length

  const list = lists.find((l) => l.id === task.listId)

  // Check if overdue
  const isOverdue =
    task.dueDate && !task.completed && new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0)

  return (
    <div
      onClick={() => setSelectedTaskId(task.id)}
      className={`group flex items-center justify-between p-3 rounded-xl border transition-all duration-150 cursor-pointer select-none bg-white ${
        isSelected
          ? 'border-blue-500 ring-1 ring-blue-500 shadow-sm'
          : 'border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Completion Checkbox */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            toggleTaskComplete(task.id)
          }}
          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
            task.completed
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'border-slate-300 hover:border-blue-600 text-transparent hover:text-slate-400'
          }`}
        >
          <Check className="w-3 h-3 stroke-[2.5]" />
        </button>

        {/* Title and metadata */}
        <div className="flex flex-col min-w-0 flex-1">
          <span
            className={`text-xs sm:text-sm font-medium truncate transition-all ${
              task.completed ? 'line-through text-slate-400 font-normal' : 'text-slate-800'
            }`}
          >
            {task.title}
          </span>

          {/* Metadata badges */}
          {(totalSubtasksCount > 0 || task.dueDate || task.isMyDay || list) && (
            <div className="flex items-center gap-2.5 mt-1 text-[11px] text-slate-500 flex-wrap">
              {/* List name badge */}
              {list && !list.isSystem && (
                <span className="flex items-center gap-1 text-slate-600">
                  <CheckSquare className="w-3 h-3" />
                  <span>{list.title}</span>
                </span>
              )}

              {/* Subtasks pill */}
              {totalSubtasksCount > 0 && (
                <span className="flex items-center gap-1 text-slate-500">
                  <Check className="w-3 h-3 text-slate-400" />
                  <span>
                    {completedSubtasksCount} of {totalSubtasksCount}
                  </span>
                </span>
              )}

              {/* My Day pill */}
              {task.isMyDay && (
                <span className="flex items-center gap-1 text-blue-600 font-medium">
                  <Sun className="w-3 h-3" />
                  <span>My Day</span>
                </span>
              )}

              {/* Due Date pill */}
              {task.dueDate && (
                <span
                  className={`flex items-center gap-1 font-medium ${
                    isOverdue ? 'text-red-500' : 'text-slate-600'
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

      {/* Star button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          toggleTaskImportant(task.id)
        }}
        className={`p-1.5 rounded-lg transition-colors ms-2 ${
          task.isImportant
            ? 'text-red-500 hover:text-red-600'
            : 'text-slate-300 hover:text-slate-500 group-hover:text-slate-400'
        }`}
        title="Important"
      >
        <Star
          className={`w-4 h-4 transition-transform ${
            task.isImportant ? 'fill-red-500 scale-105' : 'stroke-[1.5]'
          }`}
        />
      </button>
    </div>
  )
}
