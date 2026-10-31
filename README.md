<div align="center">

  <img src="docs/assets/logo.png" width="108" height="108" alt="Taskora Logo" style="border-radius: 24px; box-shadow: 0 8px 24px rgba(79, 70, 229, 0.25);" />

  # Taskora

  **The minimal, offline-first task companion engineered for deep focus.**  
  *A distraction-free productivity experience built with Clean Architecture, Electron, React 19, and TypeScript.*

  <br />

  [![Release](https://img.shields.io/badge/Release-v1.0.0-6366f1?style=for-the-badge&logo=github&logoColor=white)](https://github.com/almas77abolfazl/taskora/releases/latest)
  [![Download Windows](https://img.shields.io/badge/Download_for_Windows-Installer_%26_Portable-0284c7?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/almas77abolfazl/taskora/releases/latest)
  [![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

  <br />

  [![CI Workflow](https://img.shields.io/github/actions/workflow/status/almas77abolfazl/taskora/ci.yml?branch=main&label=CI%20Pipeline&logo=githubactions&logoColor=white)](https://github.com/almas77abolfazl/taskora/actions)
  [![Electron](https://img.shields.io/badge/Electron-33.4-47848F?logo=electron&logoColor=white)](https://www.electronjs.org/)
  [![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Vitest](https://img.shields.io/badge/Vitest-Passing-FCC72B?logo=vitest&logoColor=black)](https://vitest.dev/)
  [![Offline First](https://img.shields.io/badge/Data_Storage-100%25_Offline-10b981)](docs/adr/003-offline-first-atomic-file-storage.md)

</div>

<br />

---

## 🖥️ Application Showcase

<div align="center">
  <img src="docs/assets/app-preview.png" alt="Taskora Desktop Preview" width="100%" style="border-radius: 14px; border: 1px solid rgba(226, 232, 240, 0.8); box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.12);" />
  <p align="center"><em>Taskora running natively on desktop — Minimalist UI, Smart Lists, Jalali / Gregorian support, and zero clutter.</em></p>
</div>

---

## ⚡ Direct Downloads

Get the standalone Windows binaries directly from GitHub Releases:

| Release Package | Target | Description |
| :--- | :--- | :--- |
| [**📥 Taskora Setup 1.0.0 (.exe)**](https://github.com/almas77abolfazl/taskora/releases/latest) | Windows x64 | Full installer with start menu & desktop shortcuts |
| [**📦 Taskora Portable 1.0.0 (.exe)**](https://github.com/almas77abolfazl/taskora/releases/latest) | Windows x64 | Single standalone executable — runs anywhere without installation |
| [**🔗 All Release Assets & Logs**](https://github.com/almas77abolfazl/taskora/releases) | Multi-arch | Source code, checksums, and changelog history |

---

## 🌟 Why Taskora? (Bento Grid)

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>🔒 100% Offline & Local Data Ownership</h3>
      <p>No account creation, no sign-in modals, no tracking, and zero remote servers. All your tasks, subtasks, notes, and custom categories reside strictly on your local disk using a crash-safe <strong>Atomic Sequential Storage Engine</strong> (<code>AtomicFileStorage</code>).</p>
    </td>
    <td width="50%" valign="top">
      <h3>🇮🇷 🇬🇧 First-Class Bilingual & Jalali Engine</h3>
      <p>Instant one-click toggle between <strong>English (LTR)</strong> and <strong>فارسی (RTL)</strong>. Includes high-fidelity Persian typography (<code>IRANYekanRegular</code> / <code>Vazirmatn</code>) and full dual calendar support for <strong>Solar Hijri (Jalali)</strong> and Gregorian dates.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>✨ Zero AI Vibe & Clean Aesthetics</h3>
      <p>No robotic buzzwords, no generic AI gradients, and <strong>strictly zero emojis</strong> across the entire user interface and documentation. Built with crisp, vector <strong>Lucide SVG icons</strong> and tailored modern color palettes.</p>
    </td>
    <td width="50%" valign="top">
      <h3>🛡️ Strict Context Isolation (Zero RCE Risk)</h3>
      <p>Engineered according to the highest Electron security specifications: <code>contextIsolation: true</code>, <code>nodeIntegration: false</code>. The renderer communicates exclusively via strongly-typed, sanitized IPC contracts over <code>contextBridge</code>.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>⚡ Keyboard-First Productivity</h3>
      <p>Designed for velocity. Quick-add tasks with <code>Ctrl + N</code>, jump to global search with <code>Ctrl + F</code>, organize subtask checklists on the fly, and dismiss modals with <code>Esc</code> without your hands leaving the keyboard.</p>
    </td>
    <td width="50%" valign="top">
      <h3>🎵 Synthesized Harmonic Chimes</h3>
      <p>Enjoy a subtle, delightful completion chime whenever you check off a task. Generated 100% in-memory using harmonic Web Audio API oscillators — zero external MP3/WAV assets or network overhead.</p>
    </td>
  </tr>
</table>

---

## 🧭 Visual Feature Tour

### 1. 🌅 Smart Focus Lists
- **My Day (روز من):** Your daily focus view. Start every day with a fresh, intentional list of priorities.
- **Important (مهم):** Highlight critical deliverables with subtle jewel-toned star indicators.
- **Planned (برنامه‌ریزی‌شده):** Automated chronological timeline with overdue alerts and date badges.
- **Tasks & Custom Lists:** Organize initiatives with custom colored pips and individual categories.

### 2. 📝 Deep Task Inspector Drawer
Slide open any task to reveal detailed management controls:
- **Subtasks (Steps):** Break complex items into granular, actionable checklists.
- **Due Date Presets:** One-click shortcuts for *Today*, *Tomorrow*, or *Next Week*.
- **Auto-Saving Notes:** Distraction-free scratchpad for task context, thoughts, and technical details.

### 3. 👤 Local Profile & Privacy Management
Click the profile pill in the bottom-left sidebar to open your user card:
- Customize your personal display name.
- View task velocity metrics (Total, Completed, Pending).
- Check local storage disk status and future cloud sync teasers.

---

## ⌨️ Keyboard Shortcuts Reference

| Shortcut | Action | Description |
| :---: | :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>N</kbd> | **Quick Add** | Immediately focuses the task creation input bar |
| <kbd>Ctrl</kbd> + <kbd>F</kbd> | **Global Search** | Searches across task titles, lists, and note contents |
| <kbd>Enter</kbd> | **Submit** | Commits a new task title, subtask step, or list name |
| <kbd>Esc</kbd> | **Dismiss** | Closes the task inspector drawer or resets active search query |

---

## 🏛️ Clean Architecture & Engineering Standards

Taskora is structured around **Hexagonal Clean Architecture** and **Domain-Driven Design (DDD)**:

```
src/
├── core/                        # Domain Layer (Pure TypeScript, Zero External Dependencies)
│   ├── domain/entities/         # Task, SubTask, TaskList domain models
│   ├── ports/                   # ITaskRepository, IListRepository interfaces
│   └── ipc/                     # Type-safe IPC channels & IElectronAPI contracts
│
├── infrastructure/              # Adapter Layer (File I/O & Persistence)
│   └── storage/
│       ├── atomic-file-storage.ts      # Thread-safe sequential write queue
│       ├── local-file-task-repository.ts
│       ├── local-file-list-repository.ts
│       └── in-memory-task-repository.ts
│
├── main/                        # Electron Main Process
│   ├── index.ts                 # Frameless window manager, app lifecycle & tray
│   └── ipc/register-handlers.ts # IPC dispatchers invoking core repository ports
│
├── preload/                     # Security Layer
│   ├── index.ts                 # Sanitized contextBridge exposure
│   └── index.d.ts               # Global Window.api TypeScript augmentation
│
└── renderer/                    # Presentation Layer (React 19 + Tailwind v4)
    ├── src/
    │   ├── components/          # TitleBar, Sidebar, TaskView, TaskDrawer, ProfileModal
    │   ├── context/             # TaskContext & reactive state management
    │   ├── i18n/                # Localization engine & Jalali date formatters
    │   ├── lib/                 # Web Audio sound engine & date utilities
    │   └── styles/              # Global styles, fonts & Tailwind CSS v4
    └── index.html
```

### Architecture Decision Records (ADRs)
- 📄 [ADR 001: Modern Stack (Vite + Electron + React 19)](docs/adr/001-modern-stack-vite-electron.md)
- 📄 [ADR 002: Strict Context Isolation & Type-Safe IPC Bridge](docs/adr/002-strict-context-isolation-and-ipc-bridge.md)
- 📄 [ADR 003: Offline-First Atomic File Storage](docs/adr/003-offline-first-atomic-file-storage.md)
- 📄 [ADR 004: Bilingual Localization (RTL/LTR) & Solar Hijri (Jalali) Engine](docs/adr/004-bilingual-rtl-ltr-and-jalali-engine.md)

---

## 🚀 Getting Started (Development)

### Prerequisites
- [Node.js](https://nodejs.org/) (v22.x or later recommended)
- [pnpm](https://pnpm.io/) (v10 or later)

### Setup & Local Development
```bash
# Clone the repository
git clone https://github.com/almas77abolfazl/taskora.git
cd taskora

# Install dependencies using pnpm
pnpm install

# Run the Electron application with Vite Hot Module Replacement (HMR)
pnpm dev
```

### Automated Testing & Quality Checks
```bash
# Run unit & component test suites with Vitest (22/22 tests)
pnpm test

# Run tests in watch mode
pnpm test:watch

# Execute strict TypeScript compiler validation across Main, Preload & Renderer
pnpm run typecheck

# Build production bundles
pnpm run build

# Package standalone Windows installer (.exe) & portable binary
pnpm run build:win
```

---

## 📜 License

This project is open-source software licensed under the [MIT License](LICENSE).

Crafted with dedication by **[Abolfazl Nasiri Almas](https://github.com/almas77abolfazl)**.
