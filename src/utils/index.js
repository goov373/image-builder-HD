/**
 * Utils Index
 * Centralized exports for all utility modules
 *
 * Note: Only exports functions that are used externally.
 * Internal utility functions remain in their modules but are not re-exported.
 */

// Color utilities - only commonly used ones (now TypeScript)
export { hexToRgb, rgbToHex, interpolateColor } from './colorUtils.ts';

// Gradient utilities - only commonly used ones (now TypeScript)
export {
  isSolidColor,
  isGradient,
  extractColors,
  getStartColor,
  getEndColor,
  getDominantColor,
} from './gradientParser.ts';

// Image compression - main functions (now TypeScript)
export { compressImages, formatFileSize, COMPRESSION_PRESETS } from './imageCompression.ts';

// Undo/Redo utilities (now TypeScript)
export { undoable, canUndo, canRedo, getHistoryCounts, UNDO, REDO, CLEAR_HISTORY } from './undoable.ts';

// Browser Export utilities - WYSIWYG exports using browser rendering
// 🏆 GOLDEN RULE: Always use browser rendering for exports
export {
  exportElement,
  exportToPng,
  exportToJpeg,
  exportToBlob,
  exportToCanvas,
  getExtension,
  getMimeType,
  EXPORT_DEFAULTS,
  RESOLUTION_SCALES,
} from './browserExport';

// Logger utility - environment-aware logging (now TypeScript)
export { logger } from './logger.ts';
