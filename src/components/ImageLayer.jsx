import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * ImageLayer Component
 * Renders an image layer within a frame with pan, zoom, and opacity controls
 * 
 * Features:
 * - Double-click to enter edit mode
 * - Drag to pan image within frame
 * - Mouse wheel to zoom in/out
 * - ESC or click outside to exit edit mode
 * - Cross-frame continuity when image extends beyond frame edges
 */
const ImageLayer = ({
  imageLayer,
  frameWidth,
  frameHeight,
  isFrameSelected,
  onUpdate,
  onRemove,
  // Edit mode trigger from parent (e.g., clicking the Image tag)
  editTrigger = 0,
  // Callback to notify parent of edit mode changes (for z-index management)
  onEditModeChange,
  // Cross-frame props (for future seamless image transitions)
  isOverflowFromPrev = false, // True if this is showing overflow from previous frame
  isOverflowFromNext = false, // True if this is showing overflow from next frame
  overflowImage = null,       // The overflow image data from adjacent frame
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Notify parent when edit mode changes
  useEffect(() => {
    onEditModeChange?.(isEditMode);
  }, [isEditMode, onEditModeChange]);
  
  // Enter edit mode when editTrigger changes (from parent clicking the tag)
  useEffect(() => {
    if (editTrigger > 0 && isFrameSelected) {
      setIsEditMode(true);
    }
  }, [editTrigger, isFrameSelected]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  const { src, x, y, scale, opacity, rotation, fit } = imageLayer;
  
  // Calculate overflow amount (how much of image shows on adjacent frame)
  const getOverflowOffset = () => {
    if (isOverflowFromPrev && overflowImage) {
      // This frame is showing overflow from previous frame
      // The image's right edge should appear at our left edge
      const prevX = overflowImage.x;
      const adjustedX = prevX + 2; // Shift right by 2 frame widths
      return adjustedX;
    }
    if (isOverflowFromNext && overflowImage) {
      // This frame is showing overflow from next frame
      // The image's left edge should appear at our right edge
      const nextX = overflowImage.x;
      const adjustedX = nextX - 2; // Shift left by 2 frame widths
      return adjustedX;
    }
    return x;
  };

  // Calculate transform style
  const getTransformStyle = (useOverflowOffset = false) => {
    // x and y are percentages (-1 to 1), convert to pixel offset
    const effectiveX = useOverflowOffset ? getOverflowOffset() : x;
    const translateX = effectiveX * frameWidth * 0.5;
    const translateY = y * frameHeight * 0.5;
    
    const effectiveOpacity = (isOverflowFromPrev || isOverflowFromNext) ? (overflowImage?.opacity || opacity) : opacity;
    const effectiveScale = (isOverflowFromPrev || isOverflowFromNext) ? (overflowImage?.scale || scale) : scale;
    const effectiveRotation = (isOverflowFromPrev || isOverflowFromNext) ? (overflowImage?.rotation || rotation) : rotation;
    
    return {
      transform: `translate(${translateX}px, ${translateY}px) scale(${effectiveScale}) rotate(${effectiveRotation}deg)`,
      opacity: effectiveOpacity,
      objectFit: fit,
      objectPosition: 'center',
    };
  };

  // Handle double-click to enter edit mode
  const handleDoubleClick = (e) => {
    if (!isFrameSelected) return;
    e.stopPropagation();
    setIsEditMode(true);
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPos({ x, y });
  };

  // Handle mouse move for dragging
  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    // Convert pixel delta to percentage (relative to frame size)
    const newX = Math.max(-1, Math.min(1, initialPos.x + (deltaX / (frameWidth * 0.5))));
    const newY = Math.max(-1, Math.min(1, initialPos.y + (deltaY / (frameHeight * 0.5))));
    
    onUpdate({ x: newX, y: newY });
  }, [isDragging, dragStart, initialPos, frameWidth, frameHeight, onUpdate]);

  // Handle mouse up to stop dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle mouse wheel for zoom
  const handleWheel = (e) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.5, Math.min(5, scale + delta));
    onUpdate({ scale: newScale });
  };

  // Handle ESC key to exit edit mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isEditMode) {
        setIsEditMode(false);
      }
      // Arrow keys for nudging
      if (isEditMode) {
        const nudgeAmount = e.shiftKey ? 0.1 : 0.02;
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            onUpdate({ x: Math.max(-1, x - nudgeAmount) });
            break;
          case 'ArrowRight':
            e.preventDefault();
            onUpdate({ x: Math.min(1, x + nudgeAmount) });
            break;
          case 'ArrowUp':
            e.preventDefault();
            onUpdate({ y: Math.max(-1, y - nudgeAmount) });
            break;
          case 'ArrowDown':
            e.preventDefault();
            onUpdate({ y: Math.min(1, y + nudgeAmount) });
            break;
          case '+':
          case '=':
            e.preventDefault();
            onUpdate({ scale: Math.min(5, scale + 0.1) });
            break;
          case '-':
            e.preventDefault();
            onUpdate({ scale: Math.max(0.5, scale - 0.1) });
            break;
          case '0':
            e.preventDefault();
            onUpdate({ x: 0, y: 0, scale: 1 });
            break;
          case 'Delete':
          case 'Backspace':
            if (isEditMode) {
              e.preventDefault();
              onRemove?.();
            }
            break;
        }
      }
    };

    if (isEditMode) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isEditMode, x, y, scale, onUpdate, onRemove]);

  // Global mouse events for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Click outside to exit edit mode
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isEditMode && containerRef.current && !containerRef.current.contains(e.target)) {
        setIsEditMode(false);
      }
    };

    if (isEditMode) {
      // Delay to prevent immediate close
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditMode]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${isEditMode ? 'z-50' : ''}`}
      style={{ pointerEvents: isEditMode ? 'auto' : 'none' }}
    >
      {/* Image - Main or Overflow */}
      <img
        ref={imageRef}
        src={(isOverflowFromPrev || isOverflowFromNext) ? overflowImage?.src : src}
        alt=""
        className={`absolute w-full h-full select-none ${
          isEditMode ? 'cursor-move' : 'cursor-pointer pointer-events-auto'
        } ${(isOverflowFromPrev || isOverflowFromNext) ? 'pointer-events-none' : ''}`}
        style={getTransformStyle(isOverflowFromPrev || isOverflowFromNext)}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        draggable={false}
      />

      {/* Edit Mode Overlay */}
      {isEditMode && (
        <>
          {/* Border indicator */}
          <div className="absolute inset-0 border-2 border-dashed border-blue-400 pointer-events-none z-30" />
          
          {/* Edit Controls */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 z-40">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-black/80 rounded-lg px-2 py-1.5">
              <button
                type="button"
                onClick={() => onUpdate({ scale: Math.max(0.5, scale - 0.1) })}
                className="w-6 h-6 flex items-center justify-center text-white hover:bg-white/20 rounded"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="text-white text-xs font-medium min-w-[40px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => onUpdate({ scale: Math.min(5, scale + 0.1) })}
                className="w-6 h-6 flex items-center justify-center text-white hover:bg-white/20 rounded"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {/* Opacity Control */}
            <div className="flex items-center gap-1.5 bg-black/80 rounded-lg px-2 py-1.5">
              <svg className="w-3.5 h-3.5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                type="range"
                min="0"
                max="100"
                value={opacity * 100}
                onChange={(e) => onUpdate({ opacity: parseInt(e.target.value) / 100 })}
                className="w-16 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
              />
              <span className="text-white/60 text-[10px] min-w-[28px]">
                {Math.round(opacity * 100)}%
              </span>
            </div>

            {/* Reset Button */}
            <button
              type="button"
              onClick={() => onUpdate({ x: 0, y: 0, scale: 1, opacity: 1 })}
              className="bg-black/80 rounded-lg px-2 py-1.5 text-white/60 hover:text-white text-xs transition-colors"
              title="Reset position"
            >
              Reset
            </button>

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => { setIsEditMode(false); onRemove?.(); }}
              className="bg-black/80 hover:bg-red-600 rounded-lg px-2 py-1.5 text-white/60 hover:text-white transition-colors"
              title="Remove image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          {/* Instructions */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/80 rounded-lg px-4 py-1.5 z-40 max-w-[95%]">
            <p className="text-white text-[10px] text-center leading-relaxed">
              Drag to move • Scroll to zoom • ESC to finish
            </p>
          </div>
        </>
      )}

      {/* Hover indicator when not in edit mode */}
      {!isEditMode && isFrameSelected && (
        <div 
          className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors pointer-events-auto cursor-pointer flex items-center justify-center opacity-0 hover:opacity-100"
          onDoubleClick={handleDoubleClick}
        >
          <div className="bg-black/70 rounded-lg px-3 py-2">
            <p className="text-white text-xs">Double-click to edit</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageLayer;

