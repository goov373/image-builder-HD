/**
 * Badge Component
 * Counter chips and status indicators
 *
 * @example
 * <Badge>16</Badge>
 * <Badge variant="success">Active</Badge>
 */

const Badge = ({ variant = 'default', size = 'sm', children, className = '', ...props }) => {
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium
    rounded-[--radius-sm]
  `;

  const variants = {
    default: 'bg-[--surface-raised] text-[--text-tertiary]',
    muted: 'bg-[--surface-default] text-[--text-quaternary]',
    success: 'bg-[--semantic-success]/20 text-[--semantic-success]',
    warning: 'bg-[--semantic-warning]/20 text-[--semantic-warning]',
    error: 'bg-[--semantic-error]/20 text-[--semantic-error]',
    info: 'bg-[--semantic-info]/20 text-[--semantic-info]',
    brand: 'bg-[--accent-brand]/20 text-[--accent-brand]',
  };

  const sizes = {
    xs: 'px-1 py-0.5 text-[8px]',
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-1 text-[11px]',
  };

  return (
    <span
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `
        .replace(/\s+/g, ' ')
        .trim()}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
