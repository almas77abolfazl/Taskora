import { Task, SubTask } from '@core/domain/entities'
import { ITaskRepository, CreateTaskInput } from '@core/ports'
import { AtomicFileStorage } from './atomic-file-storage'

export class LocalFileTaskRepository implements ITaskRepository {
  private storage: AtomicFileStorage<Record<string, Task>>
  private cache: Map<string, Task> = new Map()
  private isInitialized = false

  constructor(filePath: string) {
    this.storage = new AtomicFileStorage<Record<string, Task>>(filePath)
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return
    const raw = await this.storage.read({})
    this.cache.clear()
    Object.values(raw).forEach((t) => {
      this.cache.set(t.id, t)
    })
    this.isInitialized = true
  }

  private async persist(): Promise<void> {
    const data: Record<string, Task> = {}
    this.cache.forEach((task, id) => {
      data[id] = task
    })
    await this.storage.write(data)
  }

  async getAll(): Promise<Task[]> {
    await this.initialize()
    return Array.from(this.cache.values()).sort((a, b) => a.orderIndex - b.orderIndex)
  }

  async getById(id: string): Promise<Task | null> {
    await this.initialize()
    return this.cache.get(id) ?? null
  }

  async getByListId(listId: string): Promise<Task[]> {
    await this.initialize()
    return Array.from(this.cache.values())
      .filter((t) => t.listId === listId)
      .sort((a, b) => a.orderIndex - b.orderIndex)
  }

  async getMyDay(currentDateStr: string): Promise<Task[]> {
    await this.initialize()
    return Array.from(this.cache.values())
      .filter((t) => t.isMyDay && t.myDayDate === currentDateStr)
      .sort((a, b) => a.orderIndex - b.orderIndex)
  }

  async getImportant(): Promise<Task[]> {
    await this.initialize()
    return Array.from(this.cache.values())
      .filter((t) => t.isImportant)
      .sort((a, b) => a.orderIndex - b.orderIndex)
  }

  async getPlanned(): Promise<Task[]> {
    await this.initialize()
    return Array.from(this.cache.values())
      .filter((t) => t.dueDate !== null && t.dueDate !== undefined)
      .sort((a, b) => {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate.localeCompare(b.dueDate)
      })
  }

  async search(query: string): Promise<Task[]> {
    await this.initialize()
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) return []

    return Array.from(this.cache.values()).filter(
      (t) => t.title.toLowerCase().includes(trimmed) || t.notes.toLowerCase().includes(trimmed)
    )
  }

  async create(input: CreateTaskInput): Promise<Task> {
    await this.initialize()
    const now = new Date().toISOString()
    const task: Task = {
      id: input.id ?? `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: input.title,
      completed: input.completed ?? false,
      completedAt: input.completedAt ?? null,
      listId: input.listId,
      isImportant: input.isImportant ?? false,
      isMyDay: input.isMyDay ?? false,
      myDayDate: input.myDayDate ?? null,
      dueDate: input.dueDate ?? null,
      reminderDate: input.reminderDate ?? null,
      notes: input.notes ?? '',
      orderIndex: input.orderIndex ?? this.cache.size,
      subtasks: input.subtasks ?? [],
      createdAt: input.createdAt ?? now,
      updatedAt: input.updatedAt ?? now
    }

    this.cache.set(task.id, task)
    await this.persist()
    return { ...task }
  }

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    await this.initialize()
    const existing = this.cache.get(id)
    if (!existing) {
      throw new Error(`Task not found: ${id}`)
    }

    const completedChanged = updates.completed !== undefined && updates.completed !== existing.completed
    let completedAt = existing.completedAt
    if (completedChanged) {
      completedAt = updates.completed ? new Date().toISOString() : null
    }

    const updated: Task = {
      ...existing,
      ...updates,
      completedAt: updates.completedAt !== undefined ? updates.completedAt : completedAt,
      updatedAt: new Date().toISOString()
    }

    this.cache.set(id, updated)
    await this.persist()
    return { ...updated }
  }

  async delete(id: string): Promise<boolean> {
    await this.initialize()
    const removed = this.cache.delete(id)
    if (removed) {
      await this.persist()
    }
    return removed
  }

  async reorder(orderedIds: string[]): Promise<void> {
    await this.initialize()
    orderedIds.forEach((id, index) => {
      const task = this.cache.get(id)
      if (task) {
        task.orderIndex = index
        task.updatedAt = new Date().toISOString()
      }
    })
    await this.persist()
  }

  async addSubTask(taskId: string, title: string): Promise<SubTask> {
    await this.initialize()
    const task = this.cache.get(taskId)
    if (!task) {
      throw new Error(`Task not found: ${taskId}`)
    }

    const now = new Date().toISOString()
    const subtask: SubTask = {
      id: `step-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      taskId,
      title,
      completed: false,
      orderIndex: task.subtasks.length,
      createdAt: now,
      updatedAt: now
    }

    task.subtasks.push(subtask)
    task.updatedAt = now
    await this.persist()
    return { ...subtask }
  }

  async updateSubTask(taskId: string, subTaskId: string, updates: Partial<SubTask>): Promise<SubTask> {
    await this.initialize()
    const task = this.cache.get(taskId)
    if (!task) {
      throw new Error(`Task not found: ${taskId}`)
    }

    const subtask = task.subtasks.find((s) => s.id === subTaskId)
    if (!subtask) {
      throw new Error(`Subtask not found: ${subTaskId}`)
    }

    Object.assign(subtask, updates, { updatedAt: new Date().toISOString() })
    task.updatedAt = new Date().toISOString()
    await this.persist()
    return { ...subtask }
  }

  async deleteSubTask(taskId: string, subTaskId: string): Promise<boolean> {
    await this.initialize()
    const task = this.cache.get(taskId)
    if (!task) {
      throw new Error(`Task not found: ${taskId}`)
    }

    const index = task.subtasks.findIndex((s) => s.id === subTaskId)
    if (index === -1) return false

    task.subtasks.splice(index, 1)
    task.updatedAt = new Date().toISOString()
    await this.persist()
    return true
  }
}

