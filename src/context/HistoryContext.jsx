import { createContext, useContext, useReducer, useCallback, useRef } from 'react';

/**
 * History Context
 * Provides undo/redo functionality across the application
 * 
 * Architecture:
 * - Stores state snapshots in a stack (max 50)
 * - Uses debouncing for rapid text input (300ms)
 * - Supports multiple state domains (carousels, eblasts, etc.)
 */

const MAX_HISTORY_SIZE = 50;
const DEBOUNCE_MS = 300;

// History actions
const HISTORY_ACTIONS = {
  PUSH: 'PUSH',
  UNDO: 'UNDO',
  REDO: 'REDO',
  CLEAR: 'CLEAR',
};

// History state structure
const initialHistoryState = {
  past: [],      // Stack of past states
  present: null, // Current state (managed externally)
  future: [],    // Stack of undone states (for redo)
};

function historyReducer(state, action) {
  switch (action.type) {
    case HISTORY_ACTIONS.PUSH: {
      // Don't push if state hasn't changed
      if (state.present && JSON.stringify(state.present) === JSON.stringify(action.state)) {
        return state;
      }
      
      const newPast = state.present 
        ? [...state.past, state.present].slice(-MAX_HISTORY_SIZE)
        : state.past;
      
      return {
        past: newPast,
        present: action.state,
        future: [], // Clear future on new action
      };
    }
    
    case HISTORY_ACTIONS.UNDO: {
      if (state.past.length === 0) return state;
      
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      
      return {
        past: newPast,
        present: previous,
        future: state.present ? [state.present, ...state.future] : state.future,
      };
    }
    
    case HISTORY_ACTIONS.REDO: {
      if (state.future.length === 0) return state;
      
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      
      return {
        past: state.present ? [...state.past, state.present] : state.past,
        present: next,
        future: newFuture,
      };
    }
    
    case HISTORY_ACTIONS.CLEAR: {
      return initialHistoryState;
    }
    
    default:
      return state;
  }
}

const HistoryContext = createContext({
  canUndo: false,
  canRedo: false,
  undo: () => {},
  redo: () => {},
  pushState: () => {},
  clearHistory: () => {},
  historyLength: 0,
  futureLength: 0,
});

export function HistoryProvider({ children, onStateChange }) {
  const [historyState, dispatch] = useReducer(historyReducer, initialHistoryState);
  const debounceRef = useRef(null);
  const lastActionRef = useRef(null);

  // Push a new state to history (with debouncing for text input)
  const pushState = useCallback((state, actionType = 'unknown') => {
    // Clear any pending debounced push
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce text-related actions
    const shouldDebounce = actionType.includes('TEXT') || actionType.includes('FORMATTING');
    
    if (shouldDebounce && lastActionRef.current === actionType) {
      debounceRef.current = setTimeout(() => {
        dispatch({ type: HISTORY_ACTIONS.PUSH, state: structuredClone(state) });
        lastActionRef.current = null;
      }, DEBOUNCE_MS);
    } else {
      dispatch({ type: HISTORY_ACTIONS.PUSH, state: structuredClone(state) });
    }
    
    lastActionRef.current = actionType;
  }, []);

  // Undo - restore previous state
  const undo = useCallback(() => {
    if (historyState.past.length === 0) return;
    
    dispatch({ type: HISTORY_ACTIONS.UNDO });
    
    // Notify parent of state change
    const previousState = historyState.past[historyState.past.length - 1];
    if (onStateChange && previousState) {
      onStateChange(previousState);
    }
  }, [historyState.past, onStateChange]);

  // Redo - restore future state
  const redo = useCallback(() => {
    if (historyState.future.length === 0) return;
    
    dispatch({ type: HISTORY_ACTIONS.REDO });
    
    // Notify parent of state change
    const nextState = historyState.future[0];
    if (onStateChange && nextState) {
      onStateChange(nextState);
    }
  }, [historyState.future, onStateChange]);

  // Clear all history
  const clearHistory = useCallback(() => {
    dispatch({ type: HISTORY_ACTIONS.CLEAR });
  }, []);

  const value = {
    canUndo: historyState.past.length > 0,
    canRedo: historyState.future.length > 0,
    undo,
    redo,
    pushState,
    clearHistory,
    historyLength: historyState.past.length,
    futureLength: historyState.future.length,
    currentState: historyState.present,
  };

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}

export default HistoryContext;

