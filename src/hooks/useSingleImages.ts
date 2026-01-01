import { useReducer, useEffect, useState, useCallback, Dispatch } from 'react';
import { DEFAULT_MOCKUP_STYLE } from '../types/singleImage';
import { createPatternLayer } from '../data';
import { logger } from '../utils';
import type { PatternLayer } from '../types';

/**
 * useSingleImages Hook
 *
 * Manages single image/mockup editor state including:
 * - Multiple image projects
 * - Layer management (mockups, decorators, text)
 * - Background gradients and patterns
 * - Canvas size configuration
 * - LocalStorage persistence
 *
 * @example
 * ```tsx
 * import useSingleImages from './hooks/useSingleImages';
 * import { INITIAL_SINGLE_IMAGES } from './data';
 *
 * function MockupEditor() {
 *   const {
 *     singleImages,
 *     selectedImage,
 *     handleAddLayer,
 *     handleUpdateLayer,
 *     handleUpdateBackground,
 *   } = useSingleImages(INITIAL_SINGLE_IMAGES);
 *
 *   return (
 *     <div>
 *       <Canvas image={selectedImage} />
 *       <LayerPanel
 *         layers={selectedImage?.layers}
 *         onAddLayer={(type) => handleAddLayer(selectedImage.id, type)}
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * @module hooks/useSingleImages
 */

const STORAGE_KEY = 'carousel-tool-singleimages';

// ===== Types =====

export interface LayerTransform {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

export interface MockupStyle {
  borderRadius?: number;
  shadow?: string;
  border?: string;
}

export interface DecoratorStyle {
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
  hasShadow: boolean;
  hasGlow: boolean;
}

export interface MockupLayer {
  id: number;
  type: 'mockup';
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  zIndex: number;
  transform: LayerTransform;
  template: string;
  style: MockupStyle;
  placeholderType: string;
}

export interface DecoratorLayer {
  id: number;
  type: 'decorator';
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  zIndex: number;
  transform: LayerTransform;
  decoratorType: string;
  content: string;
  variant: string;
  size: string;
  decoratorStyle: DecoratorStyle;
}

export interface BaseLayer {
  id: number;
  type?: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  zIndex: number;
  transform: LayerTransform;
}

export type SingleImageLayer = MockupLayer | DecoratorLayer | BaseLayer;

export interface BackgroundGradient {
  type: 'linear' | 'radial';
  from: string;
  to: string;
  angle?: number;
}

export interface SingleImageBackground {
  type: 'solid' | 'gradient';
  color?: string;
  gradient?: BackgroundGradient;
}

export interface SingleImage {
  id: number;
  name: string;
  subtitle: string;
  canvasSize: string;
  canvasWidth: number;
  canvasHeight: number;
  background: SingleImageBackground;
  backgroundGradient?: string;
  patternLayer?: PatternLayer;
  layers: SingleImageLayer[];
  createdAt: string;
  updatedAt: string;
}

export interface SingleImageState {
  singleImages: SingleImage[];
  selectedImageId: number | null;
  selectedLayerId: number | null;
}

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
  SET_BACKGROUND_GRADIENT: 'SET_BACKGROUND_GRADIENT',
  ADD_PATTERN: 'ADD_PATTERN',
  UPDATE_PATTERN: 'UPDATE_PATTERN',
  REMOVE_PATTERN: 'REMOVE_PATTERN',
} as const;

type SingleImageActionType = typeof SINGLEIMAGE_ACTIONS[keyof typeof SINGLEIMAGE_ACTIONS];

export interface SingleImageAction {
  type: SingleImageActionType;
  singleImages?: SingleImage[];
  imageId?: number;
  layerId?: number;
  layerType?: 'mockup' | 'decorator' | 'text';
  template?: string;
  decoratorType?: string;
  updates?: Partial<SingleImageLayer> | Partial<PatternLayer>;
  oldIndex?: number;
  newIndex?: number;
  background?: SingleImageBackground;
  canvasSize?: string;
  width?: number;
  height?: number;
  name?: string;
  gradient?: string;
  patternId?: string;
}

// Initial state
function createInitialState(singleImages: SingleImage[]): SingleImageState {
  return {
    singleImages,
    selectedImageId: null,
    selectedLayerId: null,
  };
}

