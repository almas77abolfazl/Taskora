import { Task, SubTask } from '@core/domain/entities'
import { ITaskRepository, CreateTaskInput } from '@core/ports'

export class InMemoryTaskRepository implements ITaskRepository {
  private tasks: Map<string, Task> = new Map()

  async getAll(): Promise<Task[]> {
    return Array.from(this.tasks.values()).sort((a, b) => a.orderIndex - b.orderIndex)
  }

  async getById(id: string): Promise<Task | null> {
    return this.tasks.get(id) ?? null
  }

  async getByListId(listId: string): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .filter((t) => t.listId === listId)
      .sort((a, b) => a.orderIndex - b.orderIndex)
  }

  async getMyDay(currentDateStr: string): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .filter((t) => t.isMyDay && t.myDayDate === currentDateStr)
      .sort((a, b) => a.orderIndex - b.orderIndex)
  }

  async getImportant(): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .filter((t) => t.isImportant)
      .sort((a, b) => a.orderIndex - b.orderIndex)
  }

  async getPlanned(): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .filter((t) => t.dueDate !== null && t.dueDate !== undefined)
      .sort((a, b) => {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate.localeCompare(b.dueDate)
      })
  }

  async search(query: string): Promise<Task[]> {
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) return []

    return Array.from(this.tasks.values()).filter(
      (t) => t.title.toLowerCase().includes(trimmed) || t.notes.toLowerCase().includes(trimmed)
    )
  }

  async create(input: CreateTaskInput): Promise<Task> {
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
      orderIndex: input.orderIndex ?? this.tasks.size,
      subtasks: input.subtasks ?? [],
      createdAt: input.createdAt ?? now,
      updatedAt: input.updatedAt ?? now
    }

    this.tasks.set(task.id, task)
    return { ...task }
  }

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const existing = this.tasks.get(id)
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

    this.tasks.set(id, updated)
    return { ...updated }
  }

  async delete(id: string): Promise<boolean> {
    return this.tasks.delete(id)
  }

  async reorder(orderedIds: string[]): Promise<void> {
    orderedIds.forEach((id, index) => {
      const task = this.tasks.get(id)
      if (task) {
        task.orderIndex = index
        task.updatedAt = new Date().toISOString()
      }
    })
  }

  async addSubTask(taskId: string, title: string): Promise<SubTask> {
    const task = this.tasks.get(taskId)
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
    return { ...subtask }
  }

  async updateSubTask(taskId: string, subTaskId: string, updates: Partial<SubTask>): Promise<SubTask> {
    const task = this.tasks.get(taskId)
    if (!task) {
      throw new Error(`Task not found: ${taskId}`)
    }

    const subtask = task.subtasks.find((s) => s.id === subTaskId)
    if (!subtask) {
      throw new Error(`Subtask not found: ${subTaskId}`)
    }

    Object.assign(subtask, updates, { updatedAt: new Date().toISOString() })
    task.updatedAt = new Date().toISOString()
    return { ...subtask }
  }

  async deleteSubTask(taskId: string, subTaskId: string): Promise<boolean> {
    const task = this.tasks.get(taskId)
    if (!task) {
      throw new Error(`Task not found: ${taskId}`)
    }

    const index = task.subtasks.findIndex((s) => s.id === subTaskId)
    if (index === -1) return false

    task.subtasks.splice(index, 1)
    task.updatedAt = new Date().toISOString()
    return true
  }
}
