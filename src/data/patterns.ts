/**
 * Background Patterns Data
 * Centralized pattern definitions for brand-aligned background textures
 * 
 * Patterns are rendered as SVG data URIs for crisp scaling
 * They sit BEHIND gradients but can blend with them using opacity/blend modes
 */

export interface PatternDefinition {
  id: string;
  name: string;
  svg: string;              // SVG pattern as data URI
  category: 'geometric' | 'organic' | 'minimal' | 'brand';
  defaultScale: number;     // Base scale (1 = 100%)
  defaultOpacity: number;   // 0-1
  tileSize: number;         // Size of repeating tile in px
}

export interface PatternLayer {
  id: string;
  patternId: string;        // Reference to PatternDefinition.id
  scale: number;            // 0.5 to 5
  rotation: number;         // 0-360 degrees
  opacity: number;          // 0-1
  blendMode: 'normal' | 'multiply' | 'overlay' | 'soft-light' | 'screen';
  color?: string;           // Optional tint color (replaces pattern color)
}

// Helper to create SVG data URI
const svgToDataUri = (svg: string): string => 
  `data:image/svg+xml,${encodeURIComponent(svg)}`;

// Brand purple color
const BRAND_PURPLE = '#6466e9';
const BRAND_PURPLE_LIGHT = '#a5b4fc';
const BRAND_PURPLE_MUTED = 'rgba(100, 102, 233, 0.15)';

// ===== GEOMETRIC PATTERNS =====
export const geometricPatterns: PatternDefinition[] = [
  {
    id: 'geo-dots-grid',
    name: 'Dots Grid',
    category: 'geometric',
    defaultScale: 1,
    defaultOpacity: 1,
    tileSize: 20,
    svg: svgToDataUri(`<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="1.5" fill="${BRAND_PURPLE}"/></svg>`),
  },
  {
    id: 'geo-dots-large',
    name: 'Large Dots',
    category: 'geometric',
    defaultScale: 1.5,
    defaultOpacity: 1,
    tileSize: 40,
    svg: svgToDataUri(`<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="3" fill="${BRAND_PURPLE}"/></svg>`),
  },
  {
    id: 'geo-diagonal-lines',
    name: 'Diagonal Lines',
    category: 'geometric',
    defaultScale: 1,
    defaultOpacity: 1,
    tileSize: 16,
    svg: svgToDataUri(`<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M-4,4 l8,-8 M0,16 l16,-16 M12,20 l8,-8" stroke="${BRAND_PURPLE}" stroke-width="1" fill="none"/></svg>`),
  },
  {
    id: 'geo-crosshatch',
    name: 'Crosshatch',
    category: 'geometric',
    defaultScale: 1,
    defaultOpacity: 1,
    tileSize: 16,
    svg: svgToDataUri(`<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M0,0 L16,16 M16,0 L0,16" stroke="${BRAND_PURPLE}" stroke-width="0.5" fill="none"/></svg>`),
  },
  {
    id: 'geo-plus-signs',
    name: 'Plus Signs',
    category: 'geometric',
    defaultScale: 1,
    defaultOpacity: 1,
    tileSize: 24,
    svg: svgToDataUri(`<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M12,8 v8 M8,12 h8" stroke="${BRAND_PURPLE}" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>`),
  },
  {
    id: 'geo-hex-grid',
    name: 'Hex Grid',
    category: 'geometric',
    defaultScale: 1.2,
    defaultOpacity: 1,
    tileSize: 28,
    svg: svgToDataUri(`<svg width="28" height="48" xmlns="http://www.w3.org/2000/svg"><path d="M14,0 L28,8 L28,24 L14,32 L0,24 L0,8 Z M14,32 L28,40 L28,48 M14,32 L0,40 L0,48" stroke="${BRAND_PURPLE}" stroke-width="0.75" fill="none"/></svg>`),
  },
];

