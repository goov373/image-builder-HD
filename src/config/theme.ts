/**
 * HelloData Brand Theme Configuration
 * Centralized design tokens for consistent theming across the application
 *
 * Usage:
 * - Import specific tokens: import { colors, typography } from '@/config/theme'
 * - Use in Tailwind: Reference these values in tailwind.config.js extend section
 * - Use in components: Apply colors.primary.purple directly in inline styles
 */

// ===== BRAND COLORS =====
export const colors = {
  // Primary brand color
  primary: {
    purple: '#6466e9',
    purpleLight: '#818cf8',
    purpleLighter: '#a5b4fc',
    purplePale: '#c7d2fe',
    purpleBg: '#EEF2FF',
  },

  // Accent colors
  accent: {
    orange: '#F97316',
    orangeLight: '#f9a066',
    orangeLighter: '#fcb88a',
    orangePale: '#fdd8c2',
    gold: '#fbbf24',
  },

  // Neutral palette
  neutral: {
    white: '#ffffff',
    lightGrey: '#eef1f9',
    lightMediumGrey: '#9CA3AF',
    mediumGrey: '#6B7280',
    charcoal: '#2d2e30',
    shadow: '#18191A',
    black: '#000000',
  },

  // UI-specific colors (dark theme)
  ui: {
    background: '#18191A',
    surface: '#1f2022',
    surfaceHover: '#27282a',
    border: '#2d2e30',
    borderLight: '#374151', // gray-700
    text: {
      primary: '#ffffff',
      secondary: '#9CA3AF',
      muted: '#6B7280',
      disabled: '#4B5563',
    },
  },

  // Semantic colors
  semantic: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
} as const;

// ===== TYPOGRAPHY =====
export const typography = {
  fontFamily: {
    headline: '"DM Sans", sans-serif',
    body: '"Inter", sans-serif',
    mono: '"JetBrains Mono", monospace',
  },

  fontSize: {
    xs: '0.625rem', // 10px
    sm: '0.75rem', // 12px
    base: '0.875rem', // 14px
    lg: '1rem', // 16px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '2rem', // 32px
    '4xl': '2.5rem', // 40px
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// ===== SPACING =====
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
} as const;

// ===== ANIMATION =====
export const animation = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easing: {
    default: 'ease-out',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// ===== SHADOWS =====
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  glow: {
    purple: '0 0 20px rgba(100, 102, 233, 0.3)',
    orange: '0 0 20px rgba(249, 115, 22, 0.3)',
  },
} as const;

// ===== BORDER RADIUS =====
export const borderRadius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const;

// ===== Z-INDEX SCALE =====
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
} as const;

// ===== BREAKPOINTS =====
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ===== TAILWIND CLASS HELPERS =====
// Common class combinations for consistent styling
export const tailwindClasses = {
  // Button variants
  button: {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
    ghost: 'bg-transparent hover:bg-gray-800 text-gray-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  },

  // Input styling
  input: 'bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-gray-600',

  // Card/panel styling
  card: 'bg-gray-800 border border-gray-700 rounded-lg',

  // Common transitions
  transition: {
    fast: 'transition-all duration-150 ease-out',
    normal: 'transition-all duration-200 ease-out',
    slow: 'transition-all duration-300 ease-out',
  },
} as const;

// ===== TYPE EXPORTS =====
export type ThemeColors = typeof colors;
export type ThemeTypography = typeof typography;
export type ThemeSpacing = typeof spacing;
export type ThemeAnimation = typeof animation;

// Combined theme export
export const theme = {
  colors,
  typography,
  spacing,
  animation,
  shadows,
  borderRadius,
  zIndex,
  breakpoints,
  tailwindClasses,
} as const;

export default theme;
