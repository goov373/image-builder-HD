import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        Blob: 'readonly',
        File: 'readonly',
        FileReader: 'readonly',
        FormData: 'readonly',
        Image: 'readonly',
        HTMLElement: 'readonly',
        MouseEvent: 'readonly',
        KeyboardEvent: 'readonly',
        Event: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        prompt: 'readonly',
        getComputedStyle: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        // Node/Build globals
        process: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        // Modern browser globals
        structuredClone: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React rules - mark JSX components as "used" so no-unused-vars doesn't flag them
      'react/jsx-uses-react': 'error', // Mark React as used when JSX is present
      'react/jsx-uses-vars': 'error', // Mark component imports as used when in JSX
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+
      'react/prop-types': 'off', // Using TypeScript for type checking
      'react/jsx-key': 'warn',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/no-children-prop': 'warn',
      'react/no-danger-with-children': 'error',
      'react/no-deprecated': 'warn',
      'react/no-direct-mutation-state': 'error',
      'react/no-unescaped-entities': 'warn',
      
      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      // General rules
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      'no-console': 'warn', // Warn on console.log (we're migrating to logger)
      'no-debugger': 'warn',
      'prefer-const': 'warn',
      'no-var': 'error',
      'eqeqeq': ['warn', 'smart'],
      
      // Design System Enforcement - Catch hardcoded colors
      // These rules help enforce the use of design tokens instead of hardcoded values
      'no-restricted-syntax': ['warn',
        {
          // Catch hex color literals in JSX/JS (e.g., '#ff0000', '#6466e9')
          selector: 'Literal[value=/^#[0-9a-fA-F]{3,8}$/]',
          message: '🎨 Use design tokens instead of hex colors. See docs/DESIGN-SYSTEM.md',
        },
        {
          // Catch rgb/rgba function calls
          selector: 'Literal[value=/^rgba?\\(/]',
          message: '🎨 Use design tokens instead of rgb/rgba colors. See docs/DESIGN-SYSTEM.md',
        },
      ],
    },
  },
  {
    // Ignore patterns
    ignores: [
      'dist/**',
      'node_modules/**',
      '*.config.js',
      '*.config.ts',
      'vite.config.js',
      'tailwind.config.js',
      'postcss.config.js',
      // TypeScript files - ESLint needs TypeScript parser for these
      // These files are for IDE type hints and are handled by TypeScript compiler
      '**/*.ts',
      '**/*.tsx',
    ],
  },
];

