import React, { useState, useRef, useEffect } from 'react';
import { frameSizes, layoutNames, layoutVariantNames, getFrameStyle, getFrameSizesByCategory } from '../data';
import { FONT_WEIGHTS } from '../config';
import { useDesignSystemContext, useSelectionContext, useCarouselsContext, useDropdownsContext } from '../context';
import { HistoryControls, ToolbarButtonGroup } from './toolbar/index.js';

// Detect Mac vs Windows/Linux for shortcut display
const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
const cmdKey = isMac ? '⌘' : 'Ctrl+';

export default function Toolbar({ totalOffset, activeTab }) {
  // Get state from context
  const { designSystem } = useDesignSystemContext();
  const selection = useSelectionContext();
  const carouselsCtx = useCarouselsContext();
  const dropdowns = useDropdownsContext();

  const { selectedCarouselId, selectedFrameId, selectedCarousel, selectedFrame, activeTextField, handleDeselect } =
    selection;

  const {
    carousels,
    handleSetVariant,
    handleSetLayout,
    handleShuffleLayoutVariant,
    handleUpdateFormatting,
    handleChangeFrameSize,
    handleUpdateImageLayer,
    handleRemoveImageFromFrame,
  } = carouselsCtx;

  const {
    showFormatPicker,
    setShowFormatPicker,
    showLayoutPicker,
    setShowLayoutPicker,
    showSnippetsPicker,
    setShowSnippetsPicker,
    showFontPicker,
    setShowFontPicker,
    showFontSize,
    setShowFontSize,
    showColorPicker,
    setShowColorPicker,
    showUnderlinePicker,
    setShowUnderlinePicker,
    showTextAlign,
    setShowTextAlign,
    showLineSpacing,
    setShowLineSpacing,
    showLetterSpacing,
    setShowLetterSpacing,
    formatPickerRef,
    layoutPickerRef,
    snippetsPickerRef,
    fontPickerRef,
    fontSizeRef,
    colorPickerRef,
    underlineRef,
    textAlignRef,
    lineSpacingRef,
    letterSpacingRef,
    closeAllDropdowns,
  } = dropdowns;

  // Image controls state
  const [showImageControls, setShowImageControls] = useState(false);
  const imageControlsRef = useRef(null);

  // Image controls click-outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (imageControlsRef.current && !imageControlsRef.current.contains(e.target)) {
        setShowImageControls(false);
      }
    };
    if (showImageControls) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showImageControls]);

  if (!activeTab?.hasContent) return null;

  return (
    <div
      className="fixed z-[100] bg-[--surface-canvas] border-b border-[--border-default] px-5 overflow-visible flex items-center"
      style={{ top: 56, left: totalOffset, right: 0, height: 64, transition: 'left 0.3s ease-out' }}
    >
      <div className="flex items-center justify-between text-sm text-[--text-tertiary] w-full">
        <div className="flex items-center gap-3">
          {/* Undo/Redo Controls */}
          <HistoryControls />

          {/* Separator */}
          <div className="w-px h-6 bg-[--surface-overlay]" />

          {/* Frame Group - Using extracted ToolbarButtonGroup */}
          <ToolbarButtonGroup disabled={!selectedCarouselId} className="gap-2">
            {/* Format dropdown */}
            <div ref={formatPickerRef} className="relative">
              <button
                onClick={() => {
                  const wasOpen = showFormatPicker;
                  closeAllDropdowns();
                  if (!wasOpen) setShowFormatPicker(true);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded transition-all duration-200 border ${showFormatPicker ? 'bg-[--surface-overlay] border-[--border-strong]' : 'bg-[--surface-raised]/50 border-[--border-default] hover:bg-[--surface-overlay] hover:border-[--border-emphasis]'}`}
              >
                <span className="text-xs font-medium text-[--text-secondary]">Format</span>
                <span className="text-[11px] text-[--text-quaternary]">
                  {frameSizes[selectedCarousel?.frameSize]?.name || 'Portrait'}
                </span>
                <svg
                  className={`w-3 h-3 text-[--text-quaternary] transition-transform duration-200 ${showFormatPicker ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showFormatPicker && (
                <div className="absolute top-full left-0 mt-2 p-1.5 bg-[--surface-canvas] border border-[--border-default] rounded-xl shadow-xl z-[200] min-w-[180px] overflow-hidden">
                  {Object.entries(getFrameSizesByCategory(activeTab?.projectType || 'carousel')).map(([key, size]) => (
                    <button
                      key={key}
                      onClick={() => {
                        handleChangeFrameSize(selectedCarouselId, key);
                        setShowFormatPicker(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded text-left text-xs transition-all duration-200 ${selectedCarousel?.frameSize === key ? 'bg-[--surface-overlay] text-white' : 'text-[--text-tertiary] hover:bg-[--surface-raised] hover:text-[--text-secondary]'}`}
                    >
                      <span className="font-medium">{size.name}</span>
                      <span className="text-[--text-disabled]">{size.ratio}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ToolbarButtonGroup>

          {/* Layout Group - Using extracted ToolbarButtonGroup */}
          <ToolbarButtonGroup disabled={!selectedFrame}>
            <div ref={layoutPickerRef} className="relative">
              <button
                onClick={() => {
                  const wasOpen = showLayoutPicker;
                  closeAllDropdowns();
                  if (!wasOpen) setShowLayoutPicker(true);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded transition-all duration-200 border ${showLayoutPicker ? 'bg-[--surface-overlay] border-[--border-strong]' : 'bg-[--surface-raised]/50 border-[--border-default] hover:bg-[--surface-overlay] hover:border-[--border-emphasis]'}`}
              >
                <span className="text-xs font-medium text-[--text-secondary]">Layout</span>
                <span className="text-[11px] text-[--text-quaternary] w-[85px] text-left">
                  {(() => {
                    const layoutIdx = selectedFrame?.currentLayout || 0;
                    const variantIdx = selectedFrame?.layoutVariant || 0;
                    const variantName = layoutVariantNames[layoutIdx]?.[variantIdx] || '';
                    const baseName = layoutNames[layoutIdx] || 'Stack';
                    const typeWord = baseName.split(' ').pop();
                    return `${variantName} ${typeWord}`;
                  })()}
                </span>
                <svg
                  className={`w-3 h-3 text-[--text-quaternary] transition-transform duration-200 ${showLayoutPicker ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showLayoutPicker && (
                <div className="absolute top-full left-0 mt-2 p-1.5 bg-[--surface-canvas] border border-[--border-default] rounded-xl shadow-xl z-[200] min-w-[160px]">
                  {layoutNames.map((name, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        handleSetLayout(selectedCarouselId, selectedFrameId, idx);
                        setShowLayoutPicker(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-left text-xs transition-all duration-200 ${(selectedFrame?.currentLayout || 0) === idx ? 'bg-[--surface-overlay] text-white' : 'text-[--text-tertiary] hover:bg-[--surface-raised] hover:text-[--text-secondary]'}`}
                    >
                      {idx === 0 && (
                        <div
                          className={`w-4 h-5 rounded flex items-end p-0.5 ${(selectedFrame?.currentLayout || 0) === idx ? 'bg-[--surface-elevated]' : 'bg-[--surface-overlay]'}`}
                        >
                          <div
                            className={`w-full h-1 rounded-sm ${(selectedFrame?.currentLayout || 0) === idx ? 'bg-white' : 'bg-[--surface-elevated]'}`}
                          />
                        </div>
                      )}
                      {idx === 1 && (
                        <div
                          className={`w-4 h-5 rounded flex items-center justify-center ${(selectedFrame?.currentLayout || 0) === idx ? 'bg-[--surface-elevated]' : 'bg-[--surface-overlay]'}`}
                        >
                          <div
                            className={`w-2 h-2 rounded-sm ${(selectedFrame?.currentLayout || 0) === idx ? 'bg-white' : 'bg-[--surface-elevated]'}`}
                          />
                        </div>
                      )}
                      {idx === 2 && (
                        <div
                          className={`w-4 h-5 rounded flex flex-col justify-between p-0.5 ${(selectedFrame?.currentLayout || 0) === idx ? 'bg-[--surface-elevated]' : 'bg-[--surface-overlay]'}`}
                        >
                          <div
                            className={`w-2 h-1 rounded-sm ${(selectedFrame?.currentLayout || 0) === idx ? 'bg-white' : 'bg-[--surface-elevated]'}`}
                          />
                          <div className="w-1.5 h-1 bg-[--surface-elevated] rounded-sm self-end" />
                        </div>
                      )}
                      <span className="font-medium">{name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => {
                closeAllDropdowns();
                selectedFrame && handleShuffleLayoutVariant(selectedCarouselId, selectedFrameId);
              }}
              className="p-2 rounded border border-transparent hover:bg-[--surface-overlay] hover:border-[--border-emphasis] text-[--text-quaternary] hover:text-[--text-secondary] transition-all duration-200"
              title="Shuffle variant • Try different layouts quickly"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </button>
          </ToolbarButtonGroup>

          {/* Image Controls Group - Only shows when frame has image */}
          {selectedFrame?.imageLayer && (
            <ToolbarButtonGroup>
              <div ref={imageControlsRef} className="relative">
                <button
                  onClick={() => {
                    const wasOpen = showImageControls;
                    closeAllDropdowns();
                    setShowImageControls(false);
                    if (!wasOpen) setShowImageControls(true);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded transition-all duration-200 border ${
                    showImageControls
                      ? 'bg-blue-600 border-blue-500'
                      : 'bg-[--surface-raised]/50 border-[--border-default] hover:bg-[--surface-overlay] hover:border-[--border-emphasis]'
                  }`}
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-xs font-medium text-white">Image</span>
                  <svg
                    className={`w-3 h-3 text-[--text-tertiary] transition-transform duration-200 ${showImageControls ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showImageControls && (
                  <div className="absolute top-full left-0 mt-2 p-3 bg-[--surface-canvas] border border-[--border-default] rounded-xl shadow-xl z-[200] min-w-[200px]">
                    {/* Zoom Control */}
                    <div className="mb-3">
                      <div className="text-[10px] text-[--text-quaternary] uppercase tracking-wide mb-2">Zoom</div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleUpdateImageLayer?.(selectedCarouselId, selectedFrameId, {
                              scale: Math.max(0.5, (selectedFrame?.imageLayer?.scale || 1) - 0.2),
                            })
                          }
                          className="w-7 h-7 flex items-center justify-center bg-[--surface-raised] hover:bg-[--surface-overlay] rounded border border-[--border-default] text-[--text-tertiary] hover:text-white transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <div className="flex-1 text-center">
                          <span className="text-xs text-white font-medium">
                            {Math.round((selectedFrame?.imageLayer?.scale || 1) * 100)}%
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            handleUpdateImageLayer?.(selectedCarouselId, selectedFrameId, {
                              scale: Math.min(5, (selectedFrame?.imageLayer?.scale || 1) + 0.2),
                            })
                          }
                          className="w-7 h-7 flex items-center justify-center bg-[--surface-raised] hover:bg-[--surface-overlay] rounded border border-[--border-default] text-[--text-tertiary] hover:text-white transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Opacity Control */}
                    <div className="mb-3">
                      <div className="text-[10px] text-[--text-quaternary] uppercase tracking-wide mb-2">Opacity</div>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={(selectedFrame?.imageLayer?.opacity || 1) * 100}
                          onChange={(e) =>
                            handleUpdateImageLayer?.(selectedCarouselId, selectedFrameId, {
                              opacity: parseInt(e.target.value) / 100,
                            })
                          }
                          className="flex-1 h-1.5 bg-[--surface-overlay] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full"
                        />
                        <span className="text-xs text-[--text-tertiary] w-10 text-right">
                          {Math.round((selectedFrame?.imageLayer?.opacity || 1) * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* Fit Mode */}
                    <div className="mb-3">
                      <div className="text-[10px] text-[--text-quaternary] uppercase tracking-wide mb-2">Fit Mode</div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() =>
                            handleUpdateImageLayer?.(selectedCarouselId, selectedFrameId, { fit: 'cover' })
                          }
                          className={`flex-1 px-2 py-1.5 rounded text-[11px] font-medium transition-all border ${
                            selectedFrame?.imageLayer?.fit === 'cover' || !selectedFrame?.imageLayer?.fit
                              ? 'bg-[--surface-overlay] border-[--border-strong] text-white'
                              : 'bg-[--surface-raised]/50 border-[--border-default] text-[--text-quaternary] hover:bg-[--surface-raised] hover:text-[--text-secondary]'
                          }`}
                        >
                          Cover
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateImageLayer?.(selectedCarouselId, selectedFrameId, { fit: 'contain' })
                          }
                          className={`flex-1 px-2 py-1.5 rounded text-[11px] font-medium transition-all border ${
                            selectedFrame?.imageLayer?.fit === 'contain'
                              ? 'bg-[--surface-overlay] border-[--border-strong] text-white'
                              : 'bg-[--surface-raised]/50 border-[--border-default] text-[--text-quaternary] hover:bg-[--surface-raised] hover:text-[--text-secondary]'
                          }`}
                        >
                          Contain
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2 border-t border-[--border-default]">
                      <button
                        onClick={() =>
                          handleUpdateImageLayer?.(selectedCarouselId, selectedFrameId, {
                            x: 0,
                            y: 0,
                            scale: 1,
                            opacity: 1,
                          })
                        }
                        className="flex-1 px-3 py-2 bg-[--surface-raised] hover:bg-[--surface-overlay] rounded text-xs text-[--text-secondary] transition-colors"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => {
                          handleRemoveImageFromFrame?.(selectedCarouselId, selectedFrameId);
                          setShowImageControls(false);
                        }}
                        className="flex-1 px-3 py-2 bg-red-900/50 hover:bg-red-600 rounded text-xs text-red-300 hover:text-white transition-colors"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Tip */}
                    <div className="mt-3 pt-2 border-t border-[--border-default]">
                      <p className="text-[10px] text-[--text-quaternary] text-center">
                        Double-click image to drag • Scroll to zoom
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </ToolbarButtonGroup>
          )}

          {/* Snippets Group - Using extracted ToolbarButtonGroup */}
          <ToolbarButtonGroup disabled={!activeTextField}>
            <div ref={snippetsPickerRef} className="relative">
              <button
                onClick={() => {
                  const wasOpen = showSnippetsPicker;
                  closeAllDropdowns();
                  if (!wasOpen) setShowSnippetsPicker(true);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded transition-all duration-200 border ${showSnippetsPicker ? 'bg-[--surface-overlay] border-[--border-strong]' : 'bg-[--surface-raised]/50 border-[--border-default] hover:bg-[--surface-overlay] hover:border-[--border-emphasis]'}`}
              >
                <span className="text-xs font-medium text-[--text-secondary]">Snippets</span>
                <span className="text-[11px] text-[--text-tertiary] font-medium">
                  S{(selectedFrame?.currentVariant || 0) + 1}
                </span>
                <svg
                  className={`w-3 h-3 text-[--text-quaternary] transition-transform duration-200 ${showSnippetsPicker ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showSnippetsPicker && (
                <div className="absolute top-full left-0 mt-2 p-1.5 bg-[--surface-canvas] border border-[--border-default] rounded-xl shadow-xl z-[200] min-w-[90px]">
                  {[0, 1, 2].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        handleSetVariant(selectedCarouselId, selectedFrameId, idx);
                        setShowSnippetsPicker(false);
                      }}
                      className={`w-full flex items-center justify-center gap-1 px-3 py-2 rounded text-xs font-medium transition-all duration-200 ${selectedFrame?.currentVariant === idx ? 'bg-[--surface-overlay] text-white' : 'text-[--text-tertiary] hover:bg-[--surface-raised] hover:text-[--text-secondary]'}`}
                    >
                      <span>S{idx + 1}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              className="p-2 rounded border border-transparent text-[--text-quaternary] hover:text-[--text-secondary] hover:bg-[--surface-overlay] hover:border-[--border-emphasis] transition-all duration-200"
              title="Rewrite with AI • Coming soon"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" />
              </svg>
            </button>
          </ToolbarButtonGroup>

          {/* Typography Group - Using extracted ToolbarButtonGroup */}
          <ToolbarButtonGroup disabled={!activeTextField}>
            {/* Font Weight dropdown */}
            <div ref={fontPickerRef} className="relative">
              <button
                onClick={() => {
                  if (!activeTextField) return;
                  const wasOpen = showFontPicker;
                  closeAllDropdowns();
                  if (!wasOpen) setShowFontPicker(true);
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-[--surface-overlay]/50 rounded text-xs font-medium text-[--text-secondary] hover:bg-[--surface-overlay] transition-colors duration-200"
              >
                <span>Font</span>
                <svg
                  className={`w-2.5 h-2.5 transition-transform duration-200 ${showFontPicker ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showFontPicker && activeTextField && (
                <div
                  className="absolute top-full left-0 mt-2 p-1.5 bg-[--surface-raised] border border-[--border-default] rounded shadow-xl z-[200] max-h-64 overflow-y-auto min-w-[180px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-2 py-1.5 text-[10px] text-[--text-quaternary] uppercase tracking-wide border-b border-[--border-default] mb-1">
                    Nunito Sans
                  </div>
                  {FONT_WEIGHTS.map((weight) => {
                    const isHeadingDefault = weight.value === (designSystem?.headingWeight || '700');
                    const isBodyDefault = weight.value === (designSystem?.bodyWeight || '400');
                    const currentWeight =
                      selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]
                        ?.fontWeight;
                    const isSelected = currentWeight === weight.value;

                    return (
                      <button
                        type="button"
                        key={weight.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateFormatting(
                            selectedCarouselId,
                            selectedFrameId,
                            activeTextField,
                            'fontWeight',
                            weight.value
                          );
                          setShowFontPicker(false);
                        }}
                        className={`w-full px-3 py-2 rounded text-xs text-left transition-colors duration-200 flex items-center justify-between ${isSelected ? 'bg-[--surface-overlay] text-white' : 'text-[--text-secondary] hover:bg-[--surface-overlay]'}`}
                        style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: weight.weight }}
                      >
                        <span>{weight.name}</span>
                        <span className="flex items-center gap-1">
                          {isHeadingDefault && (
                            <span
                              className={`text-[10px] ${isSelected ? 'text-[--text-tertiary]' : 'text-[--text-quaternary]'}`}
                              title="Default for Headings"
                            >
                              ★H
                            </span>
                          )}
                          {isBodyDefault && (
                            <span
                              className={`text-[10px] ${isSelected ? 'text-[--text-tertiary]' : 'text-[--text-quaternary]'}`}
                              title="Default for Body"
                            >
                              ★B
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Font Size dropdown */}
            <div ref={fontSizeRef} className="relative">
              <button
                onClick={() => {
                  if (!activeTextField) return;
                  const wasOpen = showFontSize;
                  closeAllDropdowns();
                  if (!wasOpen) setShowFontSize(true);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs font-medium text-[--text-secondary] transition-all duration-200 border ${showFontSize ? 'bg-[--surface-overlay] border-[--border-strong]' : 'bg-[--surface-raised]/50 border-[--border-default] hover:bg-[--surface-overlay] hover:border-[--border-emphasis]'}`}
              >
                <span>Size</span>
                <svg
                  className={`w-2.5 h-2.5 text-[--text-quaternary] transition-transform duration-200 ${showFontSize ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showFontSize && activeTextField && (
                <div
                  className="absolute top-full left-0 mt-2 p-1.5 bg-[--surface-canvas] border border-[--border-default] rounded-xl shadow-xl z-[200]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex gap-1.5">
                    {[
                      { name: 'S', value: 0.85 },
                      { name: 'M', value: 1 },
                      { name: 'L', value: 1.2 },
                    ].map((s) => (
                      <button
                        type="button"
                        key={s.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateFormatting(
                            selectedCarouselId,
                            selectedFrameId,
                            activeTextField,
                            'fontSize',
                            s.value
                          );
                          setShowFontSize(false);
                        }}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 border ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.fontSize === s.value ? 'bg-[--surface-overlay] border-[--border-strong] text-white' : 'bg-[--surface-raised]/50 border-[--border-default] text-[--text-tertiary] hover:bg-[--surface-raised] hover:border-[--border-emphasis] hover:text-[--text-secondary]'}`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Color picker */}
            <div ref={colorPickerRef} className="relative">
              <button
                onClick={() => {
                  if (!activeTextField) return;
                  const wasOpen = showColorPicker;
                  closeAllDropdowns();
                  if (!wasOpen) setShowColorPicker(true);
                }}
                className={`flex items-center gap-1 p-2 rounded transition-all duration-200 border ${showColorPicker ? 'bg-[--surface-overlay] border-[--border-strong]' : 'bg-[--surface-raised]/50 border-[--border-default] hover:bg-[--surface-overlay] hover:border-[--border-emphasis]'}`}
                title="Text color • Apply brand colors"
              >
                <div
                  className="w-5 h-5 rounded border border-[--border-strong]"
                  style={{
                    backgroundColor: (() => {
                      const explicitColor =
                        selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.color;
                      if (explicitColor) return explicitColor;
                      if (activeTextField === 'headline' && selectedFrame) {
                        const frameStyle = getFrameStyle(selectedCarouselId, selectedFrame.style, designSystem);
                        return frameStyle.text || '#ffffff';
                      }
                      return '#e5e7eb';
                    })(),
                  }}
                />
              </button>
              {showColorPicker && activeTextField && (
                <div
                  className="absolute top-full left-0 mt-2 p-2.5 bg-[--surface-canvas] border border-[--border-default] rounded-xl shadow-xl z-[200]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex gap-2">
                    {[
                      { name: 'Primary', value: designSystem.primary },
                      { name: 'Secondary', value: designSystem.secondary },
                      { name: 'Accent', value: designSystem.accent },
                      { name: 'Light', value: designSystem.neutral3 },
                      { name: 'White', value: '#ffffff' },
                    ].map((c) => (
                      <button
                        type="button"
                        key={c.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateFormatting(
                            selectedCarouselId,
                            selectedFrameId,
                            activeTextField,
                            'color',
                            c.value
                          );
                          setShowColorPicker(false);
                        }}
                        className="w-6 h-6 rounded border-2 border-[--border-emphasis] hover:border-[--border-strong] hover:scale-110 transition-all duration-200"
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ToolbarButtonGroup>

          {/* Style Group - Using extracted ToolbarButtonGroup */}
          <ToolbarButtonGroup disabled={!activeTextField} className="gap-1">
            {/* Bold */}
            <button
              onClick={() => {
                if (!activeTextField) return;
                closeAllDropdowns();
                const formatting =
                  selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField] || {};
                const defaultWeight = activeTextField === 'headline' ? '700' : '400';
                const currentWeight = formatting.fontWeight || defaultWeight;
                const newWeight = currentWeight === '700' ? '400' : '700';
                handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'fontWeight', newWeight);
              }}
              className={`w-9 h-9 rounded flex items-center justify-center text-sm font-bold transition-all duration-200 border ${(() => {
                const formatting =
                  selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField] || {};
                const defaultWeight = activeTextField === 'headline' ? '700' : '400';
                const currentWeight = formatting.fontWeight || defaultWeight;
                const isBold = currentWeight === '700';
                return isBold
                  ? 'bg-[--surface-overlay] border-[--border-strong] text-white'
                  : 'bg-[--surface-raised]/50 border-[--border-default] text-[--text-tertiary] hover:bg-[--surface-overlay] hover:border-[--border-emphasis] hover:text-[--text-secondary]';
              })()}`}
              title={`Bold (${cmdKey}B)`}
            >
              B
            </button>

            {/* Italic */}
            <button
              onClick={() => {
                if (!activeTextField) return;
                closeAllDropdowns();
                const formatting =
                  selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField] || {};
                handleUpdateFormatting(
                  selectedCarouselId,
                  selectedFrameId,
                  activeTextField,
                  'italic',
                  !formatting.italic
                );
              }}
              className={`w-9 h-9 rounded flex items-center justify-center text-sm italic transition-all duration-200 border ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.italic ? 'bg-[--surface-overlay] border-[--border-strong] text-white' : 'bg-[--surface-raised]/50 border-[--border-default] text-[--text-tertiary] hover:bg-[--surface-overlay] hover:border-[--border-emphasis] hover:text-[--text-secondary]'}`}
              title={`Italic (${cmdKey}I)`}
            >
              I
            </button>

            {/* Underline */}
            <div ref={underlineRef} className="relative flex">
              <button
                onClick={() => {
                  if (!activeTextField) return;
                  const wasOpen = showUnderlinePicker;
                  closeAllDropdowns();
                  if (!wasOpen) setShowUnderlinePicker(true);
                }}
                className={`flex items-center gap-1 px-2 h-9 rounded text-sm transition-all duration-200 border ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.underline ? 'bg-[--surface-overlay] border-[--border-strong] text-white' : 'bg-[--surface-raised]/50 border-[--border-default] text-[--text-tertiary] hover:bg-[--surface-overlay] hover:border-[--border-emphasis] hover:text-[--text-secondary]'}`}
                title={`Underline (${cmdKey}U)`}
              >
                <span style={{ textDecoration: 'underline' }}>U</span>
                <svg
                  className={`w-2.5 h-2.5 text-[--text-quaternary] transition-transform duration-200 ${showUnderlinePicker ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showUnderlinePicker && activeTextField && (
                <div
                  className="absolute top-full right-0 mt-2 p-3 bg-[--surface-canvas] border border-[--border-default] rounded-xl shadow-xl z-[200] min-w-[180px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-[10px] text-[--text-quaternary] mb-2 uppercase tracking-wide font-medium">Style</div>
                  <div className="flex gap-1.5 mb-4">
                    {[
                      { name: 'Solid', value: 'solid' },
                      { name: 'Dotted', value: 'dotted' },
                      { name: 'Wavy', value: 'wavy' },
                      { name: 'Highlight', value: 'highlight' },
                    ].map((s) => (
                      <button
                        type="button"
                        key={s.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateFormatting(
                            selectedCarouselId,
                            selectedFrameId,
                            activeTextField,
                            'underlineStyle',
                            s.value
                          );
                          handleUpdateFormatting(
                            selectedCarouselId,
                            selectedFrameId,
                            activeTextField,
                            'underline',
                            true
                          );
                        }}
                        className={`px-3 py-1.5 rounded text-xs transition-all duration-200 border ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.underlineStyle === s.value ? 'bg-[--surface-overlay] border-[--border-strong] text-white' : 'bg-[--surface-raised]/50 border-[--border-default] text-[--text-tertiary] hover:bg-[--surface-raised] hover:border-[--border-emphasis] hover:text-[--text-secondary]'}`}
                        title={s.name}
                      >
                        {s.value === 'solid' && (
                          <span style={{ textDecoration: 'underline', textDecorationStyle: 'solid' }}>S</span>
                        )}
                        {s.value === 'dotted' && (
                          <span style={{ textDecoration: 'underline', textDecorationStyle: 'dotted' }}>D</span>
                        )}
                        {s.value === 'wavy' && (
                          <span style={{ textDecoration: 'underline', textDecorationStyle: 'wavy' }}>W</span>
                        )}
                        {s.value === 'highlight' && (
                          <span
                            style={{
                              backgroundImage: 'linear-gradient(to top, rgba(251,191,36,0.5) 30%, transparent 30%)',
                            }}
                          >
                            H
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="text-[10px] text-[--text-quaternary] mb-2 uppercase tracking-wide font-medium">Color</div>
                  <div className="flex gap-2 mb-4">
                    {[
                      { name: 'Primary', value: designSystem.primary },
                      { name: 'Secondary', value: designSystem.secondary },
                      { name: 'Accent', value: designSystem.accent },
                      { name: 'Light', value: designSystem.neutral3 },
                      { name: 'White', value: '#ffffff' },
                    ].map((c) => (
                      <button
                        type="button"
                        key={c.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateFormatting(
                            selectedCarouselId,
                            selectedFrameId,
                            activeTextField,
                            'underlineColor',
                            c.value
                          );
                          handleUpdateFormatting(
                            selectedCarouselId,
                            selectedFrameId,
                            activeTextField,
                            'underline',
                            true
                          );
                          if (
                            !selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]
                              ?.underlineStyle
                          )
                            handleUpdateFormatting(
                              selectedCarouselId,
                              selectedFrameId,
                              activeTextField,
                              'underlineStyle',
                              'solid'
                            );
                        }}
                        className={`w-6 h-6 rounded border-2 hover:scale-110 transition-all duration-200 ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.underlineColor === c.value ? 'border-[--border-strong]' : 'border-[--border-emphasis] hover:border-[--border-strong]'}`}
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'underline', false);
                      setShowUnderlinePicker(false);
                    }}
                    className="w-full px-3 py-2 rounded text-xs text-[--text-quaternary] hover:text-[--text-secondary] hover:bg-[--surface-raised]/50 transition-all duration-200 border border-[--border-default]/50 hover:border-[--border-emphasis]"
                  >
                    Remove Underline
                  </button>
                </div>
              )}
            </div>
          </ToolbarButtonGroup>

          {/* Alignment & Spacing Group - Using extracted ToolbarButtonGroup */}
          <ToolbarButtonGroup disabled={!activeTextField} className="gap-1">
            {/* Text Alignment */}
            <div ref={textAlignRef} className="relative">
              <button
                onClick={() => {
                  if (!activeTextField) return;
                  const wasOpen = showTextAlign;
                  closeAllDropdowns();
                  if (!wasOpen) setShowTextAlign(true);
                }}
                className={`flex items-center justify-center gap-1 w-[52px] h-9 rounded transition-all duration-200 border ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.textAlign && selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.textAlign !== 'left' ? 'bg-[--surface-overlay] border-[--border-strong] text-white' : 'bg-[--surface-raised]/50 border-[--border-default] text-[--text-tertiary] hover:bg-[--surface-overlay] hover:border-[--border-emphasis] hover:text-[--text-secondary]'}`}
                title="Text alignment • Left, center, right"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
                </svg>
                <svg className="w-2.5 h-2.5 text-[--text-quaternary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showTextAlign && activeTextField && (
                <div
                  className="absolute top-full left-0 mt-2 p-1.5 bg-[--surface-canvas] border border-[--border-default] rounded-xl shadow-xl z-[200]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex gap-1.5">
                    {[
                      { name: 'Left', value: 'left', icon: 'M4 6h16M4 12h10M4 18h16' },
                      { name: 'Center', value: 'center', icon: 'M4 6h16M7 12h10M4 18h16' },
                      { name: 'Right', value: 'right', icon: 'M4 6h16M10 12h10M4 18h16' },
                      { name: 'Justify', value: 'justify', icon: 'M4 6h16M4 12h16M4 18h16' },
                    ].map((a) => (
                      <button
                        type="button"
                        key={a.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateFormatting(
                            selectedCarouselId,
                            selectedFrameId,
                            activeTextField,
                            'textAlign',
                            a.value
                          );
                          setShowTextAlign(false);
                        }}
                        className={`p-2 rounded transition-all duration-200 border ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.textAlign === a.value ? 'bg-[--surface-overlay] border-[--border-strong] text-white' : 'bg-[--surface-raised]/50 border-[--border-default] text-[--text-tertiary] hover:bg-[--surface-raised] hover:border-[--border-emphasis] hover:text-[--text-secondary]'}`}
                        title={a.name}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={a.icon} />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Line Spacing */}
            <div ref={lineSpacingRef} className="relative">
              <button
                onClick={() => {
                  if (!activeTextField) return;
                  const wasOpen = showLineSpacing;
                  closeAllDropdowns();
                  if (!wasOpen) setShowLineSpacing(true);
                }}
                className={`flex items-center justify-center gap-1 w-[52px] h-9 rounded transition-all duration-200 border ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.lineHeight && selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.lineHeight !== 1.4 ? 'bg-[--surface-overlay] border-[--border-strong] text-white' : 'bg-[--surface-raised]/50 border-[--border-default] text-[--text-tertiary] hover:bg-[--surface-overlay] hover:border-[--border-emphasis] hover:text-[--text-secondary]'}`}
                title="Line spacing • Adjust line height"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path
                    d="M12 3v18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg className="w-2.5 h-2.5 text-[--text-quaternary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showLineSpacing && activeTextField && (
                <div
                  className="absolute top-full left-0 mt-2 p-1.5 bg-[--surface-canvas] border border-[--border-default] rounded-xl shadow-xl z-[200] min-w-[110px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {[
                    { name: 'Tight', value: 1.1 },
                    { name: 'Normal', value: 1.4 },
                    { name: 'Relaxed', value: 1.7 },
                    { name: 'Loose', value: 2 },
                  ].map((s) => (
                    <button
                      type="button"
                      key={s.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateFormatting(
                          selectedCarouselId,
                          selectedFrameId,
                          activeTextField,
                          'lineHeight',
                          s.value
                        );
                        setShowLineSpacing(false);
                      }}
                      className={`w-full px-3 py-2 rounded text-xs text-left transition-all duration-200 ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.lineHeight === s.value ? 'bg-[--surface-overlay] text-white' : 'text-[--text-tertiary] hover:bg-[--surface-raised] hover:text-[--text-secondary]'}`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Letter Spacing */}
            <div ref={letterSpacingRef} className="relative">
              <button
                onClick={() => {
                  if (!activeTextField) return;
                  const wasOpen = showLetterSpacing;
                  closeAllDropdowns();
                  if (!wasOpen) setShowLetterSpacing(true);
                }}
                className={`flex items-center justify-center gap-1 w-[52px] h-9 rounded transition-all duration-200 border ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.letterSpacing && selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.letterSpacing !== 0 ? 'bg-[--surface-overlay] border-[--border-strong] text-white' : 'bg-[--surface-raised]/50 border-[--border-default] text-[--text-tertiary] hover:bg-[--surface-overlay] hover:border-[--border-emphasis] hover:text-[--text-secondary]'}`}
                title="Letter spacing • Adjust character spacing"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path
                    d="M3 12h18M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg className="w-2.5 h-2.5 text-[--text-quaternary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showLetterSpacing && activeTextField && (
                <div
                  className="absolute top-full left-0 mt-2 p-1.5 bg-[--surface-canvas] border border-[--border-default] rounded-xl shadow-xl z-[200] min-w-[110px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {[
                    { name: 'Tight', value: -0.5 },
                    { name: 'Normal', value: 0 },
                    { name: 'Wide', value: 1 },
                    { name: 'Wider', value: 2 },
                  ].map((s) => (
                    <button
                      type="button"
                      key={s.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateFormatting(
                          selectedCarouselId,
                          selectedFrameId,
                          activeTextField,
                          'letterSpacing',
                          s.value
                        );
                        setShowLetterSpacing(false);
                      }}
                      className={`w-full px-3 py-2 rounded text-xs text-left transition-all duration-200 ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.letterSpacing === s.value ? 'bg-[--surface-overlay] text-white' : 'text-[--text-tertiary] hover:bg-[--surface-raised] hover:text-[--text-secondary]'}`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ToolbarButtonGroup>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <span className="text-[--text-tertiary]">
            Row{' '}
            <span className="text-white font-medium">
              {selectedCarouselId ? carousels.findIndex((c) => c.id === selectedCarouselId) + 1 : '-'}
            </span>{' '}
            / {carousels.length}
          </span>
          <button
            onClick={() => {
              closeAllDropdowns();
              handleDeselect();
            }}
            disabled={!selectedCarouselId && !selectedFrameId}
            className={`px-4 py-2 text-xs font-medium rounded transition-colors duration-200 ${selectedCarouselId || selectedFrameId ? 'bg-[--surface-overlay] hover:bg-[--surface-elevated] text-[--text-secondary]' : 'bg-[--surface-raised] text-[--text-disabled] cursor-not-allowed'}`}
          >
            Deselect Row
          </button>
        </div>
      </div>
    </div>
  );
}
