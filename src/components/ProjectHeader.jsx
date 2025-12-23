import { useState, useRef, useEffect } from 'react';

/**
 * Project Header Component
 * Editable project name at top of canvas
 */
const ProjectHeader = ({ projectName, onUpdateName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(projectName);
  const inputRef = useRef(null);
  
  useEffect(() => {
    setEditValue(projectName);
  }, [projectName]);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  const handleSave = () => {
    if (editValue.trim()) {
      onUpdateName(editValue.trim());
    } else {
      setEditValue(projectName);
    }
    setIsEditing(false);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(projectName);
      setIsEditing(false);
    }
  };
  
  return (
    <div className="mb-6 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="text-2xl font-bold text-white bg-transparent border-b-2 border-orange-500 outline-none px-1 py-0.5 min-w-[200px]"
          style={{ fontFamily: 'inherit' }}
        />
      ) : (
        <h1 
          className="text-2xl font-bold text-white hover:text-orange-400 cursor-pointer transition-colors group flex items-center gap-2"
          onClick={() => setIsEditing(true)}
        >
          {projectName}
          <svg className="w-4 h-4 text-gray-600 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </h1>
      )}
    </div>
  );
};

export default ProjectHeader;


