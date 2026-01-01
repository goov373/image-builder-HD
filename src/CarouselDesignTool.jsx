import React, { useState } from 'react';

// Import data from centralized location
import {
  defaultDesignSystem,
  initialCarousels,
  initialEblasts,
  initialVideoCovers,
  initialSingleImages
} from './data';

// Import custom hooks
import { useDropdowns, useTabs, useCarousels, useEblasts, useVideoCovers, useSingleImages, useDesignSystem, useKeyboardShortcuts } from './hooks';

// Import context providers
import { AppProvider, HistoryProvider } from './context';

// Import components
import { 
  AccountPanel, 
  Sidebar,
  DesignSystemPanel,
  ExportPanel,
  Homepage,
  TabBar,
  EditorView,
  ErrorBoundary,
  SectionErrorBoundary,
} from './components';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';

// Initial project tabs
const INITIAL_TABS = [
  { id: 1, name: 'HelloData Campaign', active: false, hasContent: true, createdAt: '2024-12-20', updatedAt: '2024-12-22', frameCount: 5, projectType: 'carousel' }
];

// Main App Component
export default function CarouselDesignTool({ onSignOut = null, user = null }) {
  // UI state
  const [zoom, setZoom] = useState(120);
  const [activePanel, setActivePanel] = useState(null);
  const [expandSectionOnOpen, setExpandSectionOnOpen] = useState(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('none');
  
  // Design system with persistence
  const [designSystem, setDesignSystem] = useDesignSystem(defaultDesignSystem);

  // Use custom hooks for complex state management
  const tabs = useTabs(INITIAL_TABS, user);
  const carousels = useCarousels(initialCarousels);
  const eblasts = useEblasts(initialEblasts);
  const videoCovers = useVideoCovers(initialVideoCovers);
  const singleImages = useSingleImages(initialSingleImages);
  const dropdowns = useDropdowns();

  // Global keyboard shortcuts
  useKeyboardShortcuts({
    onShowShortcuts: () => setShowShortcutsModal(true),
    onDeselect: () => {
      if (showShortcutsModal) {
        setShowShortcutsModal(false);
      } else if (activePanel) {
        setActivePanel(null);
      } else {
        carousels.clearSelection();
        eblasts.clearSelection();
        videoCovers.clearSelection();
        singleImages.clearSelection();
      }
    },
    onZoomIn: () => setZoom(z => Math.min(250, z + 10)),
    onZoomOut: () => setZoom(z => Math.max(50, z - 10)),
    onZoomReset: () => setZoom(100),
    onOpenExport: () => setActivePanel(activePanel === 'export' ? null : 'export'),
    // Undo/Redo - connected to carousels reducer
    onUndo: () => carousels.handleUndo(),
    onRedo: () => carousels.handleRedo(),
  }, !showShortcutsModal); // Disable some shortcuts when modal is open

  // Handler to open Design panel and expand Product Imagery section
  const handleRequestAddProductImage = () => {
    setExpandSectionOnOpen('productImagery');
    setActivePanel('design');
    // Clear the expand trigger after a short delay so it can be triggered again
    setTimeout(() => setExpandSectionOnOpen(null), 100);
  };

  // Handler to open Design panel and expand Brand Icons section
  const handleRequestAddIcon = () => {
    setExpandSectionOnOpen('brandIcons');
    setActivePanel('design');
    // Clear the expand trigger after a short delay so it can be triggered again
    setTimeout(() => setExpandSectionOnOpen(null), 100);
  };

  // Handler to open Design panel and expand Backgrounds section (for Fill Color)
  const handleRequestAddFill = () => {
    setExpandSectionOnOpen('backgrounds');
    setActivePanel('design');
    setTimeout(() => setExpandSectionOnOpen(null), 100);
  };

  // Handler to open Design panel and expand Photography section (for Background Photo)
  const handleRequestAddPhoto = () => {
    setExpandSectionOnOpen('photography');
    setActivePanel('design');
    setTimeout(() => setExpandSectionOnOpen(null), 100);
  };

  // Handler to open Design panel and expand Brand Patterns section
  const handleRequestAddPattern = () => {
    setExpandSectionOnOpen('patterns');
    setActivePanel('design');
    setTimeout(() => setExpandSectionOnOpen(null), 100);
  };

  // Handler to open Design panel and expand Page Indicators section
  const handleRequestAddPageIndicator = () => {
    setExpandSectionOnOpen('pageIndicators');
    setActivePanel('design');
    setTimeout(() => setExpandSectionOnOpen(null), 100);
  };

  // Get current project type from active tab
  const currentProjectType = tabs.activeTab?.projectType || 'carousel';

  // Handlers that need to coordinate between hooks
  const handleGoHome = () => {
    tabs.handleGoHome(() => {
      carousels.clearSelection();
      eblasts.clearSelection();
      videoCovers.clearSelection();
      singleImages.clearSelection();
    });
  };

  const handleOpenProject = (projectId) => {
    tabs.handleOpenProject(projectId, () => setIsAccountOpen(false));
  };

  const handleCreateNewFromHome = () => {
    tabs.handleCreateNewFromHome(() => setIsAccountOpen(false));
  };

  const handleAddTab = () => {
    tabs.handleAddTab(() => setIsAccountOpen(false));
  };

  const handleSelectFrame = (carouselId, frameId) => {
    carousels.handleSelectFrame(carouselId, frameId, dropdowns.closeAllDropdowns);
  };

  const handleSelectCarousel = (carouselId) => {
    carousels.handleSelectCarousel(carouselId, dropdowns.closeAllDropdowns);
  };

  const handleSelectSection = (eblastId, sectionId) => {
    eblasts.handleSelectSection(eblastId, sectionId, dropdowns.closeAllDropdowns);
  };

  const handleSelectEblast = (eblastId) => {
    eblasts.handleSelectEblast(eblastId, dropdowns.closeAllDropdowns);
  };

  const handleSelectVideoCover = (videoCoverId) => {
    videoCovers.handleSelectVideoCover(videoCoverId, dropdowns.closeAllDropdowns);
  };

  const handleSelectSingleImage = (imageId) => {
    singleImages.handleSelectImage(imageId, dropdowns.closeAllDropdowns);
  };

  const handleDeselect = () => {
    dropdowns.closeAllDropdowns();
    if (currentProjectType === 'carousel') {
      carousels.clearSelection();
    } else if (currentProjectType === 'eblast') {
      eblasts.clearSelection();
    } else if (currentProjectType === 'videoCover') {
      videoCovers.clearSelection();
    } else if (currentProjectType === 'singleImage') {
      singleImages.clearSelection();
    }
  };

  // Deselect only the frame (keeps the row/carousel selected)
  const handleDeselectFrame = () => {
    if (currentProjectType === 'carousel') {
      carousels.deselectFrame();
    }
  };

  // Layout calculations
  const panelWidth = activePanel ? 288 : 0;
  const sidebarWidth = 64;
  const totalOffset = sidebarWidth + panelWidth;

  // Context values
  const designSystemContextValue = { designSystem, setDesignSystem };
  
  const selectionContextValue = {
    // Carousel selection
    selectedCarouselId: carousels.selectedCarouselId,
    selectedFrameId: carousels.selectedFrameId,
    selectedCarousel: carousels.selectedCarousel,
    selectedFrame: carousels.selectedFrame,
    // Eblast selection
    selectedEblastId: eblasts.selectedEblastId,
    selectedSectionId: eblasts.selectedSectionId,
    selectedEblast: eblasts.selectedEblast,
    selectedSection: eblasts.selectedSection,
    // Video Cover selection
    selectedVideoCoverId: videoCovers.selectedVideoCoverId,
    selectedVideoCover: videoCovers.selectedVideoCover,
    // Single Image selection
    selectedImageId: singleImages.selectedImageId,
    selectedLayerId: singleImages.selectedLayerId,
    selectedImage: singleImages.selectedImage,
    selectedLayer: singleImages.selectedLayer,
    // Shared
    activeTextField: currentProjectType === 'carousel' 
      ? carousels.activeTextField 
      : currentProjectType === 'eblast'
        ? eblasts.activeTextField
        : videoCovers.activeTextField,
    setActiveTextField: currentProjectType === 'carousel' 
      ? carousels.setActiveTextField 
      : currentProjectType === 'eblast'
        ? eblasts.setActiveTextField
        : videoCovers.setActiveTextField,
    handleSelectFrame,
    handleSelectCarousel,
    handleSelectSection,
    handleSelectEblast,
    handleSelectVideoCover,
    handleSelectSingleImage,
    handleDeselect,
    handleDeselectFrame,
    currentProjectType,
  };

  const carouselsContextValue = {
    carousels: carousels.carousels,
    handleSetVariant: carousels.handleSetVariant,
    handleSetLayout: carousels.handleSetLayout,
    handleShuffleLayoutVariant: carousels.handleShuffleLayoutVariant,
    handleUpdateText: carousels.handleUpdateText,
    handleUpdateFormatting: carousels.handleUpdateFormatting,
    handleAddFrame: carousels.handleAddFrame,
    handleRemoveFrame: carousels.handleRemoveFrame,
    handleChangeFrameSize: carousels.handleChangeFrameSize,
    handleReorderFrames: carousels.handleReorderFrames,
    handleAddRow: carousels.handleAddRow,
    handleRemoveRow: carousels.handleRemoveRow,
    handleSetFrameBackground: carousels.handleSetFrameBackground,
    handleSmoothBackgrounds: carousels.handleSmoothBackgrounds,
    // Image layer methods
    handleAddImageToFrame: carousels.handleAddImageToFrame,
    handleUpdateImageLayer: carousels.handleUpdateImageLayer,
    handleRemoveImageFromFrame: carousels.handleRemoveImageFromFrame,
    // Pattern layer methods
    handleAddPatternToFrame: carousels.handleAddPatternToFrame,
    handleUpdatePatternLayer: carousels.handleUpdatePatternLayer,
    handleRemovePatternFromFrame: carousels.handleRemovePatternFromFrame,
    handleSetRowStretchedPattern: carousels.handleSetRowStretchedPattern,
    // Fill layer methods
    handleUpdateFillLayer: carousels.handleUpdateFillLayer,
    // Product image layer methods
    handleAddProductImageToFrame: carousels.handleAddProductImageToFrame,
    handleUpdateProductImageLayer: carousels.handleUpdateProductImageLayer,
    handleRemoveProductImageFromFrame: carousels.handleRemoveProductImageFromFrame,
    // Icon layer methods
    handleAddIconToFrame: carousels.handleAddIconToFrame,
    handleUpdateIconLayer: carousels.handleUpdateIconLayer,
    handleRemoveIconFromFrame: carousels.handleRemoveIconFromFrame,
    // Progress indicator methods
    handleUpdateProgressIndicator: carousels.handleUpdateProgressIndicator,
    // Background layer order methods
    handleReorderBackgroundLayers: carousels.handleReorderBackgroundLayers,
    // Undo/Redo
    handleUndo: carousels.handleUndo,
    handleRedo: carousels.handleRedo,
    canUndo: carousels.canUndo,
    canRedo: carousels.canRedo,
    historyLength: carousels.historyLength,
    futureLength: carousels.futureLength,
    // Eblast methods
    eblasts: eblasts.eblasts,
    handleEblastSetVariant: eblasts.handleSetVariant,
    handleEblastSetLayout: eblasts.handleSetLayout,
    handleEblastShuffleLayoutVariant: eblasts.handleShuffleLayoutVariant,
    handleEblastUpdateText: eblasts.handleUpdateText,
    handleEblastUpdateFormatting: eblasts.handleUpdateFormatting,
    handleAddSection: eblasts.handleAddSection,
    handleRemoveSection: eblasts.handleRemoveSection,
    handleReorderSections: eblasts.handleReorderSections,
    handleAddEblast: eblasts.handleAddEblast,
    handleRemoveEblast: eblasts.handleRemoveEblast,
    // Eblast layer methods
    handleSetSectionBackground: eblasts.handleSetSectionBackground,
    handleSetStretchedBackground: eblasts.handleSetStretchedBackground,
    handleAddPatternToSection: eblasts.handleAddPatternToSection,
    handleUpdatePatternLayerEblast: eblasts.handleUpdatePatternLayer,
    handleRemovePatternFromSection: eblasts.handleRemovePatternFromSection,
    handleSetStretchedPattern: eblasts.handleSetStretchedPattern,
    handleAddImageToSection: eblasts.handleAddImageToSection,
    handleUpdateImageLayerEblast: eblasts.handleUpdateImageLayer,
    handleRemoveImageFromSection: eblasts.handleRemoveImageFromSection,
    // Video Cover methods
    videoCovers: videoCovers.videoCovers,
    handleVideoCoverSetVariant: videoCovers.handleSetVariant,
    handleVideoCoverSetLayout: videoCovers.handleSetLayout,
    handleVideoCoverShuffleLayoutVariant: videoCovers.handleShuffleLayoutVariant,
    handleVideoCoverUpdateText: videoCovers.handleUpdateText,
    handleVideoCoverUpdateFormatting: videoCovers.handleUpdateFormatting,
    handleVideoCoverChangeFrameSize: videoCovers.handleChangeFrameSize,
    handleTogglePlayButton: videoCovers.handleTogglePlayButton,
    handleUpdateEpisodeNumber: videoCovers.handleUpdateEpisodeNumber,
    handleAddVideoCover: videoCovers.handleAddVideoCover,
    handleRemoveVideoCover: videoCovers.handleRemoveVideoCover,
    // Video Cover layer methods
    handleVideoCoverSetBackground: videoCovers.handleSetBackground,
    handleVideoCoverAddPattern: videoCovers.handleAddPattern,
    handleVideoCoverUpdatePattern: videoCovers.handleUpdatePattern,
    handleVideoCoverRemovePattern: videoCovers.handleRemovePattern,
    handleVideoCoverAddImage: videoCovers.handleAddImage,
    handleVideoCoverUpdateImage: videoCovers.handleUpdateImage,
    handleVideoCoverRemoveImage: videoCovers.handleRemoveImage,
    // Single Image methods
    singleImages: singleImages.singleImages,
    handleUpdateLayer: singleImages.handleUpdateLayer,
    handleAddLayer: singleImages.handleAddLayer,
    handleRemoveLayer: singleImages.handleRemoveLayer,
    handleReorderLayers: singleImages.handleReorderLayers,
    handleUpdateBackground: singleImages.handleUpdateBackground,
    handleUpdateCanvasSize: singleImages.handleUpdateCanvasSize,
    handleAddImage: singleImages.handleAddImage,
    handleRemoveImage: singleImages.handleRemoveImage,
    // Single Image gradient/pattern methods
    handleSingleImageSetBackgroundGradient: singleImages.handleSetBackgroundGradient,
    handleSingleImageAddPattern: singleImages.handleAddPattern,
    handleSingleImageUpdatePattern: singleImages.handleUpdatePattern,
    handleSingleImageRemovePattern: singleImages.handleRemovePattern,
  };

  return (
    <ErrorBoundary>
    <HistoryProvider>
      <AppProvider
        designSystem={designSystemContextValue}
        selection={selectionContextValue}
        carousels={carouselsContextValue}
        dropdowns={dropdowns}
      >
        <div className="h-screen text-white overflow-hidden" style={{ backgroundColor: '#0d1321' }}>
        {/* Browser-style Tab Bar */}
        <TabBar
          tabs={tabs.tabs}
          activeTabId={tabs.activeTabId}
          currentView={tabs.currentView}
          showNewTabMenu={dropdowns.showNewTabMenu}
          setShowNewTabMenu={dropdowns.setShowNewTabMenu}
          newTabMenuRef={dropdowns.newTabMenuRef}
          closeAllDropdowns={dropdowns.closeAllDropdowns}
          onOpenProject={handleOpenProject}
          onCloseTab={tabs.handleCloseTab}
          onAddTab={handleAddTab}
          maxTabs={tabs.maxTabs}
          sidebarOffset={totalOffset}
          projects={tabs.projects}
        />
        
        {/* Fixed Home Button - above sidebar */}
        <div className="fixed top-0 left-0 z-[120] flex items-center justify-center border-b border-r border-gray-800" style={{ width: 64, height: 56, backgroundColor: '#0d1321' }}>
          <button 
            type="button"
            onClick={handleGoHome}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${tabs.currentView === 'home' ? 'text-white bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
            title="Go to Homepage"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
        </div>

        {/* Sidebar */}
        <Sidebar 
          activePanel={activePanel} 
          onPanelChange={setActivePanel} 
          zoom={zoom} 
          onZoomChange={setZoom} 
          isHomePage={tabs.currentView === 'home'}
          onAccountClick={() => { setActivePanel(null); setIsAccountOpen(!isAccountOpen); }}
          isAccountOpen={isAccountOpen}
          onCloseAccount={() => setIsAccountOpen(false)}
          onShowShortcuts={() => setShowShortcutsModal(true)}
          selectedDevice={selectedDevice}
          onDeviceChange={setSelectedDevice}
        />
        
        {/* Decorative Diagonal Lines Pattern - Separate from panel tabs, only moves when sidebar opens/closes */}
        <div 
          className="fixed top-0 h-[56px] w-72 z-30 border-r border-gray-800 pointer-events-none"
          style={{ 
            left: (activePanel === 'design' || activePanel === 'export') ? 64 : -224, 
            transition: 'left 0.3s ease-out',
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 10px,
              rgba(100, 102, 233, 0.1) 10px,
              rgba(100, 102, 233, 0.1) 11px
            )`,
          }}
        />
        
        {/* Panels - wrapped in error boundaries for stability */}
        <SectionErrorBoundary name="Design Panel">
        <DesignSystemPanel 
          designSystem={designSystem} 
          onUpdate={setDesignSystem} 
          onClose={() => setActivePanel(null)} 
          isOpen={activePanel === 'design'}
          projectType={currentProjectType}
          // Carousel-specific props
          selectedCarouselId={carousels.selectedCarouselId}
          selectedFrameId={carousels.selectedFrameId}
          selectedCarouselFrames={carousels.selectedCarousel?.frames || []}
          onSetFrameBackground={carousels.handleSetFrameBackground}
          onSetRowStretchedBackground={carousels.handleSetRowStretchedBackground}
          onAddImageToFrame={carousels.handleAddImageToFrame}
          onAddProductImageToFrame={carousels.handleAddProductImageToFrame}
          onAddIconToFrame={carousels.handleAddIconToFrame}
          onUpdateProgressIndicator={carousels.handleUpdateProgressIndicator}
          onAddPatternToFrame={carousels.handleAddPatternToFrame}
          onUpdatePatternLayer={carousels.handleUpdatePatternLayer}
          onRemovePatternFromFrame={carousels.handleRemovePatternFromFrame}
          onSetRowStretchedPattern={carousels.handleSetRowStretchedPattern}
          expandSectionOnOpen={expandSectionOnOpen}
          // Eblast-specific props
          selectedEblastId={eblasts.selectedEblastId}
          selectedSectionId={eblasts.selectedSectionId}
          selectedEblastSections={eblasts.selectedEblast?.sections || []}
          onSetSectionBackground={eblasts.handleSetSectionBackground}
          onSetStretchedBackground={eblasts.handleSetStretchedBackground}
          onAddImageToSection={eblasts.handleAddImageToSection}
          onAddPatternToSection={eblasts.handleAddPatternToSection}
          onUpdatePatternLayerEblast={eblasts.handleUpdatePatternLayer}
          onRemovePatternFromSection={eblasts.handleRemovePatternFromSection}
          onSetStretchedPattern={eblasts.handleSetStretchedPattern}
          // Video Cover-specific props
          selectedVideoCoverId={videoCovers.selectedVideoCoverId}
          onSetVideoCoverBackground={videoCovers.handleSetBackground}
          onAddVideoCoverPattern={videoCovers.handleAddPattern}
          onUpdateVideoCoverPattern={videoCovers.handleUpdatePattern}
          onRemoveVideoCoverPattern={videoCovers.handleRemovePattern}
          onAddVideoCoverImage={videoCovers.handleAddImage}
          // Single Image-specific props
          selectedSingleImageId={singleImages.selectedImageId}
          onSetSingleImageBackgroundGradient={singleImages.handleSetBackgroundGradient}
          onAddSingleImagePattern={singleImages.handleAddPattern}
          onUpdateSingleImagePattern={singleImages.handleUpdatePattern}
          onRemoveSingleImagePattern={singleImages.handleRemovePattern}
        />
        </SectionErrorBoundary>
        <SectionErrorBoundary name="Export Panel">
        <ExportPanel 
          onClose={() => setActivePanel(null)} 
          isOpen={activePanel === 'export'} 
          carousels={carousels.carousels}
          eblasts={eblasts.eblasts}
          videoCovers={videoCovers.videoCovers}
          singleImages={singleImages.singleImages}
          projectType={currentProjectType}
        />
        </SectionErrorBoundary>
        <SectionErrorBoundary name="Account Panel">
        <AccountPanel 
          onClose={() => setIsAccountOpen(false)} 
          isOpen={isAccountOpen && tabs.currentView === 'home'}
          onSignOut={onSignOut}
          user={user}
        />
        </SectionErrorBoundary>

        {/* Homepage or Editor View */}
        {tabs.currentView === 'home' ? (
          <div 
            className="absolute inset-0 top-[56px]" 
            style={{ left: totalOffset, transition: 'left 0.3s ease-out' }}
          >
            <Homepage 
              projects={tabs.projects} 
              onOpenProject={handleOpenProject}
              onCreateNew={handleCreateNewFromHome}
              onDeleteProject={tabs.handleDeleteProject}
              onDuplicateProject={tabs.handleDuplicateProject}
              onRenameProject={tabs.handleRenameProject}
              onQuickExport={(projectId) => {
                // Open the project first, then open export panel
                handleOpenProject(projectId);
                setActivePanel('export');
              }}
            />
          </div>
        ) : (
          <EditorView
            totalOffset={totalOffset}
            zoom={zoom}
            activeTab={tabs.activeTab}
            onUpdateProjectName={tabs.handleUpdateProjectName}
            onCreateProject={tabs.handleCreateProject}
            projectType={currentProjectType}
            selectedDevice={selectedDevice}
            onRequestAddProductImage={handleRequestAddProductImage}
            onRequestAddIcon={handleRequestAddIcon}
            onRequestAddFill={handleRequestAddFill}
            onRequestAddPhoto={handleRequestAddPhoto}
            onRequestAddPattern={handleRequestAddPattern}
            onRequestAddPageIndicator={handleRequestAddPageIndicator}
          />
        )}
        </div>
        
        {/* Keyboard Shortcuts Modal */}
        <KeyboardShortcutsModal 
          isOpen={showShortcutsModal} 
          onClose={() => setShowShortcutsModal(false)} 
        />
      </AppProvider>
    </HistoryProvider>
    </ErrorBoundary>
  );
}
