/**
 * Shared Layer Types
 * Common interfaces for layer structures used across hooks
 */

/**
 * Pattern Layer - SVG pattern overlay
 */
export interface PatternLayer {
  id: string;
  patternId: string;
  opacity: number;
  scale: number;
  color?: string;
  rotation?: number;
  isStretched?: boolean;
  stretchSize?: string;
  stretchPosition?: string;
}

/**
 * Image Layer - Photo/image overlay
 */
export interface ImageLayer {
  id: string;
  src: string;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  rotation: number;
  zIndex: number;
  fit: 'cover' | 'contain' | 'fill' | 'none';
}

/**
 * Icon Layer - SVG icon overlay
 */
export interface IconLayer {
  id: string;
  iconId: string;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  color: string;
  zIndex: number;
}

/**
 * Background Override - Custom background settings
 */
export interface BackgroundOverride {
  gradient?: string;
  color?: string;
  size?: string;
  position?: string;
  isStretched?: boolean;
}

/**
 * Text Formatting - Font and style settings
 */
export interface TextFormatting {
  fontFamily?: string;
  fontSize?: string | number;
  fontWeight?: string | number;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: string | number;
  letterSpacing?: string | number;
  textDecoration?: string;
  fontStyle?: string;
}

/**
 * Field Formatting Map - Formatting keyed by field name
 */
export interface FieldFormattingMap {
  [fieldName: string]: TextFormatting;
}

/**
 * Content Variant - Text content with formatting
 */
export interface ContentVariant {
  headline?: string;
  subhead?: string;
  body?: string;
  cta?: string;
  formatting?: FieldFormattingMap;
  [key: string]: string | FieldFormattingMap | undefined;
}

/**
 * Base Frame - Common frame properties
 */
export interface BaseFrame {
  id: number;
  variants: ContentVariant[];
  currentVariant: number;
  currentLayout: number;
  layoutVariant?: number;
  style?: string;
  size?: string;
  backgroundOverride?: BackgroundOverride;
  patternLayer?: PatternLayer;
  imageLayer?: ImageLayer;
  iconLayer?: IconLayer;
}

