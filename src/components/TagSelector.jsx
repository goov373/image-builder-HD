import { useState, useRef, useEffect } from 'react';

/**
 * Tag Selector Component
 * Multi-select dropdown for selecting tags with pill display
 */
const TagSelector = ({
  label,
  availableTags,
  selectedTagIds,
  onTagsChange,
  placeholder = 'Add tags...',
  isEditable = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleToggleTag = (tagId) => {
    if (selectedTagIds.includes(tagId)) {
      onTagsChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onTagsChange([...selectedTagIds, tagId]);
    }
  };

  const handleRemoveTag = (e, tagId) => {
    e.stopPropagation();
    onTagsChange(selectedTagIds.filter((id) => id !== tagId));
  };

  const selectedTags = availableTags.filter((tag) => selectedTagIds.includes(tag.id));

  return (
    <div className="flex items-start gap-2 text-sm" ref={dropdownRef}>
      {/* Label */}
      <span className="text-[--text-quaternary] shrink-0 pt-0.5">{label}:</span>

      {/* Tags display area */}
      <div className="flex flex-wrap items-center gap-1.5 min-h-[22px]">
        {selectedTags.length > 0 ? (
          selectedTags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[--surface-overlay] text-[--text-secondary] text-xs font-medium"
            >
              {tag.label}
              {isEditable && (
                <button
                  type="button"
                  onClick={(e) => handleRemoveTag(e, tag.id)}
                  className="w-3.5 h-3.5 rounded-full hover:bg-[--surface-elevated] flex items-center justify-center transition-colors"
                >
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </span>
          ))
        ) : (
          <span className="text-[--text-quaternary] text-xs italic">{placeholder}</span>
        )}

        {/* Add button */}
        {isEditable && (
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              className="w-5 h-5 rounded-full border border-dashed border-[--border-emphasis] flex items-center justify-center text-[--text-quaternary] hover:text-[--text-tertiary] hover:border-[--border-strong] transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>

            {/* Dropdown */}
            {isOpen && (
              <div className="absolute left-0 top-full mt-1 z-50 min-w-[200px] max-h-[240px] overflow-y-auto bg-[--surface-overlay] border border-[--border-emphasis] rounded-[--radius-md] shadow-lg py-1">
                {availableTags.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleTag(tag.id);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-sm flex items-center gap-2 transition-colors ${
                        isSelected
                          ? 'bg-[--surface-elevated] text-white'
                          : 'text-[--text-secondary] hover:bg-[--surface-raised] hover:text-white'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[--accent-brand] border-[--accent-brand]' : 'border-[--border-emphasis]'
                        }`}
                      >
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <span className="truncate">{tag.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagSelector;

