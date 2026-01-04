import React, { useState, useRef, useEffect } from 'react';
import { frameSizes, layoutNames, layoutVariantNames, getFrameSizesByCategory } from '../data';
import { useDesignSystemContext, useSelectionContext, useCarouselsContext, useDropdownsContext } from '../context';
import { HistoryControls, ToolbarButtonGroup } from './toolbar/index.js';

// Detect Mac vs Windows/Linux for shortcut display
const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
const cmdKey = isMac ? '⌘' : 'Ctrl';

export default function Toolbar({ totalOffset, activeTab, zoom, onZoomChange }) {
  // Get state from context
  useDesignSystemContext(); // Keep context subscription but don't destructure since text controls moved to TextToolPanel
  const selection = useSelectionContext();
  const carouselsCtx = useCarouselsContext();
  const dropdowns = useDropdownsContext();

  const { selectedCarouselId, selectedFrameId, selectedCarousel, selectedFrame, handleDeselect } =
    selection;

  const {
    carousels,
    handleSetVariant,
    handleSetLayout,
    handleShuffleLayoutVariant,
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
    formatPickerRef,
    layoutPickerRef,
    snippetsPickerRef,
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
          <ToolbarButtonGroup disabled={!selectedFrameId}>
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
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-[--surface-raised]/50 border border-[--border-default] rounded-[--radius-md] px-1.5 py-1">
            <button
              type="button"
              onClick={() => onZoomChange?.(Math.max(50, zoom - 10))}
              className="w-6 h-6 rounded-[--radius-sm] flex items-center justify-center text-[--text-tertiary] hover:text-[--text-primary] hover:bg-[--surface-overlay] transition-colors"
              title={`Zoom out (${cmdKey}-)`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-[10px] font-mono font-medium text-[--text-secondary] tabular-nums min-w-[36px] text-center">
              {zoom}%
            </span>
            <button
              type="button"
              onClick={() => onZoomChange?.(Math.min(250, zoom + 10))}
              className="w-6 h-6 rounded-[--radius-sm] flex items-center justify-center text-[--text-tertiary] hover:text-[--text-primary] hover:bg-[--surface-overlay] transition-colors"
              title={`Zoom in (${cmdKey}+)`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => onZoomChange?.(100)}
              className="w-6 h-6 rounded-[--radius-sm] flex items-center justify-center text-[--text-quaternary] hover:text-[--text-primary] hover:bg-[--surface-overlay] transition-colors"
              title={`Reset zoom (${cmdKey}0)`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>

          <div className="w-px h-6 bg-[--border-default]" />

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
