/**
 * colorUtils.test.js
 * Unit tests for color conversion and manipulation utilities
 */

import { describe, it, expect } from 'vitest';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  interpolateColor,
  parseRgba,
  getColorBrightness,
  isLightColor,
  darkenColor,
  lightenColor,
} from '../colorUtils';

describe('colorUtils', () => {
  // ========================================
  // hexToRgb
  // ========================================
  describe('hexToRgb', () => {
    it('converts 6-digit hex with # to RGB', () => {
      expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('converts 6-digit hex without # to RGB', () => {
      expect(hexToRgb('ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('6466e9')).toEqual({ r: 100, g: 102, b: 233 });
    });

    it('converts 3-digit hex to RGB', () => {
      expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#0f0')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('abc')).toEqual({ r: 170, g: 187, b: 204 });
    });

    it('handles mixed case hex strings', () => {
      expect(hexToRgb('#FF00FF')).toEqual({ r: 255, g: 0, b: 255 });
      expect(hexToRgb('#AbCdEf')).toEqual({ r: 171, g: 205, b: 239 });
    });

    it('returns null for invalid inputs', () => {
      expect(hexToRgb(null)).toBeNull();
      expect(hexToRgb('')).toBeNull();
      expect(hexToRgb('#gg0000')).toBeNull();
      expect(hexToRgb('#ff00')).toBeNull(); // 4 digits invalid
      expect(hexToRgb('#ff00000')).toBeNull(); // 7 digits invalid
    });
  });

  // ========================================
  // rgbToHex
  // ========================================
  describe('rgbToHex', () => {
    it('converts RGB to hex', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
      expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
      expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
      expect(rgbToHex(0, 0, 0)).toBe('#000000');
    });

    it('pads single digit values correctly', () => {
      expect(rgbToHex(1, 2, 3)).toBe('#010203');
      expect(rgbToHex(15, 15, 15)).toBe('#0f0f0f');
    });

    it('clamps values to 0-255 range', () => {
      expect(rgbToHex(-10, 300, 128)).toBe('#00ff80');
    });

    it('rounds decimal values', () => {
      expect(rgbToHex(127.4, 127.6, 128.5)).toBe('#7f8081');
    });
  });

  // ========================================
  // rgbToHsl
  // ========================================
  describe('rgbToHsl', () => {
    it('converts pure red', () => {
      const hsl = rgbToHsl(255, 0, 0);
      expect(hsl.h).toBe(0);
      expect(hsl.s).toBe(100);
      expect(hsl.l).toBe(50);
    });

    it('converts pure green', () => {
      const hsl = rgbToHsl(0, 255, 0);
      expect(hsl.h).toBe(120);
      expect(hsl.s).toBe(100);
      expect(hsl.l).toBe(50);
    });

    it('converts pure blue', () => {
      const hsl = rgbToHsl(0, 0, 255);
      expect(hsl.h).toBe(240);
      expect(hsl.s).toBe(100);
      expect(hsl.l).toBe(50);
    });

    it('converts grayscale colors (no saturation)', () => {
      expect(rgbToHsl(128, 128, 128)).toEqual({ h: 0, s: 0, l: 50 });
      expect(rgbToHsl(0, 0, 0)).toEqual({ h: 0, s: 0, l: 0 });
      expect(rgbToHsl(255, 255, 255)).toEqual({ h: 0, s: 0, l: 100 });
    });

    it('converts HelloData purple', () => {
      const hsl = rgbToHsl(100, 102, 233);
      expect(hsl.h).toBe(239); // Blue-purple hue
      expect(hsl.s).toBeGreaterThan(70); // High saturation
      expect(hsl.l).toBeGreaterThan(50); // Medium-bright
    });
  });

  // ========================================
  // hslToRgb
  // ========================================
  describe('hslToRgb', () => {
    it('converts pure colors', () => {
      expect(hslToRgb(0, 100, 50)).toEqual({ r: 255, g: 0, b: 0 });
      expect(hslToRgb(120, 100, 50)).toEqual({ r: 0, g: 255, b: 0 });
      expect(hslToRgb(240, 100, 50)).toEqual({ r: 0, g: 0, b: 255 });
    });

    it('converts grayscale (0 saturation)', () => {
      expect(hslToRgb(0, 0, 0)).toEqual({ r: 0, g: 0, b: 0 });
      expect(hslToRgb(0, 0, 50)).toEqual({ r: 128, g: 128, b: 128 });
      expect(hslToRgb(0, 0, 100)).toEqual({ r: 255, g: 255, b: 255 });
    });

    it('roundtrips with rgbToHsl', () => {
      const original = { r: 100, g: 150, b: 200 };
      const hsl = rgbToHsl(original.r, original.g, original.b);
      const back = hslToRgb(hsl.h, hsl.s, hsl.l);
      
      // Allow for small rounding differences (within 2 values due to HSL rounding)
      expect(Math.abs(back.r - original.r)).toBeLessThanOrEqual(2);
      expect(Math.abs(back.g - original.g)).toBeLessThanOrEqual(2);
      expect(Math.abs(back.b - original.b)).toBeLessThanOrEqual(2);
    });
  });

  // ========================================
  // interpolateColor
  // ========================================
  describe('interpolateColor', () => {
    it('returns first color at ratio 0', () => {
      expect(interpolateColor('#ff0000', '#0000ff', 0)).toBe('#ff0000');
    });

    it('returns second color at ratio 1', () => {
      expect(interpolateColor('#ff0000', '#0000ff', 1)).toBe('#0000ff');
    });

    it('returns midpoint at ratio 0.5', () => {
      // Red to green should pass through yellow
      const mid = interpolateColor('#ff0000', '#00ff00', 0.5);
      expect(mid).toBe('#ffff00'); // Yellow
    });

    it('handles same color (no change)', () => {
      // Small rounding variations possible in HSL conversion, check approximate
      const result = interpolateColor('#6466e9', '#6466e9', 0.5);
      const expectedRgb = { r: 100, g: 102, b: 233 };
      const resultRgb = hexToRgb(result);
      
      expect(Math.abs(resultRgb.r - expectedRgb.r)).toBeLessThanOrEqual(2);
      expect(Math.abs(resultRgb.g - expectedRgb.g)).toBeLessThanOrEqual(2);
      expect(Math.abs(resultRgb.b - expectedRgb.b)).toBeLessThanOrEqual(2);
    });

    it('handles invalid colors gracefully', () => {
      expect(interpolateColor(null, '#ff0000', 0.5)).toBe('#ff0000');
      expect(interpolateColor('#ff0000', null, 0.5)).toBe('#ff0000');
    });
  });

  // ========================================
  // parseRgba
  // ========================================
  describe('parseRgba', () => {
    it('parses rgb() strings', () => {
      expect(parseRgba('rgb(100, 102, 233)')).toEqual({ r: 100, g: 102, b: 233, a: 1 });
      expect(parseRgba('rgb(0, 0, 0)')).toEqual({ r: 0, g: 0, b: 0, a: 1 });
      expect(parseRgba('rgb(255, 255, 255)')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    });

    it('parses rgba() strings', () => {
      expect(parseRgba('rgba(100, 102, 233, 0.5)')).toEqual({ r: 100, g: 102, b: 233, a: 0.5 });
      expect(parseRgba('rgba(0, 0, 0, 0)')).toEqual({ r: 0, g: 0, b: 0, a: 0 });
      expect(parseRgba('rgba(255, 255, 255, 1)')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    });

    it('handles various spacing', () => {
      expect(parseRgba('rgba(100,102,233,0.5)')).toEqual({ r: 100, g: 102, b: 233, a: 0.5 });
      expect(parseRgba('rgba( 100 , 102 , 233 , 0.5 )')).toEqual({ r: 100, g: 102, b: 233, a: 0.5 });
    });

    it('returns null for invalid strings', () => {
      expect(parseRgba('not a color')).toBeNull();
      expect(parseRgba('#ff0000')).toBeNull();
      expect(parseRgba('')).toBeNull();
    });
  });

  // ========================================
  // getColorBrightness
  // ========================================
  describe('getColorBrightness', () => {
    it('returns 0 for black', () => {
      expect(getColorBrightness('#000000')).toBe(0);
    });

    it('returns 255 for white', () => {
      expect(getColorBrightness('#ffffff')).toBe(255);
    });

    it('returns ~128 for medium gray', () => {
      const brightness = getColorBrightness('#808080');
      expect(brightness).toBeCloseTo(128, 0);
    });

    it('weights green more than red, red more than blue', () => {
      // Perceived brightness formula: (R*299 + G*587 + B*114) / 1000
      const red = getColorBrightness('#ff0000');
      const green = getColorBrightness('#00ff00');
      const blue = getColorBrightness('#0000ff');
      
      expect(green).toBeGreaterThan(red);
      expect(red).toBeGreaterThan(blue);
    });

    it('handles invalid input', () => {
      expect(getColorBrightness(null)).toBe(128); // Default fallback
      expect(getColorBrightness('invalid')).toBe(128);
    });
  });

  // ========================================
  // isLightColor
  // ========================================
  describe('isLightColor', () => {
    it('returns true for white', () => {
      expect(isLightColor('#ffffff')).toBe(true);
    });

    it('returns false for black', () => {
      expect(isLightColor('#000000')).toBe(false);
    });

    it('returns true for yellow (very bright)', () => {
      expect(isLightColor('#ffff00')).toBe(true);
    });

    it('returns false for dark purple', () => {
      expect(isLightColor('#2d2e30')).toBe(false);
    });

    it('categorizes HelloData purple as dark', () => {
      // #6466e9 - should be on the darker side
      expect(isLightColor('#6466e9')).toBe(false);
    });
  });

  // ========================================
  // darkenColor
  // ========================================
  describe('darkenColor', () => {
    it('darkens a color by the specified amount', () => {
      const original = '#808080'; // Mid-gray (L=50)
      const darkened = darkenColor(original, 20);
      const darkenedRgb = hexToRgb(darkened);
      const originalRgb = hexToRgb(original);
      
      expect(darkenedRgb.r).toBeLessThan(originalRgb.r);
      expect(darkenedRgb.g).toBeLessThan(originalRgb.g);
      expect(darkenedRgb.b).toBeLessThan(originalRgb.b);
    });

    it('does not go below black', () => {
      const result = darkenColor('#000000', 50);
      expect(result).toBe('#000000');
    });

    it('handles invalid input gracefully', () => {
      expect(darkenColor('invalid', 20)).toBe('invalid');
    });
  });

  // ========================================
  // lightenColor
  // ========================================
  describe('lightenColor', () => {
    it('lightens a color by the specified amount', () => {
      const original = '#808080'; // Mid-gray
      const lightened = lightenColor(original, 20);
      const lightenedRgb = hexToRgb(lightened);
      const originalRgb = hexToRgb(original);
      
      expect(lightenedRgb.r).toBeGreaterThan(originalRgb.r);
      expect(lightenedRgb.g).toBeGreaterThan(originalRgb.g);
      expect(lightenedRgb.b).toBeGreaterThan(originalRgb.b);
    });

    it('does not go above white', () => {
      const result = lightenColor('#ffffff', 50);
      expect(result).toBe('#ffffff');
    });

    it('handles invalid input gracefully', () => {
      expect(lightenColor('invalid', 20)).toBe('invalid');
    });
  });
});

