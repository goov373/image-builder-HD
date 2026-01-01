/**
 * Slider Component
 * Range input for values like opacity, zoom, rotation
 * 
 * @example
 * <Slider value={opacity} onChange={setOpacity} min={0} max={100} />
 * <Slider value={zoom} onChange={setZoom} min={50} max={200} label="Zoom" suffix="%" />
 */

const Slider = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  suffix = '',
  showValue = true,
  disabled = false,
  className = '',
  ...props
}) => {
  const handleChange = (e) => {
    onChange?.(Number(e.target.value));
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && (
        <span className="text-[10px] text-[--text-tertiary] min-w-[40px]">
          {label}
        </span>
      )}
      <input
        type="range"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={`
          flex-1 h-1 appearance-none cursor-pointer
          bg-[--surface-overlay] rounded-full
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-3
          [&::-webkit-slider-thumb]:h-3
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-[--text-secondary]
          [&::-webkit-slider-thumb]:hover:bg-[--text-primary]
          [&::-webkit-slider-thumb]:transition-colors
          [&::-moz-range-thumb]:w-3
          [&::-moz-range-thumb]:h-3
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-[--text-secondary]
          [&::-moz-range-thumb]:border-none
          [&::-moz-range-thumb]:hover:bg-[--text-primary]
          ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        `.replace(/\s+/g, ' ').trim()}
        {...props}
      />
      {showValue && (
        <span className="text-[10px] text-[--text-tertiary] min-w-[32px] text-right tabular-nums">
          {value}{suffix}
        </span>
      )}
    </div>
  );
};

export default Slider;

