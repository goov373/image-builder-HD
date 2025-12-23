import { useState } from 'react';
import { frameSizes, getFontSizes } from '../data';
import { getVideoCoverStyle } from '../data/initialVideoCovers';
import { LayoutBottomStack, LayoutCenterDrama, LayoutEditorialLeft } from './Layouts';
import { VideoFaceText, VideoBoldStatement, VideoEpisodeCard, VideoPlayOverlay } from './layouts/VideoCoverLayouts';
import { PlayButtonOverlay, EpisodeNumber } from './overlays';

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
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const frame = videoCover.frame;
  const style = getVideoCoverStyle(frame.style, designSystem);
  const content = frame.variants[frame.currentVariant];
  const layoutIndex = frame.currentLayout || 0;
  const size = frameSizes[videoCover.frameSize] || frameSizes.youtube;
  const formatting = frame.variants[frame.currentVariant]?.formatting || {};
  const layoutVariant = frame.layoutVariant || 0;
  
  const handleUpdateText = (field, value) => onUpdateText?.(videoCover.id, frame.id, field, value);
  const handleActivateField = (field) => onActivateTextField?.(field);
  
  const renderLayout = () => {
    const fontSizes = getFontSizes(videoCover.frameSize);
    const props = {
      headline: content.headline,
      body: content.body,
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
          isSelected ? 'ring-2 ring-orange-500' : 'hover:ring-2 hover:ring-gray-500'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ 
          background: style.background, 
          width: size.width, 
          height: size.height 
        }}
        onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
      >
        {/* Layout Content */}
        {renderLayout()}
        
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

