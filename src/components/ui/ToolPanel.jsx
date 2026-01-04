import PropTypes from 'prop-types';

/**
 * ToolPanel Component System
 * A modular, reusable component system for tool panels that appear below frames.
 * Provides consistent styling, responsive layout, and unified UX patterns.
 *
 * @example
 * <ToolPanel.Container width={frameWidth}>
 *   <ToolPanel.Row>
 *     <ToolPanel.SegmentedControl label="Type" options={types} value={type} onChange={setType} />
 *     <ToolPanel.Stepper label="Zoom" value={zoom} onIncrement={...} onDecrement={...} />
 *   </ToolPanel.Row>
 *   <ToolPanel.Actions>
 *     <Button variant="ghost" onClick={onCancel}>Cancel</Button>
 *     <Button variant="secondary" onClick={onDone}>Done</Button>
 *   </ToolPanel.Actions>
 * </ToolPanel.Container>
 */

/**
 * Container - The outer wrapper that creates the unified card appearance
 * Matches the width of the frame above and handles event propagation
 */
const Container = ({ width, children, className = '' }) => {
  return (
    <div
      className={`mt-2 bg-[--surface-raised] border border-[--border-default] rounded-[--radius-lg] p-3 flex flex-col gap-2 ${className}`}
      style={{ width: width ? `${width}px` : '100%', maxWidth: '100%' }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      data-tool-panel
    >
      {children}
    </div>
  );
};

Container.propTypes = {
  /** Width in pixels to match the frame above */
  width: PropTypes.number,
  /** Panel content */
  children: PropTypes.node,
  /** Additional CSS classes */
  className: PropTypes.string,
};

/**
 * Row - A flex row that wraps content when space is limited
 */
const Row = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      {children}
    </div>
  );
};

Row.propTypes = {
  /** Row content */
  children: PropTypes.node,
  /** Additional CSS classes */
  className: PropTypes.string,
};

/**
 * ControlGroup - A grouped set of related controls with a label
 */
const ControlGroup = ({ label, children, className = '' }) => {
  return (
    <div className={`flex items-center gap-1.5 bg-[--surface-raised] border border-[--border-default] rounded-[--radius-md] px-2.5 py-1.5 ${className}`}>
      {label && (
        <span className="text-[--text-tertiary] text-[10px] mr-0.5 shrink-0">{label}</span>
      )}
      {children}
    </div>
  );
};

ControlGroup.propTypes = {
  /** Label for the control group */
  label: PropTypes.string,
  /** Group content */
  children: PropTypes.node,
  /** Additional CSS classes */
  className: PropTypes.string,
};

/**
 * SegmentedControl - Toggle-style type selector
 */
const SegmentedControl = ({ label, options, value, onChange, className = '' }) => {
  return (
    <div className={`flex items-center gap-1 bg-[--surface-raised] border border-[--border-default] rounded-[--radius-md] px-2.5 py-1.5 ${className}`}>
      {label && (
        <span className="text-[--text-tertiary] text-[10px] mr-1 shrink-0">{label}</span>
      )}
      {options.map(({ key, label: optionLabel, icon }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`px-2 py-0.5 rounded-[--radius-sm] text-[10px] transition-colors flex items-center gap-1 ${
            value === key
              ? 'bg-[--surface-elevated] text-[--text-primary] shadow-sm'
              : 'text-[--text-tertiary] hover:text-[--text-primary] hover:bg-[--surface-overlay]'
          }`}
        >
          {icon}
          {optionLabel}
        </button>
      ))}
    </div>
  );
};

SegmentedControl.propTypes = {
  /** Label for the control */
  label: PropTypes.string,
  /** Array of options */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
    })
  ).isRequired,
  /** Currently selected value */
  value: PropTypes.string,
  /** Change handler */
  onChange: PropTypes.func.isRequired,
  /** Additional CSS classes */
  className: PropTypes.string,
};

/**
 * CycleControl - Compact toggle with left/right arrows to cycle through options
 * Shows only the current value with arrow buttons on either side
 */
