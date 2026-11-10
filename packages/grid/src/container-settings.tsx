import { createContext, useContext, type ReactNode } from 'react';
import { COLUMN_WIDTH } from './grid.constants';

export interface ContainerSettings {
  columnWidth: number;
  isGridVisible: boolean;
  isDisabled: boolean;
  isNested: boolean;
}

const DEFAULT_CONTAINER_SETTINGS: ContainerSettings = {
  columnWidth: COLUMN_WIDTH,
  isGridVisible: false,
  isDisabled: false,
  isNested: false,
};

/** Settings of the nearest `ContainerLayout`; a nested container provides its own. */
const ContainerSettingsContext = createContext<ContainerSettings>(
  DEFAULT_CONTAINER_SETTINGS,
);

export function ContainerSettingsProvider({
  value,
  children,
}: {
  value: ContainerSettings;
  children: ReactNode;
}) {
  return (
    <ContainerSettingsContext.Provider value={value}>
      {children}
    </ContainerSettingsContext.Provider>
  );
}

export function useContainerSettings(): ContainerSettings {
  return useContext(ContainerSettingsContext);
}
