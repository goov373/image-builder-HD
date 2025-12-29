import { useState, useEffect } from 'react';

/**
 * Export Panel
 * Project & frame selection with export options
 */
const ExportPanel = ({ 
  onClose, 
  isOpen, 
  carousels = [], 
  eblasts = [], 
  videoCovers = [], 
  singleImages = [],
  projectType = 'carousel'
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [format, setFormat] = useState('png');
  const [resolution, setResolution] = useState('2x');
  const [background, setBackground] = useState('original');
  const [customBgColor, setCustomBgColor] = useState('#000000');
  const [selectedItems, setSelectedItems] = useState({});
  const [expandedRows, setExpandedRows] = useState({});
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Combine all projects into a unified list
  const allProjects = [
    ...carousels.map(c => ({ ...c, type: 'carousel', items: c.frames, itemLabel: 'Frame' })),
    ...eblasts.map(e => ({ ...e, type: 'eblast', items: e.sections || [], itemLabel: 'Section' })),
    ...videoCovers.map(v => ({ ...v, type: 'videoCover', items: v.frames || [], itemLabel: 'Cover' })),
    ...singleImages.map(s => ({ ...s, type: 'singleImage', items: s.layers || [], itemLabel: 'Layer' })),
  ];

  // Get currently selected project
  const selectedProject = allProjects.find(p => p.id === selectedProjectId && p.type === getProjectTypeFromId(selectedProjectId));
  
  function getProjectTypeFromId(id) {
    if (carousels.find(c => c.id === id)) return 'carousel';
    if (eblasts.find(e => e.id === id)) return 'eblast';
    if (videoCovers.find(v => v.id === id)) return 'videoCover';
    if (singleImages.find(s => s.id === id)) return 'singleImage';
    return null;
  }

  // Auto-select first project if none selected
  useEffect(() => {
    if (!selectedProjectId && allProjects.length > 0) {
      setSelectedProjectId(allProjects[0].id);
    }
  }, [allProjects.length, selectedProjectId]);

  // Reset selections when project changes
  useEffect(() => {
    setSelectedItems({});
    setExpandedRows({});
  }, [selectedProjectId]);

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

  // Get items for selected project
  const projectItems = selectedProject?.items || [];
  const itemLabel = selectedProject?.itemLabel || 'Frame';

  // Count total selected items
  const getSelectedCount = () => {
    return Object.values(selectedItems).filter(Boolean).length;
  };

  // Toggle individual item
  const toggleItem = (itemId) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Select all items in current project
  const selectAll = () => {
    const newSelection = {};
    projectItems.forEach(item => {
      newSelection[item.id] = true;
    });
    setSelectedItems(newSelection);
  };

  // Deselect all
  const deselectAll = () => {
    setSelectedItems({});
  };

  // Handle export
  const handleExport = async () => {
    if (selectedCount === 0) return;
    
    setIsExporting(true);
    setExportSuccess(false);
    
    // Simulate export process
    // In a real implementation, this would:
    // 1. Capture each selected frame as an image
    // 2. Apply resolution scaling
    // 3. Apply background settings
    // 4. Convert to selected format
    // 5. Trigger download or zip multiple files
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock success - in real implementation, trigger actual download
      console.log('Exporting:', {
        project: selectedProject?.name,
        items: Object.keys(selectedItems).filter(id => selectedItems[id]),
        format,
        resolution,
        background: background === 'custom' ? customBgColor : background
      });
      
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const selectedCount = getSelectedCount();
  const totalItems = projectItems.length;
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
          
          {/* Project Selection */}
          <div>
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Select Project</h3>
            <select
              value={selectedProjectId || ''}
              onChange={(e) => setSelectedProjectId(Number(e.target.value))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white hover:border-orange-500 focus:border-orange-500 focus:outline-none transition-colors cursor-pointer"
            >
              {allProjects.length === 0 ? (
                <option value="">No projects available</option>
              ) : (
                allProjects.map(project => (
                  <option key={`${project.type}-${project.id}`} value={project.id}>
                    {project.name} ({project.type})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Frame/Item Selection */}
          {selectedProject && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Select {itemLabel}s</h3>
                <div className="flex gap-2">
                  <button type="button" onClick={selectAll} className="text-[10px] text-orange-400 hover:text-orange-300">All</button>
                  <span className="text-gray-600">|</span>
                  <button type="button" onClick={deselectAll} className="text-[10px] text-gray-500 hover:text-gray-400">None</button>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 p-3">
                {projectItems.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-2">No {itemLabel.toLowerCase()}s in this project</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {projectItems.map((item, index) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={`px-3 py-1.5 rounded text-[11px] font-medium transition-colors ${
                          selectedItems[item.id]
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                        }`}
                      >
                        {itemLabel} {index + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-[10px] text-gray-500 mt-1.5">{selectedCount} of {totalItems} {itemLabel.toLowerCase()}s selected</p>
            </div>
          )}

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
        {exportSuccess && (
          <div className="mb-3 px-3 py-2 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-xs text-green-400">Export complete!</span>
          </div>
        )}
        <button
          type="button"
          onClick={handleExport}
          disabled={selectedCount === 0 || isExporting}
          className={`w-full py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            selectedCount > 0 && !isExporting
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          {isExporting ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Exporting...</span>
            </>
          ) : selectedCount > 0 ? (
            `Export ${selectedCount} ${itemLabel}${selectedCount > 1 ? 's' : ''}`
          ) : (
            `Select ${itemLabel.toLowerCase()}s to export`
          )}
        </button>
      </div>
    </div>
  );
};

export default ExportPanel;


