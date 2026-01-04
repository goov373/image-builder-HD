/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from '../useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  let handlers;

  beforeEach(() => {
    handlers = {
      onShowShortcuts: vi.fn(),
      onUndo: vi.fn(),
      onRedo: vi.fn(),
      onZoomIn: vi.fn(),
      onZoomOut: vi.fn(),
      onZoomReset: vi.fn(),
      onOpenExport: vi.fn(),
      onDeselect: vi.fn(),
      onDeleteFrame: vi.fn(),
      onBold: vi.fn(),
      onItalic: vi.fn(),
      onUnderline: vi.fn(),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const dispatchKeyEvent = (key, options = {}) => {
    // Create a div to use as the target (simulating a non-input element)
    const target = document.createElement('div');
    document.body.appendChild(target);
    
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true,
      ...options,
    });
    
    // Dispatch from the target element so e.target is properly set
    target.dispatchEvent(event);
    
    // Cleanup
    document.body.removeChild(target);
    return event;
  };

  describe('initialization', () => {
    it('should register event listener when enabled', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      renderHook(() => useKeyboardShortcuts(handlers, true));
      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('should not register event listener when disabled', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      renderHook(() => useKeyboardShortcuts(handlers, false));
      expect(addEventListenerSpy).not.toHaveBeenCalled();
    });

    it('should remove event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
      const { unmount } = renderHook(() => useKeyboardShortcuts(handlers, true));
      unmount();
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });

  describe('shortcuts', () => {
    it('should call onShowShortcuts when ? is pressed', () => {
      renderHook(() => useKeyboardShortcuts(handlers));
      dispatchKeyEvent('?');
      expect(handlers.onShowShortcuts).toHaveBeenCalled();
    });

    it('should call onDeselect when Escape is pressed', () => {
      renderHook(() => useKeyboardShortcuts(handlers));
      dispatchKeyEvent('Escape');
      expect(handlers.onDeselect).toHaveBeenCalled();
    });

    it('should call onUndo when Cmd/Ctrl+Z is pressed', () => {
      renderHook(() => useKeyboardShortcuts(handlers));
      // JSDOM uses non-Mac platform, so we need ctrlKey instead of metaKey
      dispatchKeyEvent('z', { ctrlKey: true });
      expect(handlers.onUndo).toHaveBeenCalled();
    });

    it('should call onRedo when Cmd/Ctrl+Shift+Z is pressed', () => {
      renderHook(() => useKeyboardShortcuts(handlers));
      dispatchKeyEvent('z', { ctrlKey: true, shiftKey: true });
      expect(handlers.onRedo).toHaveBeenCalled();
    });

    it('should call onOpenExport when Cmd/Ctrl+E is pressed', () => {
      renderHook(() => useKeyboardShortcuts(handlers));
      dispatchKeyEvent('e', { ctrlKey: true });
      expect(handlers.onOpenExport).toHaveBeenCalled();
    });

    it('should call onZoomIn when Cmd/Ctrl++ is pressed', () => {
      renderHook(() => useKeyboardShortcuts(handlers));
      dispatchKeyEvent('=', { ctrlKey: true });
      expect(handlers.onZoomIn).toHaveBeenCalled();
    });

    it('should call onZoomOut when Cmd/Ctrl+- is pressed', () => {
      renderHook(() => useKeyboardShortcuts(handlers));
      dispatchKeyEvent('-', { ctrlKey: true });
      expect(handlers.onZoomOut).toHaveBeenCalled();
    });

    it('should call onZoomReset when Cmd/Ctrl+0 is pressed', () => {
      renderHook(() => useKeyboardShortcuts(handlers));
      dispatchKeyEvent('0', { ctrlKey: true });
      expect(handlers.onZoomReset).toHaveBeenCalled();
    });

    it('should call onDeleteFrame when Delete is pressed', () => {
      renderHook(() => useKeyboardShortcuts(handlers));
      dispatchKeyEvent('Delete');
      expect(handlers.onDeleteFrame).toHaveBeenCalled();
    });

    it('should call onDeleteFrame when Backspace is pressed', () => {
      renderHook(() => useKeyboardShortcuts(handlers));
      dispatchKeyEvent('Backspace');
      expect(handlers.onDeleteFrame).toHaveBeenCalled();
    });

    it('should call onBold when Cmd/Ctrl+B is pressed', () => {
      renderHook(() => useKeyboardShortcuts(handlers));
      dispatchKeyEvent('b', { ctrlKey: true });
      expect(handlers.onBold).toHaveBeenCalled();
    });

    it('should call onItalic when Cmd/Ctrl+I is pressed', () => {
      renderHook(() => useKeyboardShortcuts(handlers));
      dispatchKeyEvent('i', { ctrlKey: true });
      expect(handlers.onItalic).toHaveBeenCalled();
    });

    it('should call onUnderline when Cmd/Ctrl+U is pressed', () => {
      renderHook(() => useKeyboardShortcuts(handlers));
      dispatchKeyEvent('u', { ctrlKey: true });
      expect(handlers.onUnderline).toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('should not call handlers when disabled', () => {
      renderHook(() => useKeyboardShortcuts(handlers, false));
      dispatchKeyEvent('?');
      dispatchKeyEvent('Escape');
      dispatchKeyEvent('z', { ctrlKey: true });
      
      expect(handlers.onShowShortcuts).not.toHaveBeenCalled();
      expect(handlers.onDeselect).not.toHaveBeenCalled();
      expect(handlers.onUndo).not.toHaveBeenCalled();
    });
  });

  describe('empty handlers', () => {
    it('should not throw when handlers are not provided', () => {
      renderHook(() => useKeyboardShortcuts({}));
      expect(() => {
        dispatchKeyEvent('?');
        dispatchKeyEvent('Escape');
        dispatchKeyEvent('z', { metaKey: true });
      }).not.toThrow();
    });

    it('should not throw with default empty handlers', () => {
      renderHook(() => useKeyboardShortcuts());
      expect(() => {
        dispatchKeyEvent('?');
      }).not.toThrow();
    });
  });

  describe('handler updates', () => {
    it('should use updated handlers', () => {
      const newHandlers = {
        ...handlers,
        onShowShortcuts: vi.fn(),
      };
      
      const { rerender } = renderHook(
        ({ h }) => useKeyboardShortcuts(h),
        { initialProps: { h: handlers } }
      );
      
      dispatchKeyEvent('?');
      expect(handlers.onShowShortcuts).toHaveBeenCalledTimes(1);
      
      rerender({ h: newHandlers });
      
      dispatchKeyEvent('?');
      expect(newHandlers.onShowShortcuts).toHaveBeenCalledTimes(1);
    });
  });
});

