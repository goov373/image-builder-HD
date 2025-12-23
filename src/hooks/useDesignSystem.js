import { useState, useEffect } from 'react';

// Version bump forces refresh of brand colors when defaults change
// v3: HelloData palette - Purple #6466e9, Orange #F97316, Shadow #18191A
const STORAGE_KEY = 'carousel-tool-design-system-v3';

// Load from localStorage or use initial data
function loadFromStorage(initialData) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load design system from localStorage:', e);
  }
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

