import React from 'react';

export interface EblastLayoutProps {
  section: {
    variants: Array<{
      headline: string;
      body: string;
      formatting?: Record<string, unknown>;
    }>;
    currentVariant: number;
    currentLayout: number;
    layoutVariant: number;
    ctaText?: string;
    ctaUrl?: string;
  };
  designSystem: Record<string, string>;
  activeTextField?: string | null;
  onActivateTextField?: (field: string | null) => void;
  onUpdateText?: (field: string, value: string) => void;
}

export const EblastHeroOverlay: React.FC<EblastLayoutProps>;
export const EblastSplit5050: React.FC<EblastLayoutProps>;
export const EblastCTABanner: React.FC<EblastLayoutProps>;
export const EblastTextBlock: React.FC<EblastLayoutProps>;

