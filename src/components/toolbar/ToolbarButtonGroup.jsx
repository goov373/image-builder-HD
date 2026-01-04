/**
 * ToolbarButtonGroup Component
 * Groups related toolbar buttons with consistent styling
 * 
 * Design: Minimalist black containers with subtle borders that appear on hover
 */
const ToolbarButtonGroup = ({ children, disabled = false, className = '' }) => (
  <div
    className={`flex items-center gap-1.5 px-2.5 py-1.5 bg-transparent border border-[--border-subtle] rounded-[--radius-lg] transition-all duration-[--duration-fast] hover:border-[--border-default] ${
      disabled ? 'opacity-40 pointer-events-none' : 'opacity-100'
    } ${className}`}
  >
    {children}
  </div>
);

/**
 * ToolbarButton Component
 * Individual toolbar button with consistent minimalist styling
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
    small: 'px-1.5 py-1 text-[11px]',
    normal: 'px-2 py-1 text-xs',
    square: 'w-7 h-7 flex items-center justify-center text-sm',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`rounded-[--radius-sm] font-medium transition-all duration-[--duration-fast] ${
        isActive
          ? 'bg-[--surface-overlay] text-[--text-primary]'
          : 'bg-transparent text-[--text-tertiary] hover:bg-[--surface-raised] hover:text-[--text-secondary]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};

/**
 * ToolbarIconButton Component
 * Icon-only toolbar button with minimalist styling
 */
export const ToolbarIconButton = ({ onClick, isActive = false, disabled = false, title, icon, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-1.5 rounded-[--radius-sm] transition-all duration-[--duration-fast] ${
      isActive
        ? 'bg-[--surface-overlay] text-[--text-primary]'
        : 'bg-transparent text-[--text-quaternary] hover:bg-[--surface-raised] hover:text-[--text-secondary]'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
  >
    {icon}
  </button>
);

/**
 * ToolbarColorSwatch Component
 * Color preview button for color pickers with minimalist styling
 */
export const ToolbarColorSwatch = ({ color, onClick, isOpen = false, title = 'Color' }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`flex items-center gap-1 p-1.5 rounded-[--radius-sm] transition-all duration-[--duration-fast] ${
      isOpen
        ? 'bg-[--surface-overlay]'
        : 'bg-transparent hover:bg-[--surface-raised]'
    }`}
  >
    <div
      className="w-5 h-5 rounded-[--radius-sm] border border-[--border-default]"
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
