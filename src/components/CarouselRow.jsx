import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { frameSizes } from '../data';
import { SortableFrame } from './CarouselFrame';

/**
 * Carousel Row Component
 * Displays a row of frames with drag-and-drop reordering
 */
const CarouselRow = ({
  carousel,
  designSystem,
  isSelected,
  hasAnySelection,
  selectedFrameId,
  onSelect,
  onSelectFrame,
  onAddFrame,
  onRemoveFrame,
  onRemoveRow,
  onUpdateText,
  activeTextField,
  onActivateTextField,
  onReorderFrames,
  onUpdateImageLayer,
  onRemoveImageFromFrame,
  onUpdateFillLayer,
  onClearBackground,
  onUpdatePatternLayer,
  onRemovePatternFromFrame,
  onUpdateProductImageLayer,
  onRemoveProductImageFromFrame,
  onRequestAddProductImage,
  onUpdateIconLayer,
  onRemoveIconFromFrame,
  onRequestAddIcon,
  onUpdateProgressIndicator,
  onReorderBackgroundLayers,
  onRequestAddFill,
  onRequestAddPhoto,
  onRequestAddPattern,
  onRequestAddPageIndicator,
  onDeselectFrame,
}) => {
  const totalFrames = carousel.frames.length;
  const isFaded = hasAnySelection && !isSelected;

  // Track if ANY frame in the row is being dragged (to hide panels on all frames)
  const [isDraggingAny, setIsDraggingAny] = useState(false);

  // Get card dimensions for consistent add-button alignment
  const cardWidth = frameSizes[carousel.frameSize]?.width || 192;
  const cardHeight = frameSizes[carousel.frameSize]?.height || 240;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Deselect frame (not row) when drag starts to close tool panels, and track drag state
  const handleDragStart = () => {
    setIsDraggingAny(true);
    onDeselectFrame?.(); // Only deselects frame, keeps row open
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id && over) {
      const oldIndex = carousel.frames.findIndex((f) => `frame-${f.id}` === active.id);
      const newIndex = carousel.frames.findIndex((f) => `frame-${f.id}` === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorderFrames(carousel.id, oldIndex, newIndex);
        // Deselect frame after reorder to ensure panels stay closed
        onDeselectFrame?.();
      }
    }
    // Reset drag state after a short delay to allow animations to complete
    setTimeout(() => setIsDraggingAny(false), 150);
  };

  const frameIds = carousel.frames.map((f) => `frame-${f.id}`);

  return (
    <div
      data-carousel-id={carousel.id}
      className={`mb-10 rounded-[--radius-md] transition-all duration-150 cursor-pointer overflow-x-auto hide-scrollbar ${isSelected ? 'bg-[--surface-raised]/40 border border-[--border-emphasis] py-4' : 'hover:bg-[--surface-raised]/30 border border-transparent py-4'} ${isFaded ? 'opacity-20 hover:opacity-50' : 'opacity-100'}`}
      style={{
        marginLeft: '10px',
        marginRight: '10px',
        width: 'fit-content',
        minWidth: 'auto',
        maxWidth: 'calc(100% - 20px)',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(carousel.id);
      }}
    >
      <div className="mb-4 flex items-center px-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(isSelected ? null : carousel.id);
            }}
            className={`w-11 h-11 rounded-[--radius-md] border-2 flex items-center justify-center transition-all duration-150 ${isSelected ? 'border-[--border-strong] bg-[--surface-overlay] hover:bg-[--surface-elevated]' : 'border-[--border-emphasis] hover:border-[--border-strong] hover:bg-[--surface-raised]'}`}
          >
            {isSelected ? (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-[--text-tertiary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            )}
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-lg font-bold transition-colors ${isSelected ? 'text-white' : 'text-white'}`}>
                {carousel.name}
              </h2>
              {isSelected && (
                <span className="text-[9px] bg-[--surface-elevated] text-[--text-secondary] px-1.5 py-0.5 rounded-[--radius-sm] font-medium">EDITING</span>
              )}
              {/* Remove Row Button - next to EDITING tag */}
              {isSelected && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveRow(carousel.id);
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-150"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  REMOVE
                </button>
              )}
            </div>
            <p className="text-sm text-[--text-tertiary]">{carousel.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="px-4" style={{ minHeight: 300 }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={frameIds} strategy={horizontalListSortingStrategy}>
            <div
              className={`flex items-start transition-all duration-150 ease-out`}
              style={{ width: 'auto', minWidth: 'fit-content', gap: isSelected ? '12px' : '10px' }}
            >
              {carousel.frames.map((frame, index) => (
                <React.Fragment key={frame.id}>
                  <SortableFrame
                    id={`frame-${frame.id}`}
                    frame={frame}
                    carouselId={carousel.id}
                    frameSize={carousel.frameSize}
                    designSystem={designSystem}
                    frameIndex={index}
                    totalFrames={totalFrames}
                    isFrameSelected={isSelected && selectedFrameId === frame.id}
                    onSelectFrame={(frameId) => onSelectFrame(carousel.id, frameId)}
                    onRemove={(frameId) => onRemoveFrame(carousel.id, frameId)}
                    onUpdateText={onUpdateText}
                    activeTextField={isSelected && selectedFrameId === frame.id ? activeTextField : null}
                    onActivateTextField={onActivateTextField}
                    isRowSelected={isSelected}
                    cardWidth={cardWidth}
                    onUpdateImageLayer={onUpdateImageLayer}
                    onRemoveImageFromFrame={onRemoveImageFromFrame}
                    onUpdateFillLayer={onUpdateFillLayer}
                    onClearBackground={onClearBackground}
                    onUpdatePatternLayer={onUpdatePatternLayer}
                    onRemovePatternFromFrame={onRemovePatternFromFrame}
                    onUpdateProductImageLayer={onUpdateProductImageLayer}
                    onRemoveProductImageFromFrame={onRemoveProductImageFromFrame}
                    onRequestAddProductImage={onRequestAddProductImage}
                    onUpdateIconLayer={onUpdateIconLayer}
                    onRemoveIconFromFrame={onRemoveIconFromFrame}
                    onRequestAddIcon={onRequestAddIcon}
                    onUpdateProgressIndicator={onUpdateProgressIndicator}
                    onReorderBackgroundLayers={onReorderBackgroundLayers}
                    onRequestAddFill={onRequestAddFill}
                    onRequestAddPhoto={onRequestAddPhoto}
                    onRequestAddPattern={onRequestAddPattern}
                    onRequestAddPageIndicator={onRequestAddPageIndicator}
                    prevFrameImage={index > 0 ? carousel.frames[index - 1]?.imageLayer : null}
                    nextFrameImage={index < totalFrames - 1 ? carousel.frames[index + 1]?.imageLayer : null}
                    isDraggingAny={isDraggingAny}
                  />

                  {/* Add Button After Each Frame - Fixed height to align with card center */}
                  <div
                    className={`flex items-center justify-center transition-all duration-150 ease-out ${isSelected ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    style={{ width: isSelected ? 32 : 0, height: cardHeight, overflow: 'hidden' }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddFrame(carousel.id, index + 1);
                      }}
                      className="w-7 h-7 rounded-full border-2 border-dashed border-[--border-emphasis] opacity-50 hover:opacity-100 hover:border-[--border-strong] hover:bg-[--surface-overlay] flex items-center justify-center transition-all duration-150"
                    >
                      <svg
                        className="w-3.5 h-3.5 text-[--text-quaternary] hover:text-white transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default CarouselRow;
