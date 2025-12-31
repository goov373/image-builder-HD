/**
 * ProductImageLayer Component
 * Renders a product image as a floating layer above all frame content
 * 
 * Features:
 * - Positioned using x, y coordinates (0-1 range)
 * - Width is a percentage of frame width
 * - Sits at z-index 20 (above text which is at z-10)
 * - Self-contained div that can be repositioned
 */
const ProductImageLayer = ({
  productImageLayer,
  frameWidth,
  frameHeight,
  isEditing = false,
}) => {
  if (!productImageLayer) return null;
  
  const { src, x, y, width, opacity } = productImageLayer;
  
  // Calculate pixel dimensions
  const imageWidth = frameWidth * width;
  // Maintain aspect ratio - use a standard landscape ratio (16:9-ish)
  const imageHeight = imageWidth * 0.6;
  
  // Calculate position (x, y are center points in 0-1 range)
  const left = (x * frameWidth) - (imageWidth / 2);
  const top = (y * frameHeight) - (imageHeight / 2);
  
  return (
    <div 
      className={`absolute pointer-events-none ${isEditing ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-transparent' : ''}`}
      style={{
        left: Math.max(0, left),
        top: Math.max(0, top),
        width: imageWidth,
        height: imageHeight,
        opacity: opacity || 1,
        zIndex: 20, // Above text (z-10), below UI controls
      }}
    >
      <img 
        src={src} 
        alt="Product" 
        className="w-full h-full object-contain drop-shadow-lg"
        draggable={false}
      />
    </div>
  );
};

export default ProductImageLayer;

