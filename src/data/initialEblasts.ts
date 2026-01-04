import type { Eblast, DesignSystem } from '../types';

/**
 * Initial Eblast Data
 * Sample email marketing campaign with multiple sections
 */
export const initialEblasts: Eblast[] = [
  {
    id: 1,
    name: 'Q1 Product Launch',
    subtitle: 'Email Campaign',
    previewText: 'Introducing our latest innovation...',
    sections: [
      {
        id: 1,
        sectionType: 'header',
        variants: [
          { headline: 'HelloData', body: 'Multifamily Intelligence', formatting: {} },
          { headline: 'HelloData', body: 'Real Estate Analytics', formatting: {} },
          { headline: 'HelloData', body: 'Data-Driven Decisions', formatting: {} },
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: 'header-brand',
        size: 'emailHeader',
      },
      {
        id: 2,
        sectionType: 'hero',
        variants: [
          {
            headline: 'Screen Deals 10x Faster',
            body: 'AI-powered rent comps and underwriting in seconds, not hours.',
            formatting: {},
          },
          { headline: 'Your Unfair Advantage', body: 'Get the data your competitors wish they had.', formatting: {} },
          {
            headline: 'Stop Guessing. Start Knowing.',
            body: 'Real-time market intelligence for multifamily professionals.',
            formatting: {},
          },
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: 'hero-gradient',
        size: 'emailHero',
        ctaText: 'See It In Action →',
        ctaUrl: '#',
      },
      {
        id: 3,
        sectionType: 'feature',
        variants: [
          {
            headline: 'Rent Comps in 60 Seconds',
            body: 'Enter any address. Get accurate rent comps, expense benchmarks, and NOI projections instantly.',
            formatting: {},
          },
          {
            headline: 'Market Data That Moves',
            body: 'Daily updates. Real-time signals. The forecast that never gets stale.',
            formatting: {},
          },
          {
            headline: 'Built for Speed',
            body: "The fastest teams win the best deals. We make sure that's you.",
            formatting: {},
          },
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: 'feature-light',
        size: 'emailFull',
      },
      {
        id: 4,
        sectionType: 'cta',
        variants: [
          { headline: 'Ready to move faster?', body: 'Join 25,000+ multifamily professionals', formatting: {} },
          { headline: 'See HelloData in action', body: 'Book a personalized demo today', formatting: {} },
          { headline: 'Start your free trial', body: 'No credit card required', formatting: {} },
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: 'cta-bold',
        size: 'emailCTA',
        ctaText: 'Get Started Free →',
        ctaUrl: '#',
      },
    ],
  },
];

/**
 * Create a new empty eblast
 */
export function createEmptyEblast(id: number, name: string): Eblast {
  return {
    id,
    name,
    subtitle: 'Email Campaign',
    previewText: '',
    sections: [
      {
        id: 1,
        sectionType: 'hero',
        variants: [
          { headline: 'Your Headline Here', body: 'Your supporting message goes here.', formatting: {} },
          { headline: 'Alternative Headline', body: 'Alternative supporting text.', formatting: {} },
          { headline: 'Third Option', body: 'Third variation of your message.', formatting: {} },
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: 'hero-gradient',
        size: 'emailHero',
        ctaText: 'Learn More →',
        ctaUrl: '#',
      },
    ],
  };
}

/**
 * Get eblast section styles
 * text: Main headline color (always readable)
 * accent: Decorative elements (brand colors)
 */
export function getEblastSectionStyle(sectionStyle: string, ds: DesignSystem) {
  const textWhite = '#ffffff';
  const textDark = '#18191A';

  const styles: Record<string, { background: string; text: string; accent: string }> = {
    'header-brand': {
      background: `linear-gradient(135deg, ${ds.primary} 0%, #818cf8 100%)`,
      text: textWhite,
      accent: textWhite,
    },
    'hero-gradient': {
      background: `linear-gradient(135deg, ${ds.primary} 0%, ${ds.neutral3} 100%)`,
      text: textWhite,
      accent: ds.secondary,
    },
    'feature-light': {
      background: `linear-gradient(135deg, ${ds.neutral3} 0%, #ffffff 100%)`,
      text: textDark,
      accent: ds.primary,
    },
    'feature-dark': {
      background: `linear-gradient(135deg, ${ds.neutral1} 0%, ${ds.neutral2} 100%)`,
      text: textWhite,
      accent: ds.primary,
    },
    'cta-bold': {
      background: `linear-gradient(135deg, ${ds.primary} 0%, ${ds.secondary} 100%)`,
      text: textWhite,
      accent: textWhite,
    },
    'cta-subtle': {
      background: `linear-gradient(135deg, ${ds.primary} 0%, #818cf8 100%)`,
      text: textWhite,
      accent: textWhite,
    },
  };
  return styles[sectionStyle] || styles['hero-gradient'];
}
