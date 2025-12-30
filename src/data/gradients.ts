/**
 * Background Gradients Data
 * Centralized gradient definitions for easy maintenance and AI agent updates
 * 
 * Naming Convention:
 * - Each gradient has an id, name, and css value
 * - Grouped by category for organization
 */

export interface GradientDefinition {
  id: string;
  name: string;
  css: string;
  category: 'purple-transparent' | 'white-purple' | 'purple-radial' | 'purple-linear' | 'orange' | 'black';
}

// ===== PURPLE TO TRANSPARENT GRADIENTS =====
// Purple fading to clear for overlay effects
export const purpleTransparentGradients: GradientDefinition[] = [
  {
    id: 'pt-diagonal-fade',
    name: 'Diagonal Fade',
    category: 'purple-transparent',
    css: 'linear-gradient(135deg, #6466e9 0%, rgba(100,102,233,0.85) 20%, rgba(129,140,248,0.6) 40%, rgba(165,180,252,0.35) 60%, rgba(165,180,252,0.15) 80%, rgba(165,180,252,0) 100%)',
  },
  {
    id: 'pt-bottom-fade',
    name: 'Bottom Fade',
    category: 'purple-transparent',
    css: 'linear-gradient(0deg, #6466e9 0%, rgba(100,102,233,0.85) 18%, rgba(129,140,248,0.6) 38%, rgba(165,180,252,0.35) 58%, rgba(165,180,252,0.15) 78%, rgba(165,180,252,0) 100%)',
  },
  {
    id: 'pt-corner-fade',
    name: 'Corner Fade',
    category: 'purple-transparent',
    css: 'linear-gradient(225deg, #6466e9 0%, rgba(100,102,233,0.85) 18%, rgba(129,140,248,0.6) 38%, rgba(165,180,252,0.35) 58%, rgba(165,180,252,0.15) 78%, rgba(165,180,252,0) 100%)',
  },
];

// ===== WHITE-PURPLE GRADIENTS =====
// Light backgrounds with subtle purple transitions
export const whitePurpleGradients: GradientDefinition[] = [
  {
    id: 'wp-diagonal-mesh',
    name: 'Diagonal Mesh',
    category: 'white-purple',
    css: 'linear-gradient(135deg, #6466e9 0%, #6d70eb 15%, #7a7eed 30%, #8b8ff2 45%, #9ea3f5 58%, #b3b8f8 70%, #c9cdfa 82%, #e0e3fc 92%, #f5f6ff 100%)',
  },
  {
    id: 'wp-soft-diagonal',
    name: 'Soft Diagonal',
    category: 'white-purple',
    css: 'linear-gradient(160deg, #7c7ff2 0%, #8d90f4 15%, #9ea2f6 28%, #b0b5f8 42%, #c3c7fa 55%, #d6d9fc 68%, #e9ebfe 82%, #ffffff 100%)',
  },
];

// ===== PURPLE RADIAL GRADIENTS =====
// Soft highlight aesthetic with organic glow effects
export const purpleRadialGradients: GradientDefinition[] = [];

// ===== PURPLE LINEAR GRADIENTS =====
// Smooth gradual fades in different directions
export const purpleLinearGradients: GradientDefinition[] = [
  {
    id: 'pl-corner-bloom',
    name: 'Corner Bloom',
    category: 'purple-linear',
    css: 'linear-gradient(140deg, rgba(92,95,219,0.2) 0%, transparent 25%), linear-gradient(130deg, rgba(100,102,233,0.15) 0%, transparent 20%), linear-gradient(135deg, #a5b4fc 0%, #a5b4fc 30%, #9ca9f9 45%, #939ff6 55%, #8a96f3 65%, #818cf8 75%, #8a96f3 82%, #939ff6 88%, #9ca9f9 94%, #a5b4fc 100%)',
  },
  {
    id: 'pl-corner-glow',
    name: 'Corner Glow',
    category: 'purple-linear',
    css: 'linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 10%, #818cf8 28%, #6a6eea 50%, #5c5fdb 100%)',
  },
  {
    id: 'pl-diagonal-bottom-left',
    name: 'Diagonal Bottom-Left',
    category: 'purple-linear',
    css: 'linear-gradient(45deg, #c7d2fe 0%, #a5b4fc 25%, #818cf8 50%, #6466e9 75%, #5558d9 100%)',
  },
  {
    id: 'pl-subtle-angle',
    name: 'Subtle Angle',
    category: 'purple-linear',
    css: 'linear-gradient(160deg, #d4d9fc 0%, #b8c0f0 15%, #a5b4fc 30%, #8b8fef 50%, #7578eb 70%, #6466e9 85%, #5c5fdb 100%)',
  },
];

