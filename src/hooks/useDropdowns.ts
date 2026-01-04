import { useState, useRef, useEffect, useCallback, RefObject, Dispatch, SetStateAction } from 'react';

/**
 * useDropdowns Hook
 *
 * Manages dropdown menu state across the toolbar and panels.
 * Features:
 * - Multiple dropdown states (color picker, font picker, etc.)
 * - Click-outside detection for auto-closing
 * - closeAllDropdowns utility for modal interactions
 * - Refs for each dropdown for positioning
 *
 * @example
 * ```tsx
 * import { useDropdowns } from './hooks/useDropdowns';
 *
 * function Toolbar() {
 *   const {
 *     dropdownState,
 *     dropdownRefs,
 *     closeAllDropdowns,
 *   } = useDropdowns();
 *
 *   return (
 *     <div>
 *       <button onClick={() => dropdownState.setShowColorPicker(true)}>
 *         Color
 *       </button>
 *       {dropdownState.showColorPicker && (
 *         <div ref={dropdownRefs.colorPickerRef}>
 *           <ColorPicker />
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @module hooks/useDropdowns
 */

/**
 * Dropdown State Interface
 * Contains all dropdown visibility states and their setters
 */
export interface DropdownState {
  showColorPicker: boolean;
  setShowColorPicker: Dispatch<SetStateAction<boolean>>;
  showFontSize: boolean;
  setShowFontSize: Dispatch<SetStateAction<boolean>>;
  showUnderlinePicker: boolean;
  setShowUnderlinePicker: Dispatch<SetStateAction<boolean>>;
  showFontPicker: boolean;
  setShowFontPicker: Dispatch<SetStateAction<boolean>>;
  showTextAlign: boolean;
  setShowTextAlign: Dispatch<SetStateAction<boolean>>;
  showLineSpacing: boolean;
  setShowLineSpacing: Dispatch<SetStateAction<boolean>>;
  showLetterSpacing: boolean;
  setShowLetterSpacing: Dispatch<SetStateAction<boolean>>;
  showFormatPicker: boolean;
  setShowFormatPicker: Dispatch<SetStateAction<boolean>>;
  showLayoutPicker: boolean;
  setShowLayoutPicker: Dispatch<SetStateAction<boolean>>;
  showNewTabMenu: boolean;
  setShowNewTabMenu: Dispatch<SetStateAction<boolean>>;
  showSnippetsPicker: boolean;
  setShowSnippetsPicker: Dispatch<SetStateAction<boolean>>;
}

/**
 * Dropdown Refs Interface
 * Contains all refs for click-outside detection
 */
export interface DropdownRefs {
  colorPickerRef: RefObject<HTMLDivElement | null>;
  fontSizeRef: RefObject<HTMLDivElement | null>;
  underlineRef: RefObject<HTMLDivElement | null>;
  fontPickerRef: RefObject<HTMLDivElement | null>;
  textAlignRef: RefObject<HTMLDivElement | null>;
  lineSpacingRef: RefObject<HTMLDivElement | null>;
  letterSpacingRef: RefObject<HTMLDivElement | null>;
  formatPickerRef: RefObject<HTMLDivElement | null>;
  layoutPickerRef: RefObject<HTMLDivElement | null>;
  newTabMenuRef: RefObject<HTMLDivElement | null>;
  snippetsPickerRef: RefObject<HTMLDivElement | null>;
}

/**
 * UseDropdowns Return Type
 * Combined interface for all hook return values
 */
export interface UseDropdownsReturn extends DropdownState, DropdownRefs {
  closeAllDropdowns: () => void;
}

/**
 * Custom hook to manage all toolbar dropdown states, refs, and click-outside handling
 * Consolidates 11 dropdown states into a single manageable hook
 */
