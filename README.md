<p align="center">
  <img src="docs/assets/logo.png" width="96" height="96" alt="Taskora Logo" style="border-radius: 20px;" />
</p>

<h1 align="center">Taskora</h1>

<p align="center">
  <strong>A modern, bilingual, offline-first task management desktop application.</strong><br>
  Built with <strong>Electron</strong>, <strong>React 19</strong>, <strong>TypeScript</strong>, and <strong>Clean Architecture</strong>.
</p>

<p align="center">
  <a href="https://github.com/almas77abolfazl/taskora/actions/workflows/ci.yml">
    <img src="https://github.com/almas77abolfazl/taskora/actions/workflows/ci.yml/badge.svg" alt="CI Workflow" />
  </a>
  <a href="https://github.com/almas77abolfazl/taskora/releases">
    <img src="https://img.shields.io/github/v/release/almas77abolfazl/taskora?label=Release&color=indigo" alt="Latest Release" />
  </a>
  <img src="https://img.shields.io/badge/Electron-33.4-47848F?logo=electron&logoColor=white" alt="Electron" />
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Tested_with-Vitest-FCC72B?logo=vitest&logoColor=black" alt="Vitest" />
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" />
  </a>
</p>

---

## ⚡ Direct Download

Get the latest pre-built Windows release directly from GitHub:

