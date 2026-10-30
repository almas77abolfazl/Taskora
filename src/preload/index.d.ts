import { ContextBridgeApi } from './index'

declare global {
  interface Window {
    api: ContextBridgeApi
  }
}

