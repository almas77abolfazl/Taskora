// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { App } from '@renderer/App'
import { SYSTEM_LIST_IDS } from '@core/domain/entities'

describe('App Shell & Taskora UI Components', () => {
  beforeEach(() => {
    // Mock window.api
    window.api = {
      tasks: {
        getAll: vi.fn().mockResolvedValue([
          {
            id: 'task-1',
            title: 'Design clean architecture',
            completed: false,
            completedAt: null,
            listId: SYSTEM_LIST_IDS.MY_DAY,
            isImportant: true,
            isMyDay: true,
            myDayDate: '2026-10-31',
            dueDate: null,
            reminderDate: null,
            notes: 'Notes here',
            orderIndex: 0,
            subtasks: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]),
        getById: vi.fn(),
        getByListId: vi.fn(),
        getMyDay: vi.fn(),
        getImportant: vi.fn(),
        getPlanned: vi.fn(),
        search: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        reorder: vi.fn(),
        addSubTask: vi.fn(),
        updateSubTask: vi.fn(),
        deleteSubTask: vi.fn()
      },
      lists: {
        getAll: vi.fn().mockResolvedValue([
          {
            id: SYSTEM_LIST_IDS.MY_DAY,
            title: 'روز من',
            isSystem: true,
            systemType: 'my-day',
            iconName: 'Sun',
            orderIndex: 0,
            createdAt: '',
            updatedAt: ''
          }
        ]),
        getById: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        reorder: vi.fn()
      },
      window: {
        minimize: vi.fn(),
        maximize: vi.fn(),
        close: vi.fn()
      },
      productivity: {
        showNotification: vi.fn(),
        exportBackup: vi.fn(),
        importBackup: vi.fn()
      }
    }
  })

  it('renders the TitleBar, Sidebar, and TaskView components', async () => {
    render(<App />)

    // Check title bar branding
    await waitFor(() => {
      expect(screen.getByText('Taskora')).toBeDefined()
    })

    // Check smart list presence in sidebar and view header
    expect(screen.getAllByText('روز من').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('مهم')).toBeDefined()
    expect(screen.getByText('برنامه‌ریزی‌شده')).toBeDefined()
    expect(screen.getByText('وظایف')).toBeDefined()
  })
})
