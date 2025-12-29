/**
 * Smooth Backgrounds Engine
 * Creates seamless color transitions between carousel frames
 */

import { interpolateColor } from './colorUtils';
import { 
  getStartColor, 
  getEndColor, 
  modifyStartColor, 
  modifyEndColor,
  isSolidColor,
  isGradient 
} from './gradientParser';

/**
 * Options for the smoothing algorithm
 * @typedef {Object} SmoothOptions
 * @property {number} intensity - How much to blend (0 = no change, 1 = full blend)
 * @property {boolean} preserveCharacter - Try to preserve the original gradient structure
 * @property {boolean} wrapAround - Whether to connect last frame to first
 */

const DEFAULT_OPTIONS = {
  intensity: 0.5,
  preserveCharacter: true,
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
  
  if (!frames || frames.length < 2) {
    return []; // Need at least 2 frames to smooth
  }
  
  // Get current backgrounds for all frames
  const backgrounds = frames.map(frame => ({
    id: frame.id,
    original: getBackgroundForFrame(frame),
    modified: null
  }));
  
  // Initialize modified backgrounds with originals
  backgrounds.forEach(bg => {
    bg.modified = bg.original;
  });
  
  // Process each pair of adjacent frames
  for (let i = 0; i < backgrounds.length - 1; i++) {
    const current = backgrounds[i];
    const next = backgrounds[i + 1];
    
    const result = smoothPair(
      current.modified, 
      next.modified, 
      opts.intensity
    );
    
    current.modified = result.first;
    next.modified = result.second;
  }
  
  // Optionally wrap around (connect last to first)
  if (opts.wrapAround && backgrounds.length > 2) {
    const last = backgrounds[backgrounds.length - 1];
    const first = backgrounds[0];
    
    const result = smoothPair(
      last.modified, 
      first.modified, 
      opts.intensity
    );
    
    last.modified = result.first;
    first.modified = result.second;
  }
  
  // Return only frames that changed
  return backgrounds
    .filter(bg => bg.modified !== bg.original)
    .map(bg => ({
      id: bg.id,
      background: bg.modified
    }));
}

/**
 * Smooth transition between two backgrounds
 * @param {string} bg1 - First background CSS
 * @param {string} bg2 - Second background CSS
 * @param {number} intensity - Blend intensity (0-1)
 * @returns {{ first: string, second: string }}
 */
function smoothPair(bg1, bg2, intensity) {
  // Get exit color of first and entry color of second
  const exitColor = getEndColor(bg1);
  const entryColor = getStartColor(bg2);
  
  if (!exitColor || !entryColor) {
    return { first: bg1, second: bg2 };
  }
  
  // Calculate the blend point - where the two should meet
  const blendColor = interpolateColor(exitColor, entryColor, 0.5);
  
  // Modify bg1's exit to blend toward the meeting point
  const newExitColor = interpolateColor(exitColor, blendColor, intensity);
  const modifiedBg1 = modifyEndColor(bg1, newExitColor);
  
  // Modify bg2's entry to blend from the meeting point
  const newEntryColor = interpolateColor(entryColor, blendColor, intensity);
  const modifiedBg2 = modifyStartColor(bg2, newEntryColor);
  
  return {
    first: modifiedBg1,
    second: modifiedBg2
  };
}

/**
 * Create a flowing gradient sequence across multiple frames
 * This is a more aggressive smoothing that creates a continuous flow effect
 * @param {string[]} backgrounds - Array of background CSS strings
 * @param {number} intensity - Flow intensity (0-1)
 * @returns {string[]} - Modified backgrounds
 */
export function createFlowingSequence(backgrounds, intensity = 0.6) {
  if (!backgrounds || backgrounds.length < 2) {
    return backgrounds || [];
  }
  
  const result = [...backgrounds];
  
  // Extract all endpoint colors to create a palette
  const colors = backgrounds.map(bg => ({
    start: getStartColor(bg),
    end: getEndColor(bg)
  }));
  
  // For each frame except the last, blend its end toward next frame's start
  for (let i = 0; i < result.length - 1; i++) {
    const currentEnd = colors[i].end;
    const nextStart = colors[i + 1].start;
    
    if (currentEnd && nextStart) {
      // Calculate new endpoint that flows into next frame
      const flowColor = interpolateColor(currentEnd, nextStart, intensity);
      result[i] = modifyEndColor(result[i], flowColor);
      
      // Also modify next frame's start to complete the connection
      const reverseFlowColor = interpolateColor(nextStart, currentEnd, 1 - intensity);
      result[i + 1] = modifyStartColor(result[i + 1], reverseFlowColor);
    }
  }
  
  return result;
}

/**
 * Analyze the color harmony of a frame sequence
 * Useful for determining if smoothing would be beneficial
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
  
  // A jump greater than 50% color distance is considered jarring
  const needsSmoothing = averageJump > 0.3;
  
  return { needsSmoothing, colorJumps, averageJump };
}

/**
 * Calculate the perceptual distance between two colors (0-1)
 * @param {string} color1 - First hex color
 * @param {string} color2 - Second hex color
 * @returns {number}
 */
function calculateColorDistance(color1, color2) {
  // Simple RGB distance normalized to 0-1
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  
  const r1 = parseInt(hex1.substr(0, 2), 16);
  const g1 = parseInt(hex1.substr(2, 2), 16);
  const b1 = parseInt(hex1.substr(4, 2), 16);
  
  const r2 = parseInt(hex2.substr(0, 2), 16);
  const g2 = parseInt(hex2.substr(2, 2), 16);
  const b2 = parseInt(hex2.substr(4, 2), 16);
  
  const maxDistance = Math.sqrt(255*255 * 3); // Max possible RGB distance
  const actualDistance = Math.sqrt(
    Math.pow(r2 - r1, 2) + 
    Math.pow(g2 - g1, 2) + 
    Math.pow(b2 - b1, 2)
  );
  
  return actualDistance / maxDistance;
}

