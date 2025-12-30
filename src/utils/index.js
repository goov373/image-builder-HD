/**
 * Utils Index
 * Centralized exports for all utility modules
 * 
 * Note: Only exports functions that are used externally.
 * Internal utility functions remain in their modules but are not re-exported.
 */

// Color utilities - only commonly used ones
export {
  hexToRgb,
  rgbToHex,
  interpolateColor,
} from './colorUtils';

// Gradient utilities - only commonly used ones
export {
  isSolidColor,
  isGradient,
  extractColors,
  getStartColor,
  getEndColor,
  getDominantColor,
} from './gradientParser';

// Smooth backgrounds - main function
export {
  smoothCarouselBackgrounds,
} from './smoothBackgrounds';

// Image compression - main functions
export {
  compressImages,
  formatFileSize,
  COMPRESSION_PRESETS,
} from './imageCompression';
