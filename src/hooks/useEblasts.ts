import { useReducer, useEffect, useState, useCallback, Dispatch } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { createPatternLayer } from '../data';
import { logger } from '../utils';
import type { PatternLayer, ImageLayer, BackgroundOverride, ContentVariant } from '../types';

const STORAGE_KEY = 'carousel-tool-eblasts';

// ===== Types =====

export interface EblastSection {
  id: number;
  sectionType: 'header' | 'hero' | 'feature' | 'cta' | 'footer' | string;
  variants: ContentVariant[];
  currentVariant: number;
  currentLayout: number;
  layoutVariant: number;
  style: string;
  size: string;
  backgroundOverride?: BackgroundOverride;
  patternLayer?: PatternLayer;
  imageLayer?: ImageLayer;
}

export interface Eblast {
  id: number;
  name: string;
  subtitle: string;
  previewText: string;
  sections: EblastSection[];
}

export interface EblastState {
  eblasts: Eblast[];
  selectedEblastId: number | null;
  selectedSectionId: number | null;
  activeTextField: string | null;
}

// Action types
export const EBLAST_ACTIONS = {
  SET_EBLASTS: 'SET_EBLASTS',
  SELECT_EBLAST: 'SELECT_EBLAST',
  SELECT_SECTION: 'SELECT_SECTION',
  SET_ACTIVE_TEXT_FIELD: 'SET_ACTIVE_TEXT_FIELD',
  CLEAR_SELECTION: 'CLEAR_SELECTION',
  SET_VARIANT: 'SET_VARIANT',
  SET_LAYOUT: 'SET_LAYOUT',
  SHUFFLE_LAYOUT_VARIANT: 'SHUFFLE_LAYOUT_VARIANT',
  UPDATE_TEXT: 'UPDATE_TEXT',
  UPDATE_FORMATTING: 'UPDATE_FORMATTING',
  ADD_SECTION: 'ADD_SECTION',
  REMOVE_SECTION: 'REMOVE_SECTION',
  REORDER_SECTIONS: 'REORDER_SECTIONS',
  ADD_EBLAST: 'ADD_EBLAST',
  REMOVE_EBLAST: 'REMOVE_EBLAST',
  SET_SECTION_BACKGROUND: 'SET_SECTION_BACKGROUND',
  SET_STRETCHED_BACKGROUND: 'SET_STRETCHED_BACKGROUND',
  ADD_PATTERN_TO_SECTION: 'ADD_PATTERN_TO_SECTION',
  UPDATE_PATTERN_LAYER: 'UPDATE_PATTERN_LAYER',
  REMOVE_PATTERN_FROM_SECTION: 'REMOVE_PATTERN_FROM_SECTION',
  SET_STRETCHED_PATTERN: 'SET_STRETCHED_PATTERN',
  ADD_IMAGE_TO_SECTION: 'ADD_IMAGE_TO_SECTION',
  UPDATE_IMAGE_LAYER: 'UPDATE_IMAGE_LAYER',
  REMOVE_IMAGE_FROM_SECTION: 'REMOVE_IMAGE_FROM_SECTION',
} as const;

type EblastActionType = typeof EBLAST_ACTIONS[keyof typeof EBLAST_ACTIONS];

export interface EblastAction {
  type: EblastActionType;
  eblasts?: Eblast[];
  eblastId?: number;
  sectionId?: number;
  field?: string;
  value?: string;
  key?: string;
  variantIndex?: number;
  layoutIndex?: number;
  position?: number;
  oldIndex?: number;
  newIndex?: number;
  name?: string;
  background?: BackgroundOverride | string;
  startIdx?: number;
  endIdx?: number;
  patternId?: string;
  updates?: Partial<PatternLayer> | Partial<ImageLayer>;
  imageSrc?: string;
}

// Initial state
function createInitialState(eblasts: Eblast[]): EblastState {
  return {
    eblasts,
    selectedEblastId: null,
    selectedSectionId: null,
    activeTextField: null,
  };
}

