import { brandIcons } from '../../../data';

/**
 * BrandIconsSection Component
 * Displays brand icons in a grid for selection
 */
const BrandIconsSection = ({
  isCollapsed,
  onToggle,
  hasFrameSelected,
  isCarousel,
  selectedCarouselId,
  selectedFrameId,
  onAddIconToFrame,
  order,
}) => {
  return (
    <div className="border-b border-[--border-default]" style={{ order }}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-[--surface-raised] transition-colors duration-[--duration-fast]"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-medium text-[--text-tertiary] uppercase tracking-wide">Add Icon</h3>
          <span className="px-1.5 py-0.5 bg-[--surface-raised] rounded-[--radius-sm] text-[10px] text-[--text-tertiary]">
            {brandIcons.length}
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
        <div className="px-4 pt-2 pb-4">
          <p className="text-[10px] text-[--text-quaternary] mb-3">
            HelloData brand icons • 2px stroke, rounded corners
          </p>

          {/* Icons Grid - 4 columns */}
          <div className="grid grid-cols-4 gap-2">
            {brandIcons.map((icon) => (
              <button
                key={icon.id}
                type="button"
                className={`group relative aspect-square rounded-[--radius-md] overflow-hidden bg-[--surface-raised] border border-[--border-default] hover:border-purple-500 hover:bg-[--surface-overlay] transition-all flex items-center justify-center ${hasFrameSelected ? 'cursor-pointer' : 'cursor-default opacity-60'}`}
                title={hasFrameSelected ? `Click to add ${icon.name} to frame` : `${icon.name} - Select a frame first`}
                disabled={!hasFrameSelected}
                onClick={() => {
                  if (isCarousel && hasFrameSelected && onAddIconToFrame) {
                    onAddIconToFrame(selectedCarouselId, selectedFrameId, icon.id, icon.path, icon.name);
                  }
                }}
              >
                <svg
                  className="w-6 h-6 text-[--text-tertiary] group-hover:text-[--text-primary] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon.path} />
                </svg>
                {/* Hover tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-[--surface-overlay] text-[--text-primary] text-[10px] font-medium rounded-[--radius-sm] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {icon.name}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[--surface-overlay]" />
                </div>
              </button>
            ))}
          </div>

          {!hasFrameSelected && (
            <p className="text-[9px] text-[--text-quaternary] mt-3 text-center">Select a frame to add icons</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BrandIconsSection;
