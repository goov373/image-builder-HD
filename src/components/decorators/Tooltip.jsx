/**
 * Tooltip / Callout Decorator
 * Pointing callout boxes for highlighting features
 */
const Tooltip = ({
  content = "New feature!",
  position = "top", // top, bottom, left, right
  variant = "dark",
  size = "md",
  hasArrow = true,
  style = {},
  isSelected = false,
  onClick,
}) => {
  const variants = {
    dark: { bg: '#1e293b', text: '#ffffff', border: 'rgba(255,255,255,0.1)' },
    light: { bg: '#ffffff', text: '#0f172a', border: 'rgba(0,0,0,0.1)' },
    primary: { bg: '#6466e9', text: '#ffffff', border: 'transparent' },
    warning: { bg: '#f59e0b', text: '#000000', border: 'transparent' },
  };
  
  const sizes = {
    sm: { padding: 'px-2 py-1', text: 'text-[10px]', arrow: 4 },
    md: { padding: 'px-3 py-1.5', text: 'text-xs', arrow: 6 },
    lg: { padding: 'px-4 py-2', text: 'text-sm', arrow: 8 },
  };
  
  const v = variants[variant] || variants.dark;
  const s = sizes[size] || sizes.md;
  
  const arrowStyles = {
    top: { bottom: -s.arrow, left: '50%', transform: 'translateX(-50%)', borderTop: `${s.arrow}px solid ${v.bg}`, borderLeft: `${s.arrow}px solid transparent`, borderRight: `${s.arrow}px solid transparent` },
    bottom: { top: -s.arrow, left: '50%', transform: 'translateX(-50%)', borderBottom: `${s.arrow}px solid ${v.bg}`, borderLeft: `${s.arrow}px solid transparent`, borderRight: `${s.arrow}px solid transparent` },
    left: { right: -s.arrow, top: '50%', transform: 'translateY(-50%)', borderLeft: `${s.arrow}px solid ${v.bg}`, borderTop: `${s.arrow}px solid transparent`, borderBottom: `${s.arrow}px solid transparent` },
    right: { left: -s.arrow, top: '50%', transform: 'translateY(-50%)', borderRight: `${s.arrow}px solid ${v.bg}`, borderTop: `${s.arrow}px solid transparent`, borderBottom: `${s.arrow}px solid transparent` },
  };
  
  return (
    <div
      onClick={onClick}
      className={`
        relative inline-block rounded-lg font-medium
        ${s.padding} ${s.text}
        ${isSelected ? 'ring-2 ring-orange-500' : ''}
        cursor-pointer transition-all duration-150 hover:scale-105
      `}
      style={{
        backgroundColor: style.backgroundColor || v.bg,
        color: style.textColor || v.text,
        border: `1px solid ${v.border}`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        ...style,
      }}
    >
      {content}
      
      {/* Arrow */}
      {hasArrow && (
        <div 
          className="absolute w-0 h-0"
          style={arrowStyles[position]}
        />
      )}
    </div>
  );
};

export default Tooltip;

