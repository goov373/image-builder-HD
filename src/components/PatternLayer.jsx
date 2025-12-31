import { findPatternById } from '../data';

/**
 * PatternLayer Component
 * Renders a pattern layer behind all other frame content
 * 
 * Features:
 * - Renders SVG patterns as tiled backgrounds
 * - Supports scale, rotation, opacity, and blend mode
 * - Can be stretched across multiple frames
 * - Sits at z-index -2 (behind gradients)
 */
const PatternLayer = ({
  patternLayer,
  frameWidth,
  frameHeight,
}) => {
  if (!patternLayer) return null;
  
  const pattern = findPatternById(patternLayer.patternId);
  if (!pattern) return null;
  
  const { scale, rotation, opacity, blendMode, color, isStretched, stretchSize, stretchPosition } = patternLayer;
  
  // Check if this is a static file pattern (starts with /) vs data URI
  const isStaticFile = pattern.svg.startsWith('/');
  
  // Calculate background size based on scale and tile size
  const tileSize = pattern.tileSize * scale;
  // Static file patterns use 'cover' sizing, data URI patterns tile
  const backgroundSize = isStretched 
    ? stretchSize 
    : (isStaticFile ? 'cover' : `${tileSize}px ${tileSize}px`);
  const backgroundPosition = isStretched ? stretchPosition : 'center';
  
  // Apply rotation via a wrapper transform if needed
  const hasRotation = rotation && rotation !== 0;
  
  // Create style object
  const patternStyle = {
    backgroundImage: `url("${pattern.svg}")`,
    backgroundSize,
    backgroundPosition,
    backgroundRepeat: isStaticFile ? 'no-repeat' : 'repeat',
    opacity,
    mixBlendMode: blendMode || 'normal',
    // If we have rotation, we need to scale up to cover corners
    ...(hasRotation && {
      transform: `rotate(${rotation}deg) scale(1.5)`,
      transformOrigin: 'center center',
    }),
  };
  
  // If color tint is applied, we use CSS filter to colorize
  // This is a simple approach - could use SVG filters for more control
  const colorStyle = color ? {
    filter: `opacity(1)`, // Placeholder for future color tinting
  } : {};
  
  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: -2, overflow: 'hidden' }}
    >
      <div
        className="absolute"
        style={{
          // Extend beyond frame to handle rotation
          top: hasRotation ? '-25%' : 0,
          left: hasRotation ? '-25%' : 0,
          width: hasRotation ? '150%' : '100%',
          height: hasRotation ? '150%' : '100%',
          ...patternStyle,
          ...colorStyle,
        }}
      />
    </div>
  );
};

export default PatternLayer;

