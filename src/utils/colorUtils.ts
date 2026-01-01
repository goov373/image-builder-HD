/**
 * Color Utilities
 * Functions for color conversion, interpolation, and extraction
 */

// ===== Type Definitions =====

/** RGB color components (0-255) */
export interface RGB {
  r: number;
  g: number;
  b: number;
}

/** RGBA color components (r, g, b: 0-255, a: 0-1) */
export interface RGBA extends RGB {
  a: number;
}

/** HSL color components (h: 0-360, s: 0-100, l: 0-100) */
export interface HSL {
  h: number;
  s: number;
  l: number;
}

// ===== Conversion Functions =====

/**
 * Convert hex color to RGB object
 * @param hex - Hex color string (with or without #)
 * @returns RGB object or null if invalid
 */
export function hexToRgb(hex: string | null | undefined): RGB | null {
  if (!hex) return null;

  // Remove # if present
  const cleanHex = hex.replace(/^#/, '');

  // Handle 3-digit hex
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split('')
          .map((c) => c + c)
          .join('')
      : cleanHex;

  if (fullHex.length !== 6) return null;

  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to hex color string
 * @param r - Red (0-255)
 * @param g - Green (0-255)
 * @param b - Blue (0-255)
 * @returns Hex color with #
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number): string => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, '0');
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert RGB to HSL
 * @param r - Red (0-255)
 * @param g - Green (0-255)
 * @param b - Blue (0-255)
 * @returns HSL values (h: 0-360, s: 0-100, l: 0-100)
 */
export function rgbToHsl(r: number, g: number, b: number): HSL {
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
    l: Math.round(l * 100),
  };
}

/**
 * Convert HSL to RGB
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns RGB object
 */
export function hslToRgb(h: number, s: number, l: number): RGB {
  const hNorm = h / 360;
  const sNorm = s / 100;
  const lNorm = l / 100;

  let r: number, g: number, b: number;

  if (sNorm === 0) {
    r = g = b = lNorm;
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      let tNorm = t;
      if (tNorm < 0) tNorm += 1;
      if (tNorm > 1) tNorm -= 1;
      if (tNorm < 1 / 6) return p + (q - p) * 6 * tNorm;
      if (tNorm < 1 / 2) return q;
      if (tNorm < 2 / 3) return p + (q - p) * (2 / 3 - tNorm) * 6;
      return p;
    };

    const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
    const p = 2 * lNorm - q;
    r = hue2rgb(p, q, hNorm + 1 / 3);
    g = hue2rgb(p, q, hNorm);
    b = hue2rgb(p, q, hNorm - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Interpolate between two colors
 * Uses HSL for smoother transitions
 * @param color1 - First hex color
 * @param color2 - Second hex color
 * @param ratio - Blend ratio (0 = color1, 1 = color2)
 * @returns Interpolated hex color
 */
export function interpolateColor(
  color1: string | null | undefined,
  color2: string | null | undefined,
  ratio: number
): string {
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
 * Parse rgba/rgb string to RGBA object
 * @param rgbaString - e.g., "rgba(100, 102, 233, 0.5)" or "rgb(100, 102, 233)"
 * @returns RGBA object or null if invalid
 */
export function parseRgba(rgbaString: string): RGBA | null {
  const match = rgbaString.match(
    /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/i
  );
  if (!match) return null;

  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
    a: match[4] !== undefined ? parseFloat(match[4]) : 1,
  };
}

// ===== Brightness & Lightness Functions =====

/**
 * Get the perceived brightness of a color (0-255)
 * @param color - Hex color
 * @returns Brightness value (0-255)
 */
export function getColorBrightness(color: string | null | undefined): number {
  const rgb = hexToRgb(color);
  if (!rgb) return 128;

  // Using perceived brightness formula
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
}

/**
 * Check if a color is considered "light"
 * @param color - Hex color
 * @returns true if brightness > 128
 */
export function isLightColor(color: string | null | undefined): boolean {
  return getColorBrightness(color) > 128;
}

/**
 * Darken a color by a percentage
 * @param color - Hex color
 * @param amount - Amount to darken (0-100)
 * @returns Darkened hex color
 */
export function darkenColor(color: string | null | undefined, amount: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color || '#000000';

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const newL = Math.max(0, hsl.l - amount);
  const newRgb = hslToRgb(hsl.h, hsl.s, newL);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Lighten a color by a percentage
 * @param color - Hex color
 * @param amount - Amount to lighten (0-100)
 * @returns Lightened hex color
 */
export function lightenColor(color: string | null | undefined, amount: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color || '#ffffff';

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const newL = Math.min(100, hsl.l + amount);
  const newRgb = hslToRgb(hsl.h, hsl.s, newL);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

