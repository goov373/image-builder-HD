import { Button, IconButton } from '../../ui';

/**
 * Pattern Tool Panel Component
 * Controls for editing pattern layer (opacity and rotation)
 * 
 * @see ARCHITECTURE-CONTEXT.md for behavioral rules
 */
const PatternToolPanel = ({
  frame,
  carouselId,
  onUpdatePatternLayer,
  onDelete,
  onCancel,
  onDone,
}) => {
  const patternLayer = frame.patternLayer || { opacity: 1, rotation: 0 };

  const handleUpdate = (updates) => {
    onUpdatePatternLayer?.(carouselId, frame.id, updates);
  };

  return (
    <div 
      className="mt-1.5 flex items-center gap-2 flex-wrap" 
      data-pattern-edit-controls
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Opacity Control */}
      <div className="flex items-center gap-1 bg-[--surface-raised] border border-[--border-default] rounded-[--radius-md] px-2 py-1.5">
        <span className="text-[--text-quaternary] text-[10px] mr-1 min-w-[40px]">Opacity</span>
        <button
          type="button"
          onClick={() => handleUpdate({ opacity: Math.max(0, (patternLayer.opacity ?? 1) - 0.1) })}
          className="w-5 h-5 flex items-center justify-center text-[--text-tertiary] hover:text-[--text-primary] hover:bg-[--surface-overlay] rounded-[--radius-sm] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="text-[--text-secondary] text-[10px] font-medium min-w-[32px] text-center tabular-nums">
          {Math.round((patternLayer.opacity ?? 1) * 100)}%
        </span>
        <button
          type="button"
          onClick={() => handleUpdate({ opacity: Math.min(1, (patternLayer.opacity ?? 1) + 0.1) })}
          className="w-5 h-5 flex items-center justify-center text-[--text-tertiary] hover:text-[--text-primary] hover:bg-[--surface-overlay] rounded-[--radius-sm] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleUpdate({ opacity: 1 })}
          className="w-5 h-5 flex items-center justify-center text-[--text-quaternary] hover:text-[--text-primary] hover:bg-[--surface-overlay] rounded-[--radius-sm] transition-colors"
          title="Reset opacity to 100%"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Rotation Control */}
      <div className="flex items-center gap-1 bg-[--surface-raised] border border-[--border-default] rounded-[--radius-md] px-2 py-1.5">
        <span className="text-[--text-quaternary] text-[10px] mr-1 min-w-[40px]">Rotate</span>
        <button
          type="button"
          onClick={() => handleUpdate({ rotation: ((patternLayer.rotation ?? 0) - 90 + 360) % 360 })}
          className="w-5 h-5 flex items-center justify-center text-[--text-tertiary] hover:text-[--text-primary] hover:bg-[--surface-overlay] rounded-[--radius-sm] transition-colors"
          title="Rotate -90°"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        <span className="text-[--text-secondary] text-[10px] font-medium min-w-[32px] text-center tabular-nums">
          {patternLayer.rotation ?? 0}°
        </span>
        <button
          type="button"
          onClick={() => handleUpdate({ rotation: ((patternLayer.rotation ?? 0) + 90) % 360 })}
          className="w-5 h-5 flex items-center justify-center text-[--text-tertiary] hover:text-[--text-primary] hover:bg-[--surface-overlay] rounded-[--radius-sm] transition-colors"
          title="Rotate +90°"
        >
          <svg className="w-3.5 h-3.5 transform scale-x-[-1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleUpdate({ rotation: 0 })}
          className="w-5 h-5 flex items-center justify-center text-[--text-quaternary] hover:text-[--text-primary] hover:bg-[--surface-overlay] rounded-[--radius-sm] transition-colors"
          title="Reset rotation to 0°"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <Button variant="ghost" size="sm" onClick={onCancel} title="Cancel and revert changes">
        Cancel
      </Button>

      <Button variant="secondary" size="sm" onClick={onDone} title="Done editing">
        Done
      </Button>

      <IconButton variant="danger" size="sm" onClick={onDelete} title="Remove pattern">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </IconButton>
    </div>
  );
};

export default PatternToolPanel;

