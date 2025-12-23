import { useState } from 'react';

const MAX_TABS = 10;

export default function useTabs(initialTabs = []) {
  const [tabs, setTabs] = useState(initialTabs);
  const [activeTabId, setActiveTabId] = useState(initialTabs[0]?.id || null);
  const [currentView, setCurrentView] = useState('home');

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
      frameCount: 0
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
        ? { ...t, name: projectName || 'New Project', hasContent: true }
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

