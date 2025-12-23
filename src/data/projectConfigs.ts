/**
 * Project Configuration System
 * Defines settings, sizes, layouts, and features per project type
 */

export type ProjectType = 'carousel' | 'eblast' | 'videoCover' | 'singleImage';

export interface ProjectConfig {
  name: string;
  description: string;
  frameSizes: string[];
  defaultSize: string;
  layouts: string[];
  features: {
    multiFrame: boolean;
    verticalStack: boolean;
    singleFrame: boolean;
    dragReorder: boolean;
    progressDots: boolean;
    ctaButtons: boolean;
    playOverlay: boolean;
    episodeNumber: boolean;
    htmlExport: boolean;
    gifExport: boolean;
  };
}

export const PROJECT_CONFIGS: Record<ProjectType, ProjectConfig> = {
  carousel: {
    name: 'Carousel',
    description: 'Multi-slide posts for LinkedIn & Instagram',
    frameSizes: ['portrait', 'square', 'story', 'pin', 'slides', 'landscape'],
    defaultSize: 'portrait',
    layouts: ['BottomStack', 'CenterDrama', 'Editorial'],
    features: {
      multiFrame: true,
      verticalStack: false,
      singleFrame: false,
      dragReorder: true,
      progressDots: true,
      ctaButtons: false,
      playOverlay: false,
      episodeNumber: false,
      htmlExport: false,
      gifExport: false,
    },
  },
  eblast: {
    name: 'Eblast Images',
    description: 'Email marketing graphics and banners',
    frameSizes: ['emailHeader', 'emailHero', 'emailFull', 'emailHalf', 'emailCTA'],
    defaultSize: 'emailHero',
    layouts: ['BottomStack', 'CenterDrama', 'Editorial', 'HeroOverlay', 'Split5050', 'CTABanner', 'TextBlock'],
    features: {
      multiFrame: false,
      verticalStack: true,
      singleFrame: false,
      dragReorder: true,
      progressDots: false,
      ctaButtons: true,
      playOverlay: false,
      episodeNumber: false,
      htmlExport: true,
      gifExport: false,
    },
  },
  videoCover: {
    name: 'Video Cover',
    description: 'Thumbnails for YouTube, TikTok & social video',
    frameSizes: ['youtube', 'instagramVideo', 'tiktok', 'linkedinVideo', 'twitterVideo'],
    defaultSize: 'youtube',
    layouts: ['BottomStack', 'CenterDrama', 'Editorial', 'FaceText', 'BoldStatement', 'EpisodeCard', 'PlayOverlay'],
    features: {
      multiFrame: false,
      verticalStack: false,
      singleFrame: true,
      dragReorder: false,
      progressDots: false,
      ctaButtons: false,
      playOverlay: true,
      episodeNumber: true,
      htmlExport: false,
      gifExport: true,
    },
  },
  singleImage: {
    name: 'Single Image',
    description: 'Product mockups and SaaS landing page graphics',
    frameSizes: ['hero', 'square', 'wide', 'tall', 'og', 'twitter'],
    defaultSize: 'hero',
    layouts: ['dashboard-full', 'dashboard-cropped-tl', 'dashboard-cropped-tr', 'modal-centered', 'card-stack', 'browser-window'],
    features: {
      multiFrame: false,
      verticalStack: false,
      singleFrame: true,
      dragReorder: true, // Layer reordering
      progressDots: false,
      ctaButtons: false,
      playOverlay: false,
      episodeNumber: false,
      htmlExport: false,
      gifExport: false,
    },
  },
};

/**
 * Get configuration for a project type
 */
export function getProjectConfig(type: ProjectType): ProjectConfig {
  return PROJECT_CONFIGS[type];
}

/**
 * Get available frame sizes for a project type
 */
export function getFrameSizesForType(type: ProjectType): string[] {
  return PROJECT_CONFIGS[type].frameSizes;
}

/**
 * Get available layouts for a project type
 */
export function getLayoutsForType(type: ProjectType): string[] {
  return PROJECT_CONFIGS[type].layouts;
}

/**
 * Check if a feature is enabled for a project type
 */
export function hasFeature(type: ProjectType, feature: keyof ProjectConfig['features']): boolean {
  return PROJECT_CONFIGS[type].features[feature];
}

