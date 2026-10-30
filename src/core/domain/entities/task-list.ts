export type SystemListType = 'my-day' | 'important' | 'planned' | 'tasks'

export const SYSTEM_LIST_IDS = {
  MY_DAY: 'system-my-day',
  IMPORTANT: 'system-important',
  PLANNED: 'system-planned',
  TASKS: 'system-tasks'
} as const

export interface TaskList {
  id: string
  title: string
  isSystem: boolean
  systemType?: SystemListType
  iconName: string
  color?: string
  orderIndex: number
  createdAt: string
  updatedAt: string
}