// ===== ORANGE GRADIENTS =====
// Light & airy orange variations
export const orangeGradients: GradientDefinition[] = [
  {
    id: 'or-warm-vertical',
    name: 'Warm Vertical',
    category: 'orange',
    css: 'linear-gradient(180deg, #fee0cc 0%, #fcb98c 30%, #f9944e 60%, #f7843c 100%)',
  },
  {
    id: 'or-horizontal-fade',
    name: 'Horizontal Fade',
    category: 'orange',
    css: 'linear-gradient(90deg, #f57c3a 0%, #f78b4a 20%, #f9a066 45%, #fcb88a 70%, #fdd8c2 100%)',
  },
  {
    id: 'or-corner-sweep',
    name: 'Corner Sweep',
    category: 'orange',
    css: 'linear-gradient(45deg, #e86a2c 0%, #f57c3a 18%, #f9944e 38%, #fcb88a 60%, #fde5d4 85%, #ffffff 100%)',
  },
];

// ===== BLACK/DARK GRADIENTS =====
// Subtle dark fades and vignettes
export const blackGradients: GradientDefinition[] = [
  {
    id: 'bk-shadow-charcoal',
    name: 'Shadow to Charcoal',
    category: 'black',
    css: 'linear-gradient(135deg, #18191A 0%, #2d2e30 100%)',
  },
  {
    id: 'bk-deep-charcoal',
    name: 'Deep to Charcoal',
    category: 'black',
    css: 'linear-gradient(135deg, #0f0f10 0%, #18191A 50%, #27282a 100%)',
  },
  {
    id: 'bk-horizontal-sweep',
    name: 'Horizontal Sweep',
    category: 'black',
    css: 'linear-gradient(90deg, #0a0a0b 0%, #18191A 50%, #252628 100%)',
  },
];

// ===== SOLID COLORS =====
export interface SolidColorDefinition {
  id: string;
  name: string;
  hex: string;
}

export const solidColors: SolidColorDefinition[] = [
  { id: 'sc-purple-primary', name: 'Purple Primary', hex: '#6466e9' },
  { id: 'sc-purple-light', name: 'Purple Light', hex: '#818cf8' },
  { id: 'sc-orange-accent', name: 'Orange Accent', hex: '#F97316' },
  { id: 'sc-gold', name: 'Gold', hex: '#fbbf24' },
  { id: 'sc-shadow-dark', name: 'Shadow Dark', hex: '#18191A' },
  { id: 'sc-charcoal', name: 'Charcoal', hex: '#2d2e30' },
  { id: 'sc-medium-grey', name: 'Medium Grey', hex: '#6B7280' },
  { id: 'sc-light-medium-grey', name: 'Light Medium Grey', hex: '#9CA3AF' },
  { id: 'sc-light-grey', name: 'Light Grey', hex: '#eef1f9' },
  { id: 'sc-purple-bg', name: 'Purple Background', hex: '#EEF2FF' },
  { id: 'sc-white', name: 'White', hex: '#ffffff' },
  { id: 'sc-black', name: 'Black', hex: '#000000' },
];

// ===== COMBINED EXPORTS =====
// All gradients combined in display order
export const allGradients: GradientDefinition[] = [
  ...purpleTransparentGradients,
  ...whitePurpleGradients,
  ...purpleRadialGradients,
  ...purpleLinearGradients,
  ...orangeGradients,
  ...blackGradients,
];

// Get CSS values array (for backward compatibility)
export const getAllGradientCSSValues = (): string[] => allGradients.map(g => g.css);

// Get solid color hex values array (for backward compatibility)
export const getSolidColorHexValues = (): string[] => solidColors.map(c => c.hex);

// Utility: Find gradient by ID
export const findGradientById = (id: string): GradientDefinition | undefined => 
  allGradients.find(g => g.id === id);

// Utility: Get gradients by category
export const getGradientsByCategory = (category: GradientDefinition['category']): GradientDefinition[] =>
  allGradients.filter(g => g.category === category);

