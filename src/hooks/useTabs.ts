import { useState, useEffect, useRef, MouseEvent } from 'react';
import { logger } from '../utils';

/**
 * useTabs Hook
 *
 * Manages tab navigation and project state including:
 * - Multiple project tabs (up to 10)
 * - Project CRUD operations
 * - View navigation (home/editor)
 * - Tab persistence to localStorage
 * - Project metadata (name, type, timestamps)
 *
 * @example
 * ```tsx
 * import useTabs from './hooks/useTabs';
 *
 * function TabBar() {
 *   const {
 *     tabs,
 *     activeTab,
 *     handleTabClick,
 *     handleCreateProject,
 *     handleCloseTab,
 *   } = useTabs();
 *
 *   return (
 *     <nav>
 *       {tabs.map(tab => (
 *         <Tab
 *           key={tab.id}
 *           active={tab.id === activeTab?.id}
 *           onClick={() => handleTabClick(tab.id)}
 *           onClose={() => handleCloseTab(tab.id)}
 *         >
 *           {tab.name}
 *         </Tab>
 *       ))}
 *       <button onClick={() => handleCreateProject('carousel')}>
 *         New Project
 *       </button>
 *     </nav>
 *   );
 * }
 * ```
 *
 * @module hooks/useTabs
 */

const MAX_TABS = 10;
const STORAGE_KEY = 'carousel-tool-tabs-v2';

/**
 * Project Type - supported project types in the application
 */
export type ProjectType = 'carousel' | 'eblast' | 'single-image' | 'video-cover';

/**
 * Project Interface - represents a saved project
 */
export interface Project {
  id: number;
  name: string;
  hasContent: boolean;
  createdAt: string;
  updatedAt: string;
  lastEditedBy: string;
  frameCount: number;
  projectType?: ProjectType;
}

/**
 * User Interface - minimal user info needed for tracking
 */
export interface User {
  email?: string;
  [key: string]: unknown;
}

/**
 * Operation Result - for operations that can fail
 */
export interface OperationResult {
  success: boolean;
  error?: string;
}

/**
 * View Type - possible views in the application
 */
export type ViewType = 'home' | 'editor';

/**
 * Stored Tab State - what gets persisted to localStorage
 */
interface StoredTabState {
  projects: Project[];
  activeTabId: number | null;
  currentView: ViewType;
  openTabIds: number[];
}

/**
 * UseTabs Return Interface
 */
export interface UseTabsReturn {
  tabs: Project[];
  projects: Project[];
  activeTabId: number | null;
  activeTab: Project | undefined;
  currentView: ViewType;
  maxTabs: number;
  handleTabClick: (tabId: number) => void;
  handleUpdateProjectName: (newName: string) => OperationResult;
  handleGoHome: (clearSelection?: () => void) => void;
  handleOpenProject: (projectId: number, closeAccount?: () => void) => void;
  handleCreateNewFromHome: (closeAccount?: () => void) => void;
  handleCloseTab: (tabId: number, e: MouseEvent) => void;
  handleAddTab: (closeAccount?: () => void) => void;
  handleCreateProject: (projectType: ProjectType, projectName?: string) => void;
  handleDeleteProject: (projectId: number) => void;
  handleDuplicateProject: (projectId: number) => void;
  handleRenameProject: (projectId: number, newName: string) => OperationResult;
}

/**
 * Load tab state from localStorage or use initial data
 */
function loadFromStorage(initialTabs: Project[]): StoredTabState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<StoredTabState>;
      const activeTabId = parsed.activeTabId ?? null;
      
      // If there's an active tab, restore to editor view, otherwise home
      const currentView = activeTabId !== null ? (parsed.currentView || 'editor') : 'home';
      
      return {
        projects: parsed.projects || initialTabs,
        activeTabId,
        currentView,
        openTabIds: parsed.openTabIds || (activeTabId !== null ? [activeTabId] : []),
      };
    }
  } catch (e) {
    logger.warn('Failed to load tabs from localStorage:', e);
  }
  return {
    projects: initialTabs,
    activeTabId: null,
    currentView: 'home',
    openTabIds: [],
  };
}

