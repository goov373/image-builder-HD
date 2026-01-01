import { ColorDropdown, Button, IconButton } from '../../ui';

/**
 * Icon Tool Panel Component
 * Controls for editing icon layer properties
 *
 * @see ARCHITECTURE-CONTEXT.md for behavioral rules
 */
const IconToolPanel = ({
  frame,
  carouselId,
  designSystem,
  onUpdateIconLayer,
  onRequestAddIcon,
  onDelete,
  onCancel,
  onDone,
}) => {
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

  const handleUpdate = (updates) => {
    onUpdateIconLayer?.(carouselId, frame.id, updates);
  };

  return (
    <div
      className="mt-1.5 flex flex-col gap-1.5"
      data-icon-edit-controls
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Row 1: Action buttons and color dropdowns */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Change Icon Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onRequestAddIcon?.()}
          title="Change icon"
          className="gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Change
        </Button>

        {/* Icon Color Dropdown */}
        <ColorDropdown
          label="Icon"
          value={frame.iconLayer.color}
          onChange={(color) => handleUpdate({ color: color || '#ffffff' })}
          colors={brandColors}
        />

        {/* Border Color Dropdown */}
        <ColorDropdown
          label="Border"
          value={frame.iconLayer.borderColor}
          onChange={(color) => handleUpdate({ borderColor: color })}
          colors={brandColors}
          allowNone
          noneLabel="None"
        />

        {/* Fill Color Dropdown */}
        <ColorDropdown
          label="Fill"
          value={frame.iconLayer.backgroundColor}
          onChange={(color) => handleUpdate({ backgroundColor: color })}
          colors={brandColors}
          allowNone
          noneLabel="None"
        />
      </div>

      {/* Row 2: Cancel, Done, Remove buttons */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel} title="Cancel and revert changes">
          Cancel
        </Button>

        <Button variant="secondary" size="sm" onClick={onDone} title="Done editing">
          Done
        </Button>

        <IconButton variant="danger" size="sm" onClick={onDelete} title="Remove icon">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </IconButton>
      </div>
    </div>
  );
};

export default IconToolPanel;
