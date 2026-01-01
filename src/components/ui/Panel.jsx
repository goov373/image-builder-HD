import React from 'react';

/**
 * Panel Component
 * Reusable sliding panel for sidebars and drawers
 *
 * @example
 * <Panel
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   title="Settings"
 *   position="left"
 *   width="w-72"
 * >
 *   <PanelSection title="General">
 *     ...content...
 *   </PanelSection>
 * </Panel>
 */

/**
 * Main Panel Container
 */
const Panel = ({
  isOpen,
  onClose,
  title,
  subtitle,
  position = 'left', // 'left' | 'right'
  width = 'w-72',
  top = 56, // Offset from top (header height)
  offsetLeft = 0, // Additional left offset (sidebar width)
  children,
  footer,
  className = '',
}) => {
  const isLeft = position === 'left';
  // Translate class kept for reference - uses direct positioning instead
  const _translateClass = isOpen ? 'translate-x-0' : isLeft ? '-translate-x-full' : 'translate-x-full';

  const positionStyle = isLeft ? { left: isOpen ? offsetLeft : -288 + offsetLeft } : { right: 0 };

  return (
    <div
      className={`fixed h-[calc(100%-${top}px)] ${width} bg-[--surface-default] border-r border-t border-[--border-default] z-40 flex flex-col ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      } ${className}`}
      style={{
        top,
        transition: 'left 0.3s ease-out, right 0.3s ease-out',
        ...positionStyle,
      }}
    >
      {/* Header */}
      {(title || onClose) && <PanelHeader title={title} subtitle={subtitle} onClose={onClose} />}

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">{children}</div>

      {/* Footer */}
      {footer && <div className="flex-shrink-0 border-t border-[--border-default] p-4">{footer}</div>}
    </div>
  );
};

/**
 * Panel Header
 */
export const PanelHeader = ({ title, subtitle, onClose, actions, height = 64 }) => (
  <div
    className="flex-shrink-0 px-4 border-b border-[--border-default] flex items-center justify-between"
    style={{ height }}
  >
    <div>
      <h2 className="text-sm font-semibold text-[--text-primary]">{title}</h2>
      {subtitle && <p className="text-[10px] text-[--text-quaternary] mt-0.5">{subtitle}</p>}
    </div>
    <div className="flex items-center gap-2">
      {actions}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-[--text-tertiary] hover:text-[--text-primary] transition-colors duration-[--duration-fast] p-1 rounded-[--radius-sm] hover:bg-[--surface-raised]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  </div>
);

/**
 * Panel Section
 * Divides content within a panel
 */
export const PanelSection = ({
  title,
  subtitle,
  children,
  collapsible = false,
  defaultOpen = true,
  actions,
  noPadding = false,
  noBorder = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className={`${noBorder ? '' : 'border-b border-[--border-default]'}`}>
      {/* Section Header */}
      {title && (
        <div
          className={`flex items-center justify-between ${noPadding ? 'px-0' : 'px-4'} py-3 ${
            collapsible ? 'cursor-pointer hover:bg-[--surface-raised]' : ''
          } transition-colors duration-[--duration-fast]`}
          onClick={collapsible ? () => setIsOpen(!isOpen) : undefined}
        >
          <div className="flex items-center gap-2">
            {collapsible && (
              <svg
                className={`w-3 h-3 text-[--text-quaternary] transition-transform duration-[--duration-fast] ${isOpen ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            <div>
              <h3 className="text-xs font-medium text-[--text-tertiary] uppercase tracking-wide">{title}</h3>
              {subtitle && <p className="text-[10px] text-[--text-quaternary] mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {/* Section Content */}
      {(!collapsible || isOpen) && <div className={noPadding ? '' : 'px-4 pb-4'}>{children}</div>}
    </div>
  );
};

/**
 * Panel Tabs
 * Tab navigation within a panel
 */
export const PanelTabs = ({ tabs, activeTab, onChange }) => (
  <div className="flex-shrink-0 flex border-b border-[--border-default]">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        type="button"
        onClick={() => onChange(tab.id)}
        className={`flex-1 py-3 text-xs font-medium transition-colors duration-[--duration-fast] ${
          activeTab === tab.id
            ? 'text-[--text-primary] border-b-2 border-[--border-strong]'
            : 'text-[--text-quaternary] hover:text-[--text-secondary]'
        }`}
      >
        {tab.label}
        {tab.badge !== undefined && (
          <span className="ml-1.5 px-1.5 py-0.5 bg-[--surface-raised] rounded-[--radius-sm] text-[10px]">
            {tab.badge}
          </span>
        )}
      </button>
    ))}
  </div>
);

/**
 * Panel Empty State
 * Placeholder when a section has no content
 */
export const PanelEmptyState = ({ icon, title, description, action }) => (
  <div className="text-center py-8">
    {icon && <div className="w-12 h-12 mx-auto mb-3 text-[--text-quaternary]">{icon}</div>}
    <p className="text-xs text-[--text-tertiary]">{title}</p>
    {description && <p className="text-[10px] text-[--text-quaternary] mt-1">{description}</p>}
    {action && <div className="mt-3">{action}</div>}
  </div>
);

export default Panel;
