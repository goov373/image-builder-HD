import type { FontOption, DesignSystem } from '../types';

// Available fonts configuration
export const fontOptions = {
  sansSerif: [
    { name: 'Nunito Sans', value: '"Nunito Sans", sans-serif', category: 'Sans Serif' },
    { name: 'Inter', value: '"Inter", sans-serif', category: 'Sans Serif' },
    { name: 'DM Sans', value: '"DM Sans", sans-serif', category: 'Sans Serif' }
  ],
  serif: [
    { name: 'Playfair Display', value: '"Playfair Display", serif', category: 'Serif' },
    { name: 'Merriweather', value: '"Merriweather", serif', category: 'Serif' },
    { name: 'Lora', value: '"Lora", serif', category: 'Serif' }
  ]
};

export const allFonts: FontOption[] = [...fontOptions.sansSerif, ...fontOptions.serif];

// Default design system colors and fonts
export const defaultDesignSystem: DesignSystem = {
  primary: '#f97316',
  secondary: '#0f766e',
  accent: '#fbbf24',
  neutral1: '#0f172a',
  neutral2: '#334155',
  neutral3: '#f8fafc',
  fontHeadline: '"Nunito Sans", sans-serif',
  fontBody: '"Inter", sans-serif'
};

