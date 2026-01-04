import { forwardRef } from 'react';

/**
 * ToolbarDropdown Component
 * Reusable dropdown pattern for toolbar buttons
 */
const ToolbarDropdown = forwardRef(
  ({ label, value, isOpen, onToggle, disabled = false, children, className = '', minWidth = 'min-w-[160px]' }, ref) => {
    return (
      <div ref={ref} className={`relative ${className}`}>
        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          className={`flex items-center gap-2 px-2 py-1 rounded-[--radius-sm] transition-all duration-[--duration-fast] ${
            isOpen
              ? 'bg-[--surface-overlay] text-[--text-primary]'
              : 'bg-transparent text-[--text-secondary] hover:bg-[--surface-raised] hover:text-[--text-primary]'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="text-xs font-medium">{label}</span>
          {value && <span className="text-[11px] text-[--text-quaternary]">{value}</span>}
          <ChevronIcon isOpen={isOpen} />
        </button>

        {isOpen && (
          <div
            className={`absolute top-full left-0 mt-2 p-1.5 bg-[--surface-overlay] border border-[--border-emphasis] rounded-[--radius-lg] shadow-xl z-[200] ${minWidth}`}
          >
            {children}
          </div>
        )}
      </div>
    );
  }
);

ToolbarDropdown.displayName = 'ToolbarDropdown';

/**
 * ToolbarDropdownItem Component
 * Individual item within a dropdown
 */
export const ToolbarDropdownItem = ({ onClick, isSelected = false, children, icon, subtitle }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-2 rounded-[--radius-md] text-left text-xs transition-all duration-[--duration-fast] ${
      isSelected
        ? 'bg-[--surface-raised] text-[--text-primary]'
        : 'text-[--text-tertiary] hover:bg-[--surface-raised] hover:text-[--text-secondary]'
    }`}
  >
    <div className="flex items-center gap-2.5">
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="font-medium">{children}</span>
    </div>
    {subtitle && <span className="text-[--text-quaternary]">{subtitle}</span>}
  </button>
);

/**
 * ChevronIcon Component
 * Animated chevron for dropdowns
 */
export const ChevronIcon = ({ isOpen, className = '' }) => (
  <svg
    className={`w-3 h-3 text-[--text-quaternary] transition-transform duration-[--duration-fast] ${isOpen ? 'rotate-180' : ''} ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

export default ToolbarDropdown;
