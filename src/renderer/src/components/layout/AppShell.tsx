import React, { useEffect } from 'react'
import { TitleBar } from './TitleBar'
import { Sidebar } from '../sidebar/Sidebar'
import { TaskView } from '../tasks/TaskView'
import { TaskDrawer } from '../drawer/TaskDrawer'
import { useTasks } from '../../context/TaskContext'

export const AppShell: React.FC = () => {
  const { selectedTaskId, setSelectedTaskId } = useTasks()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedTaskId) {
        setSelectedTaskId(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedTaskId, setSelectedTaskId])

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 text-slate-800">
      {/* Native desktop window TitleBar */}
      <TitleBar />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Central Tasks List / Views */}
        <main className="flex-1 flex overflow-hidden">
          <TaskView />
        </main>

        {/* Sliding Task Details Inspector */}
        <TaskDrawer />
      </div>
    </div>
  )
}
