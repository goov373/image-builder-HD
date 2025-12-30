import { useState, useRef, useEffect } from 'react';
import { compressImages, formatFileSize, COMPRESSION_PRESETS } from '../utils';
import { uploadImage, listImages, deleteImage } from '../lib/storage';
import { isSupabaseConfigured } from '../lib/supabase';
import { getAllGradientCSSValues, getSolidColorHexValues } from '../data';
import { LIMITS } from '../config';
import ImageUploader from './design-panel/ImageUploader';
import ImageGrid from './design-panel/ImageGrid';
import { ApplyModeToggle, FrameRangeSlider } from './design-panel/GradientPicker';

/**
 * Design & Assets Panel
 * Combined Design System, Assets upload, and Backgrounds
 */
const DesignSystemPanel = ({ 
  designSystem, 
  onUpdate, 
  onClose, 
  isOpen,
  projectType = 'carousel', // 'carousel', 'eblast', 'videoCover', or 'singleImage'
  // Carousel-specific props
  selectedCarouselId,
  selectedFrameId,
  selectedCarouselFrames = [], // Array of frames in the selected carousel
  onSetFrameBackground,
  onSetRowStretchedBackground,
  onAddImageToFrame,
  // Pattern layer handlers (carousel)
  onAddPatternToFrame,
  onUpdatePatternLayer,
  onRemovePatternFromFrame,
  onSetRowStretchedPattern,
  // Eblast-specific props
  selectedEblastId,
  selectedSectionId,
  selectedEblastSections = [], // Array of sections in the selected eblast
  onSetSectionBackground,
  onSetStretchedBackground,
  onAddImageToSection,
  // Pattern layer handlers (eblast)
  onAddPatternToSection,
  onUpdatePatternLayerEblast,
  onRemovePatternFromSection,
  onSetStretchedPattern,
  // Video Cover-specific props
  selectedVideoCoverId,
  onSetVideoCoverBackground,
  onAddVideoCoverPattern,
  onUpdateVideoCoverPattern,
  onRemoveVideoCoverPattern,
  onAddVideoCoverImage,
  // Single Image-specific props
  selectedSingleImageId,
  onSetSingleImageBackgroundGradient,
  onAddSingleImagePattern,
  onUpdateSingleImagePattern,
  onRemoveSingleImagePattern,
}) => {
  // Normalize selection based on project type
  const isCarousel = projectType === 'carousel' || !projectType;
  const isEblast = projectType === 'eblast';
  const isVideoCover = projectType === 'videoCover';
  const isSingleImage = projectType === 'singleImage';
  
  // Unified selection state
  const hasFrameSelected = isCarousel 
    ? (selectedCarouselId !== null && selectedFrameId !== null)
    : isEblast
    ? (selectedEblastId !== null && selectedSectionId !== null)
    : isVideoCover
    ? selectedVideoCoverId !== null
    : isSingleImage
    ? selectedSingleImageId !== null
    : false;
    
  const hasRowSelected = isCarousel 
    ? selectedCarouselId !== null 
    : isEblast
    ? selectedEblastId !== null
    : false; // Video cover and single image don't have "row" concept
  
  // Unified items array (only carousel and eblast have multiple items)
  const items = isCarousel ? selectedCarouselFrames : isEblast ? selectedEblastSections : [];
  const totalFrames = items.length;
  
  const [applyMode, setApplyMode] = useState('frame'); // 'frame' or 'row'
  
  // Frame range selection for stretched gradients
  const [stretchRange, setStretchRange] = useState({ start: 0, end: null }); // null end means "all"
  
  // Get selected item's pattern layer
  const selectedItem = isCarousel 
    ? items.find(f => f.id === selectedFrameId)
    : items.find(s => s.id === selectedSectionId);
  
  // Calculate effective end (default to last frame if not set)
  const effectiveEnd = stretchRange.end !== null ? Math.min(stretchRange.end, totalFrames - 1) : totalFrames - 1;
  const selectedFrameCount = Math.max(0, effectiveEnd - stretchRange.start + 1);
  
  const handleBackgroundClick = (background) => {
    if (isCarousel) {
      if (applyMode === 'row' && hasRowSelected && onSetRowStretchedBackground) {
        const startIdx = stretchRange.start;
        const endIdx = stretchRange.end !== null ? stretchRange.end : totalFrames - 1;
        onSetRowStretchedBackground(selectedCarouselId, background, startIdx, endIdx);
      } else if (hasFrameSelected && onSetFrameBackground) {
        onSetFrameBackground(selectedCarouselId, selectedFrameId, background);
      }
    } else if (isEblast) {
      if (applyMode === 'row' && hasRowSelected && onSetStretchedBackground) {
        const startIdx = stretchRange.start;
        const endIdx = stretchRange.end !== null ? stretchRange.end : totalFrames - 1;
        onSetStretchedBackground(selectedEblastId, background, startIdx, endIdx);
      } else if (hasFrameSelected && onSetSectionBackground) {
        onSetSectionBackground(selectedEblastId, selectedSectionId, background);
      }
    } else if (isVideoCover) {
      if (hasFrameSelected && onSetVideoCoverBackground) {
        onSetVideoCoverBackground(selectedVideoCoverId, background);
      }
    } else if (isSingleImage) {
      if (hasFrameSelected && onSetSingleImageBackgroundGradient) {
        onSetSingleImageBackgroundGradient(selectedSingleImageId, background);
      }
    }
  };
  const [activeTab, setActiveTab] = useState('design'); // 'design' or 'assets'
  const [uploadedFiles, setUploadedFiles] = useState([]); // Compressed uploaded files
  const [uploadedDocs, setUploadedDocs] = useState([]); // Uploaded docs
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, fileName: '' });
  const [compressionPreset, setCompressionPreset] = useState('highQuality');
  const fileInputRef = useRef(null);
  const MAX_FILES = LIMITS.MAX_UPLOADED_FILES;
  const MAX_DOCS = LIMITS.MAX_UPLOADED_DOCS;

  // Load saved images from Supabase on mount
  useEffect(() => {
    const loadSavedImages = async () => {
      if (!isSupabaseConfigured()) {
        console.log('Supabase not configured - images will not persist');
        return;
      }

      setIsLoadingImages(true);
      try {
        const { files, error } = await listImages();
        if (error) {
          console.error('Failed to load images:', error);
        } else if (files.length > 0) {
          const loadedFiles = files.map(file => ({
            id: file.id,
            name: file.name,
            url: file.url,
            path: file.path,
            size: file.size,
            format: file.name.split('.').pop()?.toUpperCase() || 'IMG',
            isPersisted: true,
          }));
          setUploadedFiles(loadedFiles);
        }
      } catch (err) {
        console.error('Error loading images:', err);
      } finally {
        setIsLoadingImages(false);
      }
    };

    loadSavedImages();
  }, []);

  // Handle image upload with compression and Supabase persistence
  const handleImageUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Check max files limit
    if (uploadedFiles.length + files.length > MAX_FILES) {
      alert(`Maximum ${MAX_FILES} images allowed. You have ${uploadedFiles.length} images.`);
      return;
    }

    setIsUploading(true);
    setUploadProgress({ current: 0, total: files.length, fileName: 'Compressing...' });

    try {
      const preset = COMPRESSION_PRESETS[compressionPreset];
      
      // Step 1: Compress images
      const results = await compressImages(
        files,
        { preset },
        (current, total, fileName) => {
          setUploadProgress({ current, total, fileName: `Compressing: ${fileName}` });
        }
      );

      // Step 2: Upload to Supabase (if configured)
      const newFiles = [];
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        setUploadProgress({ 
          current: i, 
          total: results.length, 
          fileName: `Uploading: ${result.info.newName}` 
        });

        let url = URL.createObjectURL(result.blob);
        let path = null;
        let isPersisted = false;

        // Try to upload to Supabase
        if (isSupabaseConfigured()) {
          const uploadResult = await uploadImage(result.blob, result.info.newName);
          if (uploadResult.url && !uploadResult.error) {
            url = uploadResult.url;
            path = uploadResult.path;
            isPersisted = true;
          }
        }

        newFiles.push({
          id: Date.now() + Math.random(),
          name: result.info.newName,
          originalName: result.info.originalName,
          url,
          path,
          size: result.info.compressedSize,
          originalSize: result.info.originalSize,
          savings: result.info.savings,
          dimensions: result.info.newDimensions,
          format: result.info.format.toUpperCase(),
          isPersisted,
        });
      }

      setUploadedFiles(prev => [...prev, ...newFiles]);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to process images. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0, fileName: '' });
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle file removal (also deletes from Supabase if persisted)
  const handleRemoveFile = async (fileId) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    
    // Remove from state immediately for responsive UI
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    
    // Delete from Supabase if it was persisted
    if (file?.path && file?.isPersisted) {
      const { error } = await deleteImage(file.path);
      if (error) {
        console.error('Failed to delete from storage:', error);
        // Optionally re-add to state on error
      }
    }
    
    // Revoke blob URL if it's a local blob
    if (file?.url && file.url.startsWith('blob:')) {
      URL.revokeObjectURL(file.url);
    }
  };

  // Handle drag and drop
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      // Create a synthetic event for the handler
      handleImageUpload({ target: { files } });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // Calculate total storage used
  const totalStorageUsed = uploadedFiles.reduce((acc, file) => acc + (file.size || 0), 0);
  const totalOriginalSize = uploadedFiles.reduce((acc, file) => acc + (file.originalSize || 0), 0);
  const totalSavings = totalOriginalSize > 0 ? Math.round((1 - totalStorageUsed / totalOriginalSize) * 100) : 0;

  
  const colorFields = [
    { key: 'primary', label: 'Primary' },
    { key: 'secondary', label: 'Secondary' },
    { key: 'accent', label: 'Accent' },
    { key: 'neutral1', label: 'Dark' },
    { key: 'neutral2', label: 'Mid' },
    { key: 'neutral3', label: 'Light' },
  ];

  // Use centralized gradient and color definitions from data layer
  const gradients = getAllGradientCSSValues();
  const solidColors = getSolidColorHexValues();
  
  return (
    <>
      {/* Decorative Diagonal Lines Pattern - In header/tab bar area */}
      <div 
        className={`fixed top-0 h-[56px] w-72 z-30 ${isOpen ? 'pointer-events-none' : 'pointer-events-none'}`}
        style={{ 
          left: isOpen ? 64 : -224, 
          transition: 'left 0.3s ease-out',
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 6px,
            rgba(100, 102, 233, 0.15) 6px,
            rgba(100, 102, 233, 0.15) 7px
          )`,
        }}
      />
      
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
          {/* Upload Section - Using extracted ImageUploader component */}
          <ImageUploader
            onUpload={handleImageUpload}
            onDrop={handleDrop}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            compressionPreset={compressionPreset}
            onPresetChange={setCompressionPreset}
            currentCount={uploadedFiles.length}
            maxCount={MAX_FILES}
          />
          
          {/* Storage Stats */}
          {uploadedFiles.length > 0 && (
            <div className="px-4 pb-4 -mt-2">
              <div className="p-2 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-500">Storage used:</span>
                  <span className="text-white">{formatFileSize(totalStorageUsed)}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex items-center justify-between text-[10px] mt-1">
                    <span className="text-gray-500">Space saved:</span>
                    <span className="text-green-400">{totalSavings}% ({formatFileSize(totalOriginalSize - totalStorageUsed)})</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* File Browser - Using extracted ImageGrid component */}
          <ImageGrid
            images={uploadedFiles}
            isLoading={isLoadingImages}
            onRemove={handleRemoveFile}
          />
          
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
          
          {/* Apply Mode Toggle - Using extracted component */}
          {hasRowSelected && (
            <ApplyModeToggle 
              mode={applyMode} 
              onChange={setApplyMode} 
            />
          )}
          
          {/* Frame Range Selector - Using extracted component */}
          {applyMode === 'row' && hasRowSelected && totalFrames > 1 && (
            <>
              <FrameRangeSlider
                start={stretchRange.start}
                end={effectiveEnd}
                total={totalFrames}
                onChange={({ start, end }) => setStretchRange({ start, end })}
              />
              <div className="mb-3 -mt-1 text-[10px] text-gray-500 text-center">
                Stretching across {selectedFrameCount} frame{selectedFrameCount > 1 ? 's' : ''}
              </div>
            </>
          )}
          
          {/* Single frame message */}
          {applyMode === 'row' && hasRowSelected && totalFrames === 1 && (
            <div className="mb-3 p-2 bg-gray-800/50 rounded-lg text-[10px] text-gray-500 text-center">
              Add more frames to use stretch mode
            </div>
          )}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {gradients.map((gradient, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => handleBackgroundClick(gradient)}
                disabled={!hasFrameSelected}
                className={`w-full aspect-square rounded-lg transition-colors overflow-hidden ${
                  hasFrameSelected 
                    ? 'ring-1 ring-gray-700 hover:ring-gray-400 hover:scale-105 cursor-pointer' 
                    : 'ring-1 ring-gray-700/50 opacity-50 cursor-not-allowed'
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
        
        {/* Photography Section - Displays images from Assets tab */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Photography</h3>
            {hasFrameSelected ? (
              <span className="text-[10px] text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Click to add to frame
              </span>
            ) : uploadedFiles.length > 0 ? (
              <span className="text-[10px] text-gray-500">Select a frame first</span>
            ) : null}
          </div>
          
          {/* Display uploaded images from Assets tab */}
          {uploadedFiles.length === 0 ? (
            <div className="text-center py-6 border-2 border-dashed border-gray-700 rounded-lg">
              <svg className="w-8 h-8 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-[10px] text-gray-500 mb-2">No images uploaded yet</p>
              <button 
                type="button" 
                onClick={() => setActiveTab('assets')}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-xs text-white rounded-lg transition-colors"
              >
                Go to Assets to upload
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 mb-3">
              {uploadedFiles.map((file) => (
                <button
                  key={file.id}
                  type="button"
                  disabled={!hasFrameSelected}
                  className={`bg-gray-800 rounded-lg overflow-hidden transition-all text-left ${
                    hasFrameSelected 
                      ? 'hover:ring-2 hover:ring-blue-400 hover:scale-[1.02] cursor-pointer' 
                      : 'opacity-60 cursor-not-allowed'
                  }`}
                  onClick={() => {
                    if (isCarousel && hasFrameSelected && onAddImageToFrame) {
                      onAddImageToFrame(selectedCarouselId, selectedFrameId, file.url);
                    } else if (isEblast && hasFrameSelected && onAddImageToSection) {
                      onAddImageToSection(selectedEblastId, selectedSectionId, file.url);
                    } else if (isVideoCover && hasFrameSelected && onAddVideoCoverImage) {
                      onAddVideoCoverImage(selectedVideoCoverId, file.url);
                    }
                    // Note: Single Image uses its own layer system for images
                  }}
                  title={hasFrameSelected ? `Click to add "${file.name}" to selected frame` : 'Select a frame first'}
                >
                  {/* Header bar */}
                  <div className="flex items-center justify-between px-2 py-1.5 bg-gray-900 border-b border-gray-700">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 bg-gray-700 rounded text-[10px] text-gray-300 uppercase font-medium">{file.format}</span>
                      {file.isPersisted && (
                        <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" title="Saved to cloud">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        </svg>
                      )}
                    </div>
                    {/* Add indicator when frame selected */}
                    {hasFrameSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {/* Image */}
                  <div className="aspect-square">
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                  </div>
                  {/* Footer bar */}
                  <div className="px-2 py-2 bg-gray-900 border-t border-gray-700">
                    <p className="text-[11px] text-gray-300 truncate font-medium" title={file.name}>{file.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-gray-500">{formatFileSize(file.size)}</span>
                      {file.savings > 0 && (
                        <span className="text-[10px] text-green-400 font-medium">-{file.savings}%</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          
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
    </>
  );
};

export default DesignSystemPanel;


