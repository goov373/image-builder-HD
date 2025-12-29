import React from 'react';

export default function TabBar({
  tabs,
  activeTabId,
  currentView,
  showNewTabMenu,
  setShowNewTabMenu,
  newTabMenuRef,
  closeAllDropdowns,
  onGoHome,
  onOpenProject,
  onCloseTab,
  onAddTab,
  maxTabs = 10,
}) {
  return (
    <div className="fixed top-0 left-0 right-0 z-[110] border-b border-gray-700" style={{ height: 56, backgroundColor: '#0d1321' }}>
      <div className="flex items-end h-full">
        {/* Home Button */}
        <div className="flex items-center px-3 pb-2">
          <button 
            onClick={onGoHome}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${currentView === 'home' ? 'text-white bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex items-end">
          {tabs.map((tab, index) => {
            const isTabActive = tab.active && currentView !== 'home';
            return (
              <div key={tab.id} className="flex items-end">
                {/* Vertical separator - show before inactive tabs (except first) */}
                {index > 0 && !isTabActive && !(tabs[index - 1]?.active && currentView !== 'home') && (
                  <div className="w-px h-5 bg-gray-700 self-center" />
                )}
                <div 
                  onClick={() => onOpenProject(tab.id)}
                  className={`group flex items-center gap-2 px-4 h-10 rounded-t-lg cursor-pointer transition-colors duration-150 ${
                    isTabActive 
                      ? 'bg-gray-800 text-white' 
                      : 'bg-transparent text-gray-500 hover:text-gray-300'
                  }`}
                  style={{ minWidth: 140, maxWidth: 220 }}
                >
                  <svg className={`w-4 h-4 flex-shrink-0 transition-colors ${isTabActive ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm font-medium truncate flex-1">{tab.name}</span>
                  <button 
                    onClick={(e) => onCloseTab(tab.id, e)}
                    className={`w-5 h-5 rounded flex items-center justify-center transition-opacity ${
                      isTabActive 
                        ? 'hover:bg-gray-700 text-gray-400 hover:text-white opacity-100' 
                        : 'opacity-0 group-hover:opacity-100 hover:bg-gray-700 text-gray-500 hover:text-white'
                    }`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
          
          {/* Separator before add button */}
          <div className="w-px h-5 bg-gray-700 self-center mx-1" />
          
          {/* Add Tab Button with Dropdown */}
          <div ref={newTabMenuRef} className="relative mb-1">
            <button 
              onClick={() => { const wasOpen = showNewTabMenu; closeAllDropdowns(); if (!wasOpen && tabs.length < maxTabs) setShowNewTabMenu(true); }}
              disabled={tabs.length >= maxTabs}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                tabs.length >= maxTabs 
                  ? 'text-gray-600 cursor-not-allowed' 
                  : showNewTabMenu ? 'text-white bg-gray-800' : 'text-gray-500 hover:text-white hover:bg-gray-800'
              }`}
              title={tabs.length >= maxTabs ? 'Maximum tabs reached' : 'New tab'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            
            {/* New Tab Dropdown Menu */}
            {showNewTabMenu && (
              <div className="absolute top-full left-0 mt-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200] min-w-[200px]">
                {/* New Project Option */}
                <button
                  onClick={() => { onAddTab(); setShowNewTabMenu(false); }}
                  className="group w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-700 border border-dashed border-gray-500 group-hover:bg-orange-500 group-hover:border-solid group-hover:border-orange-500 flex items-center justify-center transition-all">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-white">New Project</div>
                    <div className="text-xs text-gray-500">Start from scratch</div>
                  </div>
                </button>
                
                {/* Divider */}
                <div className="my-1.5 border-t border-gray-700" />
                
                {/* Existing Projects Header */}
                <div className="px-3 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Open Existing
                </div>
                
                {/* List of existing projects */}
                {tabs.map(project => (
                  <button
                    key={project.id}
                    onClick={() => { onOpenProject(project.id); setShowNewTabMenu(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
                      project.id === activeTabId && currentView !== 'home'
                        ? 'bg-gray-700/50 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${project.hasContent ? 'bg-gray-700' : 'bg-gray-800 border border-gray-700'}`}>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{project.name}</div>
                      <div className="text-xs text-gray-500">
                        {project.hasContent ? `${project.frameCount || 5} frames` : 'Empty'}
                      </div>
                    </div>
                    {project.id === activeTabId && currentView !== 'home' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Tab Counter */}
        <div className="flex items-center px-4 pb-2 ml-auto">
          <span className="text-xs text-gray-500">
            <span className={tabs.length >= maxTabs ? 'text-orange-400' : 'text-gray-400'}>{tabs.length}</span>
            <span className="mx-0.5">/</span>
            <span>{maxTabs}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

