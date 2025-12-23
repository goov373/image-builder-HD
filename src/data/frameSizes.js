// Frame size specifications for different aspect ratios
export const frameSizes = {
  story: { name: "Story", ratio: "9:16", width: 135, height: 240, spec: "1080 × 1920px", platforms: "TikTok · Reels · Shorts" },
  pin: { name: "Pin", ratio: "2:3", width: 160, height: 240, spec: "1000 × 1500px", platforms: "Pinterest · RedNote" },
  portrait: { name: "Portrait", ratio: "4:5", width: 192, height: 240, spec: "1080 × 1350px", platforms: "Instagram · Facebook" },
  square: { name: "Square", ratio: "1:1", width: 192, height: 192, spec: "1080 × 1080px", platforms: "Instagram · X · LinkedIn" },
  landscape: { name: "Landscape", ratio: "1.91:1", width: 280, height: 147, spec: "1200 × 628px", platforms: "LinkedIn · X · Ads" },
  slides: { name: "Slides", ratio: "16:9", width: 280, height: 158, spec: "1920 × 1080px", platforms: "YouTube · PowerPoint" }
};

// Layout variant names for display
export const layoutNames = ["Bottom Stack", "Center Drama", "Editorial"];

export const layoutVariantNames = {
  0: ["Bottom", "Top", "Center"],
  1: ["Center", "Lower", "Upper"],
  2: ["Left", "Center", "Right"]
};

// Font size calculator based on frame dimensions
export const getFontSizes = (frameSize) => {
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
  
  // Portrait/Square/Story/Pin - scale based on width
  return {
    headline: Math.max(12, Math.round(14 * (size.width / baseWidth))), // 12-16px
    body: Math.max(10, Math.round(12 * (size.width / baseWidth))),     // 10-14px
    lineHeight: 1.4
  };
};


