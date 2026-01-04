/**
 * browserExport.test.js
 * Unit tests for the browser export utility
 *
 * Note: Full integration tests with actual DOM rendering require jsdom with
 * canvas support. These tests focus on the helper functions and configuration.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getExtension,
  getMimeType,
  EXPORT_DEFAULTS,
  RESOLUTION_SCALES,
} from '../browserExport';

// Mock html-to-image since jsdom doesn't support all canvas operations
vi.mock('html-to-image', () => ({
  toPng: vi.fn().mockResolvedValue('data:image/png;base64,mock'),
  toJpeg: vi.fn().mockResolvedValue('data:image/jpeg;base64,mock'),
  toBlob: vi.fn().mockResolvedValue(new Blob(['mock'], { type: 'image/png' })),
  toCanvas: vi.fn().mockResolvedValue(document.createElement('canvas')),
}));

describe('browserExport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ========================================
  // Configuration Constants
  // ========================================
  describe('configuration', () => {
    describe('EXPORT_DEFAULTS', () => {
      it('has default pixel ratio of 2', () => {
        expect(EXPORT_DEFAULTS.pixelRatio).toBe(2);
      });

      it('has high quality setting for JPEG', () => {
        expect(EXPORT_DEFAULTS.quality).toBe(0.95);
      });

      it('has cache busting enabled', () => {
        expect(EXPORT_DEFAULTS.cacheBust).toBe(true);
      });

      it('includes query params for style resolution', () => {
        expect(EXPORT_DEFAULTS.includeQueryParams).toBe(true);
      });
    });

    describe('RESOLUTION_SCALES', () => {
      it('has 1x resolution', () => {
        expect(RESOLUTION_SCALES['1x']).toBe(1);
      });

      it('has 2x resolution', () => {
        expect(RESOLUTION_SCALES['2x']).toBe(2);
      });

      it('has 3x resolution', () => {
        expect(RESOLUTION_SCALES['3x']).toBe(3);
      });
    });
  });

  // ========================================
  // getExtension
  // ========================================
  describe('getExtension', () => {
    it('returns png for png format', () => {
      expect(getExtension('png')).toBe('png');
      expect(getExtension('PNG')).toBe('png');
    });

    it('returns jpg for jpeg/jpg format', () => {
      expect(getExtension('jpg')).toBe('jpg');
      expect(getExtension('jpeg')).toBe('jpg');
      expect(getExtension('JPEG')).toBe('jpg');
      expect(getExtension('JPG')).toBe('jpg');
    });

    it('returns webp for webp format', () => {
      expect(getExtension('webp')).toBe('webp');
      expect(getExtension('WEBP')).toBe('webp');
    });

    it('defaults to png for unknown formats', () => {
      expect(getExtension('gif')).toBe('png');
      expect(getExtension('bmp')).toBe('png');
      expect(getExtension('')).toBe('png');
    });
  });

  // ========================================
  // getMimeType
  // ========================================
  describe('getMimeType', () => {
    it('returns image/png for png format', () => {
      expect(getMimeType('png')).toBe('image/png');
      expect(getMimeType('PNG')).toBe('image/png');
    });

    it('returns image/jpeg for jpeg/jpg format', () => {
      expect(getMimeType('jpg')).toBe('image/jpeg');
      expect(getMimeType('jpeg')).toBe('image/jpeg');
      expect(getMimeType('JPEG')).toBe('image/jpeg');
    });

    it('returns image/webp for webp format', () => {
      expect(getMimeType('webp')).toBe('image/webp');
      expect(getMimeType('WEBP')).toBe('image/webp');
    });

    it('defaults to image/png for unknown formats', () => {
      expect(getMimeType('gif')).toBe('image/png');
      expect(getMimeType('unknown')).toBe('image/png');
    });
  });

  // ========================================
  // Export Functions (mocked)
  // ========================================
  describe('export functions', () => {
    // Import after mocks are set up
    let exportToPng, exportToJpeg, exportToBlob, exportToCanvas, exportElement;
    let toPng, toJpeg, toBlob, toCanvas;

    beforeEach(async () => {
      // Re-import to get fresh mocks
      const browserExport = await import('../browserExport');
      exportToPng = browserExport.exportToPng;
      exportToJpeg = browserExport.exportToJpeg;
      exportToBlob = browserExport.exportToBlob;
      exportToCanvas = browserExport.exportToCanvas;
      exportElement = browserExport.exportElement;

      const htmlToImage = await import('html-to-image');
      toPng = htmlToImage.toPng;
      toJpeg = htmlToImage.toJpeg;
      toBlob = htmlToImage.toBlob;
      toCanvas = htmlToImage.toCanvas;
    });

    it('exportToPng calls html-to-image toPng', async () => {
      const element = document.createElement('div');
      await exportToPng(element);

      expect(toPng).toHaveBeenCalled();
      expect(toPng).toHaveBeenCalledWith(element, expect.objectContaining({
        pixelRatio: 2,
      }));
    });

    it('exportToJpeg calls html-to-image toJpeg with background', async () => {
      const element = document.createElement('div');
      await exportToJpeg(element);

      expect(toJpeg).toHaveBeenCalled();
      expect(toJpeg).toHaveBeenCalledWith(element, expect.objectContaining({
        backgroundColor: '#ffffff',
      }));
    });

    it('exportToJpeg uses custom background color', async () => {
      const element = document.createElement('div');
      await exportToJpeg(element, { backgroundColor: '#000000' });

      expect(toJpeg).toHaveBeenCalledWith(element, expect.objectContaining({
        backgroundColor: '#000000',
      }));
    });

    it('exportToBlob returns a Blob', async () => {
      const element = document.createElement('div');
      const result = await exportToBlob(element);

      expect(result).toBeInstanceOf(Blob);
      expect(toBlob).toHaveBeenCalled();
    });

    it('exportToCanvas returns a canvas element', async () => {
      const element = document.createElement('div');
      const result = await exportToCanvas(element);

      expect(result.tagName).toBe('CANVAS');
      expect(toCanvas).toHaveBeenCalled();
    });

    it('exportElement routes png format correctly', async () => {
      const element = document.createElement('div');
      await exportElement(element, 'png');

      expect(toPng).toHaveBeenCalled();
    });

    it('exportElement routes jpg format correctly', async () => {
      const element = document.createElement('div');
      await exportElement(element, 'jpg');

      expect(toJpeg).toHaveBeenCalled();
    });

    it('exportElement routes jpeg format correctly', async () => {
      const element = document.createElement('div');
      await exportElement(element, 'jpeg');

      expect(toJpeg).toHaveBeenCalled();
    });

    it('exportElement defaults to png for unknown format', async () => {
      const element = document.createElement('div');
      await exportElement(element, 'gif');

      expect(toPng).toHaveBeenCalled();
    });

    it('accepts custom pixelRatio option', async () => {
      const element = document.createElement('div');
      await exportToPng(element, { pixelRatio: 3 });

      expect(toPng).toHaveBeenCalledWith(element, expect.objectContaining({
        pixelRatio: 3,
      }));
    });
  });

  // ========================================
  // Format Mapping Consistency
  // ========================================
  describe('format mapping consistency', () => {
    const formats = ['png', 'jpg', 'jpeg', 'webp'];

    formats.forEach((format) => {
      it(`getExtension and getMimeType are consistent for ${format}`, () => {
        const ext = getExtension(format);
        const mime = getMimeType(format);

        // Extension should be in the mime type
        expect(mime).toContain(ext === 'jpg' ? 'jpeg' : ext);
      });
    });
  });
});

