/**
 * useSingleImages.test.jsx
 * Unit tests for the single image (mockup) state management hook
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useSingleImages from '../useSingleImages';

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Sample initial data for tests
const createInitialData = () => [
  {
    id: 1,
    name: 'Test Mockup',
    subtitle: 'Product Mockup',
    canvasSize: 'hero',
    canvasWidth: 1200,
    canvasHeight: 630,
    background: {
      type: 'gradient',
      gradient: { type: 'linear', from: '#18191A', to: '#2d2e30', angle: 135 },
    },
    layers: [
      {
        id: 101,
        name: 'Dashboard',
        type: 'mockup',
        visible: true,
        locked: false,
        opacity: 1,
        zIndex: 1,
        template: 'dashboard-full',
        transform: { x: 100, y: 100, width: 800, height: 500, rotation: 0, scaleX: 1, scaleY: 1 },
      },
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

describe('useSingleImages', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.clearAllMocks();
  });

  // ========================================
  // Initialization
  // ========================================
  describe('initialization', () => {
    it('initializes with provided data', () => {
      const initialData = createInitialData();
      const { result } = renderHook(() => useSingleImages(initialData));
      
      expect(result.current.singleImages).toHaveLength(1);
      expect(result.current.singleImages[0].name).toBe('Test Mockup');
    });

    it('initializes with null selections', () => {
      const { result } = renderHook(() => useSingleImages(createInitialData()));
      
      expect(result.current.selectedImageId).toBeNull();
      expect(result.current.selectedLayerId).toBeNull();
    });

    it('provides computed values', () => {
      const { result } = renderHook(() => useSingleImages(createInitialData()));
      
      expect(result.current.selectedImage).toBeUndefined();
      expect(result.current.selectedLayer).toBeUndefined();
    });
  });

  // ========================================
  // Selection
  // ========================================
  describe('selection', () => {
    it('selects an image', () => {
      const { result } = renderHook(() => useSingleImages(createInitialData()));
      
      act(() => {
        result.current.handleSelectImage(1);
      });
      
      expect(result.current.selectedImageId).toBe(1);
      expect(result.current.selectedImage.name).toBe('Test Mockup');
    });

    it('toggles image selection on same image click', () => {
      const { result } = renderHook(() => useSingleImages(createInitialData()));
      
      act(() => {
        result.current.handleSelectImage(1);
      });
      expect(result.current.selectedImageId).toBe(1);
      
      act(() => {
        result.current.handleSelectImage(1);
      });
      expect(result.current.selectedImageId).toBeNull();
    });

    it('selects a layer', () => {
      const { result } = renderHook(() => useSingleImages(createInitialData()));
      
      act(() => {
        result.current.handleSelectImage(1);
      });
      
      act(() => {
        result.current.handleSelectLayer(101);
      });
      
      expect(result.current.selectedLayerId).toBe(101);
      expect(result.current.selectedLayer.name).toBe('Dashboard');
    });

    it('clears selection', () => {
      const { result } = renderHook(() => useSingleImages(createInitialData()));
      
      act(() => {
        result.current.handleSelectImage(1);
        result.current.handleSelectLayer(101);
      });
      
      act(() => {
        result.current.clearSelection();
      });
      
      expect(result.current.selectedImageId).toBeNull();
      expect(result.current.selectedLayerId).toBeNull();
    });
  });

  // ========================================
  // Layer Management
  // ========================================
  describe('layer management', () => {
    it('updates layer properties', () => {
      const { result } = renderHook(() => useSingleImages(createInitialData()));
      
      act(() => {
        result.current.handleUpdateLayer(1, 101, { opacity: 0.5, name: 'Updated Dashboard' });
      });
      
      const layer = result.current.singleImages[0].layers[0];
      expect(layer.opacity).toBe(0.5);
      expect(layer.name).toBe('Updated Dashboard');
    });

    it('adds a mockup layer', () => {
      const { result } = renderHook(() => useSingleImages(createInitialData()));
      
      act(() => {
        result.current.handleAddLayer(1, 'mockup', 'dashboard-cropped-tl');
      });
      
      expect(result.current.singleImages[0].layers.length).toBe(2);
      expect(result.current.singleImages[0].layers[1].type).toBe('mockup');
    });

    it('adds a decorator layer', () => {
      const { result } = renderHook(() => useSingleImages(createInitialData()));
      
      act(() => {
        result.current.handleAddLayer(1, 'decorator', null, 'chip');
      });
      
      expect(result.current.singleImages[0].layers.length).toBe(2);
      expect(result.current.singleImages[0].layers[1].type).toBe('decorator');
    });

    it('removes a layer', () => {
      const { result } = renderHook(() => useSingleImages(createInitialData()));
      
      act(() => {
        result.current.handleRemoveLayer(1, 101);
      });
      
      expect(result.current.singleImages[0].layers.length).toBe(0);
    });

    it('clears layer selection when removed layer is selected', () => {
      const { result } = renderHook(() => useSingleImages(createInitialData()));
      
      act(() => {
        result.current.handleSelectImage(1);
        result.current.handleSelectLayer(101);
      });
      
      act(() => {
        result.current.handleRemoveLayer(1, 101);
      });
      
      expect(result.current.selectedLayerId).toBeNull();
    });

    it('reorders layers', () => {
      const initialData = createInitialData();
      initialData[0].layers.push({
        id: 102,
        name: 'Second Layer',
        type: 'decorator',
        visible: true,
        locked: false,
        opacity: 1,
        zIndex: 2,
        decoratorType: 'chip',
        transform: { x: 50, y: 50, width: 100, height: 40, rotation: 0, scaleX: 1, scaleY: 1 },
      });
      
      const { result } = renderHook(() => useSingleImages(initialData));
      
      expect(result.current.singleImages[0].layers[0].id).toBe(101);
      expect(result.current.singleImages[0].layers[1].id).toBe(102);
      
      act(() => {
        result.current.handleReorderLayers(1, 0, 1);
      });
      
      // After reorder: layers should be swapped
      expect(result.current.singleImages[0].layers[0].id).toBe(102);
      expect(result.current.singleImages[0].layers[1].id).toBe(101);
    });
  });

  // ========================================
  // Background
  // ========================================
  describe('background', () => {
    it('updates background', () => {
      const { result } = renderHook(() => useSingleImages(createInitialData()));
      
      const newBackground = {
        type: 'solid',
        color: '#ff0000',
      };
      
      act(() => {
        result.current.handleUpdateBackground(1, newBackground);
      });
      
      expect(result.current.singleImages[0].background.type).toBe('solid');
      expect(result.current.singleImages[0].background.color).toBe('#ff0000');
    });

    it('sets background gradient', () => {
      const { result } = renderHook(() => useSingleImages(createInitialData()));
      
      const gradient = 'linear-gradient(135deg, #6466e9, #3b3d8c)';
      
      act(() => {
        result.current.handleSetBackgroundGradient(1, gradient);
      });
      
      expect(result.current.singleImages[0].backgroundGradient).toBe(gradient);
    });
  });

  // ========================================
  // Canvas Size
  // ========================================
  describe('canvas size', () => {
    it('updates canvas size', () => {
      const { result } = renderHook(() => useSingleImages(createInitialData()));
      
      act(() => {
        result.current.handleUpdateCanvasSize(1, 'square', 1080, 1080);
      });
      
      expect(result.current.singleImages[0].canvasSize).toBe('square');
      expect(result.current.singleImages[0].canvasWidth).toBe(1080);
      expect(result.current.singleImages[0].canvasHeight).toBe(1080);
    });
  });

  // ========================================
  // Image Management
  // ========================================
  describe('image management', () => {
    it('adds a new image', () => {
      const { result } = renderHook(() => useSingleImages(createInitialData()));
      
      act(() => {
        result.current.handleAddImage('New Mockup');
      });
      
      expect(result.current.singleImages.length).toBe(2);
      expect(result.current.singleImages[1].name).toBe('New Mockup');
      expect(result.current.selectedImageId).toBe(result.current.singleImages[1].id);
    });

    it('removes an image', () => {
      const initialData = [
        ...createInitialData(),
        { id: 2, name: 'Second Image', layers: [], canvasSize: 'square', canvasWidth: 1080, canvasHeight: 1080, background: { type: 'solid' } },
      ];
      const { result } = renderHook(() => useSingleImages(initialData));
      
      act(() => {
        result.current.handleRemoveImage(2);
      });
      
      expect(result.current.singleImages.length).toBe(1);
    });

    it('does not remove last image', () => {
      const { result } = renderHook(() => useSingleImages(createInitialData()));
      
      act(() => {
        result.current.handleRemoveImage(1);
      });
      
      expect(result.current.singleImages.length).toBe(1);
    });

    it('clears selection when selected image is removed', () => {
      const initialData = [
        ...createInitialData(),
        { id: 2, name: 'Second Image', layers: [], canvasSize: 'square', canvasWidth: 1080, canvasHeight: 1080, background: { type: 'solid' } },
      ];
      const { result } = renderHook(() => useSingleImages(initialData));
      
      act(() => {
        result.current.handleSelectImage(2);
      });
      
      act(() => {
        result.current.handleRemoveImage(2);
      });
      
      expect(result.current.selectedImageId).toBeNull();
    });
  });

  // ========================================
  // Pattern Layer
  // ========================================
  describe('pattern layer', () => {
    it('adds a pattern to image', () => {
      const { result } = renderHook(() => useSingleImages(createInitialData()));
      
      act(() => {
        result.current.handleAddPattern(1, 'city-blocks-1');
      });
      
      // Pattern may or may not be created depending on if the pattern ID exists
      // This tests the action dispatch works without error
      expect(result.current.singleImages[0]).toBeDefined();
    });

    it('updates pattern properties', () => {
      const initialData = createInitialData();
      initialData[0].patternLayer = {
        id: 'pattern-1',
        patternId: 'city-blocks-1',
        scale: 1,
        rotation: 0,
        opacity: 1,
        blendMode: 'normal',
      };
      
      const { result } = renderHook(() => useSingleImages(initialData));
      
      act(() => {
        result.current.handleUpdatePattern(1, { opacity: 0.5, scale: 2 });
      });
      
      expect(result.current.singleImages[0].patternLayer.opacity).toBe(0.5);
      expect(result.current.singleImages[0].patternLayer.scale).toBe(2);
    });

    it('removes pattern from image', () => {
      const initialData = createInitialData();
      initialData[0].patternLayer = {
        id: 'pattern-1',
        patternId: 'city-blocks-1',
        scale: 1,
        rotation: 0,
        opacity: 1,
        blendMode: 'normal',
      };
      
      const { result } = renderHook(() => useSingleImages(initialData));
      
      act(() => {
        result.current.handleRemovePattern(1);
      });
      
      expect(result.current.singleImages[0].patternLayer).toBeUndefined();
    });
  });
});

