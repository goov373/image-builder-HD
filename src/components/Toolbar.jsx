import React from 'react';
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
                className={`flex items-center gap-2 px-2 py-1 rounded-[--radius-sm] transition-all duration-[--duration-fast] ${showFormatPicker ? 'bg-[--surface-overlay] text-[--text-primary]' : 'bg-transparent text-[--text-secondary] hover:bg-[--surface-raised] hover:text-[--text-primary]'}`}
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
                className={`flex items-center gap-2 px-2 py-1 rounded-[--radius-sm] transition-all duration-[--duration-fast] ${showLayoutPicker ? 'bg-[--surface-overlay] text-[--text-primary]' : 'bg-transparent text-[--text-secondary] hover:bg-[--surface-raised] hover:text-[--text-primary]'}`}
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

          {/* Snippets Group - Using extracted ToolbarButtonGroup */}
          <ToolbarButtonGroup disabled={!selectedFrameId}>
            <div ref={snippetsPickerRef} className="relative">
              <button
                onClick={() => {
                  const wasOpen = showSnippetsPicker;
                  closeAllDropdowns();
                  if (!wasOpen) setShowSnippetsPicker(true);
                }}
                className={`flex items-center gap-2 px-2 py-1 rounded-[--radius-sm] transition-all duration-[--duration-fast] ${showSnippetsPicker ? 'bg-[--surface-overlay] text-[--text-primary]' : 'bg-transparent text-[--text-secondary] hover:bg-[--surface-raised] hover:text-[--text-primary]'}`}
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
