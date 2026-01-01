/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* Surface colors (luminosity-based elevation) */
      colors: {
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
      },
      /* Border colors (white-based) */
      borderColor: {
        subtle: 'var(--border-subtle)',
        DEFAULT: 'var(--border-default)',
        muted: 'var(--border-muted)',
        emphasis: 'var(--border-emphasis)',
        strong: 'var(--border-strong)',
      },
      /* Text colors */
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        tertiary: 'var(--text-tertiary)',
        quaternary: 'var(--text-quaternary)',
        disabled: 'var(--text-disabled)',
      },
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
    },
  },
  plugins: [],
}







