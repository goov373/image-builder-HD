/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    /* 
     * LOCKED DOWN COLOR PALETTE
     * Only design tokens are allowed - no default Tailwind colors
     * This prevents accidental use of gray-*, purple-*, etc.
     */
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',
      /* Surface colors (luminosity-based elevation) */
      surface: {
        canvas: 'var(--surface-canvas)',
        sunken: 'var(--surface-sunken)',
        DEFAULT: 'var(--surface-default)',
        raised: 'var(--surface-raised)',
        overlay: 'var(--surface-overlay)',
        elevated: 'var(--surface-elevated)',
      },
      /* Semantic colors */
      semantic: {
        success: 'var(--semantic-success)',
        warning: 'var(--semantic-warning)',
        error: 'var(--semantic-error)',
        info: 'var(--semantic-info)',
      },
      /* Accent colors */
      accent: {
        layer: 'var(--accent-layer)',
        'layer-subtle': 'var(--accent-layer-subtle)',
        'layer-muted': 'var(--accent-layer-muted)',
        brand: 'var(--accent-brand)',
        'brand-hover': 'var(--accent-brand-hover)',
      },
      /* Legacy support - map common grays to our tokens for gradual migration */
      gray: {
        50: 'var(--surface-elevated)',
        100: 'var(--surface-elevated)',
        200: 'var(--surface-overlay)',
        300: 'var(--surface-overlay)',
        400: 'var(--text-tertiary)',
        500: 'var(--text-quaternary)',
        600: 'var(--surface-elevated)',
        700: 'var(--surface-overlay)',
        800: 'var(--surface-raised)',
        900: 'var(--surface-canvas)',
        950: 'var(--surface-sunken)',
      },
    },
    /* Border colors - only our tokens */
    borderColor: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',
      subtle: 'var(--border-subtle)',
      DEFAULT: 'var(--border-default)',
      muted: 'var(--border-muted)',
      emphasis: 'var(--border-emphasis)',
      strong: 'var(--border-strong)',
      /* Legacy gray mapping */
      gray: {
        400: 'var(--border-strong)',
        500: 'var(--border-strong)',
        600: 'var(--border-emphasis)',
        700: 'var(--border-default)',
        800: 'var(--border-default)',
      },
    },
    /* Text colors - only our tokens */
    textColor: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',
      primary: 'var(--text-primary)',
      secondary: 'var(--text-secondary)',
      tertiary: 'var(--text-tertiary)',
      quaternary: 'var(--text-quaternary)',
      disabled: 'var(--text-disabled)',
      /* Semantic text */
      success: 'var(--semantic-success)',
      warning: 'var(--semantic-warning)',
      error: 'var(--semantic-error)',
      info: 'var(--semantic-info)',
      /* Legacy gray mapping */
      gray: {
        200: 'var(--text-primary)',
        300: 'var(--text-secondary)',
        400: 'var(--text-tertiary)',
        500: 'var(--text-quaternary)',
        600: 'var(--text-disabled)',
        700: 'var(--text-disabled)',
      },
    },
    extend: {
      /* Border radius (angular) */
      borderRadius: {
        'none': 'var(--radius-none)',
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
      },
      /* Spacing (4px base) */
      spacing: {
        'ds-1': 'var(--space-1)',
        'ds-2': 'var(--space-2)',
        'ds-3': 'var(--space-3)',
        'ds-4': 'var(--space-4)',
        'ds-5': 'var(--space-5)',
        'ds-6': 'var(--space-6)',
        'ds-8': 'var(--space-8)',
        'ds-10': 'var(--space-10)',
        'ds-12': 'var(--space-12)',
      },
      /* Transition durations */
      transitionDuration: {
        'instant': 'var(--duration-instant)',
        'fast': 'var(--duration-fast)',
        'normal': 'var(--duration-normal)',
        'slow': 'var(--duration-slow)',
      },
      /* Transition timing functions */
      transitionTimingFunction: {
        'default': 'var(--ease-default)',
        'in': 'var(--ease-in)',
        'out': 'var(--ease-out)',
        'bounce': 'var(--ease-bounce)',
      },
      /* Outline colors for layer selection */
      outlineColor: {
        layer: 'var(--accent-layer)',
        'layer-subtle': 'var(--accent-layer-subtle)',
      },
      /* Background colors - extend with surface tokens */
      backgroundColor: {
        surface: {
          canvas: 'var(--surface-canvas)',
          sunken: 'var(--surface-sunken)',
          DEFAULT: 'var(--surface-default)',
          raised: 'var(--surface-raised)',
          overlay: 'var(--surface-overlay)',
          elevated: 'var(--surface-elevated)',
        },
      },
    },
  },
  plugins: [],
}
