import { Task, SubTask } from '../domain/entities'

export interface CreateTaskInput {
  id?: string
  title: string
  listId: string
  completed?: boolean
  completedAt?: string | null
  isImportant?: boolean
  isMyDay?: boolean
  myDayDate?: string | null
  dueDate?: string | null
  reminderDate?: string | null
  notes?: string
  orderIndex?: number
  subtasks?: SubTask[]
  createdAt?: string
  updatedAt?: string
}

export interface ITaskRepository {
  getAll(): Promise<Task[]>
  getById(id: string): Promise<Task | null>
  getByListId(listId: string): Promise<Task[]>
  getMyDay(currentDateStr: string): Promise<Task[]>
  getImportant(): Promise<Task[]>
  getPlanned(): Promise<Task[]>
  search(query: string): Promise<Task[]>
  create(input: CreateTaskInput): Promise<Task>
  update(id: string, updates: Partial<Task>): Promise<Task>
  delete(id: string): Promise<boolean>
  reorder(orderedIds: string[]): Promise<void>
  addSubTask(taskId: string, title: string): Promise<SubTask>
  updateSubTask(taskId: string, subTaskId: string, updates: Partial<SubTask>): Promise<SubTask>
  deleteSubTask(taskId: string, subTaskId: string): Promise<boolean>
}
