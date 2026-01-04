# Photograph Tool Panel Auto-Open Bug

## Issue Summary

When a user selects a photo from the Design menu sidebar to add as a background photograph layer, the Photograph tool panel should automatically appear (replacing the layers table). Currently, this **does not happen** - the user must manually click the "Photograph" row in the layers table to open the tool panel, which feels redundant.

## Expected Behavior

1. User clicks the "Photograph" row in the layers table → sidebar opens with photo options (this works)
2. User selects a photo from the sidebar menu
3. **The layers table should vanish and be replaced by the Photograph tool panel** (this does NOT work)
4. User can immediately begin editing photo settings (scale, position, opacity, etc.)

## Current Behavior

1. User clicks "Photograph" row → sidebar opens (works)
2. User selects a photo → photo is added to frame (works)
3. **Layers table remains visible** - user must click "Photograph" row again to open tool panel (BUG)

## Comparison: How Other Layers Work (Correctly)

Other layers like Fill Color, Pattern, and Icon automatically open their tool panels when content is added. The Photograph layer should follow the same pattern.

## Relevant Files

### Primary File: `src/components/CarouselFrame.jsx`

This is where the tool panel state management and auto-open logic lives.

#### Key State Variables (around line 170-180):
```jsx
const [isImageEditing, setIsImageEditing] = useState(false);
const [initialImageState, setInitialImageState] = useState(null);
```

#### The Auto-Open useEffect (around line 480-491):
```jsx
// Track previous image layer to detect when image is added
const prevImageRef = useRef(null);

useEffect(() => {
  const wasEmpty = !prevImageRef.current;
  const nowHasContent = !!frame.imageLayer;
  const imageChanged = prevImageRef.current?.src !== frame.imageLayer?.src;
  if (!isDraggingAny && nowHasContent && (wasEmpty || imageChanged)) {
    console.log('Opening image tool panel for frame', frame.id, '- setting isImageEditing to true');
    closeAllToolPanels();
    setIsImageEditing(true);
    setInitialImageState({ ...frame.imageLayer });
  }
  prevImageRef.current = frame.imageLayer;
}, [frame.imageLayer, isDraggingAny]);
```

#### The closeAllToolPanels Function (around line 550):
```jsx
const closeAllToolPanels = () => {
  setIsProgressEditing(false);
  setIsImageEditing(false);
  setIsFillEditing(false);
  setIsPatternEditing(false);
  setIsProductImageEditing(false);
  setIsIconEditing(false);
  setIsHeadlineEditing(false);
  setIsBodyEditing(false);
};
```

#### Problematic useEffect (around line 555-565):
There is a useEffect that closes tool panels when the frame is deselected:
```jsx
useEffect(() => {
  if (!isFrameSelected && !isRowSelected) {
    closeAllToolPanels();
  }
}, [isFrameSelected, isRowSelected]);
```

This was previously `if (!isFrameSelected)` which was prematurely closing the tool panel.

### Secondary File: `src/components/DesignSystemPanel.jsx`

This is where photos are selected from the sidebar. When a user clicks a photo, it calls:
```jsx
onSetFrameBackground(selectedCarouselId, selectedFrameId, imageUrl);
```

This triggers the `handleSetFrameBackground` function which updates `frame.imageLayer`.

### Handler Chain:

1. `DesignSystemPanel.jsx` → `onSetFrameBackground(carouselId, frameId, imageUrl)`
2. `CarouselDesignTool.jsx` → `handleSetFrameBackground` → updates carousel state
3. `CarouselFrame.jsx` → receives updated `frame.imageLayer` via props
4. `CarouselFrame.jsx` → `useEffect` should detect change and set `isImageEditing(true)`

## Previous Fix Attempts

### Attempt 1: Direct State Set
Changed from calling `handleImageEditModeChange(true)` to directly setting state:
```jsx
setIsImageEditing(true);
setInitialImageState({ ...frame.imageLayer });
```
**Result**: Did not fix the issue.

### Attempt 2: Check for Image Change
Added check for `imageChanged` to detect when image source changes:
```jsx
const imageChanged = prevImageRef.current?.src !== frame.imageLayer?.src;
if (!isDraggingAny && nowHasContent && (wasEmpty || imageChanged)) {
```
**Result**: Did not fix the issue.

### Attempt 3: Fix Premature Close
Changed the close condition from:
```jsx
if (!isFrameSelected) {
  closeAllToolPanels();
}
```
To:
```jsx
if (!isFrameSelected && !isRowSelected) {
  closeAllToolPanels();
}
```
**Result**: Did not fix the issue.

## Debugging Suggestions

1. Add console.log statements to trace the flow:
   - In `DesignSystemPanel.jsx` when `onSetFrameBackground` is called
   - In `CarouselFrame.jsx` in the `useEffect` for `frame.imageLayer`
   - Check if `isDraggingAny` is incorrectly `true`
   - Check if `closeAllToolPanels` is being called somewhere else after the state is set

2. Check timing issues:
   - The state update might be happening but then immediately being overwritten
   - Multiple re-renders might be resetting the state

3. Compare with working layers:
   - Fill layer (`isFillEditing`) works correctly - examine its useEffect
   - Pattern layer (`isPatternEditing`) works correctly - examine its useEffect

## Key Questions to Investigate

1. Is the `useEffect` for `frame.imageLayer` actually firing when a photo is selected?
2. Is `isDraggingAny` blocking the state update?
3. Is another `useEffect` or event handler calling `closeAllToolPanels()` after the image is set?
4. Is the component re-rendering and resetting `isImageEditing` to `false`?

## Tool Panel Rendering (around line 1600):

```jsx
{isImageEditing && !isDraggingAny && (
  <ImageToolPanel
    frame={frame}
    frameWidth={size.width}
    carouselId={carouselId}
    initialState={initialImageState}
    onCancel={handleCancelImageEdit}
    onDone={handleDoneImageEdit}
    onRemove={handleRemoveImage}
  />
)}
```

## File Line References

- `src/components/CarouselFrame.jsx`:
  - State declarations: ~170-180
  - prevImageRef declaration: ~470
  - Auto-open useEffect: ~480-491
  - closeAllToolPanels: ~550
  - Close on deselect useEffect: ~555-565
  - ImageToolPanel rendering: ~1600

- `src/components/DesignSystemPanel.jsx`:
  - Photo selection click handler: search for `onSetFrameBackground`

