export const IPC_CHANNELS = {
  // Tasks
  TASK_GET_ALL: 'task:get-all',
  TASK_GET_BY_ID: 'task:get-by-id',
  TASK_GET_BY_LIST_ID: 'task:get-by-list-id',
  TASK_GET_MY_DAY: 'task:get-my-day',
  TASK_GET_IMPORTANT: 'task:get-important',
  TASK_GET_PLANNED: 'task:get-planned',
  TASK_SEARCH: 'task:search',
  TASK_CREATE: 'task:create',
  TASK_UPDATE: 'task:update',
  TASK_DELETE: 'task:delete',
  TASK_REORDER: 'task:reorder',
  TASK_ADD_SUBTASK: 'task:add-subtask',
  TASK_UPDATE_SUBTASK: 'task:update-subtask',
  TASK_DELETE_SUBTASK: 'task:delete-subtask',

  // Lists
  LIST_GET_ALL: 'list:get-all',
  LIST_GET_BY_ID: 'list:get-by-id',
  LIST_CREATE: 'list:create',
  LIST_UPDATE: 'list:update',
  LIST_DELETE: 'list:delete',
  LIST_REORDER: 'list:reorder',

  // Window Controls
  WINDOW_MINIMIZE: 'window:minimize',
  WINDOW_MAXIMIZE: 'window:maximize',
  WINDOW_CLOSE: 'window:close',

  // Productivity, Notifications & Backup
  NOTIFICATION_SHOW: 'notification:show',
  BACKUP_EXPORT: 'backup:export',
  BACKUP_IMPORT: 'backup:import'
} as const
