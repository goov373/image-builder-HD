# Gradient Analysis System

## Overview
A structured methodology for analyzing gradient images and descriptions to produce accurate, scalable CSS implementations.

---

## 1. GRADIENT TYPE IDENTIFICATION

### Primary Categories
| Type | CSS Function | Indicators |
|------|--------------|------------|
| **Linear** | `linear-gradient()` | Straight color transitions, directional flow |
| **Radial** | `radial-gradient()` | Circular/elliptical emanating from a point |
| **Conic** | `conic-gradient()` | Pie-chart style, colors rotate around center |
| **Mesh/Multi-layer** | Multiple stacked gradients | Complex color pools, no single direction |

### Modifier Types
- **Repeating**: Pattern that tiles (`repeating-linear-gradient()`)
- **Hard-stop**: Sharp color boundaries (no smooth transition)
- **Layered**: Multiple gradients composited via `background`

---

## 2. COLOR EXTRACTION PROTOCOL

### Step 1: Identify Color Stops
For each distinct color region, extract:
```
{
  color: "#hexcode" or "rgba(r,g,b,a)",
  position: "percentage or keyword (start/center/end)",
  opacity: "0-1 if transparent"
}
```

### Step 2: Color Naming Convention
Map to semantic names when possible:
- Brand colors → Use CSS variables (`var(--primary)`)
- Common colors → Use descriptive names in comments
- Opacity variations → Note as `color/opacity` (e.g., `purple/50`)

### Step 3: Transition Analysis
- **Smooth**: Colors blend naturally (default)
- **Hard-stop**: Same position for two colors creates sharp edge
- **Weighted**: Uneven spacing between stops

---

## 3. DIRECTION & POSITION ANALYSIS

### Linear Gradient Directions
| Visual Flow | CSS Value | Degrees |
|-------------|-----------|---------|
| Top to Bottom | `to bottom` | `180deg` |
| Left to Right | `to right` | `90deg` |
| Diagonal ↘ | `to bottom right` | `135deg` |
| Diagonal ↙ | `to bottom left` | `225deg` |
| Custom angle | `Xdeg` | Measure from 12 o'clock |

### Radial Gradient Properties
```css
radial-gradient(
  [shape] [size] at [position],
  color-stop-list
)
```
- **Shape**: `circle` or `ellipse`
- **Size**: `closest-side`, `farthest-corner`, or explicit dimensions
- **Position**: `at center`, `at 20% 80%`, `at top left`

### Conic Gradient Properties
```css
conic-gradient(
  from [angle] at [position],
  color-stop-list
)
```
- **Starting angle**: `from 0deg`, `from 45deg`
- **Position**: Same as radial

---

## 4. ANALYSIS TEMPLATE

When I receive a gradient image, I will analyze using this structure:

```markdown
### Gradient Analysis Report

**Type**: [Linear/Radial/Conic/Mesh]
**Complexity**: [Simple (2-3 colors) / Medium (4-6) / Complex (7+)]
**Layers**: [Single / Multi-layer count]

#### Color Palette
| Stop | Color | Hex/RGBA | Position | Notes |
|------|-------|----------|----------|-------|
| 1 | [name] | #XXXXXX | 0% | Starting color |
| 2 | [name] | #XXXXXX | 50% | Midpoint |
| 3 | [name] | #XXXXXX | 100% | Ending color |

#### Direction/Shape
- Flow: [description]
- Angle/Position: [value]
- Focal Point: [if applicable]

#### Special Characteristics
- [ ] Has transparency
- [ ] Has hard stops
- [ ] Has glow/bloom effect
- [ ] Uses noise/texture overlay
- [ ] Has multiple layers
```

---

## 5. CSS OUTPUT FORMATS

### Format A: Single Gradient
```css
.gradient-name {
  background: linear-gradient(135deg, #color1 0%, #color2 50%, #color3 100%);
}
```