// ===== ORGANIC PATTERNS =====
export const organicPatterns: PatternDefinition[] = [
  {
    id: 'org-waves',
    name: 'Waves',
    category: 'organic',
    defaultScale: 1.5,
    defaultOpacity: 1,
    tileSize: 60,
    svg: svgToDataUri(`<svg width="60" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M0,10 Q15,0 30,10 T60,10" stroke="${BRAND_PURPLE}" stroke-width="1" fill="none"/></svg>`),
  },
  {
    id: 'org-circles-flow',
    name: 'Circles Flow',
    category: 'organic',
    defaultScale: 1,
    defaultOpacity: 1,
    tileSize: 50,
    svg: svgToDataUri(`<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg"><circle cx="25" cy="25" r="20" stroke="${BRAND_PURPLE}" stroke-width="0.75" fill="none"/><circle cx="0" cy="0" r="15" stroke="${BRAND_PURPLE}" stroke-width="0.5" fill="none"/><circle cx="50" cy="50" r="15" stroke="${BRAND_PURPLE}" stroke-width="0.5" fill="none"/></svg>`),
  },
  {
    id: 'org-scattered-dots',
    name: 'Scattered Dots',
    category: 'organic',
    defaultScale: 1,
    defaultOpacity: 1,
    tileSize: 40,
    svg: svgToDataUri(`<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="1" fill="${BRAND_PURPLE}"/><circle cx="28" cy="15" r="1.5" fill="${BRAND_PURPLE}"/><circle cx="15" cy="32" r="1" fill="${BRAND_PURPLE}"/><circle cx="35" cy="35" r="0.75" fill="${BRAND_PURPLE}"/></svg>`),
  },
  {
    id: 'org-arcs',
    name: 'Arcs',
    category: 'organic',
    defaultScale: 1.5,
    defaultOpacity: 1,
    tileSize: 40,
    svg: svgToDataUri(`<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><path d="M0,40 Q20,20 40,40" stroke="${BRAND_PURPLE}" stroke-width="1" fill="none"/><path d="M0,0 Q20,20 40,0" stroke="${BRAND_PURPLE}" stroke-width="0.5" fill="none"/></svg>`),
  },
];

// ===== MINIMAL PATTERNS =====
export const minimalPatterns: PatternDefinition[] = [
  {
    id: 'min-subtle-grid',
    name: 'Subtle Grid',
    category: 'minimal',
    defaultScale: 1,
    defaultOpacity: 1,
    tileSize: 32,
    svg: svgToDataUri(`<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><path d="M32,0 L32,32 M0,32 L32,32" stroke="${BRAND_PURPLE}" stroke-width="0.5" fill="none"/></svg>`),
  },
  {
    id: 'min-fine-lines',
    name: 'Fine Lines',
    category: 'minimal',
    defaultScale: 1,
    defaultOpacity: 1,
    tileSize: 8,
    svg: svgToDataUri(`<svg width="8" height="8" xmlns="http://www.w3.org/2000/svg"><path d="M0,8 L8,8" stroke="${BRAND_PURPLE}" stroke-width="0.25" fill="none"/></svg>`),
  },
  {
    id: 'min-corners',
    name: 'Corners',
    category: 'minimal',
    defaultScale: 2,
    defaultOpacity: 1,
    tileSize: 24,
    svg: svgToDataUri(`<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M0,6 L0,0 L6,0 M18,0 L24,0 L24,6 M24,18 L24,24 L18,24 M6,24 L0,24 L0,18" stroke="${BRAND_PURPLE}" stroke-width="0.75" fill="none"/></svg>`),
  },
  {
    id: 'min-tiny-dots',
    name: 'Tiny Dots',
    category: 'minimal',
    defaultScale: 1,
    defaultOpacity: 1,
    tileSize: 12,
    svg: svgToDataUri(`<svg width="12" height="12" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="0.5" fill="${BRAND_PURPLE}"/></svg>`),
  },
];