// Helper to create new layers
function createNewLayer(
  type: 'mockup' | 'decorator' | 'text',
  template?: string,
  decoratorType?: string,
  existingCount: number = 0
): SingleImageLayer {
  const baseLayer: BaseLayer = {
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
    } as MockupLayer;
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
    } as DecoratorLayer;
  }

  return baseLayer;
}

// Reducer
function singleImageReducer(state: SingleImageState, action: SingleImageAction): SingleImageState {
  switch (action.type) {
    case SINGLEIMAGE_ACTIONS.SET_IMAGES:
      return { ...state, singleImages: action.singleImages || [] };

    case SINGLEIMAGE_ACTIONS.SELECT_IMAGE: {
      const { imageId } = action;
      if (imageId === state.selectedImageId) {
        return { ...state, selectedImageId: null, selectedLayerId: null };
      }
      return { ...state, selectedImageId: imageId ?? null, selectedLayerId: null };
    }

    case SINGLEIMAGE_ACTIONS.SET_ACTIVE_LAYER:
      return { ...state, selectedLayerId: action.layerId ?? null };

    case SINGLEIMAGE_ACTIONS.CLEAR_SELECTION:
      return { ...state, selectedImageId: null, selectedLayerId: null };

    case SINGLEIMAGE_ACTIONS.UPDATE_LAYER:
      return {
        ...state,
        singleImages: state.singleImages.map((img) => {
          if (img.id !== action.imageId) return img;
          return {
            ...img,
            layers: img.layers.map((layer) =>
              layer.id === action.layerId ? { ...layer, ...action.updates } : layer
            ) as SingleImageLayer[],
            updatedAt: new Date().toISOString().split('T')[0],
          };
        }),
      };

    case SINGLEIMAGE_ACTIONS.ADD_LAYER: {
      const { imageId, layerType, template, decoratorType } = action;
      const targetImage = state.singleImages.find((i) => i.id === imageId);
      const newLayer = createNewLayer(
        layerType || 'text',
        template,
        decoratorType,
        targetImage?.layers.length || 0
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
          const [moved] = layers.splice(action.oldIndex ?? 0, 1);
          layers.splice(action.newIndex ?? 0, 0, moved);
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
            ? {
                ...img,
                background: action.background || img.background,
                updatedAt: new Date().toISOString().split('T')[0],
              }
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
                canvasSize: action.canvasSize || img.canvasSize,
                canvasWidth: action.width ?? img.canvasWidth,
                canvasHeight: action.height ?? img.canvasHeight,
                updatedAt: new Date().toISOString().split('T')[0],
              }
            : img
        ),
      };

    case SINGLEIMAGE_ACTIONS.ADD_IMAGE: {
      const newImage: SingleImage = {
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
      const newPatternLayer = createPatternLayer(patternId || '');
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
            patternLayer: { ...img.patternLayer, ...updates } as PatternLayer,
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
          const { patternLayer: _patternLayer, ...rest } = img;
          return { ...rest, updatedAt: new Date().toISOString().split('T')[0] };
        }),
      };
    }

    default:
      return state;
  }
}

