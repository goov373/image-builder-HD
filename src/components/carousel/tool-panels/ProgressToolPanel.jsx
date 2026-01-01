import { ColorDropdown, Button } from '../../ui';

/**
 * Progress Tool Panel Component
 * Controls for editing progress indicator properties
 * 
 * @see ARCHITECTURE-CONTEXT.md for behavioral rules
 */
const ProgressToolPanel = ({
  frame,
  carouselId,
  designSystem,
  onUpdateProgressIndicator,
  onCancel,
  onDone,
}) => {
  // Get current progress indicator settings (with defaults)
  const progressIndicator = frame.progressIndicator || { type: 'dots', color: '#ffffff', isHidden: false };
  
  // Brand colors array
  const brandColors = [
    { name: 'Primary', color: designSystem.primary },
    { name: 'Secondary', color: designSystem.secondary },
    { name: 'Accent', color: designSystem.accent },
    { name: 'Dark', color: designSystem.neutral1 },
    { name: 'Mid Grey', color: designSystem.neutral2 },
    { name: 'Light Grey', color: designSystem.neutral4 },
    { name: 'Primary 2', color: designSystem.primary2 },
    { name: 'Accent 2', color: designSystem.accent2 },
    { name: 'White', color: designSystem.neutral3 },
  ];

  const progressTypes = [
    { key: 'dots', label: 'Dots' },
    { key: 'arrows', label: 'Arrows' },
    { key: 'bar', label: 'Bar' },
  ];

  const handleUpdate = (updates) => {
    onUpdateProgressIndicator?.(carouselId, frame.id, updates);
  };

  return (
    <div 
      className="mt-1.5 flex flex-col gap-1.5" 
      data-progress-edit-controls
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Row 1: Type selector and Color dropdown */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Type Selector */}
        <div className="flex items-center gap-1 bg-[--surface-raised] border border-[--border-default] rounded-[--radius-md] px-2 py-1.5">
          <span className="text-[--text-tertiary] text-[10px] mr-1">Type</span>
          {progressTypes.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleUpdate({ type: key })}
              className={`px-2 py-0.5 rounded-[--radius-sm] text-[10px] transition-colors ${
                progressIndicator.type === key 
                  ? 'bg-[--surface-overlay] text-[--text-primary]' 
                  : 'text-[--text-tertiary] hover:text-[--text-primary] hover:bg-[--surface-overlay]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Color Dropdown */}
        <ColorDropdown
          label="Color"
          value={progressIndicator.color || '#ffffff'}
          onChange={(color) => handleUpdate({ color: color || '#ffffff' })}
          colors={brandColors}
        />

        {/* Hide/Show Toggle */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleUpdate({ isHidden: !progressIndicator.isHidden })}
          title={progressIndicator.isHidden ? 'Show indicator' : 'Hide indicator'}
          className="gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {progressIndicator.isHidden ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            )}
          </svg>
          {progressIndicator.isHidden ? 'Show' : 'Hide'}
        </Button>
      </div>

      {/* Row 2: Cancel and Done buttons */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel} title="Cancel and revert changes">
          Cancel
        </Button>

        <Button variant="secondary" size="sm" onClick={onDone} title="Done editing">
          Done
        </Button>
      </div>
    </div>
  );
};

export default ProgressToolPanel;

