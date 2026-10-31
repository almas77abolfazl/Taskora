export type Locale = 'en' | 'fa'

export interface TranslationDictionary {
  // Brand & App
  appName: string

  // Navigation & Lists
  myDay: string
  important: string
  planned: string
  tasks: string
  customLists: string
  newList: string
  newListPlaceholder: string

  // Actions
  addTask: string
  addTaskPlaceholder: string
  add: string
  cancel: string
  save: string
  delete: string
  edit: string
  rename: string
  search: string
  searchPlaceholder: string

  // Task Details
  steps: string
  addStep: string
  addToMyDay: string
  addedToMyDay: string
  remindMe: string
  dueDate: string
  repeat: string
  addNote: string
  notePlaceholder: string
  createdOn: string
  completedOn: string
  deleteTask: string
  deleteTaskConfirm: string
  deleteList: string
  deleteListConfirm: string
  markComplete: string
  markIncomplete: string

  // Dates
  today: string
  tomorrow: string
  nextWeek: string
  pickDate: string
  noDueDate: string

  // Settings & App
  settings: string
  language: string
  english: string
  persian: string
  emptyTasksTitle: string
  emptyTasksSubtitle: string
  emptySearchTitle: string
  completedTasks: string

  // Profile & Account
  profile: string
  profileName: string
  profileNamePlaceholder: string
  offlineStorage: string
  offlineStorageDesc: string
  cloudSync: string
  cloudSyncDesc: string
  comingSoon: string
  activeStatus: string
  totalTasks: string
  completedCount: string
  pendingCount: string
}
