/**
 * ToolbarButtonGroup Component
 * Groups related toolbar buttons with consistent styling
 */
const ToolbarButtonGroup = ({
  children,
  disabled = false,
  className = '',
}) => (
  <div 
    className={`flex items-center gap-1.5 px-2 py-1.5 bg-gray-800/60 rounded-xl transition-opacity duration-200 ${
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
      className={`rounded-lg font-medium transition-all duration-200 border ${
        isActive 
          ? 'bg-gray-700 border-gray-500 text-white' 
          : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-700 hover:border-gray-600 hover:text-gray-300'
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
export const ToolbarIconButton = ({
  onClick,
  isActive = false,
  disabled = false,
  title,
  icon,
  className = '',
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded-lg border transition-all duration-200 ${
      isActive
        ? 'bg-gray-700 border-gray-500 text-white'
        : 'border-transparent hover:bg-gray-700 hover:border-gray-600 text-gray-500 hover:text-gray-300'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
  >
    {icon}
  </button>
);

/**
 * ToolbarColorSwatch Component
 * Color preview button for color pickers
 */
export const ToolbarColorSwatch = ({
  color,
  onClick,
  isOpen = false,
  title = 'Color',
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`flex items-center gap-1 p-2 rounded-lg transition-all duration-200 border ${
      isOpen 
        ? 'bg-gray-700 border-gray-500' 
        : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700 hover:border-gray-600'
    }`}
  >
    <div 
      className="w-5 h-5 rounded border border-gray-500" 
      style={{ backgroundColor: color }} 
    />
  </button>
);

/**
 * ToolbarToggleGroup Component
 * Group of mutually exclusive toggle buttons
 */
export const ToolbarToggleGroup = ({
  options,
  value,
  onChange,
  size = 'small',
}) => (
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