const CycleControl = ({ label, options, value, onChange, className = '' }) => {
  const currentIndex = options.findIndex((opt) => opt.key === value);
  const currentOption = options[currentIndex] || options[0];

  const handlePrev = () => {
    const newIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
    onChange(options[newIndex].key);
  };

  const handleNext = () => {
    const newIndex = currentIndex >= options.length - 1 ? 0 : currentIndex + 1;
    onChange(options[newIndex].key);
  };

  return (
    <div className={`flex items-center gap-1 bg-[--surface-raised] border border-[--border-default] rounded-[--radius-md] px-2.5 py-1.5 ${className}`}>
      {label && (
        <span className="text-[--text-tertiary] text-[10px] mr-1 shrink-0">{label}</span>
      )}
      <button
        type="button"
        onClick={handlePrev}
        className="w-5 h-5 flex items-center justify-center text-[--text-tertiary] hover:text-[--text-primary] hover:bg-[--surface-overlay] rounded-[--radius-sm] transition-colors"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <span className="text-[--text-secondary] text-[10px] font-medium min-w-[44px] text-center">
        {currentOption?.label}
      </span>
      <button
        type="button"
        onClick={handleNext}
        className="w-5 h-5 flex items-center justify-center text-[--text-tertiary] hover:text-[--text-primary] hover:bg-[--surface-overlay] rounded-[--radius-sm] transition-colors"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

CycleControl.propTypes = {
  /** Label for the control */
  label: PropTypes.string,
  /** Array of options */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  /** Currently selected value (key) */
  value: PropTypes.string,
  /** Change handler */
  onChange: PropTypes.func.isRequired,
  /** Additional CSS classes */
  className: PropTypes.string,
};

/**
 * Stepper - Increment/decrement controls for numeric values
 */
const Stepper = ({
  label,
  value,
  displayValue,
  onDecrement,
  onIncrement,
  onReset,
  decrementIcon,
  incrementIcon,
  className = '',
}) => {
  const defaultDecrementIcon = (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
    </svg>
  );

  const defaultIncrementIcon = (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );

  const resetIcon = (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );

  return (
    <div className={`flex items-center gap-1 bg-[--surface-raised] border border-[--border-default] rounded-[--radius-md] px-2.5 py-1.5 ${className}`}>
      {label && (
        <span className="text-[--text-tertiary] text-[10px] mr-1 min-w-[40px] shrink-0">{label}</span>
      )}
      <button
        type="button"
        onClick={onDecrement}
        className="w-5 h-5 flex items-center justify-center text-[--text-tertiary] hover:text-[--text-primary] hover:bg-[--surface-overlay] rounded-[--radius-sm] transition-colors"
      >
        {decrementIcon || defaultDecrementIcon}
      </button>
      <span className="text-[--text-secondary] text-[10px] font-medium min-w-[32px] text-center tabular-nums">
        {displayValue !== undefined ? displayValue : value}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        className="w-5 h-5 flex items-center justify-center text-[--text-tertiary] hover:text-[--text-primary] hover:bg-[--surface-overlay] rounded-[--radius-sm] transition-colors"
      >
        {incrementIcon || defaultIncrementIcon}
      </button>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="w-5 h-5 flex items-center justify-center text-[--text-quaternary] hover:text-[--text-primary] hover:bg-[--surface-overlay] rounded-[--radius-sm] transition-colors"
          title="Reset to default"
        >
          {resetIcon}
        </button>
      )}
    </div>
  );
};

Stepper.propTypes = {
  /** Label for the stepper */
  label: PropTypes.string,
  /** Current value */
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** Formatted display value (optional, falls back to value) */
  displayValue: PropTypes.string,
  /** Decrement handler */
  onDecrement: PropTypes.func.isRequired,
  /** Increment handler */
  onIncrement: PropTypes.func.isRequired,
  /** Reset handler (optional, shows reset button if provided) */
  onReset: PropTypes.func,
  /** Custom decrement icon */
  decrementIcon: PropTypes.node,
  /** Custom increment icon */
  incrementIcon: PropTypes.node,
  /** Additional CSS classes */
  className: PropTypes.string,
};

/**
 * RotationStepper - Specialized stepper for rotation controls
 */
const RotationStepper = ({ label = 'Rotate', value, onRotateLeft, onRotateRight, onReset, className = '' }) => {
  const rotateLeftIcon = (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
      />
    </svg>
  );

  const rotateRightIcon = (
    <svg className="w-3.5 h-3.5 transform scale-x-[-1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
      />
    </svg>
  );

  return (
    <Stepper
      label={label}
      displayValue={`${value}°`}
      onDecrement={onRotateLeft}
      onIncrement={onRotateRight}
      onReset={onReset}
      decrementIcon={rotateLeftIcon}
      incrementIcon={rotateRightIcon}
      className={className}
    />
  );
};

RotationStepper.propTypes = {
  /** Label for the stepper */
  label: PropTypes.string,
  /** Current rotation value in degrees */
  value: PropTypes.number.isRequired,
  /** Rotate left (counter-clockwise) handler */
  onRotateLeft: PropTypes.func.isRequired,
  /** Rotate right (clockwise) handler */
  onRotateRight: PropTypes.func.isRequired,
  /** Reset handler */
  onReset: PropTypes.func,
  /** Additional CSS classes */
  className: PropTypes.string,
};

/**
 * Actions - Container for action buttons with consistent spacing
 */
const Actions = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {children}
    </div>
  );
};

Actions.propTypes = {
  /** Action buttons */
  children: PropTypes.node,
  /** Additional CSS classes */
  className: PropTypes.string,
};

/**
 * Divider - Visual separator between groups
 */
const Divider = ({ className = '' }) => {
  return <div className={`w-px h-4 bg-[--border-default]/50 ${className}`} />;
};

Divider.propTypes = {
  /** Additional CSS classes */
  className: PropTypes.string,
};

// Compose the ToolPanel object with all sub-components
const ToolPanel = {
  Container,
  Row,
  ControlGroup,
  SegmentedControl,
  CycleControl,
  Stepper,
  RotationStepper,
  Actions,
  Divider,
};

export default ToolPanel;

