import { useState } from 'react';
import { frameSizes, getFontSizes, getFrameStyle } from '../data';

/**
 * Generic Content Frame Component
 * Shared frame renderer for all project types (Carousel, Eblast, Video Cover)
 * 
 * @param {Object} props
 * @param {Object} props.frame - Frame data (variants, currentVariant, currentLayout, etc.)
 * @param {number} props.carouselId - Parent container ID
 * @param {string} props.frameSize - Size key (portrait, emailHero, youtube, etc.)
 * @param {Object} props.designSystem - Design system colors and fonts
 * @param {number} props.frameIndex - Index in the parent container
 * @param {number} props.totalFrames - Total frames in container
 * @param {boolean} props.isFrameSelected - Whether this frame is selected
 * @param {Function} props.onSelectFrame - Frame selection handler
 * @param {Function} props.onRemove - Frame removal handler
 * @param {Function} props.onUpdateText - Text update handler
 * @param {string} props.activeTextField - Currently active text field
 * @param {Function} props.onActivateTextField - Text field activation handler
 * @param {Function} props.renderLayout - Custom layout renderer
 * @param {React.ReactNode} props.overlaySlot - Custom overlay content (progress dots, play button, etc.)
 * @param {boolean} props.showRemoveButton - Whether to show remove button on hover
 * @param {string} props.projectType - Project type for styling variations
 */
const ContentFrame = ({ 
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
  renderLayout,
  overlaySlot,
  showRemoveButton = true,
  projectType = 'carousel',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const style = getFrameStyle(carouselId, frame.style, designSystem);
  const content = frame.variants[frame.currentVariant];
  const size = frameSizes[frameSize] || frameSizes.portrait;
  const isLandscape = frameSize === 'landscape' || frameSize === 'slides' || 
                      frameSize === 'youtube' || frameSize === 'linkedinVideo' || 
                      frameSize === 'twitterVideo' || frameSize.startsWith('email');
  const formatting = frame.variants[frame.currentVariant]?.formatting || {};
  const layoutVariant = frame.layoutVariant || 0;
  
  const handleUpdateText = (field, value) => onUpdateText?.(carouselId, frame.id, field, value);
  const handleActivateField = (field) => onActivateTextField?.(field);
  
  // Default layout renderer if not provided
  const defaultRenderLayout = () => {
    const fontSizes = getFontSizes(frameSize);
    const LayoutComponent = require('./Layouts').LayoutBottomStack;
    return (
      <LayoutComponent
        headline={content.headline}
        body={content.body}
        text={style.text}
        accent={style.accent}
        isLandscape={isLandscape}
        headingFont={designSystem.fontHeadline || designSystem.headingFont}
        bodyFont={designSystem.fontBody || designSystem.bodyFont}
        variant={layoutVariant}
        isFrameSelected={isFrameSelected}
        onUpdateText={handleUpdateText}
        activeField={activeTextField}
        onActivateField={handleActivateField}
        formatting={formatting}
        fontSizes={fontSizes}
      />
    );
  };
  
  return (
    <div className="flex flex-col" style={{ width: size.width }}>
      <div 
        className={`relative overflow-hidden shadow-lg cursor-pointer transition-all border ${
          isFrameSelected ? 'border-gray-400 ring-2 ring-gray-400/50' : 'border-gray-600 hover:border-gray-500'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ 
          background: style.background, 
          width: size.width, 
          height: size.height,
          borderRadius: projectType === 'eblast' ? '4px' : '0px',
        }}
        onClick={(e) => { e.stopPropagation(); onSelectFrame?.(frame.id); }}
      >
        {/* Layout Content */}
        {renderLayout ? renderLayout({
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
          fontSizes: getFontSizes(frameSize),
        }) : defaultRenderLayout()}
        
        {/* Overlay Slot (progress dots, play button, etc.) */}
        {overlaySlot && (
          <div className="absolute top-2 right-2 z-10">
            {overlaySlot}
          </div>
        )}
        
        {/* Remove Button */}
        {showRemoveButton && totalFrames > 1 && (
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove?.(frame.id); }} 
            className={`absolute top-2 left-2 z-20 w-6 h-6 bg-black/70 hover:bg-red-500 rounded-full flex items-center justify-center transition-opacity duration-150 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ContentFrame;

