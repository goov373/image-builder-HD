import { createContext, useContext, useReducer, useCallback, useRef, ReactNode } from 'react';

/**
 * History Context
 * Provides undo/redo functionality across the application
 *
 * Architecture:
 * - Stores state snapshots in a stack (max 50)
 * - Uses debouncing for rapid text input (300ms)
 * - Supports multiple state domains (carousels, eblasts, etc.)
 *
 * @example
 * ```tsx
 * // Wrap your app with HistoryProvider
 * <HistoryProvider onStateChange={handleStateRestore}>
 *   <App />
 * </HistoryProvider>
 *
 * // Use the hook in components
 * const { canUndo, undo, pushState } = useHistory();
 * ```
 */

const MAX_HISTORY_SIZE = 50;
const DEBOUNCE_MS = 300;

// ===== Types =====

/** Generic state that can be stored in history */
export type HistoryState = Record<string, unknown>;

/** History action types */
const HISTORY_ACTIONS = {
  PUSH: 'PUSH',
  UNDO: 'UNDO',
  REDO: 'REDO',
  CLEAR: 'CLEAR',
} as const;

type HistoryActionType = typeof HISTORY_ACTIONS[keyof typeof HISTORY_ACTIONS];

interface HistoryAction {
  type: HistoryActionType;
  state?: HistoryState;
}

interface HistoryStackState {
  past: HistoryState[];
  present: HistoryState | null;
  future: HistoryState[];
}

/** Context value provided to consumers */
export interface HistoryContextValue {
  /** Whether there are states to undo */
  canUndo: boolean;
  /** Whether there are states to redo */
  canRedo: boolean;
  /** Restore the previous state */
  undo: () => void;
  /** Restore a previously undone state */
  redo: () => void;
  /** Push a new state to history (with optional debouncing) */
  pushState: (state: HistoryState, actionType?: string) => void;
  /** Clear all history */
  clearHistory: () => void;
  /** Number of states in the undo stack */
  historyLength: number;
  /** Number of states in the redo stack */
  futureLength: number;
  /** Current state in history */
  currentState: HistoryState | null;
}

interface HistoryProviderProps {
  children: ReactNode;
  /** Callback when state is restored via undo/redo */
  onStateChange?: (state: HistoryState) => void;
}

// ===== Initial State =====

const initialHistoryState: HistoryStackState = {
  past: [],
  present: null,
  future: [],
};

// ===== Reducer =====

function historyReducer(state: HistoryStackState, action: HistoryAction): HistoryStackState {
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
        present: action.state || null,
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

// ===== Context =====

const defaultContextValue: HistoryContextValue = {
  canUndo: false,
  canRedo: false,
  undo: () => {},
  redo: () => {},
  pushState: () => {},
  clearHistory: () => {},
  historyLength: 0,
  futureLength: 0,
  currentState: null,
};

const HistoryContext = createContext<HistoryContextValue>(defaultContextValue);

// ===== Provider =====

/**
 * HistoryProvider - Provides undo/redo functionality to the application
 *
 * @param children - React children to wrap
 * @param onStateChange - Callback invoked when state is restored via undo/redo
 *
 * @example
 * ```tsx
 * function App() {
 *   const handleStateRestore = (state) => {
 *     // Restore your application state
 *     setCarousels(state.carousels);
 *   };
 *
 *   return (
 *     <HistoryProvider onStateChange={handleStateRestore}>
 *       <Editor />
 *     </HistoryProvider>
 *   );
 * }
 * ```
 */
export function HistoryProvider({ children, onStateChange }: HistoryProviderProps) {
  const [historyState, dispatch] = useReducer(historyReducer, initialHistoryState);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActionRef = useRef<string | null>(null);

  /**
   * Push a new state to history
   * Text-related actions are debounced to avoid creating too many history entries
   */
  const pushState = useCallback((state: HistoryState, actionType: string = 'unknown') => {
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

  /** Undo - restore previous state */
  const undo = useCallback(() => {
    if (historyState.past.length === 0) return;

    dispatch({ type: HISTORY_ACTIONS.UNDO });

    // Notify parent of state change
    const previousState = historyState.past[historyState.past.length - 1];
    if (onStateChange && previousState) {
      onStateChange(previousState);
    }
  }, [historyState.past, onStateChange]);

  /** Redo - restore future state */
  const redo = useCallback(() => {
    if (historyState.future.length === 0) return;

    dispatch({ type: HISTORY_ACTIONS.REDO });

    // Notify parent of state change
    const nextState = historyState.future[0];
    if (onStateChange && nextState) {
      onStateChange(nextState);
    }
  }, [historyState.future, onStateChange]);

  /** Clear all history */
  const clearHistory = useCallback(() => {
    dispatch({ type: HISTORY_ACTIONS.CLEAR });
  }, []);

  const value: HistoryContextValue = {
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

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}

// ===== Hook =====

/**
 * useHistory - Access undo/redo functionality
 *
 * @returns History context value with undo/redo controls
 * @throws Error if used outside of HistoryProvider
 *
 * @example
 * ```tsx
 * function EditorToolbar() {
 *   const { canUndo, canRedo, undo, redo, pushState } = useHistory();
 *
 *   const handleEdit = (newState) => {
 *     pushState(newState, 'UPDATE_TEXT');
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={undo} disabled={!canUndo}>Undo</button>
 *       <button onClick={redo} disabled={!canRedo}>Redo</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useHistory(): HistoryContextValue {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}

export default HistoryContext;

