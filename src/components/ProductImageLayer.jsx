import { useState, useEffect, useRef } from 'react';

/**
 * ProductImageLayer Component
 * Renders a product image that fills the available space between UI elements
 * 
 * Features:
 * - Uses top/bottom positioning to fill available space
 * - Adapts bottom margin based on text content length
 * - Draggable when frame is selected
 * - Progress bar zone: 0-12% from top
 * - Sits at z-index 20 (above text which is at z-10)
 */
const ProductImageLayer = ({
  productImageLayer,
  frameWidth,
  frameHeight,
  isEditing = false,
  position = 'top', // 'top' = product above text, 'bottom' = product below text
  textContent = null, // { headline, subhead } for calculating text height
  isRowSelected = false, // Show faint dotted border when row is selected
  isFrameSelected = false, // Show solid border when frame is selected
  isSelected = false, // When this layer is actively selected (clicked)
  onUpdateLayer = null, // Callback to update layer properties
  onDragStateChange = null, // Callback when dragging starts/stops
  onClick = null, // Callback when clicked (to open tool panel)
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  
  if (!productImageLayer) return null;
  
  const { src, scale = 1, borderRadius = 8, offsetX = 0, offsetY = 0 } = productImageLayer;
  
  // Handle mouse down to start dragging
  const handleMouseDown = (e) => {
    if (!isFrameSelected) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragOffset({ x: offsetX, y: offsetY });
    onDragStateChange?.(true);
  };
  
  // Handle mouse move while dragging
  useEffect(() => {
    if (!isDragging) return;
    
    const handleMouseMove = (e) => {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      // Update in real-time via callback
      if (onUpdateLayer) {
        onUpdateLayer({
          offsetX: dragOffset.x + deltaX,
          offsetY: dragOffset.y + deltaY,
        });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      onDragStateChange?.(false);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, dragOffset, onUpdateLayer]);
  const pos = productImageLayer.position || position;
  
  // Horizontal padding (matches text blocks - about 7.5% on each side)
  const horizontalPadding = frameWidth * 0.075;
  
  // Estimate text height based on content length
  // Balanced estimation for product image sizing
  const estimateTextHeight = () => {
    if (!textContent) return 0.50; // Default reserve
    
    const headlineLength = textContent.headline?.length || 0;
    const subheadLength = textContent.subhead?.length || 0;
    
    // Balanced estimate: ~17 chars per line for headlines, ~27 for body
    const headlineLines = Math.ceil(headlineLength / 17) || 1;
    const subheadLines = Math.ceil(subheadLength / 27) || 1;
    const totalLines = headlineLines + subheadLines;
    
    // Each line needs ~6% of frame height, plus base padding of 18%
    const textReserve = 0.18 + (totalLines * 0.06);
    
    // Clamp between 42% and 65%
    return Math.min(0.65, Math.max(0.42, textReserve));
  };
  
  const textReserve = estimateTextHeight();
  
  // Define zones based on position
  const zoneStyle = pos === 'top' 
    ? {
        top: frameHeight * 0.12,  // Below progress bar
        bottom: frameHeight * textReserve, // Above text area (adaptive)
      }
    : {
        top: frameHeight * textReserve,  // Below text area (adaptive)
        bottom: frameHeight * 0.08, // Above bottom edge
      };
  
  // Determine border style based on selection state
  // When selected (clicked), show solid orange like text fields
  // When frame selected but not this layer, show dashed
  // Always use the user's borderRadius for live preview of corner rounding
  const getBorderStyle = () => {
    if (isSelected) {
      return {
        border: '2px solid rgb(249, 115, 22)', // Solid orange when selected
        borderRadius: `${borderRadius}px`, // Use user's borderRadius for live preview
      };
    }
    if (isFrameSelected) {
      return {
        border: '1px dashed rgba(249, 115, 22, 0.4)', // Dashed when frame selected but not this layer
        borderRadius: `${borderRadius}px`, // Use user's borderRadius for live preview
      };
    }
    // No border when only row is selected or nothing is selected
    return {
      borderRadius: `${borderRadius}px`,
    };
  };

  // Block all pointer events from bubbling when frame is selected
  const handleContainerMouseDown = (e) => {
    if (isFrameSelected) {
      e.stopPropagation();
    }
  };
  
  // Handle click to open tool panel
  // Only open tool panel if frame is already selected
  // This enforces a two-step selection: first select frame, then select layer
  const handleClick = (e) => {
    if (isFrameSelected) {
      e.stopPropagation();
      onClick?.();
    }
    // If frame not selected, let click bubble up to select the frame
  };

  return (
    <div 
      ref={containerRef}
      className="absolute cursor-pointer"
      style={{
        left: horizontalPadding,
        right: horizontalPadding,
        top: zoneStyle.top,
        bottom: zoneStyle.bottom,
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden', // Clip the scaled image to container bounds
        ...getBorderStyle(),
      }}
      onMouseDown={handleContainerMouseDown}
      onPointerDown={handleContainerMouseDown}
      onClick={handleClick}
    >
      <img 
        src={src} 
        alt="Product" 
        className={`max-w-full max-h-full object-contain drop-shadow-lg ${isFrameSelected ? 'cursor-grab' : ''} ${isDragging ? 'cursor-grabbing' : ''}`}
        style={{
          pointerEvents: isFrameSelected ? 'auto' : 'none',
          transform: `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`,
          transformOrigin: 'center center',
          userSelect: 'none',
        }}
        draggable={false}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

export default ProductImageLayer;
