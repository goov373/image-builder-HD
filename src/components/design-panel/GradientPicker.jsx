/**
 * GradientPicker Component
 * Displays gradient and solid color swatches for background selection
 */
const GradientPicker = ({
  gradients,
  solidColors,
  onSelect,
  hasSelection,
  applyMode = 'frame',
  onApplyModeChange,
  stretchRange,
  onStretchRangeChange,
  totalFrames = 0,
}) => {
  // Calculate effective end for range display
  const effectiveEnd = stretchRange?.end !== null ? Math.min(stretchRange.end, totalFrames - 1) : totalFrames - 1;

  return (
    <div className="p-4 border-b border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-tertiary uppercase tracking-wide">Set Background</h3>
        {hasSelection ? (
          <span className="text-[10px] text-green-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            {applyMode === 'row' ? 'Apply to row' : 'Click to apply'}
          </span>
        ) : (
          <span className="text-[10px] text-quaternary">Select a frame first</span>
        )}
      </div>

      {/* Apply Mode Toggle */}
      {hasSelection && onApplyModeChange && <ApplyModeToggle mode={applyMode} onChange={onApplyModeChange} />}

      {/* Frame Range Selector */}
      {applyMode === 'row' && hasSelection && totalFrames > 1 && (
        <FrameRangeSlider
          start={stretchRange.start}
          end={effectiveEnd}
          total={totalFrames}
          onChange={onStretchRangeChange}
        />
      )}

      {/* Gradient Swatches */}
      <div className="mb-4">
        <p className="text-[10px] text-quaternary mb-2">Gradients</p>
        <div className="grid grid-cols-3 gap-2">
          {gradients.map((gradient, idx) => (
            <GradientSwatch key={idx} gradient={gradient} onClick={() => onSelect(gradient)} disabled={!hasSelection} />
          ))}
        </div>
      </div>

      {/* Solid Colors */}
      <div>
        <p className="text-[10px] text-quaternary mb-2">Solid Colors</p>
        <div className="grid grid-cols-6 gap-2">
          {solidColors.map((color, idx) => (
            <ColorSwatch key={idx} color={color} onClick={() => onSelect(color)} disabled={!hasSelection} />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * ApplyModeToggle - Toggle between Frame and Row (Stretch) modes
 */
const ApplyModeToggle = ({ mode, onChange }) => (
  <div className="flex items-center gap-2 mb-3 p-2 bg-surface-raised/50 rounded-lg">
    <span className="text-[10px] text-tertiary">Apply to:</span>
    <div className="flex rounded-md overflow-hidden border border-default">
      <button
        type="button"
        onClick={() => onChange('frame')}
        className={`px-3 py-1 text-[10px] font-medium transition-colors duration-150 ${
          mode === 'frame' ? 'bg-surface-overlay text-white' : 'bg-transparent text-tertiary hover:text-gray-300'
        }`}
      >
        Frame
      </button>
      <button
        type="button"
        onClick={() => onChange('row')}
        className={`px-3 py-1 text-[10px] font-medium transition-colors duration-150 ${
          mode === 'row' ? 'bg-surface-overlay text-white' : 'bg-transparent text-tertiary hover:text-gray-300'
        }`}
      >
        Row (Stretch)
      </button>
    </div>
  </div>
);

/**
 * FrameRangeSlider - Dual-handle slider for selecting frame range
 */
const FrameRangeSlider = ({ start, end, total, onChange }) => (
  <div className="mb-3 p-3 bg-surface-raised/50 rounded-lg">
    <div className="flex items-center justify-between mb-3">
      <span className="text-[10px] text-tertiary">Frame range:</span>
      <span className="text-[10px] text-white font-medium">
        {start + 1} – {end + 1}
      </span>
    </div>

    {/* Dual Range Slider */}
    <div className="relative h-6 mb-2">
      {/* Track background */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1.5 bg-surface-overlay rounded-full" />

      {/* Selected range highlight */}
      <div
        className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-gray-500 rounded-full"
        style={{
          left: `${(start / (total - 1)) * 100}%`,
          width: `${((end - start) / (total - 1)) * 100}%`,
        }}
      />

      {/* Start handle */}
      <input
        type="range"
        min={0}
        max={total - 1}
        value={start}
        onChange={(e) => {
          const newStart = parseInt(e.target.value);
          if (newStart < end) {
            onChange({ start: newStart, end });
          }
        }}
        className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab pointer-events-auto"
        style={{ zIndex: start > total - 2 ? 5 : 4 }}
      />

      {/* End handle */}
      <input
        type="range"
        min={0}
        max={total - 1}
        value={end}
        onChange={(e) => {
          const newEnd = parseInt(e.target.value);
          if (newEnd > start) {
            onChange({ start, end: newEnd });
          }
        }}
        className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab pointer-events-auto"
        style={{ zIndex: 3 }}
      />
    </div>

    {/* Frame markers */}
    <div className="flex justify-between px-1">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`text-[9px] ${i >= start && i <= end ? 'text-white font-medium' : 'text-gray-600'}`}>
          {i + 1}
        </span>
      ))}
    </div>
  </div>
);

/**
 * GradientSwatch - Individual gradient button
 */
const GradientSwatch = ({ gradient, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`w-full aspect-square rounded-lg transition-all duration-200 ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:ring-2 hover:ring-gray-400 hover:scale-105 cursor-pointer'
    }`}
    style={{ background: gradient }}
    title="Click to apply"
  />
);

/**
 * ColorSwatch - Individual solid color button
 */
const ColorSwatch = ({ color, onClick, disabled }) => {
  const isLight =
    color.toLowerCase() === '#ffffff' || color.toLowerCase() === '#eef1f9' || color.toLowerCase() === '#eef2ff';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full aspect-square rounded-lg transition-all duration-200 ${
        isLight ? 'ring-1 ring-gray-600' : ''
      } ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:ring-2 hover:ring-gray-400 hover:scale-105 cursor-pointer'
      }`}
      style={{ backgroundColor: color }}
      title={color}
    />
  );
};

export { ApplyModeToggle, FrameRangeSlider, GradientSwatch, ColorSwatch };
export default GradientPicker;
