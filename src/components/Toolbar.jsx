import React, { useState, useRef, useEffect } from 'react';
import { frameSizes, layoutNames, layoutVariantNames, getFrameStyle } from '../data';

// Nunito Sans font weight options
const FONT_WEIGHTS = [
  { name: 'ExtraLight', value: '200', weight: 200 },
  { name: 'Light', value: '300', weight: 300 },
  { name: 'Regular', value: '400', weight: 400 },
  { name: 'Medium', value: '500', weight: 500 },
  { name: 'SemiBold', value: '600', weight: 600 },
  { name: 'Bold', value: '700', weight: 700 },
  { name: 'ExtraBold', value: '800', weight: 800 },
  { name: 'Black', value: '900', weight: 900 },
];
import { smoothCarouselBackgrounds } from '../utils';
import { 
  useDesignSystemContext, 
  useSelectionContext, 
  useCarouselsContext,
  useDropdownsContext 
} from '../context';

export default function Toolbar({ totalOffset, activeTab }) {
  // Get state from context
  const { designSystem } = useDesignSystemContext();
  const selection = useSelectionContext();
  const carouselsCtx = useCarouselsContext();
  const dropdowns = useDropdownsContext();

  const {
    selectedCarouselId,
    selectedFrameId,
    selectedCarousel,
    selectedFrame,
    activeTextField,
    handleDeselect,
  } = selection;

  const {
    carousels,
    handleSetVariant,
    handleSetLayout,
    handleShuffleLayoutVariant,
    handleUpdateFormatting,
    handleChangeFrameSize,
    handleSmoothBackgrounds,
  } = carouselsCtx;

  const {
    showFormatPicker, setShowFormatPicker,
    showLayoutPicker, setShowLayoutPicker,
    showSnippetsPicker, setShowSnippetsPicker,
    showFontPicker, setShowFontPicker,
    showFontSize, setShowFontSize,
    showColorPicker, setShowColorPicker,
    showUnderlinePicker, setShowUnderlinePicker,
    showTextAlign, setShowTextAlign,
    showLineSpacing, setShowLineSpacing,
    showLetterSpacing, setShowLetterSpacing,
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

  // Smooth backgrounds state
  const [showSmoothPicker, setShowSmoothPicker] = useState(false);
  const [smoothIntensity, setSmoothIntensity] = useState(2); // 1=Light(25%), 2=Medium(50%), 3=Strong(75%), 4=Full(100%)
  const [smoothDirection, setSmoothDirection] = useState('horizontal'); // horizontal, vertical, radial, diagonal
  const [originalBackgrounds, setOriginalBackgrounds] = useState(null); // Store originals for cancel
  const [previewApplied, setPreviewApplied] = useState(false);
  const smoothPickerRef = useRef(null);

  const SMOOTH_NOTCHES = [
    { step: 1, label: 'Light', value: 25 },
    { step: 2, label: 'Medium', value: 50 },
    { step: 3, label: 'Strong', value: 75 },
    { step: 4, label: 'Full', value: 100 },
  ];

  const SMOOTH_DIRECTIONS = [
    { id: 'diagonal', label: 'Diagonal', icon: '↘' },
    { id: 'diagonal-mirror', label: 'Mirror', icon: '↙' },
  ];

  const currentNotch = SMOOTH_NOTCHES.find(n => n.step === smoothIntensity) || SMOOTH_NOTCHES[1];
  const currentDirection = SMOOTH_DIRECTIONS.find(d => d.id === smoothDirection) || SMOOTH_DIRECTIONS[0];

  // Get backgrounds for frames (using originals if we have them, for proper preview)
  const getBackgroundForFrame = (frame, useOriginal = false) => {
    if (useOriginal && originalBackgrounds) {
      return originalBackgrounds[frame.id] || frame.backgroundOverride || getFrameStyle(selectedCarousel?.id, frame.style, designSystem).background;
    }
    if (frame.backgroundOverride) return frame.backgroundOverride;
    const style = getFrameStyle(selectedCarousel?.id, frame.style, designSystem);
    return style.background;
  };

  // Store original backgrounds when opening picker
  const openSmoothPicker = () => {
    if (!selectedCarousel) return;
    
    // Store current backgrounds
    const originals = {};
    selectedCarousel.frames?.forEach(frame => {
      originals[frame.id] = getBackgroundForFrame(frame);
    });
    setOriginalBackgrounds(originals);
    setPreviewApplied(false);
    setShowSmoothPicker(true);
  };

  // Apply preview (temporary)
  const applyPreview = (notchStep, direction = smoothDirection) => {
    if (!selectedCarousel || !originalBackgrounds) return;
    
    const notch = SMOOTH_NOTCHES.find(n => n.step === notchStep);
    if (!notch) return;
    
    console.log('Smooth Preview:', notch.label, `(${notch.value}%)`, 'Direction:', direction);
    
    // Calculate smoothed backgrounds from originals
    const smoothedFrames = smoothCarouselBackgrounds(
      selectedCarousel.frames,
      (frame) => originalBackgrounds[frame.id],
      { intensity: notch.value / 100, direction }
    );
    
    if (smoothedFrames.length > 0) {
      handleSmoothBackgrounds(selectedCarousel.id, smoothedFrames);
      setPreviewApplied(true);
    }
  };

  // Revert to original backgrounds
  const revertToOriginal = () => {
    if (!selectedCarousel || !originalBackgrounds || !previewApplied) return;
    
    console.log('Smooth: Reverting to original');
    const revertFrames = selectedCarousel.frames?.map(frame => ({
      id: frame.id,
      background: originalBackgrounds[frame.id]
    }));
    
    if (revertFrames?.length > 0) {
      handleSmoothBackgrounds(selectedCarousel.id, revertFrames);
    }
  };

  // Reset all backgrounds to defaults (clear all backgroundOverride)
  const resetAllBackgrounds = () => {
    if (!selectedCarousel) return;
    
    console.log('Smooth: Resetting all backgrounds to defaults');
    const resetFrames = selectedCarousel.frames?.map(frame => ({
      id: frame.id,
      background: null // null will be handled by reducer to clear backgroundOverride
    }));
    
    if (resetFrames?.length > 0) {
      handleSmoothBackgrounds(selectedCarousel.id, resetFrames);
    }
    closeSmoothPicker(false);
  };

  // Close picker and revert if not saved
  const closeSmoothPicker = (save = false) => {
    if (!save && previewApplied) {
      revertToOriginal();
    }
    setShowSmoothPicker(false);
    setOriginalBackgrounds(null);
    setPreviewApplied(false);
  };

  // Handle slider change
  const handleSliderChange = (newStep) => {
    setSmoothIntensity(newStep);
    applyPreview(newStep, smoothDirection);
  };

  // Handle direction change
  const handleDirectionChange = (newDirection) => {
    setSmoothDirection(newDirection);
    applyPreview(smoothIntensity, newDirection);
  };

  // Close smooth picker on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (smoothPickerRef.current && !smoothPickerRef.current.contains(e.target)) {
        closeSmoothPicker(false); // Revert on outside click
      }
    };
    if (showSmoothPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSmoothPicker, previewApplied, originalBackgrounds]);

  if (!activeTab?.hasContent) return null;

  return (
    <div className="fixed z-[100] bg-gray-900 border-b border-gray-800 px-5 overflow-visible flex items-center" style={{ top: 56, left: totalOffset, right: 0, height: 64, transition: 'left 0.3s ease-out' }}>
      <div className="flex items-center justify-between text-sm text-gray-400 w-full">
        <div className="flex items-center gap-3">
          
          {/* Frame Group */}
          <div className={`flex items-center gap-2 px-2 py-1.5 bg-gray-800/60 rounded-xl transition-opacity ${selectedCarouselId ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            {/* Format dropdown */}
            <div ref={formatPickerRef} className="relative">
              <button onClick={() => { const wasOpen = showFormatPicker; closeAllDropdowns(); if (!wasOpen) setShowFormatPicker(true); }} className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all border ${showFormatPicker ? 'bg-gray-700 border-gray-500' : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700 hover:border-gray-600'}`}>
                <span className="text-xs font-medium text-gray-300">Format</span>
                <span className="text-[11px] text-gray-500">{frameSizes[selectedCarousel?.frameSize]?.name || 'Portrait'}</span>
                <svg className={`w-3 h-3 text-gray-500 transition-transform ${showFormatPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showFormatPicker && (
                <div className="absolute top-full left-0 mt-2 p-1.5 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-[200] min-w-[180px] overflow-hidden">
                  {Object.entries(frameSizes).filter(([key]) => key !== 'landscape').map(([key, size]) => (
                    <button key={key} onClick={() => { handleChangeFrameSize(selectedCarouselId, key); setShowFormatPicker(false); }} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-all ${selectedCarousel?.frameSize === key ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'}`}>
                      <span className="font-medium">{size.name}</span>
                      <span className="text-gray-600">{size.ratio}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Smooth Backgrounds Dropdown */}
            <div ref={smoothPickerRef} className="relative">
              <button
                onClick={() => showSmoothPicker ? closeSmoothPicker(false) : openSmoothPicker()}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                  showSmoothPicker ? 'bg-gray-700 border-gray-500 text-white' : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600'
                }`}
                title="Smooth background transitions between frames"
              >
                <span>Smooth</span>
                <svg className={`w-2.5 h-2.5 text-gray-500 transition-transform ${showSmoothPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showSmoothPicker && (
                <div className="absolute top-full left-0 mt-2 p-3 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-[200] min-w-[220px]">
                  
                  {/* Intensity Section */}
                  <div className="mb-4">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-2">Intensity</div>
                    <div className="flex gap-1.5">
                      {SMOOTH_NOTCHES.map((notch) => (
                        <button
                          key={notch.step}
                          onClick={() => handleSliderChange(notch.step)}
                          className={`flex-1 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                            smoothIntensity === notch.step
                              ? 'bg-gray-700 border-gray-500 text-white'
                              : 'bg-gray-800/50 border-gray-700 text-gray-500 hover:bg-gray-800 hover:border-gray-600 hover:text-gray-300'
                          }`}
                        >
                          {notch.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Direction Section */}
                  <div className="mb-4">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-2">Direction</div>
                    <div className="flex gap-1.5">
                      {SMOOTH_DIRECTIONS.map((dir) => (
                        <button
                          key={dir.id}
                          onClick={() => handleDirectionChange(dir.id)}
                          className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                            smoothDirection === dir.id
                              ? 'bg-gray-700 border-gray-500 text-white'
                              : 'bg-gray-800/50 border-gray-700 text-gray-500 hover:bg-gray-800 hover:border-gray-600 hover:text-gray-300'
                          }`}
                        >
                          <span className="text-sm">{dir.icon}</span>
                          <span>{dir.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Preview indicator */}
                  {previewApplied && (
                    <div className="flex items-center gap-1.5 mb-3 text-[10px] text-gray-400">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" />
                      <span>Preview active</span>
                    </div>
                  )}
                  
                  {/* Reset button */}
                  <button
                    onClick={resetAllBackgrounds}
                    className="w-full mb-3 py-1.5 text-gray-500 text-[11px] font-medium rounded-lg border border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/50 hover:text-gray-300 transition-all"
                  >
                    Reset to defaults
                  </button>
                  
                  {/* Action buttons */}
                  <div className="flex gap-1.5 pt-3 border-t border-gray-800">
                    <button
                      onClick={() => closeSmoothPicker(false)}
                      className="flex-1 py-1.5 text-gray-500 text-[11px] font-medium rounded-lg border border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/50 hover:text-gray-300 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => closeSmoothPicker(true)}
                      className="flex-1 py-1.5 bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-gray-500 text-white text-[11px] font-medium rounded-lg transition-all"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Layout Group */}
          <div className={`flex items-center gap-1.5 px-2 py-1.5 bg-gray-800/60 rounded-xl transition-opacity ${selectedFrame ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <div ref={layoutPickerRef} className="relative">
              <button onClick={() => { const wasOpen = showLayoutPicker; closeAllDropdowns(); if (!wasOpen) setShowLayoutPicker(true); }} className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all border ${showLayoutPicker ? 'bg-gray-700 border-gray-500' : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700 hover:border-gray-600'}`}>
                <span className="text-xs font-medium text-gray-300">Layout</span>
                <span className="text-[11px] text-gray-500 w-[85px] text-left">{(() => {
                  const layoutIdx = selectedFrame?.currentLayout || 0;
                  const variantIdx = selectedFrame?.layoutVariant || 0;
                  const variantName = layoutVariantNames[layoutIdx]?.[variantIdx] || '';
                  const baseName = layoutNames[layoutIdx] || 'Stack';
                  const typeWord = baseName.split(' ').pop();
                  return `${variantName} ${typeWord}`;
                })()}</span>
                <svg className={`w-3 h-3 text-gray-500 transition-transform ${showLayoutPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showLayoutPicker && (
                <div className="absolute top-full left-0 mt-2 p-1.5 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-[200] min-w-[160px]">
                  {layoutNames.map((name, idx) => (
                    <button key={idx} onClick={() => { handleSetLayout(selectedCarouselId, selectedFrameId, idx); setShowLayoutPicker(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition-all ${(selectedFrame?.currentLayout || 0) === idx ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'}`}>
                      {idx === 0 && <div className={`w-4 h-5 rounded flex items-end p-0.5 ${(selectedFrame?.currentLayout || 0) === idx ? 'bg-gray-600' : 'bg-gray-700'}`}><div className={`w-full h-1 rounded-sm ${(selectedFrame?.currentLayout || 0) === idx ? 'bg-white' : 'bg-gray-500'}`} /></div>}
                      {idx === 1 && <div className={`w-4 h-5 rounded flex items-center justify-center ${(selectedFrame?.currentLayout || 0) === idx ? 'bg-gray-600' : 'bg-gray-700'}`}><div className={`w-2 h-2 rounded-sm ${(selectedFrame?.currentLayout || 0) === idx ? 'bg-white' : 'bg-gray-500'}`} /></div>}
                      {idx === 2 && <div className={`w-4 h-5 rounded flex flex-col justify-between p-0.5 ${(selectedFrame?.currentLayout || 0) === idx ? 'bg-gray-600' : 'bg-gray-700'}`}><div className={`w-2 h-1 rounded-sm ${(selectedFrame?.currentLayout || 0) === idx ? 'bg-white' : 'bg-gray-500'}`} /><div className="w-1.5 h-1 bg-gray-600 rounded-sm self-end" /></div>}
                      <span className="font-medium">{name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => { closeAllDropdowns(); selectedFrame && handleShuffleLayoutVariant(selectedCarouselId, selectedFrameId); }} className="p-2 rounded-lg border border-transparent hover:bg-gray-700 hover:border-gray-600 text-gray-500 hover:text-gray-300 transition-all" title="Shuffle variant">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
            </button>
          </div>

          {/* Snippets Group */}
          <div className={`flex items-center gap-1.5 px-2 py-1.5 bg-gray-800/60 rounded-xl transition-opacity ${activeTextField ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <div ref={snippetsPickerRef} className="relative">
              <button onClick={() => { const wasOpen = showSnippetsPicker; closeAllDropdowns(); if (!wasOpen) setShowSnippetsPicker(true); }} className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all border ${showSnippetsPicker ? 'bg-gray-700 border-gray-500' : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700 hover:border-gray-600'}`}>
                <span className="text-xs font-medium text-gray-300">Snippets</span>
                <span className="text-[11px] text-gray-400 font-medium">S{(selectedFrame?.currentVariant || 0) + 1}</span>
                <svg className={`w-3 h-3 text-gray-500 transition-transform ${showSnippetsPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showSnippetsPicker && (
                <div className="absolute top-full left-0 mt-2 p-1.5 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-[200] min-w-[90px]">
                  {[0, 1, 2].map((idx) => (
                    <button key={idx} onClick={() => { handleSetVariant(selectedCarouselId, selectedFrameId, idx); setShowSnippetsPicker(false); }} className={`w-full flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${selectedFrame?.currentVariant === idx ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'}`}>
                      <span>S{idx + 1}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="p-2 rounded-lg border border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-700 hover:border-gray-600 transition-all" title="Rewrite with AI">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" /></svg>
            </button>
          </div>
          
          {/* Typography Group */}
          <div className={`flex items-center gap-1.5 px-2 py-1.5 bg-gray-800/60 rounded-xl transition-opacity ${activeTextField ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            {/* Font Weight dropdown */}
            <div ref={fontPickerRef} className="relative">
              <button onClick={() => { if (!activeTextField) return; const wasOpen = showFontPicker; closeAllDropdowns(); if (!wasOpen) setShowFontPicker(true); }} className="flex items-center gap-1.5 px-3 py-2 bg-gray-700/50 rounded-lg text-xs font-medium text-gray-300 hover:bg-gray-700 transition-colors">
                <span>Font</span>
                <svg className={`w-2.5 h-2.5 transition-transform ${showFontPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showFontPicker && activeTextField && (
                <div className="absolute top-full left-0 mt-2 p-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200] max-h-64 overflow-y-auto min-w-[180px]" onClick={(e) => e.stopPropagation()}>
                  <div className="px-2 py-1.5 text-[10px] text-gray-500 uppercase tracking-wide border-b border-gray-700 mb-1">Nunito Sans</div>
                  {FONT_WEIGHTS.map(weight => {
                    const isHeadingDefault = weight.value === (designSystem?.headingWeight || '700');
                    const isBodyDefault = weight.value === (designSystem?.bodyWeight || '400');
                    const currentWeight = selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.fontWeight;
                    const isSelected = currentWeight === weight.value;
                    
                    return (
                      <button 
                        type="button" 
                        key={weight.value} 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'fontWeight', weight.value); 
                          setShowFontPicker(false); 
                        }} 
                        className={`w-full px-3 py-2 rounded-lg text-xs text-left transition-colors flex items-center justify-between ${isSelected ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} 
                        style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: weight.weight }}
                      >
                        <span>{weight.name}</span>
                        <span className="flex items-center gap-1">
                          {isHeadingDefault && (
                            <span className={`text-[10px] ${isSelected ? 'text-orange-200' : 'text-orange-400'}`} title="Default for Headings">★H</span>
                          )}
                          {isBodyDefault && (
                            <span className={`text-[10px] ${isSelected ? 'text-orange-200' : 'text-orange-400'}`} title="Default for Body">★B</span>
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
              <button onClick={() => { if (!activeTextField) return; const wasOpen = showFontSize; closeAllDropdowns(); if (!wasOpen) setShowFontSize(true); }} className="flex items-center gap-1.5 px-3 py-2 bg-gray-700/50 rounded-lg text-xs font-medium text-gray-300 hover:bg-gray-700 transition-colors">
                <span>Size</span>
                <svg className={`w-2.5 h-2.5 transition-transform ${showFontSize ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showFontSize && activeTextField && (
                <div className="absolute top-full left-0 mt-2 p-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200]" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-1">
                    {[{ name: 'S', value: 0.85 }, { name: 'M', value: 1 }, { name: 'L', value: 1.2 }].map(s => (
                      <button type="button" key={s.name} onClick={(e) => { e.stopPropagation(); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'fontSize', s.value); setShowFontSize(false); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.fontSize === s.value ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>{s.name}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          
            {/* Color picker */}
            <div ref={colorPickerRef} className="relative">
              <button onClick={() => { if (!activeTextField) return; const wasOpen = showColorPicker; closeAllDropdowns(); if (!wasOpen) setShowColorPicker(true); }} className="flex items-center gap-1 p-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors" title="Text color">
                <div className="w-5 h-5 rounded border border-gray-500" style={{ backgroundColor: (() => {
                  const explicitColor = selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.color;
                  if (explicitColor) return explicitColor;
                  if (activeTextField === 'headline' && selectedFrame) {
                    const frameStyle = getFrameStyle(selectedCarouselId, selectedFrame.style, designSystem);
                    return frameStyle.text || '#ffffff';
                  }
                  return '#e5e7eb';
                })() }} />
              </button>
              {showColorPicker && activeTextField && (
                <div className="absolute top-full left-0 mt-2 p-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200]" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-1.5">
                    {[{ name: 'Primary', value: designSystem.primary }, { name: 'Secondary', value: designSystem.secondary }, { name: 'Accent', value: designSystem.accent }, { name: 'Light', value: designSystem.neutral3 }, { name: 'White', value: '#ffffff' }].map(c => (
                      <button type="button" key={c.value} onClick={(e) => { e.stopPropagation(); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'color', c.value); setShowColorPicker(false); }} className="w-6 h-6 rounded-lg border border-gray-600 hover:scale-110 transition-transform" style={{ backgroundColor: c.value }} title={c.name} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
            
          {/* Style Group */}
          <div className={`flex items-center gap-1 px-2 py-1.5 bg-gray-800/60 rounded-xl transition-opacity ${activeTextField ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            {/* Bold */}
            <button onClick={() => { 
              if (!activeTextField) return; 
              closeAllDropdowns(); 
              const formatting = selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField] || {}; 
              // Determine current weight - check fontWeight first, then default based on field type
              const defaultWeight = activeTextField === 'headline' ? '700' : '400';
              const currentWeight = formatting.fontWeight || defaultWeight;
              // Toggle between bold (700) and regular (400)
              const newWeight = currentWeight === '700' ? '400' : '700';
              handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'fontWeight', newWeight); 
            }} className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
              (() => {
                const formatting = selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField] || {};
                const defaultWeight = activeTextField === 'headline' ? '700' : '400';
                const currentWeight = formatting.fontWeight || defaultWeight;
                const isBold = currentWeight === '700';
                return isBold ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700';
              })()
            }`} title="Bold">B</button>
            
            {/* Italic */}
            <button onClick={() => { if (!activeTextField) return; closeAllDropdowns(); const formatting = selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField] || {}; handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'italic', !formatting.italic); }} className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm italic transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.italic ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title="Italic">I</button>
            
            {/* Underline */}
            <div ref={underlineRef} className="relative flex">
              <button onClick={() => { if (!activeTextField) return; const wasOpen = showUnderlinePicker; closeAllDropdowns(); if (!wasOpen) setShowUnderlinePicker(true); }} className={`flex items-center gap-1 px-2 h-9 rounded-lg text-sm transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.underline ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title="Underline">
                <span style={{ textDecoration: 'underline' }}>U</span>
                <svg className={`w-2.5 h-2.5 transition-transform ${showUnderlinePicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showUnderlinePicker && activeTextField && (
                <div className="absolute top-full right-0 mt-2 p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200] min-w-[160px]" onClick={(e) => e.stopPropagation()}>
                  <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-wide font-medium">Style</div>
                  <div className="flex gap-1.5 mb-3">
                    {[{ name: 'Solid', value: 'solid' }, { name: 'Dotted', value: 'dotted' }, { name: 'Wavy', value: 'wavy' }, { name: 'Highlight', value: 'highlight' }].map(s => (
                      <button type="button" key={s.value} onClick={(e) => { e.stopPropagation(); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'underlineStyle', s.value); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'underline', true); }} className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.underlineStyle === s.value ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title={s.name}>
                        {s.value === 'solid' && <span style={{ textDecoration: 'underline', textDecorationStyle: 'solid' }}>S</span>}
                        {s.value === 'dotted' && <span style={{ textDecoration: 'underline', textDecorationStyle: 'dotted' }}>D</span>}
                        {s.value === 'wavy' && <span style={{ textDecoration: 'underline', textDecorationStyle: 'wavy' }}>W</span>}
                        {s.value === 'highlight' && <span style={{ backgroundImage: 'linear-gradient(to top, rgba(251,191,36,0.5) 30%, transparent 30%)' }}>H</span>}
                      </button>
                    ))}
                  </div>
                  <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-wide font-medium">Color</div>
                  <div className="flex gap-2">
                    {[{ name: 'Primary', value: designSystem.primary }, { name: 'Secondary', value: designSystem.secondary }, { name: 'Accent', value: designSystem.accent }, { name: 'Light', value: designSystem.neutral3 }, { name: 'White', value: '#ffffff' }].map(c => (
                      <button type="button" key={c.value} onClick={(e) => { e.stopPropagation(); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'underlineColor', c.value); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'underline', true); if (!selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.underlineStyle) handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'underlineStyle', 'solid'); }} className={`w-6 h-6 rounded-lg border-2 hover:scale-110 transition-transform ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.underlineColor === c.value ? 'border-orange-500' : 'border-gray-600'}`} style={{ backgroundColor: c.value }} title={c.name} />
                    ))}
                  </div>
                  <button type="button" onClick={(e) => { e.stopPropagation(); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'underline', false); setShowUnderlinePicker(false); }} className="w-full mt-3 px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-gray-700 transition-colors border border-gray-700">Remove Underline</button>
                </div>
              )}
            </div>
          </div>

          {/* Alignment & Spacing Group */}
          <div className={`flex items-center gap-1 px-2 py-1.5 bg-gray-800/60 rounded-xl transition-opacity ${activeTextField ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            {/* Text Alignment */}
            <div ref={textAlignRef} className="relative">
              <button onClick={() => { if (!activeTextField) return; const wasOpen = showTextAlign; closeAllDropdowns(); if (!wasOpen) setShowTextAlign(true); }} className={`flex items-center gap-1 px-2 h-9 rounded-lg transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.textAlign && selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.textAlign !== 'left' ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title="Text alignment">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" /></svg>
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showTextAlign && activeTextField && (
                <div className="absolute top-full left-0 mt-2 p-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200]" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-1">
                    {[{ name: 'Left', value: 'left', icon: 'M4 6h16M4 12h10M4 18h16' }, { name: 'Center', value: 'center', icon: 'M4 6h16M7 12h10M4 18h16' }, { name: 'Right', value: 'right', icon: 'M4 6h16M10 12h10M4 18h16' }, { name: 'Justify', value: 'justify', icon: 'M4 6h16M4 12h16M4 18h16' }].map(a => (
                      <button type="button" key={a.value} onClick={(e) => { e.stopPropagation(); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'textAlign', a.value); setShowTextAlign(false); }} className={`p-2 rounded-lg transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.textAlign === a.value ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title={a.name}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={a.icon} /></svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          
            {/* Line Spacing */}
            <div ref={lineSpacingRef} className="relative">
              <button onClick={() => { if (!activeTextField) return; const wasOpen = showLineSpacing; closeAllDropdowns(); if (!wasOpen) setShowLineSpacing(true); }} className={`flex items-center gap-1 px-2 h-9 rounded-lg transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.lineHeight && selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.lineHeight !== 1.4 ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title="Line spacing">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 3v18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showLineSpacing && activeTextField && (
                <div className="absolute top-full left-0 mt-2 p-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200] min-w-[110px]" onClick={(e) => e.stopPropagation()}>
                  {[{ name: 'Tight', value: 1.1 }, { name: 'Normal', value: 1.4 }, { name: 'Relaxed', value: 1.7 }, { name: 'Loose', value: 2 }].map(s => (
                    <button type="button" key={s.name} onClick={(e) => { e.stopPropagation(); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'lineHeight', s.value); setShowLineSpacing(false); }} className={`w-full px-3 py-2 rounded-lg text-xs text-left transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.lineHeight === s.value ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>{s.name}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Letter Spacing */}
            <div ref={letterSpacingRef} className="relative">
              <button onClick={() => { if (!activeTextField) return; const wasOpen = showLetterSpacing; closeAllDropdowns(); if (!wasOpen) setShowLetterSpacing(true); }} className={`flex items-center gap-1 px-2 h-9 rounded-lg transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.letterSpacing && selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.letterSpacing !== 0 ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title="Letter spacing">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 12h18M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showLetterSpacing && activeTextField && (
                <div className="absolute top-full left-0 mt-2 p-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200] min-w-[110px]" onClick={(e) => e.stopPropagation()}>
                  {[{ name: 'Tight', value: -0.5 }, { name: 'Normal', value: 0 }, { name: 'Wide', value: 1 }, { name: 'Wider', value: 2 }].map(s => (
                    <button type="button" key={s.name} onClick={(e) => { e.stopPropagation(); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'letterSpacing', s.value); setShowLetterSpacing(false); }} className={`w-full px-3 py-2 rounded-lg text-xs text-left transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.letterSpacing === s.value ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>{s.name}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Row <span className="text-white font-medium">{selectedCarouselId ? carousels.findIndex(c => c.id === selectedCarouselId) + 1 : '-'}</span> / {carousels.length}</span>
          <button onClick={() => { closeAllDropdowns(); handleDeselect(); }} disabled={!selectedCarouselId && !selectedFrameId} className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${selectedCarouselId || selectedFrameId ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}>Deselect Row</button>
        </div>
      </div>
    </div>
  );
}
