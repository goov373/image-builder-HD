import { useState } from 'react';

/**
 * ColorDropdown Component
 * Brand color selector dropdown for tool panels
 *
 * @example
 * <ColorDropdown
 *   label="Fill"
 *   value={fillColor}
 *   onChange={setFillColor}
 *   colors={brandColors}
 *   allowNone
 * />
 */
const ColorDropdown = ({ label, value, onChange, colors, allowNone = false, noneLabel = 'None', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2 
          bg-[--surface-raised] hover:bg-[--surface-overlay]
          border border-[--border-default] hover:border-[--border-emphasis]
          rounded-[--radius-md] px-2.5 py-1.5 
          transition-all duration-[--duration-fast]
        "
      >
        <span className="text-[--text-tertiary] text-[10px]">{label}</span>
        <div className="flex items-center gap-1.5">
          {value ? (
            <div
              className="w-4 h-4 rounded-[--radius-sm] border border-[--border-emphasis]"
              style={{ backgroundColor: value }}
            />
          ) : (
            <div className="w-4 h-4 rounded-[--radius-sm] border border-[--border-emphasis] bg-[--surface-overlay] flex items-center justify-center">
              <svg
                className="w-2.5 h-2.5 text-[--text-quaternary]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
          <svg
            className={`w-3 h-3 text-[--text-quaternary] transition-transform duration-[--duration-fast] ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div
          className="
            absolute top-full left-0 mt-1 
            bg-[--surface-overlay] rounded-[--radius-lg] 
            shadow-xl border border-[--border-emphasis] 
            p-1.5 z-50
          "
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-wrap gap-1" style={{ width: '82px' }}>
            {allowNone && (
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setIsOpen(false);
                }}
                className={`
                  w-6 h-6 rounded-[--radius-sm] border-2 transition-all 
                  flex items-center justify-center
                  ${!value ? 'border-white scale-110' : 'border-[--border-muted] hover:border-[--border-emphasis]'}
                `}
                style={{ backgroundColor: 'var(--surface-raised)' }}
                title={noneLabel}
              >
                <svg className="w-3 h-3 text-[--text-quaternary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            {colors.map(({ name, color }) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  onChange(color);
                  setIsOpen(false);
                }}
                className={`
                  w-6 h-6 rounded-[--radius-sm] border-2 transition-all
                  ${
                    value === color
                      ? 'border-white scale-110'
                      : 'border-[--border-muted] hover:border-[--border-emphasis]'
                  }
                `}
                style={{ backgroundColor: color }}
                title={name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorDropdown;
