import { useState, useEffect } from 'react';

// HelloData brand colors - these are the required defaults
const HELLODATA_PRIMARY = '#6466e9';
const HELLODATA_ACCENT = '#eef1f9';
const STORAGE_KEY = 'carousel-tool-design-system-v6';

// Load from localStorage or use initial data
// Forces reset if stored colors don't match HelloData brand
function loadFromStorage(initialData) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate that it has HelloData colors - if not, reset to defaults
      if (parsed.primary === HELLODATA_PRIMARY) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load design system from localStorage:', e);
  }
  // Clear any old storage keys
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('carousel-tool-design-system')) {
        localStorage.removeItem(key);
      }
    });
  } catch (e) {}
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
      console.warn('Failed to save design system to localStorage:', e);
    }
  }, [designSystem, initialized]);

  return [designSystem, setDesignSystem];
}

