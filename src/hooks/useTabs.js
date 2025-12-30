import { useState, useEffect } from 'react';

const MAX_TABS = 10;
const STORAGE_KEY = 'carousel-tool-tabs-v2';

// Load from localStorage or use initial data
function loadFromStorage(initialTabs) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        projects: parsed.projects || initialTabs,
        activeTabId: parsed.activeTabId || null,
      };
    }
  } catch (e) {
    console.warn('Failed to load tabs from localStorage:', e);
  }
  return {
    projects: initialTabs,
    activeTabId: null,
  };
}

export default function useTabs(initialTabs = [], user = null) {
  const [initialized, setInitialized] = useState(false);
  const stored = loadFromStorage(initialTabs);
  
  // Helper to get user email for edit tracking
  const getUserEmail = () => user?.email || 'Unknown user';
  
  // All saved projects (persisted)
  const [projects, setProjects] = useState(stored.projects);
  // IDs of projects currently open as tabs
  const [openTabIds, setOpenTabIds] = useState([]);
  const [activeTabId, setActiveTabId] = useState(stored.activeTabId);
  const [currentView, setCurrentView] = useState('home');
  
  // Derive open tabs from projects and openTabIds
  const tabs = projects.filter(p => openTabIds.includes(p.id));

  // Save to localStorage whenever projects or activeTabId changes
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ projects, activeTabId }));
    } catch (e) {
      console.warn('Failed to save projects to localStorage:', e);
    }
  }, [projects, activeTabId, initialized]);

  const activeTab = projects.find(p => p.id === activeTabId);

  const handleTabClick = (tabId) => {
    setActiveTabId(tabId);
  };

  const handleUpdateProjectName = (newName) => {
    if (!newName.trim()) return { success: false, error: 'Name cannot be empty' };
    
    const trimmedName = newName.trim();
    
    // Check if name already exists (excluding current project)
    const nameExists = projects.some(p => 
      p.id !== activeTabId && p.name.toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (nameExists) {
      return { success: false, error: 'A project with this name already exists' };
    }
    
    setProjects(prev => prev.map(p => 
      p.id === activeTabId ? { ...p, name: trimmedName, updatedAt: new Date().toISOString().split('T')[0], lastEditedBy: getUserEmail() } : p
    ));
    
    return { success: true };
  };

  const handleGoHome = (clearSelection) => {
    setCurrentView('home');
    if (clearSelection) clearSelection();
  };

  const handleOpenProject = (projectId, closeAccount) => {
    // Add to open tabs if not already open
    if (!openTabIds.includes(projectId)) {
      setOpenTabIds(prev => [...prev, projectId]);
    }
    setActiveTabId(projectId);
    if (closeAccount) closeAccount();
    setCurrentView('editor');
    
    // Update the project's updatedAt and lastEditedBy to reflect it was recently opened
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, updatedAt: new Date().toISOString().split('T')[0], lastEditedBy: getUserEmail() }
        : p
    ));
  };

  const handleCreateNewFromHome = (closeAccount) => {
    const newId = Math.max(...projects.map(p => p.id), 0) + 1;
    const newProject = { 
      id: newId, 
      name: 'Untitled Project', 
      hasContent: false, 
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      lastEditedBy: getUserEmail(),
      frameCount: 0,
      projectType: 'carousel'
    };
    setProjects(prev => [...prev, newProject]);
    setOpenTabIds(prev => [...prev, newId]);
    setActiveTabId(newId);
    if (closeAccount) closeAccount();
    setCurrentView('editor');
  };

  const handleCloseTab = (tabId, e) => {
    e.stopPropagation();
    
    // Check if this is an incomplete/draft project (hasn't completed Create New Project form)
    const project = projects.find(p => p.id === tabId);
    const isDraft = project && !project.hasContent;
    
    // Remove from open tabs
    const newOpenIds = openTabIds.filter(id => id !== tabId);
    setOpenTabIds(newOpenIds);
    
    // If it's a draft project, delete it entirely (don't save to homepage)
    if (isDraft) {
      setProjects(prev => prev.filter(p => p.id !== tabId));
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

  const handleAddTab = (closeAccount) => {
    if (openTabIds.length >= MAX_TABS) return;
    const newId = Math.max(...projects.map(p => p.id), 0) + 1;
    const newProject = { 
      id: newId, 
      name: 'Untitled Project', 
      hasContent: false, 
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      lastEditedBy: getUserEmail(),
      frameCount: 0
    };
    setProjects(prev => [...prev, newProject]);
    setOpenTabIds(prev => [...prev, newId]);
    setActiveTabId(newId);
    if (closeAccount) closeAccount();
    setCurrentView('editor');
  };

  const handleCreateProject = (projectType, projectName) => {
    setProjects(prev => prev.map(p => 
      p.id === activeTabId 
        ? { ...p, name: projectName || 'New Project', hasContent: true, projectType: projectType || 'carousel', updatedAt: new Date().toISOString().split('T')[0], lastEditedBy: getUserEmail() }
        : p
    ));
  };

  const handleDeleteProject = (projectId) => {
    // Remove from projects
    setProjects(prev => prev.filter(p => p.id !== projectId));
    // Remove from open tabs if open
    setOpenTabIds(prev => prev.filter(id => id !== projectId));
    // If this was the active tab, switch to another or go home
    if (activeTabId === projectId) {
      const remainingOpenIds = openTabIds.filter(id => id !== projectId);
      if (remainingOpenIds.length > 0) {
        setActiveTabId(remainingOpenIds[0]);
      } else {
        setActiveTabId(null);
        setCurrentView('home');
      }
    }
  };

  const handleDuplicateProject = (projectId) => {
    const projectToDupe = projects.find(p => p.id === projectId);
    if (!projectToDupe) return;
    
    const newId = Math.max(...projects.map(p => p.id), 0) + 1;
    const newProject = {
      ...projectToDupe,
      id: newId,
      name: `${projectToDupe.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      lastEditedBy: getUserEmail(),
    };
    setProjects(prev => [...prev, newProject]);
  };

  const handleRenameProject = (projectId, newName) => {
    if (!newName.trim()) return { success: false, error: 'Name cannot be empty' };
    
    const trimmedName = newName.trim();
    
    // Check if name already exists (excluding current project)
    const nameExists = projects.some(p => 
      p.id !== projectId && p.name.toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (nameExists) {
      return { success: false, error: 'A project with this name already exists' };
    }
    
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, name: trimmedName, updatedAt: new Date().toISOString().split('T')[0], lastEditedBy: getUserEmail() } : p
    ));
    
    return { success: true };
  };

  return {
    tabs,           // Open tabs (for TabBar)
    projects,       // All saved projects (for Homepage)
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

