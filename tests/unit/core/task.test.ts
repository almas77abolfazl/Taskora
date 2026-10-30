import { describe, it, expect, beforeEach } from 'vitest'
import { SYSTEM_LIST_IDS } from '@core/domain/entities'
import { InMemoryTaskRepository } from '@infrastructure/storage/in-memory-task-repository'
import { InMemoryListRepository } from '@infrastructure/storage/in-memory-list-repository'

describe('Domain Models & In-Memory Repositories (TDD)', () => {
  let taskRepo: InMemoryTaskRepository
  let listRepo: InMemoryListRepository

  beforeEach(() => {
    taskRepo = new InMemoryTaskRepository()
    listRepo = new InMemoryListRepository()
  })

  describe('TaskList Management', () => {
    it('initializes with default system lists', async () => {
      const lists = await listRepo.getAll()
      expect(lists.length).toBeGreaterThanOrEqual(4)
      const systemTypes = lists.map((l) => l.systemType)
      expect(systemTypes).toContain('my-day')
      expect(systemTypes).toContain('important')
      expect(systemTypes).toContain('planned')
      expect(systemTypes).toContain('tasks')
    })

    it('creates a custom user list', async () => {
      const customList = await listRepo.create({
        title: 'Project Antigravity',
        isSystem: false,
        iconName: 'Folder',
        color: '#4f46e5',
        orderIndex: 5
      })

      expect(customList.id).toBeDefined()
      expect(customList.title).toBe('Project Antigravity')
      expect(customList.isSystem).toBe(false)

      const fetched = await listRepo.getById(customList.id)
      expect(fetched?.title).toBe('Project Antigravity')
    })

    it('prevents deletion of system lists', async () => {
      const systemList = (await listRepo.getAll()).find((l) => l.isSystem)
      expect(systemList).toBeDefined()
      if (systemList) {
        await expect(listRepo.delete(systemList.id)).rejects.toThrow('Cannot delete system list')
      }
    })
  })

  describe('Task Operations', () => {
    it('creates a new task with defaults', async () => {
      const task = await taskRepo.create({
        title: 'Complete unit tests',
        listId: SYSTEM_LIST_IDS.TASKS,
        isImportant: false,
        isMyDay: false,
        notes: '',
        orderIndex: 0
      })

      expect(task.id).toBeDefined()
      expect(task.title).toBe('Complete unit tests')
      expect(task.completed).toBe(false)
      expect(task.completedAt).toBeNull()
      expect(task.subtasks).toEqual([])
      expect(task.createdAt).toBeDefined()
    })

    it('toggles task completion and updates completedAt timestamp', async () => {
      const task = await taskRepo.create({
        title: 'Refactor electron bridge',
        listId: SYSTEM_LIST_IDS.TASKS,
        isImportant: false,
        isMyDay: false,
        notes: '',
        orderIndex: 0
      })

      const completed = await taskRepo.update(task.id, { completed: true })
      expect(completed.completed).toBe(true)
      expect(completed.completedAt).not.toBeNull()

      const uncompleted = await taskRepo.update(task.id, { completed: false })
      expect(uncompleted.completed).toBe(false)
      expect(uncompleted.completedAt).toBeNull()
    })

    it('manages subtasks (steps) inside a task', async () => {
      const task = await taskRepo.create({
        title: 'Plan vacation',
        listId: SYSTEM_LIST_IDS.TASKS,
        isImportant: false,
        isMyDay: false,
        notes: '',
        orderIndex: 0
      })

      const step1 = await taskRepo.addSubTask(task.id, 'Book flight')
      expect(step1.id).toBeDefined()
      expect(step1.title).toBe('Book flight')
      expect(step1.completed).toBe(false)

      const step2 = await taskRepo.addSubTask(task.id, 'Book hotel')

      const updatedTask = await taskRepo.getById(task.id)
      expect(updatedTask?.subtasks.length).toBe(2)

      const updatedStep = await taskRepo.updateSubTask(task.id, step1.id, { completed: true })
      expect(updatedStep.completed).toBe(true)

      await taskRepo.deleteSubTask(task.id, step2.id)
      const finalTask = await taskRepo.getById(task.id)
      expect(finalTask?.subtasks.length).toBe(1)
      expect(finalTask?.subtasks[0]?.title).toBe('Book flight')
    })

    it('filters tasks by Smart Lists (My Day, Important, Planned)', async () => {
      const today = '2026-10-31'
      const tomorrow = '2026-11-01'

      await taskRepo.create({
        title: 'Today task',
        listId: SYSTEM_LIST_IDS.TASKS,
        isImportant: false,
        isMyDay: true,
        myDayDate: today,
        orderIndex: 0,
        notes: ''
      })

      await taskRepo.create({
        title: 'Past My Day task',
        listId: SYSTEM_LIST_IDS.TASKS,
        isImportant: false,
        isMyDay: true,
        myDayDate: '2026-10-30', // expired my day date
        orderIndex: 1,
        notes: ''
      })

      await taskRepo.create({
        title: 'Urgent bug fix',
        listId: SYSTEM_LIST_IDS.TASKS,
        isImportant: true,
        isMyDay: false,
        orderIndex: 2,
        notes: ''
      })

      await taskRepo.create({
        title: 'Submit report',
        listId: SYSTEM_LIST_IDS.TASKS,
        isImportant: false,
        isMyDay: false,
        dueDate: tomorrow,
        orderIndex: 3,
        notes: ''
      })

      // My Day should only return tasks matching current date
      const myDayTasks = await taskRepo.getMyDay(today)
      expect(myDayTasks.length).toBe(1)
      expect(myDayTasks[0]?.title).toBe('Today task')

      // Important tasks
      const importantTasks = await taskRepo.getImportant()
      expect(importantTasks.length).toBe(1)
      expect(importantTasks[0]?.title).toBe('Urgent bug fix')

      // Planned tasks with due date
      const plannedTasks = await taskRepo.getPlanned()
      expect(plannedTasks.length).toBe(1)
      expect(plannedTasks[0]?.title).toBe('Submit report')
    })

    it('supports fast text search across title and notes', async () => {
      await taskRepo.create({
        title: 'Buy groceries',
        listId: SYSTEM_LIST_IDS.TASKS,
        notes: 'Milk, cheese, sourdough bread',
        isImportant: false,
        isMyDay: false,
        orderIndex: 0
      })

      await taskRepo.create({
        title: 'Workout session',
        listId: SYSTEM_LIST_IDS.TASKS,
        notes: 'Leg day at the gym',
        isImportant: false,
        isMyDay: false,
        orderIndex: 1
      })

      const searchTitle = await taskRepo.search('groceries')
      expect(searchTitle.length).toBe(1)
      expect(searchTitle[0]?.title).toBe('Buy groceries')

      const searchNotes = await taskRepo.search('sourdough')
      expect(searchNotes.length).toBe(1)
      expect(searchNotes[0]?.title).toBe('Buy groceries')
    })
  })
})
