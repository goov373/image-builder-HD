# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Full TypeScript migration for all hooks
  - `useCarousels.ts` - Carousel state management with full type safety
  - `useSingleImages.ts` - Single image editor state management
  - `useEblasts.ts` - Email blast editor state management
  - `useVideoCovers.ts` - Video cover state management
  - `useAuth.ts` - Authentication state and actions
  - `useKeyboardShortcuts.ts` - Global keyboard shortcut handlers
  - `useDesignSystem.ts` - Design system theme management
  - `useDropdowns.ts` - UI dropdown state management
  - `useTabs.ts` - Tab and project management
- TypeScript utilities with comprehensive types
  - `colorUtils.ts` - Color conversion and manipulation
  - `gradientParser.ts` - CSS gradient parsing
  - `undoable.ts` - Undo/redo higher-order reducer
  - `logger.ts` - Centralized logging utility
  - `imageCompression.ts` - Image optimization utilities
- Comprehensive test coverage (380+ tests)
  - Unit tests for all hooks using Vitest
  - Unit tests for utility functions
  - Component tests for UI primitives
  - E2E tests using Playwright
- CI/CD pipeline with GitHub Actions
  - Automated linting and formatting checks
  - Unit test execution with coverage
  - Build verification
  - E2E test execution
  - TypeScript type checking
- Error boundaries for crash resilience
  - `ErrorBoundary` - Full-page error fallback
  - `SectionErrorBoundary` - Inline error states for panels
- Code splitting optimization
  - Manual chunk configuration in Vite
  - Lazy loading for heavy panels (Account, Design System, Export)
  - Vendor chunk splitting (React, Supabase, Export tools, DnD)
- Developer experience improvements
  - ESLint with Prettier integration
  - `.env.example` for environment documentation
  - `CONTRIBUTING.md` guide
  - PropTypes for UI components

### Changed
- Migrated hooks from JavaScript to TypeScript
- Improved build output with optimized chunk sizes
- Updated test coverage thresholds to 20%

### Fixed
- Color conversion precision in `colorUtils`
- Gradient direction parsing in `gradientParser`
- Undo/redo edge cases with undefined state

## [1.0.0] - 2025-01-01

### Added
- Initial release of HTML Content Builder
- Carousel design tool with multiple layout options
- Single image mockup editor
- Email blast (eblast) template editor
- Video cover thumbnail designer
- Design system with customizable colors and fonts
- Export functionality (PNG, JPEG, ZIP)
- Local storage persistence
- Optional Supabase cloud sync
- Pattern overlay system with 20+ SVG patterns
- Image layer with pan, zoom, and rotation
- Icon layer with brand icons
- Product image layer for mockups
- Progress indicator customization
- Undo/redo support
- Keyboard shortcuts
- Responsive frame sizes (portrait, square, landscape, etc.)
- Multi-variant text content per frame
- Text formatting (font, size, color, alignment)
- Background gradients with HelloData brand colors

### Technical
- React 18 with Vite build system
- Tailwind CSS for styling
- @dnd-kit for drag-and-drop
- html-to-image for exports
- Supabase for authentication and storage

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2025-01-01 | Initial release |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to contribute to this project.

