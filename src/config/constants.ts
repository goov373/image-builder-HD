/**
 * Application Constants
 * Centralized configuration values for easy updates
 */

// ===== STORAGE KEYS =====
// Used for localStorage persistence
export const STORAGE_KEYS = {
  CAROUSELS: 'carousel-tool-carousels',
  EBLASTS: 'carousel-tool-eblasts',
  VIDEO_COVERS: 'carousel-tool-videocovers',
  SINGLE_IMAGES: 'carousel-tool-singleimages',
  DESIGN_SYSTEM: 'carousel-tool-design-system-v8',
  TABS: 'carousel-tool-tabs-v2',
  AUTH: 'carousel-tool-auth',
  PROJECTS: 'carousel-tool-projects',
} as const;

// ===== LIMITS =====
// Maximum counts for various features
export const LIMITS = {
  MAX_TABS: 10,
  MAX_UPLOADED_FILES: 50,
  MAX_UPLOADED_DOCS: 20,
  MAX_FRAMES_PER_CAROUSEL: 20,
  MAX_SECTIONS_PER_EBLAST: 15,
  MAX_LAYERS_PER_IMAGE: 10,
} as const;

// ===== DEFAULTS =====
// Default values for various settings
export const DEFAULTS = {
  ZOOM: 120,
  FRAME_SIZE: 'portrait',
  LAYOUT_INDEX: 0,
  VARIANT_INDEX: 0,
  HEADING_WEIGHT: '700',
  BODY_WEIGHT: '400',
  LINE_HEIGHT: 1.4,
  LETTER_SPACING: 0,
  FONT_SIZE_SCALE: 1,
} as const;

// ===== IMAGE COMPRESSION =====
// Settings for image upload compression
export const IMAGE_COMPRESSION = {
  PRESETS: {
    highQuality: {
      maxWidth: 2048,
      quality: 0.9,
      label: 'High (2K) - Best for hero images',
    },
    standard: {
      maxWidth: 1080,
      quality: 0.85,
      label: 'Standard (1080p) - Web/social',
    },
    optimized: {
      maxWidth: 720,
      quality: 0.8,
      label: 'Optimized (720p) - Fastest loading',
    },
  },
  ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  MAX_FILE_SIZE_MB: 10,
} as const;

// ===== SMOOTH BACKGROUNDS =====
// Settings for the gradient smooth tool
export const SMOOTH_SETTINGS = {
  INTENSITY_NOTCHES: [
    { step: 1, label: 'Light', value: 25 },
    { step: 2, label: 'Medium', value: 50 },
    { step: 3, label: 'Strong', value: 75 },
    { step: 4, label: 'Full', value: 100 },
  ],
  DIRECTIONS: [
    { id: 'diagonal', label: 'Diagonal', icon: '↘' },
    { id: 'diagonal-mirror', label: 'Mirror', icon: '↙' },
  ],
  DEFAULT_INTENSITY: 2,
  DEFAULT_DIRECTION: 'diagonal',
} as const;

// ===== FONT WEIGHTS =====
// Available font weight options
export const FONT_WEIGHTS = [
  { name: 'ExtraLight', value: '200', weight: 200 },
  { name: 'Light', value: '300', weight: 300 },
  { name: 'Regular', value: '400', weight: 400 },
  { name: 'Medium', value: '500', weight: 500 },
  { name: 'SemiBold', value: '600', weight: 600 },
  { name: 'Bold', value: '700', weight: 700 },
  { name: 'ExtraBold', value: '800', weight: 800 },
  { name: 'Black', value: '900', weight: 900 },
] as const;

// ===== FONT SIZES =====
// Available font size scale options
export const FONT_SIZE_OPTIONS = [
  { name: 'S', value: 0.85, label: 'Small' },
  { name: 'M', value: 1, label: 'Medium' },
  { name: 'L', value: 1.2, label: 'Large' },
] as const;

// ===== TEXT ALIGNMENT =====
export const TEXT_ALIGN_OPTIONS = [
  { id: 'left', icon: 'alignLeft', label: 'Left' },
  { id: 'center', icon: 'alignCenter', label: 'Center' },
  { id: 'right', icon: 'alignRight', label: 'Right' },
] as const;

// ===== LINE SPACING =====
export const LINE_SPACING_OPTIONS = [
  { value: 1.0, label: 'Tight' },
  { value: 1.2, label: 'Snug' },
  { value: 1.4, label: 'Normal' },
  { value: 1.6, label: 'Relaxed' },
  { value: 2.0, label: 'Loose' },
] as const;

// ===== LETTER SPACING =====
export const LETTER_SPACING_OPTIONS = [
  { value: -0.05, label: 'Tight' },
  { value: 0, label: 'Normal' },
  { value: 0.05, label: 'Wide' },
  { value: 0.1, label: 'Wider' },
] as const;

// ===== PROJECT TYPES =====
export const PROJECT_TYPE_ICONS = {
  carousel: 'layers',
  singleImage: 'image',
  eblast: 'mail',
  videoCover: 'play',
} as const;

// ===== TYPE EXPORTS =====
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
export type FontWeight = typeof FONT_WEIGHTS[number];
export type FontSizeOption = typeof FONT_SIZE_OPTIONS[number];
export type SmoothDirection = typeof SMOOTH_SETTINGS.DIRECTIONS[number]['id'];

