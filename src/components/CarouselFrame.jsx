import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { frameSizes, getFontSizes, getFrameStyle } from '../data';
import { LayoutBottomStack, LayoutCenterDrama, LayoutEditorialLeft } from './Layouts';
import ImageLayer from './ImageLayer';
import PatternLayer from './PatternLayer';

/**
 * Progress Dots Overlay
 * Shows current frame position in carousel
 */
const ProgressDotsOverlay = ({ frameId, isFrameSelected, isHovered, isProgressHidden, onToggleHidden }) => {
  const [isProgressHovered, setIsProgressHovered] = useState(false);
  
  return (
    <div 
      className="flex items-center gap-1 cursor-pointer min-w-[40px] min-h-[20px] justify-end"
      onMouseEnter={() => setIsProgressHovered(true)}
      onMouseLeave={() => setIsProgressHovered(false)}
      onClick={(e) => { if (isFrameSelected) { e.stopPropagation(); onToggleHidden(); } }}
    >
      {isFrameSelected && (isProgressHovered || (isProgressHidden && isHovered)) ? (
        <div className="flex items-center justify-center w-5 h-5 bg-black/50 rounded-full hover:bg-black/70 transition-colors">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isProgressHidden ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            )}
          </svg>
        </div>
      ) : !isProgressHidden ? (
        [1,2,3,4,5].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === frameId ? 'bg-white' : 'bg-white/30'}`} />)
      ) : null}
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
  // Background props
  onClearBackground,
  // Cross-frame overflow
  prevFrameImage = null,
  nextFrameImage = null,
  // Callback for image edit mode (to disable drag during edit)
  onImageEditModeChange,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isProgressHidden, setIsProgressHidden] = useState(false);
  const [imageEditTrigger, setImageEditTrigger] = useState(0);
  const [isImageEditing, setIsImageEditing] = useState(false);
  
  // Notify parent (SortableFrame) when image edit mode changes
  const handleImageEditModeChange = (editing) => {
    setIsImageEditing(editing);
    onImageEditModeChange?.(editing);
  };
  
  const style = getFrameStyle(carouselId, frame.style, designSystem);
  const content = frame.variants[frame.currentVariant];
  const layoutIndex = frame.currentLayout || 0;
  const size = frameSizes[frameSize] || frameSizes.portrait;
  const isLandscape = frameSize === 'landscape' || frameSize === 'slides';
  const formatting = frame.variants[frame.currentVariant]?.formatting || {};
  const layoutVariant = frame.layoutVariant || 0;
  
  // Compute background style - handles both simple string and stretched gradient objects
  const getBackgroundStyle = () => {
    const bgOverride = frame.backgroundOverride;
    if (!bgOverride) {
      return { background: style.background };
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
        style={{ width: size.width, height: size.height, backgroundColor: '#18191A' }}
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
        {/* When an image is present, apply 70% opacity so photo shows through */}
        <div 
          className="absolute inset-0 z-[3] pointer-events-none"
          style={{
            ...backgroundStyle,
            opacity: frame.imageLayer ? 0.7 : 1,
          }}
        />
        
        {/* Text Layout - renders above all layers */}
        <div className="absolute inset-0 z-10">
          {renderLayout()}
        </div>
        
        {/* Progress Dots Overlay - Hidden during image editing */}
        {!isImageEditing && (
          <div className="absolute top-2 right-2 z-10">
            <ProgressDotsOverlay 
              frameId={frame.id}
              isFrameSelected={isFrameSelected}
              isHovered={isHovered}
              isProgressHidden={isProgressHidden}
              onToggleHidden={() => setIsProgressHidden(!isProgressHidden)}
            />
          </div>
        )}
        
        {/* Remove Button - Hidden during image editing */}
        {totalFrames > 1 && !isImageEditing && (
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
      
      {/* Layer Indicators - outside frame, below card */}
      {/* Always render this row to maintain consistent card heights */}
      <div className="h-6 mt-1.5 flex items-center gap-2">
        {/* Gradient Indicator */}
        {frame.backgroundOverride && (
          <div 
            className="flex items-center gap-1 px-2 py-1 bg-gray-800/80 rounded-full group"
            title="This frame has a custom gradient/background"
          >
            <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <span className="text-[10px] text-gray-400">Gradient</span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onClearBackground?.(carouselId, frame.id); }}
              className="w-3.5 h-3.5 flex items-center justify-center rounded-full hover:bg-gray-600 transition-colors ml-0.5"
              title="Remove gradient"
            >
              <svg className="w-2.5 h-2.5 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {/* Image Indicator - Click to edit, X to remove */}
        {frame.imageLayer && !isImageEditing && (
          <div 
            className="flex items-center gap-1 px-2 py-1 bg-gray-800/80 rounded-full group cursor-pointer hover:bg-gray-700/80 transition-colors"
            title="Click to edit image position & size"
            onClick={(e) => { e.stopPropagation(); setImageEditTrigger(prev => prev + 1); }}
          >
            <svg className="w-3 h-3 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[10px] text-gray-400 group-hover:text-white transition-colors">Image</span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemoveImageFromFrame?.(carouselId, frame.id); }}
              className="w-3.5 h-3.5 flex items-center justify-center rounded-full hover:bg-gray-600 transition-colors ml-0.5"
              title="Remove image"
            >
              <svg className="w-2.5 h-2.5 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* Image Edit Controls - appears below frame when editing */}
      {isImageEditing && frame.imageLayer && (
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-gray-800/90 rounded-lg px-2 py-1.5">
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
              className="ml-1 px-1.5 py-0.5 text-gray-500 hover:text-white text-[9px] hover:bg-white/10 rounded transition-colors"
              title="Reset zoom to 100%"
            >
              Reset
            </button>
          </div>

          {/* Opacity Control */}
          <div className="flex items-center gap-1 bg-gray-800/90 rounded-lg px-2 py-1.5">
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
              className="ml-1 px-1.5 py-0.5 text-gray-500 hover:text-white text-[9px] hover:bg-white/10 rounded transition-colors"
              title="Reset opacity to 100%"
            >
              Reset
            </button>
          </div>

          {/* Done Button */}
          <button
            type="button"
            onClick={() => handleImageEditModeChange(false)}
            className="bg-orange-500/90 hover:bg-orange-500 rounded-lg px-2.5 py-1.5 text-white text-[10px] font-medium transition-colors"
            title="Done editing"
          >
            Done
          </button>

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => { handleImageEditModeChange(false); onRemoveImageFromFrame?.(carouselId, frame.id); }}
            className="bg-gray-800/90 hover:bg-red-600 rounded-lg px-2 py-1.5 text-gray-400 hover:text-white transition-colors"
            title="Remove image"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
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
  // Background props
  onClearBackground,
  // Cross-frame overflow
  prevFrameImage,
  nextFrameImage,
}) => {
  const [isImageEditing, setIsImageEditing] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({ 
    id,
    disabled: !isRowSelected || isImageEditing, // Disable drag when editing image
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
        prevFrameImage={prevFrameImage}
        nextFrameImage={nextFrameImage}
        onImageEditModeChange={setIsImageEditing}
      />
    </div>
  );
};

export default CarouselFrame;
