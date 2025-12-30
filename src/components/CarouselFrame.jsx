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
  // Cross-frame overflow
  prevFrameImage = null,
  nextFrameImage = null,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isProgressHidden, setIsProgressHidden] = useState(false);
  
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
        className={`relative overflow-hidden shadow-lg cursor-pointer transition-all border ${isFrameSelected ? 'border-gray-400 ring-2 ring-gray-400/50' : 'border-gray-600 hover:border-gray-500'}`}
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
        
        {/* Layer 2: Image - behind gradient (z-index: 2) */}
        {frame.imageLayer && (
          <div className="absolute inset-0 z-[2]">
            <ImageLayer
              imageLayer={frame.imageLayer}
              frameWidth={size.width}
              frameHeight={size.height}
              isFrameSelected={isFrameSelected}
              onUpdate={(updates) => onUpdateImageLayer?.(carouselId, frame.id, updates)}
              onRemove={() => onRemoveImageFromFrame?.(carouselId, frame.id)}
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
        <div 
          className="absolute inset-0 z-[3] pointer-events-none"
          style={backgroundStyle}
        />
        
        {/* Text Layout - renders above all layers */}
        <div className="absolute inset-0 z-10">
          {renderLayout()}
        </div>
        
        {/* Progress Dots Overlay */}
        <div className="absolute top-2 right-2 z-10">
          <ProgressDotsOverlay 
            frameId={frame.id}
            isFrameSelected={isFrameSelected}
            isHovered={isHovered}
            isProgressHidden={isProgressHidden}
            onToggleHidden={() => setIsProgressHidden(!isProgressHidden)}
          />
        </div>
        
        {/* Remove Button */}
        {totalFrames > 1 && (
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
        
        {/* Image Layer Indicator */}
        {frame.imageLayer && (
          <div 
            className={`absolute bottom-2 left-2 z-20 flex items-center gap-1.5 px-2 py-1 bg-black/70 rounded-full transition-opacity duration-150 ${isHovered || isFrameSelected ? 'opacity-100' : 'opacity-60'}`}
            title="This frame has an image layer. Double-click image to edit."
          >
            <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[10px] text-white/80">Image</span>
          </div>
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
  // Cross-frame overflow
  prevFrameImage,
  nextFrameImage,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({ 
    id,
    disabled: !isRowSelected,
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
        prevFrameImage={prevFrameImage}
        nextFrameImage={nextFrameImage}
      />
    </div>
  );
};

export default CarouselFrame;
