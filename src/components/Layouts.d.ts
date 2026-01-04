import React from 'react';

export interface LayoutProps {
  frame: {
    variants: Array<{
      headline: string;
      body: string;
      formatting?: {
        headline?: Record<string, unknown>;
        body?: Record<string, unknown>;
      };
    }>;
    currentVariant: number;
    currentLayout: number;
    layoutVariant: number;
    hideProgress?: boolean;
  };
  designSystem: Record<string, string>;
  frameIndex: number;
  totalFrames: number;
  activeTextField?: string | null;
  onActivateTextField?: (field: string | null) => void;
  onUpdateText?: (field: string, value: string) => void;
  isRowSelected?: boolean;
  cardWidth?: number;
}

export const LayoutBottomStack: React.FC<LayoutProps>;
export const LayoutCenterDrama: React.FC<LayoutProps>;
export const LayoutEditorialLeft: React.FC<LayoutProps>;

