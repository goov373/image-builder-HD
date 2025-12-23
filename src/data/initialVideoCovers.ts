import type { VideoCover, DesignSystem } from '../types';

/**
 * Initial Video Cover Data
 * Sample video thumbnails for different platforms
 */
export const initialVideoCovers: VideoCover[] = [
  {
    id: 1,
    name: "Market Update Q1",
    subtitle: "YouTube Thumbnail",
    frameSize: "youtube",
    showPlayButton: true,
    episodeNumber: "Ep. 12",
    seriesName: "Market Insights",
    frame: {
      id: 1,
      variants: [
        { headline: "Why Rent Growth Is Slowing", body: "Q1 2024 Market Analysis", formatting: {} },
        { headline: "The Market Shift Nobody Expected", body: "What The Data Reveals", formatting: {} },
        { headline: "5 Trends Reshaping Multifamily", body: "Data-Driven Insights", formatting: {} }
      ],
      currentVariant: 0,
      currentLayout: 0,
      layoutVariant: 0,
      style: "video-bold"
    }
  }
];

/**
 * Create a new empty video cover
 */
export function createEmptyVideoCover(id: number, name: string): VideoCover {
  return {
    id,
    name,
    subtitle: "Video Thumbnail",
    frameSize: "youtube",
    showPlayButton: false,
    frame: {
      id: 1,
      variants: [
        { headline: "Your Video Title", body: "Subtitle or description", formatting: {} },
        { headline: "Alternative Title", body: "Second version", formatting: {} },
        { headline: "Third Option", body: "Third variation", formatting: {} }
      ],
      currentVariant: 0,
      currentLayout: 0,
      layoutVariant: 0,
      style: "video-bold"
    }
  };
}

/**
 * Get video cover frame styles
 * text: Main headline color (always readable)
 * accent: Decorative elements (brand colors)
 */
export function getVideoCoverStyle(frameStyle: string, ds: DesignSystem) {
  const textWhite = '#ffffff';
  const textDark = '#18191A';
  
  const styles: Record<string, { background: string; text: string; accent: string }> = {
    "video-bold": { 
      background: `linear-gradient(135deg, ${ds.neutral1} 0%, ${ds.primary} 100%)`, 
      text: textWhite,
      accent: ds.primary 
    },
    "video-dark": { 
      background: `linear-gradient(135deg, ${ds.neutral1} 0%, ${ds.neutral2} 100%)`, 
      text: textWhite,
      accent: ds.primary 
    },
    "video-energy": { 
      background: `linear-gradient(135deg, ${ds.secondary} 0%, ${ds.primary} 100%)`, 
      text: textWhite,
      accent: textWhite 
    },
    "video-clean": { 
      background: `linear-gradient(135deg, ${ds.neutral3} 0%, ${ds.neutral3} 100%)`, 
      text: textDark,
      accent: ds.primary 
    },
    "video-dramatic": { 
      background: `linear-gradient(135deg, #000000 0%, ${ds.neutral1} 100%)`, 
      text: textWhite,
      accent: ds.primary 
    },
  };
  return styles[frameStyle] || styles["video-bold"];
}

