import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook to manage all toolbar dropdown states, refs, and click-outside handling
 * Consolidates 11 dropdown states into a single manageable hook
 */
export function useDropdowns() {
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
  const colorPickerRef = useRef(null);
  const fontSizeRef = useRef(null);
  const underlineRef = useRef(null);
  const fontPickerRef = useRef(null);
  const textAlignRef = useRef(null);
  const lineSpacingRef = useRef(null);
  const letterSpacingRef = useRef(null);
  const formatPickerRef = useRef(null);
  const layoutPickerRef = useRef(null);
  const newTabMenuRef = useRef(null);
  const snippetsPickerRef = useRef(null);

  // Close all dropdowns at once
  const closeAllDropdowns = useCallback(() => {
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
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
      if (fontSizeRef.current && !fontSizeRef.current.contains(event.target)) {
        setShowFontSize(false);
      }
      if (underlineRef.current && !underlineRef.current.contains(event.target)) {
        setShowUnderlinePicker(false);
      }
      if (fontPickerRef.current && !fontPickerRef.current.contains(event.target)) {
        setShowFontPicker(false);
      }
      if (textAlignRef.current && !textAlignRef.current.contains(event.target)) {
        setShowTextAlign(false);
      }
      if (lineSpacingRef.current && !lineSpacingRef.current.contains(event.target)) {
        setShowLineSpacing(false);
      }
      if (letterSpacingRef.current && !letterSpacingRef.current.contains(event.target)) {
        setShowLetterSpacing(false);
      }
      if (formatPickerRef.current && !formatPickerRef.current.contains(event.target)) {
        setShowFormatPicker(false);
      }
      if (layoutPickerRef.current && !layoutPickerRef.current.contains(event.target)) {
        setShowLayoutPicker(false);
      }
      if (snippetsPickerRef.current && !snippetsPickerRef.current.contains(event.target)) {
        setShowSnippetsPicker(false);
      }
      if (newTabMenuRef.current && !newTabMenuRef.current.contains(event.target)) {
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