// Reducer
function eblastReducer(state: EblastState, action: EblastAction): EblastState {
  switch (action.type) {
    case EBLAST_ACTIONS.SET_EBLASTS:
      return { ...state, eblasts: action.eblasts || [] };

    case EBLAST_ACTIONS.SELECT_EBLAST: {
      const { eblastId } = action;
      if (eblastId === state.selectedEblastId) {
        return { ...state, selectedEblastId: null, selectedSectionId: null, activeTextField: null };
      }
      return { ...state, selectedEblastId: eblastId ?? null, selectedSectionId: null, activeTextField: null };
    }

    case EBLAST_ACTIONS.SELECT_SECTION: {
      const { eblastId, sectionId } = action;
      return {
        ...state,
        selectedEblastId: eblastId ?? null,
        selectedSectionId: state.selectedSectionId === sectionId ? null : (sectionId ?? null),
        activeTextField: null,
      };
    }

    case EBLAST_ACTIONS.SET_ACTIVE_TEXT_FIELD:
      return { ...state, activeTextField: action.field ?? null };

    case EBLAST_ACTIONS.CLEAR_SELECTION:
      return { ...state, selectedEblastId: null, selectedSectionId: null, activeTextField: null };

    case EBLAST_ACTIONS.SET_VARIANT:
      return {
        ...state,
        eblasts: state.eblasts.map((eblast) => {
          if (eblast.id !== action.eblastId) return eblast;
          return {
            ...eblast,
            sections: eblast.sections.map((section) =>
              section.id !== action.sectionId ? section : { ...section, currentVariant: action.variantIndex ?? 0 }
            ),
          };
        }),
      };

    case EBLAST_ACTIONS.SET_LAYOUT:
      return {
        ...state,
        eblasts: state.eblasts.map((eblast) => {
          if (eblast.id !== action.eblastId) return eblast;
          return {
            ...eblast,
            sections: eblast.sections.map((section) =>
              section.id !== action.sectionId
                ? section
                : { ...section, currentLayout: action.layoutIndex ?? 0, layoutVariant: 0 }
            ),
          };
        }),
      };

    case EBLAST_ACTIONS.SHUFFLE_LAYOUT_VARIANT:
      return {
        ...state,
        eblasts: state.eblasts.map((eblast) => {
          if (eblast.id !== action.eblastId) return eblast;
          return {
            ...eblast,
            sections: eblast.sections.map((section) =>
              section.id !== action.sectionId
                ? section
                : { ...section, layoutVariant: ((section.layoutVariant || 0) + 1) % 3 }
            ),
          };
        }),
      };

    case EBLAST_ACTIONS.UPDATE_TEXT:
      return {
        ...state,
        eblasts: state.eblasts.map((eblast) => {
          if (eblast.id !== action.eblastId) return eblast;
          return {
            ...eblast,
            sections: eblast.sections.map((section) => {
              if (section.id !== action.sectionId) return section;
              const updatedVariants = [...section.variants];
              updatedVariants[section.currentVariant] = {
                ...updatedVariants[section.currentVariant],
                [action.field || '']: action.value,
              };
              return { ...section, variants: updatedVariants };
            }),
          };
        }),
      };

    case EBLAST_ACTIONS.UPDATE_FORMATTING:
      return {
        ...state,
        eblasts: state.eblasts.map((eblast) => {
          if (eblast.id !== action.eblastId) return eblast;
          return {
            ...eblast,
            sections: eblast.sections.map((section) => {
              if (section.id !== action.sectionId) return section;
              const updatedVariants = [...section.variants];
              const currentVariant = updatedVariants[section.currentVariant];
              const currentFormatting = currentVariant.formatting || {};
              const fieldFormatting = currentFormatting[action.field || ''] || {};
              updatedVariants[section.currentVariant] = {
                ...currentVariant,
                formatting: {
                  ...currentFormatting,
                  [action.field || '']: { ...fieldFormatting, [action.key || '']: action.value },
                },
              };
              return { ...section, variants: updatedVariants };
            }),
          };
        }),
      };

    case EBLAST_ACTIONS.ADD_SECTION: {
      return {
        ...state,
        eblasts: state.eblasts.map((eblast) => {
          if (eblast.id !== action.eblastId) return eblast;
          const newSection: EblastSection = {
            id: Date.now(),
            sectionType: 'feature',
            variants: [
              { headline: 'New Section', body: 'Add your content here.', formatting: {} },
              { headline: 'Alternative', body: 'Second version.', formatting: {} },
              { headline: 'Third Option', body: 'Third version.', formatting: {} },
            ],
            currentVariant: 0,
            currentLayout: 0,
            layoutVariant: 0,
            style: 'feature-dark',
            size: 'emailHero',
          };
          const newSections = [...eblast.sections];
          newSections.splice(action.position ?? eblast.sections.length, 0, newSection);
          return { ...eblast, sections: newSections };
        }),
      };
    }

    case EBLAST_ACTIONS.REMOVE_SECTION: {
      return {
        ...state,
        selectedSectionId: state.selectedSectionId === action.sectionId ? null : state.selectedSectionId,
        eblasts: state.eblasts.map((eblast) => {
          if (eblast.id !== action.eblastId) return eblast;
          if (eblast.sections.length <= 1) return eblast;
          return { ...eblast, sections: eblast.sections.filter((s) => s.id !== action.sectionId) };
        }),
      };
    }

    case EBLAST_ACTIONS.REORDER_SECTIONS:
      return {
        ...state,
        eblasts: state.eblasts.map((eblast) => {
          if (eblast.id !== action.eblastId) return eblast;
          return { ...eblast, sections: arrayMove(eblast.sections, action.oldIndex ?? 0, action.newIndex ?? 0) };
        }),
      };

    case EBLAST_ACTIONS.ADD_EBLAST: {
      const newEblast: Eblast = {
        id: Date.now(),
        name: action.name || 'New Email',
        subtitle: 'Email Campaign',
        previewText: '',
        sections: [
          {
            id: 1,
            sectionType: 'hero',
            variants: [
              { headline: 'Your Headline', body: 'Your message here.', formatting: {} },
              { headline: 'Alternative', body: 'Second version.', formatting: {} },
              { headline: 'Third', body: 'Third version.', formatting: {} },
            ],
            currentVariant: 0,
            currentLayout: 0,
            layoutVariant: 0,
            style: 'hero-gradient',
            size: 'emailHero',
          },
        ],
      };
      return { ...state, eblasts: [...state.eblasts, newEblast], selectedEblastId: newEblast.id };
    }

    case EBLAST_ACTIONS.REMOVE_EBLAST: {
      if (state.eblasts.length <= 1) return state;
      return {
        ...state,
        selectedEblastId: state.selectedEblastId === action.eblastId ? null : state.selectedEblastId,
        selectedSectionId: null,
        eblasts: state.eblasts.filter((e) => e.id !== action.eblastId),
      };
    }

    case EBLAST_ACTIONS.SET_SECTION_BACKGROUND: {
      const { eblastId, sectionId, background } = action;
      return {
        ...state,
        eblasts: state.eblasts.map((eblast) => {
          if (eblast.id !== eblastId) return eblast;
          return {
            ...eblast,
            sections: eblast.sections.map((section) =>
              section.id === sectionId ? { ...section, backgroundOverride: background as BackgroundOverride } : section
            ),
          };
        }),
      };
    }

    case EBLAST_ACTIONS.SET_STRETCHED_BACKGROUND: {
      const { eblastId, background, startIdx = 0, endIdx } = action;
      return {
        ...state,
        eblasts: state.eblasts.map((eblast) => {
          if (eblast.id !== eblastId) return eblast;
          const numSections = eblast.sections.length;
          if (numSections === 0) return eblast;

          const actualEndIdx = endIdx !== undefined ? endIdx : numSections - 1;
          const selectedCount = actualEndIdx - startIdx + 1;

          return {
            ...eblast,
            sections: eblast.sections.map((section, index) => {
              if (index < startIdx || index > actualEndIdx) return section;
              const relativeIndex = index - startIdx;
              const positionPercent = selectedCount > 1 ? (relativeIndex / (selectedCount - 1)) * 100 : 0;

              return {
                ...section,
                backgroundOverride: {
                  gradient: background as string,
                  size: `100% ${selectedCount * 100}%`,
                  position: `0% ${positionPercent}%`,
                  isStretched: true,
                },
              };
            }),
          };
        }),
      };
    }

    case EBLAST_ACTIONS.ADD_PATTERN_TO_SECTION: {
      const { eblastId, sectionId, patternId } = action;
      const newPatternLayer = createPatternLayer(patternId || '');
      if (!newPatternLayer) return state;

      return {
        ...state,
        eblasts: state.eblasts.map((eblast) => {
          if (eblast.id !== eblastId) return eblast;
          return {
            ...eblast,
            sections: eblast.sections.map((section) =>
              section.id === sectionId ? { ...section, patternLayer: newPatternLayer } : section
            ),
          };
        }),
      };
    }

    case EBLAST_ACTIONS.UPDATE_PATTERN_LAYER: {
      const { eblastId, sectionId, updates } = action;
      return {
        ...state,
        eblasts: state.eblasts.map((eblast) => {
          if (eblast.id !== eblastId) return eblast;
          return {
            ...eblast,
            sections: eblast.sections.map((section) => {
              if (section.id !== sectionId || !section.patternLayer) return section;
              return { ...section, patternLayer: { ...section.patternLayer, ...updates } as PatternLayer };
            }),
          };
        }),
      };
    }

    case EBLAST_ACTIONS.REMOVE_PATTERN_FROM_SECTION: {
      const { eblastId, sectionId } = action;
      return {
        ...state,
        eblasts: state.eblasts.map((eblast) => {
          if (eblast.id !== eblastId) return eblast;
          return {
            ...eblast,
            sections: eblast.sections.map((section) => {
              if (section.id !== sectionId) return section;
              const { patternLayer: _patternLayer, ...rest } = section;
              return rest as EblastSection;
            }),
          };
        }),
      };
    }

    case EBLAST_ACTIONS.SET_STRETCHED_PATTERN: {
      const { eblastId, patternId, startIdx = 0, endIdx } = action;
      const basePatternLayer = createPatternLayer(patternId || '');
      if (!basePatternLayer) return state;

      return {
        ...state,
        eblasts: state.eblasts.map((eblast) => {
          if (eblast.id !== eblastId) return eblast;
          const numSections = eblast.sections.length;
          if (numSections === 0) return eblast;

          const actualEndIdx = endIdx !== undefined ? endIdx : numSections - 1;
          const selectedCount = actualEndIdx - startIdx + 1;

          return {
            ...eblast,
            sections: eblast.sections.map((section, index) => {
              if (index < startIdx || index > actualEndIdx) return section;
              const relativeIndex = index - startIdx;
              return {
                ...section,
                patternLayer: {
                  ...basePatternLayer,
                  isStretched: true,
                  stretchSize: `100% ${selectedCount * 100}%`,
                  stretchPosition: `0% ${-relativeIndex * 100}%`,
                },
              };
            }),
          };
        }),
      };
    }

    case EBLAST_ACTIONS.ADD_IMAGE_TO_SECTION: {
      const { eblastId, sectionId, imageSrc } = action;
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
        eblasts: state.eblasts.map((eblast) => {
          if (eblast.id !== eblastId) return eblast;
          return {
            ...eblast,
            sections: eblast.sections.map((section) =>
              section.id === sectionId ? { ...section, imageLayer: newImageLayer } : section
            ),
          };
        }),
      };
    }

    case EBLAST_ACTIONS.UPDATE_IMAGE_LAYER: {
      const { eblastId, sectionId, updates } = action;
      return {
        ...state,
        eblasts: state.eblasts.map((eblast) => {
          if (eblast.id !== eblastId) return eblast;
          return {
            ...eblast,
            sections: eblast.sections.map((section) => {
              if (section.id !== sectionId || !section.imageLayer) return section;
              return { ...section, imageLayer: { ...section.imageLayer, ...updates } as ImageLayer };
            }),
          };
        }),
      };
    }

    case EBLAST_ACTIONS.REMOVE_IMAGE_FROM_SECTION: {
      const { eblastId, sectionId } = action;
      return {
        ...state,
        eblasts: state.eblasts.map((eblast) => {
          if (eblast.id !== eblastId) return eblast;
          return {
            ...eblast,
            sections: eblast.sections.map((section) => {
              if (section.id !== sectionId) return section;
              const { imageLayer: _imageLayer, ...rest } = section;
              return rest as EblastSection;
            }),
          };
        }),
      };
    }

    default:
      return state;
  }
}

