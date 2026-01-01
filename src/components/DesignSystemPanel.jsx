import { useState, useRef, useEffect } from 'react';
import { compressImages, formatFileSize, COMPRESSION_PRESETS, logger } from '../utils';
import {
  uploadImage,
  listImages,
  deleteImage,
  uploadProductImage,
  listProductImages,
  deleteProductImage,
  uploadDoc,
  listDocs,
  deleteDoc,
} from '../lib/storage';
import { isSupabaseConfigured } from '../lib/supabase';
import { getAllGradientCSSValues, allGradients } from '../data';
import { LIMITS } from '../config';
import ImageUploader from './design-panel/ImageUploader';
import ImageGrid from './design-panel/ImageGrid';
import { ApplyModeToggle, FrameRangeSlider } from './design-panel/GradientPicker';
import { BrandColorsSection, FontsSection, BrandIconsSection } from './design-panel/sections';
import { useToast } from './ui/Toast';

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
  onAddProductImageToFrame,
  onAddIconToFrame,
  // Progress indicator handler (carousel)
  onUpdateProgressIndicator,
  // Pattern layer handlers (carousel)
  onAddPatternToFrame,
  onUpdatePatternLayer: _onUpdatePatternLayer,
  onRemovePatternFromFrame: _onRemovePatternFromFrame,
  onSetRowStretchedPattern: _onSetRowStretchedPattern,
  // Control which section to expand when panel opens
  expandSectionOnOpen,
  // Eblast-specific props
  selectedEblastId,
  selectedSectionId,
  selectedEblastSections = [], // Array of sections in the selected eblast
  onSetSectionBackground,
  onSetStretchedBackground,
  onAddImageToSection,
  // Pattern layer handlers (eblast)
  onAddPatternToSection,
  onUpdatePatternLayerEblast: _onUpdatePatternLayerEblast,
  onRemovePatternFromSection: _onRemovePatternFromSection,
  onSetStretchedPattern: _onSetStretchedPattern,
  // Video Cover-specific props
  selectedVideoCoverId,
  onSetVideoCoverBackground,
  onAddVideoCoverPattern: _onAddVideoCoverPattern,
  onUpdateVideoCoverPattern: _onUpdateVideoCoverPattern,
  onRemoveVideoCoverPattern: _onRemoveVideoCoverPattern,
  onAddVideoCoverImage,
  // Single Image-specific props
  selectedSingleImageId,
  onSetSingleImageBackgroundGradient,
  onAddSingleImagePattern: _onAddSingleImagePattern,
  onUpdateSingleImagePattern: _onUpdateSingleImagePattern,
  onRemoveSingleImagePattern: _onRemoveSingleImagePattern,
}) => {
  // Normalize selection based on project type
  const isCarousel = projectType === 'carousel' || !projectType;
  const isEblast = projectType === 'eblast';
  const isVideoCover = projectType === 'videoCover';
  const isSingleImage = projectType === 'singleImage';

  // Unified selection state
  const hasFrameSelected = isCarousel
    ? selectedCarouselId !== null && selectedFrameId !== null
    : isEblast
      ? selectedEblastId !== null && selectedSectionId !== null
      : isVideoCover
        ? selectedVideoCoverId !== null
        : isSingleImage
          ? selectedSingleImageId !== null
          : false;

  const hasRowSelected = isCarousel ? selectedCarouselId !== null : isEblast ? selectedEblastId !== null : false; // Video cover and single image don't have "row" concept

  // Unified items array (only carousel and eblast have multiple items)
  const items = isCarousel ? selectedCarouselFrames : isEblast ? selectedEblastSections : [];
  const totalFrames = items.length;

  const [applyMode, setApplyMode] = useState('frame'); // 'frame' or 'row'

  // Frame range selection for stretched gradients
  const [stretchRange, setStretchRange] = useState({ start: 0, end: null }); // null end means "all"

  // Get selected item's pattern layer
  const selectedItem = isCarousel
    ? items.find((f) => f.id === selectedFrameId)
    : items.find((s) => s.id === selectedSectionId);

  // Calculate effective end (default to last frame if not set)
  const effectiveEnd = stretchRange.end !== null ? Math.min(stretchRange.end, totalFrames - 1) : totalFrames - 1;
  const selectedFrameCount = Math.max(0, effectiveEnd - stretchRange.start + 1);

  // Toast notifications for batch operations
  const { addToast } = useToast();

  const handleBackgroundClick = (background) => {
    if (isCarousel) {
      if (applyMode === 'row' && hasRowSelected && onSetRowStretchedBackground) {
        const startIdx = stretchRange.start;
        const endIdx = stretchRange.end !== null ? stretchRange.end : totalFrames - 1;
        const frameCount = endIdx - startIdx + 1;
        onSetRowStretchedBackground(selectedCarouselId, background, startIdx, endIdx);
        addToast(`Applied to ${frameCount} frames`, { type: 'success', duration: 2000 });
      } else if (hasFrameSelected && onSetFrameBackground) {
        onSetFrameBackground(selectedCarouselId, selectedFrameId, background);
      }
    } else if (isEblast) {
      if (applyMode === 'row' && hasRowSelected && onSetStretchedBackground) {
        const startIdx = stretchRange.start;
        const endIdx = stretchRange.end !== null ? stretchRange.end : totalFrames - 1;
        const sectionCount = endIdx - startIdx + 1;
        onSetStretchedBackground(selectedEblastId, background, startIdx, endIdx);
        addToast(`Applied to ${sectionCount} sections`, { type: 'success', duration: 2000 });
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
  const [uploadedProductImages, setUploadedProductImages] = useState([]); // Product imagery uploads
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, fileName: '' });
  const [compressionPreset, setCompressionPreset] = useState('highQuality');

  // Default order for design dropdown sections
  const defaultSectionOrder = [
    'brandColors',
    'fonts',
    'pageIndicators',
    'backgrounds',
    'productImagery',
    'photography',
    'patterns',
    'brandIcons',
  ];

  // Track which single section is open (null = all closed), and dynamic section order
  // Persist to localStorage for user preference retention
  const [openSection, setOpenSection] = useState(() => {
    try {
      const saved = localStorage.getItem('designPanel.openSection');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [sectionOrder, setSectionOrder] = useState(() => {
    try {
      const saved = localStorage.getItem('designPanel.sectionOrder');
      return saved ? JSON.parse(saved) : defaultSectionOrder;
    } catch {
      return defaultSectionOrder;
    }
  });

  // Persist open section changes
  useEffect(() => {
    try {
      localStorage.setItem('designPanel.openSection', JSON.stringify(openSection));
    } catch {
      /* ignore storage errors */
    }
  }, [openSection]);

  // Persist section order changes
  useEffect(() => {
    try {
      localStorage.setItem('designPanel.sectionOrder', JSON.stringify(sectionOrder));
    } catch {
      /* ignore storage errors */
    }
  }, [sectionOrder]);

  // Assets tab sections (separate from design sections)
  const [openAssetSection, setOpenAssetSection] = useState(null);

  // Helper to check if a section is collapsed (for compatibility)
  const collapsedSections = {
    brandColors: openSection !== 'brandColors',
    fonts: openSection !== 'fonts',
    pageIndicators: openSection !== 'pageIndicators',
    backgrounds: openSection !== 'backgrounds',
    patterns: openSection !== 'patterns',
    productImagery: openSection !== 'productImagery',
    photography: openSection !== 'photography',
    brandIcons: openSection !== 'brandIcons',
    // Assets sections
    yourImages: openAssetSection !== 'yourImages',
    yourDocs: openAssetSection !== 'yourDocs',
    yourProductImages: openAssetSection !== 'yourProductImages',
  };

  // Toggle a section - only one can be open at a time
  const toggleSection = (section) => {
    // Check if this is an asset section
    const assetSections = ['yourImages', 'yourDocs', 'yourProductImages'];
    if (assetSections.includes(section)) {
      setOpenAssetSection((prev) => (prev === section ? null : section));
    } else {
      // Design sections - also reorder to put clicked section at top
      if (openSection === section) {
        setOpenSection(null);
      } else {
        setOpenSection(section);
        // Move this section to the top of the order
        setSectionOrder((prev) => {
          if (prev[0] === section) return prev;
          return [section, ...prev.filter((s) => s !== section)];
        });
      }
    }
  };

  // Expand and prioritize a specific section when triggered by tag click
  useEffect(() => {
    if (expandSectionOnOpen) {
      // Open this section and move it to top
      setOpenSection(expandSectionOnOpen);
      setSectionOrder((prev) => {
        if (prev[0] === expandSectionOnOpen) return prev;
        return [expandSectionOnOpen, ...prev.filter((s) => s !== expandSectionOnOpen)];
      });
    }
  }, [expandSectionOnOpen]);

  // Close all sections when sidebar closes
  useEffect(() => {
    if (!isOpen) {
      setOpenSection(null);
      setOpenAssetSection(null);
      setSectionOrder(defaultSectionOrder);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- defaultSectionOrder is stable, only run on isOpen change
  }, [isOpen]);

  // Close all sections when switching tabs
  useEffect(() => {
    setOpenSection(null);
    setOpenAssetSection(null);
  }, [activeTab]);
  const fileInputRef = useRef(null);
  const MAX_FILES = LIMITS.MAX_UPLOADED_FILES;
  const MAX_DOCS = LIMITS.MAX_UPLOADED_DOCS;

  // Load saved assets from Supabase on mount
  useEffect(() => {
    const loadSavedAssets = async () => {
      if (!isSupabaseConfigured()) {
        logger.log('Supabase not configured - assets will not persist');
        return;
      }

      setIsLoadingImages(true);
      try {
        // Load images
        const { files: imageFiles, error: imageError } = await listImages();
        if (imageError) {
          logger.error('Failed to load images:', imageError);
        } else if (imageFiles.length > 0) {
          const loadedFiles = imageFiles.map((file) => ({
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

        // Load product images
        const { files: productFiles, error: productError } = await listProductImages();
        if (productError) {
          logger.error('Failed to load product images:', productError);
        } else if (productFiles.length > 0) {
          const loadedProductImages = productFiles.map((file) => ({
            id: file.id,
            name: file.name,
            url: file.url,
            path: file.path,
            size: file.size,
            isPersisted: true,
          }));
          setUploadedProductImages(loadedProductImages);
        }

        // Load docs
        const { files: docFiles, error: docError } = await listDocs();
        if (docError) {
          logger.error('Failed to load docs:', docError);
        } else if (docFiles.length > 0) {
          const loadedDocs = docFiles.map((file) => ({
            id: file.id,
            name: file.name,
            url: file.url,
            path: file.path,
            size: file.size,
            isPersisted: true,
          }));
          setUploadedDocs(loadedDocs);
        }
      } catch (err) {
        logger.error('Error loading assets:', err);
      } finally {
        setIsLoadingImages(false);
      }
    };

    loadSavedAssets();
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
      const results = await compressImages(files, { preset }, (current, total, fileName) => {
        setUploadProgress({ current, total, fileName: `Compressing: ${fileName}` });
      });

      // Step 2: Upload to Supabase (if configured)
      const newFiles = [];
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        setUploadProgress({
          current: i,
          total: results.length,
          fileName: `Uploading: ${result.info.newName}`,
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

      setUploadedFiles((prev) => [...prev, ...newFiles]);
    } catch (error) {
      logger.error('Upload failed:', error);
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
    const file = uploadedFiles.find((f) => f.id === fileId);

    // Remove from state immediately for responsive UI
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));

    // Delete from Supabase if it was persisted
    if (file?.path && file?.isPersisted) {
      const { error } = await deleteImage(file.path);
      if (error) {
        logger.error('Failed to delete from storage:', error);
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

  // Handler for drag over events - defined for use with onDragOver handlers
  const _handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // Handle product imagery upload
  const handleProductImageUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (const file of files) {
      // Validate file type (prefer PNG for transparency)
      if (!file.type.startsWith('image/')) {
        alert('Please upload image files only (PNG recommended for transparency)');
        continue;
      }

      try {
        let url = URL.createObjectURL(file);
        let path = null;
        let isPersisted = false;

        // Upload to Supabase
        if (isSupabaseConfigured()) {
          const uploadResult = await uploadProductImage(file, file.name);
          if (uploadResult.url && !uploadResult.error) {
            url = uploadResult.url;
            path = uploadResult.path;
            isPersisted = true;
          }
        }

        setUploadedProductImages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            name: file.name,
            url,
            path,
            size: file.size,
            isPersisted,
          },
        ]);
      } catch (error) {
        logger.error('Product image upload failed:', error);
      }
    }
  };

  // Handle product image removal
  const handleRemoveProductImage = async (imageId) => {
    const image = uploadedProductImages.find((img) => img.id === imageId);

    setUploadedProductImages((prev) => prev.filter((img) => img.id !== imageId));

    if (image?.path && image?.isPersisted) {
      await deleteProductImage(image.path);
    }

    if (image?.url && image.url.startsWith('blob:')) {
      URL.revokeObjectURL(image.url);
    }
  };

  // Handle doc upload
  const handleDocUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (uploadedDocs.length + files.length > MAX_DOCS) {
      alert(`Maximum ${MAX_DOCS} documents allowed. You have ${uploadedDocs.length} documents.`);
      return;
    }

    for (const file of files) {
      // Validate file type
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/markdown',
      ];
      const validExtensions = ['pdf', 'doc', 'docx', 'txt', 'md'];
      const ext = file.name.split('.').pop()?.toLowerCase();

      if (!validTypes.includes(file.type) && !validExtensions.includes(ext)) {
        alert('Please upload PDF, DOCX, TXT, or MD files only');
        continue;
      }

      try {
        let url = URL.createObjectURL(file);
        let path = null;
        let isPersisted = false;

        // Upload to Supabase
        if (isSupabaseConfigured()) {
          const uploadResult = await uploadDoc(file, file.name);
          if (uploadResult.url && !uploadResult.error) {
            url = uploadResult.url;
            path = uploadResult.path;
            isPersisted = true;
          }
        }

        setUploadedDocs((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            name: file.name,
            url,
            path,
            size: file.size,
            isPersisted,
          },
        ]);
      } catch (error) {
        logger.error('Doc upload failed:', error);
      }
    }
  };

  // Handle doc removal
  const handleRemoveDoc = async (docId) => {
    const doc = uploadedDocs.find((d) => d.id === docId);

    setUploadedDocs((prev) => prev.filter((d) => d.id !== docId));

    if (doc?.path && doc?.isPersisted) {
      await deleteDoc(doc.path);
    }

    if (doc?.url && doc.url.startsWith('blob:')) {
      URL.revokeObjectURL(doc.url);
    }
  };

  // Calculate total storage used (available for future storage UI)
  const totalStorageUsed = uploadedFiles.reduce((acc, file) => acc + (file.size || 0), 0);
  const totalOriginalSize = uploadedFiles.reduce((acc, file) => acc + (file.originalSize || 0), 0);
  const _totalSavings = totalOriginalSize > 0 ? Math.round((1 - totalStorageUsed / totalOriginalSize) * 100) : 0;

  // Color field definitions for future color editing UI
  const _colorFields = [
    { key: 'primary', label: 'Primary' },
    { key: 'secondary', label: 'Secondary' },
    { key: 'accent', label: 'Accent' },
    { key: 'neutral1', label: 'Dark' },
    { key: 'neutral2', label: 'Mid' },
    { key: 'neutral4', label: 'Light Grey' },
    { key: 'primary2', label: 'Primary 2' },
    { key: 'accent2', label: 'Accent 2' },
    { key: 'neutral3', label: 'Light' },
  ];

  // Use centralized gradient definitions from data layer
  const gradients = getAllGradientCSSValues();

  // Dynamic solid colors linked to brand colors from designSystem
  const solidColors = [
    designSystem.primary,
    designSystem.secondary,
    designSystem.accent,
    designSystem.neutral1,
    designSystem.neutral2,
    designSystem.neutral4,
    designSystem.primary2,
    designSystem.accent2,
    designSystem.neutral3,
  ];

  return (
    <>
      <div
        className={`fixed top-[56px] h-[calc(100%-56px)] w-72 bg-gray-900 border-r border-t border-gray-800 z-40 flex flex-col ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{ left: isOpen ? 64 : -224, transition: 'left 0.3s ease-out' }}
      >
        {/* Fixed Header */}
        <div
          className="flex-shrink-0 px-4 border-b border-gray-800 flex items-center justify-between"
          style={{ height: 64 }}
        >
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
        <div className="flex-1 overflow-y-scroll overflow-x-hidden pl-2">
          {activeTab === 'assets' ? (
            <>
              {/* Upload Section - Using extracted ImageUploader component */}
              <div className="border-b border-gray-800">
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
              </div>

              {/* File Browser - Collapsible Your Images section */}
              <div className="border-b border-gray-800">
                <button
                  type="button"
                  onClick={() => toggleSection('yourImages')}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                >
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Your Images</h3>
                  <div className="flex items-center gap-2">
                    {uploadedFiles.length > 0 && (
                      <span className="px-1.5 py-0.5 bg-gray-700 rounded text-[10px] text-gray-300">
                        {uploadedFiles.length}
                      </span>
                    )}
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform ${collapsedSections.yourImages ? '' : 'rotate-180'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {!collapsedSections.yourImages && (
                  <ImageGrid images={uploadedFiles} isLoading={isLoadingImages} onRemove={handleRemoveFile} />
                )}
              </div>

              {/* Product Imagery Upload Section */}
              <div className="p-4 border-t border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Upload Product Images</h3>
                </div>
                <div
                  className="border-2 border-dashed border-gray-700 rounded p-4 text-center hover:border-gray-600 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('product-imagery-input')?.click()}
                >
                  <input
                    id="product-imagery-input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleProductImageUpload}
                    className="hidden"
                  />
                  <svg
                    className="w-8 h-8 mx-auto mb-2 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <p className="text-xs text-gray-400 mb-1">Product shots & mockups</p>
                  <button
                    type="button"
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-xs text-white rounded transition-colors"
                  >
                    Upload imagery
                  </button>
                  <p className="text-[10px] text-gray-600 mt-2">PNG with transparent background</p>
                </div>
              </div>

              {/* Your Product Images - Collapsible */}
              <div className="border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => toggleSection('yourProductImages')}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                >
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Your Product Images</h3>
                  <div className="flex items-center gap-2">
                    {uploadedProductImages.length > 0 && (
                      <span className="px-1.5 py-0.5 bg-gray-700 rounded text-[10px] text-gray-300">
                        {uploadedProductImages.length}
                      </span>
                    )}
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform ${collapsedSections.yourProductImages ? '' : 'rotate-180'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {!collapsedSections.yourProductImages && (
                  <div className="px-4 pb-4">
                    {uploadedProductImages.length === 0 ? (
                      <div className="text-center py-6">
                        <svg
                          className="w-10 h-10 mx-auto mb-2 text-gray-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                        <p className="text-xs text-gray-500">No product images yet</p>
                        <p className="text-[10px] text-gray-600 mt-1">Upload product shots above</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {uploadedProductImages.map((img) => (
                          <div
                            key={img.id}
                            className="relative group aspect-square rounded overflow-hidden bg-gray-800"
                          >
                            <img src={img.url} alt={img.name} className="w-full h-full object-contain" />
                            <button
                              type="button"
                              onClick={() => handleRemoveProductImage(img.id)}
                              className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Upload Docs Section */}
              <div className="p-4 border-t border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Upload Docs</h3>
                  <span className="text-[10px] text-gray-500">
                    {uploadedDocs.length}/{MAX_DOCS}
                  </span>
                </div>
                <div
                  className="border-2 border-dashed border-gray-700 rounded p-4 text-center hover:border-gray-600 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('docs-input')?.click()}
                >
                  <input
                    id="docs-input"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.md"
                    multiple
                    onChange={handleDocUpload}
                    className="hidden"
                  />
                  <svg
                    className="w-8 h-8 mx-auto mb-2 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-xs text-gray-400 mb-1">Drop docs here</p>
                  <button
                    type="button"
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-xs text-white rounded transition-colors"
                  >
                    Browse files
                  </button>
                  <p className="text-[10px] text-gray-600 mt-2">PDF, DOCX, TXT, MD up to 10MB each</p>
                </div>
              </div>

              {/* Your Docs Browser - Collapsible */}
              <div className="border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => toggleSection('yourDocs')}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                >
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Your Docs</h3>
                  <div className="flex items-center gap-2">
                    {uploadedDocs.length > 0 && (
                      <span className="px-1.5 py-0.5 bg-gray-700 rounded text-[10px] text-gray-300">
                        {uploadedDocs.length}
                      </span>
                    )}
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform ${collapsedSections.yourDocs ? '' : 'rotate-180'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {!collapsedSections.yourDocs && (
                  <div className="px-4 pb-4">
                    {uploadedDocs.length === 0 ? (
                      <div className="text-center py-8">
                        <svg
                          className="w-12 h-12 mx-auto mb-3 text-gray-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="text-xs text-gray-500">No docs uploaded yet</p>
                        <p className="text-[10px] text-gray-600 mt-1">Upload docs to use in your designs</p>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {uploadedDocs.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center gap-2 px-2.5 py-2 bg-gray-800/50 rounded group hover:bg-gray-800 transition-colors"
                          >
                            <svg
                              className="w-4 h-4 text-purple-400 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <span className="text-[11px] text-gray-300 flex-1 truncate">{doc.name}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveDoc(doc.id)}
                              className="p-1 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Colors Section - Extracted */}
              <BrandColorsSection
                designSystem={designSystem}
                onUpdate={onUpdate}
                isCollapsed={collapsedSections.brandColors}
                onToggle={() => toggleSection('brandColors')}
                order={sectionOrder.indexOf('brandColors')}
              />

              {/* Fonts Section - Extracted */}
              <FontsSection
                designSystem={designSystem}
                onUpdate={onUpdate}
                isCollapsed={collapsedSections.fonts}
                onToggle={() => toggleSection('fonts')}
                order={sectionOrder.indexOf('fonts')}
              />

              {/* Dynamic Dropdown Sections - rendered in order based on sectionOrder */}
              <div className="flex flex-col">
                {/* Page Indicators Section */}
                <div className="border-b border-gray-800" style={{ order: sectionOrder.indexOf('pageIndicators') }}>
                  <button
                    type="button"
                    onClick={() => toggleSection('pageIndicators')}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Add Indicator</h3>
                      <span className="px-1.5 py-0.5 bg-gray-700 rounded text-[10px] text-gray-400">6</span>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform ${collapsedSections.pageIndicators ? '' : 'rotate-180'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {!collapsedSections.pageIndicators && (
                    <div className="px-4 pt-2 pb-4">
                      <p className="text-[10px] text-gray-500 mb-3">Choose a style for frame position indicators</p>

                      {/* Indicator Style Grid - 2 columns */}
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { type: 'dots', name: 'Dots', desc: 'Classic dot indicators' },
                          { type: 'arrows', name: 'Arrows', desc: 'Chevron navigation' },
                          { type: 'bar', name: 'Loading Bar', desc: 'Progress bar style' },
                          { type: 'mapPins', name: 'Map Pins', desc: 'GPS waypoints' },
                          { type: 'forecast', name: 'Forecast', desc: 'Trend line markers' },
                          { type: 'barChart', name: 'Bar Chart', desc: 'Mini chart bars' },
                        ].map((indicator) => {
                          const currentType = selectedItem?.progressIndicator?.type || 'dots';
                          const isSelected = currentType === indicator.type;
                          return (
                            <button
                              key={indicator.type}
                              type="button"
                              onClick={() => {
                                if (isCarousel && hasFrameSelected && onUpdateProgressIndicator) {
                                  onUpdateProgressIndicator(selectedCarouselId, selectedFrameId, {
                                    type: indicator.type,
                                    isHidden: false,
                                  });
                                }
                              }}
                              disabled={!hasFrameSelected}
                              className={`group relative p-3 rounded border transition-all ${
                                hasFrameSelected
                                  ? isSelected
                                    ? 'border-gray-400 bg-gray-600/30'
                                    : 'border-gray-700 hover:border-gray-500 bg-gray-800/50'
                                  : 'border-gray-700/50 opacity-50 cursor-not-allowed'
                              }`}
                              title={indicator.desc}
                            >
                              {/* Preview of the indicator style */}
                              <div className="flex justify-center mb-2 h-5 items-center">
                                {indicator.type === 'dots' && (
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                      <div
                                        key={i}
                                        className="w-1.5 h-1.5 rounded-full bg-white"
                                        style={{ opacity: i === 3 ? 1 : 0.3 }}
                                      />
                                    ))}
                                  </div>
                                )}
                                {indicator.type === 'arrows' && (
                                  <div className="flex items-center gap-1.5">
                                    <svg
                                      className="w-3.5 h-3.5 text-white/50"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                      />
                                    </svg>
                                    <span className="text-[9px] text-white font-medium">3/5</span>
                                    <svg
                                      className="w-3.5 h-3.5 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                      />
                                    </svg>
                                  </div>
                                )}
                                {indicator.type === 'bar' && (
                                  <div className="w-12 h-1 rounded-full bg-white/20 overflow-hidden">
                                    <div className="h-full w-3/5 bg-white rounded-full" />
                                  </div>
                                )}
                                {indicator.type === 'mapPins' && (
                                  <svg width="48" height="14" viewBox="0 0 48 14" fill="none">
                                    <path
                                      d="M2 10 Q12 3, 24 6 Q36 9, 46 5"
                                      stroke="white"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeOpacity="0.25"
                                      fill="none"
                                    />
                                    {[
                                      { x: 2, y: 10 },
                                      { x: 13, y: 4 },
                                      { x: 24, y: 6 },
                                      { x: 35, y: 8 },
                                      { x: 46, y: 5 },
                                    ].map((pos, i) => (
                                      <g key={i}>
                                        <circle
                                          cx={pos.x}
                                          cy={pos.y - 2}
                                          r="2"
                                          fill="white"
                                          fillOpacity={i === 2 ? 1 : 0.3}
                                        />
                                        <line
                                          x1={pos.x}
                                          y1={pos.y}
                                          x2={pos.x}
                                          y2={pos.y + 2}
                                          stroke="white"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                          strokeOpacity={i === 2 ? 1 : 0.3}
                                        />
                                      </g>
                                    ))}
                                  </svg>
                                )}
                                {indicator.type === 'forecast' && (
                                  <svg width="44" height="14" viewBox="0 0 44 14" fill="none">
                                    <path
                                      d="M2 11 L11 8 L22 9 L33 5 L42 2"
                                      stroke="white"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeOpacity="0.25"
                                      fill="none"
                                    />
                                    {[
                                      { x: 2, y: 11 },
                                      { x: 11, y: 8 },
                                      { x: 22, y: 9 },
                                      { x: 33, y: 5 },
                                      { x: 42, y: 2 },
                                    ].map((pos, i) => (
                                      <g key={i} opacity={i === 2 ? 1 : 0.3}>
                                        <line
                                          x1={pos.x - 2}
                                          y1={pos.y - 2}
                                          x2={pos.x + 2}
                                          y2={pos.y + 2}
                                          stroke="white"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                        />
                                        <line
                                          x1={pos.x + 2}
                                          y1={pos.y - 2}
                                          x2={pos.x - 2}
                                          y2={pos.y + 2}
                                          stroke="white"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                        />
                                      </g>
                                    ))}
                                  </svg>
                                )}
                                {indicator.type === 'barChart' && (
                                  <svg width="36" height="14" viewBox="0 0 36 14" fill="none">
                                    {[
                                      { x: 2, h: 6 },
                                      { x: 9, h: 10 },
                                      { x: 16, h: 5 },
                                      { x: 23, h: 12 },
                                      { x: 30, h: 8 },
                                    ].map((bar, i) => (
                                      <rect
                                        key={i}
                                        x={bar.x}
                                        y={14 - bar.h}
                                        width="4"
                                        height={bar.h}
                                        rx="1"
                                        fill="white"
                                        fillOpacity={i === 2 ? 1 : 0.3}
                                      />
                                    ))}
                                  </svg>
                                )}
                              </div>
                              {/* Label */}
                              <span
                                className={`text-[10px] font-medium block text-center ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}
                              >
                                {indicator.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {!hasFrameSelected && (
                        <p className="text-[10px] text-gray-600 text-center mt-3">
                          Select a frame to apply an indicator style
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Backgrounds Section */}
                <div className="border-b border-gray-800" style={{ order: sectionOrder.indexOf('backgrounds') }}>
                  <button
                    type="button"
                    onClick={() => toggleSection('backgrounds')}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Set Background</h3>
                      <span className="px-1.5 py-0.5 bg-gray-700 rounded text-[10px] text-gray-400">
                        {allGradients.length + solidColors.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {!collapsedSections.backgrounds && hasRowSelected && (
                        <span className="text-[10px] text-green-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                          {applyMode === 'row' ? 'Apply to row' : 'Click to apply'}
                        </span>
                      )}
                      <svg
                        className={`w-4 h-4 text-gray-500 transition-transform ${collapsedSections.backgrounds ? '' : 'rotate-180'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {!collapsedSections.backgrounds && (
                    <div className="px-4 pt-2 pb-4">
                      {/* Apply Mode Toggle - Using extracted component */}
                      {hasRowSelected && <ApplyModeToggle mode={applyMode} onChange={setApplyMode} />}

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
                        <div className="mb-3 p-2 bg-gray-800/50 rounded text-[10px] text-gray-500 text-center">
                          Add more frames to use stretch mode
                        </div>
                      )}
                      <h4 className="text-[10px] text-gray-500 uppercase tracking-wide mb-2">Gradients</h4>
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {gradients.map((gradient, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => handleBackgroundClick(gradient)}
                            disabled={!hasFrameSelected}
                            className={`w-full aspect-square rounded transition-colors overflow-hidden ${
                              hasFrameSelected
                                ? 'ring-1 ring-gray-700 hover:ring-gray-400 hover:scale-105 cursor-pointer'
                                : 'ring-1 ring-gray-700/50 opacity-50 cursor-not-allowed'
                            }`}
                            style={{ background: gradient }}
                            title={hasFrameSelected ? 'Click to apply this background' : 'Select a frame first'}
                          />
                        ))}
                      </div>
                      <h4 className="text-[10px] text-gray-500 uppercase tracking-wide mb-2">Solid Colors</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {solidColors.map((color) => (
                          <div key={color} className="relative group">
                            <button
                              type="button"
                              onClick={() => handleBackgroundClick(color)}
                              disabled={!hasFrameSelected}
                              className={`w-full aspect-square rounded transition-colors overflow-hidden ${
                                hasFrameSelected
                                  ? 'ring-1 ring-gray-700 hover:ring-gray-400 hover:scale-105 cursor-pointer'
                                  : 'ring-1 ring-gray-700/50 opacity-50 cursor-not-allowed'
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
                  )}
                </div>

                {/* Product Imagery Section - Display only, upload in Assets tab */}
                <div className="border-b border-gray-800" style={{ order: sectionOrder.indexOf('productImagery') }}>
                  <button
                    type="button"
                    onClick={() => toggleSection('productImagery')}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                  >
                    <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Add Product Image</h3>
                    <div className="flex items-center gap-2">
                      {uploadedProductImages.length > 0 && (
                        <span className="px-1.5 py-0.5 bg-gray-700 rounded text-[10px] text-gray-300">
                          {uploadedProductImages.length}
                        </span>
                      )}
                      <svg
                        className={`w-4 h-4 text-gray-500 transition-transform ${collapsedSections.productImagery ? '' : 'rotate-180'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {!collapsedSections.productImagery && (
                    <div className="px-4 pb-4">
                      {uploadedProductImages.length === 0 ? (
                        <div className="text-center py-6">
                          <svg
                            className="w-10 h-10 mx-auto mb-2 text-gray-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                          <p className="text-xs text-gray-500">No product images yet</p>
                          <button
                            type="button"
                            onClick={() => setActiveTab('assets')}
                            className="mt-2 text-[10px] text-white hover:text-gray-300 transition-colors"
                          >
                            Upload in Assets →
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          {uploadedProductImages.map((img) => (
                            <button
                              key={img.id}
                              type="button"
                              onClick={() => {
                                if (isCarousel && hasFrameSelected && onAddProductImageToFrame) {
                                  // Get the frame's layout info for positioning
                                  const frame = selectedCarouselFrames?.find((f) => f.id === selectedFrameId);
                                  const layoutIndex = frame?.currentLayout || 0;
                                  const layoutVariant = frame?.layoutVariant || 0;
                                  onAddProductImageToFrame(
                                    selectedCarouselId,
                                    selectedFrameId,
                                    img.url,
                                    layoutIndex,
                                    layoutVariant
                                  );
                                }
                              }}
                              className={`relative group aspect-square rounded overflow-hidden bg-gray-800 ring-1 ring-gray-700 hover:ring-purple-400 transition-colors ${hasFrameSelected ? 'cursor-pointer' : 'cursor-default opacity-50'}`}
                              title={
                                hasFrameSelected
                                  ? 'Click to add product image to selected frame'
                                  : 'Select a frame first'
                              }
                              disabled={!hasFrameSelected}
                            >
                              <img src={img.url} alt={img.name} className="w-full h-full object-contain" />
                              {hasFrameSelected && (
                                <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 4v16m8-8H4"
                                    />
                                  </svg>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Photography Section - Displays images from Assets tab */}
                <div className="border-b border-gray-800" style={{ order: sectionOrder.indexOf('photography') }}>
                  <button
                    type="button"
                    onClick={() => toggleSection('photography')}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Add Photo</h3>
                      {uploadedFiles.length > 0 && (
                        <span className="px-1.5 py-0.5 bg-gray-700 rounded text-[10px] text-gray-400">
                          {uploadedFiles.length}
                        </span>
                      )}
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform ${collapsedSections.photography ? '' : 'rotate-180'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {!collapsedSections.photography && (
                    <div className="px-4 pt-2 pb-4">
                      {/* Display uploaded images from Assets tab */}
                      {uploadedFiles.length === 0 ? (
                        <div className="text-center py-6 border-2 border-dashed border-gray-700 rounded">
                          <svg
                            className="w-8 h-8 mx-auto mb-2 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-[10px] text-gray-500 mb-2">No images uploaded yet</p>
                          <button
                            type="button"
                            onClick={() => setActiveTab('assets')}
                            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-xs text-white rounded transition-colors"
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
                              className={`bg-gray-800 rounded overflow-hidden transition-all text-left ${
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
                              title={
                                hasFrameSelected
                                  ? `Click to add "${file.name}" to selected frame`
                                  : 'Select a frame first'
                              }
                            >
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
                                {/* Add indicator when frame selected */}
                                {hasFrameSelected && (
                                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <svg
                                      className="w-3 h-3 text-blue-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                      />
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
                                <p className="text-[11px] text-gray-300 truncate font-medium" title={file.name}>
                                  {file.name}
                                </p>
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
                          className="flex items-center gap-2 p-2 bg-gray-800/50 rounded hover:bg-gray-800 transition-colors group"
                        >
                          <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                            <span className="text-xs font-bold text-white">U</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-white group-hover:text-purple-400 transition-colors">Unsplash</p>
                            <p className="text-[10px] text-gray-500">Apartment buildings</p>
                          </div>
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                        <a
                          href="https://www.pexels.com/search/apartment%20building/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 bg-gray-800/50 rounded hover:bg-gray-800 transition-colors group"
                        >
                          <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                            <span className="text-xs font-bold text-white">P</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-white group-hover:text-purple-400 transition-colors">Pexels</p>
                            <p className="text-[10px] text-gray-500">Multifamily housing</p>
                          </div>
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                        <a
                          href="https://pixabay.com/images/search/apartment%20building/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 bg-gray-800/50 rounded hover:bg-gray-800 transition-colors group"
                        >
                          <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                            <span className="text-xs font-bold text-white">Px</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-white group-hover:text-purple-400 transition-colors">Pixabay</p>
                            <p className="text-[10px] text-gray-500">Urban apartments</p>
                          </div>
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      </div>
                      <p className="text-[9px] text-gray-600 mt-2 text-center">All free for commercial use</p>
                    </div>
                  )}
                </div>

                {/* Brand Patterns Section */}
                <div className="border-b border-gray-800" style={{ order: sectionOrder.indexOf('patterns') }}>
                  <button
                    type="button"
                    onClick={() => toggleSection('patterns')}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Add Pattern</h3>
                      <span className="px-1.5 py-0.5 bg-gray-700 rounded text-[10px] text-gray-400">18</span>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform ${collapsedSections.patterns ? '' : 'rotate-180'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {!collapsedSections.patterns && (
                    <div className="px-4 pt-2 pb-4">
                      <p className="text-[10px] text-gray-500 mb-3">
                        Data-driven visuals that tell the HelloData story
                      </p>

                      {/* Pattern Grid - Data Visualizations */}
                      <p className="text-[9px] text-gray-500 mb-2 uppercase tracking-wide">Data Visualizations</p>
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {[
                          {
                            name: 'Market Map',
                            file: 'street-grid.svg',
                            id: 'pattern-street-grid',
                            desc: 'Submarket overview',
                          },
                          {
                            name: 'Comp Radius',
                            file: 'comp-radius-new.svg',
                            id: 'pattern-comp-radius',
                            desc: 'Property analysis',
                          },
                          {
                            name: 'Rent Trends',
                            file: 'rent-trends.svg',
                            id: 'pattern-rent-trends',
                            desc: 'Market movement',
                          },
                          {
                            name: 'Unit Grid',
                            file: 'apartment-units.svg',
                            id: 'pattern-apartment-units',
                            desc: 'Multifamily units',
                          },
                          {
                            name: 'Market Heat',
                            file: 'market-heat.svg',
                            id: 'pattern-market-heat',
                            desc: 'Submarket intensity',
                          },
                          {
                            name: 'Data Network',
                            file: 'property-network.svg',
                            id: 'pattern-property-network',
                            desc: 'Property connections',
                          },
                        ].map((pattern) => (
                          <button
                            key={pattern.file}
                            type="button"
                            className={`group relative aspect-square rounded overflow-hidden border border-gray-700 hover:border-purple-500 transition-all ${!selectedCarouselId && !selectedEblastId ? 'opacity-50 cursor-not-allowed' : ''}`}
                            style={{
                              backgroundImage: `url(/patterns/${pattern.file})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                            title={pattern.desc}
                            onClick={() => {
                              if (projectType === 'carousel' && selectedCarouselId && selectedFrameId) {
                                onAddPatternToFrame?.(selectedCarouselId, selectedFrameId, pattern.id);
                              } else if (projectType === 'eblast' && selectedEblastId && selectedSectionId) {
                                onAddPatternToSection?.(selectedEblastId, selectedSectionId, pattern.id);
                              }
                            }}
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
                          {
                            name: 'Grid City',
                            file: 'city-blocks-1.svg',
                            id: 'pattern-city-blocks-1',
                            desc: 'Standard grid layout',
                          },
                          {
                            name: 'Diagonal Ave',
                            file: 'city-blocks-2.svg',
                            id: 'pattern-city-blocks-2',
                            desc: 'With diagonal road',
                          },
                          {
                            name: 'Dense Urban',
                            file: 'city-blocks-3.svg',
                            id: 'pattern-city-blocks-3',
                            desc: 'Tight city blocks',
                          },
                          {
                            name: 'River City',
                            file: 'city-blocks-4.svg',
                            id: 'pattern-city-blocks-4',
                            desc: 'Boulevard layout',
                          },
                          {
                            name: 'Highway',
                            file: 'city-blocks-5.svg',
                            id: 'pattern-city-blocks-5',
                            desc: 'Diagonal highway',
                          },
                          {
                            name: 'Roundabout',
                            file: 'city-blocks-6.svg',
                            id: 'pattern-city-blocks-6',
                            desc: 'Circle intersection',
                          },
                        ].map((pattern) => (
                          <button
                            key={pattern.file}
                            type="button"
                            className={`group relative aspect-square rounded overflow-hidden border border-gray-700 hover:border-purple-500 transition-all ${!selectedCarouselId && !selectedEblastId ? 'opacity-50 cursor-not-allowed' : ''}`}
                            style={{
                              backgroundImage: `url(/patterns/${pattern.file})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                            title={pattern.desc}
                            onClick={() => {
                              if (projectType === 'carousel' && selectedCarouselId && selectedFrameId) {
                                onAddPatternToFrame?.(selectedCarouselId, selectedFrameId, pattern.id);
                              } else if (projectType === 'eblast' && selectedEblastId && selectedSectionId) {
                                onAddPatternToSection?.(selectedEblastId, selectedSectionId, pattern.id);
                              }
                            }}
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
                          { name: 'Beltway', file: 'metro-1.svg', id: 'pattern-metro-1', desc: 'Highway loop metro' },
                          {
                            name: 'River Metro',
                            file: 'metro-2.svg',
                            id: 'pattern-metro-2',
                            desc: 'River through city',
                          },
                          { name: 'Coastal', file: 'metro-3.svg', id: 'pattern-metro-3', desc: 'Coastal metro area' },
                          {
                            name: 'Lakefront',
                            file: 'metro-4.svg',
                            id: 'pattern-metro-4',
                            desc: 'Lake city with transit',
                          },
                          {
                            name: 'Airport Hub',
                            file: 'metro-5.svg',
                            id: 'pattern-metro-5',
                            desc: 'Metro with airport',
                          },
                          {
                            name: 'Multi-Core',
                            file: 'metro-6.svg',
                            id: 'pattern-metro-6',
                            desc: 'Poly-centric metro',
                          },
                        ].map((pattern) => (
                          <button
                            key={pattern.file}
                            type="button"
                            className={`group relative aspect-square rounded overflow-hidden border border-gray-700 hover:border-purple-500 transition-all ${!selectedCarouselId && !selectedEblastId ? 'opacity-50 cursor-not-allowed' : ''}`}
                            style={{
                              backgroundImage: `url(/patterns/${pattern.file})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                            title={pattern.desc}
                            onClick={() => {
                              if (projectType === 'carousel' && selectedCarouselId && selectedFrameId) {
                                onAddPatternToFrame?.(selectedCarouselId, selectedFrameId, pattern.id);
                              } else if (projectType === 'eblast' && selectedEblastId && selectedSectionId) {
                                onAddPatternToSection?.(selectedEblastId, selectedSectionId, pattern.id);
                              }
                            }}
                          >
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-[10px] text-white font-medium">{pattern.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Brand Icons Section - Extracted */}
                <BrandIconsSection
                  isCollapsed={collapsedSections.brandIcons}
                  onToggle={() => toggleSection('brandIcons')}
                  hasFrameSelected={hasFrameSelected}
                  isCarousel={isCarousel}
                  selectedCarouselId={selectedCarouselId}
                  selectedFrameId={selectedFrameId}
                  onAddIconToFrame={onAddIconToFrame}
                  order={sectionOrder.indexOf('brandIcons')}
                />
              </div>
              {/* End of dynamic dropdown sections flex container */}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DesignSystemPanel;
