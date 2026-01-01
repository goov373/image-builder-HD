import { useReducer, useEffect, useState, useCallback } from 'react';
import { DEFAULT_MOCKUP_STYLE } from '../types/singleImage';
import { createPatternLayer } from '../data';
import { logger } from '../utils';

const STORAGE_KEY = 'carousel-tool-singleimages';

// Action types
export const SINGLEIMAGE_ACTIONS = {
  SET_IMAGES: 'SET_IMAGES',
  SELECT_IMAGE: 'SELECT_IMAGE',
  SET_ACTIVE_LAYER: 'SET_ACTIVE_LAYER',
  CLEAR_SELECTION: 'CLEAR_SELECTION',
  UPDATE_LAYER: 'UPDATE_LAYER',
  ADD_LAYER: 'ADD_LAYER',
  REMOVE_LAYER: 'REMOVE_LAYER',
  REORDER_LAYERS: 'REORDER_LAYERS',
  UPDATE_BACKGROUND: 'UPDATE_BACKGROUND',
  UPDATE_CANVAS_SIZE: 'UPDATE_CANVAS_SIZE',
  ADD_IMAGE: 'ADD_IMAGE',
  REMOVE_IMAGE: 'REMOVE_IMAGE',
  // New gradient/pattern actions
  SET_BACKGROUND_GRADIENT: 'SET_BACKGROUND_GRADIENT',
  ADD_PATTERN: 'ADD_PATTERN',
  UPDATE_PATTERN: 'UPDATE_PATTERN',
  REMOVE_PATTERN: 'REMOVE_PATTERN',
};

// Initial state
function createInitialState(singleImages) {
  return {
    singleImages,
    selectedImageId: null,
    selectedLayerId: null,
  };
}

