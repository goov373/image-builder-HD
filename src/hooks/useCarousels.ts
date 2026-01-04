import { useReducer, useEffect, useState, useCallback, Dispatch } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { STORAGE_KEYS } from '../config';
import { createPatternLayer } from '../data';
import { undoable, UNDO, REDO, canUndo, canRedo, UndoableState } from '../utils/undoable';
import { logger } from '../utils';
import type { PatternLayer, ImageLayer, BackgroundOverride, ContentVariant } from '../types';

/**
 * useCarousels Hook
 *
 * Manages carousel state for the design tool including:
 * - Multiple carousel rows with frames
 * - Frame selection and editing
 * - Text content and formatting per variant
 * - Background layers (fill, pattern, image)
 * - Product images and icons
 * - Undo/redo history
 * - LocalStorage persistence
 *
 * @example
 * ```tsx
 * import useCarousels from './hooks/useCarousels';
 * import { INITIAL_CAROUSELS } from './data';
 *
 * function CarouselEditor() {
 *   const {
 *     carousels,
 *     selectedFrame,
 *     handleUpdateText,
 *     handleAddFrame,
 *     canUndo,
 *     handleUndo,
 *   } = useCarousels(INITIAL_CAROUSELS);
 *
 *   return (
 *     <div>
 *       {carousels.map(carousel => (
 *         <CarouselRow key={carousel.id} carousel={carousel} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @module hooks/useCarousels
 */

const STORAGE_KEY = STORAGE_KEYS.CAROUSELS;

// ===== Types =====

export interface IconLayer {
  id: string;
  iconId: string;
  path: string;
  name: string;
  scale: number;
  color: string;
  borderColor: string | null;
  backgroundColor: string | null;
}

export interface ProductImageLayer {
  id: string;
  src: string;
  position: 'top' | 'bottom';
  scale: number;
  borderRadius: number;
  offsetX: number;
  offsetY: number;
}

export interface ProgressIndicator {
  type: 'dots' | 'numbers' | 'bar';
  color: string;
  isHidden: boolean;
}

export type BackgroundLayerType = 'fill' | 'pattern' | 'image';

export interface CarouselFrame {
  id: number;
  variants: ContentVariant[];
  currentVariant: number;
  currentLayout: number;
  layoutVariant: number;
  style: string;
  hideProgress?: boolean;
  backgroundOverride?: string | BackgroundOverride;
  backgroundLayerOrder?: BackgroundLayerType[];
  patternLayer?: PatternLayer;
  imageLayer?: ImageLayer;
  iconLayer?: IconLayer;
  productImageLayer?: ProductImageLayer;
  progressIndicator?: ProgressIndicator;
  fillOpacity?: number;
  fillRotation?: number;
}

export interface Carousel {
  id: number;
  name: string;
  subtitle: string;
  frameSize: string;
  frames: CarouselFrame[];
}

export interface CarouselState {
  carousels: Carousel[];
  selectedCarouselId: number | null;
  selectedFrameId: number | null;
  activeTextField: string | null;
}

// Action types
export const CAROUSEL_ACTIONS = {
  SET_CAROUSELS: 'SET_CAROUSELS',
  SELECT_CAROUSEL: 'SELECT_CAROUSEL',
  SELECT_FRAME: 'SELECT_FRAME',
  SET_ACTIVE_TEXT_FIELD: 'SET_ACTIVE_TEXT_FIELD',
  CLEAR_SELECTION: 'CLEAR_SELECTION',
  DESELECT_FRAME: 'DESELECT_FRAME',
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
  ADD_IMAGE_TO_FRAME: 'ADD_IMAGE_TO_FRAME',
  UPDATE_IMAGE_LAYER: 'UPDATE_IMAGE_LAYER',
  REMOVE_IMAGE_FROM_FRAME: 'REMOVE_IMAGE_FROM_FRAME',
  SYNC_LINKED_IMAGES: 'SYNC_LINKED_IMAGES',
  ADD_PATTERN_TO_FRAME: 'ADD_PATTERN_TO_FRAME',
  UPDATE_PATTERN_LAYER: 'UPDATE_PATTERN_LAYER',
  REMOVE_PATTERN_FROM_FRAME: 'REMOVE_PATTERN_FROM_FRAME',
  SET_ROW_STRETCHED_PATTERN: 'SET_ROW_STRETCHED_PATTERN',
  UPDATE_FILL_LAYER: 'UPDATE_FILL_LAYER',
  ADD_PRODUCT_IMAGE_TO_FRAME: 'ADD_PRODUCT_IMAGE_TO_FRAME',
  UPDATE_PRODUCT_IMAGE_LAYER: 'UPDATE_PRODUCT_IMAGE_LAYER',
  REMOVE_PRODUCT_IMAGE_FROM_FRAME: 'REMOVE_PRODUCT_IMAGE_FROM_FRAME',
  ADD_ICON_TO_FRAME: 'ADD_ICON_TO_FRAME',
  UPDATE_ICON_LAYER: 'UPDATE_ICON_LAYER',
  REMOVE_ICON_FROM_FRAME: 'REMOVE_ICON_FROM_FRAME',
  UPDATE_PROGRESS_INDICATOR: 'UPDATE_PROGRESS_INDICATOR',
  REORDER_BACKGROUND_LAYERS: 'REORDER_BACKGROUND_LAYERS',
  REORDER_CAROUSELS: 'REORDER_CAROUSELS',
} as const;

type CarouselActionType = typeof CAROUSEL_ACTIONS[keyof typeof CAROUSEL_ACTIONS];

