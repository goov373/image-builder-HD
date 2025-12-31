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

// HelloData.ai Brand Colors
// Primary: Purple - Main brand identity, headers, key elements
// Secondary: Light Grey - Backgrounds, secondary elements
// Accent: Orange - CTAs, highlights, energy
// Neutrals: Shadow dark → Medium grey → Light purple tint
export const defaultDesignSystem: DesignSystem = {
  primary: '#6466e9',      // Purple - Main brand color
  secondary: '#eef1f9',    // Light Grey - Secondary color
  accent: '#F97316',       // Orange - CTAs, highlights, energy
  neutral1: '#18191A',     // Shadow - Deep backgrounds, text
  neutral2: '#ACACAC',     // Medium Grey - Secondary text, borders
  neutral4: '#CBCBCB',     // Light Grey - Subtle backgrounds, dividers
  neutral3: '#FFFFFF',     // White - Light backgrounds, cards
  headingFont: '"Nunito Sans", sans-serif',
  bodyFont: '"Nunito Sans", sans-serif',
  headingWeight: '700',    // Bold for headings
  bodyWeight: '400'        // Regular for body text
};

