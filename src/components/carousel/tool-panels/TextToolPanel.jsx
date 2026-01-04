import { useState, useRef, useEffect } from 'react';
import { ToolPanel, Button, ColorDropdown } from '../../ui';
import { FONT_WEIGHTS } from '../../../config';
import { useCarouselsContext } from '../../../context';

/**
 * Text Tool Panel Component
 * Controls for editing text layer formatting (headline or body)
 * 
 * Contains all text editing controls migrated from Toolbar:
 * - Font Weight
 * - Font Size
 * - Text Color
 * - Bold/Italic toggles
 * - Underline with style/color
 * - Text Alignment
 * - Line Spacing
 * - Letter Spacing
 * - Hide/Show toggle
 */
const TextToolPanel = ({
  field, // 'headline' or 'body'
  frame,
  frameWidth,
  carouselId,
  designSystem,
  onCancel,
  onDone,
}) => {
  // Get formatting handler from context
  const { handleUpdateFormatting } = useCarouselsContext();
  // Dropdown states
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showUnderlinePicker, setShowUnderlinePicker] = useState(false);
  const [showAlignPicker, setShowAlignPicker] = useState(false);
  const [showLineSpacing, setShowLineSpacing] = useState(false);
  const [showLetterSpacing, setShowLetterSpacing] = useState(false);

  // Refs for click-outside handling
  const fontRef = useRef(null);
  const sizeRef = useRef(null);
  const colorRef = useRef(null);
  const underlineRef = useRef(null);
  const alignRef = useRef(null);
  const lineSpacingRef = useRef(null);
  const letterSpacingRef = useRef(null);

  // Get current formatting for this field
  const formatting = frame?.variants?.[frame?.currentVariant]?.formatting?.[field] || {};

  // Close all dropdowns
  const closeAllDropdowns = () => {
    setShowFontPicker(false);
    setShowSizePicker(false);
    setShowColorPicker(false);
    setShowUnderlinePicker(false);
    setShowAlignPicker(false);
    setShowLineSpacing(false);
    setShowLetterSpacing(false);
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (fontRef.current && !fontRef.current.contains(e.target)) setShowFontPicker(false);
      if (sizeRef.current && !sizeRef.current.contains(e.target)) setShowSizePicker(false);
      if (colorRef.current && !colorRef.current.contains(e.target)) setShowColorPicker(false);
      if (underlineRef.current && !underlineRef.current.contains(e.target)) setShowUnderlinePicker(false);
      if (alignRef.current && !alignRef.current.contains(e.target)) setShowAlignPicker(false);
      if (lineSpacingRef.current && !lineSpacingRef.current.contains(e.target)) setShowLineSpacing(false);
      if (letterSpacingRef.current && !letterSpacingRef.current.contains(e.target)) setShowLetterSpacing(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Brand colors array
  const brandColors = [
    { name: 'Primary', color: designSystem.primary },
    { name: 'Secondary', color: designSystem.secondary },
    { name: 'Accent', color: designSystem.accent },
    { name: 'Light', color: designSystem.neutral3 },
    { name: 'White', color: '#ffffff' },
  ];

  // Helper to update formatting
  const handleUpdate = (key, value) => {
    handleUpdateFormatting?.(carouselId, frame.id, field, key, value);
  };

  // Get current values with defaults
  const defaultWeight = field === 'headline' ? '700' : '400';
  const currentWeight = formatting.fontWeight || defaultWeight;
  const isBold = currentWeight === '700';
  const isItalic = formatting.italic === true;
  const hasUnderline = formatting.underline === true;
  const textAlign = formatting.textAlign || 'left';
  const lineHeight = formatting.lineHeight || 1.4;
  const letterSpacing = formatting.letterSpacing || 0;
  const isHidden = formatting.isHidden === true;
  const currentColor = formatting.color || (field === 'headline' ? '#ffffff' : '#e5e7eb');

  return (
    <ToolPanel.Container width={frameWidth}>
      {/* Row 1: Font, Size, Color */}
      <ToolPanel.Row>
        {/* Font Weight Dropdown */}
        <div ref={fontRef} className="relative">
          <button
            type="button"
            onClick={() => {
              closeAllDropdowns();
              setShowFontPicker(!showFontPicker);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[--surface-raised] border border-[--border-default] hover:bg-[--surface-overlay] rounded-[--radius-md] text-[10px] font-medium text-[--text-secondary] transition-colors"
          >
            <span>Font</span>
            <svg
              className={`w-2.5 h-2.5 text-[--text-quaternary] transition-transform ${showFontPicker ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showFontPicker && (
            <div
              className="absolute bottom-full left-0 mb-2 p-1.5 bg-[--surface-raised] border border-[--border-default] rounded-[--radius-md] shadow-xl z-[200] max-h-48 overflow-y-auto min-w-[140px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-2 py-1 text-[9px] text-[--text-quaternary] uppercase tracking-wide border-b border-[--border-default] mb-1">
                Nunito Sans
              </div>
              {FONT_WEIGHTS.map((weight) => {
                const isSelected = currentWeight === weight.value;
                return (
                  <button
                    type="button"
                    key={weight.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdate('fontWeight', weight.value);
                      setShowFontPicker(false);
                    }}
                    className={`w-full px-2 py-1.5 rounded text-[10px] text-left transition-colors flex items-center justify-between ${isSelected ? 'bg-[--surface-overlay] text-white' : 'text-[--text-secondary] hover:bg-[--surface-overlay]'}`}
                    style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: weight.weight }}
                  >
                    <span>{weight.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Font Size Dropdown */}
        <div ref={sizeRef} className="relative">
          <button
            type="button"
            onClick={() => {
              closeAllDropdowns();
              setShowSizePicker(!showSizePicker);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[--surface-raised] border border-[--border-default] hover:bg-[--surface-overlay] rounded-[--radius-md] text-[10px] font-medium text-[--text-secondary] transition-colors"
          >
            <span>Size</span>
            <svg
              className={`w-2.5 h-2.5 text-[--text-quaternary] transition-transform ${showSizePicker ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showSizePicker && (
            <div
              className="absolute bottom-full left-0 mb-2 p-1.5 bg-[--surface-raised] border border-[--border-default] rounded-[--radius-md] shadow-xl z-[200]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex gap-1">
                {[
                  { name: 'S', value: 0.85 },
                  { name: 'M', value: 1 },
                  { name: 'L', value: 1.2 },
                ].map((s) => (
                  <button
                    type="button"
                    key={s.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdate('fontSize', s.value);
                      setShowSizePicker(false);
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] font-medium transition-colors border ${formatting.fontSize === s.value ? 'bg-[--surface-overlay] border-[--border-strong] text-white' : 'bg-[--surface-raised] border-[--border-default] text-[--text-tertiary] hover:bg-[--surface-overlay]'}`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Text Color */}
        <ColorDropdown
          label="Color"
          value={currentColor}
          onChange={(color) => handleUpdate('color', color || '#ffffff')}
          colors={brandColors}
        />
      </ToolPanel.Row>

      {/* Row 2: Bold, Italic, Underline, Alignment */}
      <ToolPanel.Row>
        {/* Bold */}
        <button
          type="button"
          onClick={() => handleUpdate('fontWeight', isBold ? '400' : '700')}
          className={`w-7 h-7 rounded-[--radius-sm] flex items-center justify-center text-[11px] font-bold transition-colors border ${isBold ? 'bg-[--surface-overlay] border-[--border-strong] text-white' : 'bg-[--surface-raised] border-[--border-default] text-[--text-tertiary] hover:bg-[--surface-overlay]'}`}
          title="Bold"
        >
          B
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => handleUpdate('italic', !isItalic)}
          className={`w-7 h-7 rounded-[--radius-sm] flex items-center justify-center text-[11px] italic transition-colors border ${isItalic ? 'bg-[--surface-overlay] border-[--border-strong] text-white' : 'bg-[--surface-raised] border-[--border-default] text-[--text-tertiary] hover:bg-[--surface-overlay]'}`}
          title="Italic"
        >
          I
        </button>

        {/* Underline Dropdown */}
        <div ref={underlineRef} className="relative">
          <button
            type="button"
            onClick={() => {
              closeAllDropdowns();
              setShowUnderlinePicker(!showUnderlinePicker);
            }}
            className={`flex items-center gap-1 px-2 h-7 rounded-[--radius-sm] text-[11px] transition-colors border ${hasUnderline ? 'bg-[--surface-overlay] border-[--border-strong] text-white' : 'bg-[--surface-raised] border-[--border-default] text-[--text-tertiary] hover:bg-[--surface-overlay]'}`}
            title="Underline"
          >
            <span style={{ textDecoration: 'underline' }}>U</span>
            <svg
              className={`w-2 h-2 text-[--text-quaternary] transition-transform ${showUnderlinePicker ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showUnderlinePicker && (
            <div
              className="absolute bottom-full left-0 mb-2 p-2.5 bg-[--surface-raised] border border-[--border-default] rounded-[--radius-md] shadow-xl z-[200] min-w-[160px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-[9px] text-[--text-quaternary] mb-1.5 uppercase tracking-wide">Style</div>
              <div className="flex gap-1 mb-3">
                {[
                  { name: 'Solid', value: 'solid' },
                  { name: 'Dotted', value: 'dotted' },
                  { name: 'Wavy', value: 'wavy' },
                  { name: 'Highlight', value: 'highlight' },
                ].map((s) => (
                  <button
                    type="button"
                    key={s.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdate('underlineStyle', s.value);
                      handleUpdate('underline', true);
                    }}
                    className={`px-2 py-1 rounded text-[10px] transition-colors border ${formatting.underlineStyle === s.value ? 'bg-[--surface-overlay] border-[--border-strong] text-white' : 'bg-[--surface-raised] border-[--border-default] text-[--text-tertiary] hover:bg-[--surface-overlay]'}`}
                    title={s.name}
                  >
                    {s.value === 'solid' && <span style={{ textDecoration: 'underline', textDecorationStyle: 'solid' }}>S</span>}
                    {s.value === 'dotted' && <span style={{ textDecoration: 'underline', textDecorationStyle: 'dotted' }}>D</span>}
                    {s.value === 'wavy' && <span style={{ textDecoration: 'underline', textDecorationStyle: 'wavy' }}>W</span>}
                    {s.value === 'highlight' && <span style={{ backgroundImage: 'linear-gradient(to top, rgba(251,191,36,0.5) 30%, transparent 30%)' }}>H</span>}
                  </button>
                ))}
              </div>
              <div className="text-[9px] text-[--text-quaternary] mb-1.5 uppercase tracking-wide">Color</div>
              <div className="flex gap-1.5 mb-3">
                {brandColors.map((c) => (
                  <button
                    type="button"
                    key={c.color}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdate('underlineColor', c.color);
                      handleUpdate('underline', true);
                      if (!formatting.underlineStyle) handleUpdate('underlineStyle', 'solid');
                    }}
                    className={`w-5 h-5 rounded border-2 hover:scale-110 transition-all ${formatting.underlineColor === c.color ? 'border-[--border-strong]' : 'border-[--border-emphasis]'}`}
                    style={{ backgroundColor: c.color }}
                    title={c.name}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdate('underline', false);
                  setShowUnderlinePicker(false);
                }}
                className="w-full px-2 py-1.5 rounded text-[10px] text-[--text-quaternary] hover:text-[--text-secondary] hover:bg-[--surface-overlay] transition-colors border border-[--border-default]"
              >
                Remove Underline
              </button>
            </div>
          )}
        </div>

        {/* Text Alignment Dropdown */}
        <div ref={alignRef} className="relative">
          <button
            type="button"
            onClick={() => {
              closeAllDropdowns();
              setShowAlignPicker(!showAlignPicker);
            }}
            className={`flex items-center gap-1 px-2 h-7 rounded-[--radius-sm] transition-colors border ${textAlign !== 'left' ? 'bg-[--surface-overlay] border-[--border-strong] text-white' : 'bg-[--surface-raised] border-[--border-default] text-[--text-tertiary] hover:bg-[--surface-overlay]'}`}
            title="Text alignment"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
            </svg>
            <svg className="w-2 h-2 text-[--text-quaternary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showAlignPicker && (
            <div
              className="absolute bottom-full left-0 mb-2 p-1.5 bg-[--surface-raised] border border-[--border-default] rounded-[--radius-md] shadow-xl z-[200]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex gap-1">
                {[
                  { name: 'Left', value: 'left', icon: 'M4 6h16M4 12h10M4 18h16' },
                  { name: 'Center', value: 'center', icon: 'M4 6h16M7 12h10M4 18h16' },
                  { name: 'Right', value: 'right', icon: 'M4 6h16M10 12h10M4 18h16' },
                  { name: 'Justify', value: 'justify', icon: 'M4 6h16M4 12h16M4 18h16' },
                ].map((a) => (
                  <button
                    type="button"
                    key={a.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdate('textAlign', a.value);
                      setShowAlignPicker(false);
                    }}
                    className={`p-1.5 rounded transition-colors border ${textAlign === a.value ? 'bg-[--surface-overlay] border-[--border-strong] text-white' : 'bg-[--surface-raised] border-[--border-default] text-[--text-tertiary] hover:bg-[--surface-overlay]'}`}
                    title={a.name}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={a.icon} />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </ToolPanel.Row>

      {/* Row 3: Line Spacing, Letter Spacing, Hide Toggle */}
      <ToolPanel.Row>
        {/* Line Spacing Dropdown */}
        <div ref={lineSpacingRef} className="relative">
          <button
            type="button"
            onClick={() => {
              closeAllDropdowns();
              setShowLineSpacing(!showLineSpacing);
            }}
            className={`flex items-center gap-1 px-2 h-7 rounded-[--radius-sm] transition-colors border ${lineHeight !== 1.4 ? 'bg-[--surface-overlay] border-[--border-strong] text-white' : 'bg-[--surface-raised] border-[--border-default] text-[--text-tertiary] hover:bg-[--surface-overlay]'}`}
            title="Line spacing"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 3v18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg className="w-2 h-2 text-[--text-quaternary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showLineSpacing && (
            <div
              className="absolute bottom-full left-0 mb-2 p-1.5 bg-[--surface-raised] border border-[--border-default] rounded-[--radius-md] shadow-xl z-[200] min-w-[90px]"
              onClick={(e) => e.stopPropagation()}
            >
              {[
                { name: 'Tight', value: 1.1 },
                { name: 'Normal', value: 1.4 },
                { name: 'Relaxed', value: 1.7 },
                { name: 'Loose', value: 2 },
              ].map((s) => (
                <button
                  type="button"
                  key={s.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdate('lineHeight', s.value);
                    setShowLineSpacing(false);
                  }}
                  className={`w-full px-2 py-1.5 rounded text-[10px] text-left transition-colors ${lineHeight === s.value ? 'bg-[--surface-overlay] text-white' : 'text-[--text-tertiary] hover:bg-[--surface-overlay]'}`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Letter Spacing Dropdown */}
        <div ref={letterSpacingRef} className="relative">
          <button
            type="button"
            onClick={() => {
              closeAllDropdowns();
              setShowLetterSpacing(!showLetterSpacing);
            }}
            className={`flex items-center gap-1 px-2 h-7 rounded-[--radius-sm] transition-colors border ${letterSpacing !== 0 ? 'bg-[--surface-overlay] border-[--border-strong] text-white' : 'bg-[--surface-raised] border-[--border-default] text-[--text-tertiary] hover:bg-[--surface-overlay]'}`}
            title="Letter spacing"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M3 12h18M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg className="w-2 h-2 text-[--text-quaternary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showLetterSpacing && (
            <div
              className="absolute bottom-full left-0 mb-2 p-1.5 bg-[--surface-raised] border border-[--border-default] rounded-[--radius-md] shadow-xl z-[200] min-w-[90px]"
              onClick={(e) => e.stopPropagation()}
            >
              {[
                { name: 'Tight', value: -0.5 },
                { name: 'Normal', value: 0 },
                { name: 'Wide', value: 1 },
                { name: 'Wider', value: 2 },
              ].map((s) => (
                <button
                  type="button"
                  key={s.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdate('letterSpacing', s.value);
                    setShowLetterSpacing(false);
                  }}
                  className={`w-full px-2 py-1.5 rounded text-[10px] text-left transition-colors ${letterSpacing === s.value ? 'bg-[--surface-overlay] text-white' : 'text-[--text-tertiary] hover:bg-[--surface-overlay]'}`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Hide/Show Toggle */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleUpdate('isHidden', !isHidden)}
          title={isHidden ? 'Show text layer' : 'Hide text layer'}
          className="gap-1"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isHidden ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            )}
          </svg>
          {isHidden ? 'Show' : 'Hide'}
        </Button>
      </ToolPanel.Row>

      <ToolPanel.Actions>
        <Button variant="ghost" size="sm" onClick={onCancel} title="Cancel and close">
          Cancel
        </Button>
        <Button variant="secondary" size="sm" onClick={onDone} title="Done editing">
          Done
        </Button>
      </ToolPanel.Actions>
    </ToolPanel.Container>
  );
};

export default TextToolPanel;

