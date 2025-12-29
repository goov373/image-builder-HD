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

export default function useTabs(initialTabs = []) {
  const [initialized, setInitialized] = useState(false);
  const stored = loadFromStorage(initialTabs);
  
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
    if (!newName.trim()) return;
    setProjects(prev => prev.map(p => 
      p.id === activeTabId ? { ...p, name: newName.trim() } : p
    ));
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
  };

  const handleCreateNewFromHome = (closeAccount) => {
    const newId = Math.max(...projects.map(p => p.id), 0) + 1;
    const newProject = { 
      id: newId, 
      name: 'Untitled Project', 
      hasContent: false, 
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
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
    // Remove from open tabs (project stays saved)
    const newOpenIds = openTabIds.filter(id => id !== tabId);
    setOpenTabIds(newOpenIds);
    
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
        ? { ...p, name: projectName || 'New Project', hasContent: true, projectType: projectType || 'carousel' }
        : p
    ));
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
  };
}

