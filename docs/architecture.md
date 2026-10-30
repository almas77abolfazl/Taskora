# Architecture Overview

This project is a high-performance, bilingual, offline-first task management desktop application inspired by Microsoft To Do. It is engineered with **Clean Architecture** and strict security standards.

## Layer Breakdown

```
src/
├── core/                  # Domain Layer (Pure TypeScript, Zero External Framework Dependencies)
│   ├── domain/
│   │   ├── entities/      # Core entities: Task, SubTask (Steps), TaskList
│   │   └── types/         # Domain value objects, filter options, priorities
│   ├── ports/             # Repository interfaces: ITaskRepository, IListRepository
│   └── usecases/          # Business logic workflows: CreateTask, ToggleStep, ReorderTasks
│
├── infrastructure/        # Infrastructure Layer
│   └── storage/           # Local file/SQLite persistence adapters implementing ports
│
├── main/                  # Electron Main Process
│   ├── index.ts           # App lifecycle, window management, system tray, notifications
│   └── ipc/               # Secure IPC channel dispatchers and handlers
│
├── preload/               # Electron Preload Bridge
│   ├── index.ts           # Context bridge exposing safe, typed APIs to renderer
│   └── index.d.ts         # TypeScript window declarations
│
└── renderer/              # Presentation Layer (React 19 + Tailwind CSS)
    └── src/
        ├── components/    # Reusable atomic UI elements (buttons, inputs, dialogs)
        ├── features/      # Feature modules (tasks, lists, sidebar, detail drawer)
        ├── hooks/         # Custom React hooks (useTasks, useI18n, useShortcuts)
        ├── i18n/          # English / Persian dictionaries and formatting utilities
        └── styles/        # Global typography, themes, and Tailwind styles
```

## Security Model

- **Context Isolation (`contextIsolation: true`):** The renderer code runs in an isolated browser context and cannot touch Node.js globals (`require`, `process`, `fs`).
- **No Node Integration (`nodeIntegration: false`):** Completely disabled in all windows.
- **Strict Content Security Policy (CSP):** Prevents script injection and unauthorized remote resource loading.
- **Type-Safe Context Bridge:** Only explicit, validated IPC invocations are exposed through `window.api`.

## Testing Strategy (TDD)

- **Unit Tests (Vitest):** Cover all domain entities, validation rules, and use cases before UI integration.
- **Integration Tests:** Verify local storage persistence and repository implementations.
- **Component Tests:** Verify accessible rendering, keyboard shortcuts, and RTL/LTR switching.

