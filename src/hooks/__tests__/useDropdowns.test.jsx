/**
 * useDropdowns.test.jsx
 * Unit tests for the dropdown state management hook
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDropdowns } from '../useDropdowns';

describe('useDropdowns', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ========================================
  // Initial State
  // ========================================
  describe('initial state', () => {
    it('all dropdowns start closed', () => {
      const { result } = renderHook(() => useDropdowns());
      
      expect(result.current.showColorPicker).toBe(false);
      expect(result.current.showFontSize).toBe(false);
      expect(result.current.showUnderlinePicker).toBe(false);
      expect(result.current.showFontPicker).toBe(false);
      expect(result.current.showTextAlign).toBe(false);
      expect(result.current.showLineSpacing).toBe(false);
      expect(result.current.showLetterSpacing).toBe(false);
      expect(result.current.showFormatPicker).toBe(false);
      expect(result.current.showLayoutPicker).toBe(false);
      expect(result.current.showNewTabMenu).toBe(false);
      expect(result.current.showSnippetsPicker).toBe(false);
    });

    it('provides refs for all dropdowns', () => {
      const { result } = renderHook(() => useDropdowns());
      
      expect(result.current.colorPickerRef).toBeDefined();
      expect(result.current.fontSizeRef).toBeDefined();
      expect(result.current.underlineRef).toBeDefined();
      expect(result.current.fontPickerRef).toBeDefined();
      expect(result.current.textAlignRef).toBeDefined();
      expect(result.current.lineSpacingRef).toBeDefined();
      expect(result.current.letterSpacingRef).toBeDefined();
      expect(result.current.formatPickerRef).toBeDefined();
      expect(result.current.layoutPickerRef).toBeDefined();
      expect(result.current.newTabMenuRef).toBeDefined();
      expect(result.current.snippetsPickerRef).toBeDefined();
    });
  });

  // ========================================
  // Toggle Dropdowns
  // ========================================
  describe('toggle dropdowns', () => {
    it('opens color picker', () => {
      const { result } = renderHook(() => useDropdowns());
      
      act(() => {
        result.current.setShowColorPicker(true);
      });
      
      expect(result.current.showColorPicker).toBe(true);
    });

    it('opens font size dropdown', () => {
      const { result } = renderHook(() => useDropdowns());
      
      act(() => {
        result.current.setShowFontSize(true);
      });
      
      expect(result.current.showFontSize).toBe(true);
    });

    it('opens underline picker', () => {
      const { result } = renderHook(() => useDropdowns());
      
      act(() => {
        result.current.setShowUnderlinePicker(true);
      });
      
      expect(result.current.showUnderlinePicker).toBe(true);
    });

    it('opens font picker', () => {
      const { result } = renderHook(() => useDropdowns());
      
      act(() => {
        result.current.setShowFontPicker(true);
      });
      
      expect(result.current.showFontPicker).toBe(true);
    });

    it('opens text align dropdown', () => {
      const { result } = renderHook(() => useDropdowns());
      
      act(() => {
        result.current.setShowTextAlign(true);
      });
      
      expect(result.current.showTextAlign).toBe(true);
    });

    it('opens line spacing dropdown', () => {
      const { result } = renderHook(() => useDropdowns());
      
      act(() => {
        result.current.setShowLineSpacing(true);
      });
      
      expect(result.current.showLineSpacing).toBe(true);
    });

    it('opens letter spacing dropdown', () => {
      const { result } = renderHook(() => useDropdowns());
      
      act(() => {
        result.current.setShowLetterSpacing(true);
      });
      
      expect(result.current.showLetterSpacing).toBe(true);
    });

    it('opens format picker', () => {
      const { result } = renderHook(() => useDropdowns());
      
      act(() => {
        result.current.setShowFormatPicker(true);
      });
      
      expect(result.current.showFormatPicker).toBe(true);
    });

    it('opens layout picker', () => {
      const { result } = renderHook(() => useDropdowns());
      
      act(() => {
        result.current.setShowLayoutPicker(true);
      });
      
      expect(result.current.showLayoutPicker).toBe(true);
    });

    it('opens new tab menu', () => {
      const { result } = renderHook(() => useDropdowns());
      
      act(() => {
        result.current.setShowNewTabMenu(true);
      });
      
      expect(result.current.showNewTabMenu).toBe(true);
    });

    it('opens snippets picker', () => {
      const { result } = renderHook(() => useDropdowns());
      
      act(() => {
        result.current.setShowSnippetsPicker(true);
      });
      
      expect(result.current.showSnippetsPicker).toBe(true);
    });
  });

  // ========================================
  // Close All Dropdowns
  // ========================================
  describe('closeAllDropdowns', () => {
    it('closes all open dropdowns', () => {
      const { result } = renderHook(() => useDropdowns());
      
      // Open multiple dropdowns
      act(() => {
        result.current.setShowColorPicker(true);
        result.current.setShowFontSize(true);
        result.current.setShowFormatPicker(true);
        result.current.setShowLayoutPicker(true);
      });
      
      expect(result.current.showColorPicker).toBe(true);
      expect(result.current.showFontSize).toBe(true);
      
      // Close all
      act(() => {
        result.current.closeAllDropdowns();
      });
      
      expect(result.current.showColorPicker).toBe(false);
      expect(result.current.showFontSize).toBe(false);
      expect(result.current.showUnderlinePicker).toBe(false);
      expect(result.current.showFontPicker).toBe(false);
      expect(result.current.showTextAlign).toBe(false);
      expect(result.current.showLineSpacing).toBe(false);
      expect(result.current.showLetterSpacing).toBe(false);
      expect(result.current.showFormatPicker).toBe(false);
      expect(result.current.showLayoutPicker).toBe(false);
      expect(result.current.showNewTabMenu).toBe(false);
      expect(result.current.showSnippetsPicker).toBe(false);
    });

    it('closeAllDropdowns is stable (memoized)', () => {
      const { result, rerender } = renderHook(() => useDropdowns());
      
      const firstCloseAll = result.current.closeAllDropdowns;
      
      rerender();
      
      const secondCloseAll = result.current.closeAllDropdowns;
      
      expect(firstCloseAll).toBe(secondCloseAll);
    });
  });

  // ========================================
  // Multiple Dropdowns
  // ========================================
  describe('multiple dropdowns', () => {
    it('multiple dropdowns can be open simultaneously', () => {
      const { result } = renderHook(() => useDropdowns());
      
      act(() => {
        result.current.setShowColorPicker(true);
        result.current.setShowFontSize(true);
      });
      
      expect(result.current.showColorPicker).toBe(true);
      expect(result.current.showFontSize).toBe(true);
    });

    it('closing one dropdown does not affect others', () => {
      const { result } = renderHook(() => useDropdowns());
      
      act(() => {
        result.current.setShowColorPicker(true);
        result.current.setShowFontSize(true);
      });
      
      act(() => {
        result.current.setShowColorPicker(false);
      });
      
      expect(result.current.showColorPicker).toBe(false);
      expect(result.current.showFontSize).toBe(true);
    });
  });

  // ========================================
  // Ref Stability
  // ========================================
  describe('ref stability', () => {
    it('refs maintain reference across rerenders', () => {
      const { result, rerender } = renderHook(() => useDropdowns());
      
      const firstColorRef = result.current.colorPickerRef;
      const firstFontRef = result.current.fontSizeRef;
      
      rerender();
      
      expect(result.current.colorPickerRef).toBe(firstColorRef);
      expect(result.current.fontSizeRef).toBe(firstFontRef);
    });
  });
});

