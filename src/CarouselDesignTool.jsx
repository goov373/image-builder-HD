import React, { useState } from 'react';

// Import data from centralized location
import {
  defaultDesignSystem,
  initialCarousels,
  initialEblasts
} from './data';

// Import custom hooks
import { useDropdowns, useTabs, useCarousels, useEblasts, useDesignSystem } from './hooks';

// Import context providers
import { AppProvider } from './context';

// Import components
import { 
  AccountPanel, 
  Sidebar,
  DesignSystemPanel,
  ExportPanel,
  Homepage,
  TabBar,
  EditorView
} from './components';

// Initial project tabs
const INITIAL_TABS = [
  { id: 1, name: 'HelloData Campaign', active: false, hasContent: true, createdAt: '2024-12-20', updatedAt: '2024-12-22', frameCount: 5, projectType: 'carousel' }
];

// Main App Component
export default function CarouselDesignTool() {
  // UI state
  const [zoom, setZoom] = useState(120);
  const [activePanel, setActivePanel] = useState(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  
  // Design system with persistence
  const [designSystem, setDesignSystem] = useDesignSystem(defaultDesignSystem);

  // Use custom hooks for complex state management
  const tabs = useTabs(INITIAL_TABS);
  const carousels = useCarousels(initialCarousels);
  const eblasts = useEblasts(initialEblasts);
  const dropdowns = useDropdowns();

  // Get current project type from active tab
  const currentProjectType = tabs.activeTab?.projectType || 'carousel';

  // Handlers that need to coordinate between hooks
  const handleGoHome = () => {
    tabs.handleGoHome(() => {
      carousels.clearSelection();
      eblasts.clearSelection();
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

  const handleDeselect = () => {
    dropdowns.closeAllDropdowns();
    if (currentProjectType === 'carousel') {
      carousels.clearSelection();
    } else if (currentProjectType === 'eblast') {
      eblasts.clearSelection();
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
    // Shared
    activeTextField: currentProjectType === 'carousel' ? carousels.activeTextField : eblasts.activeTextField,
    setActiveTextField: currentProjectType === 'carousel' ? carousels.setActiveTextField : eblasts.setActiveTextField,
    handleSelectFrame,
    handleSelectCarousel,
    handleSelectSection,
    handleSelectEblast,
    handleDeselect,
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
  };

  return (
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
          onGoHome={handleGoHome}
          onOpenProject={handleOpenProject}
          onCloseTab={tabs.handleCloseTab}
          onAddTab={handleAddTab}
          maxTabs={tabs.maxTabs}
        />
        
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
        />
        
        {/* Panels */}
        <DesignSystemPanel 
          designSystem={designSystem} 
          onUpdate={setDesignSystem} 
          onClose={() => setActivePanel(null)} 
          isOpen={activePanel === 'design'} 
        />
        <ExportPanel 
          onClose={() => setActivePanel(null)} 
          isOpen={activePanel === 'export'} 
          carousels={carousels.carousels}
          eblasts={eblasts.eblasts}
          projectType={currentProjectType}
        />
        <AccountPanel 
          onClose={() => setIsAccountOpen(false)} 
          isOpen={isAccountOpen && tabs.currentView === 'home'} 
        />

        {/* Homepage or Editor View */}
        {tabs.currentView === 'home' ? (
          <div 
            className="absolute inset-0 top-[56px]" 
            style={{ left: totalOffset, transition: 'left 0.3s ease-out' }}
          >
            <Homepage 
              projects={tabs.tabs} 
              onOpenProject={handleOpenProject}
              onCreateNew={handleCreateNewFromHome}
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
          />
        )}
      </div>
    </AppProvider>
  );
}
