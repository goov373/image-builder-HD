import { forwardRef } from 'react';

/**
 * ToolbarDropdown Component
 * Reusable dropdown pattern for toolbar buttons
 */
const ToolbarDropdown = forwardRef(({
  label,
  value,
  isOpen,
  onToggle,
  disabled = false,
  children,
  className = '',
  minWidth = 'min-w-[160px]',
}, ref) => {
  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 border ${
          isOpen 
            ? 'bg-gray-700 border-gray-500' 
            : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700 hover:border-gray-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className="text-xs font-medium text-gray-300">{label}</span>
        {value && (
          <span className="text-[11px] text-gray-500">{value}</span>
        )}
        <ChevronIcon isOpen={isOpen} />
      </button>
      
      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 p-1.5 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-[200] ${minWidth}`}>
          {children}
        </div>
      )}
    </div>
  );
});

ToolbarDropdown.displayName = 'ToolbarDropdown';

/**
 * ToolbarDropdownItem Component
 * Individual item within a dropdown
 */
export const ToolbarDropdownItem = ({
  onClick,
  isSelected = false,
  children,
  icon,
  subtitle,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-all duration-200 ${
      isSelected 
        ? 'bg-gray-700 text-white' 
        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
    }`}
  >
    <div className="flex items-center gap-2.5">
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="font-medium">{children}</span>
    </div>
    {subtitle && <span className="text-gray-600">{subtitle}</span>}
  </button>
);

/**
 * ChevronIcon Component
 * Animated chevron for dropdowns
 */
export const ChevronIcon = ({ isOpen, className = '' }) => (
  <svg 
    className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${className}`} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

export default ToolbarDropdown;

