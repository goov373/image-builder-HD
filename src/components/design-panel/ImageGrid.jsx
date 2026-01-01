import { memo } from 'react';
import { formatFileSize } from '../../utils';

/**
 * ImageGrid Component
 * Displays uploaded images in a grid with metadata and actions
 * Memoized to prevent re-renders when parent state changes
 */
const ImageGrid = memo(function ImageGrid({
  images,
  isLoading,
  onRemove,
  emptyMessage = 'No images uploaded yet',
  emptySubtext = 'Upload images to use in your designs',
}) {
  if (isLoading) {
    return (
      <div className="p-4">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Your Images</h3>
        {/* Skeleton grid for loading state */}
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
              {/* Skeleton header */}
              <div className="px-2 py-1.5 bg-gray-900 border-b border-gray-700 flex items-center">
                <div className="h-4 w-10 bg-gray-700 rounded" />
              </div>
              {/* Skeleton image */}
              <div className="aspect-square bg-gray-700" />
              {/* Skeleton footer */}
              <div className="px-2 py-2 bg-gray-900 border-t border-gray-700">
                <div className="h-3 w-3/4 bg-gray-700 rounded mb-1.5" />
                <div className="h-2 w-1/3 bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="p-4">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Your Images</h3>
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-xs text-gray-500">{emptyMessage}</p>
          <p className="text-[10px] text-gray-600 mt-1">{emptySubtext}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Your Images</h3>
      <div className="grid grid-cols-2 gap-3">
        {images.map((file) => (
          <ImageCard key={file.id} file={file} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
});

/**
 * ImageCard Component
 * Individual image display card with header/footer metadata
 * Memoized to prevent re-renders when sibling cards change
 */
const ImageCard = memo(function ImageCard({ file, onRemove }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-gray-400 transition-all">
      {/* Header bar */}
      <div className="flex items-center justify-between px-2 py-1.5 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 bg-gray-700 rounded text-[10px] text-gray-300 uppercase font-medium">
            {file.format}
          </span>
          {file.isPersisted && (
            <svg
              className="w-3.5 h-3.5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              title="Saved to cloud"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
              />
            </svg>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(file.id);
          }}
          className="p-1.5 hover:bg-red-500 rounded transition-colors group"
        >
          <svg
            className="w-3 h-3 text-gray-500 group-hover:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Image */}
      <div className="aspect-square">
        <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
      </div>

      {/* Footer bar */}
      <div className="px-2 py-2 bg-gray-900 border-t border-gray-700">
        <p className="text-[11px] text-gray-300 truncate font-medium" title={file.name}>
          {file.name}
        </p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-gray-500">{formatFileSize(file.size)}</span>
          {file.savings > 0 && <span className="text-[10px] text-green-400 font-medium">-{file.savings}%</span>}
        </div>
      </div>
    </div>
  );
});

export { ImageCard };
export default ImageGrid;
