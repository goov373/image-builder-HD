import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { frameSizes, getFontSizes, getFrameStyle } from '../data';
import { LayoutBottomStack, LayoutCenterDrama, LayoutEditorialLeft } from './Layouts';
import ImageLayer from './ImageLayer';
import PatternLayer from './PatternLayer';
import ProductImageLayer from './ProductImageLayer';
import IconLayer from './IconLayer';
import { ColorDropdown } from './ui';
import { 
  IconToolPanel, 
  ProgressToolPanel,
  FillToolPanel,
  PatternToolPanel,
  ImageToolPanel,
  ProductImageToolPanel,
} from './carousel/tool-panels';

/**
 * SortableLayerRow Component
 * A draggable row for the background layers panel
 */
const SortableLayerRow = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center">
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners} 
        className="flex items-center justify-center w-5 h-full cursor-grab active:cursor-grabbing text-gray-600 hover:text-gray-400"
        title="Drag to reorder"
      >
        <svg className="w-3 h-3" viewBox="0 0 10 16" fill="currentColor">
          <circle cx="2" cy="2" r="1.5"/>
          <circle cx="8" cy="2" r="1.5"/>
          <circle cx="2" cy="8" r="1.5"/>
          <circle cx="8" cy="8" r="1.5"/>
          <circle cx="2" cy="14" r="1.5"/>
          <circle cx="8" cy="14" r="1.5"/>
        </svg>
      </div>
      {/* Row Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

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
  // Background layer order props
  onReorderBackgroundLayers,
  // Cross-frame overflow
  prevFrameImage = null,
  nextFrameImage = null,
  // Callback for image edit mode (to disable drag during edit)
  onImageEditModeChange,
  // Whether the row containing this frame is selected
  isRowSelected = false,
  // Whether this frame is currently being dragged
  isDragging = false,
  // Whether ANY frame in the row is being dragged (hides all panels)
  isDraggingAny = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isProgressEditing, setIsProgressEditing] = useState(false);
  const [initialProgressState, setInitialProgressState] = useState(null);
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
  
  // Layer selection state - only one layer can be selected at a time
  // Values: 'icon', 'productImage', null (null means no layer selected, or text is selected)
  const [selectedLayer, setSelectedLayer] = useState(null);
  
  // When a layer is selected, clear text field selection
  const handleSelectLayer = (layer) => {
    setSelectedLayer(layer);
    // Clear text field selection when selecting a different layer
    if (layer) {
      onActivateTextField?.(null);
    }
  };
  
  // When text field is activated, clear layer selection
  const handleActivateFieldWithClear = (field) => {
    if (field) {
      setSelectedLayer(null);
    }
    onActivateTextField?.(field);
  };
  
  // Clear layer selection when frame is deselected
  useEffect(() => {
    if (!isFrameSelected) {
      setSelectedLayer(null);
    }
  }, [isFrameSelected]);
  
  // Helper function to close all tool panels
  const closeAllToolPanels = () => {
    setIsImageEditing(false);
    setIsFillEditing(false);
    setIsPatternEditing(false);
    setIsProductImageEditing(false);
    setIsIconEditing(false);
    setIsProgressEditing(false);
    setInitialImageState(null);
    setInitialFillState(null);
    setInitialPatternState(null);
    setInitialProductImageState(null);
    setInitialIconState(null);
    setInitialProgressState(null);
  };
  
  // Close all tool panels when frame is deselected
  useEffect(() => {
    if (!isFrameSelected) {
      closeAllToolPanels();
    }
  }, [isFrameSelected]);
  
  // Close all tool panels when any frame starts dragging
  useEffect(() => {
    if (isDraggingAny) {
      closeAllToolPanels();
    }
  }, [isDraggingAny]);
  
  // Sensors for background layer drag-and-drop (with distance activation to prevent accidental drags)
  const layerSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );
  
  // Handle drag end for background layer reordering
  const handleLayerDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    
    const currentOrder = frame.backgroundLayerOrder || ['fill', 'pattern', 'image'];
    const oldIndex = currentOrder.indexOf(active.id);
    const newIndex = currentOrder.indexOf(over.id);
    
    if (oldIndex !== -1 && newIndex !== -1) {
      const newOrder = arrayMove(currentOrder, oldIndex, newIndex);
      onReorderBackgroundLayers?.(carouselId, frame.id, newOrder);
    }
  };
  
  // Track previous layer states to auto-open tool panels when content is added
  const prevProgressRef = useRef(frame.progressIndicator);
  const prevIconRef = useRef(frame.iconLayer);
  const prevProductImageRef = useRef(frame.productImageLayer);
  const prevFillRef = useRef(frame.backgroundOverride);
  const prevImageRef = useRef(frame.imageLayer);
  const prevPatternRef = useRef(frame.patternLayer);
  
  // Auto-open Progress tool panel when indicator is added (close others first)
  // Skip opening panel during drag, but always update ref to prevent false positives
  useEffect(() => {
    const wasEmpty = !prevProgressRef.current || prevProgressRef.current.isHidden !== false;
    const nowHasContent = frame.progressIndicator?.isHidden === false;
    if (!isDraggingAny && wasEmpty && nowHasContent) {
      closeAllToolPanels();
      setIsProgressEditing(true);
    }
    prevProgressRef.current = frame.progressIndicator;
  }, [frame.progressIndicator, isDraggingAny]);
  
  // Auto-open Icon tool panel when icon is added (close others first)
  // Skip opening panel during drag, but always update ref to prevent false positives
  useEffect(() => {
    const wasEmpty = !prevIconRef.current;
    const nowHasContent = !!frame.iconLayer;
    if (!isDraggingAny && wasEmpty && nowHasContent) {
      closeAllToolPanels();
      setIsIconEditing(true);
      setInitialIconState({ ...frame.iconLayer });
    }
    prevIconRef.current = frame.iconLayer;
  }, [frame.iconLayer, isDraggingAny]);
  
  // Auto-open Product Image tool panel when product image is added (close others first)
  // Skip opening panel during drag, but always update ref to prevent false positives
  useEffect(() => {
    const wasEmpty = !prevProductImageRef.current;
    const nowHasContent = !!frame.productImageLayer;
    if (!isDraggingAny && wasEmpty && nowHasContent) {
      closeAllToolPanels();
      setIsProductImageEditing(true);
      setInitialProductImageState({ ...frame.productImageLayer });
    }
    prevProductImageRef.current = frame.productImageLayer;
  }, [frame.productImageLayer, isDraggingAny]);
  
  // Auto-open Fill tool panel when fill color is added (close others first)
  // Skip opening panel during drag, but always update ref to prevent false positives
  useEffect(() => {
    const wasEmpty = !prevFillRef.current;
    const nowHasContent = !!frame.backgroundOverride;
    if (!isDraggingAny && wasEmpty && nowHasContent) {
      closeAllToolPanels();
      setIsFillEditing(true);
      setInitialFillState({
        backgroundOverride: frame.backgroundOverride,
        fillOpacity: frame.fillOpacity || 1,
        fillRotation: frame.fillRotation || 0,
      });
    }
    prevFillRef.current = frame.backgroundOverride;
  }, [frame.backgroundOverride, isDraggingAny]);
  
  // Auto-open Image tool panel when background photo is added (close others first)
  // Skip opening panel during drag, but always update ref to prevent false positives
  useEffect(() => {
    const wasEmpty = !prevImageRef.current;
    const nowHasContent = !!frame.imageLayer;
    if (!isDraggingAny && wasEmpty && nowHasContent) {
      closeAllToolPanels();
      handleImageEditModeChange(true);
    }
    prevImageRef.current = frame.imageLayer;
  }, [frame.imageLayer, isDraggingAny]);
  
  // Auto-open Pattern tool panel when pattern is added (close others first)
  // Skip opening panel during drag, but always update ref to prevent false positives
  useEffect(() => {
    const wasEmpty = !prevPatternRef.current;
    const nowHasContent = !!frame.patternLayer;
    if (!isDraggingAny && wasEmpty && nowHasContent) {
      closeAllToolPanels();
      setIsPatternEditing(true);
      setInitialPatternState({ ...frame.patternLayer });
    }
    prevPatternRef.current = frame.patternLayer;
  }, [frame.patternLayer, isDraggingAny]);
  
  // Notify parent (SortableFrame) when image edit mode changes
  const handleImageEditModeChange = (editing) => {
    // Close other tool panels first when opening
    if (editing) {
      closeAllToolPanels();
    }
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
  
  // Start image editing - opens the image tool panel
  const handleStartImageEdit = () => {
    // Close other tool panels first
    closeAllToolPanels();
    // Store initial state
    if (frame.imageLayer) {
      setInitialImageState({ ...frame.imageLayer });
    }
    // Use the editTrigger mechanism to tell ImageLayer to enter edit mode
    // ImageLayer will then notify us via onEditModeChange, which sets isImageEditing
    setImageEditTrigger(prev => prev + 1);
  };
  
  // Fill color editing handlers
  const handleStartFillEdit = () => {
    // Close other tool panels first
    closeAllToolPanels();
    setInitialFillState({
      backgroundOverride: frame.backgroundOverride,
      fillOpacity: frame.fillOpacity || 1,
      fillRotation: frame.fillRotation || 0,
    });
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
    // Close other tool panels first
    closeAllToolPanels();
    if (frame.patternLayer) {
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
    // Close other tool panels first
    closeAllToolPanels();
    // Select this layer and clear text selection
    handleSelectLayer('productImage');
    if (frame.productImageLayer) {
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
    // Close other tool panels first
    closeAllToolPanels();
    // Select this layer and clear text selection
    handleSelectLayer('icon');
    if (frame.iconLayer) {
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
  
  // Progress editing handlers
  const handleStartProgressEdit = () => {
    // Close other tool panels first
    closeAllToolPanels();
    // Store initial state for cancel functionality
    if (frame.progressIndicator) {
      setInitialProgressState({ ...frame.progressIndicator });
    }
    setIsProgressEditing(true);
  };
  
  const handleCancelProgressEdit = () => {
    if (initialProgressState) {
      // Restore initial progress indicator state
      onUpdateProgressIndicator?.(carouselId, frame.id, initialProgressState);
    }
    setIsProgressEditing(false);
    setInitialProgressState(null);
  };
  
  const handleDoneProgressEdit = () => {
    setIsProgressEditing(false);
    setInitialProgressState(null);
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
  // When no backgroundOverride is set, return transparent so pattern layer can show through
  // The main container already has backgroundColor: '#ffffff' as the base
  const getBackgroundStyle = () => {
    const bgOverride = frame.backgroundOverride;
    if (!bgOverride) {
      return { background: 'transparent' }; // Transparent so pattern layer shows through
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
  
  // Get dynamic z-index for background layers based on user-defined order
  // Array position in backgroundLayerOrder = z-index (0 = z-1, 1 = z-2, 2 = z-3)
  const getLayerZIndex = (layerType) => {
    const order = frame.backgroundLayerOrder || ['fill', 'pattern', 'image'];
    const baseZ = order.indexOf(layerType) + 1; // z-1, z-2, or z-3
    // Special case: image editing raises to z-50 for editing controls
    if (layerType === 'image' && isImageEditing) return 50;
    return baseZ;
  };
  
  // Generate a key for the background div to force re-render when background type changes
  const bgKey = frame.backgroundOverride 
    ? (typeof frame.backgroundOverride === 'object' 
        ? `stretched-${frame.backgroundOverride.position}` 
        : `simple-${frame.backgroundOverride.substring(0, 20)}`)
    : 'default';
  
  const handleUpdateText = (field, value) => onUpdateText?.(carouselId, frame.id, field, value);
  const handleActivateField = (field) => handleActivateFieldWithClear(field);
  
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
    <div className="flex flex-col relative" style={{ width: size.width }}>
      {/* Position Header - appears above card when frame is selected (positioned absolutely to not affect row alignment) */}
      {isFrameSelected && (
        <div 
          className="absolute left-0 flex flex-col items-stretch w-full max-w-[180px]"
          style={{ bottom: '100%', marginBottom: 6 }}
        >
          <div className="text-[9px] text-gray-500 uppercase tracking-wider px-1">
            Frame {frameIndex + 1}
          </div>
        </div>
      )}
      <div 
        key={bgKey}
        data-frame-id={frame.id}
        data-carousel-id={carouselId}
        data-project-key={`carousel-${carouselId}`}
        data-exportable="true"
        className={`relative overflow-hidden shadow-lg cursor-pointer transition-all border ${isFrameSelected ? 'border-[--border-strong]' : 'border-[--border-default] hover:border-[--border-emphasis]'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ width: size.width, height: size.height, backgroundColor: '#ffffff' }}
        onClick={(e) => { e.stopPropagation(); onSelectFrame(frame.id); setSelectedLayer(null); }}
      >
        {/* ===== CUSTOM BACKGROUND LAYERS ===== */}
        {/* Fixed white background is on the container itself (backgroundColor: '#ffffff') */}
        {/* These custom layers use dynamic z-index based on frame.backgroundLayerOrder */}
        
        {/* Fill Color Layer - z-index from getLayerZIndex('fill') */}
        {/* Uses fillOpacity and fillRotation for user adjustments */}
        <div 
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: getLayerZIndex('fill') }}
        >
          <div 
            className="absolute inset-[-50%] w-[200%] h-[200%]"
            style={{
              ...backgroundStyle,
              opacity: frame.fillOpacity !== undefined ? frame.fillOpacity : 1,
              transform: `rotate(${frame.fillRotation || 0}deg)`,
              transformOrigin: 'center center',
            }}
          />
        </div>
        
        {/* Brand Pattern Layer - z-index from getLayerZIndex('pattern') */}
        {frame.patternLayer && (
          <div className="absolute inset-0" style={{ zIndex: getLayerZIndex('pattern') }}>
            <PatternLayer
              patternLayer={frame.patternLayer}
              frameWidth={size.width}
              frameHeight={size.height}
            />
          </div>
        )}
        
        {/* Background Photo Layer - z-index from getLayerZIndex('image'), raises to z-50 when editing */}
        {frame.imageLayer && (
          <div className="absolute inset-0" style={{ zIndex: getLayerZIndex('image') }}>
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
          <div className="absolute inset-0" style={{ zIndex: getLayerZIndex('image') }}>
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
          <div className="absolute inset-0" style={{ zIndex: getLayerZIndex('image') }}>
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
        
        {/* Text Layout - renders above all layers */}
        <div className="absolute inset-0 z-10">
          {renderLayout()}
        </div>
        
        {/* Icon Placeholder - appears on Bottom Stack layouts without a product image or icon, only when frame is selected */}
        {isFrameSelected && layoutIndex === 0 && layoutVariant === 0 && !frame.productImageLayer && !frame.iconLayer && (
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
              className="w-full h-full rounded-[--radius-sm] flex items-center justify-center cursor-pointer transition-colors hover:bg-[--surface-raised]"
              style={{
                border: '1px dashed var(--border-emphasis)',
              }}
              title="Click to add icon"
            >
              <svg className="w-3.5 h-3.5 text-[--text-quaternary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
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
            isSelected={selectedLayer === 'icon'}
            onClick={handleStartIconEdit}
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
              isSelected={selectedLayer === 'productImage'}
              onUpdateLayer={(updates) => onUpdateProductImageLayer?.(carouselId, frame.id, updates)}
              onDragStateChange={onProductImageDragChange}
              onClick={handleStartProductImageEdit}
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
            className={`absolute top-1 left-1 z-20 w-5 h-5 bg-black/70 hover:bg-red-500 rounded-full flex items-center justify-center transition-opacity duration-150 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
      </div>
      
      {/* Controls Area - fixed height to prevent layout snap */}
      <div className={`${isRowSelected && !isDraggingAny ? 'min-h-[52px]' : 'h-0'}`}>
      {/* Layer Indicators - outside frame, below card */}
      {/* Only visible when row is selected, hidden during editing modes and drag operations */}
      {isRowSelected && !isDraggingAny && !isImageEditing && !isFillEditing && !isPatternEditing && !isProductImageEditing && !isIconEditing && !isProgressEditing && (
      <div className="mt-1.5 flex flex-col items-start gap-1">
        {/* Layer chips - show when frame is selected, organized into table sections */}
        {isFrameSelected && (
          <div className="flex flex-col items-stretch w-full max-w-[180px]">
            {/* Foreground Layers Section */}
            <div className="text-[9px] text-gray-500 uppercase tracking-wider px-1 pb-1">Foreground Layers</div>
            <div className="border-t border-gray-600/50">
              {/* 1. Progress Indicator - visible by default, only hidden when explicitly isHidden: true */}
              <div 
                className={`flex items-center gap-1.5 px-2 py-1.5 border-b border-gray-600/50 group cursor-pointer transition-colors hover:bg-gray-700/50 ${
                  frame.progressIndicator?.isHidden === true ? 'opacity-60' : ''
                }`}
                title={frame.progressIndicator?.isHidden === true ? "Add progress indicator" : "Edit progress indicator"}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (frame.progressIndicator?.isHidden === true) {
                    // Hidden - just open design menu, tool panel opens automatically after selection
                    onRequestAddPageIndicator?.();
                  } else {
                    // Visible (default or explicit) - open both design menu and tool panel
                    onRequestAddPageIndicator?.();
                    handleStartProgressEdit();
                  }
                }}
              >
                <svg className={`w-3 h-3 ${frame.progressIndicator?.isHidden === true ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
                <span className={`text-[10px] transition-colors ${
                  frame.progressIndicator?.isHidden === true 
                    ? 'text-gray-500 group-hover:text-gray-300' 
                    : 'text-gray-400 group-hover:text-white'
                }`}>Progress</span>
                {frame.progressIndicator?.isHidden === true ? (
                  <span className="ml-auto text-[8px] text-gray-500 flex items-center gap-0.5"><svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>add</span>
                ) : (
                  <span 
                    className="ml-auto text-[8px] text-gray-600 hover:text-red-400 transition-colors"
                    onClick={(e) => { e.stopPropagation(); onUpdateProgressIndicator?.(carouselId, frame.id, { isHidden: true }); }}
                    title="Clear progress indicator"
                  >clear</span>
                )}
              </div>
              
              {/* 2. Icon - only for eligible layouts */}
              {layoutIndex === 0 && layoutVariant === 0 && (
                <div 
                  className={`flex items-center gap-1.5 px-2 py-1.5 border-b border-gray-600/50 group cursor-pointer transition-colors hover:bg-gray-700/50 ${
                    !frame.iconLayer ? 'opacity-60' : ''
                  }`}
                  title={frame.iconLayer ? "Edit icon" : "Add an icon"}
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onRequestAddIcon?.();
                    if (frame.iconLayer) {
                      handleStartIconEdit();
                    }
                    // If empty, tool panel opens automatically after selection via useEffect
                  }}
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
                    <span className="ml-auto text-[8px] text-gray-500 flex items-center gap-0.5"><svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>add</span>
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
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onRequestAddProductImage?.();
                    if (frame.productImageLayer) {
                      handleStartProductImageEdit();
                    }
                    // If empty, tool panel opens automatically after selection via useEffect
                  }}
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
                    <span className="ml-auto text-[8px] text-gray-500 flex items-center gap-0.5"><svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>add</span>
                  )}
                </div>
              )}
            </div>
            
            {/* Background Layers Section - Drag to reorder */}
            {/* Display order is reversed from data order (topmost layer at top of list) */}
            <div className="text-[9px] text-gray-500 uppercase tracking-wider px-1 pb-1 pt-2">Background Layers</div>
            <div className="border-t border-gray-600/50">
              <DndContext 
                sensors={layerSensors} 
                collisionDetection={closestCenter} 
                onDragEnd={handleLayerDragEnd}
              >
                <SortableContext 
                  items={[...(frame.backgroundLayerOrder || ['fill', 'pattern', 'image'])].reverse()} 
                  strategy={verticalListSortingStrategy}
                >
                  {[...(frame.backgroundLayerOrder || ['fill', 'pattern', 'image'])].reverse().map((layerType) => {
                    // Render the appropriate row based on layer type
                    if (layerType === 'image') {
                      return (
                        <SortableLayerRow key="image" id="image">
                          <div 
                            className={`flex items-center gap-1.5 px-2 py-1.5 border-b border-gray-600/50 group cursor-pointer transition-colors hover:bg-gray-700/50 ${
                              !frame.imageLayer ? 'opacity-60' : ''
                            }`}
                            title={frame.imageLayer ? "Edit image" : "Add an image"}
                            onClick={(e) => { 
                              e.stopPropagation();
                              if (frame.imageLayer) {
                                // If image exists, open tool panel (don't open sidebar)
                                handleStartImageEdit();
                              } else {
                                // If no image, open sidebar to add one
                                onRequestAddPhoto?.();
                              }
                            }}
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
                              <span className="ml-auto text-[8px] text-gray-500 flex items-center gap-0.5"><svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>add</span>
                            )}
                          </div>
                        </SortableLayerRow>
                      );
                    }
                    if (layerType === 'pattern') {
                      return (
                        <SortableLayerRow key="pattern" id="pattern">
                          <div 
                            className={`flex items-center gap-1.5 px-2 py-1.5 border-b border-gray-600/50 group cursor-pointer transition-colors hover:bg-gray-700/50 ${
                              !frame.patternLayer ? 'opacity-60' : ''
                            }`}
                            title={frame.patternLayer ? "Edit pattern" : "Add a pattern"}
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              onRequestAddPattern?.();
                              if (frame.patternLayer) {
                                handleStartPatternEdit();
                              }
                            }}
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
                              <span className="ml-auto text-[8px] text-gray-500 flex items-center gap-0.5"><svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>add</span>
                            )}
                          </div>
                        </SortableLayerRow>
                      );
                    }
                    if (layerType === 'fill') {
                      return (
                        <SortableLayerRow key="fill" id="fill">
                          <div 
                            className={`flex items-center gap-1.5 px-2 py-1.5 border-b border-gray-600/50 group cursor-pointer transition-colors hover:bg-gray-700/50 ${
                              !frame.backgroundOverride ? 'opacity-60' : ''
                            }`}
                            title={frame.backgroundOverride ? "Edit fill color" : "Add a fill color"}
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              onRequestAddFill?.();
                              if (frame.backgroundOverride) {
                                handleStartFillEdit();
                              }
                            }}
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
                              <span className="ml-auto text-[8px] text-gray-500 flex items-center gap-0.5"><svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>add</span>
                            )}
                          </div>
                        </SortableLayerRow>
                      );
                    }
                    return null;
                  })}
                </SortableContext>
              </DndContext>
            </div>
          </div>
        )}
        
      </div>
      )}
      
      {/* Image Edit Controls - appears below frame when editing, hidden during drag */}
      {isImageEditing && !isDraggingAny && frame.imageLayer && (
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
            className="bg-gray-600/90 hover:bg-gray-500 rounded-lg px-2.5 py-1.5 text-white text-[10px] font-medium transition-colors"
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
      
      {/* Fill Color Edit Controls - appears below frame when editing fill, hidden during drag */}
      {isFillEditing && !isDraggingAny && (
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
            className="bg-gray-600/90 hover:bg-gray-500 rounded-lg px-2.5 py-1.5 text-white text-[10px] font-medium transition-colors"
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
      
      {/* Pattern Edit Controls - appears below frame when editing pattern, hidden during drag */}
      {isPatternEditing && !isDraggingAny && frame.patternLayer && (
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
            className="bg-gray-600/90 hover:bg-gray-500 rounded-lg px-2.5 py-1.5 text-white text-[10px] font-medium transition-colors"
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
      
      {/* Product Image Edit Controls - appears below frame when editing product image, hidden during drag */}
      {isProductImageEditing && !isDraggingAny && frame.productImageLayer && (
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
            className="bg-gray-600/90 hover:bg-gray-500 rounded-lg px-2.5 py-1.5 text-white text-[10px] font-medium transition-colors"
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
      
      {/* Icon Edit Controls - appears below frame when editing icon, hidden during drag */}
      {isIconEditing && !isDraggingAny && frame.iconLayer && (
        <IconToolPanel
          frame={frame}
          carouselId={carouselId}
          designSystem={designSystem}
          onUpdateIconLayer={onUpdateIconLayer}
          onRequestAddIcon={onRequestAddIcon}
          onDelete={handleDeleteIcon}
          onCancel={handleCancelIconEdit}
          onDone={handleDoneIconEdit}
        />
      )}
      
      {/* Progress Edit Controls - appears below frame when editing progress indicator, hidden during drag */}
      {isProgressEditing && !isDraggingAny && (
        <ProgressToolPanel
          frame={frame}
          carouselId={carouselId}
          designSystem={designSystem}
          onUpdateProgressIndicator={onUpdateProgressIndicator}
          onCancel={handleCancelProgressEdit}
          onDone={handleDoneProgressEdit}
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
  // Background layer order props
  onReorderBackgroundLayers,
  // Additional callbacks
  onRequestAddFill,
  onRequestAddPhoto,
  onRequestAddPattern,
  onRequestAddPageIndicator,
  // Cross-frame overflow
  prevFrameImage,
  nextFrameImage,
  // Global drag state from row
  isDraggingAny,
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
        onReorderBackgroundLayers={onReorderBackgroundLayers}
        onRequestAddFill={onRequestAddFill}
        onRequestAddPhoto={onRequestAddPhoto}
        onRequestAddPattern={onRequestAddPattern}
        onRequestAddPageIndicator={onRequestAddPageIndicator}
        prevFrameImage={prevFrameImage}
        nextFrameImage={nextFrameImage}
        onImageEditModeChange={setIsImageEditing}
        isRowSelected={isRowSelected}
        isDragging={isDragging}
        isDraggingAny={isDraggingAny}
      />
    </div>
  );
};

export default CarouselFrame;
