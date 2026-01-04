import { useState } from 'react';
import { frameSizes, getFontSizes } from '../data';
import { getEblastSectionStyle } from '../data/initialEblasts';
import { LayoutBottomStack, LayoutCenterDrama, LayoutEditorialLeft } from './Layouts';
import { EblastHeroOverlay, EblastSplit5050, EblastCTABanner, EblastTextBlock } from './layouts/EblastLayouts';
import PatternLayer from './PatternLayer';
import ImageLayer from './ImageLayer';

/**
 * Section Type Badge
 */
const SectionTypeBadge = ({ type }) => {
  const colors = {
    header: 'bg-[--surface-overlay] text-[--text-secondary]',
    hero: 'bg-blue-500/20 text-blue-400',
    feature: 'bg-teal-500/20 text-teal-400',
    cta: 'bg-orange-500/20 text-orange-400',
    footer: 'bg-gray-500/20 text-tertiary',
  };

  return (
    <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium uppercase ${colors[type] || colors.feature}`}>
      {type}
    </span>
  );
};

/**
 * Eblast Section Component
 * Single section in an email campaign (vertical display)
 */
const EblastSection = ({
  section,
  eblastId,
  designSystem,
  sectionIndex,
  totalSections,
  isSectionSelected,
  onSelectSection,
  onRemove,
  onUpdateText,
  activeTextField,
  onActivateTextField,
  // Layer handlers
  onUpdateImageLayer,
  onRemoveImageFromSection,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const defaultStyle = getEblastSectionStyle(section.style, designSystem);
  const content = section.variants[section.currentVariant];
  const layoutIndex = section.currentLayout || 0;
  const size = frameSizes[section.size] || frameSizes.emailHero;
  const formatting = section.variants[section.currentVariant]?.formatting || {};
  const layoutVariant = section.layoutVariant || 0;

  // Compute background style - handles both simple string and stretched gradient objects
  const getBackgroundStyle = () => {
    const bgOverride = section.backgroundOverride;
    if (!bgOverride) {
      return { background: defaultStyle.background };
    }
    if (typeof bgOverride === 'object' && bgOverride.isStretched) {
      // IMPORTANT: Use backgroundImage (not background shorthand) to prevent it from resetting size/position
      return {
        backgroundImage: bgOverride.gradient,
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

  const handleUpdateText = (field, value) => onUpdateText?.(eblastId, section.id, field, value);
  const handleActivateField = (field) => onActivateTextField?.(field);

  const renderLayout = () => {
    const fontSizes = getFontSizes(section.size);
    const props = {
      headline: content.headline,
      body: content.body,
      text: style.text,
      accent: style.accent,
      headingFont: designSystem.fontHeadline || designSystem.headingFont,
      bodyFont: designSystem.fontBody || designSystem.bodyFont,
      variant: layoutVariant,
      isFrameSelected: isSectionSelected,
      onUpdateText: handleUpdateText,
      activeField: activeTextField,
      onActivateField: handleActivateField,
      formatting,
      fontSizes,
      ctaText: section.ctaText,
      isLandscape: true, // Email sections are always landscape-ish
    };

    // Use eblast-specific layouts first, fall back to core layouts
    switch (layoutIndex) {
      case 3:
        return <EblastHeroOverlay {...props} />;
      case 4:
        return <EblastSplit5050 {...props} />;
      case 5:
        return <EblastCTABanner {...props} />;
      case 6:
        return <EblastTextBlock {...props} />;
      case 1:
        return <LayoutCenterDrama {...props} />;
      case 2:
        return <LayoutEditorialLeft {...props} />;
      default:
        return <LayoutBottomStack {...props} />;
    }
  };

  return (
    <div
      className={`relative transition-all duration-150 ${isSectionSelected ? '' : ''}`}
      style={{ width: size.width }}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">{sectionIndex + 1}</span>
          <SectionTypeBadge type={section.sectionType} />
        </div>
        {isSectionSelected && (
          <span className="text-[9px] bg-gray-600 text-gray-300 px-1.5 py-0.5 rounded font-medium">EDITING</span>
        )}
      </div>

      {/* Section Frame */}
      <div
        className={`relative overflow-hidden shadow-lg cursor-pointer transition-all rounded border ${
          isSectionSelected ? 'ring-2 ring-gray-400/50 border-gray-400' : 'border-gray-600 hover:border-gray-500'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          ...backgroundStyle,
          width: size.width,
          height: size.height,
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelectSection?.(section.id);
        }}
      >
        {/* Pattern Layer - absolute backmost (z-index: -2) */}
        {section.patternLayer && (
          <PatternLayer patternLayer={section.patternLayer} frameWidth={size.width} frameHeight={size.height} />
        )}

        {/* Image Layer - behind text (z-index: 0) */}
        {section.imageLayer && (
          <ImageLayer
            imageLayer={section.imageLayer}
            frameWidth={size.width}
            frameHeight={size.height}
            isFrameSelected={isSectionSelected}
            onUpdate={(updates) => onUpdateImageLayer?.(eblastId, section.id, updates)}
            onRemove={() => onRemoveImageFromSection?.(eblastId, section.id)}
          />
        )}

        {/* Text Layout - z-index: 10 */}
        <div className="absolute inset-0 z-10">{renderLayout()}</div>

        {/* Remove Button */}
        {totalSections > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.(section.id);
            }}
            className={`absolute top-2 right-2 z-20 w-6 h-6 bg-black/70 hover:bg-red-500 rounded-full flex items-center justify-center transition-opacity duration-150 ${
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

export default EblastSection;
