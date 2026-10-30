# ADR 002: Strict Context Isolation & Type-Safe IPC Bridge

## Status
Accepted

## Context
In early Electron versions, applications commonly enabled `nodeIntegration: true` and `contextIsolation: false`. This granted the Chromium renderer direct access to Node.js APIs (`fs`, `child_process`, `net`), creating severe Remote Code Execution (RCE) and XSS security vulnerabilities. Furthermore, IPC channels were often unstructured string events without compile-time contract enforcement.

## Decision
1. **Disable Node Integration & Enforce Context Isolation:**
   - `contextIsolation: true`
   - `nodeIntegration: false`
   - `sandbox: false` (standard renderer sandbox boundary)
2. **Type-Safe IPC Contracts (`src/core/ipc/`):**
   - Explicit channel constants (`IPC_CHANNELS`) scoped by domain (`task:*`, `list:*`, `window:*`, `productivity:*`).
   - Strongly-typed request and response signatures defined in `IElectronAPI`.
3. **Preload Context Bridge (`src/preload/index.ts`):**
   - Expose only explicitly sanitized methods through `contextBridge.exposeInMainWorld('api', ...)`.
   - Global TypeScript declaration (`Window.api`) allowing zero-cast usage in renderer code.

## Consequences
- **Security:** Renderer process cannot execute arbitrary filesystem or OS calls.
- **Maintainability:** Refactoring an IPC contract causes immediate compile-time errors in TypeScript across both main and renderer processes.
- **Testability:** The renderer can be tested in isolation with JSDOM by mocking `window.api`.

