/**
 * Undoable Higher-Order Reducer
 * Wraps any reducer to add undo/redo functionality
 *
 * Based on the redux-undo pattern used by many production apps
 */

// ===== Type Definitions =====

/** State shape for undoable reducer */
export interface UndoableState<T> {
  past: T[];
  present: T;
  future: T[];
}

/** Filter function type - determines if an action should be tracked */
export type ActionFilter<A, T> = (action: A, newPresent: T, previousPresent: T) => boolean;

/** Configuration options for undoable */
export interface UndoableConfig<A, T> {
  /** Maximum number of history entries to keep */
  limit?: number;
  /** Filter function to determine which actions to track */
  filter?: ActionFilter<A, T>;
  /** Optional: group rapid actions by type */
  groupBy?: ((action: A) => string | null) | null;
  /** Custom undo action type */
  undoType?: string;
  /** Custom redo action type */
  redoType?: string;
  /** Custom clear history action type */
  clearHistoryType?: string;
}

/** Base action type with type property - minimal constraint for generic actions */
export interface Action {
  type: string;
}

// ===== Action Types =====

export const UNDO = 'UNDO';
export const REDO = 'REDO';
export const CLEAR_HISTORY = 'CLEAR_HISTORY';

// ===== Default Configuration =====

const defaultConfig: Required<UndoableConfig<Action, unknown>> = {
  limit: 50,
  filter: () => true,
  groupBy: null,
  undoType: UNDO,
  redoType: REDO,
  clearHistoryType: CLEAR_HISTORY,
};

// ===== Undoable Reducer Factory =====

/**
 * Creates an undoable reducer wrapper
 * @param reducer - The original reducer to wrap
 * @param config - Configuration options
 * @returns The wrapped reducer with undo/redo support
 */
export function undoable<T, A extends { type: string }>(
  reducer: (state: T, action: A) => T,
  config: UndoableConfig<A, T> = {}
): (state: UndoableState<T> | undefined, action: A) => UndoableState<T> {
  const mergedConfig = { ...defaultConfig, ...config } as Required<UndoableConfig<A, T>>;
  const { limit, filter, undoType, redoType, clearHistoryType } = mergedConfig;

  // Default initial state - will be overridden by useReducer's initial state argument
  const defaultInitialState: UndoableState<T> = {
    past: [],
    present: null as unknown as T,
    future: [],
  };

  return function undoableReducer(
    state: UndoableState<T> = defaultInitialState,
    action: A
  ): UndoableState<T> {
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

// ===== Helper Functions =====

/**
 * Check if undo is available
 * @param state - Undoable state
 * @returns true if there are past states to undo to
 */
export function canUndo<T>(state: UndoableState<T> | Partial<UndoableState<T>>): boolean {
  return Boolean(state.past && state.past.length > 0);
}

/**
 * Check if redo is available
 * @param state - Undoable state
 * @returns true if there are future states to redo to
 */
export function canRedo<T>(state: UndoableState<T> | Partial<UndoableState<T>>): boolean {
  return Boolean(state.future && state.future.length > 0);
}

/**
 * Get history counts
 * @param state - Undoable state
 * @returns Object with undoCount and redoCount
 */
export function getHistoryCounts<T>(
  state: Partial<UndoableState<T>>
): { undoCount: number; redoCount: number } {
  return {
    undoCount: state.past?.length || 0,
    redoCount: state.future?.length || 0,
  };
}

export default undoable;

