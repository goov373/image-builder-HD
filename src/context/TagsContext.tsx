import React, { createContext, useContext, ReactNode } from 'react';
import useTags, { UseTagsReturn } from '../hooks/useTags';

/**
 * TagsContext
 * Provides dynamic tag data and CRUD operations across the app
 */

const TagsContext = createContext<UseTagsReturn | null>(null);

export const TagsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const tagsData = useTags();

  return (
    <TagsContext.Provider value={tagsData}>
      {children}
    </TagsContext.Provider>
  );
};

export const useTagsContext = (): UseTagsReturn => {
  const context = useContext(TagsContext);
  if (!context) {
    throw new Error('useTagsContext must be used within a TagsProvider');
  }
  return context;
};

export default TagsContext;

