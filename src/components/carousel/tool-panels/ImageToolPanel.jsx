import { Button, IconButton } from '../../ui';

/**
 * Image Tool Panel Component
 * Controls for editing background photo layer
 * 
 * @see ARCHITECTURE-CONTEXT.md for behavioral rules
 */
const ImageToolPanel = ({
  frame,
  carouselId,
  onUpdateImageLayer,
  onRemove,
  onCancel,
  onDone,
}) => {
  const imageLayer = frame.imageLayer || { scale: 1, opacity: 1 };

  const handleUpdate = (updates) => {
    onUpdateImageLayer?.(carouselId, frame.id, updates);
  };

  return (
    <div 
      className="mt-1.5 flex items-center gap-2 flex-wrap" 
      data-image-edit-controls
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Zoom Controls */}
      <div className="flex items-center gap-1 bg-[--surface-raised] border border-[--border-default] rounded-[--radius-md] px-2 py-1.5">
        <span className="text-[--text-quaternary] text-[10px] mr-1 min-w-[40px]">Zoom</span>
        <button
          type="button"
          onClick={() => handleUpdate({ scale: Math.max(0.5, imageLayer.scale - 0.1) })}
          className="w-5 h-5 flex items-center justify-center text-[--text-tertiary] hover:text-[--text-primary] hover:bg-[--surface-overlay] rounded-[--radius-sm] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="text-[--text-secondary] text-[10px] font-medium min-w-[32px] text-center tabular-nums">
          {Math.round(imageLayer.scale * 100)}%
        </span>
        <button
          type="button"
          onClick={() => handleUpdate({ scale: Math.min(5, imageLayer.scale + 0.1) })}
          className="w-5 h-5 flex items-center justify-center text-[--text-tertiary] hover:text-[--text-primary] hover:bg-[--surface-overlay] rounded-[--radius-sm] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleUpdate({ scale: 1 })}
          className="w-5 h-5 flex items-center justify-center text-[--text-quaternary] hover:text-[--text-primary] hover:bg-[--surface-overlay] rounded-[--radius-sm] transition-colors"
          title="Reset zoom to 100%"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Opacity Control */}
      <div className="flex items-center gap-1 bg-[--surface-raised] border border-[--border-default] rounded-[--radius-md] px-2 py-1.5">
        <span className="text-[--text-quaternary] text-[10px] mr-1 min-w-[40px]">Opacity</span>
        <button
          type="button"
          onClick={() => handleUpdate({ opacity: Math.max(0, imageLayer.opacity - 0.1) })}
          className="w-5 h-5 flex items-center justify-center text-[--text-tertiary] hover:text-[--text-primary] hover:bg-[--surface-overlay] rounded-[--radius-sm] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="text-[--text-secondary] text-[10px] font-medium min-w-[32px] text-center tabular-nums">
          {Math.round(imageLayer.opacity * 100)}%
        </span>
        <button
          type="button"
          onClick={() => handleUpdate({ opacity: Math.min(1, imageLayer.opacity + 0.1) })}
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

      <Button variant="ghost" size="sm" onClick={onCancel} title="Cancel and revert changes">
        Cancel
      </Button>

      <Button variant="secondary" size="sm" onClick={onDone} title="Done editing">
        Done
      </Button>

      <IconButton variant="danger" size="sm" onClick={onRemove} title="Remove image">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </IconButton>
    </div>
  );
};

export default ImageToolPanel;

