import { useReducer, useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'carousel-tool-videocovers';

// Action types
export const VIDEOCOVER_ACTIONS = {
  SET_VIDEOCOVERS: 'SET_VIDEOCOVERS',
  SELECT_VIDEOCOVER: 'SELECT_VIDEOCOVER',
  SET_ACTIVE_TEXT_FIELD: 'SET_ACTIVE_TEXT_FIELD',
  CLEAR_SELECTION: 'CLEAR_SELECTION',
  SET_VARIANT: 'SET_VARIANT',
  SET_LAYOUT: 'SET_LAYOUT',
  SHUFFLE_LAYOUT_VARIANT: 'SHUFFLE_LAYOUT_VARIANT',
  UPDATE_TEXT: 'UPDATE_TEXT',
  UPDATE_FORMATTING: 'UPDATE_FORMATTING',
  CHANGE_FRAME_SIZE: 'CHANGE_FRAME_SIZE',
  TOGGLE_PLAY_BUTTON: 'TOGGLE_PLAY_BUTTON',
  UPDATE_EPISODE_NUMBER: 'UPDATE_EPISODE_NUMBER',
  ADD_VIDEOCOVER: 'ADD_VIDEOCOVER',
  REMOVE_VIDEOCOVER: 'REMOVE_VIDEOCOVER',
};

// Initial state
function createInitialState(videoCovers) {
  return {
    videoCovers,
    selectedVideoCoverId: null,
    activeTextField: null,
  };
}

// Reducer
function videoCoverReducer(state, action) {
  switch (action.type) {
    case VIDEOCOVER_ACTIONS.SET_VIDEOCOVERS:
      return { ...state, videoCovers: action.videoCovers };

    case VIDEOCOVER_ACTIONS.SELECT_VIDEOCOVER: {
      const { videoCoverId } = action;
      if (videoCoverId === state.selectedVideoCoverId) {
        return { ...state, selectedVideoCoverId: null, activeTextField: null };
      }
      return { ...state, selectedVideoCoverId: videoCoverId, activeTextField: null };
    }

    case VIDEOCOVER_ACTIONS.SET_ACTIVE_TEXT_FIELD:
      return { ...state, activeTextField: action.field };

    case VIDEOCOVER_ACTIONS.CLEAR_SELECTION:
      return { ...state, selectedVideoCoverId: null, activeTextField: null };

    case VIDEOCOVER_ACTIONS.SET_VARIANT:
      return {
        ...state,
        videoCovers: state.videoCovers.map(vc => {
          if (vc.id !== action.videoCoverId) return vc;
          return {
            ...vc,
            frame: { ...vc.frame, currentVariant: action.variantIndex }
          };
        })
      };

    case VIDEOCOVER_ACTIONS.SET_LAYOUT:
      return {
        ...state,
        videoCovers: state.videoCovers.map(vc => {
          if (vc.id !== action.videoCoverId) return vc;
          return {
            ...vc,
            frame: { ...vc.frame, currentLayout: action.layoutIndex, layoutVariant: 0 }
          };
        })
      };

    case VIDEOCOVER_ACTIONS.SHUFFLE_LAYOUT_VARIANT:
      return {
        ...state,
        videoCovers: state.videoCovers.map(vc => {
          if (vc.id !== action.videoCoverId) return vc;
          return {
            ...vc,
            frame: { ...vc.frame, layoutVariant: ((vc.frame.layoutVariant || 0) + 1) % 3 }
          };
        })
      };

    case VIDEOCOVER_ACTIONS.UPDATE_TEXT:
      return {
        ...state,
        videoCovers: state.videoCovers.map(vc => {
          if (vc.id !== action.videoCoverId) return vc;
          const updatedVariants = [...vc.frame.variants];
          updatedVariants[vc.frame.currentVariant] = {
            ...updatedVariants[vc.frame.currentVariant],
            [action.field]: action.value
          };
          return {
            ...vc,
            frame: { ...vc.frame, variants: updatedVariants }
          };
        })
      };

    case VIDEOCOVER_ACTIONS.UPDATE_FORMATTING:
      return {
        ...state,
        videoCovers: state.videoCovers.map(vc => {
          if (vc.id !== action.videoCoverId) return vc;
          const updatedVariants = [...vc.frame.variants];
          const currentVariant = updatedVariants[vc.frame.currentVariant];
          const currentFormatting = currentVariant.formatting || {};
          const fieldFormatting = currentFormatting[action.field] || {};
          updatedVariants[vc.frame.currentVariant] = {
            ...currentVariant,
            formatting: {
              ...currentFormatting,
              [action.field]: { ...fieldFormatting, [action.key]: action.value }
            }
          };
          return {
            ...vc,
            frame: { ...vc.frame, variants: updatedVariants }
          };
        })
      };

    case VIDEOCOVER_ACTIONS.CHANGE_FRAME_SIZE:
      return {
        ...state,
        videoCovers: state.videoCovers.map(vc =>
          vc.id === action.videoCoverId ? { ...vc, frameSize: action.newSize } : vc
        )
      };

    case VIDEOCOVER_ACTIONS.TOGGLE_PLAY_BUTTON:
      return {
        ...state,
        videoCovers: state.videoCovers.map(vc =>
          vc.id === action.videoCoverId ? { ...vc, showPlayButton: !vc.showPlayButton } : vc
        )
      };

    case VIDEOCOVER_ACTIONS.UPDATE_EPISODE_NUMBER:
      return {
        ...state,
        videoCovers: state.videoCovers.map(vc =>
          vc.id === action.videoCoverId ? { ...vc, episodeNumber: action.episodeNumber } : vc
        )
      };

    case VIDEOCOVER_ACTIONS.ADD_VIDEOCOVER: {
      const newVideoCover = {
        id: Date.now(),
        name: action.name || "New Video Cover",
        subtitle: "Video Thumbnail",
        frameSize: "youtube",
        showPlayButton: false,
        frame: {
          id: 1,
          variants: [
            { headline: "Your Title", body: "Your subtitle", formatting: {} },
            { headline: "Alternative", body: "Second version", formatting: {} },
            { headline: "Third", body: "Third version", formatting: {} }
          ],
          currentVariant: 0,
          currentLayout: 0,
          layoutVariant: 0,
          style: "video-bold"
        }
      };
      return { ...state, videoCovers: [...state.videoCovers, newVideoCover], selectedVideoCoverId: newVideoCover.id };
    }

    case VIDEOCOVER_ACTIONS.REMOVE_VIDEOCOVER: {
      if (state.videoCovers.length <= 1) return state;
      return {
        ...state,
        selectedVideoCoverId: state.selectedVideoCoverId === action.videoCoverId ? null : state.selectedVideoCoverId,
        videoCovers: state.videoCovers.filter(vc => vc.id !== action.videoCoverId)
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
    console.warn('Failed to load video covers from localStorage:', e);
  }
  return initialData;
}

export default function useVideoCovers(initialData) {
  const [initialized, setInitialized] = useState(false);
  const [state, dispatch] = useReducer(
    videoCoverReducer,
    loadFromStorage(initialData),
    createInitialState
  );

  // Computed values
  const selectedVideoCover = state.videoCovers.find(vc => vc.id === state.selectedVideoCoverId);

  // Save to localStorage
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.videoCovers));
    } catch (e) {
      console.warn('Failed to save video covers to localStorage:', e);
    }
  }, [state.videoCovers, initialized]);

  // Memoized actions
  const actions = {
    clearSelection: useCallback(() => dispatch({ type: VIDEOCOVER_ACTIONS.CLEAR_SELECTION }), []),
    
    setActiveTextField: useCallback((field) => 
      dispatch({ type: VIDEOCOVER_ACTIONS.SET_ACTIVE_TEXT_FIELD, field }), []),
    
    handleSelectVideoCover: useCallback((videoCoverId, closeAllDropdowns) => {
      if (closeAllDropdowns) closeAllDropdowns();
      dispatch({ type: VIDEOCOVER_ACTIONS.SELECT_VIDEOCOVER, videoCoverId });
    }, []),
    
    handleSetVariant: useCallback((videoCoverId, variantIndex) =>
      dispatch({ type: VIDEOCOVER_ACTIONS.SET_VARIANT, videoCoverId, variantIndex }), []),
    
    handleSetLayout: useCallback((videoCoverId, layoutIndex) =>
      dispatch({ type: VIDEOCOVER_ACTIONS.SET_LAYOUT, videoCoverId, layoutIndex }), []),
    
    handleShuffleLayoutVariant: useCallback((videoCoverId) =>
      dispatch({ type: VIDEOCOVER_ACTIONS.SHUFFLE_LAYOUT_VARIANT, videoCoverId }), []),
    
    handleUpdateText: useCallback((videoCoverId, frameId, field, value) =>
      dispatch({ type: VIDEOCOVER_ACTIONS.UPDATE_TEXT, videoCoverId, field, value }), []),
    
    handleUpdateFormatting: useCallback((videoCoverId, frameId, field, key, value) =>
      dispatch({ type: VIDEOCOVER_ACTIONS.UPDATE_FORMATTING, videoCoverId, field, key, value }), []),
    
    handleChangeFrameSize: useCallback((videoCoverId, newSize) =>
      dispatch({ type: VIDEOCOVER_ACTIONS.CHANGE_FRAME_SIZE, videoCoverId, newSize }), []),
    
    handleTogglePlayButton: useCallback((videoCoverId) =>
      dispatch({ type: VIDEOCOVER_ACTIONS.TOGGLE_PLAY_BUTTON, videoCoverId }), []),
    
    handleUpdateEpisodeNumber: useCallback((videoCoverId, episodeNumber) =>
      dispatch({ type: VIDEOCOVER_ACTIONS.UPDATE_EPISODE_NUMBER, videoCoverId, episodeNumber }), []),
    
    handleAddVideoCover: useCallback((name) =>
      dispatch({ type: VIDEOCOVER_ACTIONS.ADD_VIDEOCOVER, name }), []),
    
    handleRemoveVideoCover: useCallback((videoCoverId) =>
      dispatch({ type: VIDEOCOVER_ACTIONS.REMOVE_VIDEOCOVER, videoCoverId }), []),
  };

  return {
    // State
    videoCovers: state.videoCovers,
    selectedVideoCoverId: state.selectedVideoCoverId,
    activeTextField: state.activeTextField,
    // Computed
    selectedVideoCover,
    // Actions
    dispatch,
    ...actions,
  };
}