| Platform | Download Link | Type |
| :--- | :--- | :--- |
| **Windows x64** | [**Download Taskora Installer (.exe)**](https://github.com/almas77abolfazl/taskora/releases/latest) | Full Setup Installer |
| **Windows x64** | [**Download Taskora Portable (.exe)**](https://github.com/almas77abolfazl/taskora/releases/latest) | Standalone (No Install Required) |
| **All Platforms** | [**Browse All Releases**](https://github.com/almas77abolfazl/taskora/releases) | Release Assets & Changelogs |

---

## 🖥️ Application Preview

<p align="center">
  <img src="docs/assets/app-preview.png" alt="Taskora Desktop Interface Preview" width="100%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);" />
</p>

---

## ✨ Key Features

- **100% Offline & Local Data Ownership:** Zero remote cloud accounts required, zero trackers, and zero external telemetry. All your data resides locally on your computer using crash-resilient atomic file writes (`AtomicFileStorage`).
- **Clean, Minimalist Aesthetics:** No AI buzzwords, no visual clutter, and **strictly zero emojis** across the interface and documentation. All icons are crisp, vector **Lucide SVG** elements.
- **Bilingual (English & Persian) with Dynamic RTL/LTR:** Instant real-time language toggling with full document layout mirroring (`dir="rtl"` / `dir="ltr"`) and Persian typography (`IRANYekanRegular`).
- **Solar Hijri (Jalali) & Gregorian Dual-Calendar:** Native calendar formatting (`۱۴۰۵ آبان` / `October 2026`) and relative human dates (`Today`, `Tomorrow`, `امروز`, `فردا`).
- **Smart Focus Lists:**
  - 🌅 **My Day:** Refreshing daily focus view to plan tasks for today.
  - ⭐ **Important:** Star high-priority tasks with visual accent indicators.
  - 📅 **Planned:** Auto-organized scheduled tasks with overdue alerts.
  - 📋 **Tasks & Custom Lists:** Organize projects with custom categorized lists.
- **Task Inspector Drawer:** Deep inspection panel supporting subtask checklists, quick due-date presets, and auto-saving rich notes.
- **Synthesized Audio Completion Chime:** Delightful Web Audio harmonic chime on task completion (100% synthesized in-memory, zero audio file bloat).
- **Strict Context Isolation (Zero RCE Risk):** Built in strict adherence to Electron security standards (`contextIsolation: true`, `nodeIntegration: false`) with type-safe IPC contracts over `contextBridge`.

---

## 📖 Quick Tutorial & Workflow

### 1. Daily Planning with "My Day"
Open Taskora each morning to review your tasks. Add tasks to **My Day** by clicking the sun icon in the task inspector. At midnight, My Day resets so you start each morning with a clean slate.

### 2. Quick Task Creation
Press `Ctrl + N` anywhere in the app to immediately focus the input bar. Type your task title and hit `Enter` to save.

### 3. Subtasks & Detailed Notes
Click on any task to slide out the **Task Inspector Drawer**. Here you can:
- Break complex goals down into actionable step checklists.
- Set due dates using quick presets (`Today`, `Tomorrow`, `Next Week`).
- Write detailed notes in the auto-saving textarea.

### 4. Language & Theme Switching
Switch between **English (LTR)** and **فارسی (RTL)** with one click using the language toggle in the bottom of the sidebar. The entire application instantly updates fonts, date calendars (Gregorian / Jalali), and reading direction.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Description |
| :--- | :--- |
| `Ctrl + F` / `Cmd + F` | Focus global search bar across titles and notes |
| `Ctrl + N` / `Cmd + N` | Focus quick task add input bar |
| `Enter` | Submit new task or subtask step |
| `Escape` | Close task inspector drawer / Clear active search |

---

## 🏛️ Architecture & Code Quality

Taskora is engineered using **Hexagonal Clean Architecture** and **Domain-Driven Design (DDD)** principles:

```
src/
├── core/                        # Pure domain entities, ports & IPC contracts
│   ├── domain/entities/         # Task, SubTask, TaskList domain models
│   ├── ports/                   # ITaskRepository, IListRepository interfaces
│   └── ipc/                     # Strongly-typed IPC channel contracts (IElectronAPI)
│
├── infrastructure/              # File persistence & storage adapters
│   └── storage/
│       ├── atomic-file-storage.ts      # Thread-safe sequential write queue
│       ├── local-file-task-repository.ts
│       ├── local-file-list-repository.ts
│       └── in-memory-task-repository.ts
│
├── main/                        # Electron Main Process
│   ├── index.ts                 # Window management, frameless setup & lifecycle
│   └── ipc/register-handlers.ts # IPC dispatchers invoking core repositories
│
├── preload/                     # Secure Context Bridge
│   ├── index.ts                 # Sanitized contextBridge exposure
│   └── index.d.ts               # Global Window.api TypeScript augmentation
│
└── renderer/                    # React 19 Frontend (Vite)
    ├── src/
    │   ├── components/          # TitleBar, Sidebar, TaskView, TaskDrawer, ProfileModal
    │   ├── context/             # TaskContext & reactive state
    │   ├── i18n/                # Localization engine & Jalali date formatters
    │   ├── lib/                 # Web Audio sound engine & date utilities
    │   └── styles/              # Tailwind CSS v4 design system
    └── index.html
```

Detailed technical specifications and architecture diagrams are documented in [docs/architecture.md](docs/architecture.md).

### Architecture Decision Records (ADRs)
- [ADR 001: Modern Stack (Vite + Electron + React 19)](docs/adr/001-modern-stack-vite-electron.md)
- [ADR 002: Strict Context Isolation & Type-Safe IPC Bridge](docs/adr/002-strict-context-isolation-and-ipc-bridge.md)
- [ADR 003: Offline-First Atomic File Storage](docs/adr/003-offline-first-atomic-file-storage.md)
- [ADR 004: Bilingual Localization (RTL/LTR) & Solar Hijri (Jalali) Engine](docs/adr/004-bilingual-rtl-ltr-and-jalali-engine.md)

---

## 🛠️ Development & Building

### Prerequisites
- [Node.js](https://nodejs.org/) (v22.x or later recommended)
- [pnpm](https://pnpm.io/) (v10 or later)

### Setup
```bash
# Clone the repository
git clone https://github.com/almas77abolfazl/taskora.git
cd taskora

# Install dependencies
pnpm install
```

### Running in Development
```bash
# Launch Electron application with Vite Hot Module Replacement (HMR)
pnpm dev
```

### Running Tests
```bash
# Run unit & integration test suites
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### Type Checking & Packaging
```bash
# Verify strict TypeScript compiler contracts across Main, Preload & Renderer
pnpm run typecheck

# Build optimized production bundles
pnpm run build

# Package standalone Windows installer (.exe) & portable binary
pnpm run build:win
```

---

## 📄 License

This project is open-source software licensed under the [MIT License](LICENSE).

Developed with precision by **[Abolfazl Nasiri Almas](https://github.com/almas77abolfazl)**.
