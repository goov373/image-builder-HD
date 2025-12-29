/**
 * Smooth Backgrounds Engine
 * Creates seamless color transitions between carousel frames
 */

import { interpolateColor, hexToRgb, rgbToHex } from './colorUtils';
import { 
  getStartColor, 
  getEndColor, 
  extractColors,
  isSolidColor,
  isGradient 
} from './gradientParser';

/**
 * Options for the smoothing algorithm
 * @typedef {Object} SmoothOptions
 * @property {number} intensity - How much to blend (0 = no change, 1 = full blend)
 * @property {'diagonal'|'diagonal-mirror'} direction - Flow direction
 * @property {boolean} wrapAround - Whether to connect last frame to first
 */

const DEFAULT_OPTIONS = {
  intensity: 0.5,
  direction: 'diagonal',
  wrapAround: false
};

/**
 * Smooth background transitions across an array of frames
 * @param {Array<{ id: number, backgroundOverride?: string, style?: string }>} frames - Frame data
 * @param {function} getBackgroundForFrame - Function to get current background CSS for a frame
 * @param {SmoothOptions} options - Smoothing options
 * @returns {Array<{ id: number, background: string }>} - Array of frame IDs with new background values
 */
export function smoothCarouselBackgrounds(frames, getBackgroundForFrame, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  console.log('=== SMOOTH ENGINE START ===');
  console.log('Frames:', frames.length, 'Intensity:', opts.intensity, 'Direction:', opts.direction);
  
  if (!frames || frames.length < 2) {
    return []; // Need at least 2 frames to smooth
  }
  
  // Get current backgrounds for all frames
  const backgrounds = frames.map(frame => {
    const bg = getBackgroundForFrame(frame);
    console.log(`Frame ${frame.id}: ${bg?.substring(0, 60)}...`);
    return {
      id: frame.id,
      original: bg,
      modified: null
    };
  });
  
  // Initialize modified backgrounds with originals
  backgrounds.forEach(bg => {
    bg.modified = bg.original;
  });
  
  // For each pair of adjacent frames, create flowing transitions
  for (let i = 0; i < backgrounds.length - 1; i++) {
    const current = backgrounds[i];
    const next = backgrounds[i + 1];
    
    console.log(`\n--- Processing pair ${i} -> ${i+1} ---`);
    
    const result = createFlowingPair(
      current.modified, 
      next.modified, 
      opts.intensity,
      opts.direction
    );
    
    current.modified = result.first;
    next.modified = result.second;
  }
  
  // Optionally wrap around (connect last to first)
  if (opts.wrapAround && backgrounds.length > 2) {
    const last = backgrounds[backgrounds.length - 1];
    const first = backgrounds[0];
    
    const result = createFlowingPair(
      last.modified, 
      first.modified, 
      opts.intensity,
      opts.direction
    );
    
    last.modified = result.first;
    first.modified = result.second;
  }
  
  // Return only frames that changed
  const modified = backgrounds
    .filter(bg => bg.modified !== bg.original)
    .map(bg => ({
      id: bg.id,
      background: bg.modified
    }));
    
  console.log(`\n=== SMOOTH ENGINE END: ${modified.length} frames modified ===`);
  
  return modified;
}

/**
 * Create a flowing transition between two backgrounds
 * For high intensity, this creates a continuous gradient flow effect
 * @param {string} bg1 - First background CSS
 * @param {string} bg2 - Second background CSS
 * @param {number} intensity - Blend intensity (0-1)
 * @param {'horizontal'|'vertical'|'radial'|'diagonal'} direction - Flow direction
 * @returns {{ first: string, second: string }}
 */
