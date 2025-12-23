import { useState, useEffect } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

const STORAGE_KEY = 'carousel-tool-carousels';

// Load from localStorage or use initial data
function loadFromStorage(initialData) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load carousels from localStorage:', e);
  }
  return initialData;
}

export default function useCarousels(initialData) {
  const [initialized, setInitialized] = useState(false);
  const [carousels, setCarousels] = useState(() => loadFromStorage(initialData));
  const [selectedCarouselId, setSelectedCarouselId] = useState(null);
  const [selectedFrameId, setSelectedFrameId] = useState(null);
  const [activeTextField, setActiveTextField] = useState(null);

  // Save to localStorage whenever carousels change
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(carousels));
    } catch (e) {
      console.warn('Failed to save carousels to localStorage:', e);
    }
  }, [carousels, initialized]);

  const selectedCarousel = carousels.find(c => c.id === selectedCarouselId) || carousels[0];
  const selectedFrame = selectedCarousel?.frames?.find(f => f.id === selectedFrameId);

  const clearSelection = () => {
    setSelectedCarouselId(null);
    setSelectedFrameId(null);
    setActiveTextField(null);
  };

  const handleSelectFrame = (carouselId, frameId, closeAllDropdowns) => {
    if (closeAllDropdowns) closeAllDropdowns();
    setActiveTextField(null);
    if (carouselId !== selectedCarouselId) {
      setSelectedCarouselId(carouselId);
    }
    setSelectedFrameId(prev => (prev === frameId && carouselId === selectedCarouselId) ? null : frameId);
  };

  const handleSelectCarousel = (carouselId, closeAllDropdowns) => {
    if (closeAllDropdowns) closeAllDropdowns();
    setActiveTextField(null);
    
    const isOpening = carouselId !== null && carouselId !== selectedCarouselId;
    const isClosing = carouselId === null || (carouselId === selectedCarouselId && selectedCarouselId !== null);
    
    if (isOpening) {
      setSelectedFrameId(null);
      setSelectedCarouselId(carouselId);
    } else if (isClosing && carouselId === selectedCarouselId) {
      setSelectedCarouselId(null);
      setSelectedFrameId(null);
    } else if (carouselId === null) {
      setSelectedCarouselId(null);
      setSelectedFrameId(null);
    } else {
      setSelectedFrameId(null);
      setSelectedCarouselId(carouselId);
    }
  };

  const handleSetVariant = (carouselId, frameId, variantIndex) => {
    setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      return { 
        ...carousel, 
        frames: carousel.frames.map(frame => 
          frame.id !== frameId ? frame : { ...frame, currentVariant: variantIndex }
        )
      };
    }));
  };

  const handleSetLayout = (carouselId, frameId, layoutIndex) => {
    setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      return { 
        ...carousel, 
        frames: carousel.frames.map(frame => 
          frame.id !== frameId ? frame : { ...frame, currentLayout: layoutIndex, layoutVariant: 0 }
        )
      };
    }));
  };

  const handleShuffleLayoutVariant = (carouselId, frameId) => {
    setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      return { 
        ...carousel, 
        frames: carousel.frames.map(frame => 
          frame.id !== frameId ? frame : { ...frame, layoutVariant: ((frame.layoutVariant || 0) + 1) % 3 }
        )
      };
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
          updatedVariants[frame.currentVariant] = { 
            ...updatedVariants[frame.currentVariant], 
            [field]: value 
          };
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
          updatedVariants[frame.currentVariant] = { 
            ...currentVariant, 
            formatting: { 
              ...currentFormatting, 
              [field]: { ...fieldFormatting, [key]: value } 
            } 
          };
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
        id: Date.now(),
        variants: [
          { headline: "Add your headline", body: "Add your supporting copy here.", formatting: {} },
          { headline: "Alternative headline", body: "Alternative supporting copy.", formatting: {} },
          { headline: "Third option", body: "Third copy variation.", formatting: {} }
        ],
        currentVariant: 0, 
        currentLayout: 0, 
        layoutVariant: 0,
        style: adjacentFrame?.style || "dark-single-pin"
      };
      const newFrames = [...carousel.frames];
      newFrames.splice(insertIndex, 0, newFrame);
      const renumberedFrames = newFrames.map((f, idx) => ({ ...f, id: idx + 1 }));
      return { ...carousel, frames: renumberedFrames };
    }));
  };

  const handleChangeFrameSize = (carouselId, newSize) => {
    setCarousels(prev => prev.map(carousel => 
      carousel.id === carouselId ? { ...carousel, frameSize: newSize } : carousel
    ));
  };

  const handleRemoveFrame = (carouselId, frameId) => {
    if (selectedCarouselId === carouselId && selectedFrameId === frameId) {
      setSelectedFrameId(null);
    }
    setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      if (carousel.frames.length <= 1) return carousel;
      const newFrames = carousel.frames
        .filter(f => f.id !== frameId)
        .map((f, idx) => ({ ...f, id: idx + 1 }));
      return { ...carousel, frames: newFrames };
    }));
  };

  const handleReorderFrames = (carouselId, oldIndex, newIndex) => {
    setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      const newFrames = arrayMove(carousel.frames, oldIndex, newIndex)
        .map((f, idx) => ({ ...f, id: idx + 1 }));
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
      frames: [{
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
      }]
    };
    
    setCarousels(prev => {
      const newCarousels = [...prev];
      newCarousels.splice(afterIndex + 1, 0, newCarousel);
      return newCarousels;
    });
    
    setSelectedCarouselId(newId);
  };

  const handleRemoveRow = (carouselId) => {
    if (carousels.length <= 1) return;
    
    if (selectedCarouselId === carouselId) {
      setSelectedCarouselId(null);
      setSelectedFrameId(null);
      setActiveTextField(null);
    }
    
    setCarousels(prev => prev.filter(c => c.id !== carouselId));
  };

  return {
    carousels,
    selectedCarouselId,
    selectedFrameId,
    activeTextField,
    selectedCarousel,
    selectedFrame,
    setActiveTextField,
    clearSelection,
    handleSelectFrame,
    handleSelectCarousel,
    handleSetVariant,
    handleSetLayout,
    handleShuffleLayoutVariant,
    handleUpdateText,
    handleUpdateFormatting,
    handleAddFrame,
    handleChangeFrameSize,
    handleRemoveFrame,
    handleReorderFrames,
    handleAddRow,
    handleRemoveRow,
  };
}

