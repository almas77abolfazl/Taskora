# Task Management Desktop Application

> A modern, bilingual (English / Persian), offline-first desktop task management application built with **Electron**, **React 19**, **TypeScript**, and **Clean Architecture**, inspired by **Microsoft To Do**.

[![CI](https://github.com/almas77abolfazl/todo-list-with-electronJS/actions/workflows/ci.yml/badge.svg)](https://github.com/almas77abolfazl/todo-list-with-electronJS/actions/workflows/ci.yml)
[![Electron](https://img.shields.io/badge/Electron-33.4.11-47848F?logo=electron&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tested_with-Vitest-FCC72B?logo=vitest&logoColor=black)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Overview

This project is a complete architectural rewrite of an Electron desktop application. Designed to provide a distraction-free, professional productivity experience, it prioritizes **data ownership**, **system security**, **robust localization**, and **clean software design**.

---

## Core Pillars & Features

- **Microsoft To Do Experience:** Clean, focused interface featuring Smart Lists (**My Day**, **Important**, **Planned**, and **Tasks**) alongside custom categories and lists.
- **100% Offline & Local Storage:** No account creation, no external cloud sync, and zero tracking. All tasks, subtasks, and lists persist locally on your hard disk using an **atomic, crash-resilient storage engine** (`AtomicFileStorage`).
- **Strict Context Isolation (Zero RCE Risk):** Built in strict adherence to Electron security recommendations (`contextIsolation: true`, `nodeIntegration: false`). The renderer communicates exclusively via strongly-typed IPC contracts over `contextBridge`.
- **Bilingual (English & Persian) with Dynamic RTL/LTR:** Seamless, instant language toggling with complete document direction adaptation (`dir="rtl"` / `dir="ltr"`) and Persian typography (`IRANYekanRegular`).
- **Solar Hijri (Jalali) & Gregorian Calendars:** Fully integrated dual-calendar formatting (`۱۴۰۵ آبان` / `October 2026`) and relative date calculations (`Today`, `Tomorrow`, `امروز`, `فردا`).
- **Subtasks & Task Inspector:** Detailed sliding drawer for managing step checklists, due dates, reminder dates, and auto-saving notes.
- **Productivity Shortcuts:** Fast inline quick-add (`Ctrl+N`), global search across titles and notes (`Ctrl+F`), and keyboard drawer controls (`Esc`).
- **Zero Emojis Policy:** Crafted with an intentional, professional design aesthetic utilizing vector **Lucide SVG icons** exclusively.
- **Test-Driven Development (TDD):** Comprehensive automated test suite with Vitest and React Testing Library covering domain logic, persistence, IPC safety, and UI components.
- **Automated CI Pipeline:** Multi-OS GitHub Actions workflow (Ubuntu & Windows, Node 22) verifying linting, typechecking, tests, and builds on every commit.

---

## Architecture

The project follows the principles of **Clean Architecture** and **Hexagonal Ports & Adapters**:

```
src/
├── core/                        # Domain entities & abstract ports
│   ├── domain/entities/         # Task, SubTask, TaskList domain models
│   ├── ports/                   # ITaskRepository, IListRepository interfaces
│   └── ipc/                     # Strongly-typed IPC channel contracts (IElectronAPI)
│
├── infrastructure/              # Storage adapters & local database engine
│   └── storage/
│       ├── atomic-file-storage.ts      # Atomic write protection queue
│       ├── local-file-task-repository.ts
│       ├── local-file-list-repository.ts
│       ├── in-memory-task-repository.ts
│       └── in-memory-list-repository.ts
│
├── main/                        # Electron Main Process
│   ├── index.ts                 # Window management & lifecycle
│   └── ipc/register-handlers.ts # IPC request dispatcher
│
├── preload/                     # Secure Context Bridge
│   ├── index.ts                 # Sanitized contextBridge exposure
│   └── index.d.ts               # Global Window.api TypeScript augmentation
│
└── renderer/                    # React 19 Frontend (Vite)
    ├── src/
    │   ├── components/          # TitleBar, Sidebar, TaskView, TaskDrawer
    │   ├── context/             # TaskContext & reactive state
    │   ├── i18n/                # Localization engine & dictionaries
    │   ├── lib/                 # Jalali & Gregorian date utilities
    │   └── styles/              # Tailwind CSS v4 design system
    └── index.html
```

Detailed technical documentation and diagrams are available in [docs/architecture.md](docs/architecture.md).

### Architecture Decision Records (ADRs)
- [ADR 001: Modern Stack (Vite + Electron + React 19)](docs/adr/001-modern-stack-vite-electron.md)
- [ADR 002: Strict Context Isolation & Type-Safe IPC Bridge](docs/adr/002-strict-context-isolation-and-ipc-bridge.md)
- [ADR 003: Offline-First Atomic File Storage](docs/adr/003-offline-first-atomic-file-storage.md)
- [ADR 004: Bilingual Localization (RTL/LTR) & Solar Hijri (Jalali) Engine](docs/adr/004-bilingual-rtl-ltr-and-jalali-engine.md)

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v22.x or later recommended)
- [pnpm](https://pnpm.io/) (v10 or later)

### Installation
```bash
# Clone the repository
git clone https://github.com/almas77abolfazl/todo-list-with-electronJS.git
cd todo-list-with-electronJS

# Install dependencies using pnpm
pnpm install
```

### Development
```bash
# Start Vite development server with Hot Module Replacement (HMR)
pnpm dev
```

### Running Tests
```bash
# Run unit & integration test suites
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### Type Checking & Building
```bash
# Run strict TypeScript compiler verification across Main, Preload & Renderer
pnpm run typecheck

# Build production bundles
pnpm run build

# Package standalone Windows executable installer (.exe)
pnpm run build:win
```

---

## Keyboard Shortcuts

| Shortcut | Description |
| :--- | :--- |
| `Ctrl + F` / `Cmd + F` | Focus global search bar |
| `Ctrl + N` / `Cmd + N` | Focus quick task addition bar |
| `Enter` | Submit new task or step |
| `Escape` | Close task drawer / Clear active search |

---

## License

This project is open-source software licensed under the [MIT License](LICENSE).

Authored by **[Abolfazl Nasiri Almas](https://github.com/almas77abolfazl)**.
