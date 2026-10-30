import React from 'react'

export const App: React.FC = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-50 text-slate-800">
      <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm max-w-md text-center">
        <h1 className="text-xl font-semibold text-slate-900 mb-2">Task Manager</h1>
        <p className="text-sm text-slate-600">
          Desktop task management application with clean architecture and offline storage.
        </p>
      </div>
    </div>
  )
}

export default App

