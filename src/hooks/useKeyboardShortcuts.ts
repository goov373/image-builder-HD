import { useEffect, useCallback } from 'react';

/**
 * Keyboard Shortcut Handlers Interface
 */
export interface KeyboardShortcutHandlers {
  /** Show shortcuts modal */
  onShowShortcuts?: () => void;
  /** Undo last action */
  onUndo?: () => void;
  /** Redo last action */
  onRedo?: () => void;
  /** Increase zoom */
  onZoomIn?: () => void;
  /** Decrease zoom */
  onZoomOut?: () => void;
  /** Reset zoom to 100% */
  onZoomReset?: () => void;
  /** Open export panel */
  onOpenExport?: () => void;
  /** Deselect current selection */
  onDeselect?: () => void;
  /** Delete selected frame */
  onDeleteFrame?: () => void;
  /** Toggle bold */
  onBold?: () => void;
  /** Toggle italic */
  onItalic?: () => void;
  /** Toggle underline */
  onUnderline?: () => void;
}

/**
 * useKeyboardShortcuts Hook
 *
 * Registers global keyboard shortcuts for the application.
 * Handles common editor actions like undo/redo, zoom, formatting.
 *
 * Supported shortcuts:
 * - `Cmd/Ctrl + Z` - Undo
 * - `Cmd/Ctrl + Shift + Z` - Redo
 * - `Cmd/Ctrl + +/-` - Zoom in/out
 * - `Cmd/Ctrl + 0` - Reset zoom
 * - `Cmd/Ctrl + E` - Open export
 * - `Cmd/Ctrl + B/I/U` - Bold/Italic/Underline
 * - `Escape` - Deselect
 * - `Backspace/Delete` - Delete selected
 * - `?` - Show shortcuts help
 *
 * @param handlers - Object containing handler functions for each shortcut
 * @param enabled - Whether shortcuts are active (default: true)
 *
 * @example
 * ```tsx
 * import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
 *
 * function Editor() {
 *   const { handleUndo, handleRedo } = useHistory();
 *   const [showExport, setShowExport] = useState(false);
 *
 *   useKeyboardShortcuts({
 *     onUndo: handleUndo,
 *     onRedo: handleRedo,
 *     onOpenExport: () => setShowExport(true),
 *     onDeselect: () => setSelected(null),
 *   });
 *
 *   return <EditorCanvas />;
 * }
 * ```
 */
export function useKeyboardShortcuts(
  handlers: KeyboardShortcutHandlers = {},
  enabled: boolean = true
): void {
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

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      // Don't trigger shortcuts when typing in inputs (except specific ones)
      const target = e.target as HTMLElement;
      const isInputFocused =
        ['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable;

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
    },
    [
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
    ]
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}

export default useKeyboardShortcuts;

