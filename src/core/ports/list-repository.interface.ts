import { TaskList } from '../domain/entities'

export type CreateListInput = Omit<TaskList, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string
  createdAt?: string
  updatedAt?: string
}

export interface IListRepository {
  getAll(): Promise<TaskList[]>
  getById(id: string): Promise<TaskList | null>
  create(input: CreateListInput): Promise<TaskList>
  update(id: string, updates: Partial<TaskList>): Promise<TaskList>
  delete(id: string): Promise<boolean>
  reorder(orderedIds: string[]): Promise<void>
}

