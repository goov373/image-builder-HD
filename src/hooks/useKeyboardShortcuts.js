import { useEffect, useCallback } from 'react';

/**
 * Global Keyboard Shortcuts Hook
 * Handles all keyboard shortcuts across the application
 * 
 * @param {Object} handlers - Object containing handler functions
 * @param {Function} handlers.onShowShortcuts - Show shortcuts modal
 * @param {Function} handlers.onUndo - Undo last action
 * @param {Function} handlers.onRedo - Redo last action
 * @param {Function} handlers.onZoomIn - Increase zoom
 * @param {Function} handlers.onZoomOut - Decrease zoom
 * @param {Function} handlers.onZoomReset - Reset zoom to 100%
 * @param {Function} handlers.onOpenExport - Open export panel
 * @param {Function} handlers.onDeselect - Deselect current selection
 * @param {Function} handlers.onDeleteFrame - Delete selected frame
 * @param {Function} handlers.onBold - Toggle bold
 * @param {Function} handlers.onItalic - Toggle italic
 * @param {Function} handlers.onUnderline - Toggle underline
 * @param {boolean} enabled - Whether shortcuts are enabled
 */
export function useKeyboardShortcuts(handlers = {}, enabled = true) {
  const {
    onShowShortcuts,
    onUndo,
    onRedo,
    onZoomIn,
    onZoomOut,
    onZoomReset,
    onOpenExport,
    onDeselect,
    onDeleteFrame,
    onBold,
    onItalic,
    onUnderline,
  } = handlers;

  const handleKeyDown = useCallback((e) => {
    // Don't trigger shortcuts when typing in inputs (except specific ones)
    const isInputFocused = ['INPUT', 'TEXTAREA'].includes(e.target.tagName) || 
                           e.target.isContentEditable;
    
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const cmdKey = isMac ? e.metaKey : e.ctrlKey;

    // ? - Show shortcuts (always works)
    if (e.key === '?' && !cmdKey && !e.altKey) {
      e.preventDefault();
      onShowShortcuts?.();
      return;
    }

    // Escape - Deselect / Close
    if (e.key === 'Escape') {
      e.preventDefault();
      onDeselect?.();
      return;
    }

    // Skip other shortcuts if in input
    if (isInputFocused && !cmdKey) return;

    // Cmd/Ctrl + Z - Undo
    if (cmdKey && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      onUndo?.();
      return;
    }

    // Cmd/Ctrl + Shift + Z - Redo
    if (cmdKey && e.key === 'z' && e.shiftKey) {
      e.preventDefault();
      onRedo?.();
      return;
    }

    // Cmd/Ctrl + E - Export
    if (cmdKey && e.key === 'e') {
      e.preventDefault();
      onOpenExport?.();
      return;
    }

    // Cmd/Ctrl + Plus - Zoom In
    if (cmdKey && (e.key === '=' || e.key === '+')) {
      e.preventDefault();
      onZoomIn?.();
      return;
    }

    // Cmd/Ctrl + Minus - Zoom Out
    if (cmdKey && e.key === '-') {
      e.preventDefault();
      onZoomOut?.();
      return;
    }

    // Cmd/Ctrl + 0 - Reset Zoom
    if (cmdKey && e.key === '0') {
      e.preventDefault();
      onZoomReset?.();
      return;
    }

    // Delete/Backspace - Delete frame (when not in input)
    if ((e.key === 'Delete' || e.key === 'Backspace') && !isInputFocused) {
      e.preventDefault();
      onDeleteFrame?.();
      return;
    }

    // Text formatting shortcuts (work in content editable)
    if (cmdKey && e.key === 'b') {
      e.preventDefault();
      onBold?.();
      return;
    }

    if (cmdKey && e.key === 'i') {
      e.preventDefault();
      onItalic?.();
      return;
    }

    if (cmdKey && e.key === 'u') {
      e.preventDefault();
      onUnderline?.();
      return;
    }
  }, [
    onShowShortcuts, onUndo, onRedo, onZoomIn, onZoomOut, onZoomReset,
    onOpenExport, onDeselect, onDeleteFrame, onBold, onItalic, onUnderline
  ]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}

export default useKeyboardShortcuts;

