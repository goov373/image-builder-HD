import { ToolPanel, Button, IconButton } from '../../ui';

/**
 * Product Image Tool Panel Component
 * Controls for editing product image layer (zoom and corner radius)
 *
 * @see ARCHITECTURE-CONTEXT.md for behavioral rules
 */
const ProductImageToolPanel = ({
  frame,
  frameWidth,
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
    <ToolPanel.Container width={frameWidth}>
      <ToolPanel.Row>
        {/* Zoom Stepper */}
        <ToolPanel.Stepper
          label="Zoom"
          displayValue={`${Math.round((productImageLayer.scale || 1) * 100)}%`}
          onDecrement={() => handleUpdate({ scale: Math.max(0.5, (productImageLayer.scale || 1) - 0.1) })}
          onIncrement={() => handleUpdate({ scale: Math.min(2, (productImageLayer.scale || 1) + 0.1) })}
          onReset={() => handleUpdate({ scale: 1 })}
        />

        {/* Corner Radius Stepper */}
        <ToolPanel.Stepper
          label="Corners"
          displayValue={`${productImageLayer.borderRadius ?? 8}px`}
          onDecrement={() => handleUpdate({ borderRadius: Math.max(0, (productImageLayer.borderRadius ?? 8) - 4) })}
          onIncrement={() => handleUpdate({ borderRadius: Math.min(48, (productImageLayer.borderRadius ?? 8) + 4) })}
          onReset={() => handleUpdate({ borderRadius: 8 })}
        />
      </ToolPanel.Row>

      <ToolPanel.Actions>
        <Button variant="ghost" size="sm" onClick={onCancel} title="Cancel and revert changes">
          Cancel
        </Button>
        <Button variant="secondary" size="sm" onClick={onDone} title="Done editing">
          Done
        </Button>
        <IconButton variant="danger" size="sm" onClick={onDelete} title="Remove product image">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </IconButton>
      </ToolPanel.Actions>
    </ToolPanel.Container>
  );
};

export default ProductImageToolPanel;
