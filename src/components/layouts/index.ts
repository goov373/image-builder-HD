/**
 * Layout Registry
 * Centralized mapping of layout names to components
 */

import { LayoutBottomStack, LayoutCenterDrama, LayoutEditorialLeft } from '../Layouts';

// Layout component registry
export const LAYOUT_COMPONENTS: Record<string, React.ComponentType<any>> = {
  // Core layouts (all project types)
  BottomStack: LayoutBottomStack,
  CenterDrama: LayoutCenterDrama,
  Editorial: LayoutEditorialLeft,
  
  // Eblast layouts (placeholders - will be created)
  HeroOverlay: LayoutBottomStack,    // Fallback until created
  Split5050: LayoutCenterDrama,      // Fallback until created
  CTABanner: LayoutBottomStack,      // Fallback until created
  TextBlock: LayoutBottomStack,      // Fallback until created
  
  // Video cover layouts (placeholders - will be created)
  FaceText: LayoutEditorialLeft,     // Fallback until created
  BoldStatement: LayoutCenterDrama,  // Fallback until created
  EpisodeCard: LayoutBottomStack,    // Fallback until created
  PlayOverlay: LayoutCenterDrama,    // Fallback until created
};

// Layout metadata for UI display
export const LAYOUT_META: Record<string, { name: string; description: string; category: string }> = {
  // Core layouts
  BottomStack: { name: 'Bottom Stack', description: 'Text stacked at bottom', category: 'core' },
  CenterDrama: { name: 'Center Drama', description: 'Centered focal point', category: 'core' },
  Editorial: { name: 'Editorial', description: 'Magazine-style layout', category: 'core' },
  
  // Eblast layouts
  HeroOverlay: { name: 'Hero Overlay', description: 'Large image with text overlay', category: 'eblast' },
  Split5050: { name: 'Split 50/50', description: 'Image and text side by side', category: 'eblast' },
  CTABanner: { name: 'CTA Banner', description: 'Prominent call-to-action', category: 'eblast' },
  TextBlock: { name: 'Text Block', description: 'Simple text section', category: 'eblast' },
  
  // Video cover layouts
  FaceText: { name: 'Face + Text', description: 'Headshot with bold text', category: 'videoCover' },
  BoldStatement: { name: 'Bold Statement', description: 'Large centered text', category: 'videoCover' },
  EpisodeCard: { name: 'Episode Card', description: 'Series branding layout', category: 'videoCover' },
  PlayOverlay: { name: 'Play Overlay', description: 'Image with play button', category: 'videoCover' },
};

// Layout display names (for toolbar dropdown)
export const layoutNames = ['Bottom Stack', 'Center Drama', 'Editorial'];

// Layout name to index mapping
export const LAYOUT_NAME_TO_INDEX: Record<string, number> = {
  BottomStack: 0,
  CenterDrama: 1,
  Editorial: 2,
  HeroOverlay: 3,
  Split5050: 4,
  CTABanner: 5,
  TextBlock: 6,
  FaceText: 7,
  BoldStatement: 8,
  EpisodeCard: 9,
  PlayOverlay: 10,
};

/**
 * Get layout component by name
 */
export function getLayoutComponent(layoutName: string): React.ComponentType<any> {
  return LAYOUT_COMPONENTS[layoutName] || LAYOUT_COMPONENTS.BottomStack;
}

/**
 * Get layouts filtered by category
 */
export function getLayoutsByCategory(category: string): string[] {
  return Object.entries(LAYOUT_META)
    .filter(([_, meta]) => meta.category === category || meta.category === 'core')
    .map(([name]) => name);
}

/**
 * Get layout display name
 */
export function getLayoutDisplayName(layoutKey: string): string {
  return LAYOUT_META[layoutKey]?.name || layoutKey;
}

// Re-export existing layouts
export { LayoutBottomStack, LayoutCenterDrama, LayoutEditorialLeft } from '../Layouts';

