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
        <h3 className="text-xs font-medium text-tertiary uppercase tracking-wide">Add Images</h3>
        <span className="text-[10px] text-gray-500">
          {currentCount}/{maxCount}
        </span>
      </div>

      {/* Quality Preset Selector */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] text-gray-500">Quality:</span>
        <select
          value={compressionPreset}
          onChange={(e) => onPresetChange(e.target.value)}
          className="flex-1 bg-surface-raised border border-default rounded px-2 py-1 text-[10px] text-white focus:outline-none focus:border-emphasis"
        >
          <option value="highQuality">High (2K) - Best for hero images</option>
          <option value="standard">Standard (1080p) - Web/social</option>
          <option value="optimized">Optimized (720p) - Fastest loading</option>
        </select>
      </div>

      <p className="text-[10px] text-gray-500 mb-3 flex items-center justify-center gap-1.5">
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Auto-compressed to WebP for fast loading</span>
      </p>

      {/* Drop Zone - Condensed style */}
      <div
        className="border-2 border-dashed border-default rounded-lg p-4 text-center hover:border-emphasis transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDropEvent}
      >
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={onUpload} className="hidden" />

        {isUploading ? (
          <div className="py-2">
            <div className="w-8 h-8 mx-auto mb-2 border-2 border-emphasis border-t-white rounded-full animate-spin" />
            <p className="text-xs text-gray-300 mb-1 font-medium">Compressing...</p>
            <p className="text-[10px] text-tertiary truncate max-w-[180px] mx-auto">{uploadProgress.fileName}</p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <div className="h-1 w-20 bg-surface-overlay rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-300"
                  style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-500 tabular-nums">
                {uploadProgress.current}/{uploadProgress.total}
              </span>
            </div>
          </div>
        ) : (
          <>
            <svg className="w-8 h-8 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs text-tertiary mb-1">Drop images here</p>
            <button
              type="button"
              className="px-3 py-1.5 bg-surface-overlay hover:bg-gray-600 text-xs text-white rounded-lg transition-colors"
            >
              Browse files
            </button>
            <p className="text-[10px] text-gray-600 mt-2">JPG, PNG, WebP up to 10MB each</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
