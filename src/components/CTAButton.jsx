import { useState } from 'react';

/**
 * CTA Button Component
 * Editable call-to-action button for email sections
 */
const CTAButton = ({ 
  text = "Learn More →", 
  url = "#",
  backgroundColor,
  textColor = "#ffffff",
  isEditable = false,
  isSelected = false,
  onChange,
  onUrlChange,
  size = "medium", // small, medium, large
  variant = "filled", // filled, outline, ghost
  borderRadius = "rounded-lg",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  
  const sizeClasses = {
    small: "px-3 py-1.5 text-xs",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base",
  };
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'outline':
        return {
          backgroundColor: 'transparent',
          border: `2px solid ${backgroundColor}`,
          color: backgroundColor,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: backgroundColor,
        };
      default: // filled
        return {
          backgroundColor,
          color: textColor,
        };
    }
  };
  
  const handleClick = (e) => {
    if (isEditable) {
      e.stopPropagation();
      setIsEditing(true);
    }
  };
  
  const handleBlur = () => {
    setIsEditing(false);
    if (editText !== text) {
      onChange?.(editText);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setEditText(text);
      setIsEditing(false);
    }
  };
  
  if (isEditing) {
    return (
      <input
        type="text"
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className={`${sizeClasses[size]} ${borderRadius} font-semibold outline-none ring-2 ring-gray-400`}
        style={getVariantStyles()}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }
  
  return (
    <div
      onClick={handleClick}
      className={`
        ${sizeClasses[size]} 
        ${borderRadius} 
        font-semibold 
        inline-block 
        cursor-pointer 
        transition-all 
        duration-150
        ${isEditable ? 'hover:ring-2 hover:ring-gray-400/50' : ''}
        ${isSelected ? 'ring-2 ring-gray-400' : ''}
      `}
      style={getVariantStyles()}
    >
      {text}
    </div>
  );
};

export default CTAButton;

