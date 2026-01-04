// Color utilities
export { hexToRgb, rgbToHex, interpolateColor } from './colorUtils';

// Gradient utilities
export {
  isSolidColor,
  isGradient,
  extractColors,
  getStartColor,
  getEndColor,
  getDominantColor,
} from './gradientParser';

// Image compression
export { compressImages, formatFileSize, COMPRESSION_PRESETS } from './imageCompression';

// Undo/Redo utilities
export {
  undoable,
  canUndo,
  canRedo,
  getHistoryCounts,
  UNDO,
  REDO,
  CLEAR_HISTORY,
  type UndoableState,
  type Action,
  type UndoableConfig,
  type ActionFilter,
} from './undoable';

// Browser Export utilities
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

// Logger utility
export { logger } from './logger';

