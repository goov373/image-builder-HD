// Central export for all components

// Error Boundaries - Critical for app stability
export { default as ErrorBoundary } from './ErrorBoundary';
export { default as SectionErrorBoundary } from './SectionErrorBoundary';

export { default as AccountPanel } from './AccountPanel';
export { default as FormatButton } from './FormatButton';
export { default as EditableTextField } from './EditableTextField';
export { LayoutBottomStack, LayoutCenterDrama, LayoutEditorialLeft } from './Layouts';
export { default as Sidebar } from './Sidebar';
export { default as DesignSystemPanel } from './DesignSystemPanel';
export { default as ExportPanel } from './ExportPanel';
export { default as Homepage } from './Homepage';
export { default as ProjectHeader } from './ProjectHeader';
export { default as NewProjectView } from './NewProjectView';
export { CarouselFrame, SortableFrame } from './CarouselFrame';
export { default as ImageLayer } from './ImageLayer';
export { default as PatternLayer } from './PatternLayer';
export { default as CarouselRow } from './CarouselRow';
export { default as Toolbar } from './Toolbar';
export { default as TabBar } from './TabBar';
export { default as EditorView } from './EditorView';
// New components for multi-project support
export { default as CTAButton } from './CTAButton';
export { default as EblastSection } from './EblastSection';
export { default as EblastEditor } from './EblastEditor';
export { default as VideoCoverFrame } from './VideoCoverFrame';
export { default as VideoCoverEditor } from './VideoCoverEditor';
export { PlayButtonOverlay, EpisodeNumber } from './overlays';
// Single Image / Product Mockup components
export { default as MockupFrame } from './MockupFrame';
export { default as StyleEditor } from './StyleEditor';
export { default as SingleImageEditor } from './SingleImageEditor';
export { DataChip, StatCard, Tooltip, Sparkline, AvatarGroup, ProgressRing } from './decorators';

// ===== REUSABLE COMPONENT LIBRARIES =====

// UI Primitives - Panels, sections, empty states
export { 
  Panel, 
  PanelHeader, 
  PanelSection, 
  PanelTabs, 
  PanelEmptyState 
} from './ui/index.js';

// Toolbar Components - Dropdowns, buttons, toggles
export { 
  ToolbarDropdown, 
  ToolbarDropdownItem, 
  ChevronIcon,
  ToolbarButtonGroup,
  ToolbarButton,
  ToolbarIconButton,
  ToolbarColorSwatch,
  ToolbarToggleGroup,
} from './toolbar/index.js';

// Design Panel Components - Image upload, gradients, patterns
export { 
  ImageUploader, 
  ImageGrid, 
  ImageCard,
  GradientPicker,
  ApplyModeToggle,
  FrameRangeSlider,
  GradientSwatch,
  ColorSwatch,
} from './design-panel/index.js';
