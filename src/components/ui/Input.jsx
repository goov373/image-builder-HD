/**
 * Input Component
 * Text and number input primitive
 *
 * @example
 * <Input placeholder="Enter name..." value={name} onChange={handleChange} />
 * <Input type="number" min={0} max={100} value={opacity} onChange={setOpacity} />
 */

const Input = ({ type = 'text', size = 'md', disabled = false, error = false, className = '', ...props }) => {
  const baseStyles = `
    w-full
    bg-[--surface-default] border border-[--border-default]
    text-[--text-primary] placeholder:text-[--text-quaternary]
    transition-all duration-[--duration-fast] ease-[--ease-default]
    focus:outline-none focus:border-[--border-emphasis] focus:bg-[--surface-raised]
  `;

  const sizes = {
    xs: 'px-2 py-1 text-[10px] rounded-[--radius-sm]',
    sm: 'px-2.5 py-1.5 text-[11px] rounded-[--radius-sm]',
    md: 'px-3 py-2 text-xs rounded-[--radius-md]',
    lg: 'px-4 py-2.5 text-sm rounded-[--radius-md]',
  };

  const disabledStyles = disabled ? 'opacity-40 cursor-not-allowed' : '';

  const errorStyles = error ? 'border-[--semantic-error] focus:border-[--semantic-error]' : '';

  return (
    <input
      type={type}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${sizes[size]}
        ${disabledStyles}
        ${errorStyles}
        ${className}
      `
        .replace(/\s+/g, ' ')
        .trim()}
      {...props}
    />
  );
};

/**
 * InputGroup Component
 * Container for input with label and optional error message
 */
export const InputGroup = ({ label, error, children, className = '' }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && <label className="text-[11px] font-medium text-[--text-secondary]">{label}</label>}
    {children}
    {error && <span className="text-[10px] text-[--semantic-error]">{error}</span>}
  </div>
);

export default Input;
