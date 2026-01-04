# Remaining Stability & Quality Improvements

This document outlines the remaining improvements from the original codebase audit that were **not yet implemented**. These can be tackled incrementally in future work sessions.

---

## 1. AbortController for Async Operations (Phase 2.2 & 8)

### Problem
Long-running async operations (Supabase storage uploads/downloads, image exports) can continue executing after a component unmounts or user navigates away, potentially causing:
- Unnecessary network usage
- Memory leaks
- State updates on unmounted components
- Poor UX when users want to cancel operations

### Solution
Implement `AbortController` pattern to allow cancellation of:
- **Supabase storage operations** (`src/hooks/useSupabaseStorage.ts`, `src/hooks/useAuth.ts`)
- **Export operations** (`src/components/ExportPanel.jsx`)
- **Image uploads** (`src/components/design-panel/ImageUploader.jsx`)

### Implementation Notes
- Supabase SDK doesn't natively support `AbortSignal`, so this requires wrapper functions
- Add cancel buttons in UI for long-running operations
- Auto-cancel on component unmount using cleanup functions

### Files to Modify
- `src/hooks/useSupabaseStorage.ts`
- `src/components/ExportPanel.jsx`
- `src/components/design-panel/ImageUploader.jsx`

### Estimated Effort
Medium (4-6 hours) - requires careful testing of cancellation scenarios

---

## 2. State Cloning Optimization (Phase 7)

### Problem
Currently using `structuredClone()` for all state snapshots in `HistoryContext`. While correct for deep nested state, it's potentially slower than necessary for shallow or partially-deep objects.

### Solution
Optimize cloning strategy based on data depth:
- **Shallow clones** for simple objects (spread operator)
- **Partial deep clones** for mixed objects (shallow spread + targeted deep clones)
- **Full deep clones** only for complex nested state (current `structuredClone`)

### Implementation Notes
- Analyze state shape to determine optimal cloning strategy
- Consider using `immer` library for immutable updates
- Benchmark performance before/after optimization
- Ensure undo/redo functionality remains correct

### Files to Modify
- `src/context/HistoryContext.tsx`

### Estimated Effort
Medium (3-4 hours) - requires performance profiling and testing

---

## 3. Complete JSX to TSX Migration (Phase 9 - Partial)

### Completed Migrations ✓
- `src/components/ui/Toast.jsx` → `.tsx`
- `src/components/Homepage.jsx` → `.tsx`
- `src/components/ImageLayer.jsx` → `.tsx`

### Remaining Critical Files

#### High Priority (Complex Components)
- `src/CarouselDesignTool.jsx` - Main app orchestration component
- `src/components/ExportPanel.jsx` - Export logic with async operations
- `src/components/DesignSystemPanel.jsx` - Design system management
- `src/components/AccountPanel.jsx` - Account/auth UI
- `src/components/EditorView.jsx` - Main editor view
- `src/components/CarouselFrame.jsx` - Frame component with drag/drop
- `src/components/Toolbar.jsx` - Main toolbar
- `src/components/TabBar.jsx` - Tab navigation

#### Medium Priority (Feature Components)
- `src/components/EblastEditor.jsx`
- `src/components/VideoCoverEditor.jsx`
- `src/components/SingleImageEditor.jsx`
- `src/components/StyleEditor.jsx`
- `src/components/MockupFrame.jsx`
- `src/components/EditableTextField.jsx`
- `src/components/Layouts.jsx`
- `src/components/PatternLayer.jsx`
- `src/components/IconLayer.jsx`
- `src/components/ProductImageLayer.jsx`

#### Lower Priority (Smaller Components)
- All files in `src/components/carousel/tool-panels/`
- All files in `src/components/design-panel/`
- All files in `src/components/decorators/`
- All files in `src/components/overlays/`
- All files in `src/components/toolbar/`
- All files in `src/components/ui/` (except Toast, already done)
- All files in `src/components/layouts/`

### Migration Strategy
1. Start with leaf components (no dependencies on other JSX files)
2. Move up to parent components
3. Add proper TypeScript interfaces for props
4. Create `.d.ts` declaration files for components that remain `.jsx` temporarily
5. Test each migration thoroughly

### Estimated Effort
Large (20-30 hours total) - can be done incrementally over multiple sessions

---

## 4. Additional Type Safety Improvements

