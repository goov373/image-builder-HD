/**
 * Editable Text Field Component
 * Inline-editable text with formatting support
 */
const EditableTextField = ({ children, field, isFrameSelected, isActive, onActivate, onUpdateText, formatting = {}, className = '', style = {} }) => {
  const isHighlight = formatting.underline && formatting.underlineStyle === 'highlight';
  
  const getUnderlineStyles = () => {
    if (!formatting.underline) return {};
    const underlineColor = formatting.underlineColor || formatting.color || '#fff';
    if (formatting.underlineStyle === 'highlight') return {};
    return {
      textDecorationLine: 'underline',
      textDecorationStyle: formatting.underlineStyle || 'solid',
      textDecorationColor: underlineColor,
      textDecorationThickness: formatting.underlineStyle === 'wavy' ? '2px' : '1.5px',
      textUnderlineOffset: '2px',
    };
  };

  // Determine font weight: explicit fontWeight > bold toggle > style default
  const getFontWeight = () => {
    if (formatting.fontWeight) return formatting.fontWeight;
    if (formatting.bold === true) return 'bold';
    if (formatting.bold === false) return 'normal';
    return style.fontWeight;
  };

  const displayStyle = {
    ...style,
    fontWeight: getFontWeight(),
    fontStyle: formatting.italic === true ? 'italic' : formatting.italic === false ? 'normal' : style.fontStyle,
    color: formatting.color || style.color,
    fontFamily: formatting.fontFamily || style.fontFamily,
    textAlign: formatting.textAlign || style.textAlign,
    lineHeight: formatting.lineHeight !== undefined ? formatting.lineHeight : style.lineHeight,
    letterSpacing: formatting.letterSpacing !== undefined ? `${formatting.letterSpacing}px` : style.letterSpacing,
    // Text wrapping - always enabled to prevent overflow
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    hyphens: 'auto',
    whiteSpace: 'pre-wrap',
    ...getUnderlineStyles(),
  };
  
  const outlineStyle = !isFrameSelected ? {} : isActive 
    ? { outline: '2px solid rgb(249 115 22)', outlineOffset: '2px' }
    : { outline: '1px dashed rgb(249 115 22 / 0.4)', outlineOffset: '2px' };
  
  const highlightColor = formatting.underlineColor || formatting.color || '#fbbf24';
  const highlightStyle = isHighlight ? {
    backgroundColor: `${highlightColor}40`,
    paddingLeft: '0.15em',
    paddingRight: '0.15em',
    marginLeft: '-0.15em',
    marginRight: '-0.15em',
    boxDecorationBreak: 'clone',
    WebkitBoxDecorationBreak: 'clone',
  } : {};
  
  return (
    <span
      className={`${className} ${isFrameSelected && !isActive ? 'cursor-pointer' : ''}`}
      style={{ ...displayStyle, ...outlineStyle }}
      contentEditable={isActive}
      suppressContentEditableWarning
      onClick={(e) => { if (isFrameSelected) { e.stopPropagation(); onActivate?.(field); } }}
      onBlur={(e) => { if (isActive) onUpdateText?.(field, e.target.innerText); }}
    >
      {isHighlight ? <span style={highlightStyle}>{children}</span> : children}
    </span>
  );
};

export default EditableTextField;


