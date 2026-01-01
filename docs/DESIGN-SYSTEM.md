# Design System Documentation

## Overview

This design system enforces a **neutral black and grey color palette** for all UI chrome. It uses CSS custom properties (variables) as the source of truth, with Tailwind CSS configured to only expose design tokens.

## Color Tokens

### Surface Colors (Backgrounds)

| Token | CSS Variable | Usage |
|-------|--------------|-------|
| `bg-surface-canvas` | `--surface-canvas` | Main app background, deepest layer |
| `bg-surface-sunken` | `--surface-sunken` | Recessed areas, tooltips |
| `bg-surface-default` | `--surface-default` | Default panels, sidebar |
| `bg-surface-raised` | `--surface-raised` | Cards, elevated containers |
| `bg-surface-overlay` | `--surface-overlay` | Dropdowns, popovers |
| `bg-surface-elevated` | `--surface-elevated` | Active states, highlights |

### Border Colors

| Token | CSS Variable | Usage |
|-------|--------------|-------|
| `border-subtle` | `--border-subtle` | Very faint dividers |
| `border-default` | `--border-default` | Standard borders |
| `border-emphasis` | `--border-emphasis` | Hover states |
| `border-strong` | `--border-strong` | Active/selected states |

### Text Colors

| Token | CSS Variable | Usage |
|-------|--------------|-------|
| `text-primary` | `--text-primary` | Main text, headings |
| `text-secondary` | `--text-secondary` | Secondary text |
| `text-tertiary` | `--text-tertiary` | Muted text, labels |
| `text-quaternary` | `--text-quaternary` | Very muted text |
| `text-disabled` | `--text-disabled` | Disabled states |

### Accent Colors

| Token | CSS Variable | Usage |
|-------|--------------|-------|
| `accent-layer` | `--accent-layer` | Editable layer borders (orange) |
| `accent-brand` | `--accent-brand` | Brand actions |

## Usage Rules

### DO ✅

```jsx
// Use token classes
<div className="bg-surface-raised border-default text-tertiary" />

// Use CSS variables in style props when needed
<div style={{ backgroundColor: 'var(--surface-raised)' }} />
```

### DON'T ❌

```jsx
// No hardcoded hex colors
<div style={{ backgroundColor: '#1a1a1a' }} />

// No default Tailwind colors (purple, blue, etc.)
<div className="bg-purple-500 text-blue-400" />

// No gray-* classes (use tokens instead)
<div className="bg-gray-800 text-gray-400" />

// No rgb/rgba inline colors
<div style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
```

## Enforcement

### Build Time
Tailwind config only exposes design tokens. Using `bg-purple-500` or similar will not generate any CSS.

### Lint Time
ESLint rules warn on:
- Hex color literals (`#ffffff`)
- rgb/rgba color functions

### Code Review
Reference this document when reviewing PRs.

## Adding New Tokens

1. Define the CSS variable in `src/index.css`:
   ```css
   :root {
     --new-token: #value;
   }
   ```

2. Add to `tailwind.config.js`:
   ```js
   colors: {
     newToken: 'var(--new-token)',
   }
   ```

3. Document in this file.

## File Locations

- **CSS Variables**: `src/index.css`
- **Tailwind Config**: `tailwind.config.js`
- **UI Primitives**: `src/components/ui/`
- **ESLint Rules**: `eslint.config.js`

## Migration Notes

The `gray-*` classes are mapped to design tokens for backwards compatibility during migration. New code should use the semantic token names directly:

| Legacy | Preferred |
|--------|-----------|
| `bg-gray-800` | `bg-surface-raised` |
| `bg-gray-700` | `bg-surface-overlay` |
| `text-gray-400` | `text-tertiary` |
| `border-gray-700` | `border-default` |

