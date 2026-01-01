/**
 * undoable.test.js
 * Unit tests for the undo/redo higher-order reducer
 */

import { describe, it, expect } from 'vitest';
import { undoable, UNDO, REDO, CLEAR_HISTORY, canUndo, canRedo, getHistoryCounts } from '../undoable';

// Simple counter reducer for testing
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'SET':
      return { ...state, count: action.value };
    case 'NOOP':
      return state; // Returns same reference
    default:
      return state;
  }
}

describe('undoable', () => {
  // ========================================
  // Basic Functionality
  // ========================================
  describe('basic functionality', () => {
    it('wraps reducer and initializes with past/present/future structure', () => {
      const undoableCounter = undoable(counterReducer);
      const initialState = {
        past: [],
        present: { count: 0 },
        future: [],
      };
      
      const result = undoableCounter(initialState, { type: 'UNKNOWN' });
      
      expect(result).toHaveProperty('past');
      expect(result).toHaveProperty('present');
      expect(result).toHaveProperty('future');
    });

    it('passes actions to wrapped reducer', () => {
      const undoableCounter = undoable(counterReducer);
      const state = {
        past: [],
        present: { count: 0 },
        future: [],
      };
      
      const result = undoableCounter(state, { type: 'INCREMENT' });
      
      expect(result.present.count).toBe(1);
    });

    it('tracks actions in history (past)', () => {
      const undoableCounter = undoable(counterReducer);
      let state = {
        past: [],
        present: { count: 0 },
        future: [],
      };
      
      state = undoableCounter(state, { type: 'INCREMENT' });
      
      expect(state.past).toHaveLength(1);
      expect(state.past[0].count).toBe(0); // Previous state
      expect(state.present.count).toBe(1); // Current state
    });

    it('clears future when new action is dispatched', () => {
      const undoableCounter = undoable(counterReducer);
      let state = {
        past: [{ count: 0 }],
        present: { count: 1 },
        future: [{ count: 2 }], // Has future state
      };
      
      state = undoableCounter(state, { type: 'DECREMENT' });
      
      expect(state.future).toHaveLength(0);
    });
  });

  // ========================================
  // Undo
  // ========================================
  describe('undo', () => {
    it('restores previous state on UNDO', () => {
      const undoableCounter = undoable(counterReducer);
      const state = {
        past: [{ count: 0 }, { count: 1 }],
        present: { count: 2 },
        future: [],
      };
      
      const result = undoableCounter(state, { type: UNDO });
      
      expect(result.present.count).toBe(1); // Restored from past
      expect(result.past).toHaveLength(1); // Popped from past
      expect(result.future).toHaveLength(1); // Current pushed to future
      expect(result.future[0].count).toBe(2);
    });

    it('does nothing when past is empty', () => {
      const undoableCounter = undoable(counterReducer);
      const state = {
        past: [],
        present: { count: 5 },
        future: [],
      };
      
      const result = undoableCounter(state, { type: UNDO });
      
      expect(result).toBe(state); // Same reference, no change
    });

    it('can undo multiple times', () => {
      const undoableCounter = undoable(counterReducer);
      let state = {
        past: [{ count: 0 }, { count: 1 }, { count: 2 }],
        present: { count: 3 },
        future: [],
      };
      
      state = undoableCounter(state, { type: UNDO });
      expect(state.present.count).toBe(2);
      
      state = undoableCounter(state, { type: UNDO });
      expect(state.present.count).toBe(1);
      
      state = undoableCounter(state, { type: UNDO });
      expect(state.present.count).toBe(0);
      
      // Now past is empty
      expect(state.past).toHaveLength(0);
    });
  });

  // ========================================
  // Redo
  // ========================================
  describe('redo', () => {
    it('restores future state on REDO', () => {
      const undoableCounter = undoable(counterReducer);
      const state = {
        past: [{ count: 0 }],
        present: { count: 1 },
        future: [{ count: 2 }, { count: 3 }],
      };
      
      const result = undoableCounter(state, { type: REDO });
      
      expect(result.present.count).toBe(2); // Restored from future
      expect(result.future).toHaveLength(1); // Popped from future
      expect(result.past).toHaveLength(2); // Current pushed to past
    });

    it('does nothing when future is empty', () => {
      const undoableCounter = undoable(counterReducer);
      const state = {
        past: [{ count: 0 }],
        present: { count: 5 },
        future: [],
      };
      
      const result = undoableCounter(state, { type: REDO });
      
      expect(result).toBe(state); // Same reference, no change
    });

    it('can redo after undo', () => {
      const undoableCounter = undoable(counterReducer);
      let state = {
        past: [{ count: 0 }],
        present: { count: 1 },
        future: [],
      };
      
      // Undo
      state = undoableCounter(state, { type: UNDO });
      expect(state.present.count).toBe(0);
      expect(state.future).toHaveLength(1);
      
      // Redo
      state = undoableCounter(state, { type: REDO });
      expect(state.present.count).toBe(1);
      expect(state.past).toHaveLength(1);
    });
  });

  // ========================================
  // Clear History
  // ========================================
  describe('clear history', () => {
    it('clears past and future on CLEAR_HISTORY', () => {
      const undoableCounter = undoable(counterReducer);
      const state = {
        past: [{ count: 0 }, { count: 1 }],
        present: { count: 5 },
        future: [{ count: 3 }],
      };
      
      const result = undoableCounter(state, { type: CLEAR_HISTORY });
      
      expect(result.past).toHaveLength(0);
      expect(result.future).toHaveLength(0);
      expect(result.present.count).toBe(5); // Present preserved
    });
  });

  // ========================================
  // Filter
  // ========================================
  describe('filter configuration', () => {
    it('does not track filtered actions in history', () => {
      const undoableCounter = undoable(counterReducer, {
        filter: (action) => action.type !== 'INCREMENT', // Don't track INCREMENT
      });
      
      let state = {
        past: [],
        present: { count: 0 },
        future: [],
      };
      
      // INCREMENT should not be tracked
      state = undoableCounter(state, { type: 'INCREMENT' });
      expect(state.present.count).toBe(1);
      expect(state.past).toHaveLength(0); // Not tracked
      
      // DECREMENT should be tracked
      state = undoableCounter(state, { type: 'DECREMENT' });
      expect(state.present.count).toBe(0);
      expect(state.past).toHaveLength(1); // Tracked
    });

    it('updates present even for filtered actions', () => {
      const undoableCounter = undoable(counterReducer, {
        filter: () => false, // Don't track anything
      });
      
      let state = {
        past: [],
        present: { count: 0 },
        future: [],
      };
      
      state = undoableCounter(state, { type: 'INCREMENT' });
      
      expect(state.present.count).toBe(1); // Present updated
      expect(state.past).toHaveLength(0); // But not tracked
    });
  });

  // ========================================
  // Limit
  // ========================================
  describe('limit configuration', () => {
    it('limits history size to configured value', () => {
      const undoableCounter = undoable(counterReducer, { limit: 3 });
      
      let state = {
        past: [],
        present: { count: 0 },
        future: [],
      };
      
      // Add 5 actions
      for (let i = 1; i <= 5; i++) {
        state = undoableCounter(state, { type: 'SET', value: i });
      }
      
      expect(state.present.count).toBe(5);
      expect(state.past).toHaveLength(3); // Limited to 3
      expect(state.past[0].count).toBe(2); // Oldest kept
      expect(state.past[2].count).toBe(4); // Most recent
    });
  });

  // ========================================
  // State Reference Optimization
  // ========================================
  describe('state reference optimization', () => {
    it('returns same reference when reducer returns same state', () => {
      const undoableCounter = undoable(counterReducer);
      const state = {
        past: [],
        present: { count: 0 },
        future: [],
      };
      
      // NOOP returns same state reference
      const result = undoableCounter(state, { type: 'NOOP' });
      
      expect(result).toBe(state); // Same reference
    });
  });

  // ========================================
  // Helper Functions
  // ========================================
  describe('helper functions', () => {
    describe('canUndo', () => {
      it('returns true when past has entries', () => {
        const state = { past: [{ count: 0 }], present: { count: 1 }, future: [] };
        expect(canUndo(state)).toBe(true);
      });

      it('returns false when past is empty', () => {
        const state = { past: [], present: { count: 0 }, future: [] };
        expect(canUndo(state)).toBe(false);
      });

      it('handles undefined past', () => {
        expect(canUndo({})).toBeFalsy();
        expect(canUndo({ past: null })).toBeFalsy();
      });
    });

    describe('canRedo', () => {
      it('returns true when future has entries', () => {
        const state = { past: [], present: { count: 1 }, future: [{ count: 2 }] };
        expect(canRedo(state)).toBe(true);
      });

      it('returns false when future is empty', () => {
        const state = { past: [], present: { count: 0 }, future: [] };
        expect(canRedo(state)).toBe(false);
      });

      it('handles undefined future', () => {
        expect(canRedo({})).toBeFalsy();
        expect(canRedo({ future: null })).toBeFalsy();
      });
    });

    describe('getHistoryCounts', () => {
      it('returns counts of past and future', () => {
        const state = {
          past: [{ count: 0 }, { count: 1 }],
          present: { count: 2 },
          future: [{ count: 3 }],
        };
        
        const counts = getHistoryCounts(state);
        
        expect(counts.undoCount).toBe(2);
        expect(counts.redoCount).toBe(1);
      });

      it('handles missing properties', () => {
        const counts = getHistoryCounts({});
        
        expect(counts.undoCount).toBe(0);
        expect(counts.redoCount).toBe(0);
      });
    });
  });

  // ========================================
  // Integration: Full Undo/Redo Workflow
  // ========================================
  describe('integration: full workflow', () => {
    it('supports complete undo/redo workflow', () => {
      const undoableCounter = undoable(counterReducer);
      let state = {
        past: [],
        present: { count: 0 },
        future: [],
      };
      
      // 1. Make changes: 0 -> 1 -> 2 -> 3
      state = undoableCounter(state, { type: 'INCREMENT' }); // 1
      state = undoableCounter(state, { type: 'INCREMENT' }); // 2
      state = undoableCounter(state, { type: 'INCREMENT' }); // 3
      
      expect(state.present.count).toBe(3);
      expect(canUndo(state)).toBe(true);
      expect(canRedo(state)).toBe(false);
      
      // 2. Undo twice: 3 -> 2 -> 1
      state = undoableCounter(state, { type: UNDO });
      state = undoableCounter(state, { type: UNDO });
      
      expect(state.present.count).toBe(1);
      expect(canUndo(state)).toBe(true);
      expect(canRedo(state)).toBe(true);
      
      // 3. Redo once: 1 -> 2
      state = undoableCounter(state, { type: REDO });
      
      expect(state.present.count).toBe(2);
      
      // 4. Make new change (clears future): 2 -> 10
      state = undoableCounter(state, { type: 'SET', value: 10 });
      
      expect(state.present.count).toBe(10);
      expect(canRedo(state)).toBe(false); // Future cleared
      
      // 5. Can still undo to previous states
      expect(canUndo(state)).toBe(true);
      state = undoableCounter(state, { type: UNDO });
      expect(state.present.count).toBe(2);
    });
  });
});

