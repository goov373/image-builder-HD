import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDesignSystemContext, useSelectionContext, useCarouselsContext, useDropdownsContext } from '../context';
import Toolbar from './Toolbar';
import NewProjectView from './NewProjectView';
import ProjectHeader from './ProjectHeader';
import CarouselRow from './CarouselRow';
import SortableRow from './SortableRow';
import EblastEditor from './EblastEditor';
import VideoCoverEditor from './VideoCoverEditor';
import SingleImageEditor from './SingleImageEditor';

export default function EditorView({
  // Layout props
  totalOffset,
  zoom,
  onZoomChange,
  // Tab/Project props
  activeTab,
  onUpdateProjectName,
  onCreateProject,
  projectType = 'carousel',
  // Product image callback
  onRequestAddProductImage,
  // Icon callback
  onRequestAddIcon,
  // Fill color callback
  onRequestAddFill,
  // Photo callback
  onRequestAddPhoto,
  // Pattern callback
  onRequestAddPattern,
  // Page indicator callback
  onRequestAddPageIndicator,
}) {
  // Get state from context
  const { designSystem } = useDesignSystemContext();
  const selection = useSelectionContext();
  const carouselsCtx = useCarouselsContext();
   
  const _dropdowns = useDropdownsContext();

  // Carousel selection - destructure all selection state
   
  const {
    selectedCarouselId,
    selectedFrameId,
    selectedCarousel: _selectedCarousel,
    selectedFrame: _selectedFrame,
    // Eblast selection
    selectedEblastId,
    selectedSectionId,
    selectedEblast: _selectedEblast,
    selectedSection: _selectedSection,
    // Video Cover selection
    selectedVideoCoverId,
    selectedVideoCover: _selectedVideoCover,
    // Single Image selection
    selectedImageId,
    selectedLayerId: _selectedLayerId,
    selectedImage: _selectedImage,
    selectedLayer: _selectedLayer,
    // Shared
    activeTextField,
    setActiveTextField,
    handleSelectCarousel,
    handleSelectFrame,
    handleSelectEblast,
    handleSelectSection,
    handleSelectVideoCover,
    handleSelectSingleImage,
    handleDeselect,
    handleDeselectFrame,
  } = selection;

  // Carousel methods - destructure all handlers from context
   
  const {
    carousels,
    handleSetVariant: _handleSetVariant,
    handleSetLayout: _handleSetLayout,
    handleShuffleLayoutVariant: _handleShuffleLayoutVariant,
    handleUpdateText,
    handleUpdateFormatting: _handleUpdateFormatting,
    handleAddFrame,
    handleRemoveFrame,
    handleChangeFrameSize: _handleChangeFrameSize,
    handleReorderFrames,
    handleAddRow,
    handleRemoveRow,
    handleSetFrameBackground,
    // Image layer methods
    handleAddImageToFrame: _handleAddImageToFrame,
    handleUpdateImageLayer,
    handleRemoveImageFromFrame,
    // Fill layer methods
    handleUpdateFillLayer,
    // Pattern layer methods (carousels)
    handleUpdatePatternLayer: handleUpdatePatternLayerCarousel,
    handleRemovePatternFromFrame,
    // Product image layer methods (carousels)
    handleAddProductImageToFrame: _handleAddProductImageToFrame,
    handleUpdateProductImageLayer,
    handleRemoveProductImageFromFrame,
    // Icon layer methods (carousels)
    handleAddIconToFrame: _handleAddIconToFrame,
    handleUpdateIconLayer,
    handleRemoveIconFromFrame,
    // Progress indicator methods (carousels)
    handleUpdateProgressIndicator,
    // Background layer order methods (carousels)
    handleReorderBackgroundLayers,
    // Row reordering
    handleReorderCarousels,
    // Eblast methods
    eblasts,
    handleEblastUpdateText,
    handleAddSection,
    handleRemoveSection,
    handleReorderSections,
    // Eblast layer methods
    handleSetSectionBackground: _handleSetSectionBackground,
    handleSetStretchedBackground: _handleSetStretchedBackground,
    handleAddPatternToSection: _handleAddPatternToSection,
    handleUpdatePatternLayer: _handleUpdatePatternLayer,
    handleRemovePatternFromSection: _handleRemovePatternFromSection,
    handleSetStretchedPattern: _handleSetStretchedPattern,
    handleAddImageToSection: _handleAddImageToSection,
    handleUpdateImageLayerEblast,
    handleRemoveImageFromSection,
    // Video Cover methods
    videoCovers,
    handleVideoCoverUpdateText,
    handleVideoCoverChangeFrameSize,
    handleTogglePlayButton,
    handleUpdateEpisodeNumber,
    // Video Cover layer methods
    handleVideoCoverSetBackground: _handleVideoCoverSetBackground,
    handleVideoCoverAddPattern: _handleVideoCoverAddPattern,
    handleVideoCoverUpdatePattern: _handleVideoCoverUpdatePattern,
    handleVideoCoverRemovePattern: _handleVideoCoverRemovePattern,
    handleVideoCoverAddImage: _handleVideoCoverAddImage,
    handleVideoCoverUpdateImage,
    handleVideoCoverRemoveImage,
    // Single Image methods
    singleImages,
    handleUpdateLayer,
    handleAddLayer,
    handleRemoveLayer,
    handleReorderLayers,
  } = carouselsCtx;

  // Determine which content to show based on project type
  const isCarousel = projectType === 'carousel' || !projectType;
  const isEblast = projectType === 'eblast';
  const isVideoCover = projectType === 'videoCover';
  const isSingleImage = projectType === 'singleImage';

  // Sensors for row drag-and-drop (with distance activation to prevent accidental drags)
  const rowSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle row drag end
  const handleRowDragEnd = (event) => {
    const { active, over } = event;
    console.log('Row drag end:', { activeId: active?.id, overId: over?.id, carouselIds: carousels.map(c => `row-${c.id}`) });
    if (active.id !== over?.id && over) {
      const oldIndex = carousels.findIndex((c) => `row-${c.id}` === active.id);
      const newIndex = carousels.findIndex((c) => `row-${c.id}` === over.id);
      console.log('Row reorder:', { oldIndex, newIndex });
      if (oldIndex !== -1 && newIndex !== -1) {
        handleReorderCarousels(oldIndex, newIndex);
      }
    }
  };

  return (
    <>
      {/* Toolbar */}
      <Toolbar totalOffset={totalOffset} activeTab={activeTab} projectType={projectType} zoom={zoom} onZoomChange={onZoomChange} />

      {/* Main Content - Scrollable Canvas Area */}
      <div
        className="overflow-y-auto overflow-x-hidden"
        style={{
          marginLeft: totalOffset,
          marginTop: activeTab?.hasContent ? 120 : 56,
          height: activeTab?.hasContent ? 'calc(100vh - 120px)' : 'calc(100vh - 56px)',
          width: `calc(100vw - ${totalOffset}px)`,
          transition: 'margin-left 0.3s ease-out, width 0.3s ease-out',
        }}
      >
        {/* Content Area - Either New Project View or Canvas */}
        {activeTab && !activeTab.hasContent ? (
          <NewProjectView onCreateProject={onCreateProject} />
        ) : (
          <>
            {/* Canvas workspace */}
            <div className="p-6 pb-96" onClick={handleDeselect}>
              <div
                style={{
                  transform: isSingleImage ? 'none' : `scale(${zoom / 100})`,
                  transformOrigin: 'top left',
                  width: isSingleImage ? '100%' : `${100 / (zoom / 100)}%`,
                  transition: 'transform 150ms ease-out',
                }}
              >
                {/* Project Header */}
                <ProjectHeader projectName={activeTab?.name || 'Untitled Project'} onUpdateName={onUpdateProjectName} />

                {/* Carousel Content with Drag-and-Drop Row Reordering */}
                {isCarousel && (
                  <DndContext
                    sensors={rowSensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleRowDragEnd}
                  >
                    <SortableContext
                      items={carousels.map((c) => `row-${c.id}`)}
                      strategy={verticalListSortingStrategy}
                    >
                      {carousels.map((carousel, index) => (
                        <React.Fragment key={carousel.id}>
                          <SortableRow
                            id={`row-${carousel.id}`}
                            isSelected={selectedCarouselId === carousel.id}
                          >
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
                              onUpdateImageLayer={handleUpdateImageLayer}
                              onRemoveImageFromFrame={handleRemoveImageFromFrame}
                              onUpdateFillLayer={handleUpdateFillLayer}
                              onClearBackground={(carouselId, frameId) => handleSetFrameBackground(carouselId, frameId, null)}
                              onUpdatePatternLayer={handleUpdatePatternLayerCarousel}
                              onRemovePatternFromFrame={handleRemovePatternFromFrame}
                              onUpdateProductImageLayer={handleUpdateProductImageLayer}
                              onRemoveProductImageFromFrame={handleRemoveProductImageFromFrame}
                              onRequestAddProductImage={onRequestAddProductImage}
                              onUpdateIconLayer={handleUpdateIconLayer}
                              onRemoveIconFromFrame={handleRemoveIconFromFrame}
                              onRequestAddIcon={onRequestAddIcon}
                              onUpdateProgressIndicator={handleUpdateProgressIndicator}
                              onReorderBackgroundLayers={handleReorderBackgroundLayers}
                              onRequestAddFill={onRequestAddFill}
                              onRequestAddPhoto={onRequestAddPhoto}
                              onRequestAddPattern={onRequestAddPattern}
                              onRequestAddPageIndicator={onRequestAddPageIndicator}
                              onDeselectFrame={handleDeselectFrame}
                            />
                          </SortableRow>
                          {/* Add Row Button - only after last row */}
                          {index === carousels.length - 1 && (
                            <div
                              className="flex items-center px-4 -mt-4"
                              style={{ marginLeft: '34px' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddRow(index);
                                }}
                                className="flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-dashed border-gray-600 text-gray-500 hover:border-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-200"
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
                    </SortableContext>
                  </DndContext>
                )}

                {/* Eblast Content */}
                {isEblast &&
                  eblasts &&
                  eblasts.map((eblast, _index) => (
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
                        onUpdateImageLayer={handleUpdateImageLayerEblast}
                        onRemoveImageFromSection={handleRemoveImageFromSection}
                      />
                    </React.Fragment>
                  ))}

                {/* Video Cover Content */}
                {isVideoCover &&
                  videoCovers &&
                  videoCovers.map((videoCover, _index) => (
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
                        onUpdateImage={handleVideoCoverUpdateImage}
                        onRemoveImage={handleVideoCoverRemoveImage}
                      />
                    </React.Fragment>
                  ))}

                {/* Single Image Content */}
                {isSingleImage &&
                  singleImages &&
                  singleImages.map((singleImage, _index) => (
                    <React.Fragment key={singleImage.id}>
                      <SingleImageEditor
                        singleImage={singleImage}
                        designSystem={designSystem}
                        isSelected={selectedImageId === singleImage.id}
                        onSelect={handleSelectSingleImage}
                        onUpdateLayer={handleUpdateLayer}
                        onAddLayer={handleAddLayer}
                        onRemoveLayer={handleRemoveLayer}
                        onReorderLayers={handleReorderLayers}
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
