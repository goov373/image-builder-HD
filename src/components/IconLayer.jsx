import { useState } from 'react';

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
  onToggleVisibility = null,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  if (!iconLayer) return null;
  
  const { path, scale = 1, color = '#ffffff', isHidden = false, borderColor = null, backgroundColor = null } = iconLayer;
  
  // Position: left-aligned, above text area (same as icon placeholder)
  const iconSize = 36 * scale;
  const horizontalPadding = frameWidth * 0.075;
  
  // If hidden, show a small indicator when frame is selected
  if (isHidden) {
    if (!isFrameSelected) return null;
    return (
      <div 
        className="absolute"
        style={{
          left: horizontalPadding,
          bottom: '52%',
          width: iconSize,
          height: iconSize,
          zIndex: 30,
        }}
      >
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleVisibility?.(); }}
          className="absolute -bottom-2 -left-2 flex items-center justify-center w-5 h-5 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
          title="Show icon"
        >
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>
    );
  }
  
  // Determine border style - user-defined border takes precedence over selection indicators
  const getBorderStyle = () => {
    if (borderColor) {
      return `2px solid ${borderColor}`;
    }
    if (isFrameSelected) {
      return '2px solid #f97316';
    }
    if (isRowSelected) {
      return '2px dashed rgba(249, 115, 22, 0.4)';
    }
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
        borderRadius: '8px',
        border: getBorderStyle(),
        backgroundColor: backgroundColor || 'transparent',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
      
      {/* Hide button - appears on hover when frame is selected, always bottom-left */}
      {isFrameSelected && (isHovered || isRowSelected) && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleVisibility?.(); }}
          className="absolute -bottom-2 -left-2 flex items-center justify-center w-5 h-5 bg-black/70 rounded-full hover:bg-black/90 transition-colors"
          title="Hide icon"
        >
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default IconLayer;

