import { useState, useRef, useEffect } from 'react';

/**
 * Editable Row Header Component
 * Click-to-edit row name functionality, similar to ProjectHeader
 */
const EditableRowHeader = ({ name, onUpdateName, isSelected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(name);
  const inputRef = useRef(null);

  useEffect(() => {
    setEditValue(name);
  }, [name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmedValue = editValue.trim();
    if (!trimmedValue) {
      // Revert to original if empty
      setEditValue(name);
      setIsEditing(false);
      return;
    }

    if (trimmedValue !== name) {
      onUpdateName(trimmedValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(name);
      setIsEditing(false);
    }
  };

  const handleChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={handleChange}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        className="text-lg font-bold text-white bg-transparent border-b-2 border-[--border-strong] outline-none px-0.5 py-0 min-w-[120px] max-w-[300px]"
        style={{ fontFamily: 'inherit' }}
      />
    );
  }

  return (
    <h2
      className={`text-lg font-bold transition-colors cursor-pointer group inline-flex items-center gap-1.5 ${
        isSelected ? 'text-white' : 'text-white hover:text-gray-300'
      }`}
      onClick={handleClick}
    >
      {name}
      <svg
        className="w-3.5 h-3.5 text-[--text-quaternary] group-hover:text-[--text-tertiary] transition-colors opacity-0 group-hover:opacity-100"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
      </svg>
    </h2>
  );
};

export default EditableRowHeader;

