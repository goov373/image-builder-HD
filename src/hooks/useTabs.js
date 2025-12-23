import { useState, useEffect } from 'react';

const MAX_TABS = 10;
const STORAGE_KEY = 'carousel-tool-tabs';

// Load from localStorage or use initial data
function loadFromStorage(initialTabs) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        tabs: parsed.tabs || initialTabs,
        activeTabId: parsed.activeTabId || initialTabs[0]?.id || null,
      };
    }
  } catch (e) {
    console.warn('Failed to load tabs from localStorage:', e);
  }
  return {
    tabs: initialTabs,
    activeTabId: initialTabs[0]?.id || null,
  };
}

export default function useTabs(initialTabs = []) {
  const [initialized, setInitialized] = useState(false);
  const stored = loadFromStorage(initialTabs);
  
  const [tabs, setTabs] = useState(stored.tabs);
  const [activeTabId, setActiveTabId] = useState(stored.activeTabId);
  const [currentView, setCurrentView] = useState('home');

  // Save to localStorage whenever tabs or activeTabId changes
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ tabs, activeTabId }));
    } catch (e) {
      console.warn('Failed to save tabs to localStorage:', e);
    }
  }, [tabs, activeTabId, initialized]);

  const activeTab = tabs.find(t => t.id === activeTabId);

  const handleTabClick = (tabId) => {
    setActiveTabId(tabId);
    setTabs(prev => prev.map(tab => ({ ...tab, active: tab.id === tabId })));
  };

  const handleUpdateProjectName = (newName) => {
    if (!newName.trim()) return;
    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId ? { ...tab, name: newName.trim() } : tab
    ));
  };

  const handleGoHome = (clearSelection) => {
    setCurrentView('home');
    if (clearSelection) clearSelection();
  };

  const handleOpenProject = (projectId, closeAccount) => {
    setActiveTabId(projectId);
    setTabs(prev => prev.map(tab => ({ ...tab, active: tab.id === projectId })));
    if (closeAccount) closeAccount();
    setCurrentView('editor');
  };

  const handleCreateNewFromHome = (closeAccount) => {
    const newId = Math.max(...tabs.map(t => t.id), 0) + 1;
    const newTab = { 
      id: newId, 
      name: 'Untitled Project', 
      active: true, 
      hasContent: false, 
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      frameCount: 0,
      projectType: 'carousel'
    };
    setTabs(prev => [...prev.map(t => ({ ...t, active: false })), newTab]);
    setActiveTabId(newId);
    if (closeAccount) closeAccount();
    setCurrentView('editor');
  };

  const handleCloseTab = (tabId, e) => {
    e.stopPropagation();
    if (tabs.length <= 1) return;
    const newTabs = tabs.filter(t => t.id !== tabId);
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[0].id);
      newTabs[0].active = true;
    }
    setTabs(newTabs);
  };

  const handleAddTab = (closeAccount) => {
    if (tabs.length >= MAX_TABS) return;
    const newId = Math.max(...tabs.map(t => t.id), 0) + 1;
    const newTab = { 
      id: newId, 
      name: 'Untitled Project', 
      active: true, 
      hasContent: false, 
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      frameCount: 0
    };
    setTabs(prev => [...prev.map(t => ({ ...t, active: false })), newTab]);
    setActiveTabId(newId);
    if (closeAccount) closeAccount();
    setCurrentView('editor');
  };

  const handleCreateProject = (projectType, projectName) => {
    setTabs(prev => prev.map(t => 
      t.id === activeTabId 
        ? { ...t, name: projectName || 'New Project', hasContent: true, projectType: projectType || 'carousel' }
        : t
    ));
  };

  return {
    tabs,
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

