import { useState } from 'react';
import { patternCategories, findPatternById } from '../../data';

/**
 * PatternSwatch Component
 * Individual pattern preview chip
 */
const PatternSwatch = ({ pattern, onClick, disabled, isSelected }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 ${
      disabled 
        ? 'opacity-40 cursor-not-allowed' 
        : isSelected
          ? 'ring-2 ring-blue-400 scale-105'
          : 'hover:ring-2 hover:ring-gray-400 hover:scale-[1.02]'
    }`}
    title={pattern.name}
  >
    <div 
      className="absolute inset-0 bg-gray-800"
      style={{
        backgroundImage: `url("${pattern.svg}")`,
        backgroundSize: `${pattern.tileSize * pattern.defaultScale}px`,
        backgroundRepeat: 'repeat',
        opacity: 0.4, // Preview at higher opacity for visibility
      }}
    />
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1 py-1">
      <span className="text-[9px] text-white/90 truncate block">{pattern.name}</span>
    </div>
  </button>
);

/**
 * PatternControls Component
 * Controls for adjusting pattern properties
 */
const PatternControls = ({ 
  patternLayer, 
  onUpdate, 
  onRemove,
}) => {
  const pattern = findPatternById(patternLayer.patternId);
  
  return (
    <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-white font-medium">{pattern?.name || 'Pattern'}</span>
        <button
          type="button"
          onClick={onRemove}
          className="text-[10px] text-red-400 hover:text-red-300 transition-colors"
        >
          Remove
        </button>
      </div>
      
      {/* Scale */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-gray-400">Scale</span>
          <span className="text-[10px] text-gray-300">{Math.round(patternLayer.scale * 100)}%</span>
        </div>
        <input
          type="range"
          min="50"
          max="300"
          value={patternLayer.scale * 100}
          onChange={(e) => onUpdate({ scale: parseInt(e.target.value) / 100 })}
          className="w-full h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-gray-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:hover:bg-white"
        />
      </div>
      
      {/* Rotation */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-gray-400">Rotation</span>
          <span className="text-[10px] text-gray-300">{patternLayer.rotation}°</span>
        </div>
        <input
          type="range"
          min="0"
          max="360"
          step="15"
          value={patternLayer.rotation}
          onChange={(e) => onUpdate({ rotation: parseInt(e.target.value) })}
          className="w-full h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-gray-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:hover:bg-white"
        />
      </div>
      
      {/* Opacity */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-gray-400">Opacity</span>
          <span className="text-[10px] text-gray-300">{Math.round(patternLayer.opacity * 100)}%</span>
        </div>
        <input
          type="range"
          min="1"
          max="50"
          value={patternLayer.opacity * 100}
          onChange={(e) => onUpdate({ opacity: parseInt(e.target.value) / 100 })}
          className="w-full h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-gray-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:hover:bg-white"
        />
      </div>
      
      {/* Blend Mode */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-gray-400">Blend Mode</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {['normal', 'multiply', 'overlay', 'soft-light', 'screen'].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onUpdate({ blendMode: mode })}
              className={`px-2 py-1 rounded text-[9px] font-medium transition-colors ${
                patternLayer.blendMode === mode
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * PatternPicker Component
 * Main component for selecting and configuring patterns
 */
const PatternPicker = ({
  hasSelection,
  selectedPatternLayer,
  applyMode = 'frame',
  onApplyModeChange,
  onSelect,
  onUpdate,
  onRemove,
}) => {
  const [activeCategory, setActiveCategory] = useState('geometric');
  
  const currentCategory = patternCategories.find(c => c.id === activeCategory);
  
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Patterns</h4>
        {hasSelection && !selectedPatternLayer && (
          <span className="text-[10px] text-green-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Click to apply
          </span>
        )}
      </div>
      
      {/* Apply Mode Toggle */}
      {hasSelection && onApplyModeChange && (
        <div className="flex items-center gap-2 mb-3 p-2 bg-gray-800/50 rounded-lg">
          <span className="text-[10px] text-gray-400">Apply to:</span>
          <div className="flex rounded-md overflow-hidden border border-gray-700">
            <button
              type="button"
              onClick={() => onApplyModeChange('frame')}
              className={`px-3 py-1 text-[10px] font-medium transition-colors duration-150 ${
                applyMode === 'frame' 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Frame
            </button>
            <button
              type="button"
              onClick={() => onApplyModeChange('row')}
              className={`px-3 py-1 text-[10px] font-medium transition-colors duration-150 ${
                applyMode === 'row' 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Row (Stretch)
            </button>
          </div>
        </div>
      )}
      
      {/* Category Tabs */}
      <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
        {patternCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveCategory(category.id)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap transition-colors ${
              activeCategory === category.id
                ? 'bg-gray-700 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-300'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Pattern Grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {currentCategory?.patterns.map((pattern) => (
          <PatternSwatch
            key={pattern.id}
            pattern={pattern}
            onClick={() => onSelect(pattern.id)}
            disabled={!hasSelection}
            isSelected={selectedPatternLayer?.patternId === pattern.id}
          />
        ))}
      </div>
      
      {/* Pattern Controls (when pattern is applied) */}
      {selectedPatternLayer && (
        <PatternControls
          patternLayer={selectedPatternLayer}
          onUpdate={onUpdate}
          onRemove={onRemove}
        />
      )}
      
      {/* Empty state */}
      {!hasSelection && (
        <p className="text-[10px] text-gray-500 text-center py-2">
          Select a frame to apply patterns
        </p>
      )}
    </div>
  );
};

export default PatternPicker;

