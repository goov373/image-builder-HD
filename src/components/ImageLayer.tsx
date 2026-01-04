import { useState, useRef, useEffect, useCallback, CSSProperties, MouseEvent as ReactMouseEvent } from 'react';

// Types
export type ImageFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';

export interface ImageLayerData {
  src: string;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  rotation: number;
  fit: ImageFit;
}

export interface OverflowImage {
  src: string;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  rotation: number;
}

export interface ImageLayerProps {
  imageLayer: ImageLayerData;
  frameWidth: number;
  frameHeight: number;
  isFrameSelected: boolean;
  onUpdate: (updates: Partial<ImageLayerData>) => void;
  onRemove?: () => void;
  /** Edit mode trigger from parent (e.g., clicking the Image tag) */
  editTrigger?: number;
  /** Close trigger from parent (e.g., clicking Done/Cancel buttons) */
  closeTrigger?: number;
  /** Callback to notify parent of edit mode changes (for z-index management) */
  onEditModeChange?: (isEditing: boolean) => void;
  /** True if this is showing overflow from previous frame */
  isOverflowFromPrev?: boolean;
  /** True if this is showing overflow from next frame */
  isOverflowFromNext?: boolean;
  /** The overflow image data from adjacent frame */
  overflowImage?: OverflowImage | null;
}

interface DragPosition {
  x: number;
  y: number;
}

/**
 * ImageLayer Component
 * Renders an image layer within a frame with pan, zoom, and opacity controls
 *
 * Features:
 * - Double-click or click Image tag to enter edit mode
 * - Drag to pan image within frame
 * - Arrow keys to nudge, +/- to zoom
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
  editTrigger = 0,
  closeTrigger = 0,
  onEditModeChange,
  isOverflowFromPrev = false,
  isOverflowFromNext = false,
  overflowImage = null,
}: ImageLayerProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<DragPosition>({ x: 0, y: 0 });
  const [initialPos, setInitialPos] = useState<DragPosition>({ x: 0, y: 0 });

  // Track if this is the first render to skip initial mount notification
  // This prevents closing auto-opened tool panels when ImageLayer first mounts
  const isFirstRender = useRef(true);
  const prevEditTriggerRef = useRef(0);
  const prevCloseTriggerRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Notify parent when edit mode changes (skip initial mount)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // Skip notification on initial mount
    }
    onEditModeChange?.(isEditMode);
  }, [isEditMode, onEditModeChange]);

  // Enter edit mode when editTrigger increases (from parent clicking the tag)
  useEffect(() => {
    if (editTrigger > prevEditTriggerRef.current && isFrameSelected) {
      setIsEditMode(true);
    }
    prevEditTriggerRef.current = editTrigger;
  }, [editTrigger, isFrameSelected]);

  // Exit edit mode when closeTrigger increases (from parent clicking Done/Cancel)
  useEffect(() => {
    if (closeTrigger > prevCloseTriggerRef.current) {
      setIsEditMode(false);
    }
    prevCloseTriggerRef.current = closeTrigger;
  }, [closeTrigger]);

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
  const getTransformStyle = (useOverflowOffset = false): CSSProperties => {
    // x and y are percentages (-1 to 1), convert to pixel offset
    const effectiveX = useOverflowOffset ? getOverflowOffset() : x;
    const translateX = effectiveX * frameWidth * 0.5;
    const translateY = y * frameHeight * 0.5;

    const effectiveOpacity = isOverflowFromPrev || isOverflowFromNext ? overflowImage?.opacity || opacity : opacity;
    const effectiveScale = isOverflowFromPrev || isOverflowFromNext ? overflowImage?.scale || scale : scale;
    const effectiveRotation = isOverflowFromPrev || isOverflowFromNext ? overflowImage?.rotation || rotation : rotation;

    return {
      transform: `translate(${translateX}px, ${translateY}px) scale(${effectiveScale}) rotate(${effectiveRotation}deg)`,
      opacity: effectiveOpacity,
      objectFit: fit,
      objectPosition: 'center',
    };
  };

  // Handle double-click to enter edit mode
  const handleDoubleClick = (e: ReactMouseEvent) => {
    if (!isFrameSelected) return;
    e.stopPropagation();
    setIsEditMode(true);
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e: ReactMouseEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPos({ x, y });
  };

  // Handle mouse move for dragging
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      // Convert pixel delta to percentage (relative to frame size)
      const newX = Math.max(-1, Math.min(1, initialPos.x + deltaX / (frameWidth * 0.5)));
      const newY = Math.max(-1, Math.min(1, initialPos.y + deltaY / (frameHeight * 0.5)));

      onUpdate({ x: newX, y: newY });
    },
    [isDragging, dragStart, initialPos, frameWidth, frameHeight, onUpdate]
  );

  // Handle mouse up to stop dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle ESC key to exit edit mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    const handleClickOutside = (e: MouseEvent) => {
      // Don't close if clicking within the image layer container
      if (containerRef.current && containerRef.current.contains(e.target as Node)) {
        return;
      }
      // Don't close if clicking on the edit controls (which are outside this component)
      if ((e.target as HTMLElement).closest('[data-image-edit-controls]')) {
        return;
      }
      if (isEditMode) {
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
        src={isOverflowFromPrev || isOverflowFromNext ? overflowImage?.src : src}
        alt=""
        className={`absolute w-full h-full select-none ${
          isEditMode ? 'cursor-move' : 'cursor-pointer pointer-events-auto'
        } ${isOverflowFromPrev || isOverflowFromNext ? 'pointer-events-none' : ''}`}
        style={getTransformStyle(isOverflowFromPrev || isOverflowFromNext)}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
        draggable={false}
      />

      {/* Edit Mode Overlay - Border indicator */}
      {isEditMode && (
        <div className="absolute inset-0 border-2 border-dashed border-blue-400 pointer-events-none z-30" />
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
