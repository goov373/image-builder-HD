/**
 * Progress Ring Decorator
 * Circular progress indicator
 */
const ProgressRing = ({
  value = 75,
  size = "md",
  color = "#0d9488",
  trackColor = "rgba(255,255,255,0.1)",
  showValue = true,
  style = {},
  isSelected = false,
  onClick,
}) => {
  const sizes = {
    sm: { diameter: 40, strokeWidth: 4, text: 'text-[10px]' },
    md: { diameter: 56, strokeWidth: 5, text: 'text-xs' },
    lg: { diameter: 72, strokeWidth: 6, text: 'text-sm' },
  };
  
  const s = sizes[size] || sizes.md;
  const radius = (s.diameter - s.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  
  return (
    <div
      onClick={onClick}
      className={`
        relative inline-flex items-center justify-center
        ${isSelected ? 'ring-2 ring-orange-500 rounded-full' : ''}
        cursor-pointer transition-all duration-150 hover:scale-105
      `}
      style={{ width: s.diameter, height: s.diameter, ...style }}
    >
      <svg width={s.diameter} height={s.diameter} className="-rotate-90">
        {/* Track */}
        <circle
          cx={s.diameter / 2}
          cy={s.diameter / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={s.strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={s.diameter / 2}
          cy={s.diameter / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={s.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      
      {/* Value */}
      {showValue && (
        <span 
          className={`absolute ${s.text} font-bold text-white`}
        >
          {value}%
        </span>
      )}
    </div>
  );
};

export default ProgressRing;

