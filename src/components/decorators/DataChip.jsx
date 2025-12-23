/**
 * Data Chip Decorator
 * Small pill-shaped stat displays (+23%, Live, New, etc.)
 */
const DataChip = ({
  content = "+23%",
  variant = "success",
  size = "md",
  icon,
  style = {},
  isSelected = false,
  onClick,
}) => {
  const variants = {
    success: { bg: '#059669', text: '#ffffff', glow: '#10b981' },
    danger: { bg: '#dc2626', text: '#ffffff', glow: '#ef4444' },
    warning: { bg: '#d97706', text: '#ffffff', glow: '#f59e0b' },
    primary: { bg: '#6466e9', text: '#ffffff', glow: '#818cf8' },
    secondary: { bg: '#6366f1', text: '#ffffff', glow: '#818cf8' },
    neutral: { bg: '#374151', text: '#ffffff', glow: '#6b7280' },
  };
  
  const sizes = {
    sm: { px: 'px-2', py: 'py-0.5', text: 'text-[10px]', height: 'h-5' },
    md: { px: 'px-3', py: 'py-1', text: 'text-xs', height: 'h-7' },
    lg: { px: 'px-4', py: 'py-1.5', text: 'text-sm', height: 'h-9' },
  };
  
  const icons = {
    'trending-up': (
      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    'radio': (
      <span className="w-2 h-2 rounded-full bg-current mr-1.5 animate-pulse" />
    ),
    'sparkles': (
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    'flask': (
      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    'crown': (
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    ),
  };
  
  const v = variants[variant] || variants.neutral;
  const s = sizes[size] || sizes.md;
  
  return (
    <div
      onClick={onClick}
      className={`
        inline-flex items-center justify-center font-semibold rounded-full
        ${s.px} ${s.py} ${s.text} ${s.height}
        ${isSelected ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-gray-900' : ''}
        cursor-pointer transition-all duration-150 hover:scale-105
      `}
      style={{
        backgroundColor: style.backgroundColor || v.bg,
        color: style.textColor || v.text,
        boxShadow: style.hasShadow 
          ? `0 4px 12px ${v.bg}40, ${style.hasGlow ? `0 0 20px ${style.glowColor || v.glow}60` : ''}`
          : 'none',
        ...style,
      }}
    >
      {icon && icons[icon]}
      {content}
    </div>
  );
};

export default DataChip;

