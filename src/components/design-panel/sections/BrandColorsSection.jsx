/**
 * BrandColorsSection Component
 * Displays brand color swatches with color picker inputs (collapsible)
 */
const BrandColorsSection = ({ designSystem, onUpdate, isCollapsed, onToggle, order }) => {
  const colorFields = [
    { key: 'primary', label: 'Primary' },
    { key: 'primary2', label: 'Primary 2' },
    { key: 'secondary', label: 'Secondary' },
    { key: 'accent', label: 'Accent' },
    { key: 'accent2', label: 'Accent 2' },
    { key: 'neutral1', label: 'Dark' },
    { key: 'neutral2', label: 'Mid Grey' },
    { key: 'neutral3', label: 'White' },
    { key: 'neutral4', label: 'Light Grey' },
  ];

  return (
    <div className="border-b border-[--border-default]" style={{ order }}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-[--surface-raised] transition-colors duration-[--duration-fast]"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-medium text-[--text-tertiary] uppercase tracking-wide">Brand Colors</h3>
          <span className="px-1.5 py-0.5 bg-[--surface-raised] rounded-[--radius-sm] text-[10px] text-[--text-tertiary]">
            {colorFields.length}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-[--text-quaternary] transition-transform duration-[--duration-fast] ${isCollapsed ? '' : 'rotate-180'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {!isCollapsed && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-3 gap-3">
            {colorFields.map((field) => (
              <div key={field.key} className="flex flex-col items-center gap-1.5">
                <div className="relative group">
                  <div className="w-12 h-12 rounded-[--radius-md] border border-[--border-emphasis] hover:border-[--border-strong] transition-colors overflow-hidden">
                    <input
                      type="color"
                      value={designSystem[field.key]}
                      onChange={(e) => onUpdate({ ...designSystem, [field.key]: e.target.value })}
                      className="w-14 h-14 -m-1 cursor-pointer"
                    />
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-[--surface-overlay] text-[--text-primary] text-[10px] font-mono rounded-[--radius-sm] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {designSystem[field.key].toUpperCase()}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[--surface-overlay]" />
                  </div>
                </div>
                <span className="text-[10px] text-[--text-tertiary] font-medium">{field.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandColorsSection;
