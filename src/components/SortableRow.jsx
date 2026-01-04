import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * Sortable Row Wrapper
 * Wraps CarouselRow to enable vertical drag-and-drop reordering
 * 
 * Uses @dnd-kit for smooth CSS transform-based animations.
 * The drag handle is rendered as a grip icon on the left side of the row.
 */
const SortableRow = ({ id, children, isSelected }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    // Ensure this sortable takes priority over nested ones
    data: {
      type: 'row',
    },
  });

  // Combine refs for the drag handle
  const handleRef = (node) => {
    setActivatorNodeRef(node);
  };

  // CSS transform style for smooth animation
  // Uses translate3d for GPU acceleration
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms ease',
    zIndex: isDragging ? 100 : 'auto',
    opacity: isDragging ? 0.85 : 1,
    position: 'relative',
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-2">
      {/* Drag Handle - Always rendered but styled based on selection */}
      <div
        ref={handleRef}
        className={`flex items-center justify-center shrink-0 transition-all duration-200 ${
          isSelected
            ? 'opacity-100 w-6 cursor-grab active:cursor-grabbing'
            : 'opacity-30 w-6 hover:opacity-60 cursor-grab'
        }`}
        style={{ 
          height: 'auto',
          alignSelf: 'stretch',
          paddingTop: '32px', // Align with the row label area
        }}
        {...attributes}
        {...listeners}
      >
        <div className="flex flex-col gap-0.5 text-[--text-quaternary] hover:text-[--text-tertiary] transition-colors">
          {/* Grip dots icon */}
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <circle cx="9" cy="6" r="1.5" />
            <circle cx="15" cy="6" r="1.5" />
            <circle cx="9" cy="12" r="1.5" />
            <circle cx="15" cy="12" r="1.5" />
            <circle cx="9" cy="18" r="1.5" />
            <circle cx="15" cy="18" r="1.5" />
          </svg>
        </div>
      </div>

      {/* Row Content - min-w-0 allows flex child to shrink below content size */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
};

export default SortableRow;