// Load from localStorage
function loadFromStorage(initialData: Eblast[]): Eblast[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    logger.warn('Failed to load eblasts from localStorage:', e);
  }
  return initialData;
}

// ===== Hook Return Type =====
export interface UseEblastsReturn {
  eblasts: Eblast[];
  selectedEblastId: number | null;
  selectedSectionId: number | null;
  activeTextField: string | null;
  selectedEblast: Eblast | undefined;
  selectedSection: EblastSection | undefined;
  dispatch: Dispatch<EblastAction>;
  clearSelection: () => void;
  setActiveTextField: (field: string | null) => void;
  handleSelectSection: (eblastId: number, sectionId: number, closeAllDropdowns?: () => void) => void;
  handleSelectEblast: (eblastId: number, closeAllDropdowns?: () => void) => void;
  handleSetVariant: (eblastId: number, sectionId: number, variantIndex: number) => void;
  handleSetLayout: (eblastId: number, sectionId: number, layoutIndex: number) => void;
  handleShuffleLayoutVariant: (eblastId: number, sectionId: number) => void;
  handleUpdateText: (eblastId: number, sectionId: number, field: string, value: string) => void;
  handleUpdateFormatting: (eblastId: number, sectionId: number, field: string, key: string, value: unknown) => void;
  handleAddSection: (eblastId: number, position: number) => void;
  handleRemoveSection: (eblastId: number, sectionId: number) => void;
  handleReorderSections: (eblastId: number, oldIndex: number, newIndex: number) => void;
  handleAddEblast: (name?: string) => void;
  handleRemoveEblast: (eblastId: number) => void;
  handleSetSectionBackground: (eblastId: number, sectionId: number, background: BackgroundOverride) => void;
  handleSetStretchedBackground: (eblastId: number, background: string, startIdx?: number, endIdx?: number) => void;
  handleAddPatternToSection: (eblastId: number, sectionId: number, patternId: string) => void;
  handleUpdatePatternLayer: (eblastId: number, sectionId: number, updates: Partial<PatternLayer>) => void;
  handleRemovePatternFromSection: (eblastId: number, sectionId: number) => void;
  handleSetStretchedPattern: (eblastId: number, patternId: string, startIdx?: number, endIdx?: number) => void;
  handleAddImageToSection: (eblastId: number, sectionId: number, imageSrc: string) => void;
  handleUpdateImageLayer: (eblastId: number, sectionId: number, updates: Partial<ImageLayer>) => void;
  handleRemoveImageFromSection: (eblastId: number, sectionId: number) => void;
}

