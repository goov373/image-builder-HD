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
  category: 'white-purple' | 'purple-radial' | 'purple-linear' | 'orange' | 'black';
}

// ===== WHITE-PURPLE GRADIENTS =====
// Light backgrounds with subtle purple transitions
export const whitePurpleGradients: GradientDefinition[] = [
  {
    id: 'wp-diagonal-mesh',
    name: 'Diagonal Mesh',
    category: 'white-purple',
    css: 'linear-gradient(135deg, #ffffff 0%, #f5f6ff 15%, #e8ebf7 30%, #d4d9fc 45%, #b8c0f5 60%, #a5b4fc 75%, #818cf8 90%, #6466e9 100%)',
  },
  {
    id: 'wp-vertical-fade',
    name: 'Vertical Fade',
    category: 'white-purple',
    css: 'linear-gradient(180deg, #ffffff 0%, #f5f6ff 18%, #e8ebf7 35%, #c7d2fe 52%, #a5b4fc 70%, #818cf8 85%, #6466e9 100%)',
  },
  {
    id: 'wp-soft-diagonal',
    name: 'Soft Diagonal',
    category: 'white-purple',
    css: 'linear-gradient(160deg, #ffffff 0%, #ffffff 25%, #f5f6ff 40%, #e8ebf7 55%, #c7d2fe 70%, #a5b4fc 85%, #7c7ff2 100%)',
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
    css: 'linear-gradient(135deg, #a5b4fc 0%, #818cf8 20%, #6466e9 50%, #818cf8 80%, #a5b4fc 100%)',
  },
  {
    id: 'pl-corner-glow',
    name: 'Corner Glow',
    category: 'purple-linear',
    css: 'linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 10%, #818cf8 28%, #6a6eea 50%, #5c5fdb 100%)',
  },
  {
    id: 'pl-vertical-fade',
    name: 'Vertical Fade',
    category: 'purple-linear',
    css: 'linear-gradient(180deg, #b3bffc 0%, #9098f3 35%, #7276ec 60%, #5c5fdb 100%)',
  },
  {
    id: 'pl-center-band',
    name: 'Center Band',
    category: 'purple-linear',
    css: 'linear-gradient(0deg, #9098f3 0%, #7276ec 30%, #5c5fdb 50%, #7276ec 70%, #9098f3 100%)',
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
    id: 'or-peach-diagonal',
    name: 'Peach Diagonal',
    category: 'orange',
    css: 'linear-gradient(135deg, #fdd8c2 0%, #fcb88a 25%, #f9a066 50%, #f78b4a 75%, #f57c3a 100%)',
  },
  {
    id: 'or-warm-vertical',
    name: 'Warm Vertical',
    category: 'orange',
    css: 'linear-gradient(180deg, #fee0cc 0%, #fcb98c 30%, #f9944e 60%, #f7843c 100%)',
  },
  {
    id: 'or-subtle-radial',
    name: 'Subtle Radial',
    category: 'orange',
    css: 'radial-gradient(ellipse at 60% 40%, rgba(255, 255, 255, 0.25) 0%, transparent 50%), linear-gradient(160deg, #fcb88a 0%, #f9a066 35%, #f78b4a 70%, #f57c3a 100%)',
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
  {
    id: 'or-radial-center',
    name: 'Radial Center',
    category: 'orange',
    css: 'radial-gradient(ellipse at 50% 50%, #fccc9e 0%, #fcb88a 20%, #f9a066 40%, #f79455 60%, #f78b4a 80%, #f57c3a 100%)',
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
    id: 'bk-vertical-dark',
    name: 'Vertical Dark',
    category: 'black',
    css: 'linear-gradient(180deg, #1f2022 0%, #18191A 100%)',
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
  {
    id: 'bk-corner-fade',
    name: 'Corner Fade',
    category: 'black',
    css: 'linear-gradient(45deg, #18191A 0%, #1f2022 30%, #2a2b2d 60%, #353638 100%)',
  },
  {
    id: 'bk-radial-vignette',
    name: 'Radial Vignette',
    category: 'black',
    css: 'radial-gradient(ellipse at 50% 50%, #2d2e30 0%, #232425 40%, #18191A 80%, #0f0f10 100%)',
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

