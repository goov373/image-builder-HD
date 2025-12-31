import { useReducer, useEffect, useState, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { STORAGE_KEYS } from '../config';
import { createPatternLayer, findPatternById } from '../data';

const STORAGE_KEY = STORAGE_KEYS.CAROUSELS;

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
  // Image Layer Actions
  ADD_IMAGE_TO_FRAME: 'ADD_IMAGE_TO_FRAME',
  UPDATE_IMAGE_LAYER: 'UPDATE_IMAGE_LAYER',
  REMOVE_IMAGE_FROM_FRAME: 'REMOVE_IMAGE_FROM_FRAME',
  SYNC_LINKED_IMAGES: 'SYNC_LINKED_IMAGES',
  // Pattern Layer Actions
  ADD_PATTERN_TO_FRAME: 'ADD_PATTERN_TO_FRAME',
  UPDATE_PATTERN_LAYER: 'UPDATE_PATTERN_LAYER',
  REMOVE_PATTERN_FROM_FRAME: 'REMOVE_PATTERN_FROM_FRAME',
  SET_ROW_STRETCHED_PATTERN: 'SET_ROW_STRETCHED_PATTERN',
  // Fill Layer Actions
  UPDATE_FILL_LAYER: 'UPDATE_FILL_LAYER',
  // Product Image Layer Actions
  ADD_PRODUCT_IMAGE_TO_FRAME: 'ADD_PRODUCT_IMAGE_TO_FRAME',
  UPDATE_PRODUCT_IMAGE_LAYER: 'UPDATE_PRODUCT_IMAGE_LAYER',
  REMOVE_PRODUCT_IMAGE_FROM_FRAME: 'REMOVE_PRODUCT_IMAGE_FROM_FRAME',
  // Icon Layer Actions
  ADD_ICON_TO_FRAME: 'ADD_ICON_TO_FRAME',
  UPDATE_ICON_LAYER: 'UPDATE_ICON_LAYER',
  REMOVE_ICON_FROM_FRAME: 'REMOVE_ICON_FROM_FRAME',
  // Progress Indicator Actions
  UPDATE_PROGRESS_INDICATOR: 'UPDATE_PROGRESS_INDICATOR',
  // Background Layer Order Actions
  REORDER_BACKGROUND_LAYERS: 'REORDER_BACKGROUND_LAYERS',
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
            style: adjacentFrame?.style || "dark-single-pin",
            backgroundOverride: '#6466e9', // Default to primary purple
            backgroundLayerOrder: ['fill', 'pattern', 'image'], // Default layer order (backmost to topmost)
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
      // Apply a gradient stretched across selected frames in a carousel row
      // Each selected frame shows a slice of the gradient using background-size and background-position
      const { carouselId, background, startIdx = 0, endIdx } = action;
      return {
        ...state,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== carouselId) return carousel;
          const numFrames = carousel.frames.length;
          if (numFrames === 0) return carousel;
          
          // Calculate the actual end index (default to last frame)
          const actualEndIdx = endIdx !== undefined ? endIdx : numFrames - 1;
          const selectedCount = actualEndIdx - startIdx + 1;
          
          return {
            ...carousel,
            frames: carousel.frames.map((frame, index) => {
              // Only apply to frames within the selected range
              if (index < startIdx || index > actualEndIdx) {
                return frame; // Leave unselected frames unchanged
              }
              
              // Calculate position relative to the selected range
              const relativeIndex = index - startIdx;
              
              // CSS background-position percentage when bg > container:
              // 0% = left aligned, 100% = right aligned
              // For N frames, frame i should be at position: i/(N-1)*100%
              const positionPercent = selectedCount > 1 
                ? (relativeIndex / (selectedCount - 1)) * 100 
                : 0;
              
              return {
                ...frame,
                backgroundOverride: {
                  gradient: background,
                  size: `${selectedCount * 100}% 100%`,
                  position: `${positionPercent}% 0%`,
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
      // action.smoothedFrames: Array<{ id: number, background: string | object | null }>
      // background can be: string (simple gradient), object (stretched gradient), or null (clear)
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
              // If null or undefined, remove backgroundOverride; otherwise set it
              if (newBg === null || newBg === undefined) {
                const { backgroundOverride, ...rest } = frame;
                return rest;
              }
              // Preserve object format (stretched gradients) or string format
              return { ...frame, backgroundOverride: newBg };
            })
          };
        })
      };
    }

    // ===== Image Layer Actions =====
    
    case CAROUSEL_ACTIONS.ADD_IMAGE_TO_FRAME: {
      const { carouselId, frameId, imageSrc } = action;
      const newImageLayer = {
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        src: imageSrc,
        x: 0,           // Centered
        y: 0,           // Centered
        scale: 1,       // Fit to frame
        opacity: 1,     // Fully visible
        rotation: 0,    // No rotation
        zIndex: 0,      // Behind text
        fit: 'cover',   // Cover the frame
      };
      
      return {
        ...state,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map(frame =>
              frame.id === frameId ? { ...frame, imageLayer: newImageLayer } : frame
            )
          };
        })
      };
    }

    case CAROUSEL_ACTIONS.UPDATE_IMAGE_LAYER: {
      const { carouselId, frameId, updates } = action;
      return {
        ...state,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map(frame => {
              if (frame.id !== frameId || !frame.imageLayer) return frame;
              return {
                ...frame,
                imageLayer: { ...frame.imageLayer, ...updates }
              };
            })
          };
        })
      };
    }

    case CAROUSEL_ACTIONS.REMOVE_IMAGE_FROM_FRAME: {
      const { carouselId, frameId } = action;
      return {
        ...state,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map(frame => {
              if (frame.id !== frameId) return frame;
              const { imageLayer, ...rest } = frame;
              return rest;
            })
          };
        })
      };
    }

    case CAROUSEL_ACTIONS.SYNC_LINKED_IMAGES: {
      // Sync all images with the same linkedGroupId across all carousels/frames
      const { linkedGroupId, updates } = action;
      if (!linkedGroupId) return state;
      
      return {
        ...state,
        carousels: state.carousels.map(carousel => ({
          ...carousel,
          frames: carousel.frames.map(frame => {
            if (!frame.imageLayer || frame.imageLayer.linkedGroupId !== linkedGroupId) return frame;
            return {
              ...frame,
              imageLayer: { ...frame.imageLayer, ...updates }
            };
          })
        }))
      };
    }

    // ===== Pattern Layer Actions =====
    
    case CAROUSEL_ACTIONS.ADD_PATTERN_TO_FRAME: {
      const { carouselId, frameId, patternId } = action;
      const newPatternLayer = createPatternLayer(patternId);
      if (!newPatternLayer) return state;
      
      return {
        ...state,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map(frame =>
              frame.id === frameId ? { ...frame, patternLayer: newPatternLayer } : frame
            )
          };
        })
      };
    }

    case CAROUSEL_ACTIONS.UPDATE_PATTERN_LAYER: {
      const { carouselId, frameId, updates } = action;
      return {
        ...state,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map(frame => {
              if (frame.id !== frameId || !frame.patternLayer) return frame;
              return {
                ...frame,
                patternLayer: { ...frame.patternLayer, ...updates }
              };
            })
          };
        })
      };
    }

    case CAROUSEL_ACTIONS.REMOVE_PATTERN_FROM_FRAME: {
      const { carouselId, frameId } = action;
      return {
        ...state,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map(frame => {
              if (frame.id !== frameId) return frame;
              const { patternLayer, ...rest } = frame;
              return rest;
            })
          };
        })
      };
    }

    case CAROUSEL_ACTIONS.SET_ROW_STRETCHED_PATTERN: {
      // Apply a pattern stretched across selected frames in a carousel row
      const { carouselId, patternId, startIdx = 0, endIdx } = action;
      const basePatternLayer = createPatternLayer(patternId);
      if (!basePatternLayer) return state;
      
      return {
        ...state,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== carouselId) return carousel;
          const numFrames = carousel.frames.length;
          if (numFrames === 0) return carousel;
          
          const actualEndIdx = endIdx !== undefined ? endIdx : numFrames - 1;
          const selectedCount = actualEndIdx - startIdx + 1;
          
          return {
            ...carousel,
            frames: carousel.frames.map((frame, index) => {
              if (index < startIdx || index > actualEndIdx) {
                return frame;
              }
              
              const relativeIndex = index - startIdx;
              
              return {
                ...frame,
                patternLayer: {
                  ...basePatternLayer,
                  // Store stretch info for rendering
                  isStretched: true,
                  stretchSize: `${selectedCount * 100}% 100%`,
                  stretchPosition: `${-relativeIndex * 100}% 0%`,
                }
              };
            })
          };
        })
      };
    }

    case CAROUSEL_ACTIONS.UPDATE_FILL_LAYER: {
      const { carouselId, frameId, updates } = action;
      return {
        ...state,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map(frame => {
              if (frame.id !== frameId) return frame;
              return {
                ...frame,
                fillOpacity: updates.fillOpacity !== undefined ? updates.fillOpacity : frame.fillOpacity,
                fillRotation: updates.fillRotation !== undefined ? updates.fillRotation : frame.fillRotation,
              };
            })
          };
        })
      };
    }

    // ===== Product Image Layer Actions =====
    
    case CAROUSEL_ACTIONS.ADD_PRODUCT_IMAGE_TO_FRAME: {
      const { carouselId, frameId, imageSrc, layoutIndex, layoutVariant } = action;
      
      // Determine position based on layout
      // 'top' = product image above text (text at bottom)
      // 'bottom' = product image below text (text at top)
      let position = 'top';
      
      if (layoutIndex === 0 && layoutVariant === 0) {
        // Bottom Stack: text at bottom, product at top
        position = 'top';
      } else if (layoutIndex === 0 && layoutVariant === 1) {
        // Top Stack: text at top, product at bottom
        position = 'bottom';
      } else if (layoutIndex === 1 && layoutVariant === 2) {
        // Upper Drama: text in upper area, product below
        position = 'bottom';
      }
      
      const newProductImageLayer = {
        id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        src: imageSrc,
        position,          // 'top' or 'bottom' - which area of the layout
        scale: 1,          // Zoom level (1 = 100%)
        borderRadius: 8,   // Corner rounding in pixels
        offsetX: 0,        // Horizontal offset for positioning
        offsetY: 0,        // Vertical offset for positioning
      };
      
      return {
        ...state,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map(frame =>
              frame.id === frameId ? { ...frame, productImageLayer: newProductImageLayer } : frame
            )
          };
        })
      };
    }

    case CAROUSEL_ACTIONS.UPDATE_PRODUCT_IMAGE_LAYER: {
      const { carouselId, frameId, updates } = action;
      return {
        ...state,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map(frame => {
              if (frame.id !== frameId || !frame.productImageLayer) return frame;
              return {
                ...frame,
                productImageLayer: { ...frame.productImageLayer, ...updates }
              };
            })
          };
        })
      };
    }

    case CAROUSEL_ACTIONS.REMOVE_PRODUCT_IMAGE_FROM_FRAME: {
      const { carouselId, frameId } = action;
      return {
        ...state,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map(frame => {
              if (frame.id !== frameId) return frame;
              const { productImageLayer, ...rest } = frame;
              return rest;
            })
          };
        })
      };
    }

    // ===== Icon Layer Actions =====
    
    case CAROUSEL_ACTIONS.ADD_ICON_TO_FRAME: {
      const { carouselId, frameId, iconId, iconPath, iconName } = action;
      
      const newIconLayer = {
        id: `icon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        iconId,
        path: iconPath,
        name: iconName,
        scale: 1,
        color: '#ffffff', // Default white
        borderColor: null, // No border by default
        backgroundColor: null, // No background by default
      };
      
      return {
        ...state,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map(frame =>
              frame.id === frameId ? { ...frame, iconLayer: newIconLayer } : frame
            )
          };
        })
      };
    }

    case CAROUSEL_ACTIONS.UPDATE_ICON_LAYER: {
      const { carouselId, frameId, updates } = action;
      return {
        ...state,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map(frame => {
              if (frame.id !== frameId || !frame.iconLayer) return frame;
              return {
                ...frame,
                iconLayer: { ...frame.iconLayer, ...updates }
              };
            })
          };
        })
      };
    }

    case CAROUSEL_ACTIONS.REMOVE_ICON_FROM_FRAME: {
      const { carouselId, frameId } = action;
      return {
        ...state,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map(frame => {
              if (frame.id !== frameId) return frame;
              const { iconLayer, ...rest } = frame;
              return rest;
            })
          };
        })
      };
    }

    // ===== Progress Indicator Actions =====
    
    case CAROUSEL_ACTIONS.UPDATE_PROGRESS_INDICATOR: {
      const { carouselId, frameId, updates } = action;
      return {
        ...state,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map(frame => {
              if (frame.id !== frameId) return frame;
              return {
                ...frame,
                progressIndicator: { 
                  type: 'dots', // default
                  color: '#ffffff', // default white
                  isHidden: false, // default visible
                  ...(frame.progressIndicator || {}),
                  ...updates 
                }
              };
            })
          };
        })
      };
    }

    // ===== Background Layer Order Actions =====
    
    case CAROUSEL_ACTIONS.REORDER_BACKGROUND_LAYERS: {
      const { carouselId, frameId, newOrder } = action;
      return {
        ...state,
        carousels: state.carousels.map(carousel => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map(frame =>
              frame.id === frameId 
                ? { ...frame, backgroundLayerOrder: newOrder } 
                : frame
            )
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
        // Migration: Set defaults for frames
        const migrated = parsed.map(carousel => ({
          ...carousel,
          frames: carousel.frames?.map(frame => ({
            ...frame,
            backgroundOverride: frame.backgroundOverride || '#6466e9', // Default to primary purple if not set
            backgroundLayerOrder: frame.backgroundLayerOrder || ['fill', 'pattern', 'image'], // Default layer order
          })) || []
        }));
        // Force save the migrated data immediately
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        console.log('Migration: Cleared all background overrides from frames');
        return migrated;
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
    
    handleSetRowStretchedBackground: useCallback((carouselId, background, startIdx, endIdx) =>
      dispatch({ type: CAROUSEL_ACTIONS.SET_ROW_STRETCHED_BACKGROUND, carouselId, background, startIdx, endIdx }), []),
    
    handleSmoothBackgrounds: useCallback((carouselId, smoothedFrames) =>
      dispatch({ type: CAROUSEL_ACTIONS.SMOOTH_BACKGROUNDS, carouselId, smoothedFrames }), []),
    
    // Image Layer Actions
    handleAddImageToFrame: useCallback((carouselId, frameId, imageSrc) =>
      dispatch({ type: CAROUSEL_ACTIONS.ADD_IMAGE_TO_FRAME, carouselId, frameId, imageSrc }), []),
    
    handleUpdateImageLayer: useCallback((carouselId, frameId, updates) =>
      dispatch({ type: CAROUSEL_ACTIONS.UPDATE_IMAGE_LAYER, carouselId, frameId, updates }), []),
    
    handleRemoveImageFromFrame: useCallback((carouselId, frameId) =>
      dispatch({ type: CAROUSEL_ACTIONS.REMOVE_IMAGE_FROM_FRAME, carouselId, frameId }), []),
    
    handleSyncLinkedImages: useCallback((linkedGroupId, updates) =>
      dispatch({ type: CAROUSEL_ACTIONS.SYNC_LINKED_IMAGES, linkedGroupId, updates }), []),
    
    // Pattern Layer Actions
    handleAddPatternToFrame: useCallback((carouselId, frameId, patternId) =>
      dispatch({ type: CAROUSEL_ACTIONS.ADD_PATTERN_TO_FRAME, carouselId, frameId, patternId }), []),
    
    handleUpdatePatternLayer: useCallback((carouselId, frameId, updates) =>
      dispatch({ type: CAROUSEL_ACTIONS.UPDATE_PATTERN_LAYER, carouselId, frameId, updates }), []),
    
    handleRemovePatternFromFrame: useCallback((carouselId, frameId) =>
      dispatch({ type: CAROUSEL_ACTIONS.REMOVE_PATTERN_FROM_FRAME, carouselId, frameId }), []),
    
    handleSetRowStretchedPattern: useCallback((carouselId, patternId, startIdx, endIdx) =>
      dispatch({ type: CAROUSEL_ACTIONS.SET_ROW_STRETCHED_PATTERN, carouselId, patternId, startIdx, endIdx }), []),
    
    // Fill Layer Actions
    handleUpdateFillLayer: useCallback((carouselId, frameId, updates) =>
      dispatch({ type: CAROUSEL_ACTIONS.UPDATE_FILL_LAYER, carouselId, frameId, updates }), []),
    
    // Product Image Layer Actions
    handleAddProductImageToFrame: useCallback((carouselId, frameId, imageSrc, layoutIndex, layoutVariant) =>
      dispatch({ type: CAROUSEL_ACTIONS.ADD_PRODUCT_IMAGE_TO_FRAME, carouselId, frameId, imageSrc, layoutIndex, layoutVariant }), []),
    
    handleUpdateProductImageLayer: useCallback((carouselId, frameId, updates) =>
      dispatch({ type: CAROUSEL_ACTIONS.UPDATE_PRODUCT_IMAGE_LAYER, carouselId, frameId, updates }), []),
    
    handleRemoveProductImageFromFrame: useCallback((carouselId, frameId) =>
      dispatch({ type: CAROUSEL_ACTIONS.REMOVE_PRODUCT_IMAGE_FROM_FRAME, carouselId, frameId }), []),
    
    // Icon Layer Actions
    handleAddIconToFrame: useCallback((carouselId, frameId, iconId, iconPath, iconName) =>
      dispatch({ type: CAROUSEL_ACTIONS.ADD_ICON_TO_FRAME, carouselId, frameId, iconId, iconPath, iconName }), []),
    
    handleUpdateIconLayer: useCallback((carouselId, frameId, updates) =>
      dispatch({ type: CAROUSEL_ACTIONS.UPDATE_ICON_LAYER, carouselId, frameId, updates }), []),
    
    handleRemoveIconFromFrame: useCallback((carouselId, frameId) =>
      dispatch({ type: CAROUSEL_ACTIONS.REMOVE_ICON_FROM_FRAME, carouselId, frameId }), []),
    
    // Progress Indicator Actions
    handleUpdateProgressIndicator: useCallback((carouselId, frameId, updates) =>
      dispatch({ type: CAROUSEL_ACTIONS.UPDATE_PROGRESS_INDICATOR, carouselId, frameId, updates }), []),
    
    // Background Layer Order Actions
    handleReorderBackgroundLayers: useCallback((carouselId, frameId, newOrder) =>
      dispatch({ type: CAROUSEL_ACTIONS.REORDER_BACKGROUND_LAYERS, carouselId, frameId, newOrder }), []),
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
