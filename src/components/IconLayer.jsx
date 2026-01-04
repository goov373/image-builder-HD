/**
 * IconLayer Component
 * Renders a brand icon positioned above the text area
 */
const IconLayer = ({
  iconLayer,
  frameWidth,
  frameHeight: _frameHeight,
  isRowSelected: _isRowSelected = false,
  isFrameSelected = false,
  isSelected = false, // When this layer is actively selected (clicked)
  onClick,
}) => {
  if (!iconLayer) return null;

  const { path, scale = 1, color = '#ffffff', borderColor = null, backgroundColor = null } = iconLayer;

  // Position: left-aligned, above text area (same as icon placeholder)
  const iconSize = 36 * scale;
  const horizontalPadding = frameWidth * 0.075;

  // Determine border style - user-defined border takes precedence over selection indicators
  // Orange accent is used ONLY for editable content layers (per design spec)
  // When selected (clicked), show solid orange like text fields
  // When frame selected but not this layer, show dashed
  const getBorderStyle = () => {
    if (borderColor) {
      return `2px solid ${borderColor}`;
    }
    if (isSelected) {
      return '2px solid var(--accent-layer)'; // Solid when layer selected
    }
    if (isFrameSelected) {
      return '1px dashed var(--accent-layer-subtle)'; // Dashed when frame selected
    }
    // No border when only row is selected or nothing is selected
    return 'none';
  };

  const handleClick = (e) => {
    // Only open tool panel if frame is already selected
    // This enforces a two-step selection: first select frame, then select layer
    if (isFrameSelected) {
      e.stopPropagation();
      onClick?.();
    }
    // If frame not selected, let click bubble up to select the frame
  };

  return (
    <div
      className="absolute cursor-pointer"
      onClick={handleClick}
      style={{
        left: horizontalPadding,
        bottom: '52%', // Same position as icon placeholder
        width: iconSize,
        height: iconSize,
        zIndex: 30, // Above other layers
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px', // Match placeholder frame rounding
        border: getBorderStyle(),
        backgroundColor: backgroundColor || 'transparent',
      }}
    >
      <svg className="w-full h-full" fill="none" stroke={color} viewBox="0 0 24 24" style={{ padding: '4px' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
      </svg>
    </div>
  );
};

export default IconLayer;
