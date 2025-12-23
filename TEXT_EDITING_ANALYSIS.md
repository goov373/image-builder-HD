# Text Editing Features Analysis

## Issue 1: Font Size Using CSS Transform Scale

### Current Implementation
```javascript
transform: formatting.fontSize ? `scale(${formatting.fontSize})` : undefined,
transformOrigin: 'left center',
```

### Problems Identified

1. **Layout Space Not Affected**
   - CSS `transform: scale()` only affects visual appearance, not layout space
   - The element still occupies its original dimensions in the document flow
   - Example: If text is `text-xs` (12px) scaled to 1.2x, it visually appears as 14.4px but still takes 12px of space
   - This can cause:
     - Text overflow in containers with `max-w-[40%]` or `flex-1`
     - Overlapping with adjacent elements
     - Incorrect spacing calculations

2. **Transform Origin Issues**
   - `transformOrigin: 'left center'` works for left-aligned text
   - But in layouts with `text-center` or `text-right`, scaling will shift the text position
   - Example: In `LayoutCenterDrama` with centered text, scaling will push text off-center

3. **Accessibility & Copy/Paste**
   - Screen readers see the original font size
   - Copy/paste operations use original size
   - Browser zoom doesn't compound correctly

4. **Specific Layout Issues**
   - **LayoutBottomStack landscape** (line 406-407): `flex-1` and `max-w-[40%]` containers won't adjust
   - **LayoutCenterDrama** (line 461): Centered text will shift when scaled
   - **LayoutEditorialLeft**: Text alignment may break

### Recommended Solution

Replace CSS transform with actual font-size calculation:

```javascript
// Calculate actual font size based on base size and scale factor
const getFontSize = () => {
  if (!formatting.fontSize) return undefined;
  
  // Get base font size from className (text-xs = 12px, text-sm = 14px, text-base = 16px)
  const baseSizeMap = {
    'text-xs': 12,
    'text-sm': 14,
    'text-base': 16,
    'text-lg': 18,
    'text-xl': 20,
  };
  
  // Extract base size from className or use default
  const baseSize = 12; // Default fallback
  const scaledSize = baseSize * formatting.fontSize;
  
  return `${scaledSize}px`;
};

const displayStyle = {
  ...style,
  fontSize: getFontSize(), // Use actual fontSize instead of transform
  fontWeight: formatting.bold ? 'bold' : style.fontWeight,
  fontStyle: formatting.italic ? 'italic' : style.fontStyle,
  color: formatting.color || style.color,
  // Remove transform
  ...getUnderlineStyles(),
};
```

**Alternative Approach**: Use CSS `font-size` with `em` or `rem` units:
```javascript
fontSize: formatting.fontSize ? `${formatting.fontSize}em` : undefined,
```

---

## Issue 2: Underline Highlight Using Background Color

### Current Implementation
```javascript
const highlightColor = formatting.underlineColor || formatting.color || '#fbbf24';
const highlightStyle = isHighlight ? {
  backgroundColor: `${highlightColor}40`,  // ❌ PROBLEM: Invalid color format
  paddingLeft: '0.15em',
  paddingRight: '0.15em',
  marginLeft: '-0.15em',
  marginRight: '-0.15em',
  boxDecorationBreak: 'clone',
  WebkitBoxDecorationBreak: 'clone',
} : {};
```

### Problems Identified

1. **Invalid Color Format**
   - `${highlightColor}40` appends "40" to a hex color string
   - Example: `#fbbf24` becomes `#fbbf2440` which is invalid
   - Should use `rgba()` or 8-digit hex with alpha channel
   - Current implementation likely defaults to opaque color or fails silently

2. **Layout Shifts**
   - Negative margins (`marginLeft: '-0.15em'`) can cause:
     - Text to shift position unexpectedly
     - Overlap with adjacent elements
     - Breaking alignment in flex/grid layouts

3. **Padding Issues**
   - Padding adds extra space that might not be desired
   - Can cause text to wrap differently
   - May not work well with `boxDecorationBreak: 'clone'`

4. **Cross-Browser Compatibility**
   - `boxDecorationBreak` has limited support
   - `WebkitBoxDecorationBreak` is webkit-specific
   - May not work consistently across browsers

### Recommended Solution

Use proper color format and CSS `background-image` with linear-gradient:

```javascript
// Helper function to convert hex to rgba
const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const highlightColor = formatting.underlineColor || formatting.color || '#fbbf24';
const highlightStyle = isHighlight ? {
  backgroundImage: `linear-gradient(to top, ${hexToRgba(highlightColor, 0.4)} 30%, transparent 30%)`,
  backgroundRepeat: 'repeat-x',
  backgroundPosition: 'bottom',
  paddingBottom: '0.1em', // Small padding to ensure highlight is visible
  // Remove negative margins - they cause layout issues
} : {};
```

**Alternative**: Use CSS `text-decoration` with `text-decoration-color` and `text-decoration-thickness`:
```javascript
// For highlight, use a thicker underline with color
textDecorationLine: 'underline',
textDecorationColor: hexToRgba(highlightColor, 0.6),
textDecorationThickness: '0.3em', // Thicker to create highlight effect
textUnderlineOffset: '-0.1em', // Move underline up to cover text
```

---

## Testing Recommendations

1. **Font Size Testing**:
   - Test with all three layouts (Bottom Stack, Center Drama, Editorial)
   - Test in portrait and landscape orientations
   - Test with long text that might overflow
   - Test with centered and right-aligned text
   - Verify copy/paste maintains correct size

2. **Highlight Testing**:
   - Test with all color options (Primary, Secondary, Accent, Light, White)
   - Test with multi-line text
   - Test with text that wraps
   - Test across different browsers (Chrome, Firefox, Safari)
   - Verify highlight doesn't cause layout shifts

---

## Implementation Priority

1. **High Priority**: Fix highlight color format (quick fix, prevents bugs)
2. **Medium Priority**: Replace font size transform with actual fontSize (better UX, accessibility)
3. **Low Priority**: Refine highlight styling for better visual appearance




