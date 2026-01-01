import React from 'react';

export default function TabBar({
  tabs,
  activeTabId,
  currentView,
  showNewTabMenu,
  setShowNewTabMenu,
  newTabMenuRef,
  closeAllDropdowns,
  onOpenProject,
  onCloseTab,
  onAddTab,
  maxTabs = 10,
  sidebarOffset = 64,
  projects = [],
}) {
  // Get projects that aren't already open as tabs
  const openTabIds = tabs.map((t) => t.id);
  const availableProjects = projects.filter((p) => !openTabIds.includes(p.id));
  return (
    <div
      className="fixed top-0 right-0 z-[110] border-b border-gray-800"
      style={{ height: 56, left: sidebarOffset, backgroundColor: '#0d1321', transition: 'left 0.3s ease-out' }}
    >
      <div className="flex items-end h-full pl-5">
        {/* Tabs */}
        <div className="flex items-end">
          {/* Ghost Tab - shown when no tabs are open, styled like a regular tab */}
          {tabs.length === 0 && (
            <div className="relative" ref={tabs.length === 0 ? newTabMenuRef : null}>
              <div
                onClick={() => {
                  const wasOpen = showNewTabMenu;
                  closeAllDropdowns();
                  if (!wasOpen) setShowNewTabMenu(true);
                }}
                className="group flex items-center gap-2 px-4 h-10 rounded-t-lg cursor-pointer transition-colors duration-150 bg-transparent text-gray-500 hover:text-gray-300 border-b-2 border-dashed border-gray-600 hover:border-gray-500"
                style={{ minWidth: 140, maxWidth: 220 }}
              >
                <svg
                  className="w-4 h-4 flex-shrink-0 text-gray-600 group-hover:text-gray-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm truncate">Open Project</span>
              </div>

              {/* Dropdown Menu for Ghost Tab */}
              {showNewTabMenu && (
                <div className="absolute top-full left-0 mt-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200] min-w-[200px]">
                  {/* New Project Option */}
                  <button
                    onClick={() => {
                      onAddTab();
                      setShowNewTabMenu(false);
                    }}
                    className="group w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-700 border border-dashed border-gray-500 group-hover:bg-gray-600 group-hover:border-solid group-hover:border-gray-400 flex items-center justify-center transition-all">
                      <svg
                        className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-white">New Project</div>
                      <div className="text-xs text-gray-500">Start from scratch</div>
                    </div>
                  </button>

                  {/* Divider */}
                  {availableProjects.filter((p) => p.hasContent).length > 0 && (
                    <div className="my-1.5 border-t border-gray-700" />
                  )}

                  {/* Existing Projects */}
                  {availableProjects.filter((p) => p.hasContent).length > 0 && (
                    <>
                      <div className="px-3 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Open Existing
                      </div>

                      {availableProjects
                        .filter((p) => p.hasContent)
                        .map((project) => (
                          <button
                            key={project.id}
                            onClick={() => {
                              onOpenProject(project.id);
                              setShowNewTabMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                              <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-white truncate">{project.name}</div>
                              <div className="text-xs text-gray-500 truncate">{project.projectType || 'carousel'}</div>
                            </div>
                          </button>
                        ))}
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {tabs.map((tab, index) => {
            const isTabActive = tab.id === activeTabId && currentView !== 'home';
            return (
              <div key={tab.id} className="flex items-end">
                {/* Vertical separator - show before inactive tabs (except first) */}
                {index > 0 && !isTabActive && !(tabs[index - 1]?.id === activeTabId && currentView !== 'home') && (
                  <div className="w-px h-5 bg-gray-700 self-center" />
                )}
                <div
                  onClick={() => onOpenProject(tab.id)}
                  className={`group flex items-center gap-2 px-4 h-10 rounded-t-lg cursor-pointer transition-colors duration-150 ${
                    isTabActive ? 'bg-gray-800 text-white' : 'bg-transparent text-gray-500 hover:text-gray-300'
                  }`}
                  style={{ minWidth: 140, maxWidth: 220 }}
                >
                  <svg
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${isTabActive ? 'text-gray-400' : 'text-gray-600'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
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

          {/* Add Tab Button with Dropdown - hidden when no tabs (ghost tab handles it) */}
          <div ref={newTabMenuRef} className={`relative mb-1 ml-2 ${tabs.length === 0 ? 'hidden' : ''}`}>
            <button
              onClick={() => {
                const wasOpen = showNewTabMenu;
                closeAllDropdowns();
                if (!wasOpen && tabs.length < maxTabs) setShowNewTabMenu(true);
              }}
              disabled={tabs.length >= maxTabs}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                tabs.length >= maxTabs
                  ? 'text-gray-600 cursor-not-allowed'
                  : showNewTabMenu
                    ? 'text-white bg-gray-800'
                    : 'text-gray-500 hover:text-white hover:bg-gray-800'
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
                  onClick={() => {
                    onAddTab();
                    setShowNewTabMenu(false);
                  }}
                  className="group w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-700 border border-dashed border-gray-500 group-hover:bg-gray-600 group-hover:border-solid group-hover:border-gray-400 flex items-center justify-center transition-all">
                    <svg
                      className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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
                {availableProjects.length > 0 && (
                  <>
                    <div className="px-3 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Open Existing
                    </div>

                    {/* List of existing projects */}
                    {availableProjects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => {
                          onOpenProject(project.id);
                          setShowNewTabMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors text-gray-300 hover:bg-gray-700"
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${project.hasContent ? 'bg-gray-700' : 'bg-gray-800 border border-gray-700'}`}
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{project.name}</div>
                          <div className="text-xs text-gray-500">
                            {project.hasContent ? `${project.frameCount || 5} frames` : 'Empty'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tab Counter - hidden when no tabs */}
        {tabs.length > 0 && (
          <div className="flex items-center px-4 pb-2 ml-auto">
            <span className="text-xs text-gray-500">
              <span className={tabs.length >= maxTabs ? 'text-red-400' : 'text-gray-400'}>{tabs.length}</span>
              <span className="mx-0.5">/</span>
              <span>{maxTabs}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
