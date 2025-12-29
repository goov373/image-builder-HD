import { useReducer, useEffect, useState, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

const STORAGE_KEY = 'carousel-tool-carousels';

// Action types
export const CAROUSEL_ACTIONS = {
  SET_CAROUSELS: 'SET_CAROUSELS',
  SELECT_CAROUSEL: 'SELECT_CAROUSEL',
  SELECT_FRAME: 'SELECT_FRAME',
  SET_ACTIVE_TEXT_FIELD: 'SET_ACTIVE_TEXT_FIELD',
  CLEAR_SELECTION: 'CLEAR_SELECTION',
  SET_VARIANT: 'SET_VARIANT',
  SET_LAYOUT: 'SET_LAYOUT',
  SHUFFLE_LAYOUT_VARIANT: 'SHUFFLE_LAYOUT_VARIANT',
  UPDATE_TEXT: 'UPDATE_TEXT',
  UPDATE_FORMATTING: 'UPDATE_FORMATTING',
  ADD_FRAME: 'ADD_FRAME',
  REMOVE_FRAME: 'REMOVE_FRAME',
  CHANGE_FRAME_SIZE: 'CHANGE_FRAME_SIZE',
  REORDER_FRAMES: 'REORDER_FRAMES',
  ADD_ROW: 'ADD_ROW',
  REMOVE_ROW: 'REMOVE_ROW',
  RESET_CAROUSEL: 'RESET_CAROUSEL',
  SET_FRAME_BACKGROUND: 'SET_FRAME_BACKGROUND',
  SET_ROW_STRETCHED_BACKGROUND: 'SET_ROW_STRETCHED_BACKGROUND',
  SMOOTH_BACKGROUNDS: 'SMOOTH_BACKGROUNDS',
};

// Initial state shape
function createInitialState(carousels) {
  return {
    carousels,
    selectedCarouselId: null,
    selectedFrameId: null,
    activeTextField: null,
  };
}

// Reducer function
function carouselReducer(state, action) {
  switch (action.type) {
    case CAROUSEL_ACTIONS.SET_CAROUSELS:
      return { ...state, carousels: action.carousels };

    case CAROUSEL_ACTIONS.SELECT_CAROUSEL: {
      const { carouselId } = action;
      const isOpening = carouselId !== null && carouselId !== state.selectedCarouselId;
      const isClosing = carouselId === null || (carouselId === state.selectedCarouselId && state.selectedCarouselId !== null);
      
      if (isOpening) {
        return { ...state, selectedCarouselId: carouselId, selectedFrameId: null, activeTextField: null };
      } else if (isClosing && carouselId === state.selectedCarouselId) {
        return { ...state, selectedCarouselId: null, selectedFrameId: null, activeTextField: null };
      } else if (carouselId === null) {
        return { ...state, selectedCarouselId: null, selectedFrameId: null, activeTextField: null };
      } else {
        return { ...state, selectedCarouselId: carouselId, selectedFrameId: null, activeTextField: null };
      }
    }

    case CAROUSEL_ACTIONS.SELECT_FRAME: {
      const { carouselId, frameId } = action;
      const newSelectedCarouselId = carouselId !== state.selectedCarouselId ? carouselId : state.selectedCarouselId;
      const newSelectedFrameId = (state.selectedFrameId === frameId && carouselId === state.selectedCarouselId) ? null : frameId;
      return { ...state, selectedCarouselId: newSelectedCarouselId, selectedFrameId: newSelectedFrameId, activeTextField: null };
    }

    case CAROUSEL_ACTIONS.SET_ACTIVE_TEXT_FIELD:
      return { ...state, activeTextField: action.field };

    case CAROUSEL_ACTIONS.CLEAR_SELECTION:
      return { ...state, selectedCarouselId: null, selectedFrameId: null, activeTextField: null };

    case CAROUSEL_ACTIONS.SET_VARIANT:
      return {
        ...state,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== action.carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map(frame =>
              frame.id !== action.frameId ? frame : { ...frame, currentVariant: action.variantIndex }
            )
          };
        })
      };

    case CAROUSEL_ACTIONS.SET_LAYOUT:
      return {
        ...state,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== action.carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map(frame =>
              frame.id !== action.frameId ? frame : { ...frame, currentLayout: action.layoutIndex, layoutVariant: 0 }
            )
          };
        })
      };

    case CAROUSEL_ACTIONS.SHUFFLE_LAYOUT_VARIANT:
      return {
        ...state,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== action.carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map(frame =>
              frame.id !== action.frameId ? frame : { ...frame, layoutVariant: ((frame.layoutVariant || 0) + 1) % 3 }
            )
          };
        })
      };

    case CAROUSEL_ACTIONS.UPDATE_TEXT:
      return {
        ...state,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== action.carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map(frame => {
              if (frame.id !== action.frameId) return frame;
              const updatedVariants = [...frame.variants];
              updatedVariants[frame.currentVariant] = {
                ...updatedVariants[frame.currentVariant],
                [action.field]: action.value
              };
              return { ...frame, variants: updatedVariants };
            })
          };
        })
      };

    case CAROUSEL_ACTIONS.UPDATE_FORMATTING:
      return {
        ...state,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== action.carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map(frame => {
              if (frame.id !== action.frameId) return frame;
              const updatedVariants = [...frame.variants];
              const currentVariant = updatedVariants[frame.currentVariant];
              const currentFormatting = currentVariant.formatting || {};
              const fieldFormatting = currentFormatting[action.field] || {};
              updatedVariants[frame.currentVariant] = {
                ...currentVariant,
                formatting: {
                  ...currentFormatting,
                  [action.field]: { ...fieldFormatting, [action.key]: action.value }
                }
              };
              return { ...frame, variants: updatedVariants };
            })
          };
        })
      };

    case CAROUSEL_ACTIONS.ADD_FRAME: {
      return {
        ...state,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== action.carouselId) return carousel;
          const insertIndex = action.position !== null ? action.position : carousel.frames.length;
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
        })
      };
    }

    case CAROUSEL_ACTIONS.REMOVE_FRAME: {
      const shouldClearFrameSelection = state.selectedCarouselId === action.carouselId && state.selectedFrameId === action.frameId;
      return {
        ...state,
        selectedFrameId: shouldClearFrameSelection ? null : state.selectedFrameId,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== action.carouselId) return carousel;
          if (carousel.frames.length <= 1) return carousel;
          const newFrames = carousel.frames
            .filter(f => f.id !== action.frameId)
            .map((f, idx) => ({ ...f, id: idx + 1 }));
          return { ...carousel, frames: newFrames };
        })
      };
    }

    case CAROUSEL_ACTIONS.CHANGE_FRAME_SIZE:
      return {
        ...state,
        carousels: state.carousels.map(carousel =>
          carousel.id === action.carouselId ? { ...carousel, frameSize: action.newSize } : carousel
        )
      };

    case CAROUSEL_ACTIONS.REORDER_FRAMES:
      return {
        ...state,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== action.carouselId) return carousel;
          const newFrames = arrayMove(carousel.frames, action.oldIndex, action.newIndex)
            .map((f, idx) => ({ ...f, id: idx + 1 }));
          return { ...carousel, frames: newFrames };
        })
      };

    case CAROUSEL_ACTIONS.ADD_ROW: {
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
      const newCarousels = [...state.carousels];
      newCarousels.splice(action.afterIndex + 1, 0, newCarousel);
      return { ...state, carousels: newCarousels, selectedCarouselId: newId };
    }

    case CAROUSEL_ACTIONS.REMOVE_ROW: {
      if (state.carousels.length <= 1) return state;
      const shouldClearSelection = state.selectedCarouselId === action.carouselId;
      return {
        ...state,
        selectedCarouselId: shouldClearSelection ? null : state.selectedCarouselId,
        selectedFrameId: shouldClearSelection ? null : state.selectedFrameId,
        activeTextField: shouldClearSelection ? null : state.activeTextField,
        carousels: state.carousels.filter(c => c.id !== action.carouselId)
      };
    }

    case CAROUSEL_ACTIONS.RESET_CAROUSEL: {
      // Replace a specific carousel with its original data from initialData
      const { carouselId, originalCarousel } = action;
      if (!originalCarousel) return state;
      return {
        ...state,
        carousels: state.carousels.map(c => 
          c.id === carouselId ? { ...originalCarousel } : c
        )
      };
    }

    case CAROUSEL_ACTIONS.SET_FRAME_BACKGROUND: {
      const { carouselId, frameId, background } = action;
      return {
        ...state,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map(frame =>
              frame.id === frameId ? { ...frame, backgroundOverride: background } : frame
            )
          };
        })
      };
    }

    case CAROUSEL_ACTIONS.SET_ROW_STRETCHED_BACKGROUND: {
      // Apply a gradient stretched across all frames in a carousel row
      // Each frame shows a slice of the gradient using background-size and background-position
      const { carouselId, background } = action;
      return {
        ...state,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== carouselId) return carousel;
          const numFrames = carousel.frames.length;
          if (numFrames === 0) return carousel;
          
          return {
            ...carousel,
            frames: carousel.frames.map((frame, index) => {
              // Each frame shows 1/numFrames of the total gradient
              // background-size makes gradient N times wider than frame
              // background-position shifts left by (index * 100)% to show correct slice
              // e.g., for 5 frames: frame 0 = 0%, frame 1 = -100%, frame 2 = -200%, etc.
              
              return {
                ...frame,
                backgroundOverride: {
                  gradient: background,
                  size: `${numFrames * 100}% 100%`,
                  position: `${-index * 100}% 0%`,
                  isStretched: true,
                }
              };
            })
          };
        })
      };
    }

    case CAROUSEL_ACTIONS.SMOOTH_BACKGROUNDS: {
      // Apply smoothed backgrounds to all frames in a carousel
      // action.smoothedFrames: Array<{ id: number, background: string | null }>
      // If background is null, clear the backgroundOverride (reset to default)
      const { carouselId, smoothedFrames } = action;
      if (!smoothedFrames || smoothedFrames.length === 0) return state;
      
      const smoothedMap = new Map(smoothedFrames.map(f => [f.id, f.background]));
      
      return {
        ...state,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map(frame => {
              if (!smoothedMap.has(frame.id)) return frame;
              const newBg = smoothedMap.get(frame.id);
              // If null, remove backgroundOverride; otherwise set it
              if (newBg === null) {
                const { backgroundOverride, ...rest } = frame;
                return rest;
              }
              return { ...frame, backgroundOverride: newBg };
            })
          };
        })
      };
    }

    default:
      return state;
  }
}

