# Architecture Context Document

**Purpose**: This document provides essential context for AI agents performing refactoring or design updates. It captures the carefully refined behaviors, states, and architectural decisions made during iterative development sessions.

**Last Updated**: December 31, 2025 (v0.9)

---

## Table of Contents

1. [CarouselFrame.jsx Overview](#carouselframejsx-overview)
2. [DesignSystemPanel.jsx Overview](#designsystempaneljsx-overview)
3. [Key Behavioral Rules](#key-behavioral-rules)
4. [Layer System Architecture](#layer-system-architecture)
5. [Dropdown Management System](#dropdown-management-system)
6. [Tool Panel System](#tool-panel-system)
7. [Drag-and-Drop Considerations](#drag-and-drop-considerations)
8. [Critical Design Decisions](#critical-design-decisions)

---

## CarouselFrame.jsx Overview

### File Location
`src/components/CarouselFrame.jsx` (~2185 lines)

### Purpose
Renders individual carousel frame/cards with all layer types, handles user interactions, and manages editing states for each layer type.

### Component Exports
- `CarouselFrame` - The main frame component
- `SortableFrame` - Wrapper that adds drag-and-drop via dnd-kit

### Internal Components
| Component | Purpose |
|-----------|---------|
| `SortableLayerRow` | Draggable row in the background layers panel |
| `ProgressIndicatorOverlay` | Renders 6 progress indicator styles (dots, arrows, bar, mapPins, forecast, barChart) |
| `ColorDropdown` | Brand color selector dropdown used in tool panels |
| `IconEditPanel` | Tool panel for editing icon layer |
| `ProgressEditPanel` | Tool panel for editing progress indicator |

### State Variables

```javascript
// Hover and basic interaction
const [isHovered, setIsHovered] = useState(false);

// Layer editing states - ONLY ONE CAN BE TRUE AT A TIME
const [isProgressEditing, setIsProgressEditing] = useState(false);
const [isImageEditing, setIsImageEditing] = useState(false);
const [isFillEditing, setIsFillEditing] = useState(false);
const [isPatternEditing, setIsPatternEditing] = useState(false);
const [isProductImageEditing, setIsProductImageEditing] = useState(false);
const [isIconEditing, setIsIconEditing] = useState(false);

// Initial states for cancel functionality
const [initialProgressState, setInitialProgressState] = useState(null);
const [initialImageState, setInitialImageState] = useState(null);
const [initialFillState, setInitialFillState] = useState(null);
const [initialPatternState, setInitialPatternState] = useState(null);
const [initialProductImageState, setInitialProductImageState] = useState(null);
const [initialIconState, setInitialIconState] = useState(null);

// Layer selection (for icon/product image - only one at a time)
const [selectedLayer, setSelectedLayer] = useState(null); // 'icon' | 'productImage' | null

// Triggers for ImageLayer component communication
const [imageEditTrigger, setImageEditTrigger] = useState(0);
const [imageCloseTrigger, setImageCloseTrigger] = useState(0);
```

### Key Props

```javascript
// Selection state
isFrameSelected    // This specific frame is clicked
isRowSelected      // The row containing this frame is open
isDragging         // This frame is currently being dragged
isDraggingAny      // ANY frame in the row is being dragged (hides all panels)

// Layer callbacks (each layer has add/update/remove)
onUpdateImageLayer, onRemoveImageFromFrame
onUpdateFillLayer, onClearBackground
onUpdatePatternLayer, onRemovePatternFromFrame
onUpdateProductImageLayer, onRemoveProductImageFromFrame
onUpdateIconLayer, onRemoveIconFromFrame
onUpdateProgressIndicator

// Design menu callbacks (opens sidebar to specific section)
onRequestAddProductImage
onRequestAddIcon
onRequestAddFill
onRequestAddPhoto
onRequestAddPattern
onRequestAddPageIndicator
```

### Critical Helper Function

```javascript
// MUST call this before opening any tool panel
const closeAllToolPanels = () => {
  setIsImageEditing(false);
  setIsFillEditing(false);
  setIsPatternEditing(false);
  setIsProductImageEditing(false);
  setIsIconEditing(false);
  setIsProgressEditing(false);
  // Also clear all initial states
  setInitialImageState(null);
  // ... etc
};
```

### Auto-Open Tool Panel Pattern

When content is added to a layer from the sidebar, the tool panel should automatically open. This uses `useRef` to track previous state and `useEffect` to detect changes:

```javascript
const prevIconRef = useRef(frame.iconLayer);

useEffect(() => {
  const wasEmpty = !prevIconRef.current;
  const nowHasContent = !!frame.iconLayer;
  
  // CRITICAL: Always update ref, but only open panel if not dragging
  if (!isDraggingAny && wasEmpty && nowHasContent) {
    closeAllToolPanels();
    setIsIconEditing(true);
    setInitialIconState({ ...frame.iconLayer });
  }
  
  // MUST update ref regardless of isDraggingAny to prevent false positives after drag
  prevIconRef.current = frame.iconLayer;
}, [frame.iconLayer, isDraggingAny]);
```

**Why this pattern**: After extensive debugging, we found that during drag-and-drop reordering, frames swap and `useEffect` can see a "content added" false positive. By always updating the ref but only opening panels when `!isDraggingAny`, we prevent tool panels from popping open after drag operations.

---

## DesignSystemPanel.jsx Overview

### File Location
`src/components/DesignSystemPanel.jsx` (~1535 lines)

### Purpose
Combined Design System, Assets upload, and Backgrounds panel. Acts as the main sidebar menu with two tabs: "Design" and "Assets".

### State Variables

```javascript
// Tab switching
const [activeTab, setActiveTab] = useState('design'); // 'design' | 'assets'

// Dropdown management - ONLY ONE SECTION OPEN AT A TIME
const [openSection, setOpenSection] = useState(null); // Design tab sections
const [openAssetSection, setOpenAssetSection] = useState(null); // Asset tab sections
const [sectionOrder, setSectionOrder] = useState(defaultSectionOrder); // Dynamic reordering

// Apply mode for backgrounds
const [applyMode, setApplyMode] = useState('frame'); // 'frame' | 'row'
const [stretchRange, setStretchRange] = useState({ start: 0, end: null });

// Uploads
const [uploadedFiles, setUploadedFiles] = useState([]);
const [uploadedDocs, setUploadedDocs] = useState([]);
const [uploadedProductImages, setUploadedProductImages] = useState([]);
```

### Section Order System

The Design tab has 6 dropdown sections that can be dynamically reordered:

```javascript
const defaultSectionOrder = ['pageIndicators', 'backgrounds', 'productImagery', 'photography', 'patterns', 'brandIcons'];
```

When a layer tag is clicked in CarouselFrame, it:
1. Opens the sidebar
2. Moves the relevant section to the TOP of the order
3. Opens that section (closes all others)

This is achieved via CSS `order` property:
```jsx
<div style={{ order: sectionOrder.indexOf('backgrounds') }}>
```

### Dropdown Toggle Logic

```javascript
const toggleSection = (section) => {
  const assetSections = ['yourImages', 'yourDocs', 'yourProductImages'];
  
  if (assetSections.includes(section)) {
    // Asset sections - simple toggle
    setOpenAssetSection(prev => prev === section ? null : section);
  } else {
    // Design sections - also reorder
    if (openSection === section) {
      setOpenSection(null); // Close if already open
    } else {
      setOpenSection(section);
      // Move to top of order
      setSectionOrder(prev => [section, ...prev.filter(s => s !== section)]);
    }
  }
};
```

### Key Props

```javascript
// External control of which section to expand
expandSectionOnOpen  // Set by CarouselFrame's onRequestAdd* callbacks

// Project type determines which handlers are active
projectType  // 'carousel' | 'eblast' | 'videoCover' | 'singleImage'

// Selection state
selectedCarouselId, selectedFrameId, selectedCarouselFrames
```

---

## Key Behavioral Rules

### Rule 1: One Tool Panel at a Time
Only one layer tool panel can be open at any time. When opening a new panel, `closeAllToolPanels()` MUST be called first.

### Rule 2: Two-Click Selection Flow
1. **First click on a frame**: Selects the frame, shows the layers table
2. **Second click on a layer within the frame**: Opens that layer's tool panel

You cannot open a tool panel directly by clicking a frame that isn't already selected.

### Rule 3: Layers Table vs Tool Panels (Mutually Exclusive)
- When a frame is selected but no layer is being edited: Show layers table
- When editing any layer: Hide layers table, show that layer's tool panel

Visibility condition for layers table:
```jsx
{isRowSelected && !isDraggingAny && 
 !isImageEditing && !isFillEditing && !isPatternEditing && 
 !isProductImageEditing && !isIconEditing && !isProgressEditing && (
  // Layers table content
)}
```

### Rule 4: Cancel Reverts, Done Saves
Each tool panel has:
- **Cancel**: Restores `initialXState` and closes panel
- **Done**: Keeps changes and closes panel
- **Delete** (trash icon): Removes layer entirely

### Rule 5: Panel Auto-Close on Deselection
When `isFrameSelected` becomes false:
- All tool panels close
- Layer selection clears
- Initial states reset

### Rule 6: Panel Auto-Close on Drag
When `isDraggingAny` becomes true:
- All tool panels close immediately
- Prevents UI confusion during card reordering

---

## Layer System Architecture

### Layer Hierarchy (Bottom to Top)

| Z-Index | Layer | Notes |
|---------|-------|-------|
| Container | Fixed white (#ffffff) | Always present, non-interactive |
| 1-3 (dynamic) | Fill Color | Reorderable via drag in layers panel |
| 1-3 (dynamic) | Brand Pattern | Reorderable via drag in layers panel |
| 1-3 (dynamic) | Background Photo | Reorderable via drag in layers panel |
| 10 | Text Layout | Always above backgrounds |
| 20 | Product Image | When present |
| 30 | Icon | When present |

### Dynamic Z-Index for Background Layers

```javascript
const getLayerZIndex = (layerType) => {
  const order = frame.backgroundLayerOrder || ['fill', 'pattern', 'image'];
  const baseZ = order.indexOf(layerType) + 1;
  if (layerType === 'image' && isImageEditing) return 50;
  return baseZ;
};
```

### Layers Table Structure

Organized into two sections:
1. **Foreground Layers**: Progress, Icon/Stat, Product Image
2. **Background Layers**: Background Photo, Brand Pattern, Fill Color (drag-to-reorder)

Each row shows:
- Icon + Label
- "empty" (ghosted, italic) OR "clear" (clickable, turns red on hover)

---

## Dropdown Management System

### Single-Open Rule
Only one dropdown section can be open at a time across the entire sidebar.

### Tab Switch Behavior
When switching between Design and Assets tabs:
```javascript
useEffect(() => {
  setOpenSection(null);
  setOpenAssetSection(null);
}, [activeTab]);
```

### Sidebar Close Behavior
When sidebar closes:
```javascript
useEffect(() => {
  if (!isOpen) {
    setOpenSection(null);
    setOpenAssetSection(null);
    setSectionOrder(defaultSectionOrder); // Reset order
  }
}, [isOpen]);
```

### External Section Expansion
When a layer tag is clicked (e.g., "Fill Color" when empty):
```javascript
useEffect(() => {
  if (expandSectionOnOpen) {
    setOpenSection(expandSectionOnOpen);
    setSectionOrder(prev => [expandSectionOnOpen, ...prev.filter(s => s !== expandSectionOnOpen)]);
  }
}, [expandSectionOnOpen]);
```

---

## Tool Panel System

### Common Tool Panel Structure

```jsx
<div className="mt-1.5 flex items-center gap-2 flex-wrap" 
     data-{type}-edit-controls
     onClick={(e) => e.stopPropagation()}
     onMouseDown={(e) => e.stopPropagation()}>
  
  {/* Control Groups (Opacity, Zoom, Rotation, etc.) */}
  <div className="flex items-center gap-1 bg-gray-800/90 rounded-lg px-2 py-1.5">
    {/* Controls */}
  </div>
  
  {/* Cancel Button */}
  <button className="bg-gray-700/90 hover:bg-gray-600 ...">Cancel</button>
  
  {/* Done Button - ALWAYS GREY, not purple or orange */}
  <button className="bg-gray-600/90 hover:bg-gray-500 ...">Done</button>
  
  {/* Delete Button (trash icon) */}
  <button className="bg-gray-800/90 hover:bg-red-600 ...">
    <TrashIcon />
  </button>
</div>
```

### Tool Panels by Layer

| Layer | Controls |
|-------|----------|
| Progress | Type selector (dots/arrows/bar), Color dropdown, Show/Hide toggle |
| Icon | Change button, Icon color, Border color, Fill color |
| Product Image | Zoom, Corner rounding |
| Fill Color | Opacity, Rotation (90° steps) |
| Background Photo | Zoom, Opacity (drag to reposition when editing) |
| Pattern | Opacity, Rotation (90° steps) |

---

## Drag-and-Drop Considerations

### Frame Reordering
- Uses `@dnd-kit/sortable` with `horizontalListSortingStrategy`
- Disabled when `isImageEditing` or `isProductImageDragging` is true
- `isDraggingAny` state propagated to all frames in row

### Preventing Tool Panel Glitches During Drag

1. **Close panels on drag start**:
```javascript
const handleDragStart = () => {
  setIsDraggingAny(true);
  onDeselectFrame?.(); // Only deselects frame, keeps row open
};
```

2. **Delay flag reset after drag end**:
```javascript
const handleDragEnd = (event) => {
  // ... reorder logic ...
  setTimeout(() => setIsDraggingAny(false), 150); // Allow animation to complete
};
```

3. **Auto-open effects check `isDraggingAny`**:
Tool panels won't auto-open during drag, but refs still update to prevent false positives.

### Background Layer Reordering
- Uses nested `DndContext` with `verticalListSortingStrategy`
- Only background layers (fill, pattern, image) are reorderable
- Foreground layers (progress, icon, product image) have fixed order

---

## Critical Design Decisions

### Decision 1: Frame Position Header
The "Frame X" header above each card is positioned with `position: absolute` and `bottom: 100%` to avoid affecting row alignment.

### Decision 2: Minimum Row Height
```jsx
<div className={`${isRowSelected && !isDraggingAny ? 'min-h-[52px]' : 'h-0'}`}>
```
This prevents layout "snap" when switching between layers table and tool panels.

### Decision 3: Add Frame Button Alignment
Add frame buttons use absolute positioning relative to the row container to stay vertically centered with cards regardless of what panels are open.

### Decision 4: Progress Indicator Default State
All cards start with progress indicator VISIBLE (not hidden). The `isHidden: false` or undefined means visible; only `isHidden: true` means hidden.

### Decision 5: Fill Color Default State
All cards start with the primary purple fill (`#6466e9`) applied by default. This was set via local storage migration to ensure consistent starting state.

### Decision 6: Grey Button Scheme
All "Done" buttons in tool panels use grey styling (`bg-gray-600/90`) - NOT orange or purple. This was a specific design decision for consistency.

### Decision 7: Scrollbar Always Visible
```jsx
<div className="flex-1 overflow-y-scroll overflow-x-hidden pl-2">
```
The sidebar uses `overflow-y-scroll` (not `auto`) to prevent width jumps when scrollbar appears/disappears.

### Decision 8: Pattern Default Opacity
When inserting a new pattern, opacity defaults to 100% (not 30%). This was changed because patterns looked "washed out" at lower opacity.

---

## File Dependencies

### CarouselFrame.jsx imports:
- `@dnd-kit/core` and `@dnd-kit/sortable` for drag-and-drop
- `ImageLayer`, `PatternLayer`, `ProductImageLayer`, `IconLayer` components
- `LayoutBottomStack`, `LayoutCenterDrama`, `LayoutEditorialLeft` layout components
- `frameSizes`, `getFontSizes`, `getFrameStyle` from data layer

### DesignSystemPanel.jsx imports:
- `ImageUploader`, `ImageGrid` from design-panel subdirectory
- `ApplyModeToggle`, `FrameRangeSlider` from GradientPicker
- Storage utilities for Supabase integration
- Brand data (`allGradients`, `solidColors`, `brandIcons`)

---

## Testing Checklist

When making changes, verify:

- [ ] Only one tool panel opens at a time
- [ ] Cancel reverts changes, Done saves them
- [ ] Tool panels close when clicking off the card
- [ ] Tool panels close when dragging cards
- [ ] No tool panels pop open after card reordering
- [ ] Clicking empty layer opens sidebar to correct section
- [ ] Clicking filled layer opens tool panel AND sidebar section
- [ ] Progress indicator shows "empty" when hidden, "clear" when visible
- [ ] Background layers can be reordered via drag
- [ ] All "Done" buttons are grey, not colored


