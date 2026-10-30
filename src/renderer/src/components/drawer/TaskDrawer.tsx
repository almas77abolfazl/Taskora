import React, { useState, useEffect } from 'react'
import {
  X,
  Star,
  Check,
  Sun,
  Calendar,
  Trash2,
  Plus
} from 'lucide-react'
import { useTasks } from '../../context/TaskContext'
import { useI18n } from '../../i18n/context'
import { getTodayString } from '../../lib/date-utils'

export const TaskDrawer: React.FC = () => {
  const {
    selectedTask,
    setSelectedTaskId,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    toggleTaskImportant,
    toggleTaskMyDay,
    addSubTask,
    updateSubTask,
    deleteSubTask
  } = useTasks()
  const { t, formatDate } = useI18n()

  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [newStepTitle, setNewStepTitle] = useState('')

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title)
      setNotes(selectedTask.notes || '')
    }
  }, [selectedTask])

  if (!selectedTask) return null

  const handleTitleBlur = async () => {
    if (title.trim() && title !== selectedTask.title) {
      await updateTask(selectedTask.id, { title: title.trim() })
    }
  }

  const handleNotesBlur = async () => {
    if (notes !== selectedTask.notes) {
      await updateTask(selectedTask.id, { notes })
    }
  }

  const handleAddStep = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStepTitle.trim()) return
    await addSubTask(selectedTask.id, newStepTitle.trim())
    setNewStepTitle('')
  }

  const handleSetDueDate = async (preset: 'today' | 'tomorrow' | 'nextWeek' | 'clear') => {
    if (preset === 'clear') {
      await updateTask(selectedTask.id, { dueDate: null })
      return
    }

    const d = new Date()
    if (preset === 'tomorrow') {
      d.setDate(d.getDate() + 1)
    } else if (preset === 'nextWeek') {
      d.setDate(d.getDate() + 7)
    }

    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    await updateTask(selectedTask.id, { dueDate: `${year}-${month}-${day}` })
  }

  const handleDeleteTask = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(selectedTask.id)
    }
  }

  const today = getTodayString()
  const isMyDayActive = selectedTask.isMyDay && selectedTask.myDayDate === today

  return (
    <div className="w-80 bg-white border-s border-slate-200 flex flex-col h-full shadow-lg z-10 shrink-0 select-none animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-200/80 flex items-start gap-3">
        {/* Completion checkbox */}
        <button
          onClick={() => toggleTaskComplete(selectedTask.id)}
          className={`w-5 h-5 mt-1 rounded-full border flex items-center justify-center shrink-0 transition-all ${
            selectedTask.completed
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'border-slate-300 hover:border-blue-600 text-transparent hover:text-slate-400'
          }`}
        >
          <Check className="w-3 h-3 stroke-[2.5]" />
        </button>

        {/* Editable Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          className={`flex-1 text-sm font-semibold bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 ${
            selectedTask.completed ? 'line-through text-slate-400' : 'text-slate-800'
          }`}
        />

        {/* Star Button */}
        <button
          onClick={() => toggleTaskImportant(selectedTask.id)}
          className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
          title="Important"
        >
          <Star
            className={`w-4 h-4 ${
              selectedTask.isImportant ? 'fill-red-500 text-red-500' : 'stroke-[1.5]'
            }`}
          />
        </button>

        {/* Close Button */}
        <button
          onClick={() => setSelectedTaskId(null)}
          className="p-1 rounded text-slate-400 hover:text-slate-600 transition-colors"
          title={t('cancel')}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Subtasks (Steps) */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/70 space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            {t('steps')}
          </span>

          {selectedTask.subtasks.map((step) => (
            <div
              key={step.id}
              className="flex items-center justify-between gap-2 py-1 group"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <button
                  onClick={() =>
                    updateSubTask(selectedTask.id, step.id, { completed: !step.completed })
                  }
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    step.completed
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-slate-300 text-transparent hover:text-slate-400'
                  }`}
                >
                  <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                </button>
                <span
                  className={`text-xs truncate ${
                    step.completed ? 'line-through text-slate-400' : 'text-slate-700'
                  }`}
                >
                  {step.title}
                </span>
              </div>

              <button
                onClick={() => deleteSubTask(selectedTask.id, step.id)}
                className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-red-600 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Add Step Input */}
          <form onSubmit={handleAddStep} className="pt-1 flex items-center gap-2">
            <Plus className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <input
              type="text"
              value={newStepTitle}
              onChange={(e) => setNewStepTitle(e.target.value)}
              placeholder={t('addStep')}
              className="w-full text-xs bg-transparent text-slate-700 placeholder-slate-400 focus:outline-none"
            />
          </form>
        </div>

        {/* Add to My Day Action */}
        <button
          onClick={() => toggleTaskMyDay(selectedTask.id)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
            isMyDayActive
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Sun className={`w-4 h-4 ${isMyDayActive ? 'text-blue-600' : 'text-slate-400'}`} />
          <span>{isMyDayActive ? t('addedToMyDay') : t('addToMyDay')}</span>
        </button>

        {/* Due Date Presets */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{t('dueDate')}</span>
            </div>
            {selectedTask.dueDate && (
              <span className="text-[11px] text-blue-600 font-semibold">
                {formatDate(selectedTask.dueDate)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <button
              onClick={() => handleSetDueDate('today')}
              className="px-2 py-1.5 text-[11px] rounded bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-center font-medium transition-colors"
            >
              {t('today')}
            </button>
            <button
              onClick={() => handleSetDueDate('tomorrow')}
              className="px-2 py-1.5 text-[11px] rounded bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-center font-medium transition-colors"
            >
              {t('tomorrow')}
            </button>
            <button
              onClick={() => handleSetDueDate('nextWeek')}
              className="px-2 py-1.5 text-[11px] rounded bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-center font-medium transition-colors"
            >
              {t('nextWeek')}
            </button>
          </div>

          {selectedTask.dueDate && (
            <button
              onClick={() => handleSetDueDate('clear')}
              className="w-full text-[11px] text-slate-500 hover:text-red-600 pt-1 text-center transition-colors block"
            >
              {t('noDueDate')}
            </button>
          )}
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-3 space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            {t('addNote')}
          </span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleNotesBlur}
            placeholder={t('notePlaceholder')}
            rows={4}
            className="w-full text-xs bg-slate-50/50 rounded-lg p-2.5 border border-slate-200/80 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="p-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-400 bg-slate-50">
        <span>
          {t('createdOn')} {formatDate(selectedTask.createdAt)}
        </span>

        <button
          onClick={handleDeleteTask}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          title={t('deleteTask')}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

