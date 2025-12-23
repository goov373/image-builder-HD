import { useState } from 'react';
import { allFonts } from '../data';

/**
 * Design & Assets Panel
 * Combined Design System, Assets upload, and Backgrounds
 */
const DesignSystemPanel = ({ designSystem, onUpdate, onClose, isOpen }) => {
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
  // ===== PURPLE CONICAL GRADIENTS (3) =====
  const purpleConicals = [
    'linear-gradient(135deg, rgba(100, 102, 233, 0.3) 0%, rgba(129, 140, 248, 0.15) 100%), conic-gradient(from 180deg at 20% 50%, #6466e9 0deg, #818cf8 120deg, #b8bdd6 240deg, #6466e9 360deg)',   // Focal left + overlay
    'linear-gradient(135deg, rgba(74, 77, 207, 0.3) 0%, rgba(100, 102, 233, 0.15) 100%), conic-gradient(from 45deg at 80% 20%, #4a4dcf 0deg, #6466e9 90deg, #818cf8 180deg, #b8bdd6 270deg, #4a4dcf 360deg)', // Focal top-right + overlay
    'linear-gradient(135deg, rgba(85, 88, 217, 0.3) 0%, rgba(129, 140, 248, 0.15) 100%), conic-gradient(from 270deg at 50% 80%, #5558d9 0deg, #818cf8 90deg, #c4c8e8 180deg, #818cf8 270deg, #5558d9 360deg)', // Focal bottom-center + overlay
  ];

  // ===== PURPLE MESH GRADIENTS (6) =====
  const purpleMeshes = [
    'radial-gradient(at 40% 20%, #6466e9 0px, transparent 50%), radial-gradient(at 80% 0%, #818cf8 0px, transparent 50%), radial-gradient(at 0% 50%, #5558d9 0px, transparent 50%), radial-gradient(at 80% 50%, #a8aed4 0px, transparent 50%), radial-gradient(at 0% 100%, #6466e9 0px, transparent 50%), radial-gradient(at 80% 100%, #c4c8e8 0px, transparent 50%), linear-gradient(135deg, #4a4dcf 0%, #b8bdd6 100%)',
    'radial-gradient(at 0% 0%, #818cf8 0px, transparent 50%), radial-gradient(at 100% 0%, #6466e9 0px, transparent 50%), radial-gradient(at 100% 100%, #5558d9 0px, transparent 50%), radial-gradient(at 0% 100%, #a8aed4 0px, transparent 50%), linear-gradient(180deg, #6466e9 0%, #4a4dcf 100%)',
    'radial-gradient(at 50% 0%, #818cf8 0px, transparent 65%), radial-gradient(at 25% 50%, #6466e9 0px, transparent 55%), radial-gradient(at 0% 100%, #5558d9 0px, transparent 55%), radial-gradient(at 100% 100%, #4a4dcf 0px, transparent 55%), linear-gradient(0deg, #3d3fa8 0%, #4a4dcf 30%, #5558d9 55%, #6466e9 80%, #818cf8 100%)',
    'linear-gradient(140deg, rgba(129, 140, 248, 0.55) 0%, rgba(129, 140, 248, 0.25) 18%, transparent 18%), linear-gradient(140deg, transparent 28%, rgba(100, 102, 233, 0.5) 28%, rgba(100, 102, 233, 0.2) 46%, transparent 46%), linear-gradient(140deg, transparent 56%, rgba(85, 88, 217, 0.45) 56%, rgba(85, 88, 217, 0.2) 74%, transparent 74%), linear-gradient(140deg, transparent 84%, rgba(74, 77, 207, 0.4) 84%, rgba(61, 63, 168, 0.25) 100%), linear-gradient(135deg, #3d3fa8 0%, #4a4dcf 100%)',
    'linear-gradient(155deg, rgba(129, 140, 248, 0.6) 0%, rgba(129, 140, 248, 0.3) 15%, transparent 15%), linear-gradient(155deg, transparent 22%, rgba(100, 102, 233, 0.55) 22%, rgba(100, 102, 233, 0.25) 37%, transparent 37%), linear-gradient(155deg, transparent 44%, rgba(85, 88, 217, 0.5) 44%, rgba(85, 88, 217, 0.2) 59%, transparent 59%), linear-gradient(155deg, transparent 66%, rgba(74, 77, 207, 0.45) 66%, rgba(74, 77, 207, 0.2) 81%, transparent 81%), linear-gradient(135deg, #3d3fa8 0%, #5558d9 100%)',
    'linear-gradient(145deg, rgba(129, 140, 248, 0.5) 0%, rgba(129, 140, 248, 0.2) 20%, transparent 20%), linear-gradient(145deg, transparent 30%, rgba(100, 102, 233, 0.5) 30%, rgba(100, 102, 233, 0.2) 50%, transparent 50%), linear-gradient(145deg, transparent 60%, rgba(85, 88, 217, 0.5) 60%, rgba(85, 88, 217, 0.2) 80%, transparent 80%), linear-gradient(145deg, transparent 88%, rgba(74, 77, 207, 0.45) 88%, rgba(61, 63, 168, 0.3) 100%), linear-gradient(135deg, #3d3fa8 0%, #5558d9 100%)',
  ];

  // ===== ORANGE GRADIENTS (3) =====
  const orangeGradients = [
    'linear-gradient(135deg, #f59e0b 0%, #F97316 30%, #ea580c 70%, #dc5a0d 100%)',   // Amber to Deep Orange (smooth)
    'linear-gradient(135deg, #fb923c 0%, #F97316 50%, #ea580c 100%)',   // Light Orange to Deep Orange
    'linear-gradient(180deg, #f59e0b 0%, #F97316 35%, #ea580c 75%, #dc5a0d 100%)',   // Vertical Amber to Deep Orange (smooth)
  ];

  // ===== BLACK/DARK GRADIENTS (3) =====
  const blackGradients = [
    'linear-gradient(135deg, #18191A 0%, #2d2e30 100%)',   // Shadow to Charcoal
    'linear-gradient(180deg, #1f2022 0%, #18191A 100%)',   // Vertical dark fade
    'linear-gradient(135deg, #0f0f10 0%, #18191A 50%, #27282a 100%)', // Deep black to charcoal
  ];

  // ===== LIGHT GREY GRADIENTS (3) =====
  const lightGreyGradients = [
    'linear-gradient(135deg, #eef1f9 0%, #ffffff 100%)',   // Light Grey to White
    'radial-gradient(ellipse at 50% 0%, #ffffff 0%, #eef1f9 50%, #d1d5eb 100%)', // Light radial
    'linear-gradient(135deg, #eef1f9 0%, #EEF2FF 50%, #d1d5eb 100%)', // Light Grey to Purple tint
  ];

  // Combined gradients array
  const gradients = [
    ...purpleConicals,
    ...purpleMeshes,
    ...orangeGradients,
    ...blackGradients,
    ...lightGreyGradients,
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
      className={`fixed top-[56px] h-[calc(100%-56px)] w-72 bg-gray-900 border-r border-gray-800 z-40 flex flex-col ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
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
          className={`flex-1 py-3 text-xs font-medium transition-colors ${activeTab === 'design' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Design
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('assets')}
          className={`flex-1 py-3 text-xs font-medium transition-colors ${activeTab === 'assets' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-500 hover:text-gray-300'}`}
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
                  <div key={idx} className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden group cursor-pointer hover:ring-2 hover:ring-orange-500 transition-all">
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
          
          {/* Your Docs Section */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Your Docs</h3>
              <span className="text-[10px] text-gray-500">{uploadedDocs.length}/{MAX_DOCS}</span>
            </div>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-3 text-center hover:border-gray-600 transition-colors cursor-pointer mb-3">
              <svg className="w-6 h-6 mx-auto mb-1.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-[10px] text-gray-400 mb-1">Drop specs here</p>
              <button type="button" className="px-2.5 py-1 bg-gray-700 hover:bg-gray-600 text-[10px] text-white rounded transition-colors">
                Browse
              </button>
              <p className="text-[9px] text-gray-600 mt-1.5">PDF, DOCX, TXT, MD</p>
            </div>
            <p className="text-[10px] text-gray-500 mb-3 flex items-center gap-1.5">
              <svg className="w-3 h-3 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" />
              </svg>
              <span>AI will generate projects from your specs</span>
            </p>
            {uploadedDocs.length === 0 ? (
              <div className="text-center py-4 bg-gray-800/30 rounded-lg">
                <svg className="w-8 h-8 mx-auto mb-2 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-[10px] text-gray-500">No docs uploaded</p>
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
          <div className="bg-gray-800/60 rounded-xl p-3">
            <div className="grid grid-cols-3 gap-3">
              {colorFields.map(field => (
                <div key={field.key} className="flex flex-col items-center gap-1.5">
                  <input
                    type="color"
                    value={designSystem[field.key]}
                    onChange={(e) => onUpdate({ ...designSystem, [field.key]: e.target.value })}
                    className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-600 hover:border-orange-500 transition-colors"
                  />
                  <span className="text-[10px] text-gray-400 font-medium">{field.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Fonts Section */}
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Fonts</h3>
          <div className="bg-gray-800/60 rounded-xl p-3 space-y-3">
            <div>
              <label className="text-[10px] text-gray-400 font-medium block mb-1.5">Heading Font</label>
              <select
                value={designSystem.headingFont}
                onChange={(e) => onUpdate({ ...designSystem, headingFont: e.target.value })}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-xs text-white hover:border-orange-500 focus:border-orange-500 focus:outline-none transition-colors cursor-pointer"
              >
                {allFonts.map(font => (
                  <option key={font.value} value={font.value}>{font.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-medium block mb-1.5">Body Font</label>
              <select
                value={designSystem.bodyFont}
                onChange={(e) => onUpdate({ ...designSystem, bodyFont: e.target.value })}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-xs text-white hover:border-orange-500 focus:border-orange-500 focus:outline-none transition-colors cursor-pointer"
              >
                {allFonts.map(font => (
                  <option key={font.value} value={font.value}>{font.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      
        {/* Backgrounds Section */}
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Backgrounds</h3>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {gradients.map((gradient, idx) => (
              <button
                type="button"
                key={idx}
                className="w-full aspect-square rounded-lg border-2 border-gray-700 hover:border-orange-500 transition-colors"
                style={{ background: gradient }}
              />
            ))}
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {solidColors.map(color => (
              <button
                type="button"
                key={color}
                className="w-full aspect-square rounded border-2 border-gray-700 hover:border-orange-500 transition-colors"
                style={{ backgroundColor: color }}
              />
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
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-gray-600 transition-colors cursor-pointer">
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
        </div>
        
        {/* Brand Patterns Section */}
        <div className="p-4">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Brand Patterns</h3>
          <p className="text-[10px] text-gray-500 mb-3">Data-driven visuals that tell the HelloData story</p>
          
          {/* Pattern Grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
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


