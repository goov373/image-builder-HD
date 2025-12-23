import { useState } from 'react';

/**
 * Export Panel
 * Frame selection and export options
 */
const ExportPanel = ({ onClose, isOpen, carousels = [] }) => {
  const [format, setFormat] = useState('png');
  const [resolution, setResolution] = useState('2x');
  const [background, setBackground] = useState('original');
  const [customBgColor, setCustomBgColor] = useState('#000000');
  const [selectedItems, setSelectedItems] = useState({});
  const [expandedRows, setExpandedRows] = useState({});

  const formats = [
    { id: 'png', name: 'PNG', supportsTransparent: true },
    { id: 'jpg', name: 'JPG', supportsTransparent: false },
    { id: 'webp', name: 'WebP', supportsTransparent: true },
    { id: 'svg', name: 'SVG', supportsTransparent: true },
    { id: 'pdf', name: 'PDF', supportsTransparent: false },
    { id: 'pptx', name: 'PPTX', supportsTransparent: false },
  ];

  const resolutions = [
    { id: '1x', name: '1x', desc: 'Standard' },
    { id: '2x', name: '2x', desc: 'High DPI' },
    { id: '3x', name: '3x', desc: 'Ultra' },
  ];

  const backgroundOptions = [
    { id: 'original', name: 'Original', desc: 'Keep background' },
    { id: 'transparent', name: 'Transparent', desc: 'PNG/WebP only' },
    { id: 'custom', name: 'Custom Color', desc: 'Solid fill' },
  ];

  // Count total selected frames
  const getSelectedCount = () => {
    let count = 0;
    Object.values(selectedItems).forEach(row => {
      if (typeof row === 'object') {
        count += Object.values(row).filter(Boolean).length;
      }
    });
    return count;
  };

  // Toggle entire row selection
  const toggleRow = (carouselId, frameCount) => {
    const currentRow = selectedItems[carouselId] || {};
    const allSelected = Object.keys(currentRow).length === frameCount && Object.values(currentRow).every(Boolean);
    
    if (allSelected) {
      setSelectedItems(prev => ({ ...prev, [carouselId]: {} }));
    } else {
      const newSelection = {};
      for (let i = 1; i <= frameCount; i++) {
        newSelection[i] = true;
      }
      setSelectedItems(prev => ({ ...prev, [carouselId]: newSelection }));
    }
  };

  // Toggle individual frame
  const toggleFrame = (carouselId, frameId) => {
    setSelectedItems(prev => ({
      ...prev,
      [carouselId]: {
        ...(prev[carouselId] || {}),
        [frameId]: !(prev[carouselId]?.[frameId])
      }
    }));
  };

  // Check if row is fully selected
  const isRowFullySelected = (carouselId, frameCount) => {
    const row = selectedItems[carouselId] || {};
    return Object.keys(row).length === frameCount && Object.values(row).every(Boolean);
  };

  // Check if row is partially selected
  const isRowPartiallySelected = (carouselId) => {
    const row = selectedItems[carouselId] || {};
    const selectedCount = Object.values(row).filter(Boolean).length;
    return selectedCount > 0;
  };

  // Select all frames
  const selectAll = () => {
    const newSelection = {};
    carousels.forEach(carousel => {
      newSelection[carousel.id] = {};
      carousel.frames.forEach(frame => {
        newSelection[carousel.id][frame.id] = true;
      });
    });
    setSelectedItems(newSelection);
  };

  // Deselect all
  const deselectAll = () => {
    setSelectedItems({});
  };

  const selectedCount = getSelectedCount();
  const totalFrames = carousels.reduce((acc, c) => acc + c.frames.length, 0);
  const supportsTransparent = formats.find(f => f.id === format)?.supportsTransparent;

  return (
    <div 
      className={`fixed top-[56px] h-[calc(100%-56px)] w-72 bg-gray-900 border-r border-gray-800 z-40 flex flex-col ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      style={{ left: isOpen ? 64 : -224, transition: 'left 0.3s ease-out' }}
    >
      {/* Fixed Header */}
      <div className="flex-shrink-0 px-4 border-b border-gray-800 flex items-center justify-between" style={{ height: 64 }}>
        <h2 className="text-sm font-semibold text-white">Export</h2>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="p-4 space-y-5">
          
          {/* Selection Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Select Frames</h3>
              <div className="flex gap-2">
                <button type="button" onClick={selectAll} className="text-[10px] text-orange-400 hover:text-orange-300">All</button>
                <span className="text-gray-600">|</span>
                <button type="button" onClick={deselectAll} className="text-[10px] text-gray-500 hover:text-gray-400">None</button>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 max-h-48 overflow-y-auto">
              {carousels.map((carousel) => (
                <div key={carousel.id} className="border-b border-gray-700/50 last:border-b-0">
                  <div 
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-700/30 cursor-pointer"
                    onClick={() => setExpandedRows(prev => ({ ...prev, [carousel.id]: !prev[carousel.id] }))}
                  >
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggleRow(carousel.id, carousel.frames.length); }}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        isRowFullySelected(carousel.id, carousel.frames.length)
                          ? 'bg-orange-500 border-orange-500'
                          : isRowPartiallySelected(carousel.id)
                          ? 'bg-orange-500/50 border-orange-500'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      {(isRowFullySelected(carousel.id, carousel.frames.length) || isRowPartiallySelected(carousel.id)) && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <span className="text-xs text-white flex-1 truncate">{carousel.name}</span>
                    <span className="text-[10px] text-gray-500">{carousel.frames.length} frames</span>
                    <svg className={`w-3 h-3 text-gray-500 transition-transform ${expandedRows[carousel.id] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {expandedRows[carousel.id] && (
                    <div className="bg-gray-800/30 px-3 py-1.5">
                      <div className="flex flex-wrap gap-1.5">
                        {carousel.frames.map((frame) => (
                          <button
                            type="button"
                            key={frame.id}
                            onClick={() => toggleFrame(carousel.id, frame.id)}
                            className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                              selectedItems[carousel.id]?.[frame.id]
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                            }`}
                          >
                            Frame {frame.id}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 mt-1.5">{selectedCount} of {totalFrames} frames selected</p>
          </div>

          {/* Format Section */}
          <div>
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Format</h3>
            <div className="grid grid-cols-3 gap-1.5">
              {formats.map(f => (
                <button
                  type="button"
                  key={f.id}
                  onClick={() => {
                    setFormat(f.id);
                    if (!f.supportsTransparent && background === 'transparent') {
                      setBackground('original');
                    }
                  }}
                  className={`px-2 py-2 rounded text-xs font-medium transition-colors ${
                    format === f.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* Resolution Section */}
          <div>
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Resolution</h3>
            <div className="grid grid-cols-3 gap-1.5">
              {resolutions.map(r => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setResolution(r.id)}
                  className={`px-2 py-2 rounded text-center transition-colors ${
                    resolution === r.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <div className="text-xs font-medium">{r.name}</div>
                  <div className="text-[9px] opacity-70">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Background Section */}
          <div>
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Background</h3>
            <div className="space-y-1.5">
              {backgroundOptions.map(bg => (
                <button
                  type="button"
                  key={bg.id}
                  onClick={() => bg.id !== 'transparent' || supportsTransparent ? setBackground(bg.id) : null}
                  disabled={bg.id === 'transparent' && !supportsTransparent}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded text-left transition-colors ${
                    background === bg.id
                      ? 'bg-orange-500/20 border border-orange-500/50'
                      : bg.id === 'transparent' && !supportsTransparent
                      ? 'bg-gray-800/50 border border-gray-700/50 opacity-40 cursor-not-allowed'
                      : 'bg-gray-800 border border-gray-700/50 hover:bg-gray-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    background === bg.id ? 'border-orange-500' : 'border-gray-600'
                  }`}>
                    {background === bg.id && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-white">{bg.name}</div>
                    <div className="text-[10px] text-gray-500">{bg.desc}</div>
                  </div>
                  {bg.id === 'custom' && background === 'custom' && (
                    <input
                      type="color"
                      value={customBgColor}
                      onChange={(e) => setCustomBgColor(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-6 h-6 rounded cursor-pointer"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Fixed Footer - Export Button */}
      <div className="flex-shrink-0 p-4 border-t border-gray-800 bg-gray-900">
        <button
          type="button"
          disabled={selectedCount === 0}
          className={`w-full py-3 rounded-lg text-sm font-medium transition-colors ${
            selectedCount > 0
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          {selectedCount > 0 ? `Export ${selectedCount} Frame${selectedCount > 1 ? 's' : ''}` : 'Select frames to export'}
        </button>
      </div>
    </div>
  );
};

export default ExportPanel;


