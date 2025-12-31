import { useRef } from 'react';

/**
 * ImageUploader Component
 * Condensed drag-and-drop and click-to-browse image upload functionality
 */
const ImageUploader = ({
  onUpload,
  onDrop,
  isUploading,
  uploadProgress,
  compressionPreset,
  onPresetChange,
  currentCount,
  maxCount = 50,
}) => {
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-gray-500');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('border-gray-500');
  };

  const handleDropEvent = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-gray-500');
    onDrop?.(e);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Upload Images</h3>
        <span className="text-[10px] text-gray-500">{currentCount}/{maxCount}</span>
      </div>
      
      {/* Quality Preset Selector */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] text-gray-500">Quality:</span>
        <select
          value={compressionPreset}
          onChange={(e) => onPresetChange(e.target.value)}
          className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-[10px] text-white focus:outline-none focus:border-gray-600"
        >
          <option value="highQuality">High (2K) - Best for hero images</option>
          <option value="standard">Standard (1080p) - Web/social</option>
          <option value="optimized">Optimized (720p) - Fastest loading</option>
        </select>
      </div>
      
      {/* Drop Zone - Condensed style */}
      <div 
        className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-gray-600 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDropEvent}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onUpload}
          className="hidden"
        />
        
        {isUploading ? (
          <div className="py-2">
            <div className="w-8 h-8 mx-auto mb-2 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin" />
            <p className="text-xs text-gray-400 mb-1">
              {uploadProgress.fileName}
            </p>
            <p className="text-[10px] text-gray-500">
              {uploadProgress.current}/{uploadProgress.total} files
            </p>
          </div>
        ) : (
          <>
            <svg className="w-8 h-8 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs text-gray-400 mb-1">Drop images here</p>
            <button 
              type="button" 
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-xs text-white rounded-lg transition-colors"
            >
              Browse files
            </button>
            <p className="text-[10px] text-gray-600 mt-2">JPG, PNG, WebP up to 10MB each</p>
          </>
        )}
      </div>
      <p className="text-[10px] text-gray-500 mt-3 flex items-center justify-center gap-1.5">
        <span className="text-green-400">✓</span>
        <span>Auto-compressed to WebP for fast loading</span>
      </p>
    </div>
  );
};

export default ImageUploader;
