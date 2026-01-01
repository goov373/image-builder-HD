import EditableTextField from '../EditableTextField';

/**
 * Eblast Hero Overlay Layout
 * Large section with text overlay and optional CTA button
 */
export const EblastHeroOverlay = ({
  headline,
  body,
  text,
  accent,
  headingFont,
  bodyFont,
  variant = 0,
  isFrameSelected,
  onUpdateText,
  activeField,
  onActivateField,
  formatting = {},
  fontSizes,
  ctaText,
}) => {
  // Variant positions: 0 = center, 1 = bottom-left, 2 = bottom-right
  const positions = [
    'items-center justify-center text-center',
    'items-end justify-start text-left pb-6 pl-6',
    'items-end justify-end text-right pb-6 pr-6',
  ];

  return (
    <div className={`absolute inset-0 flex flex-col ${positions[variant]} p-4`}>
      <div className="max-w-[85%]">
        <EditableTextField
          value={headline}
          field="headline"
          isEditable={isFrameSelected}
          isActive={activeField === 'headline'}
          onActivate={() => onActivateField?.('headline')}
          onChange={(value) => onUpdateText?.('headline', value)}
          className="font-bold mb-2"
          style={{
            fontFamily: formatting.headline?.fontFamily || headingFont,
            fontSize: `${(formatting.headline?.fontSize || 1) * (fontSizes?.headline || 18)}px`,
            color: formatting.headline?.color || text || '#ffffff',
            fontWeight: formatting.headline?.bold !== false ? 'bold' : 'normal',
            fontStyle: formatting.headline?.italic ? 'italic' : 'normal',
            lineHeight: formatting.headline?.lineHeight || 1.2,
          }}
        />
        <EditableTextField
          value={body}
          field="body"
          isEditable={isFrameSelected}
          isActive={activeField === 'body'}
          onActivate={() => onActivateField?.('body')}
          onChange={(value) => onUpdateText?.('body', value)}
          className="mb-3"
          style={{
            fontFamily: formatting.body?.fontFamily || bodyFont,
            fontSize: `${(formatting.body?.fontSize || 1) * (fontSizes?.body || 12)}px`,
            color: formatting.body?.color || 'rgba(255,255,255,0.85)',
            lineHeight: formatting.body?.lineHeight || 1.4,
          }}
        />
        {ctaText && (
          <div
            className="inline-block px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: accent, color: text === '#18191A' ? '#ffffff' : '#18191A' }}
          >
            {ctaText}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Eblast Split 50/50 Layout
 * Image area on one side, text on the other
 */
export const EblastSplit5050 = ({
  headline,
  body,
  text,
  accent,
  headingFont,
  bodyFont,
  variant = 0,
  isFrameSelected,
  onUpdateText,
  activeField,
  onActivateField,
  formatting = {},
  fontSizes,
  ctaText,
}) => {
  // Variant: 0 = image left, 1 = image right, 2 = image top
  const isImageLeft = variant === 0;
  const isVertical = variant === 2;

  return (
    <div className={`absolute inset-0 flex ${isVertical ? 'flex-col' : 'flex-row'}`}>
      {/* Image placeholder area */}
      <div
        className={`${isVertical ? 'h-1/2' : 'w-1/2'} bg-gray-700/30 flex items-center justify-center ${isImageLeft || isVertical ? 'order-1' : 'order-2'}`}
      >
        <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      {/* Text content area */}
      <div
        className={`${isVertical ? 'h-1/2' : 'w-1/2'} flex flex-col justify-center p-4 ${isImageLeft || isVertical ? 'order-2' : 'order-1'}`}
      >
        <EditableTextField
          value={headline}
          field="headline"
          isEditable={isFrameSelected}
          isActive={activeField === 'headline'}
          onActivate={() => onActivateField?.('headline')}
          onChange={(value) => onUpdateText?.('headline', value)}
          className="font-bold mb-2"
          style={{
            fontFamily: formatting.headline?.fontFamily || headingFont,
            fontSize: `${(formatting.headline?.fontSize || 1) * (fontSizes?.headline || 14)}px`,
            color: formatting.headline?.color || text || '#ffffff',
            fontWeight: formatting.headline?.bold !== false ? 'bold' : 'normal',
            lineHeight: 1.2,
          }}
        />
        <EditableTextField
          value={body}
          field="body"
          isEditable={isFrameSelected}
          isActive={activeField === 'body'}
          onActivate={() => onActivateField?.('body')}
          onChange={(value) => onUpdateText?.('body', value)}
          className="mb-2"
          style={{
            fontFamily: formatting.body?.fontFamily || bodyFont,
            fontSize: `${(formatting.body?.fontSize || 1) * (fontSizes?.body || 10)}px`,
            color: formatting.body?.color || 'rgba(255,255,255,0.85)',
            lineHeight: 1.4,
          }}
        />
        {ctaText && (
          <div
            className="inline-block self-start px-3 py-1.5 rounded text-xs font-semibold"
            style={{ backgroundColor: accent, color: text === '#18191A' ? '#ffffff' : '#18191A' }}
          >
            {ctaText}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Eblast CTA Banner Layout
 * Prominent call-to-action section
 */
export const EblastCTABanner = ({
  headline,
  body,
  text,
  accent: _accent,
  headingFont,
  bodyFont,
  variant = 0,
  isFrameSelected,
  onUpdateText,
  activeField,
  onActivateField,
  formatting = {},
  fontSizes,
  ctaText,
}) => {
  // Variants: 0 = centered, 1 = left-aligned, 2 = button prominent
  const alignments = ['text-center items-center', 'text-left items-start', 'text-center items-center'];

  return (
    <div className={`absolute inset-0 flex flex-col justify-center ${alignments[variant]} p-4`}>
      <EditableTextField
        value={headline}
        field="headline"
        isEditable={isFrameSelected}
        isActive={activeField === 'headline'}
        onActivate={() => onActivateField?.('headline')}
        onChange={(value) => onUpdateText?.('headline', value)}
        className="font-bold"
        style={{
          fontFamily: formatting.headline?.fontFamily || headingFont,
          fontSize: `${(formatting.headline?.fontSize || 1) * (fontSizes?.headline || 14)}px`,
          color: formatting.headline?.color || text || '#ffffff',
          fontWeight: 'bold',
          lineHeight: 1.2,
        }}
      />
      {variant !== 2 && (
        <EditableTextField
          value={body}
          field="body"
          isEditable={isFrameSelected}
          isActive={activeField === 'body'}
          onActivate={() => onActivateField?.('body')}
          onChange={(value) => onUpdateText?.('body', value)}
          className="mt-1 mb-2"
          style={{
            fontFamily: formatting.body?.fontFamily || bodyFont,
            fontSize: `${(formatting.body?.fontSize || 1) * (fontSizes?.body || 10)}px`,
            color: formatting.body?.color || 'rgba(255,255,255,0.8)',
            lineHeight: 1.3,
          }}
        />
      )}
      {ctaText && (
        <div
          className={`inline-block px-4 py-2 rounded-lg font-semibold ${variant === 2 ? 'text-base mt-2' : 'text-sm'}`}
          style={{
            backgroundColor: '#ffffff',
            color: '#18191A',
          }}
        >
          {ctaText}
        </div>
      )}
    </div>
  );
};

/**
 * Eblast Text Block Layout
 * Simple text section without imagery
 */
export const EblastTextBlock = ({
  headline,
  body,
  text,
  accent: _accent,
  headingFont,
  bodyFont,
  variant = 0,
  isFrameSelected,
  onUpdateText,
  activeField,
  onActivateField,
  formatting = {},
  fontSizes,
}) => {
  // Variants: 0 = left, 1 = center, 2 = right
  const alignments = ['text-left', 'text-center', 'text-right'];

  return (
    <div className={`absolute inset-0 flex flex-col justify-center p-5 ${alignments[variant]}`}>
      <EditableTextField
        value={headline}
        field="headline"
        isEditable={isFrameSelected}
        isActive={activeField === 'headline'}
        onActivate={() => onActivateField?.('headline')}
        onChange={(value) => onUpdateText?.('headline', value)}
        className="font-bold mb-2"
        style={{
          fontFamily: formatting.headline?.fontFamily || headingFont,
          fontSize: `${(formatting.headline?.fontSize || 1) * (fontSizes?.headline || 16)}px`,
          color: formatting.headline?.color || text || '#ffffff',
          fontWeight: 'bold',
          lineHeight: 1.2,
        }}
      />
      <EditableTextField
        value={body}
        field="body"
        isEditable={isFrameSelected}
        isActive={activeField === 'body'}
        onActivate={() => onActivateField?.('body')}
        onChange={(value) => onUpdateText?.('body', value)}
        style={{
          fontFamily: formatting.body?.fontFamily || bodyFont,
          fontSize: `${(formatting.body?.fontSize || 1) * (fontSizes?.body || 12)}px`,
          color: formatting.body?.color || (text === '#18191A' ? '#6B7280' : 'rgba(255,255,255,0.85)'),
          lineHeight: 1.5,
        }}
      />
    </div>
  );
};

export default {
  EblastHeroOverlay,
  EblastSplit5050,
  EblastCTABanner,
  EblastTextBlock,
};
