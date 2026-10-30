import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { LocalFileTaskRepository, LocalFileListRepository } from '@infrastructure/storage'
import { registerIpcHandlers } from './ipc/register-handlers'

let mainWindow: BrowserWindow | null = null
let taskRepo: LocalFileTaskRepository | null = null
let listRepo: LocalFileListRepository | null = null

function initRepositories(): void {
  const userDataPath = app.getPath('userData')
  const tasksPath = join(userDataPath, 'tasks.json')
  const listsPath = join(userDataPath, 'lists.json')

  taskRepo = new LocalFileTaskRepository(tasksPath)
  listRepo = new LocalFileListRepository(listsPath)

  registerIpcHandlers(taskRepo, listRepo, () => mainWindow)
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#f8fafc',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.show()
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  initRepositories()
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

