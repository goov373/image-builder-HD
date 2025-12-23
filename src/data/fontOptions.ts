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
// Primary: Deep Teal - Trust, innovation, real estate stability
// Secondary: Vibrant Orange - Energy, action, CTA emphasis  
// Accent: Electric Blue - Data, technology, insights
// The palette balances professional trust with energetic action
export const defaultDesignSystem: DesignSystem = {
  primary: '#0d9488',      // Teal 600 - Primary brand, trust & innovation
  secondary: '#f97316',    // Orange 500 - Energy, CTAs, highlights
  accent: '#3b82f6',       // Blue 500 - Data accents, links, tech feel
  neutral1: '#0f172a',     // Slate 900 - Deep backgrounds, text
  neutral2: '#334155',     // Slate 700 - Secondary backgrounds
  neutral3: '#f1f5f9',     // Slate 100 - Light backgrounds, cards
  fontHeadline: '"DM Sans", sans-serif',
  fontBody: '"Inter", sans-serif'
};

