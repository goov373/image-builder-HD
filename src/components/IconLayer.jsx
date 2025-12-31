/**
 * IconLayer Component
 * Renders a brand icon positioned above the text area
 */
const IconLayer = ({
  iconLayer,
  frameWidth,
  frameHeight,
  isRowSelected = false,
  isFrameSelected = false,
}) => {
  if (!iconLayer) return null;
  
  const { path, scale = 1, color = '#ffffff', borderColor = null, backgroundColor = null } = iconLayer;
  
  // Position: left-aligned, above text area (same as icon placeholder)
  const iconSize = 36 * scale;
  const horizontalPadding = frameWidth * 0.075;
  
  // Determine border style - user-defined border takes precedence over selection indicators
  // Only show selection-based borders when frame is selected, not just row
  const getBorderStyle = () => {
    if (borderColor) {
      return `2px solid ${borderColor}`;
    }
    if (isFrameSelected) {
      return '1px dashed rgba(249, 115, 22, 0.5)';
    }
    // No border when only row is selected or nothing is selected
    return 'none';
  };
  
  return (
    <div 
      className="absolute"
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
      <svg 
        className="w-full h-full"
        fill="none" 
        stroke={color}
        viewBox="0 0 24 24"
        style={{ padding: '4px' }}
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d={path} 
        />
      </svg>
    </div>
  );
};

export default IconLayer;
