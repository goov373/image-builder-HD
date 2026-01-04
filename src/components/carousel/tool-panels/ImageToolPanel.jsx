import { ToolPanel, Button, IconButton } from '../../ui';

/**
 * Image Tool Panel Component
 * Controls for editing background photo layer
 *
 * @see ARCHITECTURE-CONTEXT.md for behavioral rules
 */
const ImageToolPanel = ({
  frame,
  frameWidth,
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
    <ToolPanel.Container width={frameWidth}>
      <ToolPanel.Row>
        {/* Zoom Stepper */}
        <ToolPanel.Stepper
          label="Zoom"
          displayValue={`${Math.round(imageLayer.scale * 100)}%`}
          onDecrement={() => handleUpdate({ scale: Math.max(0.5, imageLayer.scale - 0.1) })}
          onIncrement={() => handleUpdate({ scale: Math.min(5, imageLayer.scale + 0.1) })}
          onReset={() => handleUpdate({ scale: 1 })}
        />

        {/* Opacity Stepper */}
        <ToolPanel.Stepper
          label="Opacity"
          displayValue={`${Math.round(imageLayer.opacity * 100)}%`}
          onDecrement={() => handleUpdate({ opacity: Math.max(0, imageLayer.opacity - 0.1) })}
          onIncrement={() => handleUpdate({ opacity: Math.min(1, imageLayer.opacity + 0.1) })}
          onReset={() => handleUpdate({ opacity: 1 })}
        />
      </ToolPanel.Row>

      <ToolPanel.Actions>
        <Button variant="ghost" size="sm" onClick={onCancel} title="Cancel and revert changes">
          Cancel
        </Button>
        <Button variant="secondary" size="sm" onClick={onDone} title="Done editing">
          Done
        </Button>
        <IconButton variant="danger" size="sm" onClick={onRemove} title="Remove image">
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

export default ImageToolPanel;