// Reducer
function singleImageReducer(state, action) {
  switch (action.type) {
    case SINGLEIMAGE_ACTIONS.SET_IMAGES:
      return { ...state, singleImages: action.singleImages };

    case SINGLEIMAGE_ACTIONS.SELECT_IMAGE: {
      const { imageId } = action;
      if (imageId === state.selectedImageId) {
        return { ...state, selectedImageId: null, selectedLayerId: null };
      }
      return { ...state, selectedImageId: imageId, selectedLayerId: null };
    }

    case SINGLEIMAGE_ACTIONS.SET_ACTIVE_LAYER:
      return { ...state, selectedLayerId: action.layerId };

    case SINGLEIMAGE_ACTIONS.CLEAR_SELECTION:
      return { ...state, selectedImageId: null, selectedLayerId: null };

    case SINGLEIMAGE_ACTIONS.UPDATE_LAYER:
      return {
        ...state,
        singleImages: state.singleImages.map((img) => {
          if (img.id !== action.imageId) return img;
          return {
            ...img,
            layers: img.layers.map((layer) => (layer.id === action.layerId ? { ...layer, ...action.updates } : layer)),
            updatedAt: new Date().toISOString().split('T')[0],
          };
        }),
      };

    case SINGLEIMAGE_ACTIONS.ADD_LAYER: {
      const { imageId, layerType, template, decoratorType } = action;
      const newLayer = createNewLayer(
        layerType,
        template,
        decoratorType,
        state.singleImages.find((i) => i.id === imageId)?.layers.length || 0
      );

      return {
        ...state,
        singleImages: state.singleImages.map((img) => {
          if (img.id !== imageId) return img;
          return {
            ...img,
            layers: [...img.layers, newLayer],
            updatedAt: new Date().toISOString().split('T')[0],
          };
        }),
        selectedLayerId: newLayer.id,
      };
    }

    case SINGLEIMAGE_ACTIONS.REMOVE_LAYER:
      return {
        ...state,
        selectedLayerId: state.selectedLayerId === action.layerId ? null : state.selectedLayerId,
        singleImages: state.singleImages.map((img) => {
          if (img.id !== action.imageId) return img;
          return {
            ...img,
            layers: img.layers.filter((l) => l.id !== action.layerId),
            updatedAt: new Date().toISOString().split('T')[0],
          };
        }),
      };

    case SINGLEIMAGE_ACTIONS.REORDER_LAYERS:
      return {
        ...state,
        singleImages: state.singleImages.map((img) => {
          if (img.id !== action.imageId) return img;
          const layers = [...img.layers];
          const [moved] = layers.splice(action.oldIndex, 1);
          layers.splice(action.newIndex, 0, moved);
          // Update zIndex based on new order
          return {
            ...img,
            layers: layers.map((l, i) => ({ ...l, zIndex: i + 1 })),
            updatedAt: new Date().toISOString().split('T')[0],
          };
        }),
      };

    case SINGLEIMAGE_ACTIONS.UPDATE_BACKGROUND:
      return {
        ...state,
        singleImages: state.singleImages.map((img) =>
          img.id === action.imageId
            ? { ...img, background: action.background, updatedAt: new Date().toISOString().split('T')[0] }
            : img
        ),
      };

    case SINGLEIMAGE_ACTIONS.UPDATE_CANVAS_SIZE:
      return {
        ...state,
        singleImages: state.singleImages.map((img) =>
          img.id === action.imageId
            ? {
                ...img,
                canvasSize: action.canvasSize,
                canvasWidth: action.width,
                canvasHeight: action.height,
                updatedAt: new Date().toISOString().split('T')[0],
              }
            : img
        ),
      };

    case SINGLEIMAGE_ACTIONS.ADD_IMAGE: {
      const newImage = {
        id: Date.now(),
        name: action.name || 'New Mockup',
        subtitle: 'Product Mockup',
        canvasSize: 'hero',
        canvasWidth: 1200,
        canvasHeight: 630,
        background: {
          type: 'gradient',
          gradient: { type: 'linear', from: '#18191A', to: '#2d2e30', angle: 135 },
        },
        layers: [],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      return {
        ...state,
        singleImages: [...state.singleImages, newImage],
        selectedImageId: newImage.id,
      };
    }

    case SINGLEIMAGE_ACTIONS.REMOVE_IMAGE: {
      if (state.singleImages.length <= 1) return state;
      return {
        ...state,
        selectedImageId: state.selectedImageId === action.imageId ? null : state.selectedImageId,
        selectedLayerId: null,
        singleImages: state.singleImages.filter((img) => img.id !== action.imageId),
      };
    }

    // ===== Gradient/Pattern Actions =====

    case SINGLEIMAGE_ACTIONS.SET_BACKGROUND_GRADIENT: {
      const { imageId, gradient } = action;
      return {
        ...state,
        singleImages: state.singleImages.map((img) =>
          img.id === imageId
            ? { ...img, backgroundGradient: gradient, updatedAt: new Date().toISOString().split('T')[0] }
            : img
        ),
      };
    }

    case SINGLEIMAGE_ACTIONS.ADD_PATTERN: {
      const { imageId, patternId } = action;
      const newPatternLayer = createPatternLayer(patternId);
      if (!newPatternLayer) return state;

      return {
        ...state,
        singleImages: state.singleImages.map((img) =>
          img.id === imageId
            ? { ...img, patternLayer: newPatternLayer, updatedAt: new Date().toISOString().split('T')[0] }
            : img
        ),
      };
    }

    case SINGLEIMAGE_ACTIONS.UPDATE_PATTERN: {
      const { imageId, updates } = action;
      return {
        ...state,
        singleImages: state.singleImages.map((img) => {
          if (img.id !== imageId || !img.patternLayer) return img;
          return {
            ...img,
            patternLayer: { ...img.patternLayer, ...updates },
            updatedAt: new Date().toISOString().split('T')[0],
          };
        }),
      };
    }

    case SINGLEIMAGE_ACTIONS.REMOVE_PATTERN: {
      const { imageId } = action;
      return {
        ...state,
        singleImages: state.singleImages.map((img) => {
          if (img.id !== imageId) return img;
          const { patternLayer, ...rest } = img;
          return { ...rest, updatedAt: new Date().toISOString().split('T')[0] };
        }),
      };
    }

    default:
      return state;
  }
}

// Helper to create new layers
function createNewLayer(type, template, decoratorType, existingCount) {
  const baseLayer = {
    id: Date.now(),
    name: type === 'mockup' ? 'Dashboard' : type === 'decorator' ? 'Decorator' : 'Text',
    visible: true,
    locked: false,
    opacity: 1,
    zIndex: existingCount + 1,
    transform: {
      x: 100 + existingCount * 20,
      y: 100 + existingCount * 20,
      width: type === 'mockup' ? 800 : 100,
      height: type === 'mockup' ? 500 : 40,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    },
  };

  if (type === 'mockup') {
    return {
      ...baseLayer,
      type: 'mockup',
      template: template || 'dashboard-full',
      style: { ...DEFAULT_MOCKUP_STYLE },
      placeholderType: 'analytics',
    };
  }

  if (type === 'decorator') {
    return {
      ...baseLayer,
      type: 'decorator',
      decoratorType: decoratorType || 'chip',
      content: '+23%',
      variant: 'success',
      size: 'md',
      decoratorStyle: {
        backgroundColor: '#059669',
        textColor: '#ffffff',
        borderRadius: 16,
        hasShadow: true,
        hasGlow: false,
      },
    };
  }

  return baseLayer;
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
    logger.warn('Failed to load single images from localStorage:', e);
  }
  return initialData;
}

