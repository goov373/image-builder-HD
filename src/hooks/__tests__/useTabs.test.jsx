/**
 * useTabs.test.jsx
 * Unit tests for the tabs/projects state management hook
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useTabs from '../useTabs';

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Sample initial tabs for tests
const createInitialTabs = () => [
  {
    id: 1,
    name: 'Test Project',
    hasContent: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    frameCount: 5,
    projectType: 'carousel',
  },
];

// Mock user
const mockUser = { email: 'test@example.com' };

describe('useTabs', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.clearAllMocks();
  });

  // ========================================
  // Initialization
  // ========================================
  describe('initialization', () => {
    it('initializes with provided tabs', () => {
      const { result } = renderHook(() => useTabs(createInitialTabs()));
      
      expect(result.current.projects).toHaveLength(1);
      expect(result.current.projects[0].name).toBe('Test Project');
    });

    it('starts with no active tab', () => {
      const { result } = renderHook(() => useTabs(createInitialTabs()));
      
      expect(result.current.activeTabId).toBeNull();
      expect(result.current.activeTab).toBeUndefined();
    });

    it('starts with home view', () => {
      const { result } = renderHook(() => useTabs(createInitialTabs()));
      
      expect(result.current.currentView).toBe('home');
    });

    it('provides maxTabs constant', () => {
      const { result } = renderHook(() => useTabs(createInitialTabs()));
      
      expect(result.current.maxTabs).toBe(10);
    });
  });

  // ========================================
  // Opening Projects
  // ========================================
  describe('opening projects', () => {
    it('opens a project from homepage', () => {
      const { result } = renderHook(() => useTabs(createInitialTabs()));
      
      act(() => {
        result.current.handleOpenProject(1);
      });
      
      expect(result.current.activeTabId).toBe(1);
      expect(result.current.currentView).toBe('editor');
      expect(result.current.tabs).toHaveLength(1);
    });

    it('does not duplicate project in tabs if already open', () => {
      const { result } = renderHook(() => useTabs(createInitialTabs()));
      
      act(() => {
        result.current.handleOpenProject(1);
      });
      
      act(() => {
        result.current.handleOpenProject(1);
      });
      
      expect(result.current.tabs).toHaveLength(1);
    });
  });

  // ========================================
  // Creating Projects
  // ========================================
  describe('creating projects', () => {
    it('creates a new project from homepage', () => {
      const { result } = renderHook(() => useTabs(createInitialTabs()));
      
      act(() => {
        result.current.handleCreateNewFromHome();
      });
      
      expect(result.current.projects).toHaveLength(2);
      expect(result.current.currentView).toBe('editor');
      expect(result.current.activeTab.name).toBe('Untitled Project');
    });

    it('sets hasContent to false for new projects', () => {
      const { result } = renderHook(() => useTabs(createInitialTabs()));
      
      act(() => {
        result.current.handleCreateNewFromHome();
      });
      
      expect(result.current.activeTab.hasContent).toBe(false);
    });

    it('handleCreateProject marks project as having content', () => {
      const { result } = renderHook(() => useTabs(createInitialTabs()));
      
      act(() => {
        result.current.handleCreateNewFromHome();
      });
      
      act(() => {
        result.current.handleCreateProject('carousel', 'My Carousel');
      });
      
      expect(result.current.activeTab.hasContent).toBe(true);
      expect(result.current.activeTab.name).toBe('My Carousel');
      expect(result.current.activeTab.projectType).toBe('carousel');
    });
  });

  // ========================================
  // Tab Management
  // ========================================
  describe('tab management', () => {
    it('switches between tabs', () => {
      const initialTabs = [
        ...createInitialTabs(),
        { id: 2, name: 'Second Project', hasContent: true, projectType: 'eblast' },
      ];
      const { result } = renderHook(() => useTabs(initialTabs));
      
      act(() => {
        result.current.handleOpenProject(1);
      });
      
      act(() => {
        result.current.handleOpenProject(2);
      });
      
      expect(result.current.tabs).toHaveLength(2);
      expect(result.current.activeTabId).toBe(2);
      
      act(() => {
        result.current.handleTabClick(1);
      });
      
      expect(result.current.activeTabId).toBe(1);
    });

    it('closes a tab', () => {
      const initialTabs = [
        ...createInitialTabs(),
        { id: 2, name: 'Second Project', hasContent: true, projectType: 'eblast' },
      ];
      const { result } = renderHook(() => useTabs(initialTabs));
      
      act(() => {
        result.current.handleOpenProject(1);
        result.current.handleOpenProject(2);
      });
      
      const mockEvent = { stopPropagation: vi.fn() };
      
      act(() => {
        result.current.handleCloseTab(2, mockEvent);
      });
      
      expect(result.current.tabs).toHaveLength(1);
      expect(result.current.activeTabId).toBe(1);
    });

    it('goes home when closing last tab', () => {
      const { result } = renderHook(() => useTabs(createInitialTabs()));
      
      act(() => {
        result.current.handleOpenProject(1);
      });
      
      const mockEvent = { stopPropagation: vi.fn() };
      
      act(() => {
        result.current.handleCloseTab(1, mockEvent);
      });
      
      expect(result.current.tabs).toHaveLength(0);
      expect(result.current.currentView).toBe('home');
    });

    it('deletes draft projects when closing tab', () => {
      const { result } = renderHook(() => useTabs(createInitialTabs()));
      
      act(() => {
        result.current.handleCreateNewFromHome();
      });
      
      const newProjectId = result.current.activeTabId;
      const mockEvent = { stopPropagation: vi.fn() };
      
      act(() => {
        result.current.handleCloseTab(newProjectId, mockEvent);
      });
      
      // Draft should be deleted from projects entirely
      expect(result.current.projects.find(p => p.id === newProjectId)).toBeUndefined();
    });
  });

  // ========================================
  // Project Management
  // ========================================
  describe('project management', () => {
    it('renames a project', () => {
      const { result } = renderHook(() => useTabs(createInitialTabs()));
      
      act(() => {
        result.current.handleRenameProject(1, 'New Name');
      });
      
      expect(result.current.projects[0].name).toBe('New Name');
    });

    it('rejects empty name on rename', () => {
      const { result } = renderHook(() => useTabs(createInitialTabs()));
      
      let renameResult;
      act(() => {
        renameResult = result.current.handleRenameProject(1, '   ');
      });
      
      expect(renameResult.success).toBe(false);
      expect(renameResult.error).toBe('Name cannot be empty');
    });

    it('rejects duplicate name on rename', () => {
      const initialTabs = [
        ...createInitialTabs(),
        { id: 2, name: 'Other Project', hasContent: true },
      ];
      const { result } = renderHook(() => useTabs(initialTabs));
      
      let renameResult;
      act(() => {
        renameResult = result.current.handleRenameProject(1, 'Other Project');
      });
      
      expect(renameResult.success).toBe(false);
      expect(renameResult.error).toBe('A project with this name already exists');
    });

    it('deletes a project', () => {
      const { result } = renderHook(() => useTabs(createInitialTabs()));
      
      act(() => {
        result.current.handleDeleteProject(1);
      });
      
      expect(result.current.projects).toHaveLength(0);
    });

    it('duplicates a project', () => {
      const { result } = renderHook(() => useTabs(createInitialTabs()));
      
      act(() => {
        result.current.handleDuplicateProject(1);
      });
      
      expect(result.current.projects).toHaveLength(2);
      expect(result.current.projects[1].name).toBe('Test Project (Copy)');
    });
  });

  // ========================================
  // Navigation
  // ========================================
  describe('navigation', () => {
    it('goes back to home', () => {
      const { result } = renderHook(() => useTabs(createInitialTabs()));
      
      act(() => {
        result.current.handleOpenProject(1);
      });
      
      expect(result.current.currentView).toBe('editor');
      
      act(() => {
        result.current.handleGoHome();
      });
      
      expect(result.current.currentView).toBe('home');
    });

    it('calls clearSelection callback when going home', () => {
      const { result } = renderHook(() => useTabs(createInitialTabs()));
      const clearSelection = vi.fn();
      
      act(() => {
        result.current.handleOpenProject(1);
      });
      
      act(() => {
        result.current.handleGoHome(clearSelection);
      });
      
      expect(clearSelection).toHaveBeenCalled();
    });
  });

  // ========================================
  // User Tracking
  // ========================================
  describe('user tracking', () => {
    it('tracks lastEditedBy with user email', () => {
      const { result } = renderHook(() => useTabs(createInitialTabs(), mockUser));
      
      act(() => {
        result.current.handleOpenProject(1);
      });
      
      expect(result.current.projects[0].lastEditedBy).toBe('test@example.com');
    });

    it('uses Unknown user when no user provided', () => {
      const { result } = renderHook(() => useTabs(createInitialTabs()));
      
      act(() => {
        result.current.handleCreateNewFromHome();
      });
      
      expect(result.current.activeTab.lastEditedBy).toBe('Unknown user');
    });
  });
});