### Problem
While we added types to `DropdownsContext` and created `Button.d.ts`, many other parts of the codebase still lack strong typing.

### Opportunities for Improvement

#### Context Types
- `DesignSystemContext` - Define explicit interface for design system state
- `SelectionContext` - Type selection state and methods
- `CarouselsContext` - Type carousel state management
- `HistoryContext` - Already partially typed, but could be stricter

#### Hook Return Types
- `useTabs` - Export and use `UseTabsReturn` interface
- `useCarousel` - Define carousel hook types
- `useSupabaseStorage` - Storage operation types
- `useDesignSystem` - Design system hook types

#### Utility Function Types
- `src/utils/exportImage.js` → `.ts`
- `src/utils/logger.js` → `.ts`
- `src/utils/exportDiagnostics.js` → `.ts`

### Files to Modify
- `src/context/AppContext.tsx`
- `src/hooks/*.ts` (add explicit return types)
- `src/utils/*.js` → `.ts`

### Estimated Effort
Medium (6-8 hours) - incremental improvement

---

## 5. Error Boundary Granularity (Phase 4 - Optional Enhancement)

### Current State ✓
- Root-level `ErrorBoundary` wraps entire app
- `SectionErrorBoundary` wraps individual panels

### Enhancement Opportunity
Add error boundaries around specific high-risk operations:
- **Export operations** - Wrap export UI to gracefully handle export failures
- **Image rendering** - Catch image loading/rendering errors
- **Storage operations** - Handle Supabase connection failures
- **Undo/redo operations** - Catch state restoration errors

### Implementation Notes
- Create specialized error boundaries with custom fallback UI
- Add error recovery actions (retry, reset state, clear cache)
- Log errors to external service (optional future enhancement)

### Estimated Effort
Small (2-3 hours) - mostly UI work

---

## 6. Performance Monitoring & Metrics

### Problem
No visibility into app performance in production or during development.

### Solution
Add performance monitoring for:
- **Render performance** - Track expensive re-renders
- **Export performance** - Measure export time by complexity
- **Storage operations** - Monitor upload/download speeds
- **Undo/redo performance** - Track history state size

### Implementation Ideas
- Use React DevTools Profiler API
- Add custom performance marks
- Create debug panel showing performance metrics
- Optional: Integrate with external monitoring (Sentry, LogRocket)

### Files to Create/Modify
- `src/utils/performance.ts` - Performance monitoring utilities
- `src/components/DevPanel.jsx` - Developer debug panel (dev only)
- `src/context/PerformanceContext.tsx` - Performance tracking context

### Estimated Effort
Medium (4-5 hours) - depends on scope

---

## 7. Test Coverage Improvements

### Current State
Some components have tests in `src/components/ui/__tests__/`, but coverage is limited.

### Areas Lacking Tests
- **Context providers** - HistoryContext, AppContext, etc.
- **Custom hooks** - useTabs, useAuth, useDropdowns, etc.
- **Complex components** - CarouselDesignTool, EditorView, ExportPanel
- **Utility functions** - Export utilities, image processing

### Recommended Approach
1. Add tests for critical paths first (auth, export, undo/redo)
2. Add integration tests for key user flows
3. Add unit tests for utility functions
4. Consider E2E tests with Playwright/Cypress

### Estimated Effort
Large (15-20 hours) - ongoing effort

---

## Priority Recommendations

### Quick Wins (1-2 sessions)
1. ✅ Complete critical JSX → TSX migrations (CarouselDesignTool, ExportPanel, EditorView)
2. ✅ Add more `.d.ts` files for remaining `.jsx` components
3. ✅ Add explicit return types to all hooks

### Medium Term (2-4 sessions)
1. ⚠️ Implement AbortController for async operations
2. ⚠️ Optimize state cloning in HistoryContext
3. ⚠️ Add performance monitoring basics

### Long Term (Ongoing)
1. 📋 Complete all JSX → TSX migrations
2. 📋 Improve test coverage
3. 📋 Add production error monitoring

---

## Notes

- All improvements should be made incrementally with testing between changes
- Prioritize user-facing stability over architectural perfection
- Consider creating feature flags for experimental optimizations
- Document all breaking changes or behavior modifications

---

**Last Updated:** 2026-01-04  
**Related:** See git history for completed Phase 1-6 improvements

