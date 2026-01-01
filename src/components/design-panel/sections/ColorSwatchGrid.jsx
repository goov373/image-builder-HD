/**
 * ColorSwatchGrid Component
 * Reusable grid of clickable color/gradient swatches
 *
 * @example
 * <ColorSwatchGrid
 *   items={gradients}
 *   onSelect={handleGradientSelect}
 *   disabled={!hasFrameSelected}
 *   type="gradient"
 * />
 */

const ColorSwatchGrid = ({ items = [], onSelect, disabled = false, type = 'color', columns = 3 }) => {
  return (
    <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {items.map((item, idx) => (
        <div key={type === 'gradient' ? idx : item} className="relative group">
          <button
            type="button"
            onClick={() => onSelect?.(item)}
            disabled={disabled}
            className={`w-full aspect-square rounded-lg transition-colors overflow-hidden ${
              disabled
                ? 'ring-1 ring-gray-700/50 opacity-50 cursor-not-allowed'
                : 'ring-1 ring-gray-700 hover:ring-gray-400 hover:scale-105 cursor-pointer'
            }`}
            style={type === 'gradient' ? { background: item } : { backgroundColor: item }}
            title={disabled ? 'Select a frame first' : 'Click to apply'}
          />
          {/* Tooltip for solid colors */}
          {type === 'color' && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-gray-950 text-white text-[10px] font-mono rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {item.toUpperCase()}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-950" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ColorSwatchGrid;

