/**
 * Sidebar Component
 * Main navigation sidebar with panel buttons
 */

const Sidebar = ({
  activePanel,
  onPanelChange,
  isHomePage,
  onAccountClick,
  isAccountOpen,
  onCloseAccount,
  onShowShortcuts,
}) => {
  // Detect Mac vs Windows/Linux for shortcut display
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const cmdKey = isMac ? '⌘' : 'Ctrl';
  const panels = [
    {
      id: 'design',
      icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
      label: 'Design & Assets',
      shortcut: null, // No shortcut for design panel
    },
    {
      id: 'export',
      icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
      label: 'Export',
      shortcut: `${cmdKey}E`,
    },
  ];

  const handlePanelClick = (panelId) => {
    if (onCloseAccount) onCloseAccount();
    onPanelChange(activePanel === panelId ? null : panelId);
  };

  return (
    <div className="fixed left-0 top-[56px] h-[calc(100%-56px)] w-16 bg-[--surface-default] border-r border-[--border-default] flex flex-col items-center py-4 z-50">
      {/* Panel Buttons */}
      <div className="flex flex-col gap-3">
        {panels.map((panel) => (
          <button
            type="button"
            key={panel.id}
            onClick={() => handlePanelClick(panel.id)}
            className={`relative group w-11 h-11 rounded-[--radius-md] flex items-center justify-center transition-all duration-[--duration-fast] ${activePanel === panel.id ? 'bg-[--surface-overlay] text-[--text-primary]' : 'text-[--text-tertiary] hover:text-[--text-primary] hover:bg-[--surface-raised]'}`}
            title={panel.shortcut ? `${panel.label} (${panel.shortcut})` : panel.label}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={panel.icon} />
            </svg>
            {/* Keyboard shortcut badge - shows on hover */}
            {panel.shortcut && (
              <span className="absolute -right-1 -bottom-1 px-1 py-0.5 bg-[--surface-overlay] border border-[--border-default] rounded text-[8px] font-mono text-[--text-quaternary] opacity-0 group-hover:opacity-100 transition-opacity duration-[--duration-fast] pointer-events-none">
                {panel.shortcut}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bottom Section - Help and Profile */}
      <div className="mt-auto flex flex-col items-center gap-1.5 pb-2">
        {/* Help/Shortcuts Button */}
        <button
          type="button"
          onClick={onShowShortcuts}
          className="relative group w-8 h-8 rounded-[--radius-md] flex items-center justify-center text-[--text-quaternary] hover:text-[--text-primary] hover:bg-[--surface-raised] transition-colors duration-[--duration-fast] mb-2"
          title="Keyboard shortcuts (?)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {/* Shortcut badge */}
          <span className="absolute -right-1 -bottom-1 px-1 py-0.5 bg-[--surface-overlay] border border-[--border-default] rounded text-[8px] font-mono text-[--text-quaternary] opacity-0 group-hover:opacity-100 transition-opacity duration-[--duration-fast] pointer-events-none">
            ?
          </span>
        </button>

        {/* Profile Icon on Homepage */}
        {isHomePage && (
          <button
            type="button"
            onClick={onAccountClick}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-[--duration-fast] border ${isAccountOpen ? 'text-[--text-primary] bg-[--surface-overlay] border-[--border-emphasis]' : 'text-[--text-tertiary] hover:text-[--text-primary] hover:bg-[--surface-raised] border-[--border-default]'}`}
            title="Profile & Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