export function useDropdowns(): UseDropdownsReturn {
  // Dropdown visibility states
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);
  const [showUnderlinePicker, setShowUnderlinePicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showTextAlign, setShowTextAlign] = useState(false);
  const [showLineSpacing, setShowLineSpacing] = useState(false);
  const [showLetterSpacing, setShowLetterSpacing] = useState(false);
  const [showFormatPicker, setShowFormatPicker] = useState(false);
  const [showLayoutPicker, setShowLayoutPicker] = useState(false);
  const [showNewTabMenu, setShowNewTabMenu] = useState(false);
  const [showSnippetsPicker, setShowSnippetsPicker] = useState(false);

  // Refs for click-outside detection
  const colorPickerRef = useRef<HTMLDivElement | null>(null);
  const fontSizeRef = useRef<HTMLDivElement | null>(null);
  const underlineRef = useRef<HTMLDivElement | null>(null);
  const fontPickerRef = useRef<HTMLDivElement | null>(null);
  const textAlignRef = useRef<HTMLDivElement | null>(null);
  const lineSpacingRef = useRef<HTMLDivElement | null>(null);
  const letterSpacingRef = useRef<HTMLDivElement | null>(null);
  const formatPickerRef = useRef<HTMLDivElement | null>(null);
  const layoutPickerRef = useRef<HTMLDivElement | null>(null);
  const newTabMenuRef = useRef<HTMLDivElement | null>(null);
  const snippetsPickerRef = useRef<HTMLDivElement | null>(null);

  // Close all dropdowns at once
  const closeAllDropdowns = useCallback((): void => {
    setShowColorPicker(false);
    setShowFontSize(false);
    setShowUnderlinePicker(false);
    setShowFontPicker(false);
    setShowTextAlign(false);
    setShowLineSpacing(false);
    setShowLetterSpacing(false);
    setShowFormatPicker(false);
    setShowLayoutPicker(false);
    setShowSnippetsPicker(false);
    setShowNewTabMenu(false);
  }, []);

  // Click outside handler effect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as Node;
      
      if (colorPickerRef.current && !colorPickerRef.current.contains(target)) {
        setShowColorPicker(false);
      }
      if (fontSizeRef.current && !fontSizeRef.current.contains(target)) {
        setShowFontSize(false);
      }
      if (underlineRef.current && !underlineRef.current.contains(target)) {
        setShowUnderlinePicker(false);
      }
      if (fontPickerRef.current && !fontPickerRef.current.contains(target)) {
        setShowFontPicker(false);
      }
      if (textAlignRef.current && !textAlignRef.current.contains(target)) {
        setShowTextAlign(false);
      }
      if (lineSpacingRef.current && !lineSpacingRef.current.contains(target)) {
        setShowLineSpacing(false);
      }
      if (letterSpacingRef.current && !letterSpacingRef.current.contains(target)) {
        setShowLetterSpacing(false);
      }
      if (formatPickerRef.current && !formatPickerRef.current.contains(target)) {
        setShowFormatPicker(false);
      }
      if (layoutPickerRef.current && !layoutPickerRef.current.contains(target)) {
        setShowLayoutPicker(false);
      }
      if (snippetsPickerRef.current && !snippetsPickerRef.current.contains(target)) {
        setShowSnippetsPicker(false);
      }
      if (newTabMenuRef.current && !newTabMenuRef.current.contains(target)) {
        setShowNewTabMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return {
    // Visibility states
    showColorPicker,
    setShowColorPicker,
    showFontSize,
    setShowFontSize,
    showUnderlinePicker,
    setShowUnderlinePicker,
    showFontPicker,
    setShowFontPicker,
    showTextAlign,
    setShowTextAlign,
    showLineSpacing,
    setShowLineSpacing,
    showLetterSpacing,
    setShowLetterSpacing,
    showFormatPicker,
    setShowFormatPicker,
    showLayoutPicker,
    setShowLayoutPicker,
    showNewTabMenu,
    setShowNewTabMenu,
    showSnippetsPicker,
    setShowSnippetsPicker,

    // Refs
    colorPickerRef,
    fontSizeRef,
    underlineRef,
    fontPickerRef,
    textAlignRef,
    lineSpacingRef,
    letterSpacingRef,
    formatPickerRef,
    layoutPickerRef,
    newTabMenuRef,
    snippetsPickerRef,

    // Helper
    closeAllDropdowns,
  };
}