// ===== BRAND PATTERNS =====
export const brandPatterns: PatternDefinition[] = [
  {
    id: 'brand-data-mesh',
    name: 'Data Mesh',
    category: 'brand',
    defaultScale: 1,
    defaultOpacity: 1,
    tileSize: 60,
    svg: svgToDataUri(`<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="2" fill="${BRAND_PURPLE}"/>
      <circle cx="50" cy="10" r="2" fill="${BRAND_PURPLE}"/>
      <circle cx="30" cy="30" r="3" fill="${BRAND_PURPLE}"/>
      <circle cx="10" cy="50" r="2" fill="${BRAND_PURPLE}"/>
      <circle cx="50" cy="50" r="2" fill="${BRAND_PURPLE}"/>
      <path d="M10,10 L30,30 M50,10 L30,30 M10,50 L30,30 M50,50 L30,30" stroke="${BRAND_PURPLE}" stroke-width="0.5" fill="none"/>
    </svg>`),
  },
  {
    id: 'brand-network-nodes',
    name: 'Network Nodes',
    category: 'brand',
    defaultScale: 1.2,
    defaultOpacity: 1,
    tileSize: 80,
    svg: svgToDataUri(`<svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="3" fill="${BRAND_PURPLE}"/>
      <circle cx="60" cy="20" r="2" fill="${BRAND_PURPLE_LIGHT}"/>
      <circle cx="40" cy="50" r="2.5" fill="${BRAND_PURPLE}"/>
      <circle cx="70" cy="60" r="1.5" fill="${BRAND_PURPLE_LIGHT}"/>
      <path d="M20,20 L40,50 M60,20 L40,50 M40,50 L70,60" stroke="${BRAND_PURPLE}" stroke-width="0.5" stroke-dasharray="2,2" fill="none"/>
    </svg>`),
  },
  {
    id: 'brand-circuit',
    name: 'Circuit',
    category: 'brand',
    defaultScale: 1,
    defaultOpacity: 1,
    tileSize: 48,
    svg: svgToDataUri(`<svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,24 L12,24 L12,12 L24,12 L24,24 L36,24 L36,36 L48,36" stroke="${BRAND_PURPLE}" stroke-width="1" fill="none"/>
      <circle cx="12" cy="24" r="2" fill="${BRAND_PURPLE}"/>
      <circle cx="24" cy="12" r="2" fill="${BRAND_PURPLE}"/>
      <circle cx="36" cy="36" r="2" fill="${BRAND_PURPLE}"/>
    </svg>`),
  },
  {
    id: 'brand-gradient-dots',
    name: 'Gradient Dots',
    category: 'brand',
    defaultScale: 1.5,
    defaultOpacity: 1,
    tileSize: 30,
    svg: svgToDataUri(`<svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="dotGrad">
          <stop offset="0%" stop-color="${BRAND_PURPLE}"/>
          <stop offset="100%" stop-color="${BRAND_PURPLE}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="15" cy="15" r="8" fill="url(#dotGrad)"/>
    </svg>`),
  },
];

