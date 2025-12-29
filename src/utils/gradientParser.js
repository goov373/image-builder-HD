/**
 * Gradient Parser Utilities
 * Parse, analyze, and generate CSS gradients
 */

import { hexToRgb, rgbToHex, parseRgba } from './colorUtils';

/**
 * Check if a CSS background is a solid color
 * @param {string} cssBackground - CSS background value
 * @returns {boolean}
 */
export function isSolidColor(cssBackground) {
  if (!cssBackground) return false;
  const trimmed = cssBackground.trim();
  
  // Check for hex color
  if (/^#[0-9a-f]{3,8}$/i.test(trimmed)) return true;
  
  // Check for rgb/rgba without gradient
  if (/^rgba?\s*\(/i.test(trimmed) && !trimmed.includes('gradient')) return true;
  
  // Check for named colors (basic check)
  if (/^[a-z]+$/i.test(trimmed) && !trimmed.includes('gradient')) return true;
  
  return false;
}

/**
 * Check if a CSS background contains a gradient
 * @param {string} cssBackground - CSS background value
 * @returns {boolean}
 */
export function isGradient(cssBackground) {
  if (!cssBackground) return false;
  return cssBackground.includes('gradient');
}

/**
 * Extract all colors from a CSS gradient string
 * @param {string} cssBackground - CSS gradient or color
 * @returns {string[]} - Array of hex colors
 */
export function extractColors(cssBackground) {
  if (!cssBackground) return [];
  
  const colors = [];
  
  // Match hex colors
  const hexMatches = cssBackground.match(/#[0-9a-f]{3,8}/gi) || [];
  hexMatches.forEach(hex => {
    const normalized = normalizeHexColor(hex);
    if (normalized && !colors.includes(normalized)) {
      colors.push(normalized);
    }
  });
  
  // Match rgb/rgba colors
  const rgbaMatches = cssBackground.match(/rgba?\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d.]+)?\s*\)/gi) || [];
  rgbaMatches.forEach(rgba => {
    const parsed = parseRgba(rgba);
    if (parsed && parsed.a !== 0) { // Skip fully transparent colors
      const hex = rgbToHex(parsed.r, parsed.g, parsed.b);
      if (!colors.includes(hex)) {
        colors.push(hex);
      }
    }
  });
  
  return colors;
}

/**
 * Normalize a hex color to 6-digit format with #
 * @param {string} hex - Hex color
 * @returns {string | null}
 */
