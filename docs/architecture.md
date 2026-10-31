# Taskora — Architecture Overview

Taskora is a modern, offline-first task management desktop application inspired by **Microsoft To Do**, designed around **Clean Architecture**, strict **Context Isolation**, and **Test-Driven Development (TDD)**.

---

## 1. System Architecture

```
+--------------------------------------------------------------------------+
|                            RENDERER PROCESS                              |
|                                                                          |
|  [ React 19 UI Components ]                                              |
|    - AppShell                                                            |
|    - TitleBar (Native Controls)                                          |
|    - Sidebar (Smart Lists, Custom Lists, Language Toggle)                |
|    - TaskView (QuickAddInput, TaskItem, Completed Sections)              |
|    - TaskDrawer (Step Management, Due Date, Notes, Timestamps)           |
|    - ProfileModal (Offline User Profile & Cloud Teaser)                  |
|                                                                          |
|  [ State & Localization Layer ]                                          |
|    - TaskContext (Task/List reactive state)                              |
|    - I18nContext (Bilingual RTL/LTR + Jalali Date Formatter)             |
|                                                                          |
+--------------------------------------------------------------------------+
                                    |
                            window.api (Typed)
                                    |
+--------------------------------------------------------------------------+
|                          PRELOAD SECURE BRIDGE                           |
|                                                                          |
|  - contextBridge.exposeInMainWorld('api', ...)                           |
|  - Strictly sanctioned IPC channels (task:*, list:*, window:*, etc.)     |
|  - Zero Node.js primitives exposed to Renderer                           |
|                                                                          |
+--------------------------------------------------------------------------+
                                    |
                           Electron IPC Channels
                                    |
+--------------------------------------------------------------------------+
|                              MAIN PROCESS                                |
|                                                                          |
|  - BrowserWindow (contextIsolation: true, nodeIntegration: false)        |
|  - IPC Dispatcher (src/main/ipc/register-handlers.ts)                    |
|                                                                          |
|  [ Domain Core Layer ]                                                   |
|    - Entities: Task, SubTask, TaskList, SystemListTypes                  |
|    - Ports: ITaskRepository, IListRepository                            |
|                                                                          |
|  [ Infrastructure Layer ]                                                |
|    - AtomicFileStorage (Sequential crash-resilient write queue)          |
|    - LocalFileTaskRepository (tasks.json in OS userData)                 |
|    - LocalFileListRepository (lists.json in OS userData)                 |
|                                                                          |
+--------------------------------------------------------------------------+
```

---

## 2. Clean Architecture Layer Breakdown

```
src/
├── core/                        # Enterprise Business Logic & Domain
│   ├── domain/
│   │   └── entities/            # Task, SubTask, TaskList entities
│   ├── ports/                   # ITaskRepository, IListRepository interfaces
│   └── ipc/                     # Strongly-typed IPC channel contracts & IElectronAPI
│
├── infrastructure/              # External Adapters & Storage Implementation
│   └── storage/
│       ├── atomic-file-storage.ts      # Transactional crash-safe file writer
│       ├── local-file-task-repository.ts
│       ├── local-file-list-repository.ts
│       ├── in-memory-task-repository.ts
│       └── in-memory-list-repository.ts
│
├── main/                        # Electron Main Process
│   ├── index.ts                 # Window initialization & lifecycle
│   └── ipc/
│       └── register-handlers.ts # IPC handler registration
│
├── preload/                     # Secure IPC Context Bridge
│   ├── index.ts                 # contextBridge implementation
│   └── index.d.ts               # Global Window.api TypeScript augmentation
│
└── renderer/                    # React 19 Frontend (Vite)
    ├── src/
    │   ├── components/          # TitleBar, Sidebar, TaskView, TaskDrawer
    │   ├── context/             # TaskContext provider
    │   ├── i18n/                # Localization engine & English/Persian dictionaries
    │   ├── lib/                 # Jalali and Gregorian date formatting
    │   ├── styles/              # Tailwind CSS v4 & typography
    │   ├── App.tsx              # Root container
    │   └── main.tsx             # Entry point
    └── index.html
```

---

## 3. Security Principles

1. **Context Isolation:** `webPreferences.contextIsolation = true` ensures the preload script and renderer execute in independent JavaScript execution contexts.
2. **Node Integration Disabled:** `webPreferences.nodeIntegration = false` prevents prototype pollution and remote code execution vulnerabilities.
3. **No Dynamic IPC Evaluation:** IPC messages strictly map to statically typed constants (`IPC_CHANNELS`) validated against `IElectronAPI`.
4. **Offline-First:** All data operations are strictly executed against local JSON stores on the user's hard drive (`tasks.json`, `lists.json`). Zero remote telemetry or data transmission.

---

## 4. Testing Strategy (TDD)

- **Unit Tests:** `tests/unit/core/task.test.ts` covers 100% of domain business logic and smart filtering.
- **Storage Tests:** `tests/unit/core/local-file-storage.test.ts` validates disk persistence, crash-safety, and JSON integrity across reloads.
- **IPC Tests:** `tests/unit/ipc/ipc-contracts.test.ts` guarantees namespace scoping and channel uniqueness.
- **Localization Tests:** `tests/unit/i18n/i18n-and-dates.test.ts` validates key parity, Jalali date calculations, and zero-emoji compliance.
- **Component Tests:** `tests/unit/ui/app-shell.test.tsx` validates UI rendering and accessibility with React Testing Library and JSDOM.
