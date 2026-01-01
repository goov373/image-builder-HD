import PropTypes from 'prop-types';

/**
 * Button Component
 * Universal button primitive with variants and sizes
 *
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>Save</Button>
 * <Button variant="ghost" size="sm" disabled>Cancel</Button>
 */

const Button = ({
  variant = 'secondary',
  size = 'md',
  disabled = false,
  active = false,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center font-medium
    border transition-all
    duration-[--duration-fast] ease-[--ease-default]
    focus-visible:outline focus-visible:outline-2 
    focus-visible:outline-offset-2 focus-visible:outline-[--border-strong]
  `;

  const variants = {
    primary: `
      bg-[--accent-brand] border-[--accent-brand]
      text-white
      hover:bg-[--accent-brand-hover] hover:border-[--accent-brand-hover]
      active:opacity-90
    `,
    secondary: `
      bg-[--surface-default] border-[--border-default]
      text-[--text-secondary]
      hover:bg-[--surface-raised] hover:border-[--border-emphasis] hover:text-[--text-primary]
      active:bg-[--surface-overlay]
    `,
    ghost: `
      bg-transparent border-transparent
      text-[--text-secondary]
      hover:bg-[--surface-raised] hover:text-[--text-primary]
      active:bg-[--surface-overlay]
    `,
    danger: `
      bg-[--surface-default] border-[--border-default]
      text-[--text-secondary]
      hover:bg-[--semantic-error] hover:border-[--semantic-error] hover:text-white
      active:opacity-90
    `,
  };

  const sizes = {
    xs: 'px-2 py-1 text-[10px] rounded-[--radius-sm]',
    sm: 'px-2.5 py-1.5 text-[11px] rounded-[--radius-md]',
    md: 'px-3 py-2 text-xs rounded-[--radius-md]',
    lg: 'px-4 py-2.5 text-sm rounded-[--radius-lg]',
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

Button.propTypes = {
  /** Button style variant */
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'danger']),
  /** Button size */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  /** Disabled state */
  disabled: PropTypes.bool,
  /** Active/pressed state */
  active: PropTypes.bool,
  /** Button content */
  children: PropTypes.node.isRequired,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Click handler */
  onClick: PropTypes.func,
};

export default Button;
