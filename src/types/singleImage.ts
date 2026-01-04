/**
 * Single Image Project Types
 * For creating SaaS product mockup images
 */

// Canvas sizes for different use cases
export type CanvasSize = 'hero' | 'square' | 'wide' | 'tall' | 'og' | 'twitter';

// Mockup template types
export type MockupTemplate =
  | 'dashboard-full'
  | 'dashboard-cropped-tl'
  | 'dashboard-cropped-tr'
  | 'dashboard-cropped-bl'
  | 'dashboard-cropped-br'
  | 'modal-centered'
  | 'modal-offset'
  | 'card-stack'
  | 'sidebar-peek'
  | 'mobile-float'
  | 'browser-window'
  | 'feature-callout';

// Decorator types
export type DecoratorType =
  | 'chip'
  | 'tag'
  | 'tooltip'
  | 'badge'
  | 'notification'
  | 'progress'
  | 'sparkline'
  | 'avatar-group'
  | 'rating'
  | 'stat-card'
  | 'arrow-callout';

// Border/stroke styles
export type BorderStyle = 'none' | 'solid' | 'dashed' | 'dotted' | 'gradient';

// Background types
export interface Background {
  type: 'solid' | 'gradient' | 'transparent' | 'blur' | 'pattern';
  color?: string;
  gradient?: {
    type: 'linear' | 'radial';
    from: string;
    to: string;
    angle: number;
  };
  pattern?: 'dots' | 'grid' | 'noise';
  blur?: number;
}

// Mockup styling options
export interface MockupStyle {
  cornerRadius: number; // 0-48px
  borderWidth: number; // 0-8px
  borderColor: string;
  borderStyle: BorderStyle;
  borderGradient?: { from: string; to: string };
  // Outer shadow
  shadowEnabled: boolean;
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowColor: string;
  // Inner shadow (inset)
  innerShadowEnabled: boolean;
  innerShadowBlur: number;
  innerShadowColor: string;
  // Glow effect
  glowEnabled: boolean;
  glowColor: string;
  glowBlur: number;
}

// Position and transform
export interface Transform {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  // 3D perspective
  perspective?: number;
  rotateX?: number;
  rotateY?: number;
}

// Base layer interface
export interface BaseLayer {
  id: number;
  name: string;
  type: 'mockup' | 'decorator' | 'text' | 'shape';
  transform: Transform;
  opacity: number;
  visible: boolean;
  locked: boolean;
  zIndex: number;
}

// Mockup layer (dashboard screenshots)
export interface MockupLayer extends BaseLayer {
  type: 'mockup';
  template: MockupTemplate;
  cropRegion?: { x: number; y: number; width: number; height: number };
  style: MockupStyle;
  imageUrl?: string; // Uploaded screenshot
  placeholderType?: 'dashboard' | 'analytics' | 'settings' | 'table' | 'chart';
}

// Decorator layer (chips, tags, etc.)
export interface DecoratorLayer extends BaseLayer {
  type: 'decorator';
  decoratorType: DecoratorType;
  content: string;
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  size: 'sm' | 'md' | 'lg';
  icon?: string;
  // Decorator-specific styling
  decoratorStyle: {
    backgroundColor: string;
    textColor: string;
    borderRadius: number;
    hasShadow: boolean;
    hasGlow: boolean;
    glowColor?: string;
  };
}

// Text layer
export interface TextLayer extends BaseLayer {
  type: 'text';
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  lineHeight: number;
}

// Shape layer (for backgrounds, dividers, etc.)
export interface ShapeLayer extends BaseLayer {
  type: 'shape';
  shapeType: 'rectangle' | 'ellipse' | 'line' | 'arrow';
  fill: string;
  stroke: string;
  strokeWidth: number;
}

// Union type for all layers
export type Layer = MockupLayer | DecoratorLayer | TextLayer | ShapeLayer;

// Pattern layer for canvas background (imported from main types)
export interface SingleImagePatternLayer {
  id: string;
  patternId: string;
  scale: number;
  rotation: number;
  opacity: number;
  blendMode: 'normal' | 'multiply' | 'overlay' | 'soft-light' | 'screen';
}

// Main Single Image document
export interface SingleImage {
  id: number;
  name: string;
  subtitle: string;
  canvasSize: CanvasSize;
  canvasWidth: number;
  canvasHeight: number;
  background: Background;
  // Optional direct gradient CSS string (overrides background.gradient)
  backgroundGradient?: string;
  // Optional pattern layer for canvas
  patternLayer?: SingleImagePatternLayer;
  layers: Layer[];
  // Metadata
  createdAt: string;
  updatedAt: string;
}

// Canvas size presets
export const CANVAS_SIZES: Record<CanvasSize, { width: number; height: number; label: string; useCase: string }> = {
  hero: { width: 1200, height: 630, label: 'Hero', useCase: 'Landing page hero sections' },
  square: { width: 1080, height: 1080, label: 'Square', useCase: 'Social media posts' },
  wide: { width: 1920, height: 1080, label: 'Wide', useCase: 'Presentations, banners' },
  tall: { width: 800, height: 1200, label: 'Tall', useCase: 'Pinterest, vertical displays' },
  og: { width: 1200, height: 630, label: 'OG Image', useCase: 'Social sharing previews' },
  twitter: { width: 1200, height: 675, label: 'Twitter', useCase: 'Twitter/X cards' },
};

// Default mockup style
export const DEFAULT_MOCKUP_STYLE: MockupStyle = {
  cornerRadius: 12,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.1)',
  borderStyle: 'solid',
  shadowEnabled: true,
  shadowX: 0,
  shadowY: 24,
  shadowBlur: 48,
  shadowSpread: -12,
  shadowColor: 'rgba(0,0,0,0.25)',
  innerShadowEnabled: false,
  innerShadowBlur: 0,
  innerShadowColor: 'rgba(0,0,0,0.1)',
  glowEnabled: false,
  glowColor: '#6466e9',
  glowBlur: 24,
};
