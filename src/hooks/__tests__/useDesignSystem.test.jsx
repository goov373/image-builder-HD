/**
 * useDesignSystem.test.jsx
 * Unit tests for the design system state management hook
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useDesignSystem from '../useDesignSystem';

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    keys: () => Object.keys(store),
  };
})();

// Override Object.keys for localStorage mock
const originalKeys = Object.keys;
Object.keys = function(obj) {
  if (obj === localStorage) {
    return mockLocalStorage.keys();
  }
  return originalKeys(obj);
};

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Sample initial design system data
const createInitialDesignSystem = () => ({
  // Brand colors
  primary: '#6466e9',
  secondary: '#3b3d8c',
  accent: '#eef1f9',
  neutral1: '#ffffff',
  neutral2: '#f5f5f5',
  neutral3: '#e0e0e0',
  neutral4: '#18191A',
  primary2: '#8b8dff',
  accent2: '#c7d0e8',
  // Typography
  headingFont: 'Inter',
  bodyFont: 'Inter',
  headingWeight: '700',
  bodyWeight: '400',
});

describe('useDesignSystem', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.clearAllMocks();
  });

  // ========================================
  // Initialization
  // ========================================
  describe('initialization', () => {
    it('initializes with provided data', () => {
      const initialData = createInitialDesignSystem();
      const { result } = renderHook(() => useDesignSystem(initialData));
      
      const [designSystem] = result.current;
      
      expect(designSystem.primary).toBe('#6466e9');
      expect(designSystem.secondary).toBe('#3b3d8c');
      expect(designSystem.headingFont).toBe('Inter');
    });

    it('returns design system and setter as tuple', () => {
      const { result } = renderHook(() => useDesignSystem(createInitialDesignSystem()));
      
      expect(Array.isArray(result.current)).toBe(true);
      expect(result.current).toHaveLength(2);
      expect(typeof result.current[0]).toBe('object');
      expect(typeof result.current[1]).toBe('function');
    });
  });

  // ========================================
  // Color Updates
  // ========================================
  describe('color updates', () => {
    it('updates primary color', () => {
      const { result } = renderHook(() => useDesignSystem(createInitialDesignSystem()));
      
      act(() => {
        const [, setDesignSystem] = result.current;
        setDesignSystem((prev) => ({ ...prev, primary: '#ff0000' }));
      });
      
      const [designSystem] = result.current;
      expect(designSystem.primary).toBe('#ff0000');
    });

    it('updates multiple colors at once', () => {
      const { result } = renderHook(() => useDesignSystem(createInitialDesignSystem()));
      
      act(() => {
        const [, setDesignSystem] = result.current;
        setDesignSystem((prev) => ({
          ...prev,
          primary: '#ff0000',
          secondary: '#00ff00',
          accent: '#0000ff',
        }));
      });
      
      const [designSystem] = result.current;
      expect(designSystem.primary).toBe('#ff0000');
      expect(designSystem.secondary).toBe('#00ff00');
      expect(designSystem.accent).toBe('#0000ff');
    });

    it('preserves other properties when updating one', () => {
      const { result } = renderHook(() => useDesignSystem(createInitialDesignSystem()));
      
      act(() => {
        const [, setDesignSystem] = result.current;
        setDesignSystem((prev) => ({ ...prev, primary: '#ff0000' }));
      });
      
      const [designSystem] = result.current;
      expect(designSystem.primary).toBe('#ff0000');
      expect(designSystem.secondary).toBe('#3b3d8c'); // Preserved
      expect(designSystem.headingFont).toBe('Inter'); // Preserved
    });
  });

  // ========================================
  // Typography Updates
  // ========================================
  describe('typography updates', () => {
    it('updates heading font', () => {
      const { result } = renderHook(() => useDesignSystem(createInitialDesignSystem()));
      
      act(() => {
        const [, setDesignSystem] = result.current;
        setDesignSystem((prev) => ({ ...prev, headingFont: 'Poppins' }));
      });
      
      const [designSystem] = result.current;
      expect(designSystem.headingFont).toBe('Poppins');
    });

    it('updates body font', () => {
      const { result } = renderHook(() => useDesignSystem(createInitialDesignSystem()));
      
      act(() => {
        const [, setDesignSystem] = result.current;
        setDesignSystem((prev) => ({ ...prev, bodyFont: 'Roboto' }));
      });
      
      const [designSystem] = result.current;
      expect(designSystem.bodyFont).toBe('Roboto');
    });

    it('updates font weights', () => {
      const { result } = renderHook(() => useDesignSystem(createInitialDesignSystem()));
      
      act(() => {
        const [, setDesignSystem] = result.current;
        setDesignSystem((prev) => ({
          ...prev,
          headingWeight: '800',
          bodyWeight: '500',
        }));
      });
      
      const [designSystem] = result.current;
      expect(designSystem.headingWeight).toBe('800');
      expect(designSystem.bodyWeight).toBe('500');
    });
  });

  // ========================================
  // Full Replacement
  // ========================================
  describe('full replacement', () => {
    it('replaces entire design system', () => {
      const { result } = renderHook(() => useDesignSystem(createInitialDesignSystem()));
      
      const newDesignSystem = {
        primary: '#000000',
        secondary: '#111111',
        accent: '#222222',
        neutral1: '#333333',
        neutral2: '#444444',
        neutral3: '#555555',
        neutral4: '#666666',
        primary2: '#777777',
        accent2: '#888888',
        headingFont: 'Arial',
        bodyFont: 'Arial',
        headingWeight: '600',
        bodyWeight: '300',
      };
      
      act(() => {
        const [, setDesignSystem] = result.current;
        setDesignSystem(newDesignSystem);
      });
      
      const [designSystem] = result.current;
      expect(designSystem).toEqual(newDesignSystem);
    });
  });

  // ========================================
  // Neutral Colors
  // ========================================
  describe('neutral colors', () => {
    it('updates neutral1 (lightest)', () => {
      const { result } = renderHook(() => useDesignSystem(createInitialDesignSystem()));
      
      act(() => {
        const [, setDesignSystem] = result.current;
        setDesignSystem((prev) => ({ ...prev, neutral1: '#fafafa' }));
      });
      
      const [designSystem] = result.current;
      expect(designSystem.neutral1).toBe('#fafafa');
    });

    it('updates neutral4 (darkest)', () => {
      const { result } = renderHook(() => useDesignSystem(createInitialDesignSystem()));
      
      act(() => {
        const [, setDesignSystem] = result.current;
        setDesignSystem((prev) => ({ ...prev, neutral4: '#000000' }));
      });
      
      const [designSystem] = result.current;
      expect(designSystem.neutral4).toBe('#000000');
    });
  });

  // ========================================
  // Secondary Brand Colors
  // ========================================
  describe('secondary brand colors', () => {
    it('updates primary2 (lighter primary)', () => {
      const { result } = renderHook(() => useDesignSystem(createInitialDesignSystem()));
      
      act(() => {
        const [, setDesignSystem] = result.current;
        setDesignSystem((prev) => ({ ...prev, primary2: '#a0a2ff' }));
      });
      
      const [designSystem] = result.current;
      expect(designSystem.primary2).toBe('#a0a2ff');
    });

    it('updates accent2 (secondary accent)', () => {
      const { result } = renderHook(() => useDesignSystem(createInitialDesignSystem()));
      
      act(() => {
        const [, setDesignSystem] = result.current;
        setDesignSystem((prev) => ({ ...prev, accent2: '#d0d8f0' }));
      });
      
      const [designSystem] = result.current;
      expect(designSystem.accent2).toBe('#d0d8f0');
    });
  });

  // ========================================
  // Hook Stability
  // ========================================
  describe('hook stability', () => {
    it('returns stable setter reference', () => {
      const { result, rerender } = renderHook(() => useDesignSystem(createInitialDesignSystem()));
      
      const [, firstSetter] = result.current;
      
      rerender();
      
      const [, secondSetter] = result.current;
      
      // setState from useState should be stable
      expect(firstSetter).toBe(secondSetter);
    });
  });
});

