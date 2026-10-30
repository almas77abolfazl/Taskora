import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from '@core/ipc/channels'
import { IElectronAPI } from '@core/ipc/api.interface'
import { Task, SubTask, TaskList } from '@core/domain/entities'
import { CreateTaskInput, CreateListInput } from '@core/ports'

export const api: IElectronAPI = {
  tasks: {
    getAll: (): Promise<Task[]> => ipcRenderer.invoke(IPC_CHANNELS.TASK_GET_ALL),
    getById: (id: string): Promise<Task | null> => ipcRenderer.invoke(IPC_CHANNELS.TASK_GET_BY_ID, id),
    getByListId: (listId: string): Promise<Task[]> => ipcRenderer.invoke(IPC_CHANNELS.TASK_GET_BY_LIST_ID, listId),
    getMyDay: (dateStr: string): Promise<Task[]> => ipcRenderer.invoke(IPC_CHANNELS.TASK_GET_MY_DAY, dateStr),
    getImportant: (): Promise<Task[]> => ipcRenderer.invoke(IPC_CHANNELS.TASK_GET_IMPORTANT),
    getPlanned: (): Promise<Task[]> => ipcRenderer.invoke(IPC_CHANNELS.TASK_GET_PLANNED),
    search: (query: string): Promise<Task[]> => ipcRenderer.invoke(IPC_CHANNELS.TASK_SEARCH, query),
    create: (input: CreateTaskInput): Promise<Task> => ipcRenderer.invoke(IPC_CHANNELS.TASK_CREATE, input),
    update: (id: string, updates: Partial<Task>): Promise<Task> =>
      ipcRenderer.invoke(IPC_CHANNELS.TASK_UPDATE, id, updates),
    delete: (id: string): Promise<boolean> => ipcRenderer.invoke(IPC_CHANNELS.TASK_DELETE, id),
    reorder: (orderedIds: string[]): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.TASK_REORDER, orderedIds),
    addSubTask: (taskId: string, title: string): Promise<SubTask> =>
      ipcRenderer.invoke(IPC_CHANNELS.TASK_ADD_SUBTASK, taskId, title),
    updateSubTask: (taskId: string, subTaskId: string, updates: Partial<SubTask>): Promise<SubTask> =>
      ipcRenderer.invoke(IPC_CHANNELS.TASK_UPDATE_SUBTASK, taskId, subTaskId, updates),
    deleteSubTask: (taskId: string, subTaskId: string): Promise<boolean> =>
      ipcRenderer.invoke(IPC_CHANNELS.TASK_DELETE_SUBTASK, taskId, subTaskId)
  },
  lists: {
    getAll: (): Promise<TaskList[]> => ipcRenderer.invoke(IPC_CHANNELS.LIST_GET_ALL),
    getById: (id: string): Promise<TaskList | null> => ipcRenderer.invoke(IPC_CHANNELS.LIST_GET_BY_ID, id),
    create: (input: CreateListInput): Promise<TaskList> => ipcRenderer.invoke(IPC_CHANNELS.LIST_CREATE, input),
    update: (id: string, updates: Partial<TaskList>): Promise<TaskList> =>
      ipcRenderer.invoke(IPC_CHANNELS.LIST_UPDATE, id, updates),
    delete: (id: string): Promise<boolean> => ipcRenderer.invoke(IPC_CHANNELS.LIST_DELETE, id),
    reorder: (orderedIds: string[]): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.LIST_REORDER, orderedIds)
  },
  window: {
    minimize: (): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_MINIMIZE),
    maximize: (): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_MAXIMIZE),
    close: (): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_CLOSE)
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error('Failed to expose context bridge API:', error)
  }
} else {
  // @ts-ignore
  window.api = api
}

export type ContextBridgeApi = IElectronAPI
