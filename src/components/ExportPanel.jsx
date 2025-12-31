import { useState } from 'react';
import html2canvas from 'html2canvas';
import { exportPresets } from '../data/exportPresets';

/**
 * Export Panel
 * Muted grey card aesthetic matching project cards
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
  const [selectedProjectKey, setSelectedProjectKey] = useState('');
  const [format, setFormat] = useState('png');
  const [resolution, setResolution] = useState('2x');
  const [background, setBackground] = useState('original');
  const [customBgColor, setCustomBgColor] = useState('#000000');
  const [selectedItems, setSelectedItems] = useState({});
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);

  // Combine all projects into a unified list with unique keys
  const allProjects = [
    ...carousels.map(c => ({ ...c, type: 'carousel', items: c.frames || [], itemLabel: 'Frame', key: `carousel-${c.id}` })),
    ...eblasts.map(e => ({ ...e, type: 'eblast', items: e.sections || [], itemLabel: 'Section', key: `eblast-${e.id}` })),
    ...videoCovers.map(v => ({ ...v, type: 'videoCover', items: v.frames || [], itemLabel: 'Cover', key: `videoCover-${v.id}` })),
    ...singleImages.map(s => ({ ...s, type: 'singleImage', items: s.layers || [], itemLabel: 'Layer', key: `singleImage-${s.id}` })),
  ];

  // Get currently selected project
  const selectedProject = allProjects.find(p => p.key === selectedProjectKey);
  const projectItems = selectedProject?.items || [];
  const itemLabel = selectedProject?.itemLabel || 'Frame';

  // Auto-select first project if none selected
  if (!selectedProjectKey && allProjects.length > 0) {
    setSelectedProjectKey(allProjects[0].key);
  }

  // Handle project change - reset frame selection
  const handleProjectChange = (newKey) => {
    setSelectedProjectKey(newKey);
    setSelectedItems({});
    setIsProjectDropdownOpen(false);
  };

  // Get type icon based on project type
  const getTypeIcon = (type) => {
    switch (type) {
      case 'carousel':
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        );
      case 'eblast':
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'videoCover':
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'singleImage':
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

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

  // Count selected items in current project
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

  // Select all in current project
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

  // Apply preset settings
  const applyPreset = (preset) => {
    setSelectedPreset(preset.id);
    setFormat(preset.format);
    setResolution(preset.resolution);
    setBackground('original');
    // Select all items when applying a preset
    selectAll();
  };

  // Get resolution multiplier
  const getScale = () => {
    switch (resolution) {
      case '1x': return 1;
      case '2x': return 2;
      case '3x': return 3;
      default: return 2;
    }
  };

  // Get MIME type for format
  const getMimeType = () => {
    switch (format) {
      case 'png': return 'image/png';
      case 'jpg': return 'image/jpeg';
      case 'webp': return 'image/webp';
      default: return 'image/png';
    }
  };

  // Get file extension
  const getExtension = () => {
    switch (format) {
      case 'jpg': return 'jpg';
      case 'webp': return 'webp';
      case 'png': 
      default: return 'png';
    }
  };

  // Download a single file
  const downloadFile = (dataUrl, filename) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  // Handle export
  const handleExport = async () => {
    const count = getSelectedCount();
    if (count === 0 || !selectedProject) return;
    
    setIsExporting(true);
    setExportSuccess(false);
    
    try {
      const selectedItemIds = Object.keys(selectedItems).filter(id => selectedItems[id]);
      const scale = getScale();
      const mimeType = getMimeType();
      const extension = getExtension();
      
      const exportedFiles = [];
      
      for (let i = 0; i < selectedItemIds.length; i++) {
        const itemId = selectedItemIds[i];
        
        const frameElement = document.querySelector(
          `[data-frame-id="${itemId}"][data-project-key="${selectedProjectKey}"]`
        ) || document.querySelector(`[data-frame-id="${itemId}"]`);
        
        if (frameElement) {
          const canvas = await html2canvas(frameElement, {
            scale: scale,
            backgroundColor: background === 'transparent' ? null : 
                            background === 'custom' ? customBgColor : undefined,
            useCORS: true,
            allowTaint: true,
            logging: false,
          });
          
          const dataUrl = canvas.toDataURL(mimeType, 0.95);
          const filename = `${selectedProject.name.replace(/[^a-z0-9]/gi, '_')}_${itemLabel}_${i + 1}.${extension}`;
          
          exportedFiles.push({ dataUrl, filename });
        }
      }
      
      if (exportedFiles.length > 0) {
        for (let i = 0; i < exportedFiles.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 100));
          downloadFile(exportedFiles[i].dataUrl, exportedFiles[i].filename);
        }
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3000);
      } else {
        console.warn('No frame elements found in DOM. Make sure frames have data-frame-id attributes.');
        alert('Could not find frames to export. Please make sure you have a project open with visible frames.');
      }
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const selectedCount = getSelectedCount();
  const totalItems = projectItems.length;
  const supportsTransparent = formats.find(f => f.id === format)?.supportsTransparent;

  return (
    <>
      <div 
        className={`fixed top-[56px] h-[calc(100%-56px)] w-72 bg-gray-900 border-r border-t border-gray-800 z-40 flex flex-col ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{ left: isOpen ? 64 : -224, transition: 'left 0.3s ease-out' }}
      >
        {/* Fixed Header */}
        <div className="flex-shrink-0 px-4 border-b border-gray-800 flex items-center justify-between" style={{ height: 64 }}>
        <h2 className="text-sm font-semibold text-white">Export</h2>
        <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-gray-700 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="p-4 space-y-5">
          
          {/* Quick Export Presets */}
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Quick Export</h3>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 hide-scrollbar">
              {exportPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                    selectedPreset === preset.id
                      ? 'bg-gray-700 border-gray-500 text-white'
                      : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-700 hover:border-gray-600 hover:text-gray-300'
                  }`}
                  title={preset.description}
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d={preset.icon} />
                  </svg>
                  <span className="text-xs font-medium whitespace-nowrap">{preset.name}</span>
                </button>
              ))}
            </div>
            {selectedPreset && (
              <p className="text-[10px] text-gray-500 mt-2">
                {exportPresets.find(p => p.id === selectedPreset)?.description}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800" />
          
          {/* Project & Frame Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Select Content</h3>
              {selectedProject && (
                <div className="flex gap-2">
                  <button type="button" onClick={selectAll} className="text-[10px] text-gray-400 hover:text-white transition-colors">All</button>
                  <span className="text-gray-700">|</span>
                  <button type="button" onClick={deselectAll} className="text-[10px] text-gray-500 hover:text-gray-400 transition-colors">None</button>
                </div>
              )}
            </div>
            
            {allProjects.length === 0 ? (
              <div className="bg-gray-800/30 rounded-lg border border-gray-700/50 p-4 text-center">
                <svg className="w-6 h-6 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-xs text-gray-500">No projects available</p>
              </div>
            ) : (
              <div className="bg-gray-800/30 rounded-lg border border-gray-700/50 overflow-hidden transition-colors hover:border-gray-600/50">
                {/* Project Dropdown Row */}
                <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-700/30">
                  {/* Select All Checkbox */}
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedCount === totalItems && totalItems > 0) {
                        deselectAll();
                      } else {
                        selectAll();
                      }
                    }}
                    className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-all ${
                      selectedCount === totalItems && totalItems > 0
                        ? 'bg-gray-600 border-gray-500'
                        : selectedCount > 0
                        ? 'bg-gray-700 border-gray-500'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {selectedCount === totalItems && totalItems > 0 && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {selectedCount > 0 && selectedCount < totalItems && (
                      <div className="w-2 h-0.5 bg-white rounded-full" />
                    )}
                  </button>
                  
                  {/* Type Icon */}
                  <span className="text-gray-500 flex-shrink-0">
                    {selectedProject && getTypeIcon(selectedProject.type)}
                  </span>
                  
                  {/* Project Dropdown */}
                  <div className="relative flex-1">
                    <select
                      value={selectedProjectKey}
                      onChange={(e) => handleProjectChange(e.target.value)}
                      className="w-full bg-transparent pr-6 text-xs text-white hover:text-gray-300 focus:outline-none transition-colors cursor-pointer appearance-none"
                    >
                      {allProjects.map(project => (
                        <option key={project.key} value={project.key} className="bg-gray-800 text-white">
                          {project.name}
                        </option>
                      ))}
                    </select>
                    <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {/* Frame count badge */}
                  <span className="text-[10px] text-gray-500 flex-shrink-0">
                    {totalItems} {itemLabel.toLowerCase()}{totalItems !== 1 ? 's' : ''}
                  </span>
                </div>
                
                {/* Frame Selection Sub-panel */}
                {selectedProject && projectItems.length > 0 && (
                  <div className="p-3 bg-gray-800/20">
                    <div className="flex flex-wrap gap-1.5">
                      {projectItems.map((item, index) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => toggleItem(item.id)}
                          className={`px-2.5 py-1 rounded text-[10px] font-medium transition-all border ${
                            selectedItems[item.id]
                              ? 'bg-gray-700 border-gray-500 text-white'
                              : 'bg-gray-800/50 border-gray-700 text-gray-500 hover:bg-gray-700 hover:border-gray-600 hover:text-gray-300'
                          }`}
                        >
                          {itemLabel} {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedProject && projectItems.length === 0 && (
                  <div className="p-3 text-center">
                    <p className="text-[10px] text-gray-500">No {itemLabel.toLowerCase()}s in this project</p>
                  </div>
                )}
              </div>
            )}
            
            {selectedProject && (
              <p className="text-[10px] text-gray-600 mt-2">{selectedCount} of {totalItems} {itemLabel.toLowerCase()}s selected</p>
            )}
          </div>

          {/* Format Section */}
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Format</h3>
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
                  className={`px-2 py-2 rounded-lg text-xs font-medium transition-all border ${
                    format === f.id
                      ? 'bg-gray-700 border-gray-500 text-white'
                      : 'bg-gray-800/50 border-gray-700 text-gray-500 hover:bg-gray-700 hover:border-gray-600 hover:text-gray-300'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* Resolution Section */}
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Resolution</h3>
            <div className="grid grid-cols-3 gap-1.5">
              {resolutions.map(r => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setResolution(r.id)}
                  className={`px-2 py-2 rounded-lg text-center transition-all border ${
                    resolution === r.id
                      ? 'bg-gray-700 border-gray-500 text-white'
                      : 'bg-gray-800/50 border-gray-700 text-gray-500 hover:bg-gray-700 hover:border-gray-600 hover:text-gray-300'
                  }`}
                >
                  <div className="text-xs font-medium">{r.name}</div>
                  <div className="text-[9px] text-gray-500">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Background Section */}
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Background</h3>
            <div className="space-y-1.5">
              {backgroundOptions.map(bg => (
                <button
                  type="button"
                  key={bg.id}
                  onClick={() => bg.id !== 'transparent' || supportsTransparent ? setBackground(bg.id) : null}
                  disabled={bg.id === 'transparent' && !supportsTransparent}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all border ${
                    background === bg.id
                      ? 'bg-gray-800/80 border-gray-600'
                      : bg.id === 'transparent' && !supportsTransparent
                      ? 'bg-gray-800/30 border-gray-700/50 opacity-40 cursor-not-allowed'
                      : 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/50 hover:border-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    background === bg.id ? 'border-gray-400' : 'border-gray-600'
                  }`}>
                    {background === bg.id && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div className="flex-1">
                    <div className={`text-xs transition-colors ${background === bg.id ? 'text-white' : 'text-gray-400'}`}>{bg.name}</div>
                    <div className="text-[10px] text-gray-600">{bg.desc}</div>
                  </div>
                  {bg.id === 'custom' && background === 'custom' && (
                    <input
                      type="color"
                      value={customBgColor}
                      onChange={(e) => setCustomBgColor(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-6 h-6 rounded cursor-pointer border border-gray-600"
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
          <div className="mb-3 px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-xs text-gray-300">Export complete!</span>
          </div>
        )}
        <button
          type="button"
          onClick={handleExport}
          disabled={selectedCount === 0 || isExporting}
          className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 border ${
            selectedCount > 0 && !isExporting
              ? 'bg-gray-700 hover:bg-gray-600 border-gray-600 hover:border-gray-500 text-white'
              : 'bg-gray-800/50 border-gray-700 text-gray-600 cursor-not-allowed'
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
    </>
  );
};

export default ExportPanel;
