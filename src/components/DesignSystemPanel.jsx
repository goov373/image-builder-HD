import { useState } from 'react';
import { allFonts } from '../data';

/**
 * Design & Assets Panel
 * Combined Design System, Assets upload, and Backgrounds
 */
const DesignSystemPanel = ({ designSystem, onUpdate, onClose, isOpen }) => {
  const [activeTab, setActiveTab] = useState('design'); // 'design' or 'assets'
  const [uploadedFiles, setUploadedFiles] = useState([]); // Mock uploaded files
  const MAX_FILES = 50;
  
  const colorFields = [
    { key: 'primary', label: 'Primary' },
    { key: 'secondary', label: 'Secondary' },
    { key: 'accent', label: 'Accent' },
    { key: 'neutral1', label: 'Dark' },
    { key: 'neutral2', label: 'Mid' },
    { key: 'neutral3', label: 'Light' },
  ];

  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  ];

  const solidColors = ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'];
  
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
        <div className="p-4">
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
        </>
      )}
      </div>
    </div>
  );
};

export default DesignSystemPanel;