// ===== STATIC FILE PATTERNS =====
// These patterns use static SVG files from /patterns/ folder
export const staticFilePatterns: PatternDefinition[] = [
  // Data Visualizations
  { id: 'pattern-street-grid', name: 'Market Map', category: 'brand', defaultScale: 1, defaultOpacity: 1, tileSize: 300, svg: '/patterns/street-grid.svg' },
  { id: 'pattern-comp-radius', name: 'Comp Radius', category: 'brand', defaultScale: 1, defaultOpacity: 1, tileSize: 300, svg: '/patterns/comp-radius-new.svg' },
  { id: 'pattern-rent-trends', name: 'Rent Trends', category: 'brand', defaultScale: 1, defaultOpacity: 1, tileSize: 300, svg: '/patterns/rent-trends.svg' },
  { id: 'pattern-apartment-units', name: 'Unit Grid', category: 'brand', defaultScale: 1, defaultOpacity: 1, tileSize: 300, svg: '/patterns/apartment-units.svg' },
  { id: 'pattern-market-heat', name: 'Market Heat', category: 'brand', defaultScale: 1, defaultOpacity: 1, tileSize: 300, svg: '/patterns/market-heat.svg' },
  { id: 'pattern-property-network', name: 'Data Network', category: 'brand', defaultScale: 1, defaultOpacity: 1, tileSize: 300, svg: '/patterns/property-network.svg' },
  // Neighborhood
  { id: 'pattern-city-blocks-1', name: 'Grid City', category: 'brand', defaultScale: 1, defaultOpacity: 1, tileSize: 300, svg: '/patterns/city-blocks-1.svg' },
  { id: 'pattern-city-blocks-2', name: 'Diagonal Ave', category: 'brand', defaultScale: 1, defaultOpacity: 1, tileSize: 300, svg: '/patterns/city-blocks-2.svg' },
  { id: 'pattern-city-blocks-3', name: 'Dense Urban', category: 'brand', defaultScale: 1, defaultOpacity: 1, tileSize: 300, svg: '/patterns/city-blocks-3.svg' },
  { id: 'pattern-city-blocks-4', name: 'River City', category: 'brand', defaultScale: 1, defaultOpacity: 1, tileSize: 300, svg: '/patterns/city-blocks-4.svg' },
  { id: 'pattern-city-blocks-5', name: 'Highway', category: 'brand', defaultScale: 1, defaultOpacity: 1, tileSize: 300, svg: '/patterns/city-blocks-5.svg' },
  { id: 'pattern-city-blocks-6', name: 'Roundabout', category: 'brand', defaultScale: 1, defaultOpacity: 1, tileSize: 300, svg: '/patterns/city-blocks-6.svg' },
  // Metro / Submarket
  { id: 'pattern-metro-1', name: 'Beltway', category: 'brand', defaultScale: 1, defaultOpacity: 1, tileSize: 300, svg: '/patterns/metro-1.svg' },
  { id: 'pattern-metro-2', name: 'River Metro', category: 'brand', defaultScale: 1, defaultOpacity: 1, tileSize: 300, svg: '/patterns/metro-2.svg' },
  { id: 'pattern-metro-3', name: 'Coastal', category: 'brand', defaultScale: 1, defaultOpacity: 1, tileSize: 300, svg: '/patterns/metro-3.svg' },
  { id: 'pattern-metro-4', name: 'Lakefront', category: 'brand', defaultScale: 1, defaultOpacity: 1, tileSize: 300, svg: '/patterns/metro-4.svg' },
  { id: 'pattern-metro-5', name: 'Airport Hub', category: 'brand', defaultScale: 1, defaultOpacity: 1, tileSize: 300, svg: '/patterns/metro-5.svg' },
  { id: 'pattern-metro-6', name: 'Multi-Core', category: 'brand', defaultScale: 1, defaultOpacity: 0.3, tileSize: 300, svg: '/patterns/metro-6.svg' },
];

// ===== EXPORTS =====

export const allPatterns: PatternDefinition[] = [
  ...geometricPatterns,
  ...organicPatterns,
  ...minimalPatterns,
  ...brandPatterns,
  ...staticFilePatterns,
];

export const patternCategories = [
  { id: 'geometric', name: 'Geometric', patterns: geometricPatterns },
  { id: 'organic', name: 'Organic', patterns: organicPatterns },
  { id: 'minimal', name: 'Minimal', patterns: minimalPatterns },
  { id: 'brand', name: 'Brand', patterns: brandPatterns },
] as const;

// Utility functions
export const findPatternById = (id: string): PatternDefinition | undefined => 
  allPatterns.find(p => p.id === id);

export const getPatternsByCategory = (category: PatternDefinition['category']): PatternDefinition[] =>
  allPatterns.filter(p => p.category === category);

/**
 * Creates a new PatternLayer with defaults from a pattern definition
 */
export const createPatternLayer = (patternId: string): PatternLayer | null => {
  const pattern = findPatternById(patternId);
  if (!pattern) return null;
  
  return {
    id: `pattern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    patternId,
    scale: pattern.defaultScale,
    rotation: 0,
    opacity: pattern.defaultOpacity,
    blendMode: 'normal',
  };
};

