import React, { useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

// Import data from centralized location
import {
  defaultDesignSystem,
  initialCarousels
} from './data';

// Import custom hooks
import { useDropdowns } from './hooks';

// Import components
import { 
  AccountPanel, 
  Sidebar,
  DesignSystemPanel,
  ExportPanel,
  Homepage,
  ProjectHeader,
  NewProjectView,
  CarouselRow,
  Toolbar
} from './components';

// Main App Component
export default function CarouselDesignTool() {
  const [carousels, setCarousels] = useState(initialCarousels);
  const [zoom, setZoom] = useState(120);
  const [designSystem, setDesignSystem] = useState(defaultDesignSystem);
  const [activePanel, setActivePanel] = useState(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [selectedCarouselId, setSelectedCarouselId] = useState(null);
  
  // View state - 'home' or 'editor'
  const [currentView, setCurrentView] = useState('home');
  
  // Browser-style tabs for projects
  const [tabs, setTabs] = useState([
    { id: 1, name: 'HelloData Campaign', active: false, hasContent: true, createdAt: '2024-12-20', updatedAt: '2024-12-22', frameCount: 5 }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  
  const activeTab = tabs.find(t => t.id === activeTabId);
  
  const handleTabClick = (tabId) => {
    setActiveTabId(tabId);
    setTabs(prev => prev.map(tab => ({ ...tab, active: tab.id === tabId })));
  };
  
  const handleUpdateProjectName = (newName) => {
    if (!newName.trim()) return;
    setTabs(prev => prev.map(tab => tab.id === activeTabId ? { ...tab, name: newName.trim() } : tab));
  };
  
  const handleGoHome = () => {
    setCurrentView('home');
    setSelectedCarouselId(null);
    setSelectedFrameId(null);
    setActiveTextField(null);
  };
  
  const handleOpenProject = (projectId) => {
    setActiveTabId(projectId);
    setTabs(prev => prev.map(tab => ({ ...tab, active: tab.id === projectId })));
    setIsAccountOpen(false);
    setCurrentView('editor');
  };
  
  const handleCreateNewFromHome = () => {
    const newId = Math.max(...tabs.map(t => t.id)) + 1;
    const newTab = { 
      id: newId, 
      name: 'Untitled Project', 
      active: true, 
      hasContent: false, 
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      frameCount: 0
    };
    setTabs(prev => [...prev.map(t => ({ ...t, active: false })), newTab]);
    setActiveTabId(newId);
    setIsAccountOpen(false);
    setCurrentView('editor');
  };
  
  const handleCloseTab = (tabId, e) => {
    e.stopPropagation();
    if (tabs.length <= 1) return;
    const newTabs = tabs.filter(t => t.id !== tabId);
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[0].id);
      newTabs[0].active = true;
    }
    setTabs(newTabs);
  };
  
  const MAX_TABS = 10;
  
  const handleAddTab = () => {
    if (tabs.length >= MAX_TABS) return;
    const newId = Math.max(...tabs.map(t => t.id)) + 1;
    setTabs(prev => [...prev.map(t => ({ ...t, active: false })), { id: newId, name: 'Untitled Project', active: true, hasContent: false, createdAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0], frameCount: 0 }]);
    setActiveTabId(newId);
    setIsAccountOpen(false);
    setCurrentView('editor');
  };
  
  const handleCreateProject = (projectType, projectName) => {
    setTabs(prev => prev.map(t => 
      t.id === activeTabId 
        ? { ...t, name: projectName || 'New Project', hasContent: true }
        : t
    ));
  };
  const [selectedFrameId, setSelectedFrameId] = useState(null);
  const [activeTextField, setActiveTextField] = useState(null);
  
  // Use centralized dropdown management hook
  const {
    showColorPicker, setShowColorPicker,
    showFontSize, setShowFontSize,
    showUnderlinePicker, setShowUnderlinePicker,
    showFontPicker, setShowFontPicker,
    showTextAlign, setShowTextAlign,
    showLineSpacing, setShowLineSpacing,
    showLetterSpacing, setShowLetterSpacing,
    showFormatPicker, setShowFormatPicker,
    showLayoutPicker, setShowLayoutPicker,
    showNewTabMenu, setShowNewTabMenu,
    showSnippetsPicker, setShowSnippetsPicker,
    colorPickerRef, fontSizeRef, underlineRef, fontPickerRef,
    textAlignRef, lineSpacingRef, letterSpacingRef,
    formatPickerRef, layoutPickerRef, newTabMenuRef, snippetsPickerRef,
    closeAllDropdowns,
  } = useDropdowns();
  
  const selectedCarousel = carousels.find(c => c.id === selectedCarouselId) || carousels[0];
  const selectedFrame = selectedCarousel?.frames?.find(f => f.id === selectedFrameId);
  
  const handleSelectFrame = (carouselId, frameId) => {
    closeAllDropdowns();
    setActiveTextField(null);
    // If opening a new carousel
    if (carouselId !== selectedCarouselId) {
      setSelectedCarouselId(carouselId);
    }
    setSelectedFrameId(prev => (prev === frameId && carouselId === selectedCarouselId) ? null : frameId);
  };
  
  const handleSelectCarousel = (carouselId) => {
    closeAllDropdowns();
    setActiveTextField(null);
    
    // Determine if opening or closing
    const isOpening = carouselId !== null && carouselId !== selectedCarouselId;
    const isClosing = carouselId === null || (carouselId === selectedCarouselId && selectedCarouselId !== null);
    
    if (isOpening) {
      // Opening a row
      setSelectedFrameId(null);
      setSelectedCarouselId(carouselId);
    } else if (isClosing && carouselId === selectedCarouselId) {
      // Clicking the same row's close button - close it
      setSelectedCarouselId(null);
      setSelectedFrameId(null);
    } else if (carouselId === null) {
      // Explicitly closing
      setSelectedCarouselId(null);
      setSelectedFrameId(null);
    } else {
      // Switching to a different row
      setSelectedFrameId(null);
      setSelectedCarouselId(carouselId);
    }
  };
  
  const handleSetVariant = (carouselId, frameId, variantIndex) => {
    setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      return { ...carousel, frames: carousel.frames.map(frame => frame.id !== frameId ? frame : { ...frame, currentVariant: variantIndex }) };
    }));
  };
  
  const handleSetLayout = (carouselId, frameId, layoutIndex) => {
    setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      return { ...carousel, frames: carousel.frames.map(frame => frame.id !== frameId ? frame : { ...frame, currentLayout: layoutIndex, layoutVariant: 0 }) };
    }));
  };
  
  const handleShuffleLayoutVariant = (carouselId, frameId) => {
    setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      return { ...carousel, frames: carousel.frames.map(frame => frame.id !== frameId ? frame : { ...frame, layoutVariant: ((frame.layoutVariant || 0) + 1) % 3 }) };
    }));
  };
  
  const handleUpdateText = (carouselId, frameId, field, value) => {
    setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      return {
        ...carousel,
        frames: carousel.frames.map(frame => {
          if (frame.id !== frameId) return frame;
          const updatedVariants = [...frame.variants];
          updatedVariants[frame.currentVariant] = { ...updatedVariants[frame.currentVariant], [field]: value };
          return { ...frame, variants: updatedVariants };
        })
      };
    }));
  };
  
  const handleUpdateFormatting = (carouselId, frameId, field, key, value) => {
    setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      return {
        ...carousel,
        frames: carousel.frames.map(frame => {
          if (frame.id !== frameId) return frame;
          const updatedVariants = [...frame.variants];
          const currentVariant = updatedVariants[frame.currentVariant];
          const currentFormatting = currentVariant.formatting || {};
          const fieldFormatting = currentFormatting[field] || {};
          updatedVariants[frame.currentVariant] = { ...currentVariant, formatting: { ...currentFormatting, [field]: { ...fieldFormatting, [key]: value } } };
          return { ...frame, variants: updatedVariants };
        })
      };
    }));
  };
  
  const handleAddFrame = (carouselId, position = null) => {
    setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      const insertIndex = position !== null ? position : carousel.frames.length;
      const adjacentFrame = carousel.frames[Math.max(0, insertIndex - 1)] || carousel.frames[0];
      const newFrame = {
        id: Date.now(), // Use timestamp for unique ID
        variants: [
          { headline: "Add your headline", body: "Add your supporting copy here.", formatting: {} },
          { headline: "Alternative headline", body: "Alternative supporting copy.", formatting: {} },
          { headline: "Third option", body: "Third copy variation.", formatting: {} }
        ],
        currentVariant: 0, currentLayout: 0, layoutVariant: 0,
        style: adjacentFrame?.style || "dark-single-pin"
      };
        const newFrames = [...carousel.frames];
        newFrames.splice(insertIndex, 0, newFrame);
      // Re-number the frames
      const renumberedFrames = newFrames.map((f, idx) => ({ ...f, id: idx + 1 }));
      return { ...carousel, frames: renumberedFrames };
    }));
  };
  
  const handleChangeFrameSize = (carouselId, newSize) => {
    setCarousels(prev => prev.map(carousel => carousel.id === carouselId ? { ...carousel, frameSize: newSize } : carousel));
  };
  
  const handleRemoveFrame = (carouselId, frameId) => {
    if (selectedCarouselId === carouselId && selectedFrameId === frameId) setSelectedFrameId(null);
    setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      if (carousel.frames.length <= 1) return carousel;
      const newFrames = carousel.frames.filter(f => f.id !== frameId).map((f, idx) => ({ ...f, id: idx + 1 }));
      return { ...carousel, frames: newFrames };
    }));
  };
  
  const handleReorderFrames = (carouselId, oldIndex, newIndex) => {
      setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      const newFrames = arrayMove(carousel.frames, oldIndex, newIndex).map((f, idx) => ({ ...f, id: idx + 1 }));
      return { ...carousel, frames: newFrames };
    }));
  };

  const handleAddRow = (afterIndex) => {
    const newId = Date.now();
    const newCarousel = {
      id: newId,
      name: "New Row",
      subtitle: "Click to edit",
      frameSize: "portrait",
      frames: [
        {
          id: 1,
          variants: [
            { headline: "Your headline here", body: "Your body text here.", formatting: {} },
            { headline: "Alternative headline", body: "Alternative body text.", formatting: {} },
            { headline: "Third variation", body: "Third body option.", formatting: {} }
          ],
          currentVariant: 0,
          currentLayout: 0,
          layoutVariant: 0,
          style: "dark-single-pin"
        }
      ]
    };
    
    setCarousels(prev => {
      const newCarousels = [...prev];
      newCarousels.splice(afterIndex + 1, 0, newCarousel);
      return newCarousels;
    });
    
    // Select the new row
    setSelectedCarouselId(newId);
  };

  const handleRemoveRow = (carouselId) => {
    // Don't allow removing the last row
    if (carousels.length <= 1) return;
    
    // Clear selection if removing the selected row
    if (selectedCarouselId === carouselId) {
      setSelectedCarouselId(null);
      setSelectedFrameId(null);
      setActiveTextField(null);
    }
    
    setCarousels(prev => prev.filter(c => c.id !== carouselId));
  };
  
  const panelWidth = activePanel ? 288 : 0; // w-72 = 288px
  const sidebarWidth = 64; // w-16 = 64px
  const totalOffset = sidebarWidth + panelWidth;
  
  return (
    <div className="h-screen text-white overflow-hidden" style={{ backgroundColor: '#0d1321' }}>
      {/* Browser-style Tab Bar - Full Width */}
      <div className="fixed top-0 left-0 right-0 z-[110] border-b border-gray-700" style={{ height: 56, backgroundColor: '#0d1321' }}>
        <div className="flex items-end h-full">
          {/* Home Button */}
          <div className="flex items-center px-3 pb-2">
            <button 
              onClick={handleGoHome}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${currentView === 'home' ? 'text-white bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
          </div>
          {/* Tabs */}
          <div className="flex items-end">
            {tabs.map((tab, index) => {
                const isTabActive = tab.active && currentView !== 'home';
                return (
              <div key={tab.id} className="flex items-end">
                {/* Vertical separator - show before inactive tabs (except first) */}
                {index > 0 && !isTabActive && !(tabs[index - 1]?.active && currentView !== 'home') && (
                  <div className="w-px h-5 bg-gray-700 self-center" />
                )}
                <div 
                  onClick={() => handleOpenProject(tab.id)}
                  className={`group flex items-center gap-2 px-4 h-10 rounded-t-lg cursor-pointer transition-colors duration-150 ${
                    isTabActive 
                      ? 'bg-gray-800 text-white' 
                      : 'bg-transparent text-gray-500 hover:text-gray-300'
                  }`}
                  style={{ minWidth: 140, maxWidth: 220 }}
                >
                  <svg className={`w-4 h-4 flex-shrink-0 transition-colors ${isTabActive ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm font-medium truncate flex-1">{tab.name}</span>
                  <button 
                    onClick={(e) => handleCloseTab(tab.id, e)}
                    className={`w-5 h-5 rounded flex items-center justify-center transition-opacity ${
                      isTabActive 
                        ? 'hover:bg-gray-700 text-gray-400 hover:text-white opacity-100' 
                        : 'opacity-0 group-hover:opacity-100 hover:bg-gray-700 text-gray-500 hover:text-white'
                    }`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            );
              })}
            {/* Separator before add button */}
            <div className="w-px h-5 bg-gray-700 self-center mx-1" />
            {/* Add Tab Button with Dropdown */}
            <div ref={newTabMenuRef} className="relative mb-1">
              <button 
                onClick={() => { const wasOpen = showNewTabMenu; closeAllDropdowns(); if (!wasOpen && tabs.length < MAX_TABS) setShowNewTabMenu(true); }}
                disabled={tabs.length >= MAX_TABS}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  tabs.length >= MAX_TABS 
                    ? 'text-gray-600 cursor-not-allowed' 
                    : showNewTabMenu ? 'text-white bg-gray-800' : 'text-gray-500 hover:text-white hover:bg-gray-800'
                }`}
                title={tabs.length >= MAX_TABS ? 'Maximum tabs reached' : 'New tab'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              
              {/* New Tab Dropdown Menu */}
              {showNewTabMenu && (
                <div className="absolute top-full left-0 mt-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200] min-w-[200px]">
                  {/* New Project Option */}
                  <button
                    onClick={() => { handleAddTab(); setShowNewTabMenu(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-white">New Project</div>
                      <div className="text-xs text-gray-500">Start from scratch</div>
                    </div>
                  </button>
                  
                  {/* Divider */}
                  <div className="my-1.5 border-t border-gray-700" />
                  
                  {/* Existing Projects Header */}
                  <div className="px-3 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Open Existing
                  </div>
                  
                  {/* List of existing projects */}
                  {tabs.map(project => (
                    <button
                      key={project.id}
                      onClick={() => { handleOpenProject(project.id); setShowNewTabMenu(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
                        project.id === activeTabId && currentView !== 'home'
                          ? 'bg-gray-700/50 text-white' 
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${project.hasContent ? 'bg-gray-700' : 'bg-gray-800 border border-gray-700'}`}>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{project.name}</div>
                        <div className="text-xs text-gray-500">
                          {project.hasContent ? `${project.frameCount || 5} frames` : 'Empty'}
                        </div>
                      </div>
                      {project.id === activeTabId && currentView !== 'home' && (
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            </div>
          
          {/* Tab Counter */}
          <div className="flex items-center px-4 pb-2 ml-auto">
            <span className="text-xs text-gray-500">
              <span className={tabs.length >= MAX_TABS ? 'text-orange-400' : 'text-gray-400'}>{tabs.length}</span>
              <span className="mx-0.5">/</span>
              <span>{MAX_TABS}</span>
            </span>
          </div>
        </div>
      </div>
      
      {/* Sidebar - Always visible */}
      <Sidebar 
        activePanel={activePanel} 
        onPanelChange={setActivePanel} 
        zoom={zoom} 
        onZoomChange={setZoom} 
        isHomePage={currentView === 'home'}
        onAccountClick={() => { setActivePanel(null); setIsAccountOpen(!isAccountOpen); }}
        isAccountOpen={isAccountOpen}
        onCloseAccount={() => setIsAccountOpen(false)}
      />
      
      {/* Panels - Always visible */}
      <DesignSystemPanel designSystem={designSystem} onUpdate={setDesignSystem} onClose={() => setActivePanel(null)} isOpen={activePanel === 'design'} />
      <ExportPanel onClose={() => setActivePanel(null)} isOpen={activePanel === 'export'} carousels={carousels} />
      <AccountPanel onClose={() => setIsAccountOpen(false)} isOpen={isAccountOpen && currentView === 'home'} />

      {/* Homepage or Editor View */}
      {currentView === 'home' ? (
        <div className="absolute inset-0 top-[56px]" style={{ left: totalOffset, transition: 'left 0.3s ease-out' }}>
          <Homepage 
            projects={tabs} 
            onOpenProject={handleOpenProject}
            onCreateNew={handleCreateNewFromHome}
          />
        </div>
      ) : (
        <>

      {/* Toolbar */}
      <Toolbar
        totalOffset={totalOffset}
        activeTab={activeTab}
        selectedCarouselId={selectedCarouselId}
        selectedCarousel={selectedCarousel}
        selectedFrame={selectedFrame}
        selectedFrameId={selectedFrameId}
        activeTextField={activeTextField}
        carousels={carousels}
        designSystem={designSystem}
        showFormatPicker={showFormatPicker}
        setShowFormatPicker={setShowFormatPicker}
        showLayoutPicker={showLayoutPicker}
        setShowLayoutPicker={setShowLayoutPicker}
        showSnippetsPicker={showSnippetsPicker}
        setShowSnippetsPicker={setShowSnippetsPicker}
        showFontPicker={showFontPicker}
        setShowFontPicker={setShowFontPicker}
        showFontSize={showFontSize}
        setShowFontSize={setShowFontSize}
        showColorPicker={showColorPicker}
        setShowColorPicker={setShowColorPicker}
        showUnderlinePicker={showUnderlinePicker}
        setShowUnderlinePicker={setShowUnderlinePicker}
        showTextAlign={showTextAlign}
        setShowTextAlign={setShowTextAlign}
        showLineSpacing={showLineSpacing}
        setShowLineSpacing={setShowLineSpacing}
        showLetterSpacing={showLetterSpacing}
        setShowLetterSpacing={setShowLetterSpacing}
        formatPickerRef={formatPickerRef}
        layoutPickerRef={layoutPickerRef}
        snippetsPickerRef={snippetsPickerRef}
        fontPickerRef={fontPickerRef}
        fontSizeRef={fontSizeRef}
        colorPickerRef={colorPickerRef}
        underlineRef={underlineRef}
        textAlignRef={textAlignRef}
        lineSpacingRef={lineSpacingRef}
        letterSpacingRef={letterSpacingRef}
        closeAllDropdowns={closeAllDropdowns}
        onChangeFrameSize={handleChangeFrameSize}
        onSetLayout={handleSetLayout}
        onShuffleLayoutVariant={handleShuffleLayoutVariant}
        onSetVariant={handleSetVariant}
        onUpdateFormatting={handleUpdateFormatting}
        onDeselect={() => { setSelectedCarouselId(null); setSelectedFrameId(null); setActiveTextField(null); }}
      />
      
      {/* Main Content - Scrollable Canvas Area */}
      <div className="overflow-y-auto overflow-x-hidden" style={{ marginLeft: totalOffset, marginTop: activeTab?.hasContent ? 120 : 56, height: activeTab?.hasContent ? 'calc(100vh - 120px)' : 'calc(100vh - 56px)', width: `calc(100vw - ${totalOffset}px)`, transition: 'margin-left 0.3s ease-out, width 0.3s ease-out' }}>
      {/* Content Area - Either New Project View or Canvas */}
      {activeTab && !activeTab.hasContent ? (
        <NewProjectView onCreateProject={handleCreateProject} />
      ) : (
        <>
          {/* Canvas workspace */}
          <div className="p-6 pb-96" onClick={() => { closeAllDropdowns(); setSelectedCarouselId(null); setSelectedFrameId(null); setActiveTextField(null); }}>
            <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left', width: `${100 / (zoom / 100)}%`, transition: 'transform 150ms ease-out' }}>
            
            {/* Project Header */}
            <ProjectHeader 
              projectName={activeTab?.name || 'Untitled Project'} 
              onUpdateName={handleUpdateProjectName}
            />
            
            {carousels.map((carousel, index) => (
              <React.Fragment key={carousel.id}>
                <CarouselRow
                  carousel={carousel}
                  designSystem={designSystem}
                  isSelected={selectedCarouselId === carousel.id}
                  hasAnySelection={selectedCarouselId !== null}
                  selectedFrameId={selectedCarouselId === carousel.id ? selectedFrameId : null}
                  onSelect={handleSelectCarousel}
                  onSelectFrame={handleSelectFrame}
                  onAddFrame={handleAddFrame}
                  onRemoveFrame={handleRemoveFrame}
                  onRemoveRow={handleRemoveRow}
                  onReorderFrames={handleReorderFrames}
                  onUpdateText={handleUpdateText}
                  activeTextField={activeTextField}
                  onActivateTextField={setActiveTextField}
                />
                {/* Add Row Button - only after last row */}
                {index === carousels.length - 1 && (
                  <div 
                    className="flex items-center px-4 -mt-4"
                    style={{ marginLeft: '10px' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleAddRow(index); }}
                      className="flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-dashed border-gray-600 text-gray-500 hover:border-orange-500 hover:text-orange-400 hover:bg-orange-500/10 transition-all duration-200"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-xs font-medium">Add row</span>
                    </button>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          </div>
        </>
        )}
      </div>
        </>
      )}
      
    </div>
  );
}
