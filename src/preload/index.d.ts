import { IElectronAPI } from '@core/ipc/api.interface'

declare global {
  interface Window {
    api: IElectronAPI
  }
}
