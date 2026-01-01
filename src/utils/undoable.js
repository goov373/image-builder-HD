/**
 * Undoable Higher-Order Reducer
 * Wraps any reducer to add undo/redo functionality
 *
 * Based on the redux-undo pattern used by many production apps
 */

// Action types for undo/redo
export const UNDO = 'UNDO';
export const REDO = 'REDO';
export const CLEAR_HISTORY = 'CLEAR_HISTORY';

// Default configuration
const defaultConfig = {
  limit: 50, // Max history entries
  filter: () => true, // Which actions to track (return true to track)
  groupBy: null, // Optional: group rapid actions by type
  undoType: UNDO,
  redoType: REDO,
  clearHistoryType: CLEAR_HISTORY,
};

/**
 * Creates an undoable reducer wrapper
 * @param {Function} reducer - The original reducer to wrap
 * @param {Object} config - Configuration options
 * @returns {Function} The wrapped reducer with undo/redo support
 */
export function undoable(reducer, config = {}) {
  const { limit, filter, undoType, redoType, clearHistoryType } = { ...defaultConfig, ...config };

  // Default initial state - will be overridden by useReducer's initial state argument
  const defaultInitialState = {
    past: [],
    present: null,
    future: [],
  };

  return function undoableReducer(state = defaultInitialState, action) {
    const { past = [], present, future = [] } = state;

    switch (action.type) {
      case undoType: {
        // Can't undo if no past states
        if (past.length === 0) {
          return state;
        }

        const previous = past[past.length - 1];
        const newPast = past.slice(0, -1);

        return {
          past: newPast,
          present: previous,
          future: [present, ...future],
        };
      }

      case redoType: {
        // Can't redo if no future states
        if (future.length === 0) {
          return state;
        }

        const next = future[0];
        const newFuture = future.slice(1);

        return {
          past: [...past, present],
          present: next,
          future: newFuture,
        };
      }

      case clearHistoryType: {
        return {
          past: [],
          present: present,
          future: [],
        };
      }

      default: {
        // Run the wrapped reducer
        const newPresent = reducer(present, action);

        // If state didn't change, return as-is
        if (newPresent === present) {
          return state;
        }

        // Check if this action should be tracked in history
        const shouldTrack = filter(action, newPresent, present);

        if (!shouldTrack) {
          // Don't track, but still update present
          return {
            ...state,
            present: newPresent,
          };
        }

        // Track this action in history
        return {
          past: [...past, present].slice(-limit), // Limit history size
          present: newPresent,
          future: [], // Clear future on new action
        };
      }
    }
  };
}

/**
 * Helper to check if undo is available
 */
export function canUndo(state) {
  return state.past && state.past.length > 0;
}

/**
 * Helper to check if redo is available
 */
export function canRedo(state) {
  return state.future && state.future.length > 0;
}

/**
 * Helper to get history counts
 */
export function getHistoryCounts(state) {
  return {
    undoCount: state.past?.length || 0,
    redoCount: state.future?.length || 0,
  };
}

export default undoable;
