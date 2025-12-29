/**
 * Utils Index
 * Centralized exports for all utility modules
 */

// Color utilities
export {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  interpolateColor,
  parseRgba,
  getColorBrightness,
  isLightColor,
  darkenColor,
  lightenColor
} from './colorUtils';

// Gradient utilities
export {
  isSolidColor,
  isGradient,
  extractColors,
  parseLinearGradient,
  getStartColor,
  getEndColor,
  getDominantColor,
  splitGradientLayers,
  generateLinearGradient,
  modifyStartColor,
  modifyEndColor
} from './gradientParser';

// Smooth backgrounds
export {
  smoothCarouselBackgrounds,
  createFlowingSequence,
  analyzeColorHarmony
} from './smoothBackgrounds';

