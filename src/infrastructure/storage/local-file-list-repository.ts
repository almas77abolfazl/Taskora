import { TaskList } from '@core/domain/entities'
import { IListRepository, CreateListInput } from '@core/ports'
import { AtomicFileStorage } from './atomic-file-storage'
import { DEFAULT_SYSTEM_LISTS } from './in-memory-list-repository'

export class LocalFileListRepository implements IListRepository {
  private storage: AtomicFileStorage<Record<string, TaskList>>
  private cache: Map<string, TaskList> = new Map()
  private isInitialized = false

  constructor(filePath: string) {
    this.storage = new AtomicFileStorage<Record<string, TaskList>>(filePath)
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    const defaults: Record<string, TaskList> = {}
    DEFAULT_SYSTEM_LISTS.forEach((l) => {
      defaults[l.id] = { ...l }
    })

    const raw = await this.storage.read(defaults)
    this.cache.clear()

    // Ensure all system lists exist even if file was modified
    DEFAULT_SYSTEM_LISTS.forEach((sysList) => {
      if (!raw[sysList.id]) {
        raw[sysList.id] = { ...sysList }
      }
    })

    Object.values(raw).forEach((l) => {
      this.cache.set(l.id, l)
    })

    await this.persist()
    this.isInitialized = true
  }

  private async persist(): Promise<void> {
    const data: Record<string, TaskList> = {}
    this.cache.forEach((list, id) => {
      data[id] = list
    })
    await this.storage.write(data)
  }

  async getAll(): Promise<TaskList[]> {
    await this.initialize()
    return Array.from(this.cache.values()).sort((a, b) => a.orderIndex - b.orderIndex)
  }

  async getById(id: string): Promise<TaskList | null> {
    await this.initialize()
    return this.cache.get(id) ?? null
  }

  async create(input: CreateListInput): Promise<TaskList> {
    await this.initialize()
    const now = new Date().toISOString()
    const list: TaskList = {
      id: input.id ?? `list-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: input.title,
      isSystem: input.isSystem ?? false,
      systemType: input.systemType,
      iconName: input.iconName ?? 'Folder',
      color: input.color,
      orderIndex: input.orderIndex ?? this.cache.size,
      createdAt: input.createdAt ?? now,
      updatedAt: input.updatedAt ?? now
    }

    this.cache.set(list.id, list)
    await this.persist()
    return { ...list }
  }

  async update(id: string, updates: Partial<TaskList>): Promise<TaskList> {
    await this.initialize()
    const existing = this.cache.get(id)
    if (!existing) {
      throw new Error(`TaskList not found: ${id}`)
    }

    const updated: TaskList = {
      ...existing,
      ...updates,
      id: existing.id,
      isSystem: existing.isSystem,
      systemType: existing.systemType,
      updatedAt: new Date().toISOString()
    }

    this.cache.set(id, updated)
    await this.persist()
    return { ...updated }
  }

  async delete(id: string): Promise<boolean> {
    await this.initialize()
    const existing = this.cache.get(id)
    if (!existing) return false
    if (existing.isSystem) {
      throw new Error('Cannot delete system list')
    }

    const removed = this.cache.delete(id)
    if (removed) {
      await this.persist()
    }
    return removed
  }

  async reorder(orderedIds: string[]): Promise<void> {
    await this.initialize()
    orderedIds.forEach((id, index) => {
      const list = this.cache.get(id)
      if (list) {
        list.orderIndex = index
        list.updatedAt = new Date().toISOString()
      }
    })
    await this.persist()
  }
}
