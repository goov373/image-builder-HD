/**
 * Sidebar Component
 * Main navigation sidebar with panel buttons and zoom controls
 */
const Sidebar = ({ activePanel, onPanelChange, zoom, onZoomChange, isHomePage, onAccountClick, isAccountOpen, onCloseAccount }) => {
  const panels = [
    { id: 'design', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01', label: 'Design & Assets' },
    { id: 'export', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12', label: 'Export' },
  ];
  
  const handlePanelClick = (panelId) => {
    if (onCloseAccount) onCloseAccount();
    onPanelChange(activePanel === panelId ? null : panelId);
  };
  
  return (
    <div className="fixed left-0 top-[56px] h-[calc(100%-56px)] w-16 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-4 z-50">
      {/* Panel Buttons */}
      <div className="flex flex-col gap-3">
        {panels.map(panel => (
          <button
            type="button"
            key={panel.id}
            onClick={() => handlePanelClick(panel.id)}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${activePanel === panel.id ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
            title={panel.label}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={panel.icon} />
            </svg>
          </button>
        ))}
      </div>
          
      {/* Bottom Section - Zoom Controls or Profile Icon */}
      <div className="mt-auto flex flex-col items-center gap-1.5 pb-2">
        {isHomePage ? (
          /* Profile Icon on Homepage */
          <button 
            type="button"
            onClick={onAccountClick}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border ${isAccountOpen ? 'text-white bg-gray-700 border-gray-600' : 'text-gray-400 hover:text-white hover:bg-gray-700 border-gray-700'}`}
            title="Profile & Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        ) : (
          /* Zoom Controls in Editor */
          <>
            <button 
              type="button"
              onClick={() => onZoomChange(Math.min(250, zoom + 10))} 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              title="Zoom in"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <span className="text-[10px] font-mono font-medium text-gray-400">
              {zoom}%
            </span>
            <button 
              type="button"
              onClick={() => onZoomChange(Math.max(50, zoom - 10))} 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              title="Zoom out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <button 
              type="button"
              onClick={() => onZoomChange(100)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              title="Reset to 100%"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;


