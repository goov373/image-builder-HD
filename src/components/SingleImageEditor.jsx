import { useState } from 'react';
import MockupFrame from './MockupFrame';
import StyleEditor from './StyleEditor';
import { DataChip, StatCard, Tooltip, Sparkline, AvatarGroup, ProgressRing } from './decorators';
import { CANVAS_SIZES, DEFAULT_MOCKUP_STYLE } from '../types/singleImage';
import { MOCKUP_TEMPLATES, DECORATOR_PRESETS } from '../data/initialSingleImages';
import PatternLayer from './PatternLayer';

/**
 * Layer Item in sidebar
 */
const LayerItem = ({ layer, isSelected, onSelect, onToggleVisible, onToggleLocked }) => (
  <div 
    onClick={() => onSelect(layer.id)}
    className={`
      flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors
      ${isSelected ? 'bg-gray-700/50 border border-gray-500' : 'hover:bg-gray-800'}
    `}
  >
    {/* Layer icon */}
    <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] ${
      layer.type === 'mockup' ? 'bg-blue-500/20 text-blue-400' :
      layer.type === 'decorator' ? 'bg-green-500/20 text-green-400' :
      'bg-gray-700 text-gray-400'
    }`}>
      {layer.type === 'mockup' ? '□' : layer.type === 'decorator' ? '◆' : 'T'}
    </div>
    
    {/* Name */}
    <span className={`flex-1 text-xs truncate ${isSelected ? 'text-white' : 'text-gray-400'}`}>
      {layer.name}
    </span>
    
    {/* Controls */}
    <button 
      type="button"
      onClick={(e) => { e.stopPropagation(); onToggleVisible(layer.id); }}
      className={`w-5 h-5 flex items-center justify-center rounded ${layer.visible ? 'text-gray-400' : 'text-gray-600'}`}
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {layer.visible ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        )}
      </svg>
    </button>
  </div>
);

/**
 * Decorator Renderer
 */
const DecoratorRenderer = ({ layer, isSelected, onClick }) => {
  const props = {
    ...layer,
    isSelected,
    onClick,
    style: layer.decoratorStyle,
  };
  
  switch (layer.decoratorType) {
    case 'chip': return <DataChip {...props} />;
    case 'stat-card': return <StatCard {...props} />;
    case 'tooltip': return <Tooltip {...props} />;
    case 'sparkline': return <Sparkline {...props} />;
    case 'avatar-group': return <AvatarGroup {...props} />;
    case 'progress': return <ProgressRing {...props} />;
    default: return <DataChip {...props} />;
  }
};

/**
 * Single Image Editor Component
 * Main canvas editor for product mockup images
 */
const SingleImageEditor = ({
  singleImage,
  designSystem,
  isSelected,
  onSelect,
  onUpdateLayer,
  onAddLayer,
  onRemoveLayer,
  onReorderLayers,
}) => {
  const [selectedLayerId, setSelectedLayerId] = useState(null);
  const [zoom, setZoom] = useState(80);
  const [showStylePanel, setShowStylePanel] = useState(true);
  const [showLayersPanel, setShowLayersPanel] = useState(true);
  
  const selectedLayer = singleImage.layers.find(l => l.id === selectedLayerId);
  const canvasSize = CANVAS_SIZES[singleImage.canvasSize] || CANVAS_SIZES.hero;
  
  // Calculate preview scale
  const previewScale = zoom / 100;
  
  // Background style - use backgroundGradient CSS string if available
  const getBackgroundStyle = () => {
    // Direct gradient CSS string takes priority
    if (singleImage.backgroundGradient) {
      return { background: singleImage.backgroundGradient };
    }
    // Fall back to background object
    const bg = singleImage.background;
    if (bg.type === 'gradient' && bg.gradient) {
      return {
        background: `linear-gradient(${bg.gradient.angle}deg, ${bg.gradient.from}, ${bg.gradient.to})`,
      };
    }
    if (bg.type === 'solid') {
      return { backgroundColor: bg.color };
    }
    return { backgroundColor: '#18191A' };
  };
  
  const handleUpdateLayerStyle = (newStyle) => {
    if (selectedLayer) {
      onUpdateLayer?.(singleImage.id, selectedLayerId, { style: newStyle });
    }
  };
  
  const handleToggleVisible = (layerId) => {
    const layer = singleImage.layers.find(l => l.id === layerId);
    if (layer) {
      onUpdateLayer?.(singleImage.id, layerId, { visible: !layer.visible });
    }
  };
  
  return (
    <div 
      data-singleimage-id={singleImage.id}
      className={`mb-10 rounded-xl transition-all duration-150 ${
        isSelected 
          ? 'bg-blue-500/5 border border-blue-500/20' 
          : 'hover:bg-gray-800/30 border border-transparent'
      }`}
      onClick={(e) => { e.stopPropagation(); onSelect?.(singleImage.id); }}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); onSelect?.(isSelected ? null : singleImage.id); }} 
            className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all duration-150 ${
              isSelected 
                ? 'border-blue-500 bg-blue-500/10 hover:bg-blue-500/20' 
                : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800'
            }`}
          >
            {isSelected ? (
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
              </svg>
            )}
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-lg font-bold transition-colors ${isSelected ? 'text-blue-400' : 'text-white'}`}>
                {singleImage.name}
              </h2>
              {isSelected && (
                <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-medium">
                  EDITING
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400">{singleImage.subtitle} · {canvasSize.width}×{canvasSize.height}</p>
          </div>
        </div>
        
        {/* Zoom */}
        {isSelected && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Zoom</span>
            <input
              type="range"
              min={25}
              max={150}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-24 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
            <span className="text-xs text-gray-400 w-10">{zoom}%</span>
          </div>
        )}
      </div>
      
      {/* Main Editor Area */}
      <div className="flex">
        {/* Canvas */}
        <div className="flex-1 p-6 overflow-auto flex items-center justify-center min-h-[400px]">
          <div 
            className="relative overflow-hidden rounded-lg"
            style={{
              width: canvasSize.width * previewScale,
              height: canvasSize.height * previewScale,
              ...getBackgroundStyle(),
            }}
            onClick={(e) => { e.stopPropagation(); setSelectedLayerId(null); }}
          >
            {/* Pattern Layer - backmost layer */}
            {singleImage.patternLayer && (
              <PatternLayer
                patternLayer={singleImage.patternLayer}
                frameWidth={canvasSize.width * previewScale}
                frameHeight={canvasSize.height * previewScale}
              />
            )}
            
            {/* Layers */}
            {singleImage.layers
              .filter(l => l.visible)
              .sort((a, b) => a.zIndex - b.zIndex)
              .map(layer => (
                <div
                  key={layer.id}
                  className="absolute"
                  style={{
                    left: layer.transform.x * previewScale,
                    top: layer.transform.y * previewScale,
                    width: layer.transform.width * previewScale,
                    height: layer.transform.height * previewScale,
                    transform: `rotate(${layer.transform.rotation}deg)`,
                    opacity: layer.opacity,
                    zIndex: layer.zIndex,
                  }}
                  onClick={(e) => { e.stopPropagation(); setSelectedLayerId(layer.id); }}
                >
                  {layer.type === 'mockup' ? (
                    <MockupFrame
                      template={layer.template}
                      style={layer.style}
                      placeholderType={layer.placeholderType}
                      accentColor={designSystem?.primary || '#6466e9'}
                      isSelected={selectedLayerId === layer.id}
                    />
                  ) : layer.type === 'decorator' ? (
                    <DecoratorRenderer
                      layer={layer}
                      isSelected={selectedLayerId === layer.id}
                    />
                  ) : null}
                </div>
              ))}
          </div>
        </div>
        
        {/* Side Panel */}
        {isSelected && (
          <div className="w-64 border-l border-gray-800 p-4 overflow-y-auto max-h-[600px]">
            {/* Layers List */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-gray-300">Layers</h3>
                <button
                  type="button"
                  className="text-[10px] text-blue-400 hover:text-blue-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  + Add
                </button>
              </div>
              <div className="space-y-1">
                {singleImage.layers.map(layer => (
                  <LayerItem
                    key={layer.id}
                    layer={layer}
                    isSelected={selectedLayerId === layer.id}
                    onSelect={setSelectedLayerId}
                    onToggleVisible={handleToggleVisible}
                  />
                ))}
              </div>
            </div>
            
            {/* Style Editor (when mockup layer selected) */}
            {selectedLayer?.type === 'mockup' && (
              <div>
                <h3 className="text-xs font-semibold text-gray-300 mb-3">Frame Style</h3>
                <StyleEditor
                  style={selectedLayer.style}
                  onChange={handleUpdateLayerStyle}
                  accentColor={designSystem?.primary || '#0d9488'}
                />
              </div>
            )}
            
            {/* No selection message */}
            {!selectedLayer && (
              <div className="text-center py-8 text-gray-500 text-xs">
                Select a layer to edit its properties
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleImageEditor;