// Load from localStorage
function loadFromStorage(initialData: SingleImage[]): SingleImage[] {
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

// ===== Hook Return Type =====
export interface UseSingleImagesReturn {
  singleImages: SingleImage[];
  selectedImageId: number | null;
  selectedLayerId: number | null;
  selectedImage: SingleImage | undefined;
  selectedLayer: SingleImageLayer | undefined;
  dispatch: Dispatch<SingleImageAction>;
  clearSelection: () => void;
  handleSelectImage: (imageId: number, closeAllDropdowns?: () => void) => void;
  handleSelectLayer: (layerId: number) => void;
  handleUpdateLayer: (imageId: number, layerId: number, updates: Partial<SingleImageLayer>) => void;
  handleAddLayer: (imageId: number, layerType: 'mockup' | 'decorator' | 'text', template?: string, decoratorType?: string) => void;
  handleRemoveLayer: (imageId: number, layerId: number) => void;
  handleReorderLayers: (imageId: number, oldIndex: number, newIndex: number) => void;
  handleUpdateBackground: (imageId: number, background: SingleImageBackground) => void;
  handleUpdateCanvasSize: (imageId: number, canvasSize: string, width: number, height: number) => void;
  handleAddImage: (name?: string) => void;
  handleRemoveImage: (imageId: number) => void;
  handleSetBackgroundGradient: (imageId: number, gradient: string) => void;
  handleAddPattern: (imageId: number, patternId: string) => void;
  handleUpdatePattern: (imageId: number, updates: Partial<PatternLayer>) => void;
  handleRemovePattern: (imageId: number) => void;
}

export default function useSingleImages(initialData: SingleImage[]): UseSingleImagesReturn {
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
  const clearSelection = useCallback(() => dispatch({ type: SINGLEIMAGE_ACTIONS.CLEAR_SELECTION }), []);

  const handleSelectImage = useCallback((imageId: number, closeAllDropdowns?: () => void) => {
    if (closeAllDropdowns) closeAllDropdowns();
    dispatch({ type: SINGLEIMAGE_ACTIONS.SELECT_IMAGE, imageId });
  }, []);

  const handleSelectLayer = useCallback(
    (layerId: number) => dispatch({ type: SINGLEIMAGE_ACTIONS.SET_ACTIVE_LAYER, layerId }),
    []
  );

  const handleUpdateLayer = useCallback(
    (imageId: number, layerId: number, updates: Partial<SingleImageLayer>) =>
      dispatch({ type: SINGLEIMAGE_ACTIONS.UPDATE_LAYER, imageId, layerId, updates }),
    []
  );

  const handleAddLayer = useCallback(
    (imageId: number, layerType: 'mockup' | 'decorator' | 'text', template?: string, decoratorType?: string) =>
      dispatch({ type: SINGLEIMAGE_ACTIONS.ADD_LAYER, imageId, layerType, template, decoratorType }),
    []
  );

  const handleRemoveLayer = useCallback(
    (imageId: number, layerId: number) =>
      dispatch({ type: SINGLEIMAGE_ACTIONS.REMOVE_LAYER, imageId, layerId }),
    []
  );

  const handleReorderLayers = useCallback(
    (imageId: number, oldIndex: number, newIndex: number) =>
      dispatch({ type: SINGLEIMAGE_ACTIONS.REORDER_LAYERS, imageId, oldIndex, newIndex }),
    []
  );

  const handleUpdateBackground = useCallback(
    (imageId: number, background: SingleImageBackground) =>
      dispatch({ type: SINGLEIMAGE_ACTIONS.UPDATE_BACKGROUND, imageId, background }),
    []
  );

  const handleUpdateCanvasSize = useCallback(
    (imageId: number, canvasSize: string, width: number, height: number) =>
      dispatch({ type: SINGLEIMAGE_ACTIONS.UPDATE_CANVAS_SIZE, imageId, canvasSize, width, height }),
    []
  );

  const handleAddImage = useCallback(
    (name?: string) => dispatch({ type: SINGLEIMAGE_ACTIONS.ADD_IMAGE, name }),
    []
  );

  const handleRemoveImage = useCallback(
    (imageId: number) => dispatch({ type: SINGLEIMAGE_ACTIONS.REMOVE_IMAGE, imageId }),
    []
  );

  const handleSetBackgroundGradient = useCallback(
    (imageId: number, gradient: string) =>
      dispatch({ type: SINGLEIMAGE_ACTIONS.SET_BACKGROUND_GRADIENT, imageId, gradient }),
    []
  );

  const handleAddPattern = useCallback(
    (imageId: number, patternId: string) =>
      dispatch({ type: SINGLEIMAGE_ACTIONS.ADD_PATTERN, imageId, patternId }),
    []
  );

  const handleUpdatePattern = useCallback(
    (imageId: number, updates: Partial<PatternLayer>) =>
      dispatch({ type: SINGLEIMAGE_ACTIONS.UPDATE_PATTERN, imageId, updates }),
    []
  );

  const handleRemovePattern = useCallback(
    (imageId: number) => dispatch({ type: SINGLEIMAGE_ACTIONS.REMOVE_PATTERN, imageId }),
    []
  );

  return {
    singleImages: state.singleImages,
    selectedImageId: state.selectedImageId,
    selectedLayerId: state.selectedLayerId,
    selectedImage,
    selectedLayer,
    dispatch,
    clearSelection,
    handleSelectImage,
    handleSelectLayer,
    handleUpdateLayer,
    handleAddLayer,
    handleRemoveLayer,
    handleReorderLayers,
    handleUpdateBackground,
    handleUpdateCanvasSize,
    handleAddImage,
    handleRemoveImage,
    handleSetBackgroundGradient,
    handleAddPattern,
    handleUpdatePattern,
    handleRemovePattern,
  };
}

