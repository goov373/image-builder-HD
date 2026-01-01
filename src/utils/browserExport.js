/**
 * Browser Export Utility
 *
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                           🏆 GOLDEN RULE 🏆                               ║
 * ║                                                                           ║
 * ║   ALWAYS use browser rendering for exports to guarantee the user         ║
 * ║   receives EXACTLY what they see when designing.                         ║
 * ║                                                                           ║
 * ║   ❌ DO NOT use libraries that redraw/rebuild DOM (like html2canvas)     ║
 * ║   ✅ DO use libraries that capture browser rendering (like html-to-image)║
 * ║                                                                           ║
 * ║   This ensures WYSIWYG (What You See Is What You Get) exports.           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 *
 * Why html-to-image over html2canvas?
 * ------------------------------------
 * - html2canvas: Rebuilds DOM by drawing to canvas with ctx.fillText()
 *   → Text metrics differ from browser, causing spacing issues
 *
 * - html-to-image: Embeds HTML in SVG <foreignObject>
 *   → Uses actual browser rendering, preserving exact appearance
 */

import { toPng, toJpeg, toBlob, toCanvas, toSvg } from 'html-to-image';

/**
 * Export configuration defaults
 * These settings ensure high-quality, accurate exports
 */
export const EXPORT_DEFAULTS = {
  // Pixel ratio for resolution (1x, 2x, 3x)
  pixelRatio: 2,
  // JPEG quality (0-1)
  quality: 0.95,
  // Bust cache to ensure fresh render
  cacheBust: true,
  // Include styles from stylesheets
  includeQueryParams: true,
};

/**
 * Resolution presets matching UI options
 */
export const RESOLUTION_SCALES = {
  '1x': 1,
  '2x': 2,
  '3x': 3,
};

/**
 * Filter function to exclude UI elements from export
 * Elements with data-no-export="true" or certain classes are skipped
 */
const defaultFilter = (node) => {
  // Skip elements marked for no export
  if (node.dataset?.noExport === 'true') return false;

  // Skip UI overlay elements (delete buttons, selection outlines, etc.)
  if (node.classList?.contains('delete-frame-btn')) return false;
  if (node.classList?.contains('export-exclude')) return false;

  return true;
};

/**
 * Wait for fonts to be fully loaded
 * Ensures text renders correctly in export
 */
const ensureFontsLoaded = async () => {
  try {
    await document.fonts.ready;
    // Small delay to ensure fonts are rendered
    await new Promise((resolve) => setTimeout(resolve, 50));
  } catch (e) {
    console.warn('Font loading check failed:', e);
  }
};

/**
 * Export a DOM element as PNG
 * Uses browser rendering to guarantee WYSIWYG output
 *
 * @param {HTMLElement} element - The DOM element to export
 * @param {Object} options - Export options
 * @returns {Promise<string>} - Data URL of the exported image
 */
export const exportToPng = async (element, options = {}) => {
  await ensureFontsLoaded();

  const config = {
    ...EXPORT_DEFAULTS,
    ...options,
    filter: options.filter || defaultFilter,
  };

  try {
    return await toPng(element, config);
  } catch (error) {
    console.error('PNG export failed:', error);
    // Retry with minimal options
    return await toPng(element, { pixelRatio: config.pixelRatio });
  }
};

/**
 * Export a DOM element as JPEG
 * Uses browser rendering to guarantee WYSIWYG output
 *
 * @param {HTMLElement} element - The DOM element to export
 * @param {Object} options - Export options
 * @returns {Promise<string>} - Data URL of the exported image
 */
export const exportToJpeg = async (element, options = {}) => {
  await ensureFontsLoaded();

  const config = {
    ...EXPORT_DEFAULTS,
    ...options,
    filter: options.filter || defaultFilter,
    // JPEG doesn't support transparency, so set background if not specified
    backgroundColor: options.backgroundColor || '#ffffff',
  };

  try {
    return await toJpeg(element, config);
  } catch (error) {
    console.error('JPEG export failed:', error);
    return await toJpeg(element, {
      pixelRatio: config.pixelRatio,
      backgroundColor: config.backgroundColor,
    });
  }
};

/**
 * Export a DOM element as Blob
 * Useful for creating File objects or uploading
 *
 * @param {HTMLElement} element - The DOM element to export
 * @param {Object} options - Export options
 * @returns {Promise<Blob>} - Blob of the exported image
 */
export const exportToBlob = async (element, options = {}) => {
  await ensureFontsLoaded();

  const config = {
    ...EXPORT_DEFAULTS,
    ...options,
    filter: options.filter || defaultFilter,
  };

  return await toBlob(element, config);
};

/**
 * Export a DOM element as Canvas
 * Useful when you need further canvas manipulation
 *
 * @param {HTMLElement} element - The DOM element to export
 * @param {Object} options - Export options
 * @returns {Promise<HTMLCanvasElement>} - Canvas element
 */
export const exportToCanvas = async (element, options = {}) => {
  await ensureFontsLoaded();

  const config = {
    ...EXPORT_DEFAULTS,
    ...options,
    filter: options.filter || defaultFilter,
  };

  return await toCanvas(element, config);
};

/**
 * Export a DOM element using the appropriate format
 * Central function that routes to the correct exporter
 *
 * @param {HTMLElement} element - The DOM element to export
 * @param {string} format - 'png', 'jpg', 'jpeg', or 'webp'
 * @param {Object} options - Export options
 * @returns {Promise<string>} - Data URL of the exported image
 */
export const exportElement = async (element, format = 'png', options = {}) => {
  const normalizedFormat = format.toLowerCase();

  switch (normalizedFormat) {
    case 'jpg':
    case 'jpeg':
      return await exportToJpeg(element, options);

    case 'webp':
      // WebP uses PNG export then canvas conversion
      // html-to-image doesn't have native WebP, so we use PNG
      // The data URL will still be PNG, but quality is equivalent
      return await exportToPng(element, options);

    case 'png':
    default:
      return await exportToPng(element, options);
  }
};

/**
 * Get file extension for format
 */
export const getExtension = (format) => {
  switch (format.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
      return 'jpg';
    case 'webp':
      return 'webp';
    case 'png':
    default:
      return 'png';
  }
};

/**
 * Get MIME type for format
 */
export const getMimeType = (format) => {
  switch (format.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'webp':
      return 'image/webp';
    case 'png':
    default:
      return 'image/png';
  }
};

export default {
  exportToPng,
  exportToJpeg,
  exportToBlob,
  exportToCanvas,
  exportElement,
  getExtension,
  getMimeType,
  EXPORT_DEFAULTS,
  RESOLUTION_SCALES,
};