export default function useSingleImages(initialData) {
  const [initialized, setInitialized] = useState(false);
  const [state, dispatch] = useReducer(singleImageReducer, loadFromStorage(initialData), createInitialState);

  // Computed values
  const selectedImage = state.singleImages.find((img) => img.id === state.selectedImageId);
  const selectedLayer = selectedImage?.layers?.find((l) => l.id === state.selectedLayerId);

  // Save to localStorage
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.singleImages));
    } catch (e) {
      logger.warn('Failed to save single images to localStorage:', e);
    }
  }, [state.singleImages, initialized]);

  // Memoized actions
  const actions = {
    clearSelection: useCallback(() => dispatch({ type: SINGLEIMAGE_ACTIONS.CLEAR_SELECTION }), []),

    handleSelectImage: useCallback((imageId, closeAllDropdowns) => {
      if (closeAllDropdowns) closeAllDropdowns();
      dispatch({ type: SINGLEIMAGE_ACTIONS.SELECT_IMAGE, imageId });
    }, []),

    handleSelectLayer: useCallback((layerId) => dispatch({ type: SINGLEIMAGE_ACTIONS.SET_ACTIVE_LAYER, layerId }), []),

    handleUpdateLayer: useCallback(
      (imageId, layerId, updates) => dispatch({ type: SINGLEIMAGE_ACTIONS.UPDATE_LAYER, imageId, layerId, updates }),
      []
    ),

    handleAddLayer: useCallback(
      (imageId, layerType, template, decoratorType) =>
        dispatch({ type: SINGLEIMAGE_ACTIONS.ADD_LAYER, imageId, layerType, template, decoratorType }),
      []
    ),

    handleRemoveLayer: useCallback(
      (imageId, layerId) => dispatch({ type: SINGLEIMAGE_ACTIONS.REMOVE_LAYER, imageId, layerId }),
      []
    ),

    handleReorderLayers: useCallback(
      (imageId, oldIndex, newIndex) =>
        dispatch({ type: SINGLEIMAGE_ACTIONS.REORDER_LAYERS, imageId, oldIndex, newIndex }),
      []
    ),

    handleUpdateBackground: useCallback(
      (imageId, background) => dispatch({ type: SINGLEIMAGE_ACTIONS.UPDATE_BACKGROUND, imageId, background }),
      []
    ),

    handleUpdateCanvasSize: useCallback(
      (imageId, canvasSize, width, height) =>
        dispatch({ type: SINGLEIMAGE_ACTIONS.UPDATE_CANVAS_SIZE, imageId, canvasSize, width, height }),
      []
    ),

    handleAddImage: useCallback((name) => dispatch({ type: SINGLEIMAGE_ACTIONS.ADD_IMAGE, name }), []),

    handleRemoveImage: useCallback((imageId) => dispatch({ type: SINGLEIMAGE_ACTIONS.REMOVE_IMAGE, imageId }), []),

    // Gradient/Pattern Actions
    handleSetBackgroundGradient: useCallback(
      (imageId, gradient) => dispatch({ type: SINGLEIMAGE_ACTIONS.SET_BACKGROUND_GRADIENT, imageId, gradient }),
      []
    ),

    handleAddPattern: useCallback(
      (imageId, patternId) => dispatch({ type: SINGLEIMAGE_ACTIONS.ADD_PATTERN, imageId, patternId }),
      []
    ),

    handleUpdatePattern: useCallback(
      (imageId, updates) => dispatch({ type: SINGLEIMAGE_ACTIONS.UPDATE_PATTERN, imageId, updates }),
      []
    ),

    handleRemovePattern: useCallback((imageId) => dispatch({ type: SINGLEIMAGE_ACTIONS.REMOVE_PATTERN, imageId }), []),
  };

  return {
    // State
    singleImages: state.singleImages,
    selectedImageId: state.selectedImageId,
    selectedLayerId: state.selectedLayerId,
    // Computed
    selectedImage,
    selectedLayer,
    // Actions
    dispatch,
    ...actions,
  };
}
