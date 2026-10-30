import { ipcMain, BrowserWindow } from 'electron'
import { IPC_CHANNELS } from '@core/ipc/channels'
import { ITaskRepository, IListRepository, CreateTaskInput, CreateListInput } from '@core/ports'
import { Task, SubTask, TaskList } from '@core/domain/entities'

export function registerIpcHandlers(
  taskRepo: ITaskRepository,
  listRepo: IListRepository,
  mainWindowProvider: () => BrowserWindow | null
): void {
  // Tasks
  ipcMain.handle(IPC_CHANNELS.TASK_GET_ALL, async () => {
    return taskRepo.getAll()
  })

  ipcMain.handle(IPC_CHANNELS.TASK_GET_BY_ID, async (_, id: string) => {
    return taskRepo.getById(id)
  })

  ipcMain.handle(IPC_CHANNELS.TASK_GET_BY_LIST_ID, async (_, listId: string) => {
    return taskRepo.getByListId(listId)
  })

  ipcMain.handle(IPC_CHANNELS.TASK_GET_MY_DAY, async (_, dateStr: string) => {
    return taskRepo.getMyDay(dateStr)
  })

  ipcMain.handle(IPC_CHANNELS.TASK_GET_IMPORTANT, async () => {
    return taskRepo.getImportant()
  })

  ipcMain.handle(IPC_CHANNELS.TASK_GET_PLANNED, async () => {
    return taskRepo.getPlanned()
  })

  ipcMain.handle(IPC_CHANNELS.TASK_SEARCH, async (_, query: string) => {
    return taskRepo.search(query)
  })

  ipcMain.handle(IPC_CHANNELS.TASK_CREATE, async (_, input: CreateTaskInput) => {
    return taskRepo.create(input)
  })

  ipcMain.handle(IPC_CHANNELS.TASK_UPDATE, async (_, id: string, updates: Partial<Task>) => {
    return taskRepo.update(id, updates)
  })

  ipcMain.handle(IPC_CHANNELS.TASK_DELETE, async (_, id: string) => {
    return taskRepo.delete(id)
  })

  ipcMain.handle(IPC_CHANNELS.TASK_REORDER, async (_, orderedIds: string[]) => {
    return taskRepo.reorder(orderedIds)
  })

  ipcMain.handle(IPC_CHANNELS.TASK_ADD_SUBTASK, async (_, taskId: string, title: string) => {
    return taskRepo.addSubTask(taskId, title)
  })

  ipcMain.handle(
    IPC_CHANNELS.TASK_UPDATE_SUBTASK,
    async (_, taskId: string, subTaskId: string, updates: Partial<SubTask>) => {
      return taskRepo.updateSubTask(taskId, subTaskId, updates)
    }
  )

  ipcMain.handle(IPC_CHANNELS.TASK_DELETE_SUBTASK, async (_, taskId: string, subTaskId: string) => {
    return taskRepo.deleteSubTask(taskId, subTaskId)
  })

  // Lists
  ipcMain.handle(IPC_CHANNELS.LIST_GET_ALL, async () => {
    return listRepo.getAll()
  })

  ipcMain.handle(IPC_CHANNELS.LIST_GET_BY_ID, async (_, id: string) => {
    return listRepo.getById(id)
  })

  ipcMain.handle(IPC_CHANNELS.LIST_CREATE, async (_, input: CreateListInput) => {
    return listRepo.create(input)
  })

  ipcMain.handle(IPC_CHANNELS.LIST_UPDATE, async (_, id: string, updates: Partial<TaskList>) => {
    return listRepo.update(id, updates)
  })

  ipcMain.handle(IPC_CHANNELS.LIST_DELETE, async (_, id: string) => {
    return listRepo.delete(id)
  })

  ipcMain.handle(IPC_CHANNELS.LIST_REORDER, async (_, orderedIds: string[]) => {
    return listRepo.reorder(orderedIds)
  })

  // Window Controls
  ipcMain.handle(IPC_CHANNELS.WINDOW_MINIMIZE, async () => {
    const win = mainWindowProvider()
    if (win) win.minimize()
  })

  ipcMain.handle(IPC_CHANNELS.WINDOW_MAXIMIZE, async () => {
    const win = mainWindowProvider()
    if (win) {
      if (win.isMaximized()) {
        win.unmaximize()
      } else {
        win.maximize()
      }
    }
  })

  ipcMain.handle(IPC_CHANNELS.WINDOW_CLOSE, async () => {
    const win = mainWindowProvider()
    if (win) win.close()
  })
}
