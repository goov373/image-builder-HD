import { useReducer, useEffect, useState, useCallback, Dispatch } from 'react';
import { createPatternLayer } from '../data';
import { logger } from '../utils';
import type { PatternLayer, ImageLayer, BackgroundOverride, ContentVariant } from '../types';

const STORAGE_KEY = 'carousel-tool-videocovers';

// ===== Types =====

export interface VideoCoverFrame {
  id: number;
  variants: ContentVariant[];
  currentVariant: number;
  currentLayout: number;
  layoutVariant: number;
  style: string;
  backgroundOverride?: BackgroundOverride;
  patternLayer?: PatternLayer;
  imageLayer?: ImageLayer;
}

export interface VideoCover {
  id: number;
  name: string;
  subtitle: string;
  frameSize: string;
  showPlayButton: boolean;
  episodeNumber?: string;
  frame: VideoCoverFrame;
}

export interface VideoCoverState {
  videoCovers: VideoCover[];
  selectedVideoCoverId: number | null;
  activeTextField: string | null;
}

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
  SET_BACKGROUND: 'SET_BACKGROUND',
  ADD_PATTERN: 'ADD_PATTERN',
  UPDATE_PATTERN: 'UPDATE_PATTERN',
  REMOVE_PATTERN: 'REMOVE_PATTERN',
  ADD_IMAGE: 'ADD_IMAGE',
  UPDATE_IMAGE: 'UPDATE_IMAGE',
  REMOVE_IMAGE: 'REMOVE_IMAGE',
} as const;

type VideoCoverActionType = typeof VIDEOCOVER_ACTIONS[keyof typeof VIDEOCOVER_ACTIONS];

export interface VideoCoverAction {
  type: VideoCoverActionType;
  videoCovers?: VideoCover[];
  videoCoverId?: number;
  field?: string;
  value?: string;
  key?: string;
  variantIndex?: number;
  layoutIndex?: number;
  newSize?: string;
  episodeNumber?: string;
  name?: string;
  background?: BackgroundOverride;
  patternId?: string;
  updates?: Partial<PatternLayer> | Partial<ImageLayer>;
  imageSrc?: string;
}

// Initial state
function createInitialState(videoCovers: VideoCover[]): VideoCoverState {
  return {
    videoCovers,
    selectedVideoCoverId: null,
    activeTextField: null,
  };
}