// Load from localStorage
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
  const [state, dispatch] = useReducer(
    carouselReducer,
    loadFromStorage(initialData),
    createInitialState
  );

  // Computed values
  const selectedCarousel = state.carousels.find(c => c.id === state.selectedCarouselId) || state.carousels[0];
  const selectedFrame = selectedCarousel?.frames?.find(f => f.id === state.selectedFrameId);

  // Save to localStorage whenever carousels change
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.carousels));
    } catch (e) {
      console.warn('Failed to save carousels to localStorage:', e);
    }
  }, [state.carousels, initialized]);

  // Memoized action creators for backwards compatibility
  const actions = {
    clearSelection: useCallback(() => dispatch({ type: CAROUSEL_ACTIONS.CLEAR_SELECTION }), []),
    
    setActiveTextField: useCallback((field) => 
      dispatch({ type: CAROUSEL_ACTIONS.SET_ACTIVE_TEXT_FIELD, field }), []),
    
    handleSelectFrame: useCallback((carouselId, frameId, closeAllDropdowns) => {
      if (closeAllDropdowns) closeAllDropdowns();
      dispatch({ type: CAROUSEL_ACTIONS.SELECT_FRAME, carouselId, frameId });
    }, []),
    
    handleSelectCarousel: useCallback((carouselId, closeAllDropdowns) => {
      if (closeAllDropdowns) closeAllDropdowns();
      dispatch({ type: CAROUSEL_ACTIONS.SELECT_CAROUSEL, carouselId });
    }, []),
    
    handleSetVariant: useCallback((carouselId, frameId, variantIndex) =>
      dispatch({ type: CAROUSEL_ACTIONS.SET_VARIANT, carouselId, frameId, variantIndex }), []),
    
    handleSetLayout: useCallback((carouselId, frameId, layoutIndex) =>
      dispatch({ type: CAROUSEL_ACTIONS.SET_LAYOUT, carouselId, frameId, layoutIndex }), []),
    
    handleShuffleLayoutVariant: useCallback((carouselId, frameId) =>
      dispatch({ type: CAROUSEL_ACTIONS.SHUFFLE_LAYOUT_VARIANT, carouselId, frameId }), []),
    
    handleUpdateText: useCallback((carouselId, frameId, field, value) =>
      dispatch({ type: CAROUSEL_ACTIONS.UPDATE_TEXT, carouselId, frameId, field, value }), []),
    
    handleUpdateFormatting: useCallback((carouselId, frameId, field, key, value) =>
      dispatch({ type: CAROUSEL_ACTIONS.UPDATE_FORMATTING, carouselId, frameId, field, key, value }), []),
    
    handleAddFrame: useCallback((carouselId, position = null) =>
      dispatch({ type: CAROUSEL_ACTIONS.ADD_FRAME, carouselId, position }), []),
    
    handleChangeFrameSize: useCallback((carouselId, newSize) =>
      dispatch({ type: CAROUSEL_ACTIONS.CHANGE_FRAME_SIZE, carouselId, newSize }), []),
    
    handleRemoveFrame: useCallback((carouselId, frameId) =>
      dispatch({ type: CAROUSEL_ACTIONS.REMOVE_FRAME, carouselId, frameId }), []),
    
    handleReorderFrames: useCallback((carouselId, oldIndex, newIndex) =>
      dispatch({ type: CAROUSEL_ACTIONS.REORDER_FRAMES, carouselId, oldIndex, newIndex }), []),
    
    handleAddRow: useCallback((afterIndex) =>
      dispatch({ type: CAROUSEL_ACTIONS.ADD_ROW, afterIndex }), []),
    
    handleRemoveRow: useCallback((carouselId) =>
      dispatch({ type: CAROUSEL_ACTIONS.REMOVE_ROW, carouselId }), []),
    
    handleResetCarousel: useCallback((carouselId) => {
      const originalCarousel = initialData.find(c => c.id === carouselId);
      if (originalCarousel) {
        dispatch({ type: CAROUSEL_ACTIONS.RESET_CAROUSEL, carouselId, originalCarousel });
      }
    }, [initialData]),
    
    handleSetFrameBackground: useCallback((carouselId, frameId, background) =>
      dispatch({ type: CAROUSEL_ACTIONS.SET_FRAME_BACKGROUND, carouselId, frameId, background }), []),
    
    handleSetRowStretchedBackground: useCallback((carouselId, background) =>
      dispatch({ type: CAROUSEL_ACTIONS.SET_ROW_STRETCHED_BACKGROUND, carouselId, background }), []),
    
    handleSmoothBackgrounds: useCallback((carouselId, smoothedFrames) =>
      dispatch({ type: CAROUSEL_ACTIONS.SMOOTH_BACKGROUNDS, carouselId, smoothedFrames }), []),
  };

  return {
    // State
    carousels: state.carousels,
    selectedCarouselId: state.selectedCarouselId,
    selectedFrameId: state.selectedFrameId,
    activeTextField: state.activeTextField,
    // Computed
    selectedCarousel,
    selectedFrame,
    // Actions
    dispatch,
    ...actions,
  };
}
