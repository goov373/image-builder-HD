import EditableTextField from './EditableTextField';

// Common text wrapping styles - text wraps within bounds
const textWrapStyles = { wordWrap: 'break-word', overflowWrap: 'break-word', hyphens: 'auto' };

/**
 * Layout Component - Bottom Stack
 * Text stacked at bottom with gradient overlay
 */
export const LayoutBottomStack = ({
  headline,
  body,
  text,
  accent: _accent,
  isLandscape,
  headingFont,
  bodyFont,
  variant = 0,
  isFrameSelected,
  onUpdateText,
  activeField,
  onActivateField,
  formatting = {},
  fontSizes = {},
}) => {
  const getAlignment = () => {
    switch (variant) {
      case 1:
        return 'justify-start pt-10'; // Extra padding to clear progress indicator
      case 2:
        return 'justify-center';
      default:
        return 'justify-end';
    }
  };

  const getGradient = () => {
    switch (variant) {
      case 1:
        return 'bg-gradient-to-b from-black/70 via-black/20 to-transparent';
      case 2:
        return 'bg-black/40';
      default:
        return 'bg-gradient-to-t from-black/70 via-black/20 to-transparent';
    }
  };

  const commonProps = { isFrameSelected, onActivate: onActivateField, onUpdateText };

  const getLandscapeAlignment = () => {
    switch (variant) {
      case 1:
        return 'items-start pt-8'; // Top - extra padding for progress indicator
      case 2:
        return 'items-center'; // Center
      default:
        return 'items-end'; // Bottom
    }
  };

  const getLandscapeGradient = () => {
    switch (variant) {
      case 1:
        return 'bg-gradient-to-b from-black/80 via-black/40 to-transparent';
      case 2:
        return 'bg-black/50';
      default:
        return 'bg-gradient-to-t from-black/80 via-black/40 to-transparent';
    }
  };

  // Apply formatting.fontSize as a multiplier (S=0.85, M=1, L=1.2)
  const headlineFontSize = (formatting.headline?.fontSize || 1) * (fontSizes.headline || 14);
  const bodyFontSize = (formatting.body?.fontSize || 1) * (fontSizes.body || 12);

  const headlineStyle = {
    color: text || '#ffffff',
    fontFamily: headingFont,
    fontSize: headlineFontSize,
    fontWeight: 700,
    lineHeight: fontSizes.lineHeight || 1.3,
    ...textWrapStyles,
  };
  const bodyStyle = {
    fontFamily: bodyFont,
    fontSize: bodyFontSize,
    fontWeight: 400,
    lineHeight: fontSizes.lineHeight || 1.4,
    ...textWrapStyles,
  };

  if (isLandscape) {
    return (
      <div className={`absolute inset-0 flex ${getLandscapeAlignment()} px-3 py-3 ${getLandscapeGradient()}`}>
        <div className="flex items-center justify-between w-full gap-4">
          <EditableTextField
            {...commonProps}
            field="headline"
            isActive={activeField === 'headline'}
            formatting={formatting.headline || {}}
            className="leading-tight block flex-1 min-w-0"
            style={headlineStyle}
          >
            {headline}
          </EditableTextField>
          <EditableTextField
            {...commonProps}
            field="body"
            isActive={activeField === 'body'}
            formatting={formatting.body || {}}
            className="text-gray-200 leading-snug text-right block max-w-[40%] min-w-0"
            style={bodyStyle}
          >
            {body}
          </EditableTextField>
        </div>
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 flex flex-col ${getAlignment()} p-4 ${getGradient()}`}>
      <div className="relative mb-1.5 w-full">
        <EditableTextField
          {...commonProps}
          field="headline"
          isActive={activeField === 'headline'}
          formatting={formatting.headline || {}}
          className="leading-tight block w-full"
          style={headlineStyle}
        >
          {headline}
        </EditableTextField>
      </div>
      <div className="relative w-full">
        <EditableTextField
          {...commonProps}
          field="body"
          isActive={activeField === 'body'}
          formatting={formatting.body || {}}
          className="text-gray-200 leading-snug block w-full"
          style={bodyStyle}
        >
          {body}
        </EditableTextField>
      </div>
    </div>
  );
};

/**
 * Layout Component - Center Drama
 * Centered text with dramatic styling
 */
export const LayoutCenterDrama = ({
  headline,
  body,
  text,
  accent,
  isLandscape,
  headingFont,
  bodyFont,
  variant = 0,
  isFrameSelected,
  onUpdateText,
  activeField,
  onActivateField,
  formatting = {},
  fontSizes = {},
}) => {
  const getAlignment = () => {
    switch (variant) {
      case 1:
        return 'justify-end pb-6';
      case 2:
        return 'justify-start pt-10'; // Extra padding to clear progress indicator
      default:
        return 'justify-center';
    }
  };

  const commonProps = { isFrameSelected, onActivate: onActivateField, onUpdateText };

  const getLandscapeAlignment = () => {
    switch (variant) {
      case 1:
        return 'items-end'; // Bottom
      case 2:
        return 'items-start pt-8'; // Top - extra padding for progress indicator
      default:
        return 'items-center'; // Center
    }
  };

  const getLandscapeGradient = () => {
    switch (variant) {
      case 1:
        return 'bg-gradient-to-t from-black/80 via-black/40 to-transparent';
      case 2:
        return 'bg-gradient-to-b from-black/80 via-black/40 to-transparent';
      default:
        return 'bg-black/50';
    }
  };

  // Apply formatting.fontSize as a multiplier (S=0.85, M=1, L=1.2)
  const headlineFontSize = (formatting.headline?.fontSize || 1) * ((fontSizes.headline || 14) + 2);
  const bodyFontSize = (formatting.body?.fontSize || 1) * (fontSizes.body || 12);

  const headlineStyle = {
    color: text || '#ffffff',
    fontFamily: headingFont,
    fontSize: headlineFontSize,
    fontWeight: 700,
    lineHeight: fontSizes.lineHeight || 1.3,
    ...textWrapStyles,
  };
  const bodyStyle = {
    fontFamily: bodyFont,
    fontSize: bodyFontSize,
    fontWeight: 400,
    lineHeight: (fontSizes.lineHeight || 1.4) + 0.1,
    ...textWrapStyles,
  };

  if (isLandscape) {
    return (
      <div
        className={`absolute inset-0 flex ${getLandscapeAlignment()} justify-center px-3 py-3 ${getLandscapeGradient()}`}
      >
        <div className="flex items-center gap-4 max-w-[95%]">
          <EditableTextField
            {...commonProps}
            field="headline"
            isActive={activeField === 'headline'}
            formatting={formatting.headline || {}}
            className="font-black leading-tight tracking-tight block flex-1 min-w-0"
            style={headlineStyle}
          >
            {headline}
          </EditableTextField>
          <div className="w-0.5 h-8 rounded-full flex-shrink-0" style={{ background: accent, opacity: 0.6 }} />
          <EditableTextField
            {...commonProps}
            field="body"
            isActive={activeField === 'body'}
            formatting={formatting.body || {}}
            className="text-gray-300 leading-snug font-medium block max-w-[35%] min-w-0"
            style={bodyStyle}
          >
            {body}
          </EditableTextField>
        </div>
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 flex flex-col items-center ${getAlignment()} p-4 text-center bg-black/40`}>
      <div className="max-w-[90%] w-full">
        <div className="relative mb-3 w-full">
          <EditableTextField
            {...commonProps}
            field="headline"
            isActive={activeField === 'headline'}
            formatting={formatting.headline || {}}
            className="font-black leading-tight tracking-tight block w-full"
            style={headlineStyle}
          >
            {headline}
          </EditableTextField>
        </div>
        <div className="w-12 h-0.5 mx-auto mb-3 rounded-full" style={{ background: accent, opacity: 0.6 }} />
        <div className="relative w-full">
          <EditableTextField
            {...commonProps}
            field="body"
            isActive={activeField === 'body'}
            formatting={formatting.body || {}}
            className="text-gray-300 leading-relaxed font-medium block w-full"
            style={bodyStyle}
          >
            {body}
          </EditableTextField>
        </div>
      </div>
    </div>
  );
};

