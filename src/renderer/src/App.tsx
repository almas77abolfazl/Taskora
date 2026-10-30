import React from 'react'
import { I18nProvider } from './i18n/context'
import { TaskProvider } from './context/TaskContext'
import { AppShell } from './components/layout/AppShell'

export const App: React.FC = () => {
  return (
    <I18nProvider>
      <TaskProvider>
        <AppShell />
      </TaskProvider>
    </I18nProvider>
  )
}

export default App
