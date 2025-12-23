import React, { createContext, useContext } from 'react';

// Design System Context - for colors, fonts, brand settings
const DesignSystemContext = createContext(null);

export function DesignSystemProvider({ value, children }) {
  return (
    <DesignSystemContext.Provider value={value}>
      {children}
    </DesignSystemContext.Provider>
  );
}

export function useDesignSystemContext() {
  const context = useContext(DesignSystemContext);
  if (context === null) {
    throw new Error('useDesignSystemContext must be used within a DesignSystemProvider');
  }
  return context;
}

// Selection Context - for selected carousel/frame/text field
const SelectionContext = createContext(null);

export function SelectionProvider({ value, children }) {
  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelectionContext() {
  const context = useContext(SelectionContext);
  if (context === null) {
    throw new Error('useSelectionContext must be used within a SelectionProvider');
  }
  return context;
}

// Carousels Context - for carousel data and actions
const CarouselsContext = createContext(null);

export function CarouselsProvider({ value, children }) {
  return (
    <CarouselsContext.Provider value={value}>
      {children}
    </CarouselsContext.Provider>
  );
}

export function useCarouselsContext() {
  const context = useContext(CarouselsContext);
  if (context === null) {
    throw new Error('useCarouselsContext must be used within a CarouselsProvider');
  }
  return context;
}

// Dropdowns Context - for dropdown state management
const DropdownsContext = createContext(null);

export function DropdownsProvider({ value, children }) {
  return (
    <DropdownsContext.Provider value={value}>
      {children}
    </DropdownsContext.Provider>
  );
}

export function useDropdownsContext() {
  const context = useContext(DropdownsContext);
  if (context === null) {
    throw new Error('useDropdownsContext must be used within a DropdownsProvider');
  }
  return context;
}

// Combined App Provider - wraps all contexts
export function AppProvider({ 
  designSystem, 
  selection, 
  carousels, 
  dropdowns, 
  children 
}) {
  return (
    <DesignSystemProvider value={designSystem}>
      <SelectionProvider value={selection}>
        <CarouselsProvider value={carousels}>
          <DropdownsProvider value={dropdowns}>
            {children}
          </DropdownsProvider>
        </CarouselsProvider>
      </SelectionProvider>
    </DesignSystemProvider>
  );
}

