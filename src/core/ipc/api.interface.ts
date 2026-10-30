import { Task, SubTask, TaskList } from '../domain/entities'
import { CreateTaskInput } from '../ports/task-repository.interface'
import { CreateListInput } from '../ports/list-repository.interface'

export interface IElectronAPI {
  tasks: {
    getAll(): Promise<Task[]>
    getById(id: string): Promise<Task | null>
    getByListId(listId: string): Promise<Task[]>
    getMyDay(dateStr: string): Promise<Task[]>
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
  lists: {
    getAll(): Promise<TaskList[]>
    getById(id: string): Promise<TaskList | null>
    create(input: CreateListInput): Promise<TaskList>
    update(id: string, updates: Partial<TaskList>): Promise<TaskList>
    delete(id: string): Promise<boolean>
    reorder(orderedIds: string[]): Promise<void>
  }
  window: {
    minimize(): Promise<void>
    maximize(): Promise<void>
    close(): Promise<void>
  }
  productivity: {
    showNotification(title: string, body: string): Promise<void>
    exportBackup(): Promise<string>
    importBackup(jsonData: string): Promise<boolean>
  }
}
