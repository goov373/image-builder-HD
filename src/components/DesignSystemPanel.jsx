import { useState } from 'react';

/**
 * Design & Assets Panel
 * Combined Design System, Assets upload, and Backgrounds
 */
const DesignSystemPanel = ({ 
  designSystem, 
  onUpdate, 
  onClose, 
  isOpen,
  selectedCarouselId,
  selectedFrameId,
  selectedCarouselFrames = [], // Array of frames in the selected carousel
  onSetFrameBackground,
  onSetRowStretchedBackground 
}) => {
  const hasFrameSelected = selectedCarouselId !== null && selectedFrameId !== null;
  const hasRowSelected = selectedCarouselId !== null;
  const [applyMode, setApplyMode] = useState('frame'); // 'frame' or 'row'
  
  // Frame range selection for stretched gradients
  const [stretchRange, setStretchRange] = useState({ start: 0, end: null }); // null end means "all"
  const totalFrames = selectedCarouselFrames.length;
  
  // Reset range when carousel changes
  const effectiveEnd = stretchRange.end !== null ? stretchRange.end : totalFrames - 1;
  const selectedFrameCount = effectiveEnd - stretchRange.start + 1;
  
  const handleFrameRangeClick = (index) => {
    if (stretchRange.start === null || (stretchRange.end !== null)) {
      // Start new selection
      setStretchRange({ start: index, end: null });
    } else {
      // Complete the selection
      const start = Math.min(stretchRange.start, index);
      const end = Math.max(stretchRange.start, index);
      setStretchRange({ start, end });
    }
  };
  
  const handleSelectAllFrames = () => {
    setStretchRange({ start: 0, end: totalFrames - 1 });
  };
  
  const handleBackgroundClick = (background) => {
    if (applyMode === 'row' && hasRowSelected && onSetRowStretchedBackground) {
      // Apply stretched across selected frame range
      const startIdx = stretchRange.start;
      const endIdx = stretchRange.end !== null ? stretchRange.end : totalFrames - 1;
      onSetRowStretchedBackground(selectedCarouselId, background, startIdx, endIdx);
    } else if (hasFrameSelected && onSetFrameBackground) {
      // Apply to single frame
      onSetFrameBackground(selectedCarouselId, selectedFrameId, background);
    }
  };
  const [activeTab, setActiveTab] = useState('design'); // 'design' or 'assets'
  const [uploadedFiles, setUploadedFiles] = useState([]); // Mock uploaded files
  const [uploadedDocs, setUploadedDocs] = useState([]); // Mock uploaded docs
  const MAX_FILES = 50;
  const MAX_DOCS = 20;
  
  const colorFields = [
    { key: 'primary', label: 'Primary' },
    { key: 'secondary', label: 'Secondary' },
    { key: 'accent', label: 'Accent' },
    { key: 'neutral1', label: 'Dark' },
    { key: 'neutral2', label: 'Mid' },
    { key: 'neutral3', label: 'Light' },
  ];

  // HelloData brand-aligned gradients
  // ===== WHITE-DOMINANT PURPLE GRADIENTS (3) =====
  // For pages that feel primarily white with purple stretched/blended in
  const whitePurpleGradients = [
    // 1. Diagonal mesh - purple stretched further with smooth blend
    'linear-gradient(135deg, #ffffff 0%, #f5f6ff 15%, #e8ebf7 30%, #d4d9fc 45%, #b8c0f5 60%, #a5b4fc 75%, #818cf8 90%, #6466e9 100%)',
    // 2. Vertical fade - purple blending up smoothly
    'linear-gradient(180deg, #ffffff 0%, #f5f6ff 18%, #e8ebf7 35%, #c7d2fe 52%, #a5b4fc 70%, #818cf8 85%, #6466e9 100%)',
    // 3. Corner mesh - white upper-left with purple sweeping from bottom-right corner
    'linear-gradient(315deg, #6466e9 0%, #818cf8 12%, #a5b4fc 25%, #c7d2fe 40%, #e8ebf7 55%, #f5f6ff 72%, #ffffff 100%)',
  ];

  // ===== PURPLE RADIAL GRADIENTS (3) =====
  // Soft highlight aesthetic with organic glow effects
  const purpleConicals = [
    // Gradient 1: Upper-left soft lavender highlight on medium purple base (stretched, blended)
    'radial-gradient(ellipse at 25% 25%, rgba(199, 210, 254, 0.5) 0%, rgba(165, 180, 252, 0.25) 30%, rgba(129, 140, 248, 0.1) 50%, transparent 70%), radial-gradient(ellipse at 50% 50%, #7578eb 0%, #6466e9 60%, #5558d9 100%)',
    // Gradient 2: Centered subtle glow, blended into uniform purple
    'radial-gradient(ellipse at 50% 45%, rgba(165, 180, 252, 0.35) 0%, rgba(129, 140, 248, 0.25) 25%, rgba(100, 102, 233, 0.12) 45%, transparent 65%), linear-gradient(180deg, #7578eb 0%, #6466e9 50%, #5c5fdb 100%)',
    // Gradient 3: Lighter/muted periwinkle, washed soft aesthetic
    'radial-gradient(ellipse at 60% 40%, rgba(255, 255, 255, 0.25) 0%, transparent 50%), linear-gradient(160deg, #a5b4fc 0%, #8b8fef 35%, #7578eb 70%, #6c6fe5 100%)',
  ];

  // ===== PURPLE LINEAR FADE GRADIENTS (6) =====
  // Smooth gradual fades in different directions - light to purple transitions
  const purpleMeshes = [
    // 1. Layered linear: Purple from lower-left + upper-right, darker blended center
    'linear-gradient(45deg, #5558d9 0%, #6466e9 15%, #818cf8 35%, rgba(129,140,248,0.6) 50%, transparent 70%), linear-gradient(225deg, #5558d9 0%, #6466e9 15%, #818cf8 35%, rgba(129,140,248,0.6) 50%, transparent 70%), linear-gradient(135deg, #818cf8 0%, #6466e9 50%, #818cf8 100%)',
    // 2. Diagonal top-left: Light corner fading to purple
    'linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 25%, #818cf8 50%, #6466e9 75%, #5558d9 100%)',
    // 3. Diagonal: Light top-right → Deep purple bottom-left (225deg mirrored)
    'linear-gradient(225deg, #c7d2fe 0%, #a5b4fc 25%, #818cf8 50%, #6466e9 75%, #5c5fdb 100%)',
    // 4. Layered linear: Purple from upper-left + lower-right, darker seamless blend
    'linear-gradient(135deg, #5c5fdb 0%, #6466e9 15%, #818cf8 35%, rgba(129,140,248,0.5) 55%, transparent 75%), linear-gradient(315deg, #5c5fdb 0%, #6466e9 15%, #818cf8 35%, rgba(129,140,248,0.5) 55%, transparent 75%), linear-gradient(180deg, #918df5 0%, #7578eb 50%, #918df5 100%)',
    // 5. Diagonal bottom-left: Light corner fading to purple top-right
    'linear-gradient(45deg, #c7d2fe 0%, #a5b4fc 25%, #818cf8 50%, #6466e9 75%, #5558d9 100%)',
    // 6. Subtle angle: Soft transition with extended mid-tones
    'linear-gradient(160deg, #d4d9fc 0%, #b8c0f0 15%, #a5b4fc 30%, #8b8fef 50%, #7578eb 70%, #6466e9 85%, #5c5fdb 100%)',
  ];

  // ===== ORANGE GRADIENTS (3) =====
  // ===== ORANGE GRADIENTS (3) - Light & Airy =====
  const orangeGradients = [
    // 1. Soft peach-orange diagonal - light to warm orange
    'linear-gradient(135deg, #fdd8c2 0%, #fcb88a 25%, #f9a066 50%, #f78b4a 75%, #f57c3a 100%)',
    // 2. Warm vertical - cream orange fading to rich orange
    'linear-gradient(180deg, #fee0cc 0%, #fcb98c 30%, #f9944e 60%, #f7843c 100%)',
    // 3. Subtle radial glow - soft highlight like purple R1C3
    'radial-gradient(ellipse at 60% 40%, rgba(255, 255, 255, 0.25) 0%, transparent 50%), linear-gradient(160deg, #fcb88a 0%, #f9a066 35%, #f78b4a 70%, #f57c3a 100%)',
  ];

  // ===== BLACK/DARK GRADIENTS (3) =====
  const blackGradients = [
    'linear-gradient(135deg, #18191A 0%, #2d2e30 100%)',   // Shadow to Charcoal
    'linear-gradient(180deg, #1f2022 0%, #18191A 100%)',   // Vertical dark fade
    'linear-gradient(135deg, #0f0f10 0%, #18191A 50%, #27282a 100%)', // Deep black to charcoal
  ];

  // Combined gradients array
  const gradients = [
    ...whitePurpleGradients,
    ...purpleConicals,
    ...purpleMeshes,
    ...orangeGradients,
    ...blackGradients,
  ];

  // HelloData brand palette - solid colors
  const solidColors = [
    '#6466e9',  // Purple (Primary)
    '#818cf8',  // Light Purple
    '#F97316',  // Orange (Accent)
    '#fbbf24',  // Gold
    '#18191A',  // Shadow (Dark)
    '#2d2e30',  // Charcoal
    '#6B7280',  // Medium Grey
    '#9CA3AF',  // Light Medium Grey
    '#eef1f9',  // Light Grey (Secondary)
    '#EEF2FF',  // Purple Light
    '#ffffff',  // White
    '#000000',  // Black
  ];
  
  return (
    <div 
      className={`fixed top-[56px] h-[calc(100%-56px)] w-72 bg-gray-900 border-r border-t border-gray-800 z-40 flex flex-col ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      style={{ left: isOpen ? 64 : -224, transition: 'left 0.3s ease-out' }}
    >
      {/* Fixed Header */}
      <div className="flex-shrink-0 px-4 border-b border-gray-800 flex items-center justify-between" style={{ height: 64 }}>
        <h2 className="text-sm font-semibold text-white">Design & Assets</h2>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Fixed Tab Navigation */}
      <div className="flex-shrink-0 flex border-b border-gray-800">
        <button 
          type="button"
          onClick={() => setActiveTab('design')}
          className={`flex-1 py-3 text-xs font-medium transition-colors ${activeTab === 'design' ? 'text-white border-b-2 border-gray-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Design
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('assets')}
          className={`flex-1 py-3 text-xs font-medium transition-colors ${activeTab === 'assets' ? 'text-white border-b-2 border-gray-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Assets
          {uploadedFiles.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 bg-gray-700 rounded text-[10px]">{uploadedFiles.length}</span>
          )}
        </button>
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
      {activeTab === 'assets' ? (
        <>
          {/* Upload Section */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Upload Images</h3>
              <span className="text-[10px] text-gray-500">{uploadedFiles.length}/{MAX_FILES}</span>
            </div>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-gray-600 transition-colors cursor-pointer">
              <svg className="w-8 h-8 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs text-gray-400 mb-1">Drop images here</p>
              <p className="text-[10px] text-gray-600 mb-2">or</p>
              <button type="button" className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-xs text-white rounded-lg transition-colors">
                Browse files
              </button>
              <p className="text-[10px] text-gray-600 mt-2">PNG, JPG up to 10MB each</p>
            </div>
          </div>
          
          {/* File Browser */}
          <div className="p-4">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Your Images</h3>
            {uploadedFiles.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs text-gray-500">No images uploaded yet</p>
                <p className="text-[10px] text-gray-600 mt-1">Upload images to use in your designs</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden group cursor-pointer hover:ring-2 hover:ring-gray-400 transition-all">
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" className="p-1.5 bg-red-500 rounded-full hover:bg-red-600 transition-colors">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/70 to-transparent">
                      <p className="text-[9px] text-white truncate">{file.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Upload Docs Section */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Upload Docs</h3>
              <span className="text-[10px] text-gray-500">{uploadedDocs.length}/{MAX_DOCS}</span>
            </div>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-gray-600 transition-colors cursor-pointer">
              <svg className="w-8 h-8 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xs text-gray-400 mb-1">Drop docs here</p>
              <p className="text-[10px] text-gray-600 mb-2">or</p>
              <button type="button" className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-xs text-white rounded-lg transition-colors">
                Browse files
              </button>
              <p className="text-[10px] text-gray-600 mt-2">PDF, DOCX, TXT, MD up to 10MB each</p>
            </div>
            <p className="text-[10px] text-gray-500 mt-3 flex items-center justify-center gap-1.5">
              <svg className="w-3 h-3 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" />
              </svg>
              <span>AI will generate projects from your specs</span>
            </p>
          </div>
          
          {/* Your Docs Browser */}
          <div className="p-4">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Your Docs</h3>
            {uploadedDocs.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-xs text-gray-500">No docs uploaded yet</p>
                <p className="text-[10px] text-gray-600 mt-1">Upload docs to use in your designs</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {uploadedDocs.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-2.5 py-2 bg-gray-800/50 rounded-lg group hover:bg-gray-800 transition-colors">
                    <svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-[11px] text-gray-300 flex-1 truncate">{doc.name}</span>
                    <button type="button" className="p-1 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
      
        {/* Colors Section */}
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Brand Colors</h3>
          <div className="grid grid-cols-3 gap-3">
            {colorFields.map(field => (
              <div key={field.key} className="flex flex-col items-center gap-1.5">
                <div className="relative group">
                  <div className="w-12 h-12 rounded-lg border border-gray-500/50 hover:border-gray-400 transition-colors overflow-hidden">
                    <input
                      type="color"
                      value={designSystem[field.key]}
                      onChange={(e) => onUpdate({ ...designSystem, [field.key]: e.target.value })}
                      className="w-14 h-14 -m-1 cursor-pointer"
                    />
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-gray-950 text-white text-[10px] font-mono rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {designSystem[field.key].toUpperCase()}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-950" />
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 font-medium">{field.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Fonts Section */}
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Brand Font: Nunito Sans</h3>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-gray-400 font-medium block mb-1.5">Heading Weight</label>
              <select
                value={designSystem.headingWeight || '700'}
                onChange={(e) => onUpdate({ ...designSystem, headingWeight: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white hover:border-gray-400 focus:border-gray-400 focus:outline-none transition-colors cursor-pointer"
              >
                <option value="200" style={{ fontFamily: 'Nunito Sans', fontWeight: 200 }}>ExtraLight (200)</option>
                <option value="300" style={{ fontFamily: 'Nunito Sans', fontWeight: 300 }}>Light (300)</option>
                <option value="400" style={{ fontFamily: 'Nunito Sans', fontWeight: 400 }}>Regular (400)</option>
                <option value="500" style={{ fontFamily: 'Nunito Sans', fontWeight: 500 }}>Medium (500)</option>
                <option value="600" style={{ fontFamily: 'Nunito Sans', fontWeight: 600 }}>SemiBold (600)</option>
                <option value="700" style={{ fontFamily: 'Nunito Sans', fontWeight: 700 }}>Bold (700)</option>
                <option value="800" style={{ fontFamily: 'Nunito Sans', fontWeight: 800 }}>ExtraBold (800)</option>
                <option value="900" style={{ fontFamily: 'Nunito Sans', fontWeight: 900 }}>Black (900)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-medium block mb-1.5">Body Weight</label>
              <select
                value={designSystem.bodyWeight || '400'}
                onChange={(e) => onUpdate({ ...designSystem, bodyWeight: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white hover:border-gray-400 focus:border-gray-400 focus:outline-none transition-colors cursor-pointer"
              >
                <option value="200" style={{ fontFamily: 'Nunito Sans', fontWeight: 200 }}>ExtraLight (200)</option>
                <option value="300" style={{ fontFamily: 'Nunito Sans', fontWeight: 300 }}>Light (300)</option>
                <option value="400" style={{ fontFamily: 'Nunito Sans', fontWeight: 400 }}>Regular (400)</option>
                <option value="500" style={{ fontFamily: 'Nunito Sans', fontWeight: 500 }}>Medium (500)</option>
                <option value="600" style={{ fontFamily: 'Nunito Sans', fontWeight: 600 }}>SemiBold (600)</option>
                <option value="700" style={{ fontFamily: 'Nunito Sans', fontWeight: 700 }}>Bold (700)</option>
                <option value="800" style={{ fontFamily: 'Nunito Sans', fontWeight: 800 }}>ExtraBold (800)</option>
                <option value="900" style={{ fontFamily: 'Nunito Sans', fontWeight: 900 }}>Black (900)</option>
              </select>
            </div>
          </div>
        </div>
      
        {/* Backgrounds Section */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Backgrounds</h3>
            {hasRowSelected ? (
              <span className="text-[10px] text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                {applyMode === 'row' ? 'Apply to row' : 'Click to apply'}
              </span>
            ) : (
              <span className="text-[10px] text-gray-500">Select a frame first</span>
            )}
          </div>
          
          {/* Apply Mode Toggle */}
          {hasRowSelected && (
            <div className="flex items-center gap-2 mb-3 p-2 bg-gray-800/50 rounded-lg">
              <span className="text-[10px] text-gray-400">Apply to:</span>
              <div className="flex rounded-md overflow-hidden border border-gray-700">
                <button
                  type="button"
                  onClick={() => setApplyMode('frame')}
                  className={`px-3 py-1 text-[10px] font-medium transition-colors duration-150 ${
                    applyMode === 'frame' 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Frame
                </button>
                <button
                  type="button"
                  onClick={() => setApplyMode('row')}
                  className={`px-3 py-1 text-[10px] font-medium transition-colors duration-150 ${
                    applyMode === 'row' 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Row (Stretch)
                </button>
              </div>
            </div>
          )}
          
          {/* Frame Range Selector - only show when in Row mode */}
          {applyMode === 'row' && hasRowSelected && totalFrames > 0 && (
            <div className="mb-3 p-2 bg-gray-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-gray-400">Select frames to stretch:</span>
                <button
                  type="button"
                  onClick={handleSelectAllFrames}
                  className="text-[10px] text-gray-400 hover:text-white transition-colors duration-150"
                >
                  Select all
                </button>
              </div>
              
              {/* Frame selector buttons */}
              <div className="flex gap-1 flex-wrap">
                {selectedCarouselFrames.map((frame, index) => {
                  const isInRange = index >= stretchRange.start && index <= effectiveEnd;
                  const isStart = index === stretchRange.start;
                  const isEnd = index === effectiveEnd;
                  
                  return (
                    <button
                      key={frame.id}
                      type="button"
                      onClick={() => handleFrameRangeClick(index)}
                      className={`w-8 h-8 rounded text-[10px] font-medium transition-all duration-150 border ${
                        isInRange
                          ? 'bg-gray-600 border-gray-500 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-400'
                      } ${isStart || isEnd ? 'ring-1 ring-gray-400' : ''}`}
                      title={`Frame ${index + 1}`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              
              {/* Selection info */}
              <div className="mt-2 text-[10px] text-gray-500">
                {stretchRange.end !== null ? (
                  <span>Stretching across frames {stretchRange.start + 1} – {effectiveEnd + 1} ({selectedFrameCount} frames)</span>
                ) : stretchRange.start !== null ? (
                  <span>Click another frame to set range end (starting at {stretchRange.start + 1})</span>
                ) : (
                  <span>Click a frame to start selection</span>
                )}
              </div>
            </div>
          )}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {gradients.map((gradient, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => handleBackgroundClick(gradient)}
                disabled={!hasFrameSelected}
                className={`w-full aspect-square rounded-lg border-2 transition-colors ${
                  hasFrameSelected 
                    ? 'border-gray-700 hover:border-gray-400 hover:scale-105 cursor-pointer' 
                    : 'border-gray-700/50 opacity-60 cursor-not-allowed'
                }`}
                style={{ background: gradient }}
                title={hasFrameSelected ? 'Click to apply this background' : 'Select a frame first'}
              />
            ))}
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {solidColors.map(color => (
              <div key={color} className="relative group">
                <button
                  type="button"
                  onClick={() => handleBackgroundClick(color)}
                  disabled={!hasFrameSelected}
                  className={`w-full aspect-square rounded border-2 transition-colors ${
                    hasFrameSelected 
                      ? 'border-gray-700 hover:border-gray-400 hover:scale-110 cursor-pointer' 
                      : 'border-gray-700/50 opacity-60 cursor-not-allowed'
                  }`}
                  style={{ backgroundColor: color }}
                  title={hasFrameSelected ? 'Click to apply this background' : 'Select a frame first'}
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-gray-950 text-white text-[10px] font-mono rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {color.toUpperCase()}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-950" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Product Imagery Section */}
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Product Imagery</h3>
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-gray-600 transition-colors cursor-pointer">
            <svg className="w-8 h-8 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-xs text-gray-400 mb-1">Product shots & mockups</p>
            <button type="button" className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-xs text-white rounded-lg transition-colors">
              Upload imagery
            </button>
            <p className="text-[10px] text-gray-600 mt-2">PNG with transparent background</p>
          </div>
        </div>
        
        {/* Photography Section */}
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Photography</h3>
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-gray-600 transition-colors cursor-pointer mb-3">
            <svg className="w-8 h-8 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-xs text-gray-400 mb-1">Brand photography</p>
            <button type="button" className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-xs text-white rounded-lg transition-colors">
              Upload photos
            </button>
            <p className="text-[10px] text-gray-600 mt-2">JPG, PNG up to 10MB each</p>
          </div>
          
          {/* Stock Photo Sources */}
          <p className="text-[9px] text-gray-500 mb-2 uppercase tracking-wide">Free Stock Photos</p>
          <div className="space-y-2">
            <a 
              href="https://unsplash.com/s/photos/apartment-building" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group"
            >
              <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-white">U</span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-white group-hover:text-purple-400 transition-colors">Unsplash</p>
                <p className="text-[10px] text-gray-500">Apartment buildings</p>
              </div>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <a 
              href="https://www.pexels.com/search/apartment%20building/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group"
            >
              <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-white">P</span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-white group-hover:text-purple-400 transition-colors">Pexels</p>
                <p className="text-[10px] text-gray-500">Multifamily housing</p>
              </div>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <a 
              href="https://pixabay.com/images/search/apartment%20building/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group"
            >
              <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-white">Px</span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-white group-hover:text-purple-400 transition-colors">Pixabay</p>
                <p className="text-[10px] text-gray-500">Urban apartments</p>
              </div>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          <p className="text-[9px] text-gray-600 mt-2 text-center">All free for commercial use</p>
        </div>
        
        {/* Brand Patterns Section */}
        <div className="p-4">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Brand Patterns</h3>
          <p className="text-[10px] text-gray-500 mb-3">Data-driven visuals that tell the HelloData story</p>
          
          {/* Pattern Grid - Data Visualizations */}
          <p className="text-[9px] text-gray-500 mb-2 uppercase tracking-wide">Data Visualizations</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { name: 'Market Map', file: 'street-grid.svg', desc: 'Submarket overview' },
              { name: 'Comp Radius', file: 'comp-radius-new.svg', desc: 'Property analysis' },
              { name: 'Rent Trends', file: 'rent-trends.svg', desc: 'Market movement' },
              { name: 'Unit Grid', file: 'apartment-units.svg', desc: 'Multifamily units' },
              { name: 'Market Heat', file: 'market-heat.svg', desc: 'Submarket intensity' },
              { name: 'Data Network', file: 'property-network.svg', desc: 'Property connections' },
            ].map((pattern, i) => (
              <button
                key={pattern.file}
                type="button"
                className="group relative aspect-square rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all"
                style={{
                  backgroundImage: `url(/patterns/${pattern.file})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                title={pattern.desc}
              >
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[10px] text-white font-medium">{pattern.name}</span>
                </div>
              </button>
            ))}
          </div>
          
          {/* City Map Patterns */}
          <p className="text-[9px] text-gray-500 mb-2 uppercase tracking-wide">Neighborhood</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { name: 'Grid City', file: 'city-blocks-1.svg', desc: 'Standard grid layout' },
              { name: 'Diagonal Ave', file: 'city-blocks-2.svg', desc: 'With diagonal road' },
              { name: 'Dense Urban', file: 'city-blocks-3.svg', desc: 'Tight city blocks' },
              { name: 'River City', file: 'city-blocks-4.svg', desc: 'Boulevard layout' },
              { name: 'Highway', file: 'city-blocks-5.svg', desc: 'Diagonal highway' },
              { name: 'Roundabout', file: 'city-blocks-6.svg', desc: 'Circle intersection' },
            ].map((pattern, i) => (
              <button
                key={pattern.file}
                type="button"
                className="group relative aspect-square rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all"
                style={{
                  backgroundImage: `url(/patterns/${pattern.file})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                title={pattern.desc}
              >
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[10px] text-white font-medium">{pattern.name}</span>
                </div>
              </button>
            ))}
          </div>
          
          {/* Metro/Submarket Patterns */}
          <p className="text-[9px] text-gray-500 mb-2 uppercase tracking-wide">Metro / Submarket</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { name: 'Beltway', file: 'metro-1.svg', desc: 'Highway loop metro' },
              { name: 'River Metro', file: 'metro-2.svg', desc: 'River through city' },
              { name: 'Coastal', file: 'metro-3.svg', desc: 'Coastal metro area' },
              { name: 'Lakefront', file: 'metro-4.svg', desc: 'Lake city with transit' },
              { name: 'Airport Hub', file: 'metro-5.svg', desc: 'Metro with airport' },
              { name: 'Multi-Core', file: 'metro-6.svg', desc: 'Poly-centric metro' },
            ].map((pattern, i) => (
              <button
                key={pattern.file}
                type="button"
                className="group relative aspect-square rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all"
                style={{
                  backgroundImage: `url(/patterns/${pattern.file})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                title={pattern.desc}
              >
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[10px] text-white font-medium">{pattern.name}</span>
                </div>
              </button>
            ))}
          </div>
          
          {/* Upload custom patterns */}
          <div className="border border-dashed border-gray-700 rounded-lg p-3 text-center hover:border-gray-600 transition-colors cursor-pointer">
            <p className="text-[10px] text-gray-500 mb-1">Upload custom pattern</p>
            <p className="text-[9px] text-gray-600">SVG, PNG (tileable)</p>
          </div>
        </div>
        </>
      )}
      </div>
    </div>
  );
};

export default DesignSystemPanel;


