/**
 * IconButton Component
 * Square icon-only button for toolbars and actions
 *
 * @example
 * <IconButton size="md" onClick={handleClick} title="Delete">
 *   <TrashIcon />
 * </IconButton>
 */

const IconButton = ({
  size = 'md',
  variant = 'ghost',
  disabled = false,
  active = false,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center
    border transition-all
    duration-[--duration-fast] ease-[--ease-default]
    focus-visible:outline focus-visible:outline-2 
    focus-visible:outline-offset-2 focus-visible:outline-[--border-strong]
  `;

  const variants = {
    ghost: `
      bg-transparent border-transparent
      text-[--text-tertiary]
      hover:bg-[--surface-raised] hover:text-[--text-primary]
      active:bg-[--surface-overlay]
    `,
    subtle: `
      bg-[--surface-default] border-[--border-subtle]
      text-[--text-tertiary]
      hover:bg-[--surface-raised] hover:border-[--border-emphasis] hover:text-[--text-primary]
      active:bg-[--surface-overlay]
    `,
    danger: `
      bg-transparent border-transparent
      text-[--text-tertiary]
      hover:bg-[--semantic-error] hover:text-white
      active:opacity-90
    `,
  };

  const sizes = {
    xs: 'w-6 h-6 rounded-[--radius-sm]',
    sm: 'w-7 h-7 rounded-[--radius-sm]',
    md: 'w-8 h-8 rounded-[--radius-md]',
    lg: 'w-9 h-9 rounded-[--radius-md]',
    xl: 'w-10 h-10 rounded-[--radius-lg]',
  };

  const iconSizes = {
    xs: '[&>svg]:w-3 [&>svg]:h-3',
    sm: '[&>svg]:w-3.5 [&>svg]:h-3.5',
    md: '[&>svg]:w-4 [&>svg]:h-4',
    lg: '[&>svg]:w-5 [&>svg]:h-5',
    xl: '[&>svg]:w-6 [&>svg]:h-6',
  };

  const disabledStyles = disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : '';

  const activeStyles = active ? 'bg-[--surface-overlay] border-[--border-strong] text-[--text-primary]' : '';

  return (
    <button
      type="button"
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${iconSizes[size]}
        ${disabledStyles}
        ${activeStyles}
        ${className}
      `
        .replace(/\s+/g, ' ')
        .trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;
