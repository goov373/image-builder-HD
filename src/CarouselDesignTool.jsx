import React, { useState, useRef, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
// CSS utilities not currently used

// Import data from centralized location
import {
  frameSizes,
  layoutNames,
  layoutVariantNames,
  getFontSizes,
  allFonts,
  defaultDesignSystem,
  initialCarousels,
  getFrameStyle
} from './data';

// Import custom hooks
import { useDropdowns } from './hooks';

// Import components
import { 
  AccountPanel, 
  FormatButton, 
  EditableTextField,
  LayoutBottomStack,
  LayoutCenterDrama,
  LayoutEditorialLeft,
  Sidebar,
  DesignSystemPanel,
  ExportPanel,
  Homepage,
  ProjectHeader,
  NewProjectView
} from './components';

// Single Frame Component
const CarouselFrame = ({ frame, carouselId, frameSize, designSystem, frameIndex, totalFrames, isFrameSelected, onSelectFrame, onRemove, onUpdateText, activeTextField, onActivateTextField }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isProgressHovered, setIsProgressHovered] = useState(false);
  const [isProgressHidden, setIsProgressHidden] = useState(false);
  const style = getFrameStyle(carouselId, frame.style, designSystem);
  const content = frame.variants[frame.currentVariant];
  const layoutIndex = frame.currentLayout || 0;
  const size = frameSizes[frameSize] || frameSizes.portrait;
  const isLandscape = frameSize === 'landscape' || frameSize === 'slides';
  const formatting = frame.variants[frame.currentVariant]?.formatting || {};
  const layoutVariant = frame.layoutVariant || 0;
  
  const handleUpdateText = (field, value) => onUpdateText?.(carouselId, frame.id, field, value);
  const handleActivateField = (field) => onActivateTextField?.(field);
  
  const renderLayout = () => {
    const fontSizes = getFontSizes(frameSize);
    const props = { 
      headline: content.headline, body: content.body, accent: style.accent, isLandscape,
      headingFont: designSystem.headingFont, bodyFont: designSystem.bodyFont, variant: layoutVariant,
      isFrameSelected, onUpdateText: handleUpdateText, activeField: activeTextField,
      onActivateField: handleActivateField, formatting, fontSizes,
    };
    switch (layoutIndex) {
      case 1: return <LayoutCenterDrama {...props} />;
      case 2: return <LayoutEditorialLeft {...props} />;
      default: return <LayoutBottomStack {...props} />;
    }
  };
  
  return (
    <div className="flex flex-col" style={{ width: size.width }}>
      <div 
        className={`relative overflow-hidden shadow-lg cursor-pointer transition-all border border-gray-600 ${isFrameSelected ? 'ring-2 ring-orange-500/70' : 'hover:border-gray-500'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ background: style.background, width: size.width, height: size.height }}
        onClick={(e) => { e.stopPropagation(); onSelectFrame(frame.id); }}
      >
        {renderLayout()}
        
          <div 
          className="absolute top-2 right-2 z-10 flex items-center gap-1 cursor-pointer min-w-[40px] min-h-[20px] justify-end"
            onMouseEnter={() => setIsProgressHovered(true)}
            onMouseLeave={() => setIsProgressHovered(false)}
          onClick={(e) => { if (isFrameSelected) { e.stopPropagation(); setIsProgressHidden(!isProgressHidden); } }}
        >
          {isFrameSelected && (isProgressHovered || (isProgressHidden && isHovered)) ? (
            <div className="flex items-center justify-center w-5 h-5 bg-black/50 rounded-full hover:bg-black/70 transition-colors">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isProgressHidden ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                )}
                  </svg>
              </div>
          ) : !isProgressHidden ? (
            [1,2,3,4,5].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === frame.id ? 'bg-white' : 'bg-white/30'}`} />)
          ) : null}
          </div>
        
        {totalFrames > 1 && (
          <button onClick={(e) => { e.stopPropagation(); onRemove(frame.id); }} className={`absolute top-2 left-2 z-20 w-6 h-6 bg-black/70 hover:bg-red-500 rounded-full flex items-center justify-center transition-opacity duration-150 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Sortable Frame Wrapper
const SortableFrame = ({ id, frame, carouselId, frameSize, designSystem, frameIndex, totalFrames, isFrameSelected, onSelectFrame, onRemove, onUpdateText, activeTextField, onActivateTextField, isRowSelected, cardWidth }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    disabled: !isRowSelected,
  });

  // Calculate transform - non-dragged items move by exactly one card slot
  const getTransform = () => {
    if (!transform) return undefined;
    if (isDragging) {
      return `translate3d(${Math.round(transform.x)}px, 0, 0)`;
    } else {
      // Non-dragged: move by card width + gap (12px) + add button container (32px)
      const moveDistance = cardWidth + 12 + 32; // card + gap + add button
      if (Math.abs(transform.x) > 10) {
        const direction = transform.x > 0 ? 1 : -1;
        return `translate3d(${direction * moveDistance}px, 0, 0)`;
      }
      return undefined;
    }
  };

  // Only apply transition while actively being pushed aside (transform exists and is significant)
  const isBeingPushed = transform && Math.abs(transform.x) > 10 && !isDragging;
  
  const style = {
    transform: getTransform(),
    transition: isBeingPushed ? 'transform 120ms ease-out' : 'none',
    zIndex: isDragging ? 100 : 1,
    cursor: isRowSelected ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
                <CarouselFrame
                  frame={frame}
        carouselId={carouselId}
        frameSize={frameSize}
                  designSystem={designSystem}
        frameIndex={frameIndex}
                  totalFrames={totalFrames}
        isFrameSelected={isFrameSelected}
        onSelectFrame={onSelectFrame}
        onRemove={onRemove}
                  onUpdateText={onUpdateText}
        activeTextField={activeTextField}
                  onActivateTextField={onActivateTextField}
      />
    </div>
  );
};

// Carousel Row Component
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
      className={`mb-10 rounded-xl transition-all duration-150 cursor-pointer overflow-x-auto hide-scrollbar ${isSelected ? 'bg-orange-500/5 border border-orange-500/20 py-4' : 'hover:bg-gray-800/30 border border-transparent py-4'} ${isFaded ? 'opacity-20 hover:opacity-50' : 'opacity-100'}`}
      style={{ marginLeft: '10px', marginRight: '10px', width: 'fit-content', minWidth: 'auto', maxWidth: 'calc(100% - 20px)' }}
      onClick={(e) => { e.stopPropagation(); onSelect(carousel.id); }}
    >
      <div className="mb-4 flex items-center px-4">
        <div className="flex items-center gap-3">
          <button onClick={(e) => { e.stopPropagation(); onSelect(isSelected ? null : carousel.id); }} className={`w-11 h-11 rounded-xl border-2 flex items-center justify-center transition-all duration-150 ${isSelected ? 'border-orange-500 bg-orange-500/10 hover:bg-orange-500/20' : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800'}`}>
            {isSelected ? (
              <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
            )}
        </button>
        <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-lg font-bold transition-colors ${isSelected ? 'text-orange-400' : 'text-white'}`}>{carousel.name}</h2>
              {isSelected && <span className="text-[9px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded font-medium">EDITING</span>}
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
                  onClick={(e) => { e.stopPropagation(); onAddFrame(carousel.id, index + 1); }} 
                  className="w-7 h-7 rounded-full border-2 border-dashed border-gray-600 opacity-50 hover:opacity-100 hover:border-orange-500 hover:bg-orange-500/10 flex items-center justify-center transition-all duration-150"
                >
                  <svg className="w-3.5 h-3.5 text-gray-500 hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
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

// Main App Component
export default function CarouselDesignTool() {
  const [carousels, setCarousels] = useState(initialCarousels);
  const [zoom, setZoom] = useState(120);
  const [designSystem, setDesignSystem] = useState(defaultDesignSystem);
  const [activePanel, setActivePanel] = useState(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [selectedCarouselId, setSelectedCarouselId] = useState(null);
  
  // View state - 'home' or 'editor'
  const [currentView, setCurrentView] = useState('home');
  
  // Browser-style tabs for projects
  const [tabs, setTabs] = useState([
    { id: 1, name: 'HelloData Campaign', active: false, hasContent: true, createdAt: '2024-12-20', updatedAt: '2024-12-22', frameCount: 5 }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  
  const activeTab = tabs.find(t => t.id === activeTabId);
  
  const handleTabClick = (tabId) => {
    setActiveTabId(tabId);
    setTabs(prev => prev.map(tab => ({ ...tab, active: tab.id === tabId })));
  };
  
  const handleUpdateProjectName = (newName) => {
    if (!newName.trim()) return;
    setTabs(prev => prev.map(tab => tab.id === activeTabId ? { ...tab, name: newName.trim() } : tab));
  };
  
  const handleGoHome = () => {
    setCurrentView('home');
    setSelectedCarouselId(null);
    setSelectedFrameId(null);
    setActiveTextField(null);
  };
  
  const handleOpenProject = (projectId) => {
    setActiveTabId(projectId);
    setTabs(prev => prev.map(tab => ({ ...tab, active: tab.id === projectId })));
    setIsAccountOpen(false);
    setCurrentView('editor');
  };
  
  const handleCreateNewFromHome = () => {
    const newId = Math.max(...tabs.map(t => t.id)) + 1;
    const newTab = { 
      id: newId, 
      name: 'Untitled Project', 
      active: true, 
      hasContent: false, 
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      frameCount: 0
    };
    setTabs(prev => [...prev.map(t => ({ ...t, active: false })), newTab]);
    setActiveTabId(newId);
    setIsAccountOpen(false);
    setCurrentView('editor');
  };
  
  const handleCloseTab = (tabId, e) => {
    e.stopPropagation();
    if (tabs.length <= 1) return;
    const newTabs = tabs.filter(t => t.id !== tabId);
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[0].id);
      newTabs[0].active = true;
    }
    setTabs(newTabs);
  };
  
  const MAX_TABS = 10;
  
  const handleAddTab = () => {
    if (tabs.length >= MAX_TABS) return;
    const newId = Math.max(...tabs.map(t => t.id)) + 1;
    setTabs(prev => [...prev.map(t => ({ ...t, active: false })), { id: newId, name: 'Untitled Project', active: true, hasContent: false, createdAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0], frameCount: 0 }]);
    setActiveTabId(newId);
    setIsAccountOpen(false);
    setCurrentView('editor');
  };
  
  const handleCreateProject = (projectType, projectName) => {
    setTabs(prev => prev.map(t => 
      t.id === activeTabId 
        ? { ...t, name: projectName || 'New Project', hasContent: true }
        : t
    ));
  };
  const [selectedFrameId, setSelectedFrameId] = useState(null);
  const [activeTextField, setActiveTextField] = useState(null);
  
  // Use centralized dropdown management hook
  const {
    showColorPicker, setShowColorPicker,
    showFontSize, setShowFontSize,
    showUnderlinePicker, setShowUnderlinePicker,
    showFontPicker, setShowFontPicker,
    showTextAlign, setShowTextAlign,
    showLineSpacing, setShowLineSpacing,
    showLetterSpacing, setShowLetterSpacing,
    showFormatPicker, setShowFormatPicker,
    showLayoutPicker, setShowLayoutPicker,
    showNewTabMenu, setShowNewTabMenu,
    showSnippetsPicker, setShowSnippetsPicker,
    colorPickerRef, fontSizeRef, underlineRef, fontPickerRef,
    textAlignRef, lineSpacingRef, letterSpacingRef,
    formatPickerRef, layoutPickerRef, newTabMenuRef, snippetsPickerRef,
    closeAllDropdowns,
  } = useDropdowns();
  
  const selectedCarousel = carousels.find(c => c.id === selectedCarouselId) || carousels[0];
  const selectedFrame = selectedCarousel?.frames?.find(f => f.id === selectedFrameId);
  
  const handleSelectFrame = (carouselId, frameId) => {
    closeAllDropdowns();
    setActiveTextField(null);
    // If opening a new carousel
    if (carouselId !== selectedCarouselId) {
      setSelectedCarouselId(carouselId);
    }
    setSelectedFrameId(prev => (prev === frameId && carouselId === selectedCarouselId) ? null : frameId);
  };
  
  const handleSelectCarousel = (carouselId) => {
    closeAllDropdowns();
    setActiveTextField(null);
    
    // Determine if opening or closing
    const isOpening = carouselId !== null && carouselId !== selectedCarouselId;
    const isClosing = carouselId === null || (carouselId === selectedCarouselId && selectedCarouselId !== null);
    
    if (isOpening) {
      // Opening a row
      setSelectedFrameId(null);
      setSelectedCarouselId(carouselId);
    } else if (isClosing && carouselId === selectedCarouselId) {
      // Clicking the same row's close button - close it
      setSelectedCarouselId(null);
      setSelectedFrameId(null);
    } else if (carouselId === null) {
      // Explicitly closing
      setSelectedCarouselId(null);
      setSelectedFrameId(null);
    } else {
      // Switching to a different row
      setSelectedFrameId(null);
      setSelectedCarouselId(carouselId);
    }
  };
  
  const handleSetVariant = (carouselId, frameId, variantIndex) => {
    setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      return { ...carousel, frames: carousel.frames.map(frame => frame.id !== frameId ? frame : { ...frame, currentVariant: variantIndex }) };
    }));
  };
  
  const handleSetLayout = (carouselId, frameId, layoutIndex) => {
    setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      return { ...carousel, frames: carousel.frames.map(frame => frame.id !== frameId ? frame : { ...frame, currentLayout: layoutIndex, layoutVariant: 0 }) };
    }));
  };
  
  const handleShuffleLayoutVariant = (carouselId, frameId) => {
    setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      return { ...carousel, frames: carousel.frames.map(frame => frame.id !== frameId ? frame : { ...frame, layoutVariant: ((frame.layoutVariant || 0) + 1) % 3 }) };
    }));
  };
  
  const handleUpdateText = (carouselId, frameId, field, value) => {
    setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      return {
        ...carousel,
        frames: carousel.frames.map(frame => {
          if (frame.id !== frameId) return frame;
          const updatedVariants = [...frame.variants];
          updatedVariants[frame.currentVariant] = { ...updatedVariants[frame.currentVariant], [field]: value };
          return { ...frame, variants: updatedVariants };
        })
      };
    }));
  };
  
  const handleUpdateFormatting = (carouselId, frameId, field, key, value) => {
    setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      return {
        ...carousel,
        frames: carousel.frames.map(frame => {
          if (frame.id !== frameId) return frame;
          const updatedVariants = [...frame.variants];
          const currentVariant = updatedVariants[frame.currentVariant];
          const currentFormatting = currentVariant.formatting || {};
          const fieldFormatting = currentFormatting[field] || {};
          updatedVariants[frame.currentVariant] = { ...currentVariant, formatting: { ...currentFormatting, [field]: { ...fieldFormatting, [key]: value } } };
          return { ...frame, variants: updatedVariants };
        })
      };
    }));
  };
  
  const handleAddFrame = (carouselId, position = null) => {
    setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      const insertIndex = position !== null ? position : carousel.frames.length;
      const adjacentFrame = carousel.frames[Math.max(0, insertIndex - 1)] || carousel.frames[0];
      const newFrame = {
        id: Date.now(), // Use timestamp for unique ID
        variants: [
          { headline: "Add your headline", body: "Add your supporting copy here.", formatting: {} },
          { headline: "Alternative headline", body: "Alternative supporting copy.", formatting: {} },
          { headline: "Third option", body: "Third copy variation.", formatting: {} }
        ],
        currentVariant: 0, currentLayout: 0, layoutVariant: 0,
        style: adjacentFrame?.style || "dark-single-pin"
      };
        const newFrames = [...carousel.frames];
        newFrames.splice(insertIndex, 0, newFrame);
      // Re-number the frames
      const renumberedFrames = newFrames.map((f, idx) => ({ ...f, id: idx + 1 }));
      return { ...carousel, frames: renumberedFrames };
    }));
  };
  
  const handleChangeFrameSize = (carouselId, newSize) => {
    setCarousels(prev => prev.map(carousel => carousel.id === carouselId ? { ...carousel, frameSize: newSize } : carousel));
  };
  
  const handleRemoveFrame = (carouselId, frameId) => {
    if (selectedCarouselId === carouselId && selectedFrameId === frameId) setSelectedFrameId(null);
    setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      if (carousel.frames.length <= 1) return carousel;
      const newFrames = carousel.frames.filter(f => f.id !== frameId).map((f, idx) => ({ ...f, id: idx + 1 }));
      return { ...carousel, frames: newFrames };
    }));
  };
  
  const handleReorderFrames = (carouselId, oldIndex, newIndex) => {
      setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      const newFrames = arrayMove(carousel.frames, oldIndex, newIndex).map((f, idx) => ({ ...f, id: idx + 1 }));
      return { ...carousel, frames: newFrames };
    }));
  };

  const handleAddRow = (afterIndex) => {
    const newId = Date.now();
    const newCarousel = {
      id: newId,
      name: "New Row",
      subtitle: "Click to edit",
      frameSize: "portrait",
      frames: [
        {
          id: 1,
          variants: [
            { headline: "Your headline here", body: "Your body text here.", formatting: {} },
            { headline: "Alternative headline", body: "Alternative body text.", formatting: {} },
            { headline: "Third variation", body: "Third body option.", formatting: {} }
          ],
          currentVariant: 0,
          currentLayout: 0,
          layoutVariant: 0,
          style: "dark-single-pin"
        }
      ]
    };
    
    setCarousels(prev => {
      const newCarousels = [...prev];
      newCarousels.splice(afterIndex + 1, 0, newCarousel);
      return newCarousels;
    });
    
    // Select the new row
    setSelectedCarouselId(newId);
  };

  const handleRemoveRow = (carouselId) => {
    // Don't allow removing the last row
    if (carousels.length <= 1) return;
    
    // Clear selection if removing the selected row
    if (selectedCarouselId === carouselId) {
      setSelectedCarouselId(null);
      setSelectedFrameId(null);
      setActiveTextField(null);
    }
    
    setCarousels(prev => prev.filter(c => c.id !== carouselId));
  };
  
  const panelWidth = activePanel ? 288 : 0; // w-72 = 288px
  const sidebarWidth = 64; // w-16 = 64px
  const totalOffset = sidebarWidth + panelWidth;
  
  return (
    <div className="h-screen text-white overflow-hidden" style={{ backgroundColor: '#0d1321' }}>
      {/* Browser-style Tab Bar - Full Width */}
      <div className="fixed top-0 left-0 right-0 z-[110] border-b border-gray-700" style={{ height: 56, backgroundColor: '#0d1321' }}>
        <div className="flex items-end h-full">
          {/* Home Button */}
          <div className="flex items-center px-3 pb-2">
            <button 
              onClick={handleGoHome}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${currentView === 'home' ? 'text-white bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
          </div>
          {/* Tabs */}
          <div className="flex items-end">
            {tabs.map((tab, index) => {
                const isTabActive = tab.active && currentView !== 'home';
                return (
              <div key={tab.id} className="flex items-end">
                {/* Vertical separator - show before inactive tabs (except first) */}
                {index > 0 && !isTabActive && !(tabs[index - 1]?.active && currentView !== 'home') && (
                  <div className="w-px h-5 bg-gray-700 self-center" />
                )}
                <div 
                  onClick={() => handleOpenProject(tab.id)}
                  className={`group flex items-center gap-2 px-4 h-10 rounded-t-lg cursor-pointer transition-colors duration-150 ${
                    isTabActive 
                      ? 'bg-gray-800 text-white' 
                      : 'bg-transparent text-gray-500 hover:text-gray-300'
                  }`}
                  style={{ minWidth: 140, maxWidth: 220 }}
                >
                  <svg className={`w-4 h-4 flex-shrink-0 transition-colors ${isTabActive ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm font-medium truncate flex-1">{tab.name}</span>
                  <button 
                    onClick={(e) => handleCloseTab(tab.id, e)}
                    className={`w-5 h-5 rounded flex items-center justify-center transition-opacity ${
                      isTabActive 
                        ? 'hover:bg-gray-700 text-gray-400 hover:text-white opacity-100' 
                        : 'opacity-0 group-hover:opacity-100 hover:bg-gray-700 text-gray-500 hover:text-white'
                    }`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            );
              })}
            {/* Separator before add button */}
            <div className="w-px h-5 bg-gray-700 self-center mx-1" />
            {/* Add Tab Button with Dropdown */}
            <div ref={newTabMenuRef} className="relative mb-1">
              <button 
                onClick={() => { const wasOpen = showNewTabMenu; closeAllDropdowns(); if (!wasOpen && tabs.length < MAX_TABS) setShowNewTabMenu(true); }}
                disabled={tabs.length >= MAX_TABS}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  tabs.length >= MAX_TABS 
                    ? 'text-gray-600 cursor-not-allowed' 
                    : showNewTabMenu ? 'text-white bg-gray-800' : 'text-gray-500 hover:text-white hover:bg-gray-800'
                }`}
                title={tabs.length >= MAX_TABS ? 'Maximum tabs reached' : 'New tab'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              
              {/* New Tab Dropdown Menu */}
              {showNewTabMenu && (
                <div className="absolute top-full left-0 mt-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200] min-w-[200px]">
                  {/* New Project Option */}
                  <button
                    onClick={() => { handleAddTab(); setShowNewTabMenu(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-white">New Project</div>
                      <div className="text-xs text-gray-500">Start from scratch</div>
                    </div>
                  </button>
                  
                  {/* Divider */}
                  <div className="my-1.5 border-t border-gray-700" />
                  
                  {/* Existing Projects Header */}
                  <div className="px-3 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Open Existing
                  </div>
                  
                  {/* List of existing projects */}
                  {tabs.map(project => (
                    <button
                      key={project.id}
                      onClick={() => { handleOpenProject(project.id); setShowNewTabMenu(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
                        project.id === activeTabId && currentView !== 'home'
                          ? 'bg-gray-700/50 text-white' 
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${project.hasContent ? 'bg-gray-700' : 'bg-gray-800 border border-gray-700'}`}>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{project.name}</div>
                        <div className="text-xs text-gray-500">
                          {project.hasContent ? `${project.frameCount || 5} frames` : 'Empty'}
                        </div>
                      </div>
                      {project.id === activeTabId && currentView !== 'home' && (
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            </div>
          
          {/* Tab Counter */}
          <div className="flex items-center px-4 pb-2 ml-auto">
            <span className="text-xs text-gray-500">
              <span className={tabs.length >= MAX_TABS ? 'text-orange-400' : 'text-gray-400'}>{tabs.length}</span>
              <span className="mx-0.5">/</span>
              <span>{MAX_TABS}</span>
            </span>
          </div>
        </div>
      </div>
      
      {/* Sidebar - Always visible */}
      <Sidebar 
        activePanel={activePanel} 
        onPanelChange={setActivePanel} 
        zoom={zoom} 
        onZoomChange={setZoom} 
        isHomePage={currentView === 'home'}
        onAccountClick={() => { setActivePanel(null); setIsAccountOpen(!isAccountOpen); }}
        isAccountOpen={isAccountOpen}
        onCloseAccount={() => setIsAccountOpen(false)}
      />
      
      {/* Panels - Always visible */}
      <DesignSystemPanel designSystem={designSystem} onUpdate={setDesignSystem} onClose={() => setActivePanel(null)} isOpen={activePanel === 'design'} />
      <ExportPanel onClose={() => setActivePanel(null)} isOpen={activePanel === 'export'} carousels={carousels} />
      <AccountPanel onClose={() => setIsAccountOpen(false)} isOpen={isAccountOpen && currentView === 'home'} />

      {/* Homepage or Editor View */}
      {currentView === 'home' ? (
        <div className="absolute inset-0 top-[56px]" style={{ left: totalOffset, transition: 'left 0.3s ease-out' }}>
          <Homepage 
            projects={tabs} 
            onOpenProject={handleOpenProject}
            onCreateNew={handleCreateNewFromHome}
          />
        </div>
      ) : (
        <>

      {/* Toolbar - Only show for projects with content */}
      {activeTab?.hasContent && (
      <div className="fixed z-[100] bg-gray-900 border-b border-gray-800 px-5 overflow-visible flex items-center" style={{ top: 56, left: totalOffset, right: 0, height: 64, transition: 'left 0.3s ease-out' }}>
        <div className="flex items-center justify-between text-sm text-gray-400 w-full">
          <div className="flex items-center gap-3">
            
            {/* Frame Group */}
            <div className={`flex items-center gap-2 px-2 py-1.5 bg-gray-800/60 rounded-xl transition-opacity ${selectedCarouselId ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              {/* Format dropdown */}
              <div ref={formatPickerRef} className="relative">
                <button onClick={() => { const wasOpen = showFormatPicker; closeAllDropdowns(); if (!wasOpen) setShowFormatPicker(true); }} className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                  <span className="text-xs font-medium text-gray-300">Format</span>
                  <span className="text-[11px] text-gray-500">{frameSizes[selectedCarousel?.frameSize]?.name || 'Portrait'}</span>
                  <svg className={`w-3 h-3 text-gray-400 transition-transform ${showFormatPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showFormatPicker && (
                  <div className="absolute top-full left-0 mt-2 p-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200] min-w-[160px]">
                {Object.entries(frameSizes).filter(([key]) => key !== 'landscape').map(([key, size]) => (
                      <button key={key} onClick={() => { handleChangeFrameSize(selectedCarouselId, key); setShowFormatPicker(false); }} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition-colors ${selectedCarousel?.frameSize === key ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                        <span className="font-medium">{size.name}</span>
                        <span className="text-gray-500 ml-auto">{size.ratio}</span>
                      </button>
                ))}
              </div>
                    )}
                  </div>
            </div>

            {/* Layout Group */}
            <div className={`flex items-center gap-1.5 px-2 py-1.5 bg-gray-800/60 rounded-xl transition-opacity ${selectedFrame ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <div ref={layoutPickerRef} className="relative">
                <button onClick={() => { const wasOpen = showLayoutPicker; closeAllDropdowns(); if (!wasOpen) setShowLayoutPicker(true); }} className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                  <span className="text-xs font-medium text-gray-300">Layout</span>
                  <span className="text-[11px] text-gray-500">{layoutNames[selectedFrame?.currentLayout || 0]}</span>
                  <svg className={`w-3 h-3 text-gray-400 transition-transform ${showLayoutPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showLayoutPicker && (
                  <div className="absolute top-full left-0 mt-2 p-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200] min-w-[140px]">
                    {layoutNames.map((name, idx) => (
                      <button key={idx} onClick={() => { handleSetLayout(selectedCarouselId, selectedFrameId, idx); setShowLayoutPicker(false); }} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition-colors ${(selectedFrame?.currentLayout || 0) === idx ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                        {idx === 0 && <div className="w-4 h-5 bg-gray-600 rounded flex items-end p-0.5"><div className="w-full h-1 rounded-sm bg-orange-400" /></div>}
                        {idx === 1 && <div className="w-4 h-5 bg-gray-600 rounded flex items-center justify-center"><div className="w-2 h-2 rounded-sm bg-orange-400" /></div>}
                        {idx === 2 && <div className="w-4 h-5 bg-gray-600 rounded flex flex-col justify-between p-0.5"><div className="w-2 h-1 rounded-sm bg-orange-400" /><div className="w-1.5 h-1 bg-gray-500 rounded-sm self-end" /></div>}
                        <span className="font-medium">{name}</span>
                      </button>
                    ))}
                  </div>
                    )}
                  </div>
              <button onClick={() => { closeAllDropdowns(); selectedFrame && handleShuffleLayoutVariant(selectedCarouselId, selectedFrameId); }} className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-all" title="Shuffle variant">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                </button>
                  </div>

            {/* Snippets Group */}
            <div className={`flex items-center gap-1.5 px-2 py-1.5 bg-gray-800/60 rounded-xl transition-opacity ${activeTextField ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <div ref={snippetsPickerRef} className="relative">
                <button onClick={() => { const wasOpen = showSnippetsPicker; closeAllDropdowns(); if (!wasOpen) setShowSnippetsPicker(true); }} className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                  <span className="text-xs font-medium text-gray-300">Snippets</span>
                  <span className="text-[11px] text-orange-400 font-medium">S{(selectedFrame?.currentVariant || 0) + 1}</span>
                  <svg className={`w-3 h-3 text-gray-400 transition-transform ${showSnippetsPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showSnippetsPicker && (
                  <div className="absolute top-full left-0 mt-2 p-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200] min-w-[90px]">
                    {[0, 1, 2].map((idx) => (
                      <button key={idx} onClick={() => { handleSetVariant(selectedCarouselId, selectedFrameId, idx); setShowSnippetsPicker(false); }} className={`w-full flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${selectedFrame?.currentVariant === idx ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                        <span className={selectedFrame?.currentVariant === idx ? 'text-white' : 'text-orange-400'}>S{idx + 1}</span>
                </button>
                    ))}
              </div>
                )}
              </div>
              <button className="p-2 rounded-lg text-orange-400 hover:bg-orange-500/20 transition-colors" title="Rewrite with AI">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" /></svg>
              </button>
            </div>
            
            {/* Typography Group */}
            <div className={`flex items-center gap-1.5 px-2 py-1.5 bg-gray-800/60 rounded-xl transition-opacity ${activeTextField ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              {/* Font Type dropdown */}
              <div ref={fontPickerRef} className="relative">
                <button onClick={() => { if (!activeTextField) return; const wasOpen = showFontPicker; closeAllDropdowns(); if (!wasOpen) setShowFontPicker(true); }} className="flex items-center gap-1.5 px-3 py-2 bg-gray-700/50 rounded-lg text-xs font-medium text-gray-300 hover:bg-gray-700 transition-colors">
                  <span>Font</span>
                  <svg className={`w-2.5 h-2.5 transition-transform ${showFontPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showFontPicker && activeTextField && (
                  <div className="absolute top-full left-0 mt-2 p-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200] max-h-56 overflow-y-auto min-w-[160px]" onClick={(e) => e.stopPropagation()}>
                    {allFonts.map(font => (
                      <button type="button" key={font.value} onClick={(e) => { e.stopPropagation(); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'fontFamily', font.value); setShowFontPicker(false); }} className={`w-full px-3 py-2 rounded-lg text-xs text-left transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.fontFamily === font.value ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} style={{ fontFamily: font.value }}>
                        {font.name}
                    </button>
                  ))}
                </div>
                )}
              </div>

              {/* Font Size dropdown */}
              <div ref={fontSizeRef} className="relative">
                <button onClick={() => { if (!activeTextField) return; const wasOpen = showFontSize; closeAllDropdowns(); if (!wasOpen) setShowFontSize(true); }} className="flex items-center gap-1.5 px-3 py-2 bg-gray-700/50 rounded-lg text-xs font-medium text-gray-300 hover:bg-gray-700 transition-colors">
                  <span>Size</span>
                  <svg className={`w-2.5 h-2.5 transition-transform ${showFontSize ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showFontSize && activeTextField && (
                  <div className="absolute top-full left-0 mt-2 p-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200]" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1">
                      {[{ name: 'S', value: 0.85 }, { name: 'M', value: 1 }, { name: 'L', value: 1.2 }].map(s => (
                        <button type="button" key={s.name} onClick={(e) => { e.stopPropagation(); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'fontSize', s.value); setShowFontSize(false); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.fontSize === s.value ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>{s.name}</button>
                      ))}
              </div>
                  </div>
                )}
            </div>
            
                {/* Color picker */}
              <div ref={colorPickerRef} className="relative">
                <button onClick={() => { if (!activeTextField) return; const wasOpen = showColorPicker; closeAllDropdowns(); if (!wasOpen) setShowColorPicker(true); }} className="flex items-center gap-1 p-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors" title="Text color">
                  <div className="w-5 h-5 rounded border border-gray-500" style={{ backgroundColor: (() => {
                    const explicitColor = selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.color;
                    if (explicitColor) return explicitColor;
                    // Get frame's style-based accent color for headlines
                    if (activeTextField === 'headline' && selectedFrame) {
                      const frameStyle = getFrameStyle(selectedCarouselId, selectedFrame.style, designSystem);
                      return frameStyle.accent;
                    }
                    return '#e5e7eb'; // gray-200 for body text
                  })() }} />
                  </button>
                  {showColorPicker && activeTextField && (
                  <div className="absolute top-full left-0 mt-2 p-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200]" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1.5">
                        {[{ name: 'Primary', value: designSystem.primary }, { name: 'Secondary', value: designSystem.secondary }, { name: 'Accent', value: designSystem.accent }, { name: 'Light', value: designSystem.neutral3 }, { name: 'White', value: '#ffffff' }].map(c => (
                        <button type="button" key={c.value} onClick={(e) => { e.stopPropagation(); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'color', c.value); setShowColorPicker(false); }} className="w-6 h-6 rounded-lg border border-gray-600 hover:scale-110 transition-transform" style={{ backgroundColor: c.value }} title={c.name} />
                        ))}
                      </div>
                    </div>
                  )}
              </div>
                </div>
                
            {/* Style Group */}
            <div className={`flex items-center gap-1 px-2 py-1.5 bg-gray-800/60 rounded-xl transition-opacity ${activeTextField ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                {/* Bold - headlines are bold by default */}
              <button onClick={() => { 
                if (!activeTextField) return; 
                closeAllDropdowns(); 
                const formatting = selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField] || {}; 
                const isDefaultBold = activeTextField === 'headline';
                const currentBold = formatting.bold !== undefined ? formatting.bold : isDefaultBold;
                handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'bold', !currentBold); 
              }} className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
                (() => {
                  const formatting = selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField] || {};
                  const isDefaultBold = activeTextField === 'headline';
                  const isBold = formatting.bold !== undefined ? formatting.bold : isDefaultBold;
                  return isBold ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700';
                })()
              }`} title="Bold">B</button>
                
                {/* Italic */}
              <button onClick={() => { if (!activeTextField) return; closeAllDropdowns(); const formatting = selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField] || {}; handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'italic', !formatting.italic); }} className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm italic transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.italic ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title="Italic">I</button>
                
                {/* Underline */}
              <div ref={underlineRef} className="relative flex">
                <button onClick={() => { if (!activeTextField) return; const wasOpen = showUnderlinePicker; closeAllDropdowns(); if (!wasOpen) setShowUnderlinePicker(true); }} className={`flex items-center gap-1 px-2 h-9 rounded-lg text-sm transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.underline ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title="Underline">
                  <span style={{ textDecoration: 'underline' }}>U</span>
                  <svg className={`w-2.5 h-2.5 transition-transform ${showUnderlinePicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {showUnderlinePicker && activeTextField && (
                  <div className="absolute top-full right-0 mt-2 p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200] min-w-[160px]" onClick={(e) => e.stopPropagation()}>
                    <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-wide font-medium">Style</div>
                    <div className="flex gap-1.5 mb-3">
                        {[{ name: 'Solid', value: 'solid' }, { name: 'Dotted', value: 'dotted' }, { name: 'Wavy', value: 'wavy' }, { name: 'Highlight', value: 'highlight' }].map(s => (
                        <button type="button" key={s.value} onClick={(e) => { e.stopPropagation(); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'underlineStyle', s.value); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'underline', true); }} className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.underlineStyle === s.value ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title={s.name}>
                            {s.value === 'solid' && <span style={{ textDecoration: 'underline', textDecorationStyle: 'solid' }}>S</span>}
                            {s.value === 'dotted' && <span style={{ textDecoration: 'underline', textDecorationStyle: 'dotted' }}>D</span>}
                            {s.value === 'wavy' && <span style={{ textDecoration: 'underline', textDecorationStyle: 'wavy' }}>W</span>}
                            {s.value === 'highlight' && <span style={{ backgroundImage: 'linear-gradient(to top, rgba(251,191,36,0.5) 30%, transparent 30%)' }}>H</span>}
                          </button>
                        ))}
                      </div>
                    <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-wide font-medium">Color</div>
                    <div className="flex gap-2">
                        {[{ name: 'Primary', value: designSystem.primary }, { name: 'Secondary', value: designSystem.secondary }, { name: 'Accent', value: designSystem.accent }, { name: 'Light', value: designSystem.neutral3 }, { name: 'White', value: '#ffffff' }].map(c => (
                        <button type="button" key={c.value} onClick={(e) => { e.stopPropagation(); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'underlineColor', c.value); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'underline', true); if (!selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.underlineStyle) handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'underlineStyle', 'solid'); }} className={`w-6 h-6 rounded-lg border-2 hover:scale-110 transition-transform ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.underlineColor === c.value ? 'border-orange-500' : 'border-gray-600'}`} style={{ backgroundColor: c.value }} title={c.name} />
                        ))}
                      </div>
                    <button type="button" onClick={(e) => { e.stopPropagation(); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'underline', false); setShowUnderlinePicker(false); }} className="w-full mt-3 px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-gray-700 transition-colors border border-gray-700">Remove Underline</button>
                    </div>
                  )}
                </div>
              </div>

            {/* Alignment & Spacing Group */}
            <div className={`flex items-center gap-1 px-2 py-1.5 bg-gray-800/60 rounded-xl transition-opacity ${activeTextField ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              {/* Text Alignment */}
              <div ref={textAlignRef} className="relative">
                <button onClick={() => { if (!activeTextField) return; const wasOpen = showTextAlign; closeAllDropdowns(); if (!wasOpen) setShowTextAlign(true); }} className={`flex items-center gap-1 px-2 h-9 rounded-lg transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.textAlign && selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.textAlign !== 'left' ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title="Text alignment">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" /></svg>
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showTextAlign && activeTextField && (
                  <div className="absolute top-full left-0 mt-2 p-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200]" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1">
                      {[{ name: 'Left', value: 'left', icon: 'M4 6h16M4 12h10M4 18h16' }, { name: 'Center', value: 'center', icon: 'M4 6h16M7 12h10M4 18h16' }, { name: 'Right', value: 'right', icon: 'M4 6h16M10 12h10M4 18h16' }, { name: 'Justify', value: 'justify', icon: 'M4 6h16M4 12h16M4 18h16' }].map(a => (
                        <button type="button" key={a.value} onClick={(e) => { e.stopPropagation(); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'textAlign', a.value); setShowTextAlign(false); }} className={`p-2 rounded-lg transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.textAlign === a.value ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title={a.name}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={a.icon} /></svg>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
            </div>
            
              {/* Line Spacing */}
              <div ref={lineSpacingRef} className="relative">
                <button onClick={() => { if (!activeTextField) return; const wasOpen = showLineSpacing; closeAllDropdowns(); if (!wasOpen) setShowLineSpacing(true); }} className={`flex items-center gap-1 px-2 h-9 rounded-lg transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.lineHeight && selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.lineHeight !== 1.4 ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title="Line spacing">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 3v18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showLineSpacing && activeTextField && (
                  <div className="absolute top-full left-0 mt-2 p-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200] min-w-[110px]" onClick={(e) => e.stopPropagation()}>
                    {[{ name: 'Tight', value: 1.1 }, { name: 'Normal', value: 1.4 }, { name: 'Relaxed', value: 1.7 }, { name: 'Loose', value: 2 }].map(s => (
                      <button type="button" key={s.name} onClick={(e) => { e.stopPropagation(); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'lineHeight', s.value); setShowLineSpacing(false); }} className={`w-full px-3 py-2 rounded-lg text-xs text-left transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.lineHeight === s.value ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>{s.name}</button>
                    ))}
            </div>
                )}
          </div>

              {/* Letter Spacing */}
              <div ref={letterSpacingRef} className="relative">
                <button onClick={() => { if (!activeTextField) return; const wasOpen = showLetterSpacing; closeAllDropdowns(); if (!wasOpen) setShowLetterSpacing(true); }} className={`flex items-center gap-1 px-2 h-9 rounded-lg transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.letterSpacing && selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.letterSpacing !== 0 ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title="Letter spacing">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 12h18M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showLetterSpacing && activeTextField && (
                  <div className="absolute top-full left-0 mt-2 p-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200] min-w-[110px]" onClick={(e) => e.stopPropagation()}>
                    {[{ name: 'Tight', value: -0.5 }, { name: 'Normal', value: 0 }, { name: 'Wide', value: 1 }, { name: 'Wider', value: 2 }].map(s => (
                      <button type="button" key={s.name} onClick={(e) => { e.stopPropagation(); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'letterSpacing', s.value); setShowLetterSpacing(false); }} className={`w-full px-3 py-2 rounded-lg text-xs text-left transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.letterSpacing === s.value ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>{s.name}</button>
                    ))}
                  </div>
                )}
        </div>
      </div>
      
            </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Row <span className="text-white font-medium">{selectedCarouselId ? carousels.findIndex(c => c.id === selectedCarouselId) + 1 : '-'}</span> / {carousels.length}</span>
            <button onClick={() => { closeAllDropdowns(); setSelectedCarouselId(null); setSelectedFrameId(null); setActiveTextField(null); }} disabled={!selectedCarouselId && !selectedFrameId} className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${selectedCarouselId || selectedFrameId ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}>Deselect Row</button>
          </div>
        </div>
      </div>
      )}
      
      {/* Main Content - Scrollable Canvas Area */}
      <div className="overflow-y-auto overflow-x-hidden" style={{ marginLeft: totalOffset, marginTop: activeTab?.hasContent ? 120 : 56, height: activeTab?.hasContent ? 'calc(100vh - 120px)' : 'calc(100vh - 56px)', width: `calc(100vw - ${totalOffset}px)`, transition: 'margin-left 0.3s ease-out, width 0.3s ease-out' }}>
      {/* Content Area - Either New Project View or Canvas */}
      {activeTab && !activeTab.hasContent ? (
        <NewProjectView onCreateProject={handleCreateProject} />
      ) : (
        <>
          {/* Canvas workspace */}
          <div className="p-6 pb-96" onClick={() => { closeAllDropdowns(); setSelectedCarouselId(null); setSelectedFrameId(null); setActiveTextField(null); }}>
            <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left', width: `${100 / (zoom / 100)}%`, transition: 'transform 150ms ease-out' }}>
            
            {/* Project Header */}
            <ProjectHeader 
              projectName={activeTab?.name || 'Untitled Project'} 
              onUpdateName={handleUpdateProjectName}
            />
            
            {carousels.map((carousel, index) => (
              <React.Fragment key={carousel.id}>
                <CarouselRow
                  carousel={carousel}
                  designSystem={designSystem}
                  isSelected={selectedCarouselId === carousel.id}
                  hasAnySelection={selectedCarouselId !== null}
                  selectedFrameId={selectedCarouselId === carousel.id ? selectedFrameId : null}
                  onSelect={handleSelectCarousel}
                  onSelectFrame={handleSelectFrame}
                  onAddFrame={handleAddFrame}
                  onRemoveFrame={handleRemoveFrame}
                  onRemoveRow={handleRemoveRow}
                  onReorderFrames={handleReorderFrames}
                  onUpdateText={handleUpdateText}
                  activeTextField={activeTextField}
                  onActivateTextField={setActiveTextField}
                />
                {/* Add Row Button - only after last row */}
                {index === carousels.length - 1 && (
                  <div 
                    className="flex items-center px-4 -mt-4"
                    style={{ marginLeft: '10px' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleAddRow(index); }}
                      className="flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-dashed border-gray-600 text-gray-500 hover:border-orange-500 hover:text-orange-400 hover:bg-orange-500/10 transition-all duration-200"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-xs font-medium">Add row</span>
                    </button>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          </div>
        </>
        )}
      </div>
        </>
      )}
      
    </div>
  );
}
