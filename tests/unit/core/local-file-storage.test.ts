import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fs from 'fs/promises'
import * as path from 'path'
import * as os from 'os'
import { LocalFileTaskRepository } from '@infrastructure/storage/local-file-task-repository'
import { LocalFileListRepository } from '@infrastructure/storage/local-file-list-repository'
import { SYSTEM_LIST_IDS } from '@core/domain/entities'

describe('Offline Local File Storage (TDD)', () => {
  let tempDir: string
  let taskRepo: LocalFileTaskRepository
  let listRepo: LocalFileListRepository

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'todo-storage-test-'))
    const tasksFile = path.join(tempDir, 'tasks.json')
    const listsFile = path.join(tempDir, 'lists.json')
    taskRepo = new LocalFileTaskRepository(tasksFile)
    listRepo = new LocalFileListRepository(listsFile)
    await listRepo.initialize()
    await taskRepo.initialize()
  })

  afterEach(async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true })
    } catch {
      // ignore
    }
  })

  it('persists tasks to disk and reads them back across repository instances', async () => {
    const created = await taskRepo.create({
      title: 'Persistent task',
      listId: SYSTEM_LIST_IDS.TASKS,
      notes: 'Should survive reload',
      isImportant: true,
      isMyDay: false,
      orderIndex: 0
    })

    // Create a new instance pointing to the same file
    const secondTaskRepo = new LocalFileTaskRepository(path.join(tempDir, 'tasks.json'))
    await secondTaskRepo.initialize()

    const retrieved = await secondTaskRepo.getById(created.id)
    expect(retrieved).not.toBeNull()
    expect(retrieved?.title).toBe('Persistent task')
    expect(retrieved?.isImportant).toBe(true)
    expect(retrieved?.notes).toBe('Should survive reload')
  })

  it('atomically updates subtasks on disk', async () => {
    const task = await taskRepo.create({
      title: 'Task with steps',
      listId: SYSTEM_LIST_IDS.TASKS,
      notes: '',
      isImportant: false,
      isMyDay: false,
      orderIndex: 0
    })

    await taskRepo.addSubTask(task.id, 'Step 1')
    await taskRepo.addSubTask(task.id, 'Step 2')

    const fileContent = await fs.readFile(path.join(tempDir, 'tasks.json'), 'utf-8')
    const parsed = JSON.parse(fileContent)
    expect(parsed[task.id].subtasks.length).toBe(2)
    expect(parsed[task.id].subtasks[0].title).toBe('Step 1')
  })

  it('initializes default system lists if file is absent', async () => {
    const lists = await listRepo.getAll()
    expect(lists.length).toBe(4)

    const fileContent = await fs.readFile(path.join(tempDir, 'lists.json'), 'utf-8')
    const parsed = JSON.parse(fileContent)
    expect(Object.keys(parsed).length).toBe(4)
  })
})

