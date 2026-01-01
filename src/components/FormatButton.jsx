import { useState } from 'react';

/**
 * Format Button with hover tooltip
 * Displays aspect ratio options with icons and tooltips
 */
const FormatButton = ({ formatKey, size, isSelected, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center justify-center gap-1 py-1 rounded text-[10px] font-medium transition-colors ${
          isSelected ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
        }`}
        style={{ width: formatKey === 'landscape' ? 56 : 46 }}
      >
        {formatKey === 'portrait' && <svg className="w-3 h-4" viewBox="0 0 12 16" fill="currentColor"><rect x="1" y="1" width="10" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>}
        {formatKey === 'square' && <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="currentColor"><rect x="1" y="1" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>}
        {formatKey === 'landscape' && <svg className="w-4 h-3" viewBox="0 0 16 12" fill="currentColor"><rect x="1" y="1" width="14" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>}
        {formatKey === 'slides' && <svg className="w-4 h-2.5" viewBox="0 0 16 9" fill="currentColor"><rect x="1" y="1" width="14" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>}
        <span>{size.ratio}</span>
      </button>
      
      <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl pointer-events-none transition-opacity whitespace-nowrap z-50 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-px"><div className="border-4 border-transparent border-b-gray-700" /></div>
        <div className="text-[10px] font-medium text-white">{size.name}</div>
        <div className="text-[9px] text-gray-400">{size.platforms}</div>
      </div>
    </div>
  );
};

export default FormatButton;

