/**
 * ToolbarButtonGroup Component
 * Groups related toolbar buttons with consistent styling
 */
const ToolbarButtonGroup = ({ children, disabled = false, className = '' }) => (
  <div
    className={`flex items-center gap-1.5 px-2 py-1.5 bg-[--surface-raised] border border-[--border-subtle] rounded-[--radius-md] transition-opacity duration-[--duration-fast] ${
      disabled ? 'opacity-40 pointer-events-none' : 'opacity-100'
    } ${className}`}
  >
    {children}
  </div>
);

/**
 * ToolbarButton Component
 * Individual toolbar button with consistent styling
 */
export const ToolbarButton = ({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children,
  size = 'normal', // 'small', 'normal', 'square'
  className = '',
}) => {
  const sizeClasses = {
    small: 'px-2 py-1.5 text-[11px]',
    normal: 'px-3 py-2 text-xs',
    square: 'w-9 h-9 flex items-center justify-center text-sm',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`rounded-[--radius-md] font-medium transition-all duration-[--duration-fast] border ${
        isActive
          ? 'bg-[--surface-overlay] border-[--border-strong] text-[--text-primary]'
          : 'bg-[--surface-default] border-[--border-default] text-[--text-tertiary] hover:bg-[--surface-raised] hover:border-[--border-emphasis] hover:text-[--text-secondary]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};

/**
 * ToolbarIconButton Component
 * Icon-only toolbar button
 */
export const ToolbarIconButton = ({ onClick, isActive = false, disabled = false, title, icon, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded-[--radius-md] border transition-all duration-[--duration-fast] ${
      isActive
        ? 'bg-[--surface-overlay] border-[--border-strong] text-[--text-primary]'
        : 'border-transparent hover:bg-[--surface-raised] hover:border-[--border-emphasis] text-[--text-quaternary] hover:text-[--text-secondary]'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
  >
    {icon}
  </button>
);

/**
 * ToolbarColorSwatch Component
 * Color preview button for color pickers
 */
export const ToolbarColorSwatch = ({ color, onClick, isOpen = false, title = 'Color' }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`flex items-center gap-1 p-2 rounded-[--radius-md] transition-all duration-[--duration-fast] border ${
      isOpen
        ? 'bg-[--surface-overlay] border-[--border-strong]'
        : 'bg-[--surface-default] border-[--border-default] hover:bg-[--surface-raised] hover:border-[--border-emphasis]'
    }`}
  >
    <div
      className="w-5 h-5 rounded-[--radius-sm] border border-[--border-emphasis]"
      style={{ backgroundColor: color }}
    />
  </button>
);

/**
 * ToolbarToggleGroup Component
 * Group of mutually exclusive toggle buttons
 */
export const ToolbarToggleGroup = ({ options, value, onChange, size = 'small' }) => (
  <div className="flex gap-1.5">
    {options.map((option) => (
      <ToolbarButton
        key={option.value}
        onClick={() => onChange(option.value)}
        isActive={value === option.value}
        size={size}
        title={option.title}
      >
        {option.icon || option.label}
      </ToolbarButton>
    ))}
  </div>
);

export default ToolbarButtonGroup;
