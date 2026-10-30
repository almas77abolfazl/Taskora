# ADR 003: Offline-First Atomic File Storage

## Status
Accepted

## Context
A desktop task manager must function 100% offline without requiring internet access or cloud services. Furthermore, writing data directly to disk (`fs.writeFile`) carries the risk of data corruption if the system crashes or loses power during the write operation.

## Decision
1. **Repository Pattern Decoupling:**
   - Define abstract repository ports (`ITaskRepository`, `IListRepository`) in `src/core/ports/`.
   - Implement storage engines in `src/infrastructure/storage/`:
     - `LocalFileTaskRepository` and `LocalFileListRepository` for production desktop runtime.
     - `InMemoryTaskRepository` and `InMemoryListRepository` for fast, isolated unit testing.
2. **Atomic Write Protection (`AtomicFileStorage`):**
   - Write payload to a unique temporary file (`.tmp.[timestamp].[rand]`).
   - Flush and atomically rename the temporary file over the target file using OS-level atomic rename.
   - Sequential write queue ensuring no concurrent write conflicts or file lock contention.
3. **Data Location:**
   - Saved locally in the OS-standard Electron `userData` path (`tasks.json` and `lists.json`).

## Consequences
- **Zero Data Loss:** Even in unexpected power interruptions, the active JSON database file is never left half-written.
- **Portability:** Users can export and import complete backups as JSON.
- **Independence:** Zero external database daemon dependencies (no Redis, no external native compilation hurdles).
