/**
 * Episode Number Badge Component
 * Display episode/part number on video thumbnails
 */
const EpisodeNumber = ({ 
  number = "Ep. 01", 
  backgroundColor = '#f97316',
  textColor = '#ffffff',
  position = 'top-left', // top-left, top-right, bottom-left, bottom-right
  size = 'medium', // small, medium, large
}) => {
  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
  };
  
  const sizeClasses = {
    small: 'text-[9px] px-1.5 py-0.5',
    medium: 'text-[11px] px-2 py-1',
    large: 'text-xs px-3 py-1.5',
  };
  
  return (
    <div 
      className={`absolute ${positionClasses[position]} z-10`}
    >
      <div 
        className={`${sizeClasses[size]} rounded-full font-bold`}
        style={{ 
          backgroundColor,
          color: textColor,
        }}
      >
        {number}
      </div>
    </div>
  );
};

export default EpisodeNumber;