export interface CarouselAction {
  type: CarouselActionType | typeof UNDO | typeof REDO;
  carousels?: Carousel[];
  carouselId?: number | null;
  frameId?: number;
  field?: string;
  value?: string;
  key?: string;
  variantIndex?: number;
  layoutIndex?: number;
  layoutVariant?: number;
  position?: number | null;
  oldIndex?: number;
  newIndex?: number;
  afterIndex?: number;
  newSize?: string;
  background?: string | BackgroundOverride;
  startIdx?: number;
  endIdx?: number;
  patternId?: string;
  updates?: Partial<PatternLayer> | Partial<ImageLayer> | Partial<IconLayer> | Partial<ProductImageLayer> | Partial<ProgressIndicator> | { fillOpacity?: number; fillRotation?: number };
  imageSrc?: string;
  linkedGroupId?: string;
  iconId?: string;
  iconPath?: string;
  iconName?: string;
  originalCarousel?: Carousel;
  newOrder?: BackgroundLayerType[];
}

// Actions that should NOT create history entries
const NON_UNDOABLE_ACTIONS = [
  'SELECT_CAROUSEL',
  'SELECT_FRAME',
  'SET_ACTIVE_TEXT_FIELD',
  'CLEAR_SELECTION',
  'DESELECT_FRAME',
  'SET_CAROUSELS',
];

const shouldTrackAction = (action: CarouselAction): boolean => {
  return !NON_UNDOABLE_ACTIONS.includes(action.type as string);
};

// Initial state shape
function createInitialState(carousels: Carousel[]): CarouselState {
  return {
    carousels,
    selectedCarouselId: null,
    selectedFrameId: null,
    activeTextField: null,
  };
}

