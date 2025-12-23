/**
 * Play Button Overlay Component
 * Toggleable play button for video thumbnails
 */
const PlayButtonOverlay = ({ 
  isVisible = true, 
  accentColor = '#ffffff',
  size = 'medium', // small, medium, large
  style = 'filled', // filled, outline, glass
  onClick,
}) => {
  if (!isVisible) return null;
  
  const sizeClasses = {
    small: 'w-10 h-10',
    medium: 'w-14 h-14',
    large: 'w-20 h-20',
  };
  
  const iconSizes = {
    small: 'w-4 h-4 ml-0.5',
    medium: 'w-6 h-6 ml-0.5',
    large: 'w-8 h-8 ml-1',
  };
  
  const getStyles = () => {
    switch (style) {
      case 'outline':
        return {
          backgroundColor: 'transparent',
          border: `3px solid ${accentColor}`,
        };
      case 'glass':
        return {
          backgroundColor: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.3)',
        };
      default: // filled
        return {
          backgroundColor: 'rgba(255,255,255,0.95)',
        };
    }
  };
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-transform hover:scale-110`}
      style={getStyles()}
    >
      <svg 
        className={iconSizes[size]} 
        fill={style === 'filled' ? accentColor : '#ffffff'} 
        viewBox="0 0 24 24"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </button>
  );
};

export default PlayButtonOverlay;

