// ===== Project Types =====
export type ProjectType = 'carousel' | 'eblast' | 'videoCover';

// ===== Design System Types =====
export interface DesignSystem {
  primary: string;
  secondary: string;
  accent: string;
  neutral1: string;
  neutral2: string;
  neutral3: string;
  fontHeadline: string;
  fontBody: string;
}

// ===== Frame & Carousel Types =====
export interface TextFormatting {
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  underlineStyle?: 'solid' | 'dotted' | 'wavy' | 'highlight';
  underlineColor?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  letterSpacing?: number;
}

export interface VariantFormatting {
  headline?: TextFormatting;
  body?: TextFormatting;
}

export interface Variant {
  headline: string;
  body: string;
  formatting: VariantFormatting;
}

export interface Frame {
  id: number;
  variants: Variant[];
  currentVariant: number;
  currentLayout: number;
  layoutVariant: number;
  style: string;
  hideProgress?: boolean;
}

export interface Carousel {
  id: number;
  name: string;
  subtitle: string;
  frameSize: FrameSizeKey;
  frames: Frame[];
}

export type FrameSizeKey = 'portrait' | 'square' | 'story' | 'powerpoint' | 'landscape';

export interface FrameSize {
  name: string;
  ratio: string;
  width: number;
  height: number;
}

// ===== Project/Tab Types =====
export interface ProjectTab {
  id: number;
  name: string;
  active: boolean;
  hasContent: boolean;
  createdAt: string;
  updatedAt: string;
  frameCount: number;
  projectType: ProjectType;
}

// ===== Eblast Types =====
export interface EblastSection {
  id: number;
  sectionType: 'header' | 'hero' | 'feature' | 'cta' | 'footer';
  variants: Variant[];
  currentVariant: number;
  currentLayout: number;
  layoutVariant: number;
  style: string;
  size: string;
  ctaText?: string;
  ctaUrl?: string;
}

export interface Eblast {
  id: number;
  name: string;
  subtitle: string;
  previewText: string;
  sections: EblastSection[];
}

// ===== Video Cover Types =====
export interface VideoCover {
  id: number;
  name: string;
  subtitle: string;
  frame: Frame;
  frameSize: string;
  showPlayButton: boolean;
  episodeNumber?: string;
  seriesName?: string;
}

// ===== Font Types =====
export interface FontOption {
  name: string;
  value: string;
}

// ===== Action Types for Reducer =====
export type CarouselAction =
  | { type: 'SET_CAROUSELS'; carousels: Carousel[] }
  | { type: 'SELECT_CAROUSEL'; carouselId: number | null }
  | { type: 'SELECT_FRAME'; carouselId: number; frameId: number }
  | { type: 'SET_ACTIVE_TEXT_FIELD'; field: 'headline' | 'body' | null }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SET_VARIANT'; carouselId: number; frameId: number; variantIndex: number }
  | { type: 'SET_LAYOUT'; carouselId: number; frameId: number; layoutIndex: number }
  | { type: 'SHUFFLE_LAYOUT_VARIANT'; carouselId: number; frameId: number }
  | { type: 'UPDATE_TEXT'; carouselId: number; frameId: number; field: 'headline' | 'body'; value: string }
  | { type: 'UPDATE_FORMATTING'; carouselId: number; frameId: number; field: 'headline' | 'body'; key: keyof TextFormatting; value: unknown }
  | { type: 'ADD_FRAME'; carouselId: number; position: number | null }
  | { type: 'REMOVE_FRAME'; carouselId: number; frameId: number }
  | { type: 'CHANGE_FRAME_SIZE'; carouselId: number; newSize: FrameSizeKey }
  | { type: 'REORDER_FRAMES'; carouselId: number; oldIndex: number; newIndex: number }
  | { type: 'ADD_ROW'; afterIndex: number }
  | { type: 'REMOVE_ROW'; carouselId: number };

export interface CarouselState {
  carousels: Carousel[];
  selectedCarouselId: number | null;
  selectedFrameId: number | null;
  activeTextField: 'headline' | 'body' | null;
}

// ===== Context Types =====
export interface DesignSystemContextValue {
  designSystem: DesignSystem;
  setDesignSystem: (ds: DesignSystem) => void;
}

export interface SelectionContextValue {
  selectedCarouselId: number | null;
  selectedFrameId: number | null;
  selectedCarousel: Carousel | undefined;
  selectedFrame: Frame | undefined;
  activeTextField: 'headline' | 'body' | null;
  setActiveTextField: (field: 'headline' | 'body' | null) => void;
  handleSelectFrame: (carouselId: number, frameId: number) => void;
  handleSelectCarousel: (carouselId: number | null) => void;
  handleDeselect: () => void;
}

export interface CarouselsContextValue {
  carousels: Carousel[];
  handleSetVariant: (carouselId: number, frameId: number, variantIndex: number) => void;
  handleSetLayout: (carouselId: number, frameId: number, layoutIndex: number) => void;
  handleShuffleLayoutVariant: (carouselId: number, frameId: number) => void;
  handleUpdateText: (carouselId: number, frameId: number, field: 'headline' | 'body', value: string) => void;
  handleUpdateFormatting: (carouselId: number, frameId: number, field: 'headline' | 'body', key: keyof TextFormatting, value: unknown) => void;
  handleAddFrame: (carouselId: number, position?: number | null) => void;
  handleRemoveFrame: (carouselId: number, frameId: number) => void;
  handleChangeFrameSize: (carouselId: number, newSize: FrameSizeKey) => void;
  handleReorderFrames: (carouselId: number, oldIndex: number, newIndex: number) => void;
  handleAddRow: (afterIndex: number) => void;
  handleRemoveRow: (carouselId: number) => void;
}

// ===== Component Props Types =====
export interface FrameStyle {
  bg: string;
  text: string;
  accent: string;
  pin?: string;
}

