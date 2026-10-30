import { TaskList, SYSTEM_LIST_IDS } from '@core/domain/entities'
import { IListRepository, CreateListInput } from '@core/ports'

export const DEFAULT_SYSTEM_LISTS: TaskList[] = [
  {
    id: SYSTEM_LIST_IDS.MY_DAY,
    title: 'My Day',
    isSystem: true,
    systemType: 'my-day',
    iconName: 'Sun',
    color: '#3b82f6',
    orderIndex: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: SYSTEM_LIST_IDS.IMPORTANT,
    title: 'Important',
    isSystem: true,
    systemType: 'important',
    iconName: 'Star',
    color: '#ef4444',
    orderIndex: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: SYSTEM_LIST_IDS.PLANNED,
    title: 'Planned',
    isSystem: true,
    systemType: 'planned',
    iconName: 'Calendar',
    color: '#10b981',
    orderIndex: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: SYSTEM_LIST_IDS.TASKS,
    title: 'Tasks',
    isSystem: true,
    systemType: 'tasks',
    iconName: 'CheckSquare',
    color: '#6366f1',
    orderIndex: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export class InMemoryListRepository implements IListRepository {
  private lists: Map<string, TaskList> = new Map()

  constructor(seedDefaults: boolean = true) {
    if (seedDefaults) {
      DEFAULT_SYSTEM_LISTS.forEach((list) => {
        this.lists.set(list.id, { ...list })
      })
    }
  }

  async getAll(): Promise<TaskList[]> {
    return Array.from(this.lists.values()).sort((a, b) => a.orderIndex - b.orderIndex)
  }

  async getById(id: string): Promise<TaskList | null> {
    return this.lists.get(id) ?? null
  }

  async create(input: CreateListInput): Promise<TaskList> {
    const now = new Date().toISOString()
    const list: TaskList = {
      id: input.id ?? `list-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: input.title,
      isSystem: input.isSystem ?? false,
      systemType: input.systemType,
      iconName: input.iconName ?? 'Folder',
      color: input.color,
      orderIndex: input.orderIndex ?? this.lists.size,
      createdAt: input.createdAt ?? now,
      updatedAt: input.updatedAt ?? now
    }

    this.lists.set(list.id, list)
    return { ...list }
  }

  async update(id: string, updates: Partial<TaskList>): Promise<TaskList> {
    const existing = this.lists.get(id)
    if (!existing) {
      throw new Error(`TaskList not found: ${id}`)
    }

    const updated: TaskList = {
      ...existing,
      ...updates,
      id: existing.id, // prevent changing ID
      isSystem: existing.isSystem, // prevent tampering with system status
      systemType: existing.systemType,
      updatedAt: new Date().toISOString()
    }

    this.lists.set(id, updated)
    return { ...updated }
  }

  async delete(id: string): Promise<boolean> {
    const existing = this.lists.get(id)
    if (!existing) return false
    if (existing.isSystem) {
      throw new Error('Cannot delete system list')
    }

    return this.lists.delete(id)
  }

  async reorder(orderedIds: string[]): Promise<void> {
    orderedIds.forEach((id, index) => {
      const list = this.lists.get(id)
      if (list) {
        list.orderIndex = index
        list.updatedAt = new Date().toISOString()
      }
    })
  }
}
