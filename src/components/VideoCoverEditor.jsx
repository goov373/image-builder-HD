import React from 'react';
import VideoCoverFrame from './VideoCoverFrame';
import { frameSizes } from '../data';

/**
 * Video Cover Editor Component
 * Single frame editor for video thumbnails
 */
const VideoCoverEditor = ({
  videoCover,
  designSystem,
  isSelected,
  onSelect,
  onUpdateText,
  onTogglePlayButton,
  onUpdateEpisodeNumber,
  onChangeFrameSize,
  activeTextField,
  onActivateTextField,
  // Layer handlers
  onUpdateImage,
  onRemoveImage,
}) => {
  const currentSize = frameSizes[videoCover.frameSize] || frameSizes.youtube;

  // Get available video sizes
  const videoSizes = Object.entries(frameSizes)
    .filter(([_, size]) => size.category === 'videoCover')
    .map(([key, size]) => ({ key, ...size }));

  return (
    <div
      data-videocover-id={videoCover.id}
      className={`mb-10 rounded-xl transition-all duration-150 p-6 ${
        isSelected ? 'bg-gray-800/40 border border-gray-600' : 'hover:bg-gray-800/30 border border-transparent'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(videoCover.id);
      }}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(isSelected ? null : videoCover.id);
            }}
            className={`w-11 h-11 rounded-xl border-2 flex items-center justify-center transition-all duration-150 ${
              isSelected
                ? 'border-gray-500 bg-gray-700 hover:bg-gray-600'
                : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800'
            }`}
          >
            {isSelected ? (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-lg font-bold transition-colors ${isSelected ? 'text-white' : 'text-white'}`}>
                {videoCover.name}
              </h2>
              {isSelected && (
                <span className="text-[9px] bg-gray-600 text-gray-300 px-1.5 py-0.5 rounded font-medium">EDITING</span>
              )}
            </div>
            <p className="text-sm text-gray-400">{videoCover.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Size Selector (when selected) */}
      {isSelected && (
        <div className="mb-6 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500 mr-2">Size:</span>
          {videoSizes.map((size) => (
            <button
              key={size.key}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChangeFrameSize?.(videoCover.id, size.key);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                videoCover.frameSize === size.key
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {size.name}
            </button>
          ))}
        </div>
      )}

      {/* Overlay Controls (when selected) */}
      {isSelected && (
        <div className="mb-6 flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={videoCover.showPlayButton}
              onChange={(e) => {
                e.stopPropagation();
                onTogglePlayButton?.(videoCover.id);
              }}
              className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-gray-400 focus:ring-gray-500 focus:ring-offset-gray-900"
            />
            <span className="text-xs text-gray-400">Show play button</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Episode:</span>
            <input
              type="text"
              value={videoCover.episodeNumber || ''}
              onChange={(e) => {
                e.stopPropagation();
                onUpdateEpisodeNumber?.(videoCover.id, e.target.value);
              }}
              onClick={(e) => e.stopPropagation()}
              placeholder="Ep. 01"
              className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
            />
          </div>
        </div>
      )}

      {/* Video Cover Frame */}
      <div className="flex justify-center">
        <VideoCoverFrame
          videoCover={videoCover}
          designSystem={designSystem}
          isSelected={isSelected}
          onSelect={() => onSelect?.(videoCover.id)}
          onUpdateText={onUpdateText}
          activeTextField={activeTextField}
          onActivateTextField={onActivateTextField}
          onUpdateImage={onUpdateImage}
          onRemoveImage={onRemoveImage}
        />
      </div>
    </div>
  );
};

export default VideoCoverEditor;
