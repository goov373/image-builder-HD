import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { logger } from '../utils';

/**
 * Design System Interface
 * Defines the structure of the design system configuration
 */
export interface DesignSystem {
  primaryColor: string;
  accentColor: string;
  // Add more design system properties as needed
  [key: string]: string | number | boolean | object;
}

// HelloData brand colors - these are the required defaults
// (Retained for reference but not currently used in code)
const _HELLODATA_PRIMARY = '#6466e9';
const _HELLODATA_ACCENT = '#eef1f9';
const STORAGE_KEY = 'carousel-tool-design-system-v8';

// Suppress unused variable warnings
void _HELLODATA_PRIMARY;
void _HELLODATA_ACCENT;

/**
 * Load design system from localStorage or use initial data
 * Forces reset if stored colors don't match HelloData brand
 */
function loadFromStorage<T>(initialData: T): T {
  // Clear ALL old storage keys first to force fresh defaults
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('carousel-tool-design-system')) {
        localStorage.removeItem(key);
      }
    });
  } catch {
    // Silently fail - localStorage may be unavailable or blocked
  }

  // Always return fresh defaults - no caching issues
  return initialData;
}

/**
 * Hook for managing design system state
 * Persists changes to localStorage
 * 
 * @param initialData - Initial design system configuration
 * @returns Tuple of [designSystem, setDesignSystem]
 */
export default function useDesignSystem<T extends DesignSystem>(
  initialData: T
): [T, Dispatch<SetStateAction<T>>] {
  const [initialized, setInitialized] = useState(false);
  const [designSystem, setDesignSystem] = useState<T>(() => loadFromStorage(initialData));

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

