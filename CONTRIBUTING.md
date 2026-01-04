# Contributing to HTML Content Builder

Thank you for your interest in contributing! This guide will help you get started.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- **npm** 9+ (comes with Node.js)

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/html-content-builder.git
cd html-content-builder

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start development server
npm run dev
```

The app runs at `http://localhost:3000`.

## 📁 Project Structure

```
src/
├── components/       # React components
│   ├── ui/          # Reusable UI primitives (Button, Input, etc.)
│   ├── carousel/    # Carousel-specific components
│   ├── layouts/     # Layout templates
│   └── overlays/    # Pattern and image overlays
├── hooks/           # Custom React hooks (TypeScript)
│   ├── useCarousels.ts    # Carousel state management
│   ├── useSingleImages.ts # Single image state
│   └── ...
├── context/         # React contexts
├── types/           # TypeScript type definitions
├── utils/           # Utility functions (TypeScript)
├── data/            # Static data and initial states
├── lib/             # External service integrations
└── config/          # App configuration
```

## 🧪 Development Workflow

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix auto-fixable lint issues |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run e2e` | Run Playwright E2E tests |

### Code Quality

Before submitting a PR, ensure:

```bash
# All checks pass
npm run lint
npm run test:run
npm run build
```

## 📝 Coding Standards

### TypeScript

- All new hooks should be written in TypeScript
- All utility functions should be TypeScript
- Use proper type annotations (avoid `any`)
- Export types for consumers

```typescript
// Good
export interface CarouselFrame {
  id: number;
  variants: ContentVariant[];
}

// Avoid
const frame: any = {};
```

### React Components

- Use functional components with hooks
- Add PropTypes for JavaScript components
- Use TypeScript for new components when possible
- Wrap components in `SectionErrorBoundary` for resilience

```jsx
// Component with PropTypes
import PropTypes from 'prop-types';

function MyComponent({ title, onAction }) {
  return <button onClick={onAction}>{title}</button>;
}

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  onAction: PropTypes.func.isRequired,
};
```

### File Naming

- React components: `PascalCase.jsx` or `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utilities: `camelCase.ts`
- Tests: `ComponentName.test.jsx` or `utility.test.js`

### Logging

Use the `logger` utility instead of `console.log`:

```typescript
import { logger } from '../utils';

// Good
logger.log('User action:', action);
logger.warn('Deprecated feature used');
logger.error('Failed to save:', error);

// Avoid (except in diagnostic tools)
console.log('...');
```

## 🧪 Testing

### Unit Tests (Vitest)

Tests are located next to source files in `__tests__/` directories:

```
src/hooks/
├── useCarousels.ts
└── __tests__/
    └── useCarousels.test.jsx
```

Run tests:

```bash
npm run test          # Watch mode
npm run test:run      # Single run
npm run test:coverage # With coverage
```

### E2E Tests (Playwright)

E2E tests are in the `e2e/` directory:

```bash
npm run e2e           # Run headlessly
npm run e2e:headed    # Run with browser visible
npm run e2e:ui        # Open Playwright UI
```

### Writing Tests

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

describe('useMyHook', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBe(0);
  });
});
```

## 🔄 Git Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new carousel layout option
fix: resolve export panel crash on empty frames
docs: update contributing guide
refactor: convert useCarousels to TypeScript
test: add tests for color utilities
```

### Pull Request Process

1. Create a feature branch from `main` or `v2`
2. Make your changes with tests
3. Run `npm run lint && npm run test:run && npm run build`
4. Push and create a PR
5. Wait for CI checks to pass
6. Request review from maintainers

## 🎨 UI Guidelines

### Design System Colors

The app uses CSS variables for theming:

```css
--color-primary: #6466e9;     /* HelloData purple */
--color-secondary: #8b5cf6;   /* Secondary purple */
--color-accent: #06b6d4;      /* Cyan accent */
```

### Tailwind CSS

We use Tailwind for styling. Prefer Tailwind classes over custom CSS:

```jsx
// Good
<button className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg">

// Avoid
<button style={{ padding: '8px 16px', backgroundColor: '#6466e9' }}>
```

## 🐛 Reporting Issues

When reporting bugs, include:

1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser/OS information
5. Console errors (if any)

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🙏 Thank You

Thank you for contributing to HTML Content Builder! Every contribution helps make the tool better for everyone.