// Reducer
function videoCoverReducer(state: VideoCoverState, action: VideoCoverAction): VideoCoverState {
  switch (action.type) {
    case VIDEOCOVER_ACTIONS.SET_VIDEOCOVERS:
      return { ...state, videoCovers: action.videoCovers || [] };

    case VIDEOCOVER_ACTIONS.SELECT_VIDEOCOVER: {
      const { videoCoverId } = action;
      if (videoCoverId === state.selectedVideoCoverId) {
        return { ...state, selectedVideoCoverId: null, activeTextField: null };
      }
      return { ...state, selectedVideoCoverId: videoCoverId ?? null, activeTextField: null };
    }

    case VIDEOCOVER_ACTIONS.SET_ACTIVE_TEXT_FIELD:
      return { ...state, activeTextField: action.field ?? null };

    case VIDEOCOVER_ACTIONS.CLEAR_SELECTION:
      return { ...state, selectedVideoCoverId: null, activeTextField: null };

    case VIDEOCOVER_ACTIONS.SET_VARIANT:
      return {
        ...state,
        videoCovers: state.videoCovers.map((vc) => {
          if (vc.id !== action.videoCoverId) return vc;
          return {
            ...vc,
            frame: { ...vc.frame, currentVariant: action.variantIndex ?? 0 },
          };
        }),
      };

    case VIDEOCOVER_ACTIONS.SET_LAYOUT:
      return {
        ...state,
        videoCovers: state.videoCovers.map((vc) => {
          if (vc.id !== action.videoCoverId) return vc;
          return {
            ...vc,
            frame: { ...vc.frame, currentLayout: action.layoutIndex ?? 0, layoutVariant: 0 },
          };
        }),
      };

    case VIDEOCOVER_ACTIONS.SHUFFLE_LAYOUT_VARIANT:
      return {
        ...state,
        videoCovers: state.videoCovers.map((vc) => {
          if (vc.id !== action.videoCoverId) return vc;
          return {
            ...vc,
            frame: { ...vc.frame, layoutVariant: ((vc.frame.layoutVariant || 0) + 1) % 3 },
          };
        }),
      };

    case VIDEOCOVER_ACTIONS.UPDATE_TEXT:
      return {
        ...state,
        videoCovers: state.videoCovers.map((vc) => {
          if (vc.id !== action.videoCoverId) return vc;
          const updatedVariants = [...vc.frame.variants];
          updatedVariants[vc.frame.currentVariant] = {
            ...updatedVariants[vc.frame.currentVariant],
            [action.field || '']: action.value,
          };
          return {
            ...vc,
            frame: { ...vc.frame, variants: updatedVariants },
          };
        }),
      };

    case VIDEOCOVER_ACTIONS.UPDATE_FORMATTING:
      return {
        ...state,
        videoCovers: state.videoCovers.map((vc) => {
          if (vc.id !== action.videoCoverId) return vc;
          const updatedVariants = [...vc.frame.variants];
          const currentVariant = updatedVariants[vc.frame.currentVariant];
          const currentFormatting = currentVariant.formatting || {};
          const fieldFormatting = currentFormatting[action.field || ''] || {};
          updatedVariants[vc.frame.currentVariant] = {
            ...currentVariant,
            formatting: {
              ...currentFormatting,
              [action.field || '']: { ...fieldFormatting, [action.key || '']: action.value },
            },
          };
          return {
            ...vc,
            frame: { ...vc.frame, variants: updatedVariants },
          };
        }),
      };

    case VIDEOCOVER_ACTIONS.CHANGE_FRAME_SIZE:
      return {
        ...state,
        videoCovers: state.videoCovers.map((vc) =>
          vc.id === action.videoCoverId ? { ...vc, frameSize: action.newSize || vc.frameSize } : vc
        ),
      };

    case VIDEOCOVER_ACTIONS.TOGGLE_PLAY_BUTTON:
      return {
        ...state,
        videoCovers: state.videoCovers.map((vc) =>
          vc.id === action.videoCoverId ? { ...vc, showPlayButton: !vc.showPlayButton } : vc
        ),
      };

    case VIDEOCOVER_ACTIONS.UPDATE_EPISODE_NUMBER:
      return {
        ...state,
        videoCovers: state.videoCovers.map((vc) =>
          vc.id === action.videoCoverId ? { ...vc, episodeNumber: action.episodeNumber } : vc
        ),
      };

    case VIDEOCOVER_ACTIONS.ADD_VIDEOCOVER: {
      const newVideoCover: VideoCover = {
        id: Date.now(),
        name: action.name || 'New Video Cover',
        subtitle: 'Video Thumbnail',
        frameSize: 'youtube',
        showPlayButton: false,
        frame: {
          id: 1,
          variants: [
            { headline: 'Your Title', body: 'Your subtitle', formatting: {} },
            { headline: 'Alternative', body: 'Second version', formatting: {} },
            { headline: 'Third', body: 'Third version', formatting: {} },
          ],
          currentVariant: 0,
          currentLayout: 0,
          layoutVariant: 0,
          style: 'video-bold',
        },
      };
      return { ...state, videoCovers: [...state.videoCovers, newVideoCover], selectedVideoCoverId: newVideoCover.id };
    }

    case VIDEOCOVER_ACTIONS.REMOVE_VIDEOCOVER: {
      if (state.videoCovers.length <= 1) return state;
      return {
        ...state,
        selectedVideoCoverId: state.selectedVideoCoverId === action.videoCoverId ? null : state.selectedVideoCoverId,
        videoCovers: state.videoCovers.filter((vc) => vc.id !== action.videoCoverId),
      };
    }

    case VIDEOCOVER_ACTIONS.SET_BACKGROUND: {
      const { videoCoverId, background } = action;
      return {
        ...state,
        videoCovers: state.videoCovers.map((vc) => {
          if (vc.id !== videoCoverId) return vc;
          return {
            ...vc,
            frame: { ...vc.frame, backgroundOverride: background },
          };
        }),
      };
    }

    case VIDEOCOVER_ACTIONS.ADD_PATTERN: {
      const { videoCoverId, patternId } = action;
      const newPatternLayer = createPatternLayer(patternId || '');
      if (!newPatternLayer) return state;

      return {
        ...state,
        videoCovers: state.videoCovers.map((vc) => {
          if (vc.id !== videoCoverId) return vc;
          return {
            ...vc,
            frame: { ...vc.frame, patternLayer: newPatternLayer },
          };
        }),
      };
    }

    case VIDEOCOVER_ACTIONS.UPDATE_PATTERN: {
      const { videoCoverId, updates } = action;
      return {
        ...state,
        videoCovers: state.videoCovers.map((vc) => {
          if (vc.id !== videoCoverId || !vc.frame.patternLayer) return vc;
          return {
            ...vc,
            frame: { ...vc.frame, patternLayer: { ...vc.frame.patternLayer, ...updates } as PatternLayer },
          };
        }),
      };
    }

    case VIDEOCOVER_ACTIONS.REMOVE_PATTERN: {
      const { videoCoverId } = action;
      return {
        ...state,
        videoCovers: state.videoCovers.map((vc) => {
          if (vc.id !== videoCoverId) return vc;
          const { patternLayer: _patternLayer, ...restFrame } = vc.frame;
          return { ...vc, frame: restFrame as VideoCoverFrame };
        }),
      };
    }

    case VIDEOCOVER_ACTIONS.ADD_IMAGE: {
      const { videoCoverId, imageSrc } = action;
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
        videoCovers: state.videoCovers.map((vc) => {
          if (vc.id !== videoCoverId) return vc;
          return {
            ...vc,
            frame: { ...vc.frame, imageLayer: newImageLayer },
          };
        }),
      };
    }

    case VIDEOCOVER_ACTIONS.UPDATE_IMAGE: {
      const { videoCoverId, updates } = action;
      return {
        ...state,
        videoCovers: state.videoCovers.map((vc) => {
          if (vc.id !== videoCoverId || !vc.frame.imageLayer) return vc;
          return {
            ...vc,
            frame: { ...vc.frame, imageLayer: { ...vc.frame.imageLayer, ...updates } as ImageLayer },
          };
        }),
      };
    }

    case VIDEOCOVER_ACTIONS.REMOVE_IMAGE: {
      const { videoCoverId } = action;
      return {
        ...state,
        videoCovers: state.videoCovers.map((vc) => {
          if (vc.id !== videoCoverId) return vc;
          const { imageLayer: _imageLayer, ...restFrame } = vc.frame;
          return { ...vc, frame: restFrame as VideoCoverFrame };
        }),
      };
    }

    default:
      return state;
  }
}