function normalizeHexColor(hex) {
  if (!hex) return null;
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

/**
 * Parse a linear gradient into structured data
 * @param {string} gradientStr - Linear gradient CSS string
 * @returns {{ type: string, angle: number, stops: Array<{ color: string, position: number }> } | null}
 */
export function parseLinearGradient(gradientStr) {
  if (!gradientStr || !gradientStr.includes('linear-gradient')) return null;
  
  // Extract the content inside linear-gradient(...)
  const match = gradientStr.match(/linear-gradient\s*\(([\s\S]+?)\)(?!\s*,\s*(?:linear|radial|conic))/i);
  if (!match) return null;
  
  const content = match[1].trim();
  
  // Parse angle
  let angle = 180; // Default to top-to-bottom
  const angleMatch = content.match(/^(\d+)deg/);
  if (angleMatch) {
    angle = parseInt(angleMatch[1], 10);
  } else if (content.startsWith('to ')) {
    // Handle directional keywords
    const dirMatch = content.match(/^to\s+(top|bottom|left|right)/i);
    if (dirMatch) {
      const directions = {
        'top': 0,
        'bottom': 180,
        'left': 270,
        'right': 90
      };
      angle = directions[dirMatch[1].toLowerCase()] || 180;
    }
  }
  
  // Parse color stops
  const stops = [];
  const colorStopRegex = /(#[0-9a-f]{3,8}|rgba?\s*\([^)]+\))\s*(\d+%)?/gi;
  let stopMatch;
  
  while ((stopMatch = colorStopRegex.exec(content)) !== null) {
    const colorStr = stopMatch[1];
    const positionStr = stopMatch[2];
    
    let color;
    if (colorStr.startsWith('#')) {
      color = normalizeHexColor(colorStr);
    } else {
      const parsed = parseRgba(colorStr);
      if (parsed) {
        color = rgbToHex(parsed.r, parsed.g, parsed.b);
      }
    }
    
    if (color) {
      const position = positionStr ? parseInt(positionStr, 10) : null;
      stops.push({ color, position });
    }
  }
  
  // Assign positions to stops without explicit positions
  if (stops.length > 0) {
    if (stops[0].position === null) stops[0].position = 0;
    if (stops[stops.length - 1].position === null) stops[stops.length - 1].position = 100;
    
    // Interpolate missing positions
    for (let i = 1; i < stops.length - 1; i++) {
      if (stops[i].position === null) {
        // Find next stop with a position
        let nextIdx = i + 1;
        while (nextIdx < stops.length && stops[nextIdx].position === null) nextIdx++;
        
        const prevPos = stops[i - 1].position;
        const nextPos = stops[nextIdx].position;
        const gap = nextIdx - (i - 1);
        stops[i].position = prevPos + ((nextPos - prevPos) * (1 / gap));
      }
    }
  }
  
  return { type: 'linear', angle, stops };
}

/**
 * Get the "start" color of a gradient (top-left for 135deg, top for 180deg, etc.)
 * @param {string} cssBackground - CSS gradient or color
 * @returns {string | null} - Hex color
 */
export function getStartColor(cssBackground) {
  if (!cssBackground) return null;
  
  if (isSolidColor(cssBackground)) {
    return normalizeHexColor(cssBackground);
  }
  
  const colors = extractColors(cssBackground);
  return colors.length > 0 ? colors[0] : null;
}

/**
 * Get the "end" color of a gradient (bottom-right for 135deg, bottom for 180deg, etc.)
 * @param {string} cssBackground - CSS gradient or color
 * @returns {string | null} - Hex color
 */
export function getEndColor(cssBackground) {
  if (!cssBackground) return null;
  
  if (isSolidColor(cssBackground)) {
    return normalizeHexColor(cssBackground);
  }
  
  const colors = extractColors(cssBackground);
  return colors.length > 0 ? colors[colors.length - 1] : null;
}

/**
 * Get the dominant/primary color from a gradient
 * For simple gradients, this is usually the first color
 * For complex layered gradients, find the most visually dominant color
 * @param {string} cssBackground - CSS gradient or color
 * @returns {string | null} - Hex color
 */
export function getDominantColor(cssBackground) {
  if (!cssBackground) return null;
  
  if (isSolidColor(cssBackground)) {
    return normalizeHexColor(cssBackground);
  }
  
  // For gradients, try to find the base layer (last gradient in a stack)
  const gradientLayers = splitGradientLayers(cssBackground);
  const baseLayer = gradientLayers[gradientLayers.length - 1];
  
  const colors = extractColors(baseLayer);
  return colors.length > 0 ? colors[0] : null;
}

/**
 * Split a multi-layer gradient into individual layers
 * @param {string} cssBackground - CSS background with potentially multiple gradients
 * @returns {string[]} - Array of individual gradient/color strings
 */
export function splitGradientLayers(cssBackground) {
  if (!cssBackground) return [];
  
  const layers = [];
  let depth = 0;
  let currentLayer = '';
  
  for (let i = 0; i < cssBackground.length; i++) {
    const char = cssBackground[i];
    
    if (char === '(') depth++;
    if (char === ')') depth--;
    
    if (char === ',' && depth === 0) {
      if (currentLayer.trim()) {
        layers.push(currentLayer.trim());
      }
      currentLayer = '';
    } else {
      currentLayer += char;
    }
  }
  
  if (currentLayer.trim()) {
    layers.push(currentLayer.trim());
  }
  
  return layers;
}

/**
 * Generate a linear gradient CSS string
 * @param {number} angle - Gradient angle in degrees
 * @param {Array<{ color: string, position: number }>} stops - Color stops
 * @returns {string}
 */
export function generateLinearGradient(angle, stops) {
  if (!stops || stops.length === 0) return '#000000';
  if (stops.length === 1) return stops[0].color;
  
  const stopStrings = stops.map(stop => 
    `${stop.color} ${stop.position}%`
  ).join(', ');
  
  return `linear-gradient(${angle}deg, ${stopStrings})`;
}

/**
 * Modify the start color of a gradient while preserving structure
 * @param {string} cssBackground - Original CSS background
 * @param {string} newStartColor - New start color (hex)
 * @returns {string} - Modified CSS background
 */
export function modifyStartColor(cssBackground, newStartColor) {
  if (!cssBackground) return cssBackground;
  
  if (isSolidColor(cssBackground)) {
    return newStartColor;
  }
  
  const colors = extractColors(cssBackground);
  if (colors.length === 0) return cssBackground;
  
  // Simple replacement: replace first occurrence of the first color
  const firstColor = colors[0];
  return cssBackground.replace(firstColor, newStartColor);
}

/**
 * Modify the end color of a gradient while preserving structure
 * @param {string} cssBackground - Original CSS background
 * @param {string} newEndColor - New end color (hex)
 * @returns {string} - Modified CSS background
 */
export function modifyEndColor(cssBackground, newEndColor) {
  if (!cssBackground) return cssBackground;
  
  if (isSolidColor(cssBackground)) {
    return newEndColor;
  }
  
  const colors = extractColors(cssBackground);
  if (colors.length === 0) return cssBackground;
  
  // Find and replace the last occurrence of the last color
  const lastColor = colors[colors.length - 1];
  const lastIndex = cssBackground.lastIndexOf(lastColor);
  
  if (lastIndex !== -1) {
    return cssBackground.substring(0, lastIndex) + 
           newEndColor + 
           cssBackground.substring(lastIndex + lastColor.length);
  }
  
  return cssBackground;
}

