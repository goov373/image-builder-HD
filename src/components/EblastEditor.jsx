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
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import EblastSection from './EblastSection';

/**
 * Sortable Section Wrapper
 */
const SortableSection = ({ 
  id, 
  section, 
  eblastId, 
  designSystem, 
  sectionIndex, 
  totalSections, 
  isSectionSelected, 
  onSelectSection, 
  onRemove, 
  onUpdateText, 
  activeTextField, 
  onActivateTextField,
  isEblastSelected,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    disabled: !isEblastSelected,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <EblastSection
        section={section}
        eblastId={eblastId}
        designSystem={designSystem}
        sectionIndex={sectionIndex}
        totalSections={totalSections}
        isSectionSelected={isSectionSelected}
        onSelectSection={onSelectSection}
        onRemove={onRemove}
        onUpdateText={onUpdateText}
        activeTextField={activeTextField}
        onActivateTextField={onActivateTextField}
      />
    </div>
  );
};

/**
 * Add Section Button
 */
const AddSectionButton = ({ onAdd, position }) => (
  <div className="flex justify-center py-2">
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onAdd(position); }}
      className="flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-dashed border-gray-600 text-gray-500 hover:border-teal-500 hover:text-teal-400 hover:bg-teal-500/10 transition-all duration-200"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      <span className="text-xs font-medium">Add section</span>
    </button>
  </div>
);

/**
 * Eblast Editor Component
 * Vertical stack editor for email campaigns
 */
const EblastEditor = ({
  eblast,
  designSystem,
  isSelected,
  selectedSectionId,
  onSelect,
  onSelectSection,
  onAddSection,
  onRemoveSection,
  onReorderSections,
  onUpdateText,
  activeTextField,
  onActivateTextField,
}) => {
  const totalSections = eblast.sections.length;
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id && over) {
      const oldIndex = eblast.sections.findIndex(s => `section-${s.id}` === active.id);
      const newIndex = eblast.sections.findIndex(s => `section-${s.id}` === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorderSections?.(eblast.id, oldIndex, newIndex);
      }
    }
  };

  const sectionIds = eblast.sections.map(s => `section-${s.id}`);

  return (
    <div 
      data-eblast-id={eblast.id}
      className={`mb-10 rounded-xl transition-all duration-150 p-6 ${
        isSelected 
          ? 'bg-teal-500/5 border border-teal-500/20' 
          : 'hover:bg-gray-800/30 border border-transparent'
      }`}
      onClick={(e) => { e.stopPropagation(); onSelect?.(eblast.id); }}
    >
      {/* Eblast Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); onSelect?.(isSelected ? null : eblast.id); }} 
            className={`w-11 h-11 rounded-xl border-2 flex items-center justify-center transition-all duration-150 ${
              isSelected 
                ? 'border-teal-500 bg-teal-500/10 hover:bg-teal-500/20' 
                : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800'
            }`}
          >
            {isSelected ? (
              <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            )}
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-lg font-bold transition-colors ${isSelected ? 'text-teal-400' : 'text-white'}`}>
                {eblast.name}
              </h2>
              {isSelected && (
                <span className="text-[9px] bg-teal-500/20 text-teal-400 px-1.5 py-0.5 rounded font-medium">
                  EDITING
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400">{eblast.subtitle} · {totalSections} sections</p>
          </div>
        </div>
        
        {/* Preview Text */}
        {isSelected && eblast.previewText && (
          <div className="text-xs text-gray-500 max-w-xs truncate">
            Preview: {eblast.previewText}
          </div>
        )}
      </div>

      {/* Sections Stack */}
      <div className="flex flex-col items-center gap-3">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
            {eblast.sections.map((section, index) => (
              <React.Fragment key={section.id}>
                <SortableSection
                  id={`section-${section.id}`}
                  section={section}
                  eblastId={eblast.id}
                  designSystem={designSystem}
                  sectionIndex={index}
                  totalSections={totalSections}
                  isSectionSelected={isSelected && selectedSectionId === section.id}
                  onSelectSection={(sectionId) => onSelectSection?.(eblast.id, sectionId)}
                  onRemove={(sectionId) => onRemoveSection?.(eblast.id, sectionId)}
                  onUpdateText={onUpdateText}
                  activeTextField={isSelected && selectedSectionId === section.id ? activeTextField : null}
                  onActivateTextField={onActivateTextField}
                  isEblastSelected={isSelected}
                />
                
                {/* Add Section Button (between sections and after last) */}
                {isSelected && (
                  <AddSectionButton onAdd={onAddSection} position={index + 1} />
                )}
              </React.Fragment>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default EblastEditor;


