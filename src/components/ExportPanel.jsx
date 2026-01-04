import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { exportPresets } from '../data/exportPresets';
import { exportElement, getExtension, RESOLUTION_SCALES } from '../utils/browserExport';
import { logger } from '../utils';

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
  projectType: _projectType = 'carousel',
}) => {
  const [selectedProjectKey, setSelectedProjectKey] = useState('');
  const [format, setFormat] = useState('png');
  const [resolution, setResolution] = useState('2x');
  const [background, setBackground] = useState('original');
  const [customBgColor, setCustomBgColor] = useState('#000000');
  const [selectedItems, setSelectedItems] = useState({});
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState({ current: 0, total: 0 });
  const [exportSuccess, setExportSuccess] = useState(false);
  const [_isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);

  // Combine all projects into a unified list with unique keys
  const allProjects = [
    ...carousels.map((c) => ({
      ...c,
      type: 'carousel',
      items: c.frames || [],
      itemLabel: 'Frame',
      key: `carousel-${c.id}`,
    })),
    ...eblasts.map((e) => ({
      ...e,
      type: 'eblast',
      items: e.sections || [],
      itemLabel: 'Section',
      key: `eblast-${e.id}`,
    })),
    ...videoCovers.map((v) => ({
      ...v,
      type: 'videoCover',
      items: v.frames || [],
      itemLabel: 'Cover',
      key: `videoCover-${v.id}`,
    })),
    ...singleImages.map((s) => ({
      ...s,
      type: 'singleImage',
      items: s.layers || [],
      itemLabel: 'Layer',
      key: `singleImage-${s.id}`,
    })),
  ];

  // Get currently selected project
  const selectedProject = allProjects.find((p) => p.key === selectedProjectKey);
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
      case 'videoCover':
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'singleImage':
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const formats = [
    { id: 'png', name: 'PNG', supportsTransparent: true, available: true },
    { id: 'jpg', name: 'JPG', supportsTransparent: false, available: true },
    { id: 'webp', name: 'WebP', supportsTransparent: true, available: true },
    { id: 'svg', name: 'SVG', supportsTransparent: true, available: false, comingSoon: true },
    { id: 'pdf', name: 'PDF', supportsTransparent: false, available: false, comingSoon: true },
    { id: 'pptx', name: 'PPTX', supportsTransparent: false, available: false, comingSoon: true },
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
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Select all in current project
  const selectAll = () => {
    const newSelection = {};
    projectItems.forEach((item) => {
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

  // Get resolution multiplier from centralized utility
  const getScale = () => RESOLUTION_SCALES[resolution] || 2;

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
    setExportProgress({ current: 0, total: count });

    // DIAGNOSTIC: Log export attempt
    logger.group('📤 Export Diagnostic');
    logger.log('Selected count:', count);
    logger.log('Project:', selectedProject?.name);
    logger.log('Format:', format, '| Resolution:', resolution, '| Background:', background);

    try {
      const selectedItemIds = Object.keys(selectedItems).filter((id) => selectedItems[id]);
      const scale = getScale();
      const extension = getExtension(format);

      logger.log('Items to export:', selectedItemIds);

      const exportedFiles = [];

      for (let i = 0; i < selectedItemIds.length; i++) {
        const itemId = selectedItemIds[i];

        const frameElement =
          document.querySelector(`[data-frame-id="${itemId}"][data-project-key="${selectedProjectKey}"]`) ||
          document.querySelector(`[data-frame-id="${itemId}"]`);

        logger.log(`Frame ${i + 1}/${selectedItemIds.length}: ID=${itemId}, Found=${!!frameElement}`);
        setExportProgress({ current: i + 1, total: selectedItemIds.length });

        if (frameElement) {
          logger.log(`  Frame size: ${frameElement.offsetWidth}x${frameElement.offsetHeight}`);

          // 🏆 GOLDEN RULE: Use browser rendering to guarantee WYSIWYG exports
          // The exportElement function uses html-to-image which embeds actual
          // browser-rendered HTML in SVG foreignObject, preserving exact appearance
          const exportOptions = {
            pixelRatio: scale,
            quality: 0.95,
            backgroundColor: background === 'transparent' ? null : background === 'custom' ? customBgColor : undefined,
          };

          const dataUrl = await exportElement(frameElement, format, exportOptions);
          logger.log(`  Rendered successfully (${format.toUpperCase()})`);

          const filename = `${selectedProject.name.replace(/[^a-z0-9]/gi, '_')}_${itemLabel}_${i + 1}.${extension}`;

          exportedFiles.push({ dataUrl, filename });
        }
      }

      logger.log('Successfully rendered:', exportedFiles.length, 'files');

      if (exportedFiles.length > 0) {
        logger.log('Starting downloads...');

        if (exportedFiles.length === 1) {
          // Single file: direct download
          logger.log(`  Downloading: ${exportedFiles[0].filename}`);
          downloadFile(exportedFiles[0].dataUrl, exportedFiles[0].filename);
        } else {
          // Multiple files: bundle into ZIP
          logger.log(`  Bundling ${exportedFiles.length} files into ZIP...`);

          const zip = new JSZip();
          const projectName = selectedProject.name.replace(/[^a-z0-9]/gi, '_');

          exportedFiles.forEach((file, _index) => {
            // Convert data URL to base64
            const base64Data = file.dataUrl.split(',')[1];
            zip.file(file.filename, base64Data, { base64: true });
            logger.log(`    Added to ZIP: ${file.filename}`);
          });

          // Generate and download ZIP
          const zipBlob = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 },
          });

          const zipFilename = `${projectName}_export_${exportedFiles.length}_files.zip`;
          logger.log(`  Downloading ZIP: ${zipFilename} (${(zipBlob.size / 1024).toFixed(1)} KB)`);
          saveAs(zipBlob, zipFilename);
        }

        logger.log('✅ Export complete!');
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3000);
      } else {
        logger.warn('No frame elements found in DOM. Make sure frames have data-frame-id attributes.');
        alert('Could not find frames to export. Please make sure you have a project open with visible frames.');
      }
    } catch (error) {
      logger.error('Export failed:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Export failed. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('timeout') || error.message.includes('aborted')) {
          errorMessage = 'Export was cancelled or timed out. Please try again.';
        } else if (error.message.includes('memory') || error.message.includes('quota')) {
          errorMessage = 'Not enough memory to complete export. Try exporting fewer items at once.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error during export. Please check your connection and try again.';
        }
      }
      
      alert(errorMessage);
    } finally {
      logger.groupEnd();
      setIsExporting(false);
    }
  };

  const selectedCount = getSelectedCount();
  const totalItems = projectItems.length;
  const supportsTransparent = formats.find((f) => f.id === format)?.supportsTransparent;

  return (
    <>
      <div
        className={`fixed top-[56px] h-[calc(100%-56px)] w-72 bg-[--surface-canvas] border-r border-t border-[--border-default] z-40 flex flex-col ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{ left: isOpen ? 64 : -224, transition: 'left 0.3s ease-out' }}
      >
        {/* Fixed Header */}
        <div
          className="flex-shrink-0 px-4 border-b border-[--border-default] flex items-center justify-between"
          style={{ height: 64 }}
        >
          <h2 className="text-sm font-semibold text-white">Export</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded flex items-center justify-center text-[--text-quaternary] hover:text-white hover:bg-[--surface-overlay] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-scroll overflow-x-hidden pl-2">
          <div className="p-4 space-y-5">
            {/* Quick Export Presets */}
            <div>
              <h3 className="text-xs font-medium text-[--text-quaternary] uppercase tracking-wide mb-2">Quick Export</h3>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 hide-scrollbar">
                {exportPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded border transition-all ${
                      selectedPreset === preset.id
                        ? 'bg-[--surface-overlay] border-[--border-strong] text-white'
                        : 'bg-[--surface-raised]/50 border-[--border-default] text-[--text-tertiary] hover:bg-[--surface-overlay] hover:border-[--border-emphasis] hover:text-[--text-secondary]'
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
                <p className="text-[10px] text-[--text-quaternary] mt-2">
                  {exportPresets.find((p) => p.id === selectedPreset)?.description}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-[--border-default]" />

            {/* Project & Frame Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-[--text-quaternary] uppercase tracking-wide">Select Content</h3>
                {selectedProject && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={selectAll}
                      className="text-[10px] text-[--text-tertiary] hover:text-white transition-colors"
                    >
                      All
                    </button>
                    <span className="text-[--text-quaternary]">|</span>
                    <button
                      type="button"
                      onClick={deselectAll}
                      className="text-[10px] text-[--text-quaternary] hover:text-[--text-tertiary] transition-colors"
                    >
                      None
                    </button>
                  </div>
                )}
              </div>

              {allProjects.length === 0 ? (
                <div className="bg-[--surface-raised]/30 rounded border border-[--border-default]/50 p-4 text-center">
                  <svg
                    className="w-6 h-6 mx-auto mb-2 text-[--text-disabled]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <p className="text-xs text-[--text-quaternary]">No projects available</p>
                </div>
              ) : (
                <div className="bg-[--surface-raised]/30 rounded border border-[--border-default]/50 overflow-hidden transition-colors hover:border-[--border-emphasis]/50">
                  {/* Project Dropdown Row */}
                  <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[--border-default]/30">
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
                          ? 'bg-[--surface-elevated] border-[--border-strong]'
                          : selectedCount > 0
                            ? 'bg-[--surface-overlay] border-[--border-strong]'
                            : 'border-[--border-emphasis] hover:border-[--border-strong]'
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
                    <span className="text-[--text-quaternary] flex-shrink-0">
                      {selectedProject && getTypeIcon(selectedProject.type)}
                    </span>

                    {/* Project Dropdown */}
                    <div className="relative flex-1">
                      <select
                        value={selectedProjectKey}
                        onChange={(e) => handleProjectChange(e.target.value)}
                        className="w-full bg-transparent pr-6 text-xs text-white hover:text-[--text-secondary] focus:outline-none transition-colors cursor-pointer appearance-none"
                      >
                        {allProjects.map((project) => (
                          <option key={project.key} value={project.key} className="bg-[--surface-raised] text-white">
                            {project.name}
                          </option>
                        ))}
                      </select>
                      <svg
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-[--text-quaternary] pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {/* Frame count badge */}
                    <span className="text-[10px] text-[--text-quaternary] flex-shrink-0">
                      {totalItems} {itemLabel.toLowerCase()}
                      {totalItems !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Frame Selection Sub-panel */}
                  {selectedProject && projectItems.length > 0 && (
                    <div className="p-3 bg-[--surface-raised]/20">
                      <div className="flex flex-wrap gap-1.5">
                        {projectItems.map((item, index) => (
                          <button
                            type="button"
                            key={item.id}
                            onClick={() => toggleItem(item.id)}
                            className={`px-2.5 py-1 rounded text-[10px] font-medium transition-all border ${
                              selectedItems[item.id]
                                ? 'bg-[--surface-overlay] border-[--border-strong] text-white'
                                : 'bg-[--surface-raised]/50 border-[--border-default] text-[--text-quaternary] hover:bg-[--surface-overlay] hover:border-[--border-emphasis] hover:text-[--text-secondary]'
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
                      <p className="text-[10px] text-[--text-quaternary]">No {itemLabel.toLowerCase()}s in this project</p>
                    </div>
                  )}
                </div>
              )}

              {selectedProject && (
                <p className="text-[10px] text-[--text-disabled] mt-2">
                  {selectedCount} of {totalItems} {itemLabel.toLowerCase()}s selected
                </p>
              )}
            </div>

            {/* Format Section */}
            <div>
              <h3 className="text-xs font-medium text-[--text-quaternary] uppercase tracking-wide mb-2">Format</h3>
              <div className="grid grid-cols-3 gap-1.5">
                {formats.map((f) => (
                  <button
                    type="button"
                    key={f.id}
                    onClick={() => {
                      if (!f.available) return; // Ignore clicks on unavailable formats
                      setFormat(f.id);
                      if (!f.supportsTransparent && background === 'transparent') {
                        setBackground('original');
                      }
                    }}
                    disabled={!f.available}
                    title={f.comingSoon ? 'Coming soon' : undefined}
                    className={`px-2 py-2 rounded text-xs font-medium transition-all border relative ${
                      !f.available
                        ? 'bg-[--surface-raised]/30 border-[--border-default]/50 text-[--text-disabled] cursor-not-allowed opacity-50'
                        : format === f.id
                          ? 'bg-[--surface-overlay] border-[--border-strong] text-white'
                          : 'bg-[--surface-raised]/50 border-[--border-default] text-[--text-quaternary] hover:bg-[--surface-overlay] hover:border-[--border-emphasis] hover:text-[--text-secondary]'
                    }`}
                  >
                    {f.name}
                    {f.comingSoon && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-[--surface-elevated] rounded-full" title="Coming soon" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution Section */}
            <div>
              <h3 className="text-xs font-medium text-[--text-quaternary] uppercase tracking-wide mb-2">Resolution</h3>
              <div className="grid grid-cols-3 gap-1.5">
                {resolutions.map((r) => (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => setResolution(r.id)}
                    className={`px-2 py-2 rounded text-center transition-all border ${
                      resolution === r.id
                        ? 'bg-[--surface-overlay] border-[--border-strong] text-white'
                        : 'bg-[--surface-raised]/50 border-[--border-default] text-[--text-quaternary] hover:bg-[--surface-overlay] hover:border-[--border-emphasis] hover:text-[--text-secondary]'
                    }`}
                  >
                    <div className="text-xs font-medium">{r.name}</div>
                    <div className="text-[9px] text-[--text-quaternary]">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Background Section */}
            <div>
              <h3 className="text-xs font-medium text-[--text-quaternary] uppercase tracking-wide mb-2">Background</h3>
              <div className="space-y-1.5">
                {backgroundOptions.map((bg) => (
                  <button
                    type="button"
                    key={bg.id}
                    onClick={() => (bg.id !== 'transparent' || supportsTransparent ? setBackground(bg.id) : null)}
                    disabled={bg.id === 'transparent' && !supportsTransparent}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-left transition-all border ${
                      background === bg.id
                        ? 'bg-[--surface-raised]/80 border-[--border-emphasis]'
                        : bg.id === 'transparent' && !supportsTransparent
                          ? 'bg-[--surface-raised]/30 border-[--border-default]/50 opacity-40 cursor-not-allowed'
                          : 'bg-[--surface-raised]/30 border-[--border-default]/50 hover:bg-[--surface-raised]/50 hover:border-[--border-emphasis]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        background === bg.id ? 'border-[--border-strong]' : 'border-[--border-emphasis]'
                      }`}
                    >
                      {background === bg.id && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div className="flex-1">
                      <div
                        className={`text-xs transition-colors ${background === bg.id ? 'text-white' : 'text-[--text-tertiary]'}`}
                      >
                        {bg.name}
                      </div>
                      <div className="text-[10px] text-[--text-disabled]">{bg.desc}</div>
                    </div>
                    {bg.id === 'custom' && background === 'custom' && (
                      <input
                        type="color"
                        value={customBgColor}
                        onChange={(e) => setCustomBgColor(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-6 h-6 rounded cursor-pointer border border-[--border-emphasis]"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer - Export Button */}
        <div className="flex-shrink-0 p-4 border-t border-[--border-default] bg-[--surface-canvas]">
          {exportSuccess && (
            <div className="mb-3 px-3 py-2 bg-[--surface-raised]/50 border border-[--border-emphasis] rounded flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-xs text-[--text-secondary]">Export complete!</span>
            </div>
          )}
          <button
            type="button"
            onClick={handleExport}
            disabled={selectedCount === 0 || isExporting}
            className={`w-full py-2.5 rounded text-sm font-medium transition-all flex items-center justify-center gap-2 border ${
              selectedCount > 0 && !isExporting
                ? 'bg-[--surface-overlay] hover:bg-[--surface-elevated] border-[--border-emphasis] hover:border-[--border-strong] text-white'
                : 'bg-[--surface-raised]/50 border-[--border-default] text-[--text-disabled] cursor-not-allowed'
            }`}
          >
            {isExporting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>
                  {exportProgress.total > 1
                    ? `Exporting ${exportProgress.current}/${exportProgress.total}...`
                    : 'Exporting...'}
                </span>
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
