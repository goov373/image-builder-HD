export { useDropdowns } from './useDropdowns';
export { default as useTabs } from './useTabs';
export { default as useCarousels } from './useCarousels';
export { default as useEblasts } from './useEblasts';
export { default as useVideoCovers } from './useVideoCovers';
export { default as useSingleImages } from './useSingleImages';
export { default as useDesignSystem } from './useDesignSystem';
export { default as useAuth } from './useAuth';
export { default as useProjects } from './useProjects';

// Base hook utilities for creating new editor hooks
export {
  createBaseActionTypes,
  createBaseReducerCases,
  usePersistence,
  loadFromStorage,
  combineReducers,
  createBaseHandlers,
  createInitialState,
  useLoadState,
  getSelectedEntity,
} from './useEditorBase';

