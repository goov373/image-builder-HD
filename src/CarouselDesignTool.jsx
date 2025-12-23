import React, { useState } from 'react';

// Import data from centralized location
import {
  defaultDesignSystem,
  initialCarousels
} from './data';

// Import custom hooks
import { useDropdowns, useTabs, useCarousels } from './hooks';

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
  { id: 1, name: 'HelloData Campaign', active: false, hasContent: true, createdAt: '2024-12-20', updatedAt: '2024-12-22', frameCount: 5 }
];

// Main App Component
export default function CarouselDesignTool() {
  // Design system state
  const [zoom, setZoom] = useState(120);
  const [designSystem, setDesignSystem] = useState(defaultDesignSystem);
  const [activePanel, setActivePanel] = useState(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Use custom hooks for complex state management
  const tabs = useTabs(INITIAL_TABS);
  const carousels = useCarousels(initialCarousels);
  const dropdowns = useDropdowns();

  // Handlers that need to coordinate between hooks
  const handleGoHome = () => {
    tabs.handleGoHome(carousels.clearSelection);
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

  const handleDeselect = () => {
    dropdowns.closeAllDropdowns();
    carousels.clearSelection();
  };

  // Layout calculations
  const panelWidth = activePanel ? 288 : 0;
  const sidebarWidth = 64;
  const totalOffset = sidebarWidth + panelWidth;

  // Prepare dropdown props for EditorView/Toolbar
  const dropdownProps = {
    showFormatPicker: dropdowns.showFormatPicker,
    setShowFormatPicker: dropdowns.setShowFormatPicker,
    showLayoutPicker: dropdowns.showLayoutPicker,
    setShowLayoutPicker: dropdowns.setShowLayoutPicker,
    showSnippetsPicker: dropdowns.showSnippetsPicker,
    setShowSnippetsPicker: dropdowns.setShowSnippetsPicker,
    showFontPicker: dropdowns.showFontPicker,
    setShowFontPicker: dropdowns.setShowFontPicker,
    showFontSize: dropdowns.showFontSize,
    setShowFontSize: dropdowns.setShowFontSize,
    showColorPicker: dropdowns.showColorPicker,
    setShowColorPicker: dropdowns.setShowColorPicker,
    showUnderlinePicker: dropdowns.showUnderlinePicker,
    setShowUnderlinePicker: dropdowns.setShowUnderlinePicker,
    showTextAlign: dropdowns.showTextAlign,
    setShowTextAlign: dropdowns.setShowTextAlign,
    showLineSpacing: dropdowns.showLineSpacing,
    setShowLineSpacing: dropdowns.setShowLineSpacing,
    showLetterSpacing: dropdowns.showLetterSpacing,
    setShowLetterSpacing: dropdowns.setShowLetterSpacing,
    formatPickerRef: dropdowns.formatPickerRef,
    layoutPickerRef: dropdowns.layoutPickerRef,
    snippetsPickerRef: dropdowns.snippetsPickerRef,
    fontPickerRef: dropdowns.fontPickerRef,
    fontSizeRef: dropdowns.fontSizeRef,
    colorPickerRef: dropdowns.colorPickerRef,
    underlineRef: dropdowns.underlineRef,
    textAlignRef: dropdowns.textAlignRef,
    lineSpacingRef: dropdowns.lineSpacingRef,
    letterSpacingRef: dropdowns.letterSpacingRef,
    closeAllDropdowns: dropdowns.closeAllDropdowns,
  };

  return (
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
          carousels={carousels.carousels}
          designSystem={designSystem}
          selectedCarouselId={carousels.selectedCarouselId}
          selectedFrameId={carousels.selectedFrameId}
          selectedCarousel={carousels.selectedCarousel}
          selectedFrame={carousels.selectedFrame}
          activeTextField={carousels.activeTextField}
          onSelectCarousel={handleSelectCarousel}
          onSelectFrame={handleSelectFrame}
          onAddFrame={carousels.handleAddFrame}
          onRemoveFrame={carousels.handleRemoveFrame}
          onRemoveRow={carousels.handleRemoveRow}
          onReorderFrames={carousels.handleReorderFrames}
          onUpdateText={carousels.handleUpdateText}
          onActivateTextField={carousels.setActiveTextField}
          onAddRow={carousels.handleAddRow}
          onDeselect={handleDeselect}
          onChangeFrameSize={carousels.handleChangeFrameSize}
          onSetLayout={carousels.handleSetLayout}
          onShuffleLayoutVariant={carousels.handleShuffleLayoutVariant}
          onSetVariant={carousels.handleSetVariant}
          onUpdateFormatting={carousels.handleUpdateFormatting}
          dropdownProps={dropdownProps}
        />
      )}
    </div>
  );
}
