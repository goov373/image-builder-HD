/**
 * Chip Component
 * For swatches, grid items, toggles, and small interactive elements
 * 
 * @example
 * <Chip selected={isSelected} onClick={handleSelect}>
 *   <ColorSwatch color="#ff0000" />
 * </Chip>
 */

const Chip = ({
  selected = false,
  disabled = false,
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center
    border transition-all
    duration-[--duration-fast] ease-[--ease-default]
    cursor-pointer
    focus-visible:outline focus-visible:outline-2 
    focus-visible:outline-offset-2 focus-visible:outline-[--border-strong]
  `;

  const stateStyles = selected
    ? 'border-[--border-strong] bg-[--surface-overlay]'
    : 'border-[--border-muted] bg-[--surface-default] hover:border-[--border-emphasis] hover:bg-[--surface-raised]';

  const sizes = {
    sm: 'p-1 rounded-[--radius-sm]',
    md: 'p-1.5 rounded-[--radius-sm]',
    lg: 'p-2 rounded-[--radius-md]',
  };

  const disabledStyles = disabled
    ? 'opacity-40 cursor-not-allowed pointer-events-none'
    : '';

  return (
    <button
      type="button"
      disabled={disabled}
      className={`
        ${baseStyles}
        ${stateStyles}
        ${sizes[size]}
        ${disabledStyles}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * ChipGrid Component
 * Container for arranging chips in a grid
 */
export const ChipGrid = ({
  columns = 4,
  gap = 'gap-2',
  children,
  className = '',
}) => (
  <div 
    className={`grid ${gap} ${className}`}
    style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
  >
    {children}
  </div>
);

export default Chip;

