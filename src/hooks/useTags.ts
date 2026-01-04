import { useState, useEffect, useCallback } from 'react';
import { AUDIENCE_TAGS, FEATURE_TAGS, type TagDefinition } from '../data/tags';

const STORAGE_KEY_AUDIENCE = 'hellodata_audience_tags';
const STORAGE_KEY_FEATURE = 'hellodata_feature_tags';

/**
 * useTags Hook
 * Manages audience and feature tags with localStorage persistence
 * Supports CRUD operations for both tag categories
 */

export interface UseTagsReturn {
  audienceTags: TagDefinition[];
  featureTags: TagDefinition[];
  // Audience tag operations
  addAudienceTag: (tag: Omit<TagDefinition, 'id'>) => void;
  updateAudienceTag: (id: string, updates: Partial<TagDefinition>) => void;
  deleteAudienceTag: (id: string) => void;
  // Feature tag operations
  addFeatureTag: (tag: Omit<TagDefinition, 'id'>) => void;
  updateFeatureTag: (id: string, updates: Partial<TagDefinition>) => void;
  deleteFeatureTag: (id: string) => void;
  // Reset to defaults
  resetToDefaults: () => void;
}

/**
 * Generate a unique ID for new tags
 */
const generateId = (label: string): string => {
  const base = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const timestamp = Date.now().toString(36);
  return `${base}-${timestamp}`;
};

/**
 * Load tags from localStorage or use defaults
 */
const loadTags = (storageKey: string, defaults: TagDefinition[]): TagDefinition[] => {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn(`Failed to load tags from ${storageKey}:`, error);
  }
  return defaults;
};

/**
 * Save tags to localStorage
 */
const saveTags = (storageKey: string, tags: TagDefinition[]): void => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(tags));
  } catch (error) {
    console.warn(`Failed to save tags to ${storageKey}:`, error);
  }
};

export default function useTags(): UseTagsReturn {
  const [audienceTags, setAudienceTags] = useState<TagDefinition[]>(() =>
    loadTags(STORAGE_KEY_AUDIENCE, AUDIENCE_TAGS)
  );
  const [featureTags, setFeatureTags] = useState<TagDefinition[]>(() =>
    loadTags(STORAGE_KEY_FEATURE, FEATURE_TAGS)
  );

  // Persist audience tags when they change
  useEffect(() => {
    saveTags(STORAGE_KEY_AUDIENCE, audienceTags);
  }, [audienceTags]);

  // Persist feature tags when they change
  useEffect(() => {
    saveTags(STORAGE_KEY_FEATURE, featureTags);
  }, [featureTags]);

  // Audience tag operations
  const addAudienceTag = useCallback((tag: Omit<TagDefinition, 'id'>) => {
    const newTag: TagDefinition = {
      ...tag,
      id: generateId(tag.label),
    };
    setAudienceTags((prev) => [...prev, newTag]);
  }, []);

  const updateAudienceTag = useCallback((id: string, updates: Partial<TagDefinition>) => {
    setAudienceTags((prev) =>
      prev.map((tag) => (tag.id === id ? { ...tag, ...updates } : tag))
    );
  }, []);

  const deleteAudienceTag = useCallback((id: string) => {
    setAudienceTags((prev) => prev.filter((tag) => tag.id !== id));
  }, []);

  // Feature tag operations
  const addFeatureTag = useCallback((tag: Omit<TagDefinition, 'id'>) => {
    const newTag: TagDefinition = {
      ...tag,
      id: generateId(tag.label),
    };
    setFeatureTags((prev) => [...prev, newTag]);
  }, []);

  const updateFeatureTag = useCallback((id: string, updates: Partial<TagDefinition>) => {
    setFeatureTags((prev) =>
      prev.map((tag) => (tag.id === id ? { ...tag, ...updates } : tag))
    );
  }, []);

  const deleteFeatureTag = useCallback((id: string) => {
    setFeatureTags((prev) => prev.filter((tag) => tag.id !== id));
  }, []);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setAudienceTags(AUDIENCE_TAGS);
    setFeatureTags(FEATURE_TAGS);
  }, []);

  return {
    audienceTags,
    featureTags,
    addAudienceTag,
    updateAudienceTag,
    deleteAudienceTag,
    addFeatureTag,
    updateFeatureTag,
    deleteFeatureTag,
    resetToDefaults,
  };
}

