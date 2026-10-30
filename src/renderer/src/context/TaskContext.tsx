import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { Task, SubTask, TaskList, SYSTEM_LIST_IDS } from '@core/domain/entities'
import { getTodayString } from '../lib/date-utils'

interface TaskContextValue {
  tasks: Task[]
  lists: TaskList[]
  activeListId: string
  selectedTaskId: string | null
  searchQuery: string
  isLoading: boolean
  activeList: TaskList | undefined
  selectedTask: Task | undefined
  filteredTasks: Task[]
  setActiveListId: (id: string) => void
  setSelectedTaskId: (id: string | null) => void
  setSearchQuery: (query: string) => void
  createTask: (title: string, options?: Partial<Task>) => Promise<Task>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTaskComplete: (id: string) => Promise<void>
  toggleTaskImportant: (id: string) => Promise<void>
  toggleTaskMyDay: (id: string) => Promise<void>
  addSubTask: (taskId: string, title: string) => Promise<void>
  updateSubTask: (taskId: string, subTaskId: string, updates: Partial<SubTask>) => Promise<void>
  deleteSubTask: (taskId: string, subTaskId: string) => Promise<void>
  createList: (title: string) => Promise<TaskList>
  deleteList: (id: string) => Promise<void>
  refreshData: () => Promise<void>
}

const TaskContext = createContext<TaskContextValue | null>(null)

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [lists, setLists] = useState<TaskList[]>([])
  const [activeListId, setActiveListId] = useState<string>(SYSTEM_LIST_IDS.MY_DAY)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const isElectron = typeof window !== 'undefined' && !!window.api

  const refreshData = useCallback(async () => {
    if (!isElectron) {
      setIsLoading(false)
      return
    }

    try {
      const [fetchedTasks, fetchedLists] = await Promise.all([
        window.api.tasks.getAll(),
        window.api.lists.getAll()
      ])
      setTasks(fetchedTasks)
      setLists(fetchedLists)
    } catch (err) {
      console.error('Failed to load data from Electron API:', err)
    } finally {
      setIsLoading(false)
    }
  }, [isElectron])

  useEffect(() => {
    refreshData()
  }, [refreshData])

  const activeList = useMemo(() => {
    return lists.find((l) => l.id === activeListId)
  }, [lists, activeListId])

  const selectedTask = useMemo(() => {
    if (!selectedTaskId) return undefined
    return tasks.find((t) => t.id === selectedTaskId)
  }, [tasks, selectedTaskId])

  const filteredTasks = useMemo(() => {
    const today = getTodayString()

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return tasks.filter((t) => t.title.toLowerCase().includes(q) || t.notes.toLowerCase().includes(q))
    }

    switch (activeListId) {
      case SYSTEM_LIST_IDS.MY_DAY:
        return tasks.filter((t) => t.isMyDay && t.myDayDate === today)
      case SYSTEM_LIST_IDS.IMPORTANT:
        return tasks.filter((t) => t.isImportant)
      case SYSTEM_LIST_IDS.PLANNED:
        return tasks.filter((t) => t.dueDate !== null && t.dueDate !== undefined)
      case SYSTEM_LIST_IDS.TASKS:
        return tasks.filter((t) => t.listId === SYSTEM_LIST_IDS.TASKS)
      default:
        // Custom list
        return tasks.filter((t) => t.listId === activeListId)
    }
  }, [tasks, activeListId, searchQuery])

  const createTask = async (title: string, options?: Partial<Task>): Promise<Task> => {
    const today = getTodayString()
    const targetListId =
      activeListId === SYSTEM_LIST_IDS.MY_DAY ||
      activeListId === SYSTEM_LIST_IDS.IMPORTANT ||
      activeListId === SYSTEM_LIST_IDS.PLANNED
        ? SYSTEM_LIST_IDS.TASKS
        : activeListId

    const isMyDay = activeListId === SYSTEM_LIST_IDS.MY_DAY || !!options?.isMyDay
    const isImportant = activeListId === SYSTEM_LIST_IDS.IMPORTANT || !!options?.isImportant
    const dueDate = activeListId === SYSTEM_LIST_IDS.PLANNED ? today : options?.dueDate ?? null

    const newTask = await window.api.tasks.create({
      title,
      listId: targetListId,
      isMyDay,
      myDayDate: isMyDay ? today : null,
      isImportant,
      dueDate,
      notes: options?.notes ?? '',
      orderIndex: tasks.length
    })

    setTasks((prev) => [...prev, newTask])
    return newTask
  }

  const updateTask = async (id: string, updates: Partial<Task>): Promise<void> => {
    const updated = await window.api.tasks.update(id, updates)
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
  }

  const deleteTask = async (id: string): Promise<void> => {
    await window.api.tasks.delete(id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
    if (selectedTaskId === id) {
      setSelectedTaskId(null)
    }
  }

  const toggleTaskComplete = async (id: string): Promise<void> => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    await updateTask(id, { completed: !task.completed })
  }

  const toggleTaskImportant = async (id: string): Promise<void> => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    await updateTask(id, { isImportant: !task.isImportant })
  }

  const toggleTaskMyDay = async (id: string): Promise<void> => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    const today = getTodayString()
    const nextIsMyDay = !task.isMyDay
    await updateTask(id, {
      isMyDay: nextIsMyDay,
      myDayDate: nextIsMyDay ? today : null
    })
  }

  const addSubTask = async (taskId: string, title: string): Promise<void> => {
    const newStep = await window.api.tasks.addSubTask(taskId, title)
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, subtasks: [...t.subtasks, newStep] } : t))
    )
  }

  const updateSubTask = async (
    taskId: string,
    subTaskId: string,
    updates: Partial<SubTask>
  ): Promise<void> => {
    const updatedStep = await window.api.tasks.updateSubTask(taskId, subTaskId, updates)
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((s) => (s.id === subTaskId ? updatedStep : s))
            }
          : t
      )
    )
  }

  const deleteSubTask = async (taskId: string, subTaskId: string): Promise<void> => {
    await window.api.tasks.deleteSubTask(taskId, subTaskId)
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.filter((s) => s.id !== subTaskId)
            }
          : t
      )
    )
  }

  const createList = async (title: string): Promise<TaskList> => {
    const newList = await window.api.lists.create({
      title,
      isSystem: false,
      iconName: 'List',
      orderIndex: lists.length
    })
    setLists((prev) => [...prev, newList])
    setActiveListId(newList.id)
    return newList
  }

  const deleteList = async (id: string): Promise<void> => {
    await window.api.lists.delete(id)
    setLists((prev) => prev.filter((l) => l.id !== id))
    setTasks((prev) => prev.filter((t) => t.listId !== id))
    if (activeListId === id) {
      setActiveListId(SYSTEM_LIST_IDS.MY_DAY)
    }
  }

  const value = useMemo<TaskContextValue>(
    () => ({
      tasks,
      lists,
      activeListId,
      selectedTaskId,
      searchQuery,
      isLoading,
      activeList,
      selectedTask,
      filteredTasks,
      setActiveListId,
      setSelectedTaskId,
      setSearchQuery,
      createTask,
      updateTask,
      deleteTask,
      toggleTaskComplete,
      toggleTaskImportant,
      toggleTaskMyDay,
      addSubTask,
      updateSubTask,
      deleteSubTask,
      createList,
      deleteList,
      refreshData
    }),
    [
      tasks,
      lists,
      activeListId,
      selectedTaskId,
      searchQuery,
      isLoading,
      activeList,
      selectedTask,
      filteredTasks,
      refreshData
    ]
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export function useTasks(): TaskContextValue {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider')
  }
  return context
}

