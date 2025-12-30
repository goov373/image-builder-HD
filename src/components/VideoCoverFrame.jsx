import { useState } from 'react';
import { frameSizes, getFontSizes } from '../data';
import { getVideoCoverStyle } from '../data/initialVideoCovers';
import { LayoutBottomStack, LayoutCenterDrama, LayoutEditorialLeft } from './Layouts';
import { VideoFaceText, VideoBoldStatement, VideoEpisodeCard, VideoPlayOverlay } from './layouts/VideoCoverLayouts';
import { PlayButtonOverlay, EpisodeNumber } from './overlays';
import PatternLayer from './PatternLayer';
import ImageLayer from './ImageLayer';

/**
 * Video Cover Frame Component
 * Single frame renderer for video thumbnails
 */
const VideoCoverFrame = ({
  videoCover,
  designSystem,
  isSelected,
  onSelect,
  onUpdateText,
  activeTextField,
  onActivateTextField,
  // Layer handlers
  onUpdateImage,
  onRemoveImage,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const frame = videoCover.frame;
  const defaultStyle = getVideoCoverStyle(frame.style, designSystem);
  const content = frame.variants[frame.currentVariant];
  const layoutIndex = frame.currentLayout || 0;
  const size = frameSizes[videoCover.frameSize] || frameSizes.youtube;
  const formatting = frame.variants[frame.currentVariant]?.formatting || {};
  const layoutVariant = frame.layoutVariant || 0;
  
  // Compute background style - handles both simple string and stretched gradient objects
  const getBackgroundStyle = () => {
    const bgOverride = frame.backgroundOverride;
    if (!bgOverride) {
      return { background: defaultStyle.background };
    }
    if (typeof bgOverride === 'object' && bgOverride.isStretched) {
      return {
        background: bgOverride.gradient,
        backgroundSize: bgOverride.size,
        backgroundPosition: bgOverride.position,
        backgroundRepeat: 'no-repeat',
      };
    }
    return { background: bgOverride };
  };
  const backgroundStyle = getBackgroundStyle();
  
  // Use default style for text colors
  const style = { ...defaultStyle, ...backgroundStyle };
  
  const handleUpdateText = (field, value) => onUpdateText?.(videoCover.id, frame.id, field, value);
  const handleActivateField = (field) => onActivateTextField?.(field);
  
  const renderLayout = () => {
    const fontSizes = getFontSizes(videoCover.frameSize);
    const props = {
      headline: content.headline,
      body: content.body,
      text: style.text,
      accent: style.accent,
      headingFont: designSystem.fontHeadline || designSystem.headingFont,
      bodyFont: designSystem.fontBody || designSystem.bodyFont,
      variant: layoutVariant,
      isFrameSelected: isSelected,
      onUpdateText: handleUpdateText,
      activeField: activeTextField,
      onActivateField: handleActivateField,
      formatting,
      fontSizes,
      isLandscape: true,
      // Video-specific props
      showPlayButton: videoCover.showPlayButton,
      episodeNumber: videoCover.episodeNumber,
      seriesName: videoCover.seriesName,
    };
    
    // Use video-specific layouts first, fall back to core layouts
    switch (layoutIndex) {
      case 7: return <VideoFaceText {...props} />;
      case 8: return <VideoBoldStatement {...props} />;
      case 9: return <VideoEpisodeCard {...props} />;
      case 10: return <VideoPlayOverlay {...props} />;
      case 1: return <LayoutCenterDrama {...props} />;
      case 2: return <LayoutEditorialLeft {...props} />;
      default: return <LayoutBottomStack {...props} />;
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      {/* Frame Size Indicator */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xs text-gray-400">{size.name}</span>
        <span className="text-[10px] text-gray-600">{size.spec}</span>
      </div>
      
      {/* Main Frame */}
      <div 
        className={`relative overflow-hidden shadow-xl cursor-pointer transition-all rounded-lg ${
          isSelected ? 'ring-2 ring-gray-400' : 'hover:ring-2 hover:ring-gray-500'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ 
          ...backgroundStyle, 
          width: size.width, 
          height: size.height 
        }}
        onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
      >
        {/* Pattern Layer - absolute backmost (z-index: -2) */}
        {frame.patternLayer && (
          <PatternLayer
            patternLayer={frame.patternLayer}
            frameWidth={size.width}
            frameHeight={size.height}
          />
        )}
        
        {/* Image Layer - behind text (z-index: 0) */}
        {frame.imageLayer && (
          <ImageLayer
            imageLayer={frame.imageLayer}
            frameWidth={size.width}
            frameHeight={size.height}
            isFrameSelected={isSelected}
            onUpdate={(updates) => onUpdateImage?.(videoCover.id, updates)}
            onRemove={() => onRemoveImage?.(videoCover.id)}
          />
        )}
        
        {/* Layout Content (z-index: 10) */}
        <div className="absolute inset-0 z-10">
          {renderLayout()}
        </div>
        
        {/* Play Button Overlay (if not using PlayOverlay layout) */}
        {videoCover.showPlayButton && layoutIndex !== 10 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <PlayButtonOverlay 
              isVisible={true}
              accentColor={style.accent}
              size="medium"
              style="filled"
            />
          </div>
        )}
        
        {/* Episode Number Badge (if not using EpisodeCard layout) */}
        {videoCover.episodeNumber && layoutIndex !== 9 && (
          <EpisodeNumber 
            number={videoCover.episodeNumber}
            backgroundColor={style.accent}
            position="top-left"
            size="medium"
          />
        )}
      </div>
      
      {/* Platform indicator */}
      <div className="mt-3 text-[10px] text-gray-500">
        {size.platforms}
      </div>
    </div>
  );
};

export default VideoCoverFrame;

