import React from 'react';
import Toolbar from './Toolbar';
import NewProjectView from './NewProjectView';
import ProjectHeader from './ProjectHeader';
import CarouselRow from './CarouselRow';

export default function EditorView({
  // Layout
  totalOffset,
  zoom,
  // Tab/Project
  activeTab,
  onUpdateProjectName,
  onCreateProject,
  // Carousels
  carousels,
  designSystem,
  selectedCarouselId,
  selectedFrameId,
  selectedCarousel,
  selectedFrame,
  activeTextField,
  onSelectCarousel,
  onSelectFrame,
  onAddFrame,
  onRemoveFrame,
  onRemoveRow,
  onReorderFrames,
  onUpdateText,
  onActivateTextField,
  onAddRow,
  onDeselect,
  // Toolbar props
  onChangeFrameSize,
  onSetLayout,
  onShuffleLayoutVariant,
  onSetVariant,
  onUpdateFormatting,
  // Dropdown state (passed through to Toolbar)
  dropdownProps,
}) {
  return (
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
        onChangeFrameSize={onChangeFrameSize}
        onSetLayout={onSetLayout}
        onShuffleLayoutVariant={onShuffleLayoutVariant}
        onSetVariant={onSetVariant}
        onUpdateFormatting={onUpdateFormatting}
        onDeselect={onDeselect}
        {...dropdownProps}
      />
      
      {/* Main Content - Scrollable Canvas Area */}
      <div 
        className="overflow-y-auto overflow-x-hidden" 
        style={{ 
          marginLeft: totalOffset, 
          marginTop: activeTab?.hasContent ? 120 : 56, 
          height: activeTab?.hasContent ? 'calc(100vh - 120px)' : 'calc(100vh - 56px)', 
          width: `calc(100vw - ${totalOffset}px)`, 
          transition: 'margin-left 0.3s ease-out, width 0.3s ease-out' 
        }}
      >
        {/* Content Area - Either New Project View or Canvas */}
        {activeTab && !activeTab.hasContent ? (
          <NewProjectView onCreateProject={onCreateProject} />
        ) : (
          <>
            {/* Canvas workspace */}
            <div 
              className="p-6 pb-96" 
              onClick={onDeselect}
            >
              <div 
                style={{ 
                  transform: `scale(${zoom / 100})`, 
                  transformOrigin: 'top left', 
                  width: `${100 / (zoom / 100)}%`, 
                  transition: 'transform 150ms ease-out' 
                }}
              >
                {/* Project Header */}
                <ProjectHeader 
                  projectName={activeTab?.name || 'Untitled Project'} 
                  onUpdateName={onUpdateProjectName}
                />
                
                {carousels.map((carousel, index) => (
                  <React.Fragment key={carousel.id}>
                    <CarouselRow
                      carousel={carousel}
                      designSystem={designSystem}
                      isSelected={selectedCarouselId === carousel.id}
                      hasAnySelection={selectedCarouselId !== null}
                      selectedFrameId={selectedCarouselId === carousel.id ? selectedFrameId : null}
                      onSelect={onSelectCarousel}
                      onSelectFrame={onSelectFrame}
                      onAddFrame={onAddFrame}
                      onRemoveFrame={onRemoveFrame}
                      onRemoveRow={onRemoveRow}
                      onReorderFrames={onReorderFrames}
                      onUpdateText={onUpdateText}
                      activeTextField={activeTextField}
                      onActivateTextField={onActivateTextField}
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
                          onClick={(e) => { e.stopPropagation(); onAddRow(index); }}
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
  );
}

