/**
 * DesignSectionHeader Component
 * Reusable section header for collapsible design panel sections
 *
 * @example
 * <DesignSectionHeader
 *   title="Backgrounds"
 *   count={gradients.length}
 *   isCollapsed={collapsedSections.backgrounds}
 *   onToggle={() => toggleSection('backgrounds')}
 *   statusText={applyMode === 'row' ? 'Apply to row' : 'Click to apply'}
 *   showStatus={hasRowSelected}
 * />
 */

const DesignSectionHeader = ({
  title,
  count,
  isCollapsed = true,
  onToggle,
  statusText = null,
  showStatus = false,
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
    >
      <div className="flex items-center gap-2">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">{title}</h3>
        {count !== undefined && (
          <span className="px-1.5 py-0.5 bg-gray-700 rounded text-[10px] text-gray-400">{count}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {showStatus && statusText && (
          <span className="text-[10px] text-green-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            {statusText}
          </span>
        )}
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </button>
  );
};

export default DesignSectionHeader;

