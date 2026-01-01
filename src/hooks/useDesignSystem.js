import { useState, useEffect } from 'react';
import { logger } from '../utils';

// HelloData brand colors - these are the required defaults
// (Retained for reference but not currently used in code)
const _HELLODATA_PRIMARY = '#6466e9';
const _HELLODATA_ACCENT = '#eef1f9';
const STORAGE_KEY = 'carousel-tool-design-system-v8';

// Load from localStorage or use initial data
// Forces reset if stored colors don't match HelloData brand
function loadFromStorage(initialData) {
  // Clear ALL old storage keys first to force fresh defaults
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('carousel-tool-design-system')) {
        localStorage.removeItem(key);
      }
    });
  } catch (_e) {
    // Silently fail - localStorage may be unavailable or blocked
  }

  // Always return fresh defaults - no caching issues
  return initialData;
}

export default function useDesignSystem(initialData) {
  const [initialized, setInitialized] = useState(false);
  const [designSystem, setDesignSystem] = useState(() => loadFromStorage(initialData));

  // Save to localStorage whenever design system changes
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(designSystem));
    } catch (e) {
      logger.warn('Failed to save design system to localStorage:', e);
    }
  }, [designSystem, initialized]);

  return [designSystem, setDesignSystem];
}
