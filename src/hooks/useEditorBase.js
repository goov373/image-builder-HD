import { useReducer, useEffect, useState, useCallback } from 'react';

/**
 * Base Editor Hook Factory
 * Creates a standardized editor hook with common patterns for:
 * - State management via useReducer
 * - LocalStorage persistence
 * - Selection handling
 * - CRUD operations
 * 
 * This reduces duplication across useCarousels, useEblasts, useSingleImages, useVideoCovers
 */

/**
 * Create base action types that all editors share
 * @param {string} entityName - e.g., 'CAROUSEL', 'EBLAST', 'SINGLEIMAGE'
 * @returns {Object} Base action types object
 */
export function createBaseActionTypes(entityName) {
  const plural = `${entityName}S`;
  return {
    [`SET_${plural}`]: `SET_${plural}`,
    [`SELECT_${entityName}`]: `SELECT_${entityName}`,
    SET_ACTIVE_TEXT_FIELD: 'SET_ACTIVE_TEXT_FIELD',
    CLEAR_SELECTION: 'CLEAR_SELECTION',
  };
}

/**
 * Create base reducer cases that all editors share
 * @param {Object} config - Configuration for the reducer
 * @param {string} config.entityName - e.g., 'carousel', 'eblast'
 * @param {string} config.pluralName - e.g., 'carousels', 'eblasts'
 * @param {string} config.selectedIdKey - e.g., 'selectedCarouselId'
 * @param {string} config.selectedChildIdKey - e.g., 'selectedFrameId' (optional)
 * @returns {Function} Reducer function for base cases
 */
export function createBaseReducerCases(config) {
  const { entityName, pluralName, selectedIdKey, selectedChildIdKey } = config;
  
  return (state, action) => {
    const setActionType = `SET_${entityName.toUpperCase()}S`;
    const selectActionType = `SELECT_${entityName.toUpperCase()}`;
    
    switch (action.type) {
      case setActionType:
        return { ...state, [pluralName]: action[pluralName] };

      case selectActionType: {
        const entityId = action[`${entityName}Id`];
        const currentSelectedId = state[selectedIdKey];
        
        // Toggle selection
        if (entityId === currentSelectedId) {
          return { 
            ...state, 
            [selectedIdKey]: null, 
            ...(selectedChildIdKey && { [selectedChildIdKey]: null }),
            activeTextField: null 
          };
        }
        
        return { 
          ...state, 
          [selectedIdKey]: entityId, 
          ...(selectedChildIdKey && { [selectedChildIdKey]: null }),
          activeTextField: null 
        };
      }

      case 'SET_ACTIVE_TEXT_FIELD':
        return { ...state, activeTextField: action.field };

      case 'CLEAR_SELECTION':
        return { 
          ...state, 
          [selectedIdKey]: null, 
          ...(selectedChildIdKey && { [selectedChildIdKey]: null }),
          activeTextField: null 
        };

      default:
        return null; // Signal that base reducer didn't handle this action
    }
  };
}

/**
 * Create the localStorage persistence logic
 * @param {string} storageKey - Key for localStorage
 * @param {any} data - Data to persist
 * @param {boolean} isLoaded - Whether initial load is complete
 */
export function usePersistence(storageKey, data, isLoaded) {
  useEffect(() => {
    if (isLoaded && data) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(data));
      } catch (error) {
        console.error(`Failed to save to localStorage (${storageKey}):`, error);
      }
    }
  }, [storageKey, data, isLoaded]);
}

/**
 * Load initial data from localStorage
 * @param {string} storageKey - Key for localStorage
 * @param {any} fallbackData - Default data if nothing in storage
 * @returns {any} Loaded data or fallback
 */
export function loadFromStorage(storageKey, fallbackData) {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error(`Failed to load from localStorage (${storageKey}):`, error);
  }
  return fallbackData;
}

/**
 * Create a combined reducer that tries base cases first, then custom cases
 * @param {Function} baseReducer - Base reducer from createBaseReducerCases
 * @param {Function} customReducer - Custom reducer for entity-specific actions
 * @returns {Function} Combined reducer
 */
export function combineReducers(baseReducer, customReducer) {
  return (state, action) => {
    // Try base reducer first
    const baseResult = baseReducer(state, action);
    if (baseResult !== null) {
      return baseResult;
    }
    
    // Fall back to custom reducer
    return customReducer(state, action);
  };
}

/**
 * Create standard handler functions that all editors use
 * @param {Function} dispatch - Reducer dispatch function
 * @param {Object} actionTypes - Action types object
 * @param {string} entityName - e.g., 'carousel'
 * @returns {Object} Handler functions
 */
export function createBaseHandlers(dispatch, actionTypes, entityName) {
  const selectAction = `SELECT_${entityName.toUpperCase()}`;
  
  return {
    handleSelect: useCallback((id) => {
      dispatch({ type: selectAction, [`${entityName}Id`]: id });
    }, [dispatch]),
    
    handleSetActiveTextField: useCallback((field) => {
      dispatch({ type: 'SET_ACTIVE_TEXT_FIELD', field });
    }, [dispatch]),
    
    handleClearSelection: useCallback(() => {
      dispatch({ type: 'CLEAR_SELECTION' });
    }, [dispatch]),
  };
}

/**
 * Standard initial state shape factory
 * @param {any} entities - Initial entities array
 * @param {string} pluralName - e.g., 'carousels'
 * @param {string} selectedIdKey - e.g., 'selectedCarouselId'
 * @param {Object} extraState - Additional state properties
 * @returns {Object} Initial state
 */
export function createInitialState(entities, pluralName, selectedIdKey, extraState = {}) {
  return {
    [pluralName]: entities,
    [selectedIdKey]: null,
    activeTextField: null,
    ...extraState,
  };
}

/**
 * Hook for managing the isLoaded state pattern
 * @param {Function} loadFn - Function to call on load
 * @returns {[boolean, Function]} [isLoaded, setIsLoaded]
 */
export function useLoadState(loadFn) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    loadFn();
    setIsLoaded(true);
  }, []);
  
  return [isLoaded, setIsLoaded];
}

/**
 * Get the selected entity from state
 * @param {Array} entities - Array of entities
 * @param {number|string|null} selectedId - Selected entity ID
 * @returns {Object|null} Selected entity or null
 */
export function getSelectedEntity(entities, selectedId) {
  if (!selectedId || !entities) return null;
  return entities.find(e => e.id === selectedId) || null;
}