function createFlowingPair(bg1, bg2, intensity, direction = 'horizontal') {
  // Extract colors from both backgrounds
  const colors1 = extractColors(bg1);
  const colors2 = extractColors(bg2);
  
  console.log('Colors1:', colors1);
  console.log('Colors2:', colors2);
  console.log('Direction:', direction);
  
  if (colors1.length === 0 || colors2.length === 0) {
    console.log('No colors found, skipping');
    return { first: bg1, second: bg2 };
  }
  
  // Get the "exit" color (rightmost color of frame 1)
  const exitColor = getEndColor(bg1);
  // Get the "entry" color (leftmost color of frame 2)  
  const entryColor = getStartColor(bg2);
  
  console.log('Exit color:', exitColor, 'Entry color:', entryColor);
  
  if (!exitColor || !entryColor) {
    return { first: bg1, second: bg2 };
  }
  
  // Calculate the bridge color based on intensity
  // At full intensity (1.0), both sides should match
  const bridgeColor = interpolateColor(exitColor, entryColor, 0.5);
  console.log('Bridge color:', bridgeColor);
  
  // For high intensity, we create new gradients with flow overlay
  if (intensity >= 0.5) {
    const modifiedBg1 = addFlowOverlay(bg1, exitColor, bridgeColor, 'exit', intensity, direction);
    const modifiedBg2 = addFlowOverlay(bg2, bridgeColor, entryColor, 'entry', intensity, direction);
    
    console.log('Modified bg1:', modifiedBg1?.substring(0, 80) + '...');
    console.log('Modified bg2:', modifiedBg2?.substring(0, 80) + '...');
    
    return { first: modifiedBg1, second: modifiedBg2 };
  } else {
    // For low intensity, use simple color replacement
    const newExitColor = interpolateColor(exitColor, bridgeColor, intensity * 2);
    const newEntryColor = interpolateColor(entryColor, bridgeColor, intensity * 2);
    
    const modifiedBg1 = replaceColorInBackground(bg1, exitColor, newExitColor);
    const modifiedBg2 = replaceColorInBackground(bg2, entryColor, newEntryColor);
    
    return { first: modifiedBg1, second: modifiedBg2 };
  }
}

/**
 * Add a flow overlay gradient to create smooth transition effect
 * @param {string} originalBg - Original background
 * @param {string} fromColor - Starting color of the flow
 * @param {string} toColor - Ending color of the flow
 * @param {'entry'|'exit'} side - Whether this is the entry or exit side
 * @param {number} intensity - Blend intensity
 * @param {'diagonal'|'diagonal-mirror'} flowDirection - Flow direction
 * @returns {string}
 */