/**
 * Layout Component - Editorial Left
 * Editorial style with accent bars
 */
export const LayoutEditorialLeft = ({
  headline,
  body,
  text,
  accent,
  isLandscape,
  headingFont,
  bodyFont,
  variant = 0,
  isFrameSelected,
  onUpdateText,
  activeField,
  onActivateField,
  formatting = {},
  fontSizes = {},
}) => {
  const getHeadlineAlign = () => {
    switch (variant) {
      case 1:
        return 'items-center text-center';
      case 2:
        return 'items-end text-right';
      default:
        return 'items-start text-left';
    }
  };

  const getAccentAlign = () => {
    switch (variant) {
      case 1:
        return 'mx-auto';
      case 2:
        return 'ml-auto';
      default:
        return '';
    }
  };

  const getBodyAlign = () => {
    switch (variant) {
      case 1:
        return 'self-center text-center';
      case 2:
        return 'self-start text-left';
      default:
        return 'self-end text-right';
    }
  };

  const commonProps = { isFrameSelected, onActivate: onActivateField, onUpdateText };

  const getLandscapeContentAlign = () => {
    switch (variant) {
      case 1:
        return 'justify-center'; // Center
      case 2:
        return 'justify-end'; // Right
      default:
        return 'justify-start'; // Left
    }
  };

  // Apply formatting.fontSize as a multiplier (S=0.85, M=1, L=1.2)
  const headlineFontSize = (formatting.headline?.fontSize || 1) * (fontSizes.headline || 14);
  const bodyFontSize = (formatting.body?.fontSize || 1) * (fontSizes.body || 12);

  const headlineStyle = {
    color: text || '#ffffff',
    fontFamily: headingFont,
    fontSize: headlineFontSize,
    fontWeight: 700,
    lineHeight: fontSizes.lineHeight || 1.3,
    ...textWrapStyles,
  };
  const bodyStyle = {
    fontFamily: bodyFont,
    fontSize: bodyFontSize,
    fontWeight: 400,
    lineHeight: fontSizes.lineHeight || 1.4,
    ...textWrapStyles,
  };

  if (isLandscape) {
    return (
      <div className={`absolute inset-0 flex items-center ${getLandscapeContentAlign()} p-3 gap-3`}>
        <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: accent }} />
        <EditableTextField
          {...commonProps}
          field="headline"
          isActive={activeField === 'headline'}
          formatting={formatting.headline || {}}
          className={`leading-tight block flex-1 min-w-0 ${variant === 1 ? 'text-center' : variant === 2 ? 'text-right' : 'text-left'}`}
          style={headlineStyle}
        >
          {headline}
        </EditableTextField>
        <div className="relative bg-black/40 backdrop-blur-sm rounded px-2 py-1 max-w-[35%] min-w-0">
          <EditableTextField
            {...commonProps}
            field="body"
            isActive={activeField === 'body'}
            formatting={formatting.body || {}}
            className={`text-gray-200 leading-snug italic block ${variant === 1 ? 'text-center' : variant === 2 ? 'text-left' : 'text-right'}`}
            style={bodyStyle}
          >
            {body}
          </EditableTextField>
        </div>
        {variant === 2 && <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: accent }} />}
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 flex flex-col ${getHeadlineAlign()} p-4 pt-8`}>
      <div className={`w-8 h-1 rounded-full mb-3 flex-shrink-0 ${getAccentAlign()}`} style={{ background: accent }} />
      <div className="relative max-w-[85%] w-full mb-auto">
        <EditableTextField
          {...commonProps}
          field="headline"
          isActive={activeField === 'headline'}
          formatting={formatting.headline || {}}
          className="leading-tight block w-full"
          style={headlineStyle}
        >
          {headline}
        </EditableTextField>
      </div>
      <div className={`relative ${getBodyAlign()} max-w-[75%] bg-black/30 backdrop-blur-sm rounded-lg p-2`}>
        <EditableTextField
          {...commonProps}
          field="body"
          isActive={activeField === 'body'}
          formatting={formatting.body || {}}
          className="text-gray-200 leading-snug italic block w-full"
          style={bodyStyle}
        >
          {body}
        </EditableTextField>
      </div>
    </div>
  );
};
