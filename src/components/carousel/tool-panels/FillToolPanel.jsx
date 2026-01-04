import { ToolPanel, Button, IconButton } from '../../ui';

/**
 * Fill Tool Panel Component
 * Controls for editing fill color layer (opacity and rotation)
 *
 * @see ARCHITECTURE-CONTEXT.md for behavioral rules
 */
const FillToolPanel = ({
  frame,
  frameWidth,
  carouselId,
  onUpdateFillLayer,
  onDelete,
  onCancel,
  onDone,
}) => {
  const fillOpacity = frame.fillOpacity ?? 1;
  const fillRotation = frame.fillRotation ?? 0;

  const handleUpdate = (updates) => {
    onUpdateFillLayer?.(carouselId, frame.id, updates);
  };

  return (
    <ToolPanel.Container width={frameWidth}>
      <ToolPanel.Row>
        {/* Opacity Stepper */}
        <ToolPanel.Stepper
          label="Opacity"
          displayValue={`${Math.round(fillOpacity * 100)}%`}
          onDecrement={() => handleUpdate({ fillOpacity: Math.max(0, fillOpacity - 0.1) })}
          onIncrement={() => handleUpdate({ fillOpacity: Math.min(1, fillOpacity + 0.1) })}
          onReset={() => handleUpdate({ fillOpacity: 1 })}
        />

        {/* Rotation Stepper */}
        <ToolPanel.RotationStepper
          label="Rotate"
          value={fillRotation}
          onRotateLeft={() => handleUpdate({ fillRotation: (fillRotation - 90 + 360) % 360 })}
          onRotateRight={() => handleUpdate({ fillRotation: (fillRotation + 90) % 360 })}
          onReset={() => handleUpdate({ fillRotation: 0 })}
        />
      </ToolPanel.Row>

      <ToolPanel.Actions>
        <Button variant="ghost" size="sm" onClick={onCancel} title="Cancel and revert changes">
          Cancel
        </Button>
        <Button variant="secondary" size="sm" onClick={onDone} title="Done editing">
          Done
        </Button>
        <IconButton variant="danger" size="sm" onClick={onDelete} title="Remove fill color">
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

export default FillToolPanel;