// Load from localStorage
function loadFromStorage(initialData: VideoCover[]): VideoCover[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    logger.warn('Failed to load video covers from localStorage:', e);
  }
  return initialData;
}

// ===== Hook Return Type =====
export interface UseVideoCoversReturn {
  videoCovers: VideoCover[];
  selectedVideoCoverId: number | null;
  activeTextField: string | null;
  selectedVideoCover: VideoCover | undefined;
  dispatch: Dispatch<VideoCoverAction>;
  clearSelection: () => void;
  setActiveTextField: (field: string | null) => void;
  handleSelectVideoCover: (videoCoverId: number, closeAllDropdowns?: () => void) => void;
  handleSetVariant: (videoCoverId: number, variantIndex: number) => void;
  handleSetLayout: (videoCoverId: number, layoutIndex: number) => void;
  handleShuffleLayoutVariant: (videoCoverId: number) => void;
  handleUpdateText: (videoCoverId: number, frameId: number, field: string, value: string) => void;
  handleUpdateFormatting: (videoCoverId: number, frameId: number, field: string, key: string, value: unknown) => void;
  handleChangeFrameSize: (videoCoverId: number, newSize: string) => void;
  handleTogglePlayButton: (videoCoverId: number) => void;
  handleUpdateEpisodeNumber: (videoCoverId: number, episodeNumber: string) => void;
  handleAddVideoCover: (name?: string) => void;
  handleRemoveVideoCover: (videoCoverId: number) => void;
  handleSetBackground: (videoCoverId: number, background: BackgroundOverride) => void;
  handleAddPattern: (videoCoverId: number, patternId: string) => void;
  handleUpdatePattern: (videoCoverId: number, updates: Partial<PatternLayer>) => void;
  handleRemovePattern: (videoCoverId: number) => void;
  handleAddImage: (videoCoverId: number, imageSrc: string) => void;
  handleUpdateImage: (videoCoverId: number, updates: Partial<ImageLayer>) => void;
  handleRemoveImage: (videoCoverId: number) => void;
}

