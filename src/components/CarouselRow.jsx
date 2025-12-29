import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { frameSizes } from '../data';
import { SortableFrame } from './CarouselFrame';

/**
 * Carousel Row Component
 * Displays a row of frames with drag-and-drop reordering
 */
const CarouselRow = ({ carousel, designSystem, isSelected, hasAnySelection, selectedFrameId, onSelect, onSelectFrame, onAddFrame, onRemoveFrame, onRemoveRow, onUpdateText, activeTextField, onActivateTextField, onReorderFrames }) => {
  const totalFrames = carousel.frames.length;
  const isFaded = hasAnySelection && !isSelected;
  
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

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id && over) {
      const oldIndex = carousel.frames.findIndex(f => `frame-${f.id}` === active.id);
      const newIndex = carousel.frames.findIndex(f => `frame-${f.id}` === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorderFrames(carousel.id, oldIndex, newIndex);
      }
    }
  };

  const frameIds = carousel.frames.map(f => `frame-${f.id}`);
  
  return (
    <div 
      data-carousel-id={carousel.id}
      className={`mb-10 rounded-xl transition-all duration-150 cursor-pointer overflow-x-auto hide-scrollbar ${isSelected ? 'bg-gray-800/40 border border-gray-600 py-4' : 'hover:bg-gray-800/30 border border-transparent py-4'} ${isFaded ? 'opacity-20 hover:opacity-50' : 'opacity-100'}`}
      style={{ marginLeft: '10px', marginRight: '10px', width: 'fit-content', minWidth: 'auto', maxWidth: 'calc(100% - 20px)' }}
      onClick={(e) => { e.stopPropagation(); onSelect(carousel.id); }}
    >
      <div className="mb-4 flex items-center px-4">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); onSelect(isSelected ? null : carousel.id); }} 
            className={`w-11 h-11 rounded-xl border-2 flex items-center justify-center transition-all duration-150 ${isSelected ? 'border-gray-500 bg-gray-700 hover:bg-gray-600' : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800'}`}
          >
            {isSelected ? (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
            )}
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-lg font-bold transition-colors ${isSelected ? 'text-white' : 'text-white'}`}>{carousel.name}</h2>
              {isSelected && <span className="text-[9px] bg-gray-600 text-gray-300 px-1.5 py-0.5 rounded font-medium">EDITING</span>}
              {/* Remove Row Button - next to EDITING tag */}
              {isSelected && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onRemoveRow(carousel.id); }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-150"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  REMOVE
                </button>
              )}
            </div>
            <p className="text-sm text-gray-400">{carousel.subtitle}</p>
          </div>
        </div>
      </div>
        
      <div className="px-4" style={{ minHeight: 300 }}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={frameIds} strategy={horizontalListSortingStrategy}>
            <div className={`flex items-center transition-all duration-150 ease-out`} style={{ width: 'auto', minWidth: 'fit-content', gap: isSelected ? '12px' : '10px' }}>
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
                    cardWidth={frameSizes[carousel.frameSize]?.width || 192}
                  />
              
                  {/* Add Button After Each Frame */}
                  <div 
                    className={`flex items-center justify-center self-stretch transition-all duration-150 ease-out ${isSelected ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    style={{ width: isSelected ? 32 : 0, paddingTop: 24, overflow: 'hidden' }}
                  >
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onAddFrame(carousel.id, index + 1); }} 
                      className="w-7 h-7 rounded-full border-2 border-dashed border-gray-600 opacity-50 hover:opacity-100 hover:border-gray-400 hover:bg-gray-700 flex items-center justify-center transition-all duration-150"
                    >
                      <svg className="w-3.5 h-3.5 text-gray-500 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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


