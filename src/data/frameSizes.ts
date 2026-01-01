import type { FrameSizeKey } from '../types';

// Frame size specifications for different aspect ratios
export const frameSizes: Record<string, { name: string; ratio: string; width: number; height: number; spec: string; platforms: string; category: string }> = {
  // Carousel sizes (B2B focused)
  portrait: { name: "Portrait", ratio: "4:5", width: 192, height: 240, spec: "1080 × 1350px", platforms: "Instagram · Facebook", category: "carousel" },
  square: { name: "Square", ratio: "1:1", width: 192, height: 192, spec: "1080 × 1080px", platforms: "Instagram · X · LinkedIn", category: "carousel" },
  landscape: { name: "Landscape", ratio: "1.91:1", width: 280, height: 147, spec: "1200 × 628px", platforms: "LinkedIn · X · Ads", category: "carousel" },
  slides: { name: "Slides", ratio: "16:9", width: 280, height: 158, spec: "1920 × 1080px", platforms: "YouTube · PowerPoint", category: "carousel" },
  
  // Eblast email sizes (standard 600px email width, scaled for preview)
  emailHeader: { name: "Header", ratio: "4:1", width: 300, height: 75, spec: "600 × 150px", platforms: "Email header banner", category: "eblast" },
  emailHero: { name: "Hero", ratio: "2:1", width: 300, height: 150, spec: "600 × 300px", platforms: "Email hero section", category: "eblast" },
  emailFull: { name: "Full Block", ratio: "3:2", width: 300, height: 200, spec: "600 × 400px", platforms: "Email feature block", category: "eblast" },
  emailHalf: { name: "Half Block", ratio: "1:1", width: 150, height: 150, spec: "300 × 300px", platforms: "Email 2-column", category: "eblast" },
  emailCTA: { name: "CTA Strip", ratio: "6:1", width: 300, height: 50, spec: "600 × 100px", platforms: "Email CTA banner", category: "eblast" },
  
  // Video cover sizes
  youtube: { name: "YouTube", ratio: "16:9", width: 320, height: 180, spec: "1280 × 720px", platforms: "YouTube thumbnail", category: "videoCover" },
  instagramVideo: { name: "IG Video", ratio: "1:1", width: 240, height: 240, spec: "1080 × 1080px", platforms: "Instagram video", category: "videoCover" },
  tiktok: { name: "TikTok", ratio: "9:16", width: 168, height: 300, spec: "1080 × 1920px", platforms: "TikTok · Reels", category: "videoCover" },
  linkedinVideo: { name: "LinkedIn", ratio: "1.91:1", width: 300, height: 157, spec: "1200 × 628px", platforms: "LinkedIn video", category: "videoCover" },
  twitterVideo: { name: "X/Twitter", ratio: "16:9", width: 300, height: 169, spec: "1200 × 675px", platforms: "X video post", category: "videoCover" },
};

/**
 * Get frame sizes filtered by category/project type
 */
export function getFrameSizesByCategory(category: string): Record<string, typeof frameSizes[string]> {
  return Object.fromEntries(
    Object.entries(frameSizes).filter(([_, size]) => size.category === category)
  );
}

// Layout variant names for display
export const layoutNames = ["Bottom Stack", "Center Drama", "Editorial"];

export const layoutVariantNames: Record<number, string[]> = {
  0: ["Bottom", "Top", "Center"],
  1: ["Center", "Lower", "Upper"],
  2: ["Left", "Center", "Right"]
};

interface FontSizes {
  headline: number;
  body: number;
  lineHeight: number;
}

// Font size calculator based on frame dimensions
export const getFontSizes = (frameSize: FrameSizeKey | string): FontSizes => {
  const size = frameSizes[frameSize] || frameSizes.portrait;
  const isLandscape = frameSize === 'landscape' || frameSize === 'slides';
  
  // Base sizes for portrait (192px wide) - scaled proportionally to width
  const baseWidth = 192;
  const scale = size.width / baseWidth;
  
  if (isLandscape) {
    // Landscape: shorter height, so use smaller fonts
    return {
      headline: Math.round(11 * scale * 0.7), // ~11px for landscape
      body: Math.round(9 * scale * 0.7),      // ~9px for landscape
      lineHeight: 1.3
    };
  }
  
  // Portrait/Square - scale based on width
  return {
    headline: Math.max(12, Math.round(14 * (size.width / baseWidth))), // 12-16px
    body: Math.max(10, Math.round(12 * (size.width / baseWidth))),     // 10-14px
    lineHeight: 1.4
  };
};

