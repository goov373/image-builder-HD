/**
 * Image Compression Utility
 * Optimizes images for web/social media while maintaining crispness
 * 
 * Features:
 * - Smart resizing to max dimensions
 * - WebP conversion with JPEG fallback
 * - Quality optimization for crisp output
 * - Maintains aspect ratio
 */

// Compression presets for different use cases
export const COMPRESSION_PRESETS = {
  // High quality for hero images, product shots
  highQuality: {
    maxWidth: 2048,
    maxHeight: 2048,
    quality: 0.92,
    format: 'webp',
    name: 'High Quality (2K)',
  },
  // Standard for most web/social use
  standard: {
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 0.88,
    format: 'webp',
    name: 'Standard (1080p)',
  },
  // Optimized for faster loading
  optimized: {
    maxWidth: 1280,
    maxHeight: 1280,
    quality: 0.82,
    format: 'webp',
    name: 'Optimized (720p)',
  },
  // Thumbnail/preview
  thumbnail: {
    maxWidth: 400,
    maxHeight: 400,
    quality: 0.75,
    format: 'webp',
    name: 'Thumbnail',
  },
};

/**
 * Check if browser supports WebP
 */
export const supportsWebP = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

/**
 * Load an image from a File object
 */
const loadImage = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Calculate new dimensions while maintaining aspect ratio
 */
const calculateDimensions = (width, height, maxWidth, maxHeight) => {
  let newWidth = width;
  let newHeight = height;

  // Only resize if larger than max dimensions
  if (width > maxWidth || height > maxHeight) {
    const aspectRatio = width / height;
    
    if (width > height) {
      newWidth = Math.min(width, maxWidth);
      newHeight = Math.round(newWidth / aspectRatio);
    } else {
      newHeight = Math.min(height, maxHeight);
      newWidth = Math.round(newHeight * aspectRatio);
    }
    
    // Ensure we don't exceed either dimension
    if (newWidth > maxWidth) {
      newWidth = maxWidth;
      newHeight = Math.round(newWidth / aspectRatio);
    }
    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = Math.round(newHeight * aspectRatio);
    }
  }

  return { width: newWidth, height: newHeight };
};

/**
 * Compress a single image file
 * 
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<{blob: Blob, info: Object}>} - Compressed blob and metadata
 */
export const compressImage = async (file, options = {}) => {
  const preset = options.preset || COMPRESSION_PRESETS.highQuality;
  const {
    maxWidth = preset.maxWidth,
    maxHeight = preset.maxHeight,
    quality = preset.quality,
    format = preset.format,
  } = options;

  // Load the image
  const img = await loadImage(file);
  const originalWidth = img.width;
  const originalHeight = img.height;

  // Calculate new dimensions
  const { width: newWidth, height: newHeight } = calculateDimensions(
    originalWidth,
    originalHeight,
    maxWidth,
    maxHeight
  );

  // Create canvas and draw resized image
  const canvas = document.createElement('canvas');
  canvas.width = newWidth;
  canvas.height = newHeight;
  
  const ctx = canvas.getContext('2d');
  
  // Enable high-quality image smoothing for crisp output
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  // Draw the image
  ctx.drawImage(img, 0, 0, newWidth, newHeight);

  // Determine output format
  let mimeType = 'image/webp';
  let extension = 'webp';
  
  if (format === 'webp' && !supportsWebP()) {
    mimeType = 'image/jpeg';
    extension = 'jpg';
  } else if (format === 'jpeg' || format === 'jpg') {
    mimeType = 'image/jpeg';
    extension = 'jpg';
  } else if (format === 'png') {
    mimeType = 'image/png';
    extension = 'png';
  }

  // Convert to blob
  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, mimeType, quality);
  });

  // Clean up
  URL.revokeObjectURL(img.src);

  // Generate new filename
  const originalName = file.name.replace(/\.[^/.]+$/, '');
  const newName = `${originalName}.${extension}`;

  // Calculate compression stats
  const originalSize = file.size;
  const compressedSize = blob.size;
  const savings = Math.round((1 - compressedSize / originalSize) * 100);

  return {
    blob,
    file: new File([blob], newName, { type: mimeType }),
    info: {
      originalName: file.name,
      newName,
      originalSize,
      compressedSize,
      savings: Math.max(0, savings), // Don't show negative savings
      originalDimensions: { width: originalWidth, height: originalHeight },
      newDimensions: { width: newWidth, height: newHeight },
      format: extension,
      quality,
    },
  };
};

/**
 * Compress multiple images with progress callback
 * 
 * @param {FileList|File[]} files - Array of image files
 * @param {Object} options - Compression options
 * @param {Function} onProgress - Progress callback (current, total, currentFile)
 * @returns {Promise<Array>} - Array of compressed results
 */
export const compressImages = async (files, options = {}, onProgress = null) => {
  const fileArray = Array.from(files);
  const results = [];
  
  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i];
    
    // Skip non-image files
    if (!file.type.startsWith('image/')) {
      continue;
    }
    
    try {
      if (onProgress) {
        onProgress(i, fileArray.length, file.name);
      }
      
      const result = await compressImage(file, options);
      results.push(result);
    } catch (error) {
      console.error(`Failed to compress ${file.name}:`, error);
      // Include original file on error
      results.push({
        file,
        blob: file,
        info: {
          originalName: file.name,
          newName: file.name,
          originalSize: file.size,
          compressedSize: file.size,
          savings: 0,
          error: error.message,
        },
      });
    }
  }
  
  if (onProgress) {
    onProgress(fileArray.length, fileArray.length, 'Complete');
  }
  
  return results;
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Get total size of files
 */
export const getTotalSize = (files) => {
  return Array.from(files).reduce((total, file) => total + (file.size || file.compressedSize || 0), 0);
};

export default {
  compressImage,
  compressImages,
  formatFileSize,
  getTotalSize,
  supportsWebP,
  COMPRESSION_PRESETS,
};