/**
 * Hook for managing tabs and projects
 * Handles project CRUD, tab navigation, and persistence
 *
 * @param initialTabs - Initial set of projects
 * @param user - Current user (optional)
 * @returns Tab management functions and state
 */
export default function useTabs(
  initialTabs: Project[] = [],
  user: User | null = null
): UseTabsReturn {
  // Load from storage only once using lazy initializer
  const storedRef = useRef<StoredTabState | null>(null);
  if (storedRef.current === null) {
    storedRef.current = loadFromStorage(initialTabs);
  }
  const stored = storedRef.current;

  // Helper to get user email for edit tracking
  const getUserEmail = (): string => user?.email || 'Unknown user';

  // All saved projects (persisted) - initialize from stored state
  const [projects, setProjects] = useState<Project[]>(stored.projects);
  // IDs of projects currently open as tabs
  const [openTabIds, setOpenTabIds] = useState<number[]>(stored.openTabIds);
  const [activeTabId, setActiveTabId] = useState<number | null>(stored.activeTabId);
  const [currentView, setCurrentView] = useState<ViewType>(stored.currentView);

  // Track if this is the initial mount to prevent saving on first render
  const isInitialMount = useRef(true);

  // Derive open tabs from projects and openTabIds
  const tabs = projects.filter((p) => openTabIds.includes(p.id));

  // Save to localStorage whenever projects, activeTabId, currentView, or openTabIds changes
  // Skip saving on initial mount to prevent unnecessary writes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          projects,
          activeTabId,
          currentView,
          openTabIds,
        })
      );
    } catch (e) {
      logger.warn('Failed to save tabs to localStorage:', e);
    }
  }, [projects, activeTabId, currentView, openTabIds]);

  const activeTab = projects.find((p) => p.id === activeTabId);

  const handleTabClick = (tabId: number): void => {
    setActiveTabId(tabId);
  };

  const handleUpdateProjectName = (newName: string): OperationResult => {
    if (!newName.trim()) return { success: false, error: 'Name cannot be empty' };

    const trimmedName = newName.trim();

    // Check if name already exists (excluding current project)
    const nameExists = projects.some(
      (p) => p.id !== activeTabId && p.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (nameExists) {
      return { success: false, error: 'A project with this name already exists' };
    }

    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeTabId
          ? {
              ...p,
              name: trimmedName,
              updatedAt: new Date().toISOString().split('T')[0],
              lastEditedBy: getUserEmail(),
            }
          : p
      )
    );

    return { success: true };
  };

  const handleGoHome = (clearSelection?: () => void): void => {
    setCurrentView('home');
    if (clearSelection) clearSelection();
  };

  const handleOpenProject = (projectId: number, closeAccount?: () => void): void => {
    // Add to open tabs if not already open
    if (!openTabIds.includes(projectId)) {
      setOpenTabIds((prev) => [...prev, projectId]);
    }
    setActiveTabId(projectId);
    if (closeAccount) closeAccount();
    setCurrentView('editor');

    // Update the project's updatedAt and lastEditedBy to reflect it was recently opened
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              updatedAt: new Date().toISOString().split('T')[0],
              lastEditedBy: getUserEmail(),
            }
          : p
      )
    );
  };

  const handleCreateNewFromHome = (closeAccount?: () => void): void => {
    const newId = Math.max(...projects.map((p) => p.id), 0) + 1;
    const newProject: Project = {
      id: newId,
      name: 'Untitled Project',
      hasContent: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      lastEditedBy: getUserEmail(),
      frameCount: 0,
      projectType: 'carousel',
    };
    setProjects((prev) => [...prev, newProject]);
    setOpenTabIds((prev) => [...prev, newId]);
    setActiveTabId(newId);
    if (closeAccount) closeAccount();
    setCurrentView('editor');
  };

  const handleCloseTab = (tabId: number, e: MouseEvent): void => {
    e.stopPropagation();

    // Check if this is an incomplete/draft project (hasn't completed Create New Project form)
    const project = projects.find((p) => p.id === tabId);
    const isDraft = project && !project.hasContent;

    // Remove from open tabs
    const newOpenIds = openTabIds.filter((id) => id !== tabId);
    setOpenTabIds(newOpenIds);

    // If it's a draft project, delete it entirely (don't save to homepage)
    if (isDraft) {
      setProjects((prev) => prev.filter((p) => p.id !== tabId));
    }

    // If closing the last open tab, go to homepage
    if (newOpenIds.length === 0) {
      setActiveTabId(null);
      setCurrentView('home');
      return;
    }

    // If closing the active tab, switch to first remaining open tab
    if (activeTabId === tabId) {
      setActiveTabId(newOpenIds[0]);
    }
  };

  const handleAddTab = (closeAccount?: () => void): void => {
    if (openTabIds.length >= MAX_TABS) return;
    const newId = Math.max(...projects.map((p) => p.id), 0) + 1;
    const newProject: Project = {
      id: newId,
      name: 'Untitled Project',
      hasContent: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      lastEditedBy: getUserEmail(),
      frameCount: 0,
    };
    setProjects((prev) => [...prev, newProject]);
    setOpenTabIds((prev) => [...prev, newId]);
    setActiveTabId(newId);
    if (closeAccount) closeAccount();
    setCurrentView('editor');
  };

  const handleCreateProject = (projectType: ProjectType, projectName?: string): void => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeTabId
          ? {
              ...p,
              name: projectName || 'New Project',
              hasContent: true,
              projectType: projectType || 'carousel',
              updatedAt: new Date().toISOString().split('T')[0],
              lastEditedBy: getUserEmail(),
            }
          : p
      )
    );
  };

  const handleDeleteProject = (projectId: number): void => {
    // Remove from projects
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    // Remove from open tabs if open
    setOpenTabIds((prev) => prev.filter((id) => id !== projectId));
    // If this was the active tab, switch to another or go home
    if (activeTabId === projectId) {
      const remainingOpenIds = openTabIds.filter((id) => id !== projectId);
      if (remainingOpenIds.length > 0) {
        setActiveTabId(remainingOpenIds[0]);
      } else {
        setActiveTabId(null);
        setCurrentView('home');
      }
    }
  };

  const handleDuplicateProject = (projectId: number): void => {
    const projectToDupe = projects.find((p) => p.id === projectId);
    if (!projectToDupe) return;

    const newId = Math.max(...projects.map((p) => p.id), 0) + 1;
    const newProject: Project = {
      ...projectToDupe,
      id: newId,
      name: `${projectToDupe.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      lastEditedBy: getUserEmail(),
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const handleRenameProject = (projectId: number, newName: string): OperationResult => {
    if (!newName.trim()) return { success: false, error: 'Name cannot be empty' };

    const trimmedName = newName.trim();

    // Check if name already exists (excluding current project)
    const nameExists = projects.some(
      (p) => p.id !== projectId && p.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (nameExists) {
      return { success: false, error: 'A project with this name already exists' };
    }

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              name: trimmedName,
              updatedAt: new Date().toISOString().split('T')[0],
              lastEditedBy: getUserEmail(),
            }
          : p
      )
    );

    return { success: true };
  };

  return {
    tabs, // Open tabs (for TabBar)
    projects, // All saved projects (for Homepage)
    activeTabId,
    activeTab,
    currentView,
    maxTabs: MAX_TABS,
    handleTabClick,
    handleUpdateProjectName,
    handleGoHome,
    handleOpenProject,
    handleCreateNewFromHome,
    handleCloseTab,
    handleAddTab,
    handleCreateProject,
    handleDeleteProject,
    handleDuplicateProject,
    handleRenameProject,
  };
}

