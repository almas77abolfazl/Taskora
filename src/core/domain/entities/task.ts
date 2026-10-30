import { SubTask } from './subtask'

export interface Task {
  id: string
  title: string
  completed: boolean
  completedAt: string | null
  listId: string
  isImportant: boolean
  isMyDay: boolean
  myDayDate: string | null
  dueDate: string | null
  reminderDate: string | null
  notes: string
  orderIndex: number
  subtasks: SubTask[]
  createdAt: string
  updatedAt: string
}

