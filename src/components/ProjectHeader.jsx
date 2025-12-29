import { useState, useRef, useEffect } from 'react';

/**
 * Project Header Component
 * Editable project name at top of canvas with duplicate name validation
 */
const ProjectHeader = ({ projectName, onUpdateName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(projectName);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  
  useEffect(() => {
    setEditValue(projectName);
    setError(null);
  }, [projectName]);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  const handleSave = () => {
    if (!editValue.trim()) {
      setEditValue(projectName);
      setIsEditing(false);
      setError(null);
      return;
    }
    
    const result = onUpdateName(editValue.trim());
    
    if (result && !result.success) {
      // Show error and keep editing
      setError(result.error);
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
      return;
    }
    
    setIsEditing(false);
    setError(null);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(projectName);
      setIsEditing(false);
      setError(null);
    }
  };
  
  const handleChange = (e) => {
    setEditValue(e.target.value);
    if (error) setError(null); // Clear error when user types
  };
  
  return (
    <div className="mb-6" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center gap-3">
        {isEditing ? (
          <div className="flex flex-col">
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={handleChange}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className={`text-2xl font-bold text-white bg-transparent border-b-2 outline-none px-1 py-0.5 min-w-[200px] ${
                error ? 'border-red-500' : 'border-gray-400'
              }`}
              style={{ fontFamily: 'inherit' }}
            />
          </div>
        ) : (
          <h1 
            className="text-2xl font-bold text-white hover:text-gray-300 cursor-pointer transition-colors group flex items-center gap-2"
            onClick={() => setIsEditing(true)}
          >
            {projectName}
            <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </h1>
        )}
      </div>
      {error && (
        <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default ProjectHeader;