// Reducer function
function carouselReducer(state: CarouselState, action: CarouselAction): CarouselState {
  switch (action.type) {
    case CAROUSEL_ACTIONS.SET_CAROUSELS:
      return { ...state, carousels: action.carousels || [] };

    case CAROUSEL_ACTIONS.SELECT_CAROUSEL: {
      const { carouselId } = action;
      const isOpening = carouselId !== null && carouselId !== state.selectedCarouselId;
      const isClosing =
        carouselId === null || (carouselId === state.selectedCarouselId && state.selectedCarouselId !== null);

      if (isOpening) {
        return { ...state, selectedCarouselId: carouselId ?? null, selectedFrameId: null, activeTextField: null };
      } else if (isClosing && carouselId === state.selectedCarouselId) {
        return { ...state, selectedCarouselId: null, selectedFrameId: null, activeTextField: null };
      } else if (carouselId === null) {
        return { ...state, selectedCarouselId: null, selectedFrameId: null, activeTextField: null };
      } else {
        return { ...state, selectedCarouselId: carouselId ?? null, selectedFrameId: null, activeTextField: null };
      }
    }

    case CAROUSEL_ACTIONS.SELECT_FRAME: {
      const { carouselId, frameId } = action;
      const newSelectedCarouselId = carouselId !== state.selectedCarouselId ? (carouselId ?? null) : state.selectedCarouselId;
      const newSelectedFrameId =
        state.selectedFrameId === frameId && carouselId === state.selectedCarouselId ? null : (frameId ?? null);
      return {
        ...state,
        selectedCarouselId: newSelectedCarouselId,
        selectedFrameId: newSelectedFrameId,
        activeTextField: null,
      };
    }

    case CAROUSEL_ACTIONS.SET_ACTIVE_TEXT_FIELD:
      return { ...state, activeTextField: action.field ?? null };

    case CAROUSEL_ACTIONS.CLEAR_SELECTION:
      return { ...state, selectedCarouselId: null, selectedFrameId: null, activeTextField: null };

    case CAROUSEL_ACTIONS.DESELECT_FRAME:
      return { ...state, selectedFrameId: null, activeTextField: null };

    case CAROUSEL_ACTIONS.SET_VARIANT:
      return {
        ...state,
        carousels: state.carousels.map((carousel) => {
          if (carousel.id !== action.carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map((frame) =>
              frame.id !== action.frameId ? frame : { ...frame, currentVariant: action.variantIndex ?? 0 }
            ),
          };
        }),
      };

    case CAROUSEL_ACTIONS.SET_LAYOUT:
      return {
        ...state,
        carousels: state.carousels.map((carousel) => {
          if (carousel.id !== action.carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map((frame) =>
              frame.id !== action.frameId ? frame : { ...frame, currentLayout: action.layoutIndex ?? 0, layoutVariant: 0 }
            ),
          };
        }),
      };

    case CAROUSEL_ACTIONS.SHUFFLE_LAYOUT_VARIANT:
      return {
        ...state,
        carousels: state.carousels.map((carousel) => {
          if (carousel.id !== action.carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map((frame) =>
              frame.id !== action.frameId ? frame : { ...frame, layoutVariant: ((frame.layoutVariant || 0) + 1) % 3 }
            ),
          };
        }),
      };

    case CAROUSEL_ACTIONS.UPDATE_TEXT:
      return {
        ...state,
        carousels: state.carousels.map((carousel) => {
          if (carousel.id !== action.carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map((frame) => {
              if (frame.id !== action.frameId) return frame;
              const updatedVariants = [...frame.variants];
              updatedVariants[frame.currentVariant] = {
                ...updatedVariants[frame.currentVariant],
                [action.field || '']: action.value,
              };
              return { ...frame, variants: updatedVariants };
            }),
          };
        }),
      };

    case CAROUSEL_ACTIONS.UPDATE_FORMATTING:
      return {
        ...state,
        carousels: state.carousels.map((carousel) => {
          if (carousel.id !== action.carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map((frame) => {
              if (frame.id !== action.frameId) return frame;
              const updatedVariants = [...frame.variants];
              const currentVariant = updatedVariants[frame.currentVariant];
              const currentFormatting = currentVariant.formatting || {};
              const fieldFormatting = currentFormatting[action.field || ''] || {};
              updatedVariants[frame.currentVariant] = {
                ...currentVariant,
                formatting: {
                  ...currentFormatting,
                  [action.field || '']: { ...fieldFormatting, [action.key || '']: action.value },
                },
              };
              return { ...frame, variants: updatedVariants };
            }),
          };
        }),
      };

    case CAROUSEL_ACTIONS.ADD_FRAME: {
      return {
        ...state,
        carousels: state.carousels.map((carousel) => {
          if (carousel.id !== action.carouselId) return carousel;
          const insertIndex = action.position !== null && action.position !== undefined ? action.position : carousel.frames.length;
          const adjacentFrame = carousel.frames[Math.max(0, insertIndex - 1)] || carousel.frames[0];
          const newFrame: CarouselFrame = {
            id: Date.now(),
            variants: [
              { headline: 'Add your headline', body: 'Add your supporting copy here.', formatting: {} },
              { headline: 'Alternative headline', body: 'Alternative supporting copy.', formatting: {} },
              { headline: 'Third option', body: 'Third copy variation.', formatting: {} },
            ],
            currentVariant: 0,
            currentLayout: 0,
            layoutVariant: 0,
            style: adjacentFrame?.style || 'dark-single-pin',
            backgroundOverride: '#6466e9',
            backgroundLayerOrder: ['fill', 'pattern', 'image'],
          };
          const newFrames = [...carousel.frames];
          newFrames.splice(insertIndex, 0, newFrame);
          const renumberedFrames = newFrames.map((f, idx) => ({ ...f, id: idx + 1 }));
          return { ...carousel, frames: renumberedFrames };
        }),
      };
    }

    case CAROUSEL_ACTIONS.REMOVE_FRAME: {
      const shouldClearFrameSelection =
        state.selectedCarouselId === action.carouselId && state.selectedFrameId === action.frameId;
      return {
        ...state,
        selectedFrameId: shouldClearFrameSelection ? null : state.selectedFrameId,
        carousels: state.carousels.map((carousel) => {
          if (carousel.id !== action.carouselId) return carousel;
          if (carousel.frames.length <= 1) return carousel;
          const newFrames = carousel.frames
            .filter((f) => f.id !== action.frameId)
            .map((f, idx) => ({ ...f, id: idx + 1 }));
          return { ...carousel, frames: newFrames };
        }),
      };
    }

    case CAROUSEL_ACTIONS.CHANGE_FRAME_SIZE:
      return {
        ...state,
        carousels: state.carousels.map((carousel) =>
          carousel.id === action.carouselId ? { ...carousel, frameSize: action.newSize || carousel.frameSize } : carousel
        ),
      };

    case CAROUSEL_ACTIONS.REORDER_FRAMES:
      return {
        ...state,
        carousels: state.carousels.map((carousel) => {
          if (carousel.id !== action.carouselId) return carousel;
          const newFrames = arrayMove(carousel.frames, action.oldIndex ?? 0, action.newIndex ?? 0).map((f, idx) => ({
            ...f,
            id: idx + 1,
          }));
          return { ...carousel, frames: newFrames };
        }),
      };

    case CAROUSEL_ACTIONS.ADD_ROW: {
      const newId = Date.now();
      const newCarousel: Carousel = {
        id: newId,
        name: 'New Row',
        subtitle: 'Click to edit',
        frameSize: 'portrait',
        frames: [
          {
            id: 1,
            variants: [
              { headline: 'Your headline here', body: 'Your body text here.', formatting: {} },
              { headline: 'Alternative headline', body: 'Alternative body text.', formatting: {} },
              { headline: 'Third variation', body: 'Third body option.', formatting: {} },
            ],
            currentVariant: 0,
            currentLayout: 0,
            layoutVariant: 0,
            style: 'dark-single-pin',
          },
        ],
      };
      const newCarousels = [...state.carousels];
      newCarousels.splice((action.afterIndex ?? 0) + 1, 0, newCarousel);
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
        carousels: state.carousels.filter((c) => c.id !== action.carouselId),
      };
    }

    case CAROUSEL_ACTIONS.RESET_CAROUSEL: {
      const { carouselId, originalCarousel } = action;
      if (!originalCarousel) return state;
      return {
        ...state,
        carousels: state.carousels.map((c) => (c.id === carouselId ? { ...originalCarousel } : c)),
      };
    }

    case CAROUSEL_ACTIONS.SET_FRAME_BACKGROUND: {
      const { carouselId, frameId, background } = action;
      return {
        ...state,
        carousels: state.carousels.map((carousel) => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map((frame) =>
              frame.id === frameId ? { ...frame, backgroundOverride: background } : frame
            ),
          };
        }),
      };
    }

    case CAROUSEL_ACTIONS.SET_ROW_STRETCHED_BACKGROUND: {
      const { carouselId, background, startIdx = 0, endIdx } = action;
      return {
        ...state,
        carousels: state.carousels.map((carousel) => {
          if (carousel.id !== carouselId) return carousel;
          const numFrames = carousel.frames.length;
          if (numFrames === 0) return carousel;

          const actualEndIdx = endIdx !== undefined ? endIdx : numFrames - 1;
          const selectedCount = actualEndIdx - startIdx + 1;

          return {
            ...carousel,
            frames: carousel.frames.map((frame, index) => {
              if (index < startIdx || index > actualEndIdx) return frame;
              const relativeIndex = index - startIdx;
              const positionPercent = selectedCount > 1 ? (relativeIndex / (selectedCount - 1)) * 100 : 0;

              return {
                ...frame,
                backgroundOverride: {
                  gradient: background as string,
                  size: `${selectedCount * 100}% 100%`,
                  position: `${positionPercent}% 0%`,
                  isStretched: true,
                },
              };
            }),
          };
        }),
      };
    }

    case CAROUSEL_ACTIONS.ADD_IMAGE_TO_FRAME: {
      const { carouselId, frameId, imageSrc } = action;
      const newImageLayer: ImageLayer = {
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        src: imageSrc || '',
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        rotation: 0,
        zIndex: 0,
        fit: 'cover',
      };

      return {
        ...state,
        carousels: state.carousels.map((carousel) => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map((frame) =>
              frame.id === frameId ? { ...frame, imageLayer: newImageLayer } : frame
            ),
          };
        }),
      };
    }

    case CAROUSEL_ACTIONS.UPDATE_IMAGE_LAYER: {
      const { carouselId, frameId, updates } = action;
      return {
        ...state,
        carousels: state.carousels.map((carousel) => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map((frame) => {
              if (frame.id !== frameId || !frame.imageLayer) return frame;
              return { ...frame, imageLayer: { ...frame.imageLayer, ...updates } as ImageLayer };
            }),
          };
        }),
      };
    }

    case CAROUSEL_ACTIONS.REMOVE_IMAGE_FROM_FRAME: {
      const { carouselId, frameId } = action;
      return {
        ...state,
        carousels: state.carousels.map((carousel) => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map((frame) => {
              if (frame.id !== frameId) return frame;
              const { imageLayer: _imageLayer, ...rest } = frame;
              return rest;
            }),
          };
        }),
      };
    }

    case CAROUSEL_ACTIONS.SYNC_LINKED_IMAGES: {
      const { linkedGroupId, updates } = action;
      if (!linkedGroupId) return state;

      return {
        ...state,
        carousels: state.carousels.map((carousel) => ({
          ...carousel,
          frames: carousel.frames.map((frame) => {
            if (!frame.imageLayer || (frame.imageLayer as ImageLayer & { linkedGroupId?: string }).linkedGroupId !== linkedGroupId) return frame;
            return { ...frame, imageLayer: { ...frame.imageLayer, ...updates } as ImageLayer };
          }),
        })),
      };
    }

    case CAROUSEL_ACTIONS.ADD_PATTERN_TO_FRAME: {
      const { carouselId, frameId, patternId } = action;
      const newPatternLayer = createPatternLayer(patternId || '');
      if (!newPatternLayer) return state;

      return {
        ...state,
        carousels: state.carousels.map((carousel) => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map((frame) =>
              frame.id === frameId ? { ...frame, patternLayer: newPatternLayer } : frame
            ),
          };
        }),
      };
    }

    case CAROUSEL_ACTIONS.UPDATE_PATTERN_LAYER: {
      const { carouselId, frameId, updates } = action;
      return {
        ...state,
        carousels: state.carousels.map((carousel) => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map((frame) => {
              if (frame.id !== frameId || !frame.patternLayer) return frame;
              return { ...frame, patternLayer: { ...frame.patternLayer, ...updates } as PatternLayer };
            }),
          };
        }),
      };
    }

    case CAROUSEL_ACTIONS.REMOVE_PATTERN_FROM_FRAME: {
      const { carouselId, frameId } = action;
      return {
        ...state,
        carousels: state.carousels.map((carousel) => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map((frame) => {
              if (frame.id !== frameId) return frame;
              const { patternLayer: _patternLayer, ...rest } = frame;
              return rest;
            }),
          };
        }),
      };
    }

    case CAROUSEL_ACTIONS.SET_ROW_STRETCHED_PATTERN: {
      const { carouselId, patternId, startIdx = 0, endIdx } = action;
      const basePatternLayer = createPatternLayer(patternId || '');
      if (!basePatternLayer) return state;

      return {
        ...state,
        carousels: state.carousels.map((carousel) => {
          if (carousel.id !== carouselId) return carousel;
          const numFrames = carousel.frames.length;
          if (numFrames === 0) return carousel;

          const actualEndIdx = endIdx !== undefined ? endIdx : numFrames - 1;
          const selectedCount = actualEndIdx - startIdx + 1;

          return {
            ...carousel,
            frames: carousel.frames.map((frame, index) => {
              if (index < startIdx || index > actualEndIdx) return frame;
              const relativeIndex = index - startIdx;

              return {
                ...frame,
                patternLayer: {
                  ...basePatternLayer,
                  isStretched: true,
                  stretchSize: `${selectedCount * 100}% 100%`,
                  stretchPosition: `${-relativeIndex * 100}% 0%`,
                },
              };
            }),
          };
        }),
      };
    }

    case CAROUSEL_ACTIONS.UPDATE_FILL_LAYER: {
      const { carouselId, frameId, updates } = action;
      const fillUpdates = updates as { fillOpacity?: number; fillRotation?: number };
      return {
        ...state,
        carousels: state.carousels.map((carousel) => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map((frame) => {
              if (frame.id !== frameId) return frame;
              return {
                ...frame,
                fillOpacity: fillUpdates.fillOpacity !== undefined ? fillUpdates.fillOpacity : frame.fillOpacity,
                fillRotation: fillUpdates.fillRotation !== undefined ? fillUpdates.fillRotation : frame.fillRotation,
              };
            }),
          };
        }),
      };
    }

    case CAROUSEL_ACTIONS.ADD_PRODUCT_IMAGE_TO_FRAME: {
      const { carouselId, frameId, imageSrc, layoutIndex, layoutVariant } = action;

      let position: 'top' | 'bottom' = 'top';
      if (layoutIndex === 0 && layoutVariant === 0) {
        position = 'top';
      } else if (layoutIndex === 0 && layoutVariant === 1) {
        position = 'bottom';
      } else if (layoutIndex === 1 && layoutVariant === 2) {
        position = 'bottom';
      }

      const newProductImageLayer: ProductImageLayer = {
        id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        src: imageSrc || '',
        position,
        scale: 1,
        borderRadius: 8,
        offsetX: 0,
        offsetY: 0,
      };

      return {
        ...state,
        carousels: state.carousels.map((carousel) => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map((frame) =>
              frame.id === frameId ? { ...frame, productImageLayer: newProductImageLayer } : frame
            ),
          };
        }),
      };
    }

    case CAROUSEL_ACTIONS.UPDATE_PRODUCT_IMAGE_LAYER: {
      const { carouselId, frameId, updates } = action;
      return {
        ...state,
        carousels: state.carousels.map((carousel) => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map((frame) => {
              if (frame.id !== frameId || !frame.productImageLayer) return frame;
              return { ...frame, productImageLayer: { ...frame.productImageLayer, ...updates } as ProductImageLayer };
            }),
          };
        }),
      };
    }

    case CAROUSEL_ACTIONS.REMOVE_PRODUCT_IMAGE_FROM_FRAME: {
      const { carouselId, frameId } = action;
      return {
        ...state,
        carousels: state.carousels.map((carousel) => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map((frame) => {
              if (frame.id !== frameId) return frame;
              const { productImageLayer: _productImageLayer, ...rest } = frame;
              return rest;
            }),
          };
        }),
      };
    }

    case CAROUSEL_ACTIONS.ADD_ICON_TO_FRAME: {
      const { carouselId, frameId, iconId, iconPath, iconName } = action;

      const newIconLayer: IconLayer = {
        id: `icon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        iconId: iconId || '',
        path: iconPath || '',
        name: iconName || '',
        scale: 1,
        color: '#ffffff',
        borderColor: null,
        backgroundColor: null,
      };

      return {
        ...state,
        carousels: state.carousels.map((carousel) => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map((frame) =>
              frame.id === frameId ? { ...frame, iconLayer: newIconLayer } : frame
            ),
          };
        }),
      };
    }

    case CAROUSEL_ACTIONS.UPDATE_ICON_LAYER: {
      const { carouselId, frameId, updates } = action;
      return {
        ...state,
        carousels: state.carousels.map((carousel) => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map((frame) => {
              if (frame.id !== frameId || !frame.iconLayer) return frame;
              return { ...frame, iconLayer: { ...frame.iconLayer, ...updates } as IconLayer };
            }),
          };
        }),
      };
    }

    case CAROUSEL_ACTIONS.REMOVE_ICON_FROM_FRAME: {
      const { carouselId, frameId } = action;
      return {
        ...state,
        carousels: state.carousels.map((carousel) => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map((frame) => {
              if (frame.id !== frameId) return frame;
              const { iconLayer: _iconLayer, ...rest } = frame;
              return rest;
            }),
          };
        }),
      };
    }

    case CAROUSEL_ACTIONS.UPDATE_PROGRESS_INDICATOR: {
      const { carouselId, frameId, updates } = action;
      return {
        ...state,
        carousels: state.carousels.map((carousel) => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map((frame) => {
              if (frame.id !== frameId) return frame;
              return {
                ...frame,
                progressIndicator: {
                  type: 'dots',
                  color: '#ffffff',
                  isHidden: false,
                  ...(frame.progressIndicator || {}),
                  ...updates,
                } as ProgressIndicator,
              };
            }),
          };
        }),
      };
    }

    case CAROUSEL_ACTIONS.REORDER_BACKGROUND_LAYERS: {
      const { carouselId, frameId, newOrder } = action;
      return {
        ...state,
        carousels: state.carousels.map((carousel) => {
          if (carousel.id !== carouselId) return carousel;
          return {
            ...carousel,
            frames: carousel.frames.map((frame) =>
              frame.id === frameId ? { ...frame, backgroundLayerOrder: newOrder } : frame
            ),
          };
        }),
      };
    }

    case CAROUSEL_ACTIONS.REORDER_CAROUSELS: {
      const { oldIndex, newIndex } = action;
      if (oldIndex === undefined || newIndex === undefined) return state;
      const newCarousels = arrayMove(state.carousels, oldIndex, newIndex);
      console.log('Reorder carousels reducer:', { oldIndex, newIndex, oldIds: state.carousels.map(c => c.id), newIds: newCarousels.map(c => c.id) });
      return {
        ...state,
        carousels: newCarousels,
      };
    }

    default:
      return state;
  }
}

// Wrap the carousel reducer with undo/redo support
const undoableCarouselReducer = undoable(carouselReducer, {
  filter: shouldTrackAction,
  limit: 50,
});

// Load from localStorage
function loadFromStorage(initialData: Carousel[]): Carousel[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const migrated = parsed.map((carousel: Carousel) => ({
          ...carousel,
          frames:
            carousel.frames?.map((frame: CarouselFrame) => ({
              ...frame,
              backgroundOverride: frame.backgroundOverride || '#6466e9',
              backgroundLayerOrder: frame.backgroundLayerOrder || ['fill', 'pattern', 'image'],
            })) || [],
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        logger.log('Migration: Cleared all background overrides from frames');
        return migrated;
      }
    }
  } catch (e) {
    logger.warn('Failed to load carousels from localStorage:', e);
  }
  return initialData;
}

// ===== Hook Return Type =====
export interface UseCarouselsReturn {
  carousels: Carousel[];
  selectedCarouselId: number | null;
  selectedFrameId: number | null;
  activeTextField: string | null;
  selectedCarousel: Carousel | undefined;
  selectedFrame: CarouselFrame | undefined;
  canUndo: boolean;
  canRedo: boolean;
  historyLength: number;
  futureLength: number;
  dispatch: Dispatch<CarouselAction>;
  clearSelection: () => void;
  deselectFrame: () => void;
  handleUndo: () => void;
  handleRedo: () => void;
  setActiveTextField: (field: string | null) => void;
  handleSelectFrame: (carouselId: number, frameId: number, closeAllDropdowns?: () => void) => void;
  handleSelectCarousel: (carouselId: number | null, closeAllDropdowns?: () => void) => void;
  handleSetVariant: (carouselId: number, frameId: number, variantIndex: number) => void;
  handleSetLayout: (carouselId: number, frameId: number, layoutIndex: number) => void;
  handleShuffleLayoutVariant: (carouselId: number, frameId: number) => void;
  handleUpdateText: (carouselId: number, frameId: number, field: string, value: string) => void;
  handleUpdateFormatting: (carouselId: number, frameId: number, field: string, key: string, value: unknown) => void;
  handleAddFrame: (carouselId: number, position?: number | null) => void;
  handleChangeFrameSize: (carouselId: number, newSize: string) => void;
  handleRemoveFrame: (carouselId: number, frameId: number) => void;
  handleReorderFrames: (carouselId: number, oldIndex: number, newIndex: number) => void;
  handleAddRow: (afterIndex: number) => void;
  handleRemoveRow: (carouselId: number) => void;
  handleResetCarousel: (carouselId: number) => void;
  handleSetFrameBackground: (carouselId: number, frameId: number, background: string | BackgroundOverride) => void;
  handleSetRowStretchedBackground: (carouselId: number, background: string, startIdx?: number, endIdx?: number) => void;
  handleAddImageToFrame: (carouselId: number, frameId: number, imageSrc: string) => void;
  handleUpdateImageLayer: (carouselId: number, frameId: number, updates: Partial<ImageLayer>) => void;
  handleRemoveImageFromFrame: (carouselId: number, frameId: number) => void;
  handleSyncLinkedImages: (linkedGroupId: string, updates: Partial<ImageLayer>) => void;
  handleAddPatternToFrame: (carouselId: number, frameId: number, patternId: string) => void;
  handleUpdatePatternLayer: (carouselId: number, frameId: number, updates: Partial<PatternLayer>) => void;
  handleRemovePatternFromFrame: (carouselId: number, frameId: number) => void;
  handleSetRowStretchedPattern: (carouselId: number, patternId: string, startIdx?: number, endIdx?: number) => void;
  handleUpdateFillLayer: (carouselId: number, frameId: number, updates: { fillOpacity?: number; fillRotation?: number }) => void;
  handleAddProductImageToFrame: (carouselId: number, frameId: number, imageSrc: string, layoutIndex: number, layoutVariant: number) => void;
  handleUpdateProductImageLayer: (carouselId: number, frameId: number, updates: Partial<ProductImageLayer>) => void;
  handleRemoveProductImageFromFrame: (carouselId: number, frameId: number) => void;
  handleAddIconToFrame: (carouselId: number, frameId: number, iconId: string, iconPath: string, iconName: string) => void;
  handleUpdateIconLayer: (carouselId: number, frameId: number, updates: Partial<IconLayer>) => void;
  handleRemoveIconFromFrame: (carouselId: number, frameId: number) => void;
  handleUpdateProgressIndicator: (carouselId: number, frameId: number, updates: Partial<ProgressIndicator>) => void;
  handleReorderBackgroundLayers: (carouselId: number, frameId: number, newOrder: BackgroundLayerType[]) => void;
  handleReorderCarousels: (oldIndex: number, newIndex: number) => void;
}

export default function useCarousels(initialData: Carousel[]): UseCarouselsReturn {
  const [initialized, setInitialized] = useState(false);

  const [undoableState, dispatch] = useReducer(undoableCarouselReducer, {
    past: [],
    present: createInitialState(loadFromStorage(initialData)),
    future: [],
  });

  const state = undoableState.present;

  const selectedCarousel = state.carousels.find((c) => c.id === state.selectedCarouselId) || state.carousels[0];
  const selectedFrame = selectedCarousel?.frames?.find((f) => f.id === state.selectedFrameId);

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.carousels));
    } catch (e) {
      logger.warn('Failed to save carousels to localStorage:', e);
    }
  }, [state.carousels, initialized]);

  // Memoized actions
  const clearSelection = useCallback(() => dispatch({ type: CAROUSEL_ACTIONS.CLEAR_SELECTION }), []);
  const deselectFrame = useCallback(() => dispatch({ type: CAROUSEL_ACTIONS.DESELECT_FRAME }), []);
  const handleUndo = useCallback(() => dispatch({ type: UNDO }), []);
  const handleRedo = useCallback(() => dispatch({ type: REDO }), []);
  
  const setActiveTextField = useCallback(
    (field: string | null) => dispatch({ type: CAROUSEL_ACTIONS.SET_ACTIVE_TEXT_FIELD, field: field ?? undefined }),
    []
  );

  const handleSelectFrame = useCallback(
    (carouselId: number, frameId: number, closeAllDropdowns?: () => void) => {
      if (closeAllDropdowns) closeAllDropdowns();
      dispatch({ type: CAROUSEL_ACTIONS.SELECT_FRAME, carouselId, frameId });
    },
    []
  );

  const handleSelectCarousel = useCallback(
    (carouselId: number | null, closeAllDropdowns?: () => void) => {
      if (closeAllDropdowns) closeAllDropdowns();
      dispatch({ type: CAROUSEL_ACTIONS.SELECT_CAROUSEL, carouselId });
    },
    []
  );

  const handleSetVariant = useCallback(
    (carouselId: number, frameId: number, variantIndex: number) =>
      dispatch({ type: CAROUSEL_ACTIONS.SET_VARIANT, carouselId, frameId, variantIndex }),
    []
  );

  const handleSetLayout = useCallback(
    (carouselId: number, frameId: number, layoutIndex: number) =>
      dispatch({ type: CAROUSEL_ACTIONS.SET_LAYOUT, carouselId, frameId, layoutIndex }),
    []
  );

  const handleShuffleLayoutVariant = useCallback(
    (carouselId: number, frameId: number) =>
      dispatch({ type: CAROUSEL_ACTIONS.SHUFFLE_LAYOUT_VARIANT, carouselId, frameId }),
    []
  );

  const handleUpdateText = useCallback(
    (carouselId: number, frameId: number, field: string, value: string) =>
      dispatch({ type: CAROUSEL_ACTIONS.UPDATE_TEXT, carouselId, frameId, field, value }),
    []
  );

  const handleUpdateFormatting = useCallback(
    (carouselId: number, frameId: number, field: string, key: string, value: unknown) =>
      dispatch({ type: CAROUSEL_ACTIONS.UPDATE_FORMATTING, carouselId, frameId, field, key, value: value as string }),
    []
  );

  const handleAddFrame = useCallback(
    (carouselId: number, position: number | null = null) =>
      dispatch({ type: CAROUSEL_ACTIONS.ADD_FRAME, carouselId, position }),
    []
  );

  const handleChangeFrameSize = useCallback(
    (carouselId: number, newSize: string) =>
      dispatch({ type: CAROUSEL_ACTIONS.CHANGE_FRAME_SIZE, carouselId, newSize }),
    []
  );

  const handleRemoveFrame = useCallback(
    (carouselId: number, frameId: number) =>
      dispatch({ type: CAROUSEL_ACTIONS.REMOVE_FRAME, carouselId, frameId }),
    []
  );

  const handleReorderFrames = useCallback(
    (carouselId: number, oldIndex: number, newIndex: number) =>
      dispatch({ type: CAROUSEL_ACTIONS.REORDER_FRAMES, carouselId, oldIndex, newIndex }),
    []
  );

  const handleAddRow = useCallback(
    (afterIndex: number) => dispatch({ type: CAROUSEL_ACTIONS.ADD_ROW, afterIndex }),
    []
  );

  const handleRemoveRow = useCallback(
    (carouselId: number) => dispatch({ type: CAROUSEL_ACTIONS.REMOVE_ROW, carouselId }),
    []
  );

  const handleResetCarousel = useCallback(
    (carouselId: number) => {
      const originalCarousel = initialData.find((c) => c.id === carouselId);
      if (originalCarousel) {
        dispatch({ type: CAROUSEL_ACTIONS.RESET_CAROUSEL, carouselId, originalCarousel });
      }
    },
    [initialData]
  );

  const handleSetFrameBackground = useCallback(
    (carouselId: number, frameId: number, background: string | BackgroundOverride) =>
      dispatch({ type: CAROUSEL_ACTIONS.SET_FRAME_BACKGROUND, carouselId, frameId, background }),
    []
  );

  const handleSetRowStretchedBackground = useCallback(
    (carouselId: number, background: string, startIdx?: number, endIdx?: number) =>
      dispatch({ type: CAROUSEL_ACTIONS.SET_ROW_STRETCHED_BACKGROUND, carouselId, background, startIdx, endIdx }),
    []
  );

  const handleAddImageToFrame = useCallback(
    (carouselId: number, frameId: number, imageSrc: string) =>
      dispatch({ type: CAROUSEL_ACTIONS.ADD_IMAGE_TO_FRAME, carouselId, frameId, imageSrc }),
    []
  );

  const handleUpdateImageLayer = useCallback(
    (carouselId: number, frameId: number, updates: Partial<ImageLayer>) =>
      dispatch({ type: CAROUSEL_ACTIONS.UPDATE_IMAGE_LAYER, carouselId, frameId, updates }),
    []
  );

  const handleRemoveImageFromFrame = useCallback(
    (carouselId: number, frameId: number) =>
      dispatch({ type: CAROUSEL_ACTIONS.REMOVE_IMAGE_FROM_FRAME, carouselId, frameId }),
    []
  );

  const handleSyncLinkedImages = useCallback(
    (linkedGroupId: string, updates: Partial<ImageLayer>) =>
      dispatch({ type: CAROUSEL_ACTIONS.SYNC_LINKED_IMAGES, linkedGroupId, updates }),
    []
  );

  const handleAddPatternToFrame = useCallback(
    (carouselId: number, frameId: number, patternId: string) =>
      dispatch({ type: CAROUSEL_ACTIONS.ADD_PATTERN_TO_FRAME, carouselId, frameId, patternId }),
    []
  );

  const handleUpdatePatternLayer = useCallback(
    (carouselId: number, frameId: number, updates: Partial<PatternLayer>) =>
      dispatch({ type: CAROUSEL_ACTIONS.UPDATE_PATTERN_LAYER, carouselId, frameId, updates }),
    []
  );

  const handleRemovePatternFromFrame = useCallback(
    (carouselId: number, frameId: number) =>
      dispatch({ type: CAROUSEL_ACTIONS.REMOVE_PATTERN_FROM_FRAME, carouselId, frameId }),
    []
  );

  const handleSetRowStretchedPattern = useCallback(
    (carouselId: number, patternId: string, startIdx?: number, endIdx?: number) =>
      dispatch({ type: CAROUSEL_ACTIONS.SET_ROW_STRETCHED_PATTERN, carouselId, patternId, startIdx, endIdx }),
    []
  );

  const handleUpdateFillLayer = useCallback(
    (carouselId: number, frameId: number, updates: { fillOpacity?: number; fillRotation?: number }) =>
      dispatch({ type: CAROUSEL_ACTIONS.UPDATE_FILL_LAYER, carouselId, frameId, updates }),
    []
  );

  const handleAddProductImageToFrame = useCallback(
    (carouselId: number, frameId: number, imageSrc: string, layoutIndex: number, layoutVariant: number) =>
      dispatch({ type: CAROUSEL_ACTIONS.ADD_PRODUCT_IMAGE_TO_FRAME, carouselId, frameId, imageSrc, layoutIndex, layoutVariant }),
    []
  );

  const handleUpdateProductImageLayer = useCallback(
    (carouselId: number, frameId: number, updates: Partial<ProductImageLayer>) =>
      dispatch({ type: CAROUSEL_ACTIONS.UPDATE_PRODUCT_IMAGE_LAYER, carouselId, frameId, updates }),
    []
  );

  const handleRemoveProductImageFromFrame = useCallback(
    (carouselId: number, frameId: number) =>
      dispatch({ type: CAROUSEL_ACTIONS.REMOVE_PRODUCT_IMAGE_FROM_FRAME, carouselId, frameId }),
    []
  );

  const handleAddIconToFrame = useCallback(
    (carouselId: number, frameId: number, iconId: string, iconPath: string, iconName: string) =>
      dispatch({ type: CAROUSEL_ACTIONS.ADD_ICON_TO_FRAME, carouselId, frameId, iconId, iconPath, iconName }),
    []
  );

  const handleUpdateIconLayer = useCallback(
    (carouselId: number, frameId: number, updates: Partial<IconLayer>) =>
      dispatch({ type: CAROUSEL_ACTIONS.UPDATE_ICON_LAYER, carouselId, frameId, updates }),
    []
  );

  const handleRemoveIconFromFrame = useCallback(
    (carouselId: number, frameId: number) =>
      dispatch({ type: CAROUSEL_ACTIONS.REMOVE_ICON_FROM_FRAME, carouselId, frameId }),
    []
  );

  const handleUpdateProgressIndicator = useCallback(
    (carouselId: number, frameId: number, updates: Partial<ProgressIndicator>) =>
      dispatch({ type: CAROUSEL_ACTIONS.UPDATE_PROGRESS_INDICATOR, carouselId, frameId, updates }),
    []
  );

  const handleReorderBackgroundLayers = useCallback(
    (carouselId: number, frameId: number, newOrder: BackgroundLayerType[]) =>
      dispatch({ type: CAROUSEL_ACTIONS.REORDER_BACKGROUND_LAYERS, carouselId, frameId, newOrder }),
    []
  );

  const handleReorderCarousels = useCallback(
    (oldIndex: number, newIndex: number) =>
      dispatch({ type: CAROUSEL_ACTIONS.REORDER_CAROUSELS, oldIndex, newIndex }),
    []
  );

  return {
    carousels: state.carousels,
    selectedCarouselId: state.selectedCarouselId,
    selectedFrameId: state.selectedFrameId,
    activeTextField: state.activeTextField,
    selectedCarousel,
    selectedFrame,
    canUndo: canUndo(undoableState as UndoableState<CarouselState>),
    canRedo: canRedo(undoableState as UndoableState<CarouselState>),
    historyLength: undoableState.past.length,
    futureLength: undoableState.future.length,
    dispatch,
    clearSelection,
    deselectFrame,
    handleUndo,
    handleRedo,
    setActiveTextField,
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
    handleResetCarousel,
    handleSetFrameBackground,
    handleSetRowStretchedBackground,
    handleAddImageToFrame,
    handleUpdateImageLayer,
    handleRemoveImageFromFrame,
    handleSyncLinkedImages,
    handleAddPatternToFrame,
    handleUpdatePatternLayer,
    handleRemovePatternFromFrame,
    handleSetRowStretchedPattern,
    handleUpdateFillLayer,
    handleAddProductImageToFrame,
    handleUpdateProductImageLayer,
    handleRemoveProductImageFromFrame,
    handleAddIconToFrame,
    handleUpdateIconLayer,
    handleRemoveIconFromFrame,
    handleUpdateProgressIndicator,
    handleReorderBackgroundLayers,
    handleReorderCarousels,
  };
}

