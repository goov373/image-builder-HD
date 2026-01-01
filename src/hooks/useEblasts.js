import { useReducer, useEffect, useState, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { createPatternLayer } from '../data';
import { logger } from '../utils';

const STORAGE_KEY = 'carousel-tool-eblasts';

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
  // Background Layer Actions
  SET_SECTION_BACKGROUND: 'SET_SECTION_BACKGROUND',
  SET_STRETCHED_BACKGROUND: 'SET_STRETCHED_BACKGROUND',
  // Pattern Layer Actions
  ADD_PATTERN_TO_SECTION: 'ADD_PATTERN_TO_SECTION',
  UPDATE_PATTERN_LAYER: 'UPDATE_PATTERN_LAYER',
  REMOVE_PATTERN_FROM_SECTION: 'REMOVE_PATTERN_FROM_SECTION',
  SET_STRETCHED_PATTERN: 'SET_STRETCHED_PATTERN',
  // Image Layer Actions
  ADD_IMAGE_TO_SECTION: 'ADD_IMAGE_TO_SECTION',
  UPDATE_IMAGE_LAYER: 'UPDATE_IMAGE_LAYER',
  REMOVE_IMAGE_FROM_SECTION: 'REMOVE_IMAGE_FROM_SECTION',
};

// Initial state
function createInitialState(eblasts) {
  return {
    eblasts,
    selectedEblastId: null,
    selectedSectionId: null,
    activeTextField: null,
  };
}

