/**
 * Color Utilities
 * Functions for color conversion, interpolation, and extraction
 */

/**
 * Convert hex color to RGB object
 * @param {string} hex - Hex color string (with or without #)
 * @returns {{ r: number, g: number, b: number } | null}
 */
export function hexToRgb(hex) {
  if (!hex) return null;
  
  // Remove # if present
  const cleanHex = hex.replace(/^#/, '');
  
  // Handle 3-digit hex
  const fullHex = cleanHex.length === 3
    ? cleanHex.split('').map(c => c + c).join('')
    : cleanHex;
  
  if (fullHex.length !== 6) return null;
  
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Convert RGB to hex color string
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} - Hex color with #
 */
export function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, '0');
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert RGB to HSL
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {{ h: number, s: number, l: number }} - HSL values (h: 0-360, s: 0-100, l: 0-100)
 */
export function rgbToHsl(r, g, b) {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const l = (max + min) / 2;
  
  let h = 0;
  let s = 0;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6;
        break;
      case gNorm:
        h = ((bNorm - rNorm) / d + 2) / 6;
        break;
      case bNorm:
        h = ((rNorm - gNorm) / d + 4) / 6;
        break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Convert HSL to RGB
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {{ r: number, g: number, b: number }}
 */
export function hslToRgb(h, s, l) {
  const hNorm = h / 360;
  const sNorm = s / 100;
  const lNorm = l / 100;
  
  let r, g, b;
  
  if (sNorm === 0) {
    r = g = b = lNorm;
  } else {
    const hue2rgb = (p, q, t) => {
      let tNorm = t;
      if (tNorm < 0) tNorm += 1;
      if (tNorm > 1) tNorm -= 1;
      if (tNorm < 1/6) return p + (q - p) * 6 * tNorm;
      if (tNorm < 1/2) return q;
      if (tNorm < 2/3) return p + (q - p) * (2/3 - tNorm) * 6;
      return p;
    };
    
    const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
    const p = 2 * lNorm - q;
    r = hue2rgb(p, q, hNorm + 1/3);
    g = hue2rgb(p, q, hNorm);
    b = hue2rgb(p, q, hNorm - 1/3);
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * Interpolate between two colors
 * Uses HSL for smoother transitions
 * @param {string} color1 - First hex color
 * @param {string} color2 - Second hex color
 * @param {number} ratio - Blend ratio (0 = color1, 1 = color2)
 * @returns {string} - Interpolated hex color
 */
export function interpolateColor(color1, color2, ratio) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return color1 || color2 || '#000000';
  
  const hsl1 = rgbToHsl(rgb1.r, rgb1.g, rgb1.b);
  const hsl2 = rgbToHsl(rgb2.r, rgb2.g, rgb2.b);
  
  // Handle hue interpolation (shortest path around the circle)
  let h1 = hsl1.h;
  let h2 = hsl2.h;
  
  if (Math.abs(h2 - h1) > 180) {
    if (h2 > h1) {
      h1 += 360;
    } else {
      h2 += 360;
    }
  }
  
  const h = ((1 - ratio) * h1 + ratio * h2) % 360;
  const s = (1 - ratio) * hsl1.s + ratio * hsl2.s;
  const l = (1 - ratio) * hsl1.l + ratio * hsl2.l;
  
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

/**
 * Parse rgba/rgb string to RGB object
 * @param {string} rgbaString - e.g., "rgba(100, 102, 233, 0.5)" or "rgb(100, 102, 233)"
 * @returns {{ r: number, g: number, b: number, a?: number } | null}
 */
export function parseRgba(rgbaString) {
  const match = rgbaString.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/i);
  if (!match) return null;
  
  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
    a: match[4] !== undefined ? parseFloat(match[4]) : 1
  };
}

/**
 * Get the perceived brightness of a color (0-255)
 * @param {string} color - Hex color
 * @returns {number}
 */
export function getColorBrightness(color) {
  const rgb = hexToRgb(color);
  if (!rgb) return 128;
  
  // Using perceived brightness formula
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
}

/**
 * Check if a color is considered "light"
 * @param {string} color - Hex color
 * @returns {boolean}
 */
export function isLightColor(color) {
  return getColorBrightness(color) > 128;
}

/**
 * Darken a color by a percentage
 * @param {string} color - Hex color
 * @param {number} amount - Amount to darken (0-100)
 * @returns {string}
 */
export function darkenColor(color, amount) {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const newL = Math.max(0, hsl.l - amount);
  const newRgb = hslToRgb(hsl.h, hsl.s, newL);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Lighten a color by a percentage
 * @param {string} color - Hex color
 * @param {number} amount - Amount to lighten (0-100)
 * @returns {string}
 */
export function lightenColor(color, amount) {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const newL = Math.min(100, hsl.l + amount);
  const newRgb = hslToRgb(hsl.h, hsl.s, newL);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

