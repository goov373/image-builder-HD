import React from 'react';
import { 
  useDesignSystemContext, 
  useSelectionContext, 
  useCarouselsContext,
  useDropdownsContext 
} from '../context';
import Toolbar from './Toolbar';
import NewProjectView from './NewProjectView';
import ProjectHeader from './ProjectHeader';
import CarouselRow from './CarouselRow';
import EblastEditor from './EblastEditor';
import VideoCoverEditor from './VideoCoverEditor';

export default function EditorView({
  // Layout props
  totalOffset,
  zoom,
  // Tab/Project props
  activeTab,
  onUpdateProjectName,
  onCreateProject,
  projectType = 'carousel',
}) {
  // Get state from context
  const { designSystem } = useDesignSystemContext();
  const selection = useSelectionContext();
  const carouselsCtx = useCarouselsContext();
  const dropdowns = useDropdownsContext();

  // Carousel selection
  const {
    selectedCarouselId,
    selectedFrameId,
    selectedCarousel,
    selectedFrame,
    // Eblast selection
    selectedEblastId,
    selectedSectionId,
    selectedEblast,
    selectedSection,
    // Video Cover selection
    selectedVideoCoverId,
    selectedVideoCover,
    // Shared
    activeTextField,
    setActiveTextField,
    handleSelectCarousel,
    handleSelectFrame,
    handleSelectEblast,
    handleSelectSection,
    handleSelectVideoCover,
    handleDeselect,
  } = selection;

  // Carousel methods
  const {
    carousels,
    handleSetVariant,
    handleSetLayout,
    handleShuffleLayoutVariant,
    handleUpdateText,
    handleUpdateFormatting,
    handleAddFrame,
    handleRemoveFrame,
    handleChangeFrameSize,
    handleReorderFrames,
    handleAddRow,
    handleRemoveRow,
    // Eblast methods
    eblasts,
    handleEblastUpdateText,
    handleAddSection,
    handleRemoveSection,
    handleReorderSections,
    // Video Cover methods
    videoCovers,
    handleVideoCoverUpdateText,
    handleVideoCoverChangeFrameSize,
    handleTogglePlayButton,
    handleUpdateEpisodeNumber,
  } = carouselsCtx;

  // Determine which content to show based on project type
  const isCarousel = projectType === 'carousel' || !projectType;
  const isEblast = projectType === 'eblast';
  const isVideoCover = projectType === 'videoCover';

  return (
    <>
      {/* Toolbar */}
      <Toolbar
        totalOffset={totalOffset}
        activeTab={activeTab}
        projectType={projectType}
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
              onClick={handleDeselect}
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
                
                {/* Carousel Content */}
                {isCarousel && carousels.map((carousel, index) => (
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

                {/* Eblast Content */}
                {isEblast && eblasts && eblasts.map((eblast, index) => (
                  <React.Fragment key={eblast.id}>
                    <EblastEditor
                      eblast={eblast}
                      designSystem={designSystem}
                      isSelected={selectedEblastId === eblast.id}
                      selectedSectionId={selectedEblastId === eblast.id ? selectedSectionId : null}
                      onSelect={handleSelectEblast}
                      onSelectSection={handleSelectSection}
                      onAddSection={(position) => handleAddSection(eblast.id, position)}
                      onRemoveSection={handleRemoveSection}
                      onReorderSections={handleReorderSections}
                      onUpdateText={handleEblastUpdateText}
                      activeTextField={activeTextField}
                      onActivateTextField={setActiveTextField}
                    />
                  </React.Fragment>
                ))}

                {/* Video Cover Content */}
                {isVideoCover && videoCovers && videoCovers.map((videoCover, index) => (
                  <React.Fragment key={videoCover.id}>
                    <VideoCoverEditor
                      videoCover={videoCover}
                      designSystem={designSystem}
                      isSelected={selectedVideoCoverId === videoCover.id}
                      onSelect={handleSelectVideoCover}
                      onUpdateText={handleVideoCoverUpdateText}
                      onTogglePlayButton={handleTogglePlayButton}
                      onUpdateEpisodeNumber={handleUpdateEpisodeNumber}
                      onChangeFrameSize={handleVideoCoverChangeFrameSize}
                      activeTextField={activeTextField}
                      onActivateTextField={setActiveTextField}
                    />
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