// Reducer
function eblastReducer(state, action) {
  switch (action.type) {
    case EBLAST_ACTIONS.SET_EBLASTS:
      return { ...state, eblasts: action.eblasts };

    case EBLAST_ACTIONS.SELECT_EBLAST: {
      const { eblastId } = action;
      if (eblastId === state.selectedEblastId) {
        return { ...state, selectedEblastId: null, selectedSectionId: null, activeTextField: null };
      }
      return { ...state, selectedEblastId: eblastId, selectedSectionId: null, activeTextField: null };
    }

    case EBLAST_ACTIONS.SELECT_SECTION: {
      const { eblastId, sectionId } = action;
      return {
        ...state,
        selectedEblastId: eblastId,
        selectedSectionId: state.selectedSectionId === sectionId ? null : sectionId,
        activeTextField: null,
      };
    }

    case EBLAST_ACTIONS.SET_ACTIVE_TEXT_FIELD:
      return { ...state, activeTextField: action.field };

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
              section.id !== action.sectionId ? section : { ...section, currentVariant: action.variantIndex }
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
                : { ...section, currentLayout: action.layoutIndex, layoutVariant: 0 }
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
                [action.field]: action.value,
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
              const fieldFormatting = currentFormatting[action.field] || {};
              updatedVariants[section.currentVariant] = {
                ...currentVariant,
                formatting: {
                  ...currentFormatting,
                  [action.field]: { ...fieldFormatting, [action.key]: action.value },
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
          const newSection = {
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
          newSections.splice(action.position, 0, newSection);
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
          return { ...eblast, sections: arrayMove(eblast.sections, action.oldIndex, action.newIndex) };
        }),
      };

    case EBLAST_ACTIONS.ADD_EBLAST: {
      const newEblast = {
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

    // ===== Background Layer Actions =====

    case EBLAST_ACTIONS.SET_SECTION_BACKGROUND: {
      const { eblastId, sectionId, background } = action;
      return {
        ...state,
        eblasts: state.eblasts.map((eblast) => {
          if (eblast.id !== eblastId) return eblast;
          return {
            ...eblast,
            sections: eblast.sections.map((section) =>
              section.id === sectionId ? { ...section, backgroundOverride: background } : section
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

              // CSS background-position percentage when bg > container:
              // 0% = top aligned, 100% = bottom aligned
              const positionPercent = selectedCount > 1 ? (relativeIndex / (selectedCount - 1)) * 100 : 0;

              return {
                ...section,
                backgroundOverride: {
                  gradient: background,
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

    // ===== Pattern Layer Actions =====

    case EBLAST_ACTIONS.ADD_PATTERN_TO_SECTION: {
      const { eblastId, sectionId, patternId } = action;
      const newPatternLayer = createPatternLayer(patternId);
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
              return { ...section, patternLayer: { ...section.patternLayer, ...updates } };
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
              const { patternLayer, ...rest } = section;
              return rest;
            }),
          };
        }),
      };
    }

    case EBLAST_ACTIONS.SET_STRETCHED_PATTERN: {
      const { eblastId, patternId, startIdx = 0, endIdx } = action;
      const basePatternLayer = createPatternLayer(patternId);
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

    // ===== Image Layer Actions =====

    case EBLAST_ACTIONS.ADD_IMAGE_TO_SECTION: {
      const { eblastId, sectionId, imageSrc } = action;
      const newImageLayer = {
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        src: imageSrc,
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
              return { ...section, imageLayer: { ...section.imageLayer, ...updates } };
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
              const { imageLayer, ...rest } = section;
              return rest;
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
    logger.warn('Failed to load eblasts from localStorage:', e);
  }
  return initialData;
}

export default function useEblasts(initialData) {
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
  const actions = {
    clearSelection: useCallback(() => dispatch({ type: EBLAST_ACTIONS.CLEAR_SELECTION }), []),

    setActiveTextField: useCallback((field) => dispatch({ type: EBLAST_ACTIONS.SET_ACTIVE_TEXT_FIELD, field }), []),

    handleSelectSection: useCallback((eblastId, sectionId, closeAllDropdowns) => {
      if (closeAllDropdowns) closeAllDropdowns();
      dispatch({ type: EBLAST_ACTIONS.SELECT_SECTION, eblastId, sectionId });
    }, []),

    handleSelectEblast: useCallback((eblastId, closeAllDropdowns) => {
      if (closeAllDropdowns) closeAllDropdowns();
      dispatch({ type: EBLAST_ACTIONS.SELECT_EBLAST, eblastId });
    }, []),

    handleSetVariant: useCallback(
      (eblastId, sectionId, variantIndex) =>
        dispatch({ type: EBLAST_ACTIONS.SET_VARIANT, eblastId, sectionId, variantIndex }),
      []
    ),

    handleSetLayout: useCallback(
      (eblastId, sectionId, layoutIndex) =>
        dispatch({ type: EBLAST_ACTIONS.SET_LAYOUT, eblastId, sectionId, layoutIndex }),
      []
    ),

    handleShuffleLayoutVariant: useCallback(
      (eblastId, sectionId) => dispatch({ type: EBLAST_ACTIONS.SHUFFLE_LAYOUT_VARIANT, eblastId, sectionId }),
      []
    ),

    handleUpdateText: useCallback(
      (eblastId, sectionId, field, value) =>
        dispatch({ type: EBLAST_ACTIONS.UPDATE_TEXT, eblastId, sectionId, field, value }),
      []
    ),

    handleUpdateFormatting: useCallback(
      (eblastId, sectionId, field, key, value) =>
        dispatch({ type: EBLAST_ACTIONS.UPDATE_FORMATTING, eblastId, sectionId, field, key, value }),
      []
    ),

    handleAddSection: useCallback(
      (eblastId, position) => dispatch({ type: EBLAST_ACTIONS.ADD_SECTION, eblastId, position }),
      []
    ),

    handleRemoveSection: useCallback(
      (eblastId, sectionId) => dispatch({ type: EBLAST_ACTIONS.REMOVE_SECTION, eblastId, sectionId }),
      []
    ),

    handleReorderSections: useCallback(
      (eblastId, oldIndex, newIndex) =>
        dispatch({ type: EBLAST_ACTIONS.REORDER_SECTIONS, eblastId, oldIndex, newIndex }),
      []
    ),

    handleAddEblast: useCallback((name) => dispatch({ type: EBLAST_ACTIONS.ADD_EBLAST, name }), []),

    handleRemoveEblast: useCallback((eblastId) => dispatch({ type: EBLAST_ACTIONS.REMOVE_EBLAST, eblastId }), []),

    // Background Layer Actions
    handleSetSectionBackground: useCallback(
      (eblastId, sectionId, background) =>
        dispatch({ type: EBLAST_ACTIONS.SET_SECTION_BACKGROUND, eblastId, sectionId, background }),
      []
    ),

    handleSetStretchedBackground: useCallback(
      (eblastId, background, startIdx, endIdx) =>
        dispatch({ type: EBLAST_ACTIONS.SET_STRETCHED_BACKGROUND, eblastId, background, startIdx, endIdx }),
      []
    ),

    // Pattern Layer Actions
    handleAddPatternToSection: useCallback(
      (eblastId, sectionId, patternId) =>
        dispatch({ type: EBLAST_ACTIONS.ADD_PATTERN_TO_SECTION, eblastId, sectionId, patternId }),
      []
    ),

    handleUpdatePatternLayer: useCallback(
      (eblastId, sectionId, updates) =>
        dispatch({ type: EBLAST_ACTIONS.UPDATE_PATTERN_LAYER, eblastId, sectionId, updates }),
      []
    ),

    handleRemovePatternFromSection: useCallback(
      (eblastId, sectionId) => dispatch({ type: EBLAST_ACTIONS.REMOVE_PATTERN_FROM_SECTION, eblastId, sectionId }),
      []
    ),

    handleSetStretchedPattern: useCallback(
      (eblastId, patternId, startIdx, endIdx) =>
        dispatch({ type: EBLAST_ACTIONS.SET_STRETCHED_PATTERN, eblastId, patternId, startIdx, endIdx }),
      []
    ),

    // Image Layer Actions
    handleAddImageToSection: useCallback(
      (eblastId, sectionId, imageSrc) =>
        dispatch({ type: EBLAST_ACTIONS.ADD_IMAGE_TO_SECTION, eblastId, sectionId, imageSrc }),
      []
    ),

    handleUpdateImageLayer: useCallback(
      (eblastId, sectionId, updates) =>
        dispatch({ type: EBLAST_ACTIONS.UPDATE_IMAGE_LAYER, eblastId, sectionId, updates }),
      []
    ),

    handleRemoveImageFromSection: useCallback(
      (eblastId, sectionId) => dispatch({ type: EBLAST_ACTIONS.REMOVE_IMAGE_FROM_SECTION, eblastId, sectionId }),
      []
    ),
  };

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
    ...actions,
  };
}
