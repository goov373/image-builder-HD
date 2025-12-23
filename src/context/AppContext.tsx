import React, { createContext, useContext, ReactNode } from 'react';
import type { 
  DesignSystemContextValue, 
  SelectionContextValue, 
  CarouselsContextValue 
} from '../types';

// Design System Context
const DesignSystemContext = createContext<DesignSystemContextValue | null>(null);

interface ProviderProps {
  value: unknown;
  children: ReactNode;
}

export function DesignSystemProvider({ value, children }: ProviderProps) {
  return (
    <DesignSystemContext.Provider value={value as DesignSystemContextValue}>
      {children}
    </DesignSystemContext.Provider>
  );
}

export function useDesignSystemContext(): DesignSystemContextValue {
  const context = useContext(DesignSystemContext);
  if (context === null) {
    throw new Error('useDesignSystemContext must be used within a DesignSystemProvider');
  }
  return context;
}

// Selection Context
const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ value, children }: ProviderProps) {
  return (
    <SelectionContext.Provider value={value as SelectionContextValue}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelectionContext(): SelectionContextValue {
  const context = useContext(SelectionContext);
  if (context === null) {
    throw new Error('useSelectionContext must be used within a SelectionProvider');
  }
  return context;
}

// Carousels Context
const CarouselsContext = createContext<CarouselsContextValue | null>(null);

export function CarouselsProvider({ value, children }: ProviderProps) {
  return (
    <CarouselsContext.Provider value={value as CarouselsContextValue}>
      {children}
    </CarouselsContext.Provider>
  );
}

export function useCarouselsContext(): CarouselsContextValue {
  const context = useContext(CarouselsContext);
  if (context === null) {
    throw new Error('useCarouselsContext must be used within a CarouselsProvider');
  }
  return context;
}

// Dropdowns Context - keeping as 'any' for simplicity since it has many props
const DropdownsContext = createContext<Record<string, unknown> | null>(null);

export function DropdownsProvider({ value, children }: ProviderProps) {
  return (
    <DropdownsContext.Provider value={value as Record<string, unknown>}>
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

// Combined App Provider
interface AppProviderProps {
  designSystem: DesignSystemContextValue;
  selection: SelectionContextValue;
  carousels: CarouselsContextValue;
  dropdowns: Record<string, unknown>;
  children: ReactNode;
}

export function AppProvider({ 
  designSystem, 
  selection, 
  carousels, 
  dropdowns, 
  children 
}: AppProviderProps) {
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

