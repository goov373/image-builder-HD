import { Button, IconButton } from '../../ui';

/**
 * Product Image Tool Panel Component
 * Controls for editing product image layer (zoom and corner radius)
 * 
 * @see ARCHITECTURE-CONTEXT.md for behavioral rules
 */
const ProductImageToolPanel = ({
  frame,
  carouselId,
  onUpdateProductImageLayer,
  onDelete,
  onCancel,
  onDone,
}) => {
  const productImageLayer = frame.productImageLayer || { scale: 1, borderRadius: 8 };

  const handleUpdate = (updates) => {
    onUpdateProductImageLayer?.(carouselId, frame.id, updates);
  };

  return (
    <div 
      className="mt-1.5 flex items-center gap-2 flex-wrap" 
      data-product-image-edit-controls
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Zoom Control */}
      <div className="flex items-center gap-1 bg-[--surface-raised] border border-[--border-default] rounded-[--radius-md] px-2 py-1.5">
        <span className="text-[--text-quaternary] text-[10px] mr-1 min-w-[40px]">Zoom</span>
        <button
          type="button"
          onClick={() => handleUpdate({ scale: Math.max(0.5, (productImageLayer.scale || 1) - 0.1) })}
          className="w-5 h-5 flex items-center justify-center text-[--text-tertiary] hover:text-[--text-primary] hover:bg-[--surface-overlay] rounded-[--radius-sm] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="text-[--text-secondary] text-[10px] font-medium min-w-[32px] text-center tabular-nums">
          {Math.round((productImageLayer.scale || 1) * 100)}%
        </span>
        <button
          type="button"
          onClick={() => handleUpdate({ scale: Math.min(2, (productImageLayer.scale || 1) + 0.1) })}
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

      {/* Corner Rounding Control */}
      <div className="flex items-center gap-1 bg-[--surface-raised] border border-[--border-default] rounded-[--radius-md] px-2 py-1.5">
        <span className="text-[--text-quaternary] text-[10px] mr-1 min-w-[40px]">Corners</span>
        <button
          type="button"
          onClick={() => handleUpdate({ borderRadius: Math.max(0, (productImageLayer.borderRadius ?? 8) - 4) })}
          className="w-5 h-5 flex items-center justify-center text-[--text-tertiary] hover:text-[--text-primary] hover:bg-[--surface-overlay] rounded-[--radius-sm] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="text-[--text-secondary] text-[10px] font-medium min-w-[32px] text-center tabular-nums">
          {productImageLayer.borderRadius ?? 8}px
        </span>
        <button
          type="button"
          onClick={() => handleUpdate({ borderRadius: Math.min(48, (productImageLayer.borderRadius ?? 8) + 4) })}
          className="w-5 h-5 flex items-center justify-center text-[--text-tertiary] hover:text-[--text-primary] hover:bg-[--surface-overlay] rounded-[--radius-sm] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleUpdate({ borderRadius: 8 })}
          className="w-5 h-5 flex items-center justify-center text-[--text-quaternary] hover:text-[--text-primary] hover:bg-[--surface-overlay] rounded-[--radius-sm] transition-colors"
          title="Reset corners to 8px"
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

      <IconButton variant="danger" size="sm" onClick={onDelete} title="Remove product image">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </IconButton>
    </div>
  );
};

export default ProductImageToolPanel;