export default function useVideoCovers(initialData: VideoCover[]): UseVideoCoversReturn {
  const [initialized, setInitialized] = useState(false);
  const [state, dispatch] = useReducer(videoCoverReducer, loadFromStorage(initialData), createInitialState);

  // Computed values
  const selectedVideoCover = state.videoCovers.find((vc) => vc.id === state.selectedVideoCoverId);

  // Save to localStorage
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.videoCovers));
    } catch (e) {
      logger.warn('Failed to save video covers to localStorage:', e);
    }
  }, [state.videoCovers, initialized]);

  // Memoized actions
  const clearSelection = useCallback(() => dispatch({ type: VIDEOCOVER_ACTIONS.CLEAR_SELECTION }), []);

  const setActiveTextField = useCallback(
    (field: string | null) => dispatch({ type: VIDEOCOVER_ACTIONS.SET_ACTIVE_TEXT_FIELD, field: field ?? undefined }),
    []
  );

  const handleSelectVideoCover = useCallback((videoCoverId: number, closeAllDropdowns?: () => void) => {
    if (closeAllDropdowns) closeAllDropdowns();
    dispatch({ type: VIDEOCOVER_ACTIONS.SELECT_VIDEOCOVER, videoCoverId });
  }, []);

  const handleSetVariant = useCallback(
    (videoCoverId: number, variantIndex: number) =>
      dispatch({ type: VIDEOCOVER_ACTIONS.SET_VARIANT, videoCoverId, variantIndex }),
    []
  );

  const handleSetLayout = useCallback(
    (videoCoverId: number, layoutIndex: number) =>
      dispatch({ type: VIDEOCOVER_ACTIONS.SET_LAYOUT, videoCoverId, layoutIndex }),
    []
  );

  const handleShuffleLayoutVariant = useCallback(
    (videoCoverId: number) => dispatch({ type: VIDEOCOVER_ACTIONS.SHUFFLE_LAYOUT_VARIANT, videoCoverId }),
    []
  );

  const handleUpdateText = useCallback(
    (videoCoverId: number, _frameId: number, field: string, value: string) =>
      dispatch({ type: VIDEOCOVER_ACTIONS.UPDATE_TEXT, videoCoverId, field, value }),
    []
  );

  const handleUpdateFormatting = useCallback(
    (videoCoverId: number, _frameId: number, field: string, key: string, value: unknown) =>
      dispatch({ type: VIDEOCOVER_ACTIONS.UPDATE_FORMATTING, videoCoverId, field, key, value: value as string }),
    []
  );

  const handleChangeFrameSize = useCallback(
    (videoCoverId: number, newSize: string) =>
      dispatch({ type: VIDEOCOVER_ACTIONS.CHANGE_FRAME_SIZE, videoCoverId, newSize }),
    []
  );

  const handleTogglePlayButton = useCallback(
    (videoCoverId: number) => dispatch({ type: VIDEOCOVER_ACTIONS.TOGGLE_PLAY_BUTTON, videoCoverId }),
    []
  );

  const handleUpdateEpisodeNumber = useCallback(
    (videoCoverId: number, episodeNumber: string) =>
      dispatch({ type: VIDEOCOVER_ACTIONS.UPDATE_EPISODE_NUMBER, videoCoverId, episodeNumber }),
    []
  );

  const handleAddVideoCover = useCallback(
    (name?: string) => dispatch({ type: VIDEOCOVER_ACTIONS.ADD_VIDEOCOVER, name }),
    []
  );

  const handleRemoveVideoCover = useCallback(
    (videoCoverId: number) => dispatch({ type: VIDEOCOVER_ACTIONS.REMOVE_VIDEOCOVER, videoCoverId }),
    []
  );

  const handleSetBackground = useCallback(
    (videoCoverId: number, background: BackgroundOverride) =>
      dispatch({ type: VIDEOCOVER_ACTIONS.SET_BACKGROUND, videoCoverId, background }),
    []
  );

  const handleAddPattern = useCallback(
    (videoCoverId: number, patternId: string) =>
      dispatch({ type: VIDEOCOVER_ACTIONS.ADD_PATTERN, videoCoverId, patternId }),
    []
  );

  const handleUpdatePattern = useCallback(
    (videoCoverId: number, updates: Partial<PatternLayer>) =>
      dispatch({ type: VIDEOCOVER_ACTIONS.UPDATE_PATTERN, videoCoverId, updates }),
    []
  );

  const handleRemovePattern = useCallback(
    (videoCoverId: number) => dispatch({ type: VIDEOCOVER_ACTIONS.REMOVE_PATTERN, videoCoverId }),
    []
  );

  const handleAddImage = useCallback(
    (videoCoverId: number, imageSrc: string) =>
      dispatch({ type: VIDEOCOVER_ACTIONS.ADD_IMAGE, videoCoverId, imageSrc }),
    []
  );

  const handleUpdateImage = useCallback(
    (videoCoverId: number, updates: Partial<ImageLayer>) =>
      dispatch({ type: VIDEOCOVER_ACTIONS.UPDATE_IMAGE, videoCoverId, updates }),
    []
  );

  const handleRemoveImage = useCallback(
    (videoCoverId: number) => dispatch({ type: VIDEOCOVER_ACTIONS.REMOVE_IMAGE, videoCoverId }),
    []
  );

  return {
    // State
    videoCovers: state.videoCovers,
    selectedVideoCoverId: state.selectedVideoCoverId,
    activeTextField: state.activeTextField,
    // Computed
    selectedVideoCover,
    // Actions
    dispatch,
    clearSelection,
    setActiveTextField,
    handleSelectVideoCover,
    handleSetVariant,
    handleSetLayout,
    handleShuffleLayoutVariant,
    handleUpdateText,
    handleUpdateFormatting,
    handleChangeFrameSize,
    handleTogglePlayButton,
    handleUpdateEpisodeNumber,
    handleAddVideoCover,
    handleRemoveVideoCover,
    handleSetBackground,
    handleAddPattern,
    handleUpdatePattern,
    handleRemovePattern,
    handleAddImage,
    handleUpdateImage,
    handleRemoveImage,
  };
}