### Format B: Multi-Layer Gradient
```css
.gradient-name {
  background: 
    /* Layer 1: Top overlay */
    linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 50%),
    /* Layer 2: Main gradient */
    radial-gradient(ellipse at 30% 70%, #color1 0%, transparent 60%),
    /* Layer 3: Base color */
    linear-gradient(135deg, #color2 0%, #color3 100%);
}
```

### Format C: With CSS Variables (Scalable)
```css
:root {
  --gradient-primary: #6466e9;
  --gradient-secondary: #eef1f9;
  --gradient-accent: #F97316;
}

.gradient-name {
  background: linear-gradient(
    135deg,
    var(--gradient-primary) 0%,
    var(--gradient-secondary) 100%
  );
}
```

### Format D: As React/Tailwind Compatible
```jsx
// Inline style object
const gradientStyle = {
  background: 'linear-gradient(135deg, #6466e9 0%, #eef1f9 100%)'
};

// Tailwind arbitrary value
className="bg-[linear-gradient(135deg,#6466e9_0%,#eef1f9_100%)]"
```

---

## 6. QUALITY CHECKLIST

Before finalizing CSS output, verify:

- [ ] **Color accuracy**: Hex codes match source as closely as possible
- [ ] **Direction correct**: Gradient flows in the same direction
- [ ] **Stop positions**: Transitions occur at the right points
- [ ] **Transparency handled**: RGBA used where needed
- [ ] **Layers ordered correctly**: Top layers first in CSS
- [ ] **Browser compatible**: No unsupported features without fallback
- [ ] **Scalable**: Uses relative units and variables where appropriate

---

## 7. SPECIAL EFFECTS HANDLING

### Noise/Grain Overlay
```css
.gradient-with-noise {
  background: 
    url("data:image/svg+xml,...") /* noise SVG */,
    linear-gradient(...);
  background-blend-mode: overlay;
}
```

### Glow/Bloom Effect
```css
.gradient-with-glow {
  background: 
    radial-gradient(circle at center, rgba(100,102,233,0.4) 0%, transparent 50%),
    linear-gradient(...);
}
```

### Animated Gradient
```css
.gradient-animated {
  background: linear-gradient(270deg, #color1, #color2, #color3);
  background-size: 400% 400%;
  animation: gradientShift 8s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

---

## 8. EXAMPLE ANALYSIS WORKFLOW

**User uploads image + description:**
> "Purple to light gradient with a soft glow in the bottom left"

**My analysis process:**
1. Identify base type → Linear gradient
2. Extract colors → Purple (#6466e9), Light (#EEF1F9)
3. Determine direction → Diagonal, top-right to bottom-left
4. Note special effect → Radial glow overlay
5. Output layered CSS with variables

**Result:**
```css
.purple-glow-gradient {
  background: 
    radial-gradient(ellipse at 20% 80%, rgba(100,102,233,0.3) 0%, transparent 50%),
    linear-gradient(to bottom left, #6466e9 0%, #EEF1F9 100%);
}
```

---

## 9. PROMPT FORMAT FOR REQUESTING GRADIENTS

When describing a gradient you want recreated, include:

1. **Colors**: List all colors you can identify (names or hex if known)
2. **Direction**: Which way does it flow? (top-to-bottom, diagonal, radial from corner, etc.)
3. **Mood/Feel**: Soft, vibrant, muted, dramatic, etc.
4. **Special effects**: Glow, grain, transparency, hard edges, etc.
5. **Use case**: Background, card, button, etc. (helps determine sizing)

---

## 10. INTEGRATION WITH HELLODATA BRAND

Based on the established brand palette:
```css
:root {
  /* HelloData Brand Colors */
  --hd-purple: #6466e9;
  --hd-purple-light: #EEF2FF;
  --hd-orange: #F97316;
  --hd-dark: #18191A;
  --hd-grey: #6B7280;
  --hd-light: #eef1f9;
}
```

All generated gradients should:
- Flow from purple to light (never dark to purple)
- Use brand colors as anchor points
- Maintain consistent opacity levels
- Be compatible with existing design system

