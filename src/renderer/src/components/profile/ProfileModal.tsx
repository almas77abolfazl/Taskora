import React, { useState, useEffect } from 'react'
import { X, HardDrive, Cloud, ShieldCheck } from 'lucide-react'
import { useI18n } from '../../i18n/context'
import { useTasks } from '../../context/TaskContext'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  userName: string
  onSaveUserName: (newName: string) => void
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userName,
  onSaveUserName
}) => {
  const { t } = useI18n()
  const { tasks } = useTasks()
  const [name, setName] = useState(userName)

  useEffect(() => {
    setName(userName)
  }, [userName])

  if (!isOpen) return null

  const totalTasksCount = tasks.length
  const completedCount = tasks.filter((t) => t.completed).length
  const pendingCount = totalTasksCount - completedCount

  const getInitials = (nameStr: string) => {
    const parts = nameStr.trim().split(/\s+/)
    if (parts.length === 0 || !parts[0]) return 'US'
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    const first = parts[0][0] ?? ''
    const second = parts[1]?.[0] ?? ''
    return (first + second).toUpperCase()
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSaveUserName(name.trim())
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs select-none">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <h2 className="text-xs font-bold text-slate-800 tracking-tight">{t('profile')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
            title={t('cancel')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Avatar & Display Name preview */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center font-bold text-base shadow-sm ring-2 ring-indigo-100">
              {getInitials(name)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-900 truncate">{name || 'User'}</h3>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                <span>{t('offlineStorage')}</span>
              </p>
            </div>
          </div>

          {/* Edit Name Form */}
          <form onSubmit={handleSave} className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-600 block">
              {t('profileName')}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('profileNamePlaceholder')}
                className="flex-1 text-xs px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              <button
                type="submit"
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs transition-colors"
              >
                {t('save')}
              </button>
            </div>
          </form>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 py-1">
            <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-slate-400 block font-medium">
                {t('totalTasks')}
              </span>
              <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                {totalTasksCount}
              </span>
            </div>
            <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-emerald-700 block font-medium">
                {t('completedCount')}
              </span>
              <span className="text-sm font-bold text-emerald-800 mt-0.5 block">
                {completedCount}
              </span>
            </div>
            <div className="bg-indigo-50/60 border border-indigo-200/70 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-indigo-700 block font-medium">
                {t('pendingCount')}
              </span>
              <span className="text-sm font-bold text-indigo-800 mt-0.5 block">
                {pendingCount}
              </span>
            </div>
          </div>

          {/* Storage & Cloud Cards */}
          <div className="space-y-2 pt-1">
            {/* Local Storage Card */}
            <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-200/80 bg-slate-50/50">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                <HardDrive className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">
                    {t('offlineStorage')}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                    {t('activeStatus')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  {t('offlineStorageDesc')}
                </p>
              </div>
            </div>

            {/* Cloud Sync (Coming Soon) Card */}
            <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-200/80 bg-slate-50/30 opacity-85">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 shrink-0 mt-0.5">
                <Cloud className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">{t('cloudSync')}</span>
                  <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100 px-1.5 py-0.2 rounded-full">
                    {t('comingSoon')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  {t('cloudSyncDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}
