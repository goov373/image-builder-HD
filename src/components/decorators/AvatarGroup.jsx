/**
 * Avatar Group Decorator
 * Overlapping avatar circles showing team/users
 */
const AvatarGroup = ({
  count = 5,
  maxDisplay = 4,
  size = "md",
  colors = ['#6466e9', '#F97316', '#818cf8', '#8b5cf6', '#ec4899'],
  style = {},
  isSelected = false,
  onClick,
}) => {
  const sizes = {
    sm: { diameter: 24, overlap: -8, text: 'text-[9px]', plus: 16 },
    md: { diameter: 32, overlap: -10, text: 'text-[10px]', plus: 20 },
    lg: { diameter: 40, overlap: -12, text: 'text-xs', plus: 24 },
  };
  
  const s = sizes[size] || sizes.md;
  const displayCount = Math.min(count, maxDisplay);
  const remaining = count - displayCount;
  
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center
        ${isSelected ? 'ring-2 ring-gray-400 ring-offset-2 ring-offset-gray-900 rounded-full' : ''}
        cursor-pointer transition-all duration-150 hover:scale-105
      `}
      style={style}
    >
      {Array.from({ length: displayCount }).map((_, i) => (
        <div
          key={i}
          className="rounded-full flex items-center justify-center text-white font-semibold border-2 border-gray-900"
          style={{
            width: s.diameter,
            height: s.diameter,
            backgroundColor: colors[i % colors.length],
            marginLeft: i === 0 ? 0 : s.overlap,
            zIndex: displayCount - i,
          }}
        >
          <svg className="w-1/2 h-1/2 text-white/80" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      ))}
      
      {/* Remaining count badge */}
      {remaining > 0 && (
        <div
          className={`rounded-full flex items-center justify-center bg-gray-700 text-white font-semibold border-2 border-gray-900 ${s.text}`}
          style={{
            width: s.diameter,
            height: s.diameter,
            marginLeft: s.overlap,
            zIndex: 0,
          }}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;

