/**
 * Stat Card Decorator
 * Small floating stat cards with value, label, and trend
 */
const StatCard = ({
  value = "$12.4K",
  label = "Revenue",
  trend = "+12%",
  trendDirection = "up",
  variant = "dark",
  size = "md",
  style = {},
  isSelected = false,
  onClick,
}) => {
  const variants = {
    dark: { bg: '#2d2e30', border: 'rgba(255,255,255,0.1)', text: '#ffffff', label: '#9CA3AF' },
    light: { bg: '#ffffff', border: 'rgba(0,0,0,0.1)', text: '#18191A', label: '#6B7280' },
    glass: { bg: 'rgba(255,255,255,0.1)', border: 'rgba(255,255,255,0.2)', text: '#ffffff', label: '#9CA3AF' },
    gradient: { bg: 'linear-gradient(135deg, #6466e9 0%, #818cf8 100%)', border: 'transparent', text: '#ffffff', label: 'rgba(255,255,255,0.8)' },
  };
  
  const sizes = {
    sm: { width: 'w-28', padding: 'p-2.5', value: 'text-lg', label: 'text-[9px]', trend: 'text-[9px]' },
    md: { width: 'w-36', padding: 'p-3', value: 'text-xl', label: 'text-[10px]', trend: 'text-[10px]' },
    lg: { width: 'w-44', padding: 'p-4', value: 'text-2xl', label: 'text-xs', trend: 'text-xs' },
  };
  
  const v = variants[variant] || variants.dark;
  const s = sizes[size] || sizes.md;
  
  const isPositive = trendDirection === 'up' || trend.startsWith('+');
  
  return (
    <div
      onClick={onClick}
      className={`
        ${s.width} ${s.padding} rounded-xl
        ${isSelected ? 'ring-2 ring-orange-500' : ''}
        cursor-pointer transition-all duration-150 hover:scale-105
      `}
      style={{
        background: style.backgroundColor || v.bg,
        border: `1px solid ${v.border}`,
        boxShadow: style.hasShadow !== false ? '0 8px 32px rgba(0,0,0,0.2)' : 'none',
        backdropFilter: variant === 'glass' ? 'blur(12px)' : 'none',
        ...style,
      }}
    >
      {/* Label */}
      <div 
        className={`${s.label} font-medium uppercase tracking-wide mb-1`}
        style={{ color: v.label }}
      >
        {label}
      </div>
      
      {/* Value Row */}
      <div className="flex items-end justify-between">
        <span 
          className={`${s.value} font-bold`}
          style={{ color: v.text }}
        >
          {value}
        </span>
        
        {/* Trend */}
        {trend && (
          <span 
            className={`${s.trend} font-semibold flex items-center`}
            style={{ color: isPositive ? '#10b981' : '#ef4444' }}
          >
            <svg 
              className="w-3 h-3 mr-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{ transform: isPositive ? 'none' : 'rotate(180deg)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;

