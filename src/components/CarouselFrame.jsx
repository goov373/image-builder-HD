import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { frameSizes, getFontSizes, getFrameStyle } from '../data';
import { LayoutBottomStack, LayoutCenterDrama, LayoutEditorialLeft } from './Layouts';
import ImageLayer from './ImageLayer';
import PatternLayer from './PatternLayer';
import ProductImageLayer from './ProductImageLayer';
import IconLayer from './IconLayer';

/**
 * Progress Indicator Overlay
 * Shows current frame position in carousel with different styles
 */
const ProgressIndicatorOverlay = ({ 
  frameId, 
  totalFrames = 5,
  type = 'dots', // 'dots', 'arrows', 'bar'
  color = '#ffffff',
  isHidden = false,
}) => {
  if (isHidden) return null;
  
  // Dots style (original)
  if (type === 'dots') {
    return (
      <div className="flex items-center gap-1 min-w-[40px] min-h-[20px] justify-end">
        {[1,2,3,4,5].map(i => (
          <div 
            key={i} 
            className="w-1.5 h-1.5 rounded-full"
            style={{ 
              backgroundColor: i === frameId ? color : color,
              opacity: i === frameId ? 1 : 0.3 
            }} 
          />
        ))}
      </div>
    );
  }
  
  // Arrows style
  if (type === 'arrows') {
    return (
      <div className="flex items-center gap-2 min-w-[40px] min-h-[20px] justify-end">
        <svg className="w-4 h-4" fill="none" stroke={color} strokeOpacity={0.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-[10px] font-medium" style={{ color }}>{frameId}/{totalFrames}</span>
        <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    );
  }
  
  // Bar style (loading bar)
  if (type === 'bar') {
    const progress = (frameId / totalFrames) * 100;
    return (
      <div className="flex items-center min-w-[60px] min-h-[20px] justify-end">
        <div 
          className="w-16 h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: color, opacity: 0.2 }}
        >
          <div 
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, backgroundColor: color }}
          />
        </div>
      </div>
    );
  }
  
  // Map Pins style - pins along a curved GPS path
  if (type === 'mapPins') {
    return (
      <div className="flex items-center min-w-[64px] min-h-[20px] justify-end">
        <svg width="64" height="16" viewBox="0 0 64 16" fill="none">
          {/* Curved path */}
          <path 
            d="M4 12 Q16 4, 32 8 Q48 12, 60 6" 
            stroke={color} 
            strokeWidth="1.5" 
            strokeLinecap="round"
            strokeOpacity="0.25"
            fill="none"
          />
          {/* Pin markers */}
          {[1,2,3,4,5].map((i, idx) => {
            const positions = [
              { x: 4, y: 12 },
              { x: 19, y: 5.5 },
              { x: 32, y: 8 },
              { x: 45, y: 10 },
              { x: 60, y: 6 }
            ];
            const pos = positions[idx];
            const isActive = i === frameId;
            return (
              <g key={i}>
                <circle 
                  cx={pos.x} 
                  cy={pos.y - 3} 
                  r="2.5" 
                  fill={color}
                  fillOpacity={isActive ? 1 : 0.3}
                />
                <line 
                  x1={pos.x} 
                  y1={pos.y - 0.5} 
                  x2={pos.x} 
                  y2={pos.y + 2} 
                  stroke={color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeOpacity={isActive ? 1 : 0.3}
                />
              </g>
            );
          })}
        </svg>
      </div>
    );
  }
  
  // Forecast style - X marks on upward trend line
  if (type === 'forecast') {
    return (
      <div className="flex items-center min-w-[60px] min-h-[20px] justify-end">
        <svg width="60" height="16" viewBox="0 0 60 16" fill="none">
          {/* Trend line going up and to the right */}
          <path 
            d="M4 13 L16 10 L28 11 L40 7 L52 4" 
            stroke={color} 
            strokeWidth="1.5" 
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.25"
            fill="none"
          />
          {/* X markers at data points */}
          {[1,2,3,4,5].map((i, idx) => {
            const positions = [
              { x: 4, y: 13 },
              { x: 16, y: 10 },
              { x: 28, y: 11 },
              { x: 40, y: 7 },
              { x: 52, y: 4 }
            ];
            const pos = positions[idx];
            const isActive = i === frameId;
            const size = 2;
            return (
              <g key={i} opacity={isActive ? 1 : 0.3}>
                <line 
                  x1={pos.x - size} 
                  y1={pos.y - size} 
                  x2={pos.x + size} 
                  y2={pos.y + size} 
                  stroke={color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line 
                  x1={pos.x + size} 
                  y1={pos.y - size} 
                  x2={pos.x - size} 
                  y2={pos.y + size} 
                  stroke={color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </svg>
      </div>
    );
  }
  
  // Bar Chart style - mini vertical bars
  if (type === 'barChart') {
    return (
      <div className="flex items-center min-w-[48px] min-h-[20px] justify-end">
        <svg width="48" height="16" viewBox="0 0 48 16" fill="none">
          {[1,2,3,4,5].map((i, idx) => {
            const heights = [8, 12, 6, 14, 10]; // Varying heights for visual interest
            const height = heights[idx];
            const x = 4 + idx * 9;
            const isActive = i === frameId;
            return (
              <rect
                key={i}
                x={x}
                y={16 - height}
                width="5"
                height={height}
                rx="1"
                fill={color}
                fillOpacity={isActive ? 1 : 0.3}
              />
            );
          })}
        </svg>
      </div>
    );
  }
  
  return null;
};

/**
 * Color Dropdown Component
 * A dropdown selector for brand colors
 */
const ColorDropdown = ({ 
  label, 
  value, 
  onChange, 
  colors, 
  allowNone = false,
  noneLabel = 'None'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-800/90 hover:bg-gray-700/90 rounded-lg px-2.5 py-1.5 transition-colors"
      >
        <span className="text-gray-400 text-[10px]">{label}</span>
        <div className="flex items-center gap-1.5">
          {value ? (
            <div 
              className="w-4 h-4 rounded border border-gray-500"
              style={{ backgroundColor: value }}
            />
          ) : (
            <div className="w-4 h-4 rounded border border-gray-500 bg-gray-600 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
          <svg className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-1.5 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-wrap gap-1" style={{ width: '82px' }}>
            {allowNone && (
              <button
                type="button"
                onClick={() => { onChange(null); setIsOpen(false); }}
                className={`w-6 h-6 rounded border-2 transition-all flex items-center justify-center ${!value ? 'border-white scale-110' : 'border-gray-600 hover:border-gray-400'}`}
                style={{ backgroundColor: '#374151' }}
                title={noneLabel}
              >
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            {colors.map(({ name, color }) => (
              <button
                key={name}
                type="button"
                onClick={() => { onChange(color); setIsOpen(false); }}
                className={`w-6 h-6 rounded border-2 transition-all ${value === color ? 'border-white scale-110' : 'border-gray-600 hover:border-gray-400'}`}
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

/**
 * Icon Edit Panel Component
 * Controls for editing icon layer properties
 */
const IconEditPanel = ({
  frame,
  carouselId,
  designSystem,
  onUpdateIconLayer,
  onRequestAddIcon,
  handleDeleteIcon,
  handleCancelIconEdit,
  handleDoneIconEdit,
}) => {
  // Brand colors array
  const brandColors = [
    { name: 'Primary', color: designSystem.primary },
    { name: 'Secondary', color: designSystem.secondary },
    { name: 'Accent', color: designSystem.accent },
    { name: 'Dark', color: designSystem.neutral1 },
    { name: 'Mid Grey', color: designSystem.neutral2 },
    { name: 'Light Grey', color: designSystem.neutral4 },
    { name: 'Primary 2', color: designSystem.primary2 },
    { name: 'Accent 2', color: designSystem.accent2 },
    { name: 'White', color: designSystem.neutral3 },
  ];

  return (
    <div 
      className="mt-1.5 flex flex-col gap-1.5" 
      data-icon-edit-controls
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Row 1: Action buttons and color dropdowns */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Change Icon Button */}
        <button
          type="button"
          onClick={() => { onRequestAddIcon?.(); }}
          className="flex items-center gap-1.5 bg-gray-700/90 hover:bg-gray-600/90 rounded-lg px-2.5 py-1.5 text-gray-300 hover:text-white text-[10px] font-medium transition-colors"
          title="Change icon"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Change
        </button>

        {/* Icon Color Dropdown */}
        <ColorDropdown
          label="Icon"
          value={frame.iconLayer.color}
          onChange={(color) => onUpdateIconLayer?.(carouselId, frame.id, { color: color || '#ffffff' })}
          colors={brandColors}
        />

        {/* Border Color Dropdown */}
        <ColorDropdown
          label="Border"
          value={frame.iconLayer.borderColor}
          onChange={(color) => onUpdateIconLayer?.(carouselId, frame.id, { borderColor: color })}
          colors={brandColors}
          allowNone
          noneLabel="None"
        />

        {/* Fill Color Dropdown */}
        <ColorDropdown
          label="Fill"
          value={frame.iconLayer.backgroundColor}
          onChange={(color) => onUpdateIconLayer?.(carouselId, frame.id, { backgroundColor: color })}
          colors={brandColors}
          allowNone
          noneLabel="None"
        />
      </div>

      {/* Row 2: Cancel, Done, Remove buttons */}
      <div className="flex items-center gap-2">
        {/* Cancel Button */}
        <button
          type="button"
          onClick={handleCancelIconEdit}
          className="bg-gray-800/90 hover:bg-gray-700 rounded-lg px-2.5 py-1.5 text-gray-400 hover:text-white text-[10px] font-medium transition-colors"
          title="Cancel and revert changes"
        >
          Cancel
        </button>

        {/* Done Button */}
        <button
          type="button"
          onClick={handleDoneIconEdit}
          className="bg-gray-600/90 hover:bg-gray-500 rounded-lg px-2.5 py-1.5 text-white text-[10px] font-medium transition-colors"
          title="Done editing"
        >
          Done
        </button>

        {/* Remove Icon Button */}
        <button
          type="button"
          onClick={handleDeleteIcon}
          className="flex items-center justify-center bg-gray-800/90 hover:bg-red-600 rounded-lg px-2 py-1.5 text-gray-400 hover:text-white transition-colors"
          title="Remove icon"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

/**
 * Progress Edit Panel Component
 * Controls for editing progress indicator properties
 */
const ProgressEditPanel = ({
  frame,
  carouselId,
  designSystem,
  onUpdateProgressIndicator,
  handleDoneProgressEdit,
}) => {
  // Get current progress indicator settings (with defaults)
  const progressIndicator = frame.progressIndicator || { type: 'dots', color: '#ffffff', isHidden: false };
  
  // Brand colors array
  const brandColors = [
    { name: 'Primary', color: designSystem.primary },
    { name: 'Secondary', color: designSystem.secondary },
    { name: 'Accent', color: designSystem.accent },
    { name: 'Dark', color: designSystem.neutral1 },
    { name: 'Mid Grey', color: designSystem.neutral2 },
    { name: 'Light Grey', color: designSystem.neutral4 },
    { name: 'Primary 2', color: designSystem.primary2 },
    { name: 'Accent 2', color: designSystem.accent2 },
    { name: 'White', color: designSystem.neutral3 },
  ];

  const progressTypes = [
    { key: 'dots', label: 'Dots' },
    { key: 'arrows', label: 'Arrows' },
    { key: 'bar', label: 'Bar' },
  ];

  return (
    <div 
      className="mt-1.5 flex flex-col gap-1.5" 
      data-progress-edit-controls
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Row 1: Type selector and Color dropdown */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Type Selector */}
        <div className="flex items-center gap-1 bg-gray-800/90 rounded-lg px-2 py-1.5">
          <span className="text-gray-400 text-[10px] mr-1">Type</span>
          {progressTypes.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => onUpdateProgressIndicator?.(carouselId, frame.id, { type: key })}
              className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                progressIndicator.type === key 
                  ? 'bg-gray-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Color Dropdown */}
        <ColorDropdown
          label="Color"
          value={progressIndicator.color || '#ffffff'}
          onChange={(color) => onUpdateProgressIndicator?.(carouselId, frame.id, { color: color || '#ffffff' })}
          colors={brandColors}
        />

        {/* Hide/Show Toggle */}
        <button
          type="button"
          onClick={() => onUpdateProgressIndicator?.(carouselId, frame.id, { isHidden: !progressIndicator.isHidden })}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-medium transition-colors ${
            progressIndicator.isHidden 
              ? 'bg-gray-700/90 text-gray-400 hover:bg-gray-600/90 hover:text-white' 
              : 'bg-gray-700/90 text-white hover:bg-gray-600/90'
          }`}
          title={progressIndicator.isHidden ? 'Show indicator' : 'Hide indicator'}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {progressIndicator.isHidden ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            )}
          </svg>
          {progressIndicator.isHidden ? 'Show' : 'Hide'}
        </button>
      </div>

      {/* Row 2: Done button */}
      <div className="flex items-center gap-2">
        {/* Done Button */}
        <button
          type="button"
          onClick={handleDoneProgressEdit}
          className="bg-gray-600/90 hover:bg-gray-500 rounded-lg px-2.5 py-1.5 text-white text-[10px] font-medium transition-colors"
          title="Done editing"
        >
          Done
        </button>
      </div>
    </div>
  );
};

/**
 * Single Frame Component
 * Displays a single carousel frame with layout and content
 */
export const CarouselFrame = ({ 
  frame, 
  carouselId, 
  frameSize, 
  designSystem, 
  frameIndex, 
  totalFrames, 
  isFrameSelected, 
  onSelectFrame, 
  onRemove, 
  onUpdateText, 
  activeTextField, 
  onActivateTextField,
  // Image layer props
  onUpdateImageLayer,
  onRemoveImageFromFrame,
  // Background/Fill props
  onClearBackground,
  onUpdateFillLayer,
  // Pattern layer props
  onUpdatePatternLayer,
  onRemovePatternFromFrame,
  // Product image layer props
  onUpdateProductImageLayer,
  onRemoveProductImageFromFrame,
  onRequestAddProductImage, // Callback to open design panel with product imagery section
  onProductImageDragChange, // Callback when product image drag state changes
  // Icon layer props
  onUpdateIconLayer,
  onRemoveIconFromFrame,
  onRequestAddIcon, // Callback to open design panel with brand icons section
  // Fill color callback
  onRequestAddFill, // Callback to open design panel with backgrounds section
  // Photo callback
  onRequestAddPhoto, // Callback to open design panel with photography section
  // Pattern callback
  onRequestAddPattern, // Callback to open design panel with brand patterns section
  // Page indicator callback
  onRequestAddPageIndicator, // Callback to open design panel with page indicators section
  // Progress indicator props
  onUpdateProgressIndicator,
  // Cross-frame overflow
  prevFrameImage = null,
  nextFrameImage = null,
  // Callback for image edit mode (to disable drag during edit)
  onImageEditModeChange,
  // Whether the row containing this frame is selected
  isRowSelected = false,
  // Whether this frame is currently being dragged
  isDragging = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isProgressEditing, setIsProgressEditing] = useState(false);
  const [imageEditTrigger, setImageEditTrigger] = useState(0);
  const [imageCloseTrigger, setImageCloseTrigger] = useState(0);
  const [isImageEditing, setIsImageEditing] = useState(false);
  const [initialImageState, setInitialImageState] = useState(null);
  
  // Fill color editing state
  const [isFillEditing, setIsFillEditing] = useState(false);
  const [initialFillState, setInitialFillState] = useState(null);
  
  // Pattern editing state
  const [isPatternEditing, setIsPatternEditing] = useState(false);
  const [initialPatternState, setInitialPatternState] = useState(null);
  
  // Product image editing state
  const [isProductImageEditing, setIsProductImageEditing] = useState(false);
  const [initialProductImageState, setInitialProductImageState] = useState(null);
  
  // Icon editing state
  const [isIconEditing, setIsIconEditing] = useState(false);
  const [initialIconState, setInitialIconState] = useState(null);
  
  // Notify parent (SortableFrame) when image edit mode changes
  const handleImageEditModeChange = (editing) => {
    // Store initial state when entering edit mode
    if (editing && frame.imageLayer && !isImageEditing) {
      setInitialImageState({ ...frame.imageLayer });
    }
    setIsImageEditing(editing);
    onImageEditModeChange?.(editing);
  };
  
  // Cancel editing and restore initial state
  const handleCancelEdit = () => {
    if (initialImageState) {
      onUpdateImageLayer?.(carouselId, frame.id, initialImageState);
    }
    setImageCloseTrigger(prev => prev + 1);
    handleImageEditModeChange(false);
    setInitialImageState(null);
  };
  
  // Done editing - keep changes and close
  const handleDoneEdit = () => {
    setImageCloseTrigger(prev => prev + 1);
    handleImageEditModeChange(false);
    setInitialImageState(null);
  };
  
  // Fill color editing handlers
  const handleStartFillEdit = () => {
    if (!isFillEditing) {
      setInitialFillState({
        backgroundOverride: frame.backgroundOverride,
        fillOpacity: frame.fillOpacity || 1,
        fillRotation: frame.fillRotation || 0,
      });
    }
    setIsFillEditing(true);
  };
  
  const handleCancelFillEdit = () => {
    if (initialFillState) {
      // Restore initial fill state
      onUpdateFillLayer?.(carouselId, frame.id, {
        backgroundOverride: initialFillState.backgroundOverride,
        fillOpacity: initialFillState.fillOpacity,
        fillRotation: initialFillState.fillRotation,
      });
    }
    setIsFillEditing(false);
    setInitialFillState(null);
  };
  
  const handleDoneFillEdit = () => {
    setIsFillEditing(false);
    setInitialFillState(null);
  };
  
  const handleDeleteFill = () => {
    onClearBackground?.(carouselId, frame.id);
    setIsFillEditing(false);
    setInitialFillState(null);
  };
  
  // Pattern editing handlers
  const handleStartPatternEdit = () => {
    if (!isPatternEditing && frame.patternLayer) {
      setInitialPatternState({ ...frame.patternLayer });
    }
    setIsPatternEditing(true);
  };
  
  const handleCancelPatternEdit = () => {
    if (initialPatternState) {
      // Restore initial pattern state
      onUpdatePatternLayer?.(carouselId, frame.id, initialPatternState);
    }
    setIsPatternEditing(false);
    setInitialPatternState(null);
  };
  
  const handleDonePatternEdit = () => {
    setIsPatternEditing(false);
    setInitialPatternState(null);
  };
  
  const handleDeletePattern = () => {
    onRemovePatternFromFrame?.(carouselId, frame.id);
    setIsPatternEditing(false);
    setInitialPatternState(null);
  };
  
  // Product image editing handlers
  const handleStartProductImageEdit = () => {
    if (!isProductImageEditing && frame.productImageLayer) {
      setInitialProductImageState({ ...frame.productImageLayer });
    }
    setIsProductImageEditing(true);
  };
  
  const handleCancelProductImageEdit = () => {
    if (initialProductImageState) {
      onUpdateProductImageLayer?.(carouselId, frame.id, initialProductImageState);
    }
    setIsProductImageEditing(false);
    setInitialProductImageState(null);
  };
  
  const handleDoneProductImageEdit = () => {
    setIsProductImageEditing(false);
    setInitialProductImageState(null);
  };
  
  const handleDeleteProductImage = () => {
    onRemoveProductImageFromFrame?.(carouselId, frame.id);
    setIsProductImageEditing(false);
    setInitialProductImageState(null);
  };
  
  // Icon editing handlers
  const handleStartIconEdit = () => {
    if (!isIconEditing && frame.iconLayer) {
      setInitialIconState({ ...frame.iconLayer });
    }
    setIsIconEditing(true);
  };
  
  const handleCancelIconEdit = () => {
    if (initialIconState) {
      onUpdateIconLayer?.(carouselId, frame.id, initialIconState);
    }
    setIsIconEditing(false);
    setInitialIconState(null);
  };
  
  const handleDoneIconEdit = () => {
    setIsIconEditing(false);
    setInitialIconState(null);
  };
  
  const handleDeleteIcon = () => {
    onRemoveIconFromFrame?.(carouselId, frame.id);
    setIsIconEditing(false);
    setInitialIconState(null);
  };
  
  const style = getFrameStyle(carouselId, frame.style, designSystem);
  const content = frame.variants[frame.currentVariant];
  const layoutIndex = frame.currentLayout || 0;
  const size = frameSizes[frameSize] || frameSizes.portrait;
  const isLandscape = frameSize === 'landscape' || frameSize === 'slides';
  const formatting = frame.variants[frame.currentVariant]?.formatting || {};
  const layoutVariant = frame.layoutVariant || 0;
  
  // Check if current layout is eligible for product images
  // Bottom Stack (layout 0, variant 0), Top Stack (layout 0, variant 1), Upper Drama (layout 1, variant 2)
  const isProductImageEligible = (layoutIndex === 0 && (layoutVariant === 0 || layoutVariant === 1)) 
                                || (layoutIndex === 1 && layoutVariant === 2);
  
  // Compute background style - handles both simple string and stretched gradient objects
  // Default to white when no backgroundOverride is set
  const getBackgroundStyle = () => {
    const bgOverride = frame.backgroundOverride;
    if (!bgOverride) {
      return { background: '#ffffff' }; // Plain white by default
    }
    // Check if it's a stretched gradient object
    // IMPORTANT: Use backgroundImage (not background shorthand) to prevent it from resetting size/position
    if (typeof bgOverride === 'object' && bgOverride.isStretched) {
      return {
        backgroundImage: bgOverride.gradient,
        backgroundSize: bgOverride.size,
        backgroundPosition: bgOverride.position,
        backgroundRepeat: 'no-repeat',
      };
    }
    // Simple string override
    return { background: bgOverride };
  };
  const backgroundStyle = getBackgroundStyle();
  
  // Generate a key for the background div to force re-render when background type changes
  const bgKey = frame.backgroundOverride 
    ? (typeof frame.backgroundOverride === 'object' 
        ? `stretched-${frame.backgroundOverride.position}` 
        : `simple-${frame.backgroundOverride.substring(0, 20)}`)
    : 'default';
  
  const handleUpdateText = (field, value) => onUpdateText?.(carouselId, frame.id, field, value);
  const handleActivateField = (field) => onActivateTextField?.(field);
  
  const renderLayout = () => {
    const fontSizes = getFontSizes(frameSize);
    const props = { 
      headline: content.headline, 
      body: content.body, 
      text: style.text,
      accent: style.accent, 
      isLandscape,
      headingFont: designSystem.fontHeadline || designSystem.headingFont, 
      bodyFont: designSystem.fontBody || designSystem.bodyFont, 
      variant: layoutVariant,
      isFrameSelected, 
      onUpdateText: handleUpdateText, 
      activeField: activeTextField,
      onActivateField: handleActivateField, 
      formatting, 
      fontSizes,
    };
    switch (layoutIndex) {
      case 1: return <LayoutCenterDrama {...props} />;
      case 2: return <LayoutEditorialLeft {...props} />;
      default: return <LayoutBottomStack {...props} />;
    }
  };
  
  return (
    <div className="flex flex-col" style={{ width: size.width }}>
      <div 
        key={bgKey}
        data-frame-id={frame.id}
        data-carousel-id={carouselId}
        data-project-key={`carousel-${carouselId}`}
        data-exportable="true"
        className={`relative overflow-hidden shadow-lg cursor-pointer transition-all border ${isFrameSelected ? 'border-orange-500' : 'border-gray-700 hover:border-gray-600'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ width: size.width, height: size.height, backgroundColor: '#ffffff' }}
        onClick={(e) => { e.stopPropagation(); onSelectFrame(frame.id); }}
      >
        {/* Layer 1: Pattern - backmost (z-index: 1) */}
        {frame.patternLayer && (
          <div className="absolute inset-0 z-[1]">
            <PatternLayer
              patternLayer={frame.patternLayer}
              frameWidth={size.width}
              frameHeight={size.height}
            />
          </div>
        )}
        
        {/* Layer 2: Image - behind gradient (z-index: 2), raises to z-50 when editing */}
        {frame.imageLayer && (
          <div className={`absolute inset-0 ${isImageEditing ? 'z-[50]' : 'z-[2]'}`}>
            <ImageLayer
              imageLayer={frame.imageLayer}
              frameWidth={size.width}
              frameHeight={size.height}
              isFrameSelected={isFrameSelected}
              onUpdate={(updates) => onUpdateImageLayer?.(carouselId, frame.id, updates)}
              onRemove={() => onRemoveImageFromFrame?.(carouselId, frame.id)}
              editTrigger={imageEditTrigger}
              closeTrigger={imageCloseTrigger}
              onEditModeChange={handleImageEditModeChange}
            />
          </div>
        )}
        
        {/* Overflow from previous frame's image (appears on left side) */}
        {!frame.imageLayer && prevFrameImage && prevFrameImage.x > 0.3 && prevFrameImage.scale > 1 && (
          <div className="absolute inset-0 z-[2]">
            <ImageLayer
              imageLayer={prevFrameImage}
              frameWidth={size.width}
              frameHeight={size.height}
              isFrameSelected={false}
              onUpdate={() => {}}
              onRemove={() => {}}
              isOverflowFromPrev={true}
              overflowImage={prevFrameImage}
            />
          </div>
        )}
        
        {/* Overflow from next frame's image (appears on right side) */}
        {!frame.imageLayer && nextFrameImage && nextFrameImage.x < -0.3 && nextFrameImage.scale > 1 && (
          <div className="absolute inset-0 z-[2]">
            <ImageLayer
              imageLayer={nextFrameImage}
              frameWidth={size.width}
              frameHeight={size.height}
              isFrameSelected={false}
              onUpdate={() => {}}
              onRemove={() => {}}
              isOverflowFromNext={true}
              overflowImage={nextFrameImage}
            />
          </div>
        )}
        
        {/* Layer 3: Gradient/Background - above image (z-index: 3) */}
        {/* Uses fillOpacity (defaults to 0.7 with image, 1 without) and fillRotation for user adjustments */}
        <div 
          className="absolute inset-0 z-[3] pointer-events-none overflow-hidden"
        >
          <div 
            className="absolute inset-[-50%] w-[200%] h-[200%]"
            style={{
              ...backgroundStyle,
              opacity: frame.fillOpacity !== undefined 
                ? frame.fillOpacity 
                : (frame.imageLayer ? 0.7 : 1),
              transform: `rotate(${frame.fillRotation || 0}deg)`,
              transformOrigin: 'center center',
            }}
          />
        </div>
        
        {/* Text Layout - renders above all layers */}
        <div className="absolute inset-0 z-10">
          {renderLayout()}
        </div>
        
        {/* Icon Placeholder - appears on Bottom Stack layouts without a product image or icon */}
        {layoutIndex === 0 && layoutVariant === 0 && !frame.productImageLayer && !frame.iconLayer && (
          <div 
            className="absolute"
            style={{
              left: '7.5%',
              bottom: '52%', // Position above text area
              width: '36px',
              height: '36px',
              zIndex: 30, // Above all other layers
            }}
          >
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); if (isFrameSelected) onRequestAddIcon?.(); }}
              className={`w-full h-full rounded-lg border-2 border-dashed flex items-center justify-center transition-colors ${
                isFrameSelected 
                  ? 'border-orange-500 bg-orange-500/10 cursor-pointer hover:bg-orange-500/20' 
                  : isRowSelected 
                    ? 'border-orange-500/40 bg-transparent cursor-default'
                    : 'border-gray-600/50 bg-transparent cursor-default'
              }`}
              title={isFrameSelected ? "Click to add icon" : "Icon placeholder"}
              disabled={!isFrameSelected}
            >
              {isFrameSelected && (
                <svg className="w-4 h-4 text-orange-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </button>
          </div>
        )}
        
        {/* Icon Layer - renders when frame has an icon */}
        {frame.iconLayer && (
          <IconLayer
            iconLayer={frame.iconLayer}
            frameWidth={size.width}
            frameHeight={size.height}
            isRowSelected={isRowSelected}
            isFrameSelected={isFrameSelected}
          />
        )}
        
        {/* Layer 5: Product Image - above text (z-index: 20) */}
        {frame.productImageLayer && (() => {
          const headline = frame.variants?.[frame.currentVariant]?.headline || '';
          const subhead = frame.variants?.[frame.currentVariant]?.subhead || '';
          // Key forces re-render when text content changes
          const textKey = `${headline.length}-${subhead.length}`;
          return (
            <ProductImageLayer
              key={textKey}
              productImageLayer={frame.productImageLayer}
              frameWidth={size.width}
              frameHeight={size.height}
              isEditing={isProductImageEditing}
              position={frame.productImageLayer.position || 'top'}
              textContent={{ headline, subhead }}
              isRowSelected={isRowSelected}
              isFrameSelected={isFrameSelected}
              onUpdateLayer={(updates) => onUpdateProductImageLayer?.(carouselId, frame.id, updates)}
              onDragStateChange={onProductImageDragChange}
            />
          );
        })()}
        
        {/* Progress Dots Overlay - Hidden during image editing */}
        {!isImageEditing && (
          <div className="absolute top-2 right-2 z-10">
            <ProgressIndicatorOverlay 
              frameId={frame.id}
              totalFrames={totalFrames}
              type={frame.progressIndicator?.type || 'dots'}
              color={frame.progressIndicator?.color || '#ffffff'}
              isHidden={frame.progressIndicator?.isHidden || false}
            />
          </div>
        )}
        
        {/* Remove Button - Hidden during image editing and dragging */}
        {totalFrames > 1 && !isImageEditing && !isDragging && (
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(frame.id); }} 
            className={`absolute top-2 left-2 z-20 w-6 h-6 bg-black/70 hover:bg-red-500 rounded-full flex items-center justify-center transition-opacity duration-150 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
      </div>
      
      {/* Controls Area - fixed height to prevent layout snap */}
      <div className={`${isRowSelected ? 'min-h-[52px]' : 'h-0'}`}>
      {/* Layer Indicators - outside frame, below card */}
      {/* Only visible when row is selected, hidden during editing modes */}
      {isRowSelected && !isImageEditing && !isFillEditing && !isPatternEditing && !isProductImageEditing && !isIconEditing && !isProgressEditing && (
      <div className="mt-1.5 flex flex-col items-start gap-1">
        {/* Layer chips - show when frame is selected, organized into table sections */}
        {isFrameSelected && (
          <div className="flex flex-col items-stretch w-full max-w-[180px]">
            {/* Foreground Layers Section */}
            <div className="text-[9px] text-gray-500 uppercase tracking-wider px-1 pb-1">Foreground Layers</div>
            <div className="border-t border-gray-600/50">
              {/* 1. Progress Indicator */}
              <div 
                className={`flex items-center gap-1.5 px-2 py-1.5 border-b border-gray-600/50 group cursor-pointer transition-colors hover:bg-gray-700/50 ${
                  frame.progressIndicator?.isHidden ? 'opacity-60' : ''
                }`}
                title="Edit progress indicator"
                onClick={(e) => { e.stopPropagation(); onRequestAddPageIndicator?.(); setIsProgressEditing(true); }}
              >
                <svg className={`w-3 h-3 ${frame.progressIndicator?.isHidden ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
                <span className={`text-[10px] transition-colors ${
                  frame.progressIndicator?.isHidden 
                    ? 'text-gray-500 group-hover:text-gray-300' 
                    : 'text-gray-400 group-hover:text-white'
                }`}>Progress</span>
                {frame.progressIndicator?.isHidden ? (
                  <span 
                    className="ml-auto text-[8px] text-gray-500 hover:text-green-400 transition-colors"
                    onClick={(e) => { e.stopPropagation(); onUpdateProgressIndicator?.(carouselId, frame.id, { isHidden: false }); }}
                    title="Show progress indicator"
                  >show</span>
                ) : (
                  <span 
                    className="ml-auto text-[8px] text-gray-600 hover:text-red-400 transition-colors"
                    onClick={(e) => { e.stopPropagation(); onUpdateProgressIndicator?.(carouselId, frame.id, { isHidden: true }); }}
                    title="Hide progress indicator"
                  >hide</span>
                )}
              </div>
              
              {/* 2. Icon - only for eligible layouts */}
              {layoutIndex === 0 && layoutVariant === 0 && !frame.productImageLayer && (
                <div 
                  className={`flex items-center gap-1.5 px-2 py-1.5 border-b border-gray-600/50 group cursor-pointer transition-colors hover:bg-gray-700/50 ${
                    !frame.iconLayer ? 'opacity-60' : ''
                  }`}
                  title={frame.iconLayer ? "Edit icon" : "Add an icon"}
                  onClick={(e) => { e.stopPropagation(); frame.iconLayer ? handleStartIconEdit() : onRequestAddIcon?.(); }}
                >
                  <svg className={`w-3 h-3 ${frame.iconLayer ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className={`text-[10px] transition-colors ${frame.iconLayer ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>Icon / Stat</span>
                  {frame.iconLayer ? (
                    <span 
                      className="ml-auto text-[8px] text-gray-600 hover:text-red-400 transition-colors"
                      onClick={(e) => { e.stopPropagation(); onRemoveIconFromFrame?.(carouselId, frame.id); }}
                      title="Clear icon"
                    >clear</span>
                  ) : (
                    <span className="ml-auto text-[8px] text-gray-600 italic">empty</span>
                  )}
                </div>
              )}
              
              {/* 3. Product Image - only for eligible layouts */}
              {isProductImageEligible && (
                <div 
                  className={`flex items-center gap-1.5 px-2 py-1.5 border-b border-gray-600/50 group cursor-pointer transition-colors hover:bg-gray-700/50 ${
                    !frame.productImageLayer ? 'opacity-60' : ''
                  }`}
                  title={frame.productImageLayer ? "Edit product image" : "Add a product image"}
                  onClick={(e) => { e.stopPropagation(); frame.productImageLayer ? handleStartProductImageEdit() : onRequestAddProductImage?.(); }}
                >
                  <svg className={`w-3 h-3 ${frame.productImageLayer ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span className={`text-[10px] transition-colors ${frame.productImageLayer ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>Product Image</span>
                  {frame.productImageLayer ? (
                    <span 
                      className="ml-auto text-[8px] text-gray-600 hover:text-red-400 transition-colors"
                      onClick={(e) => { e.stopPropagation(); onRemoveProductImageFromFrame?.(carouselId, frame.id); }}
                      title="Clear product image"
                    >clear</span>
                  ) : (
                    <span className="ml-auto text-[8px] text-gray-600 italic">empty</span>
                  )}
                </div>
              )}
            </div>
            
            {/* Background Layers Section */}
            <div className="text-[9px] text-gray-500 uppercase tracking-wider px-1 pb-1 pt-2">Background Layers</div>
            <div className="border-t border-gray-600/50">
              {/* 4. Fill Color */}
              <div 
                className={`flex items-center gap-1.5 px-2 py-1.5 border-b border-gray-600/50 group cursor-pointer transition-colors hover:bg-gray-700/50 ${
                  !frame.backgroundOverride ? 'opacity-60' : ''
                }`}
                title={frame.backgroundOverride ? "Edit fill color" : "Add a fill color"}
                onClick={(e) => { e.stopPropagation(); frame.backgroundOverride ? handleStartFillEdit() : onRequestAddFill?.(); }}
              >
                <svg className={`w-3 h-3 ${frame.backgroundOverride ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <span className={`text-[10px] transition-colors ${frame.backgroundOverride ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>Fill Color</span>
                {frame.backgroundOverride ? (
                  <span 
                    className="ml-auto text-[8px] text-gray-600 hover:text-red-400 transition-colors"
                    onClick={(e) => { e.stopPropagation(); onClearBackground?.(carouselId, frame.id); }}
                    title="Clear fill color"
                  >clear</span>
                ) : (
                  <span className="ml-auto text-[8px] text-gray-600 italic">empty</span>
                )}
              </div>
              
              {/* 5. Background Photo */}
              <div 
                className={`flex items-center gap-1.5 px-2 py-1.5 border-b border-gray-600/50 group cursor-pointer transition-colors hover:bg-gray-700/50 ${
                  !frame.imageLayer ? 'opacity-60' : ''
                }`}
                title={frame.imageLayer ? "Edit image" : "Add an image"}
                onClick={(e) => { e.stopPropagation(); frame.imageLayer ? handleStartImageEdit() : onRequestAddPhoto?.(); }}
              >
                <svg className={`w-3 h-3 ${frame.imageLayer ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className={`text-[10px] transition-colors ${frame.imageLayer ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>Background Photo</span>
                {frame.imageLayer ? (
                  <span 
                    className="ml-auto text-[8px] text-gray-600 hover:text-red-400 transition-colors"
                    onClick={(e) => { e.stopPropagation(); onRemoveImageFromFrame?.(carouselId, frame.id); }}
                    title="Clear background photo"
                  >clear</span>
                ) : (
                  <span className="ml-auto text-[8px] text-gray-600 italic">empty</span>
                )}
              </div>
              
              {/* 6. Brand Pattern */}
              <div 
                className={`flex items-center gap-1.5 px-2 py-1.5 border-b border-gray-600/50 group cursor-pointer transition-colors hover:bg-gray-700/50 ${
                  !frame.patternLayer ? 'opacity-60' : ''
                }`}
                title={frame.patternLayer ? "Edit pattern" : "Add a pattern"}
                onClick={(e) => { e.stopPropagation(); frame.patternLayer ? handleStartPatternEdit() : onRequestAddPattern?.(); }}
              >
                <svg className={`w-3 h-3 ${frame.patternLayer ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                <span className={`text-[10px] transition-colors ${frame.patternLayer ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>Brand Pattern</span>
                {frame.patternLayer ? (
                  <span 
                    className="ml-auto text-[8px] text-gray-600 hover:text-red-400 transition-colors"
                    onClick={(e) => { e.stopPropagation(); onRemovePatternFromFrame?.(carouselId, frame.id); }}
                    title="Clear brand pattern"
                  >clear</span>
                ) : (
                  <span className="ml-auto text-[8px] text-gray-600 italic">empty</span>
                )}
              </div>
            </div>
          </div>
        )}
        
      </div>
      )}
      
      {/* Image Edit Controls - appears below frame when editing */}
      {isImageEditing && frame.imageLayer && (
        <div 
          className="mt-1.5 flex items-center gap-2 flex-wrap" 
          data-image-edit-controls
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-gray-800/90 rounded-lg px-2 py-1.5">
            <span className="text-gray-500 text-[10px] mr-1 min-w-[40px]">Zoom</span>
            <button
              type="button"
              onClick={() => onUpdateImageLayer?.(carouselId, frame.id, { scale: Math.max(0.5, frame.imageLayer.scale - 0.1) })}
              className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-gray-300 text-[10px] font-medium min-w-[32px] text-center">
              {Math.round(frame.imageLayer.scale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => onUpdateImageLayer?.(carouselId, frame.id, { scale: Math.min(5, frame.imageLayer.scale + 0.1) })}
              className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => onUpdateImageLayer?.(carouselId, frame.id, { scale: 1 })}
              className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Reset zoom to 100%"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Opacity Control */}
          <div className="flex items-center gap-1 bg-gray-800/90 rounded-lg px-2 py-1.5">
            <span className="text-gray-500 text-[10px] mr-1 min-w-[40px]">Opacity</span>
            <button
              type="button"
              onClick={() => onUpdateImageLayer?.(carouselId, frame.id, { opacity: Math.max(0, frame.imageLayer.opacity - 0.1) })}
              className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-gray-300 text-[10px] font-medium min-w-[32px] text-center">
              {Math.round(frame.imageLayer.opacity * 100)}%
            </span>
            <button
              type="button"
              onClick={() => onUpdateImageLayer?.(carouselId, frame.id, { opacity: Math.min(1, frame.imageLayer.opacity + 0.1) })}
              className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => onUpdateImageLayer?.(carouselId, frame.id, { opacity: 1 })}
              className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Reset opacity to 100%"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={handleCancelEdit}
            className="bg-gray-700/90 hover:bg-gray-600 rounded-lg px-2.5 py-1.5 text-gray-300 hover:text-white text-[10px] font-medium transition-colors"
            title="Cancel and revert changes"
          >
            Cancel
          </button>

          {/* Done Button */}
          <button
            type="button"
            onClick={handleDoneEdit}
            className="bg-orange-500/90 hover:bg-orange-500 rounded-lg px-2.5 py-1.5 text-white text-[10px] font-medium transition-colors"
            title="Done editing"
          >
            Done
          </button>

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => { setImageCloseTrigger(prev => prev + 1); handleImageEditModeChange(false); onRemoveImageFromFrame?.(carouselId, frame.id); }}
            className="bg-gray-800/90 hover:bg-red-600 rounded-lg px-2 py-1.5 text-gray-400 hover:text-white transition-colors"
            title="Remove image"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Fill Color Edit Controls - appears below frame when editing fill */}
      {isFillEditing && (
        <div 
          className="mt-1.5 flex items-center gap-2 flex-wrap" 
          data-fill-edit-controls
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Opacity Control */}
          <div className="flex items-center gap-1 bg-gray-800/90 rounded-lg px-2 py-1.5">
            <span className="text-gray-500 text-[10px] mr-1 min-w-[40px]">Opacity</span>
            <button
              type="button"
              onClick={() => onUpdateFillLayer?.(carouselId, frame.id, { fillOpacity: Math.max(0, (frame.fillOpacity || 1) - 0.1) })}
              className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-gray-300 text-[10px] font-medium min-w-[32px] text-center">
              {Math.round((frame.fillOpacity || 1) * 100)}%
            </span>
            <button
              type="button"
              onClick={() => onUpdateFillLayer?.(carouselId, frame.id, { fillOpacity: Math.min(1, (frame.fillOpacity || 1) + 0.1) })}
              className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => onUpdateFillLayer?.(carouselId, frame.id, { fillOpacity: 1 })}
              className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Reset opacity to 100%"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Rotation Control */}
          <div className="flex items-center gap-1 bg-gray-800/90 rounded-lg px-2 py-1.5">
            <span className="text-gray-500 text-[10px] mr-1 min-w-[40px]">Rotate</span>
            <button
              type="button"
              onClick={() => onUpdateFillLayer?.(carouselId, frame.id, { fillRotation: ((frame.fillRotation || 0) - 90 + 360) % 360 })}
              className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Rotate -90°"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
            <span className="text-gray-300 text-[10px] font-medium min-w-[32px] text-center">
              {frame.fillRotation || 0}°
            </span>
            <button
              type="button"
              onClick={() => onUpdateFillLayer?.(carouselId, frame.id, { fillRotation: ((frame.fillRotation || 0) + 90) % 360 })}
              className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Rotate +90°"
            >
              <svg className="w-3.5 h-3.5 transform scale-x-[-1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => onUpdateFillLayer?.(carouselId, frame.id, { fillRotation: 0 })}
              className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Reset rotation to 0°"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={handleCancelFillEdit}
            className="bg-gray-700/90 hover:bg-gray-600 rounded-lg px-2.5 py-1.5 text-gray-300 hover:text-white text-[10px] font-medium transition-colors"
            title="Cancel and revert changes"
          >
            Cancel
          </button>

          {/* Done Button */}
          <button
            type="button"
            onClick={handleDoneFillEdit}
            className="bg-orange-500/90 hover:bg-orange-500 rounded-lg px-2.5 py-1.5 text-white text-[10px] font-medium transition-colors"
            title="Done editing"
          >
            Done
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={handleDeleteFill}
            className="bg-gray-800/90 hover:bg-red-600 rounded-lg px-2 py-1.5 text-gray-400 hover:text-white transition-colors"
            title="Remove fill color"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Pattern Edit Controls - appears below frame when editing pattern */}
      {isPatternEditing && frame.patternLayer && (
        <div 
          className="mt-1.5 flex items-center gap-2 flex-wrap" 
          data-pattern-edit-controls
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Opacity Control */}
          <div className="flex items-center gap-1 bg-gray-800/90 rounded-lg px-2 py-1.5">
            <span className="text-gray-500 text-[10px] mr-1 min-w-[40px]">Opacity</span>
            <button
              type="button"
              onClick={() => onUpdatePatternLayer?.(carouselId, frame.id, { opacity: Math.max(0, (frame.patternLayer.opacity || 1) - 0.1) })}
              className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-gray-300 text-[10px] font-medium min-w-[32px] text-center">
              {Math.round((frame.patternLayer.opacity || 1) * 100)}%
            </span>
            <button
              type="button"
              onClick={() => onUpdatePatternLayer?.(carouselId, frame.id, { opacity: Math.min(1, (frame.patternLayer.opacity || 1) + 0.1) })}
              className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => onUpdatePatternLayer?.(carouselId, frame.id, { opacity: 1 })}
              className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Reset opacity to 100%"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Rotation Control */}
          <div className="flex items-center gap-1 bg-gray-800/90 rounded-lg px-2 py-1.5">
            <span className="text-gray-500 text-[10px] mr-1 min-w-[40px]">Rotate</span>
            <button
              type="button"
              onClick={() => onUpdatePatternLayer?.(carouselId, frame.id, { rotation: ((frame.patternLayer.rotation || 0) - 90 + 360) % 360 })}
              className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Rotate -90°"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
            <span className="text-gray-300 text-[10px] font-medium min-w-[32px] text-center">
              {frame.patternLayer.rotation || 0}°
            </span>
            <button
              type="button"
              onClick={() => onUpdatePatternLayer?.(carouselId, frame.id, { rotation: ((frame.patternLayer.rotation || 0) + 90) % 360 })}
              className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Rotate +90°"
            >
              <svg className="w-3.5 h-3.5 transform scale-x-[-1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => onUpdatePatternLayer?.(carouselId, frame.id, { rotation: 0 })}
              className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Reset rotation to 0°"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={handleCancelPatternEdit}
            className="bg-gray-700/90 hover:bg-gray-600 rounded-lg px-2.5 py-1.5 text-gray-300 hover:text-white text-[10px] font-medium transition-colors"
            title="Cancel and revert changes"
          >
            Cancel
          </button>

          {/* Done Button */}
          <button
            type="button"
            onClick={handleDonePatternEdit}
            className="bg-orange-500/90 hover:bg-orange-500 rounded-lg px-2.5 py-1.5 text-white text-[10px] font-medium transition-colors"
            title="Done editing"
          >
            Done
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={handleDeletePattern}
            className="bg-gray-800/90 hover:bg-red-600 rounded-lg px-2 py-1.5 text-gray-400 hover:text-white transition-colors"
            title="Remove pattern"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Product Image Edit Controls - appears below frame when editing product image */}
      {isProductImageEditing && frame.productImageLayer && (
        <div 
          className="mt-1.5 flex items-center gap-2 flex-wrap" 
          data-product-image-edit-controls
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Zoom Control */}
          <div className="flex items-center gap-1 bg-gray-800/90 rounded-lg px-2 py-1.5">
            <span className="text-gray-500 text-[10px] mr-1 min-w-[40px]">Zoom</span>
            <button
              type="button"
              onClick={() => onUpdateProductImageLayer?.(carouselId, frame.id, { scale: Math.max(0.5, (frame.productImageLayer.scale || 1) - 0.1) })}
              className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-gray-300 text-[10px] font-medium min-w-[32px] text-center">
              {Math.round((frame.productImageLayer.scale || 1) * 100)}%
            </span>
            <button
              type="button"
              onClick={() => onUpdateProductImageLayer?.(carouselId, frame.id, { scale: Math.min(2, (frame.productImageLayer.scale || 1) + 0.1) })}
              className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => onUpdateProductImageLayer?.(carouselId, frame.id, { scale: 1 })}
              className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Reset zoom to 100%"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Corner Rounding Control */}
          <div className="flex items-center gap-1 bg-gray-800/90 rounded-lg px-2 py-1.5">
            <span className="text-gray-500 text-[10px] mr-1 min-w-[40px]">Corners</span>
            <button
              type="button"
              onClick={() => onUpdateProductImageLayer?.(carouselId, frame.id, { borderRadius: Math.max(0, (frame.productImageLayer.borderRadius ?? 8) - 4) })}
              className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-gray-300 text-[10px] font-medium min-w-[32px] text-center">
              {frame.productImageLayer.borderRadius ?? 8}px
            </span>
            <button
              type="button"
              onClick={() => onUpdateProductImageLayer?.(carouselId, frame.id, { borderRadius: Math.min(48, (frame.productImageLayer.borderRadius ?? 8) + 4) })}
              className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => onUpdateProductImageLayer?.(carouselId, frame.id, { borderRadius: 8 })}
              className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Reset corners to 8px"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={handleCancelProductImageEdit}
            className="bg-gray-700/90 hover:bg-gray-600 rounded-lg px-2.5 py-1.5 text-gray-300 hover:text-white text-[10px] font-medium transition-colors"
            title="Cancel and revert changes"
          >
            Cancel
          </button>

          {/* Done Button */}
          <button
            type="button"
            onClick={handleDoneProductImageEdit}
            className="bg-orange-500/90 hover:bg-orange-500 rounded-lg px-2.5 py-1.5 text-white text-[10px] font-medium transition-colors"
            title="Done editing"
          >
            Done
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={handleDeleteProductImage}
            className="bg-gray-800/90 hover:bg-red-600 rounded-lg px-2 py-1.5 text-gray-400 hover:text-white transition-colors"
            title="Remove product image"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Icon Edit Controls - appears below frame when editing icon */}
      {isIconEditing && frame.iconLayer && (
        <IconEditPanel
          frame={frame}
          carouselId={carouselId}
          designSystem={designSystem}
          onUpdateIconLayer={onUpdateIconLayer}
          onRequestAddIcon={onRequestAddIcon}
          handleDeleteIcon={handleDeleteIcon}
          handleCancelIconEdit={handleCancelIconEdit}
          handleDoneIconEdit={handleDoneIconEdit}
        />
      )}
      
      {/* Progress Edit Controls - appears below frame when editing progress indicator */}
      {isProgressEditing && (
        <ProgressEditPanel
          frame={frame}
          carouselId={carouselId}
          designSystem={designSystem}
          onUpdateProgressIndicator={onUpdateProgressIndicator}
          handleDoneProgressEdit={() => setIsProgressEditing(false)}
        />
      )}
      </div>
    </div>
  );
};

/**
 * Sortable Frame Wrapper
 * Adds drag-and-drop functionality to CarouselFrame
 */
export const SortableFrame = ({ 
  id, 
  frame, 
  carouselId, 
  frameSize, 
  designSystem, 
  frameIndex, 
  totalFrames, 
  isFrameSelected, 
  onSelectFrame, 
  onRemove, 
  onUpdateText, 
  activeTextField, 
  onActivateTextField, 
  isRowSelected, 
  cardWidth,
  // Image layer props
  onUpdateImageLayer,
  onRemoveImageFromFrame,
  // Background/Fill props
  onClearBackground,
  onUpdateFillLayer,
  // Pattern layer props
  onUpdatePatternLayer,
  onRemovePatternFromFrame,
  // Product image layer props
  onUpdateProductImageLayer,
  onRemoveProductImageFromFrame,
  onRequestAddProductImage,
  // Icon layer props
  onUpdateIconLayer,
  onRemoveIconFromFrame,
  onRequestAddIcon,
  // Progress indicator props
  onUpdateProgressIndicator,
  // Additional callbacks
  onRequestAddFill,
  onRequestAddPhoto,
  onRequestAddPattern,
  onRequestAddPageIndicator,
  // Cross-frame overflow
  prevFrameImage,
  nextFrameImage,
}) => {
  const [isImageEditing, setIsImageEditing] = useState(false);
  const [isProductImageDragging, setIsProductImageDragging] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({ 
    id,
    disabled: !isRowSelected || isImageEditing || isProductImageDragging, // Disable drag when editing image or dragging product
  });

  // Calculate transform - non-dragged items move by exactly one card slot
  const getTransform = () => {
    if (!transform) return undefined;
    if (isDragging) {
      return `translate3d(${Math.round(transform.x)}px, 0, 0)`;
    } else {
      // Non-dragged: move by card width + gap (12px) + add button container (32px)
      const moveDistance = cardWidth + 12 + 32;
      if (Math.abs(transform.x) > 10) {
        const direction = transform.x > 0 ? 1 : -1;
        return `translate3d(${direction * moveDistance}px, 0, 0)`;
      }
      return undefined;
    }
  };

  const isBeingPushed = transform && Math.abs(transform.x) > 10 && !isDragging;
  
  const style = {
    transform: getTransform(),
    transition: isBeingPushed ? 'transform 120ms ease-out' : 'none',
    zIndex: isDragging ? 100 : 1,
    cursor: isRowSelected ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CarouselFrame
        frame={frame}
        carouselId={carouselId}
        frameSize={frameSize}
        designSystem={designSystem}
        frameIndex={frameIndex}
        totalFrames={totalFrames}
        isFrameSelected={isFrameSelected}
        onSelectFrame={onSelectFrame}
        onRemove={onRemove}
        onUpdateText={onUpdateText}
        activeTextField={activeTextField}
        onActivateTextField={onActivateTextField}
        onUpdateImageLayer={onUpdateImageLayer}
        onRemoveImageFromFrame={onRemoveImageFromFrame}
        onClearBackground={onClearBackground}
        onUpdateFillLayer={onUpdateFillLayer}
        onUpdatePatternLayer={onUpdatePatternLayer}
        onRemovePatternFromFrame={onRemovePatternFromFrame}
        onUpdateProductImageLayer={onUpdateProductImageLayer}
        onRemoveProductImageFromFrame={onRemoveProductImageFromFrame}
        onRequestAddProductImage={onRequestAddProductImage}
        onProductImageDragChange={setIsProductImageDragging}
        onUpdateIconLayer={onUpdateIconLayer}
        onRemoveIconFromFrame={onRemoveIconFromFrame}
        onRequestAddIcon={onRequestAddIcon}
        onUpdateProgressIndicator={onUpdateProgressIndicator}
        onRequestAddFill={onRequestAddFill}
        onRequestAddPhoto={onRequestAddPhoto}
        onRequestAddPattern={onRequestAddPattern}
        onRequestAddPageIndicator={onRequestAddPageIndicator}
        prevFrameImage={prevFrameImage}
        nextFrameImage={nextFrameImage}
        onImageEditModeChange={setIsImageEditing}
        isRowSelected={isRowSelected}
        isDragging={isDragging}
      />
    </div>
  );
};

export default CarouselFrame;