function addFlowOverlay(originalBg, fromColor, toColor, side, intensity, flowDirection = 'diagonal') {
  // The overlay opacity is based on intensity
  const opacity = Math.min(0.9, intensity);
  
  // Convert colors to rgba with calculated opacity
  const fromRgb = hexToRgb(fromColor);
  const toRgb = hexToRgb(toColor);
  
  if (!fromRgb || !toRgb) {
    return originalBg;
  }
  
  let flowGradient;
  
  // Determine opacities based on entry/exit side
  const solidOpacity = opacity;
  const fadeOpacity = 0;
  
  switch (flowDirection) {
    case 'diagonal-mirror': {
      // Diagonal Mirror: top-right to bottom-left flow (opposite direction)
      if (side === 'exit') {
        // Exit: transparent top-right, bridge color at bottom-left
        flowGradient = `linear-gradient(225deg, rgba(${fromRgb.r}, ${fromRgb.g}, ${fromRgb.b}, ${fadeOpacity}) 0%, rgba(${fromRgb.r}, ${fromRgb.g}, ${fromRgb.b}, ${fadeOpacity}) 50%, rgba(${toRgb.r}, ${toRgb.g}, ${toRgb.b}, ${solidOpacity}) 100%)`;
      } else {
        // Entry: bridge color at top-right, transparent bottom-left
        flowGradient = `linear-gradient(225deg, rgba(${fromRgb.r}, ${fromRgb.g}, ${fromRgb.b}, ${solidOpacity}) 0%, rgba(${toRgb.r}, ${toRgb.g}, ${toRgb.b}, ${fadeOpacity}) 50%, rgba(${toRgb.r}, ${toRgb.g}, ${toRgb.b}, ${fadeOpacity}) 100%)`;
      }
      break;
    }
    
    case 'diagonal':
    default: {
      // Diagonal: top-left to bottom-right flow
      if (side === 'exit') {
        // Exit: transparent top-left, bridge color at bottom-right
        flowGradient = `linear-gradient(135deg, rgba(${fromRgb.r}, ${fromRgb.g}, ${fromRgb.b}, ${fadeOpacity}) 0%, rgba(${fromRgb.r}, ${fromRgb.g}, ${fromRgb.b}, ${fadeOpacity}) 50%, rgba(${toRgb.r}, ${toRgb.g}, ${toRgb.b}, ${solidOpacity}) 100%)`;
      } else {
        // Entry: bridge color at top-left, transparent bottom-right
        flowGradient = `linear-gradient(135deg, rgba(${fromRgb.r}, ${fromRgb.g}, ${fromRgb.b}, ${solidOpacity}) 0%, rgba(${toRgb.r}, ${toRgb.g}, ${toRgb.b}, ${fadeOpacity}) 50%, rgba(${toRgb.r}, ${toRgb.g}, ${toRgb.b}, ${fadeOpacity}) 100%)`;
      }
      break;
    }
  }
  
  // Stack the flow gradient on top of original
  return `${flowGradient}, ${originalBg}`;
}

/**
 * Replace a specific color in a background string
 * @param {string} background - CSS background
 * @param {string} oldColor - Color to replace (hex)
 * @param {string} newColor - New color (hex)
 * @returns {string}
 */
function replaceColorInBackground(background, oldColor, newColor) {
  if (!background || !oldColor || !newColor) return background;
  
  // Try to replace the exact color
  const normalizedOld = oldColor.toLowerCase();
  const normalizedNew = newColor.toLowerCase();
  
  // First try exact match
  if (background.toLowerCase().includes(normalizedOld)) {
    return background.replace(new RegExp(escapeRegex(oldColor), 'gi'), newColor);
  }
  
  return background;
}

/**
 * Escape special characters for regex
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Calculate the perceptual distance between two colors (0-1)
 * @param {string} color1 - First hex color
 * @param {string} color2 - Second hex color
 * @returns {number}
 */
export function calculateColorDistance(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 1;
  
  const maxDistance = Math.sqrt(255*255 * 3);
  const actualDistance = Math.sqrt(
    Math.pow(rgb2.r - rgb1.r, 2) + 
    Math.pow(rgb2.g - rgb1.g, 2) + 
    Math.pow(rgb2.b - rgb1.b, 2)
  );
  
  return actualDistance / maxDistance;
}

/**
 * Analyze the color harmony of a frame sequence
 * @param {string[]} backgrounds - Array of background CSS strings
 * @returns {{ needsSmoothing: boolean, colorJumps: number[], averageJump: number }}
 */
export function analyzeColorHarmony(backgrounds) {
  if (!backgrounds || backgrounds.length < 2) {
    return { needsSmoothing: false, colorJumps: [], averageJump: 0 };
  }
  
  const colorJumps = [];
  
  for (let i = 0; i < backgrounds.length - 1; i++) {
    const currentEnd = getEndColor(backgrounds[i]);
    const nextStart = getStartColor(backgrounds[i + 1]);
    
    if (currentEnd && nextStart) {
      const jump = calculateColorDistance(currentEnd, nextStart);
      colorJumps.push(jump);
    }
  }
  
  const averageJump = colorJumps.length > 0 
    ? colorJumps.reduce((a, b) => a + b, 0) / colorJumps.length 
    : 0;
  
  const needsSmoothing = averageJump > 0.3;
  
  return { needsSmoothing, colorJumps, averageJump };
}