export default function useEblasts(initialData: Eblast[]): UseEblastsReturn {
  const [initialized, setInitialized] = useState(false);
  const [state, dispatch] = useReducer(eblastReducer, loadFromStorage(initialData), createInitialState);

  // Computed values
  const selectedEblast = state.eblasts.find((e) => e.id === state.selectedEblastId);
  const selectedSection = selectedEblast?.sections?.find((s) => s.id === state.selectedSectionId);

  // Save to localStorage
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.eblasts));
    } catch (e) {
      logger.warn('Failed to save eblasts to localStorage:', e);
    }
  }, [state.eblasts, initialized]);

  // Memoized actions
  const clearSelection = useCallback(() => dispatch({ type: EBLAST_ACTIONS.CLEAR_SELECTION }), []);

  const setActiveTextField = useCallback(
    (field: string | null) => dispatch({ type: EBLAST_ACTIONS.SET_ACTIVE_TEXT_FIELD, field: field ?? undefined }),
    []
  );

  const handleSelectSection = useCallback(
    (eblastId: number, sectionId: number, closeAllDropdowns?: () => void) => {
      if (closeAllDropdowns) closeAllDropdowns();
      dispatch({ type: EBLAST_ACTIONS.SELECT_SECTION, eblastId, sectionId });
    },
    []
  );

  const handleSelectEblast = useCallback((eblastId: number, closeAllDropdowns?: () => void) => {
    if (closeAllDropdowns) closeAllDropdowns();
    dispatch({ type: EBLAST_ACTIONS.SELECT_EBLAST, eblastId });
  }, []);

  const handleSetVariant = useCallback(
    (eblastId: number, sectionId: number, variantIndex: number) =>
      dispatch({ type: EBLAST_ACTIONS.SET_VARIANT, eblastId, sectionId, variantIndex }),
    []
  );

  const handleSetLayout = useCallback(
    (eblastId: number, sectionId: number, layoutIndex: number) =>
      dispatch({ type: EBLAST_ACTIONS.SET_LAYOUT, eblastId, sectionId, layoutIndex }),
    []
  );

  const handleShuffleLayoutVariant = useCallback(
    (eblastId: number, sectionId: number) =>
      dispatch({ type: EBLAST_ACTIONS.SHUFFLE_LAYOUT_VARIANT, eblastId, sectionId }),
    []
  );

  const handleUpdateText = useCallback(
    (eblastId: number, sectionId: number, field: string, value: string) =>
      dispatch({ type: EBLAST_ACTIONS.UPDATE_TEXT, eblastId, sectionId, field, value }),
    []
  );

  const handleUpdateFormatting = useCallback(
    (eblastId: number, sectionId: number, field: string, key: string, value: unknown) =>
      dispatch({ type: EBLAST_ACTIONS.UPDATE_FORMATTING, eblastId, sectionId, field, key, value: value as string }),
    []
  );

  const handleAddSection = useCallback(
    (eblastId: number, position: number) => dispatch({ type: EBLAST_ACTIONS.ADD_SECTION, eblastId, position }),
    []
  );

  const handleRemoveSection = useCallback(
    (eblastId: number, sectionId: number) => dispatch({ type: EBLAST_ACTIONS.REMOVE_SECTION, eblastId, sectionId }),
    []
  );

  const handleReorderSections = useCallback(
    (eblastId: number, oldIndex: number, newIndex: number) =>
      dispatch({ type: EBLAST_ACTIONS.REORDER_SECTIONS, eblastId, oldIndex, newIndex }),
    []
  );

  const handleAddEblast = useCallback(
    (name?: string) => dispatch({ type: EBLAST_ACTIONS.ADD_EBLAST, name }),
    []
  );

  const handleRemoveEblast = useCallback(
    (eblastId: number) => dispatch({ type: EBLAST_ACTIONS.REMOVE_EBLAST, eblastId }),
    []
  );

  const handleSetSectionBackground = useCallback(
    (eblastId: number, sectionId: number, background: BackgroundOverride) =>
      dispatch({ type: EBLAST_ACTIONS.SET_SECTION_BACKGROUND, eblastId, sectionId, background }),
    []
  );

  const handleSetStretchedBackground = useCallback(
    (eblastId: number, background: string, startIdx?: number, endIdx?: number) =>
      dispatch({ type: EBLAST_ACTIONS.SET_STRETCHED_BACKGROUND, eblastId, background, startIdx, endIdx }),
    []
  );

  const handleAddPatternToSection = useCallback(
    (eblastId: number, sectionId: number, patternId: string) =>
      dispatch({ type: EBLAST_ACTIONS.ADD_PATTERN_TO_SECTION, eblastId, sectionId, patternId }),
    []
  );

  const handleUpdatePatternLayer = useCallback(
    (eblastId: number, sectionId: number, updates: Partial<PatternLayer>) =>
      dispatch({ type: EBLAST_ACTIONS.UPDATE_PATTERN_LAYER, eblastId, sectionId, updates }),
    []
  );

  const handleRemovePatternFromSection = useCallback(
    (eblastId: number, sectionId: number) =>
      dispatch({ type: EBLAST_ACTIONS.REMOVE_PATTERN_FROM_SECTION, eblastId, sectionId }),
    []
  );

  const handleSetStretchedPattern = useCallback(
    (eblastId: number, patternId: string, startIdx?: number, endIdx?: number) =>
      dispatch({ type: EBLAST_ACTIONS.SET_STRETCHED_PATTERN, eblastId, patternId, startIdx, endIdx }),
    []
  );

  const handleAddImageToSection = useCallback(
    (eblastId: number, sectionId: number, imageSrc: string) =>
      dispatch({ type: EBLAST_ACTIONS.ADD_IMAGE_TO_SECTION, eblastId, sectionId, imageSrc }),
    []
  );

  const handleUpdateImageLayer = useCallback(
    (eblastId: number, sectionId: number, updates: Partial<ImageLayer>) =>
      dispatch({ type: EBLAST_ACTIONS.UPDATE_IMAGE_LAYER, eblastId, sectionId, updates }),
    []
  );

  const handleRemoveImageFromSection = useCallback(
    (eblastId: number, sectionId: number) =>
      dispatch({ type: EBLAST_ACTIONS.REMOVE_IMAGE_FROM_SECTION, eblastId, sectionId }),
    []
  );

  return {
    // State
    eblasts: state.eblasts,
    selectedEblastId: state.selectedEblastId,
    selectedSectionId: state.selectedSectionId,
    activeTextField: state.activeTextField,
    // Computed
    selectedEblast,
    selectedSection,
    // Actions
    dispatch,
    clearSelection,
    setActiveTextField,
    handleSelectSection,
    handleSelectEblast,
    handleSetVariant,
    handleSetLayout,
    handleShuffleLayoutVariant,
    handleUpdateText,
    handleUpdateFormatting,
    handleAddSection,
    handleRemoveSection,
    handleReorderSections,
    handleAddEblast,
    handleRemoveEblast,
    handleSetSectionBackground,
    handleSetStretchedBackground,
    handleAddPatternToSection,
    handleUpdatePatternLayer,
    handleRemovePatternFromSection,
    handleSetStretchedPattern,
    handleAddImageToSection,
    handleUpdateImageLayer,
    handleRemoveImageFromSection,
  };
}

