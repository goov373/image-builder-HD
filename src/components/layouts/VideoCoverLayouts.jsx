import EditableTextField from '../EditableTextField';

/**
 * Video Face + Text Layout
 * Headshot area with bold text beside it
 */
export const VideoFaceText = ({
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
  // Variant: 0 = face left, 1 = face right, 2 = face top
  const isVertical = variant === 2;
  const isFaceLeft = variant === 0;

  return (
    <div className={`absolute inset-0 flex ${isVertical ? 'flex-col' : 'flex-row'}`}>
      {/* Face placeholder area */}
      <div
        className={`${isVertical ? 'h-2/5' : 'w-2/5'} bg-gray-700/30 flex items-center justify-center ${isFaceLeft || isVertical ? 'order-1' : 'order-2'}`}
      >
        <div className="w-16 h-16 rounded-full bg-gray-600/50 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      </div>

      {/* Text content area */}
      <div
        className={`${isVertical ? 'h-3/5' : 'w-3/5'} flex flex-col justify-center p-4 ${isFaceLeft || isVertical ? 'order-2' : 'order-1'}`}
      >
        <EditableTextField
          value={headline}
          field="headline"
          isEditable={isFrameSelected}
          isActive={activeField === 'headline'}
          onActivate={() => onActivateField?.('headline')}
          onChange={(value) => onUpdateText?.('headline', value)}
          className="font-black mb-1"
          style={{
            fontFamily: formatting.headline?.fontFamily || headingFont,
            fontSize: `${(formatting.headline?.fontSize || 1) * (fontSizes?.headline || 20)}px`,
            color: formatting.headline?.color || text || '#ffffff',
            fontWeight: 900,
            lineHeight: 1.1,
            textTransform: 'uppercase',
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
            color: formatting.body?.color || 'rgba(255,255,255,0.7)',
            lineHeight: 1.3,
          }}
        />
      </div>
    </div>
  );
};

/**
 * Video Bold Statement Layout
 * Large centered text for maximum impact
 */
export const VideoBoldStatement = ({
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
  // Variant positions: 0 = center, 1 = bottom, 2 = top
  const positions = ['items-center justify-center', 'items-center justify-end pb-6', 'items-center justify-start pt-6'];

  return (
    <div className={`absolute inset-0 flex flex-col ${positions[variant]} p-6 text-center`}>
      <EditableTextField
        value={headline}
        field="headline"
        isEditable={isFrameSelected}
        isActive={activeField === 'headline'}
        onActivate={() => onActivateField?.('headline')}
        onChange={(value) => onUpdateText?.('headline', value)}
        className="font-black mb-2"
        style={{
          fontFamily: formatting.headline?.fontFamily || headingFont,
          fontSize: `${(formatting.headline?.fontSize || 1) * (fontSizes?.headline || 28)}px`,
          color: formatting.headline?.color || text || '#ffffff',
          fontWeight: 900,
          lineHeight: 1.0,
          textTransform: 'uppercase',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
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
          fontSize: `${(formatting.body?.fontSize || 1) * (fontSizes?.body || 14)}px`,
          color: formatting.body?.color || 'rgba(255,255,255,0.7)',
          lineHeight: 1.3,
        }}
      />
    </div>
  );
};

/**
 * Video Episode Card Layout
 * Series branding with episode number
 */
export const VideoEpisodeCard = ({
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
  episodeNumber,
  seriesName,
}) => {
  // Variant: 0 = badge top-left, 1 = badge top-right, 2 = badge bottom
  const badgePositions = ['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3'];

  return (
    <div className="absolute inset-0">
      {/* Episode Badge */}
      {episodeNumber && (
        <div className={`absolute ${badgePositions[variant]} z-10`}>
          <div
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ backgroundColor: accent, color: '#ffffff' }}
          >
            {episodeNumber}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        {seriesName && (
          <div className="text-xs font-medium mb-1 opacity-80" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {seriesName}
          </div>
        )}
        <EditableTextField
          value={headline}
          field="headline"
          isEditable={isFrameSelected}
          isActive={activeField === 'headline'}
          onActivate={() => onActivateField?.('headline')}
          onChange={(value) => onUpdateText?.('headline', value)}
          className="font-bold mb-1"
          style={{
            fontFamily: formatting.headline?.fontFamily || headingFont,
            fontSize: `${(formatting.headline?.fontSize || 1) * (fontSizes?.headline || 18)}px`,
            color: formatting.headline?.color || text || '#ffffff',
            fontWeight: 700,
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
            fontSize: `${(formatting.body?.fontSize || 1) * (fontSizes?.body || 11)}px`,
            color: formatting.body?.color || 'rgba(255,255,255,0.7)',
            lineHeight: 1.3,
          }}
        />
      </div>
    </div>
  );
};

/**
 * Video Play Overlay Layout
 * Image with prominent play button
 */
export const VideoPlayOverlay = ({
  headline,
  body: _body,
  text,
  accent,
  headingFont,
  bodyFont: _bodyFont,
  variant = 0,
  isFrameSelected,
  onUpdateText,
  activeField,
  onActivateField,
  formatting = {},
  fontSizes,
  showPlayButton = true,
}) => {
  // Variant: 0 = text bottom, 1 = text top, 2 = text hidden
  const textPositions = ['justify-end pb-4', 'justify-start pt-4', 'justify-center'];

  return (
    <div className="absolute inset-0">
      {/* Play Button - always centered */}
      {showPlayButton && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
          >
            <svg className="w-7 h-7 ml-1" fill={accent} viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Text Content */}
      {variant !== 2 && (
        <div className={`absolute inset-0 flex flex-col ${textPositions[variant]} px-4 text-center`}>
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
              fontSize: `${(formatting.headline?.fontSize || 1) * (fontSizes?.headline || 16)}px`,
              color: formatting.headline?.color || text || '#ffffff',
              fontWeight: 700,
              lineHeight: 1.2,
              textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default {
  VideoFaceText,
  VideoBoldStatement,
  VideoEpisodeCard,
  VideoPlayOverlay,
};
