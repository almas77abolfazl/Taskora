import { contextBridge } from 'electron'

// Custom APIs for renderer
export const api = {
  platform: process.platform,
  version: process.versions.electron
}

// Expose protected methods in renderer process via contextBridge
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error('Failed to expose context bridge API:', error)
  }
} else {
  // @ts-ignore (fallback when context isolation is disabled, not recommended)
  window.api = api
}

export type ContextBridgeApi = typeof api

