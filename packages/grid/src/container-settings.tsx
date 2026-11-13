import { createStoreContext } from '@tomato/store-context';
import { COLUMN_WIDTH } from './grid.constants';

export interface ContainerSettings {
  columnWidth: number;
  isGridVisible: boolean;
  isDisabled: boolean;
  isNested: boolean;
}

/** Settings of the nearest `ContainerLayout`; a nested container provides its own. */
const ContainerSettingsStore = createStoreContext<ContainerSettings>('ContainerSettings', {
  defaults: {
    columnWidth: COLUMN_WIDTH,
    isGridVisible: false,
    isDisabled: false,
    isNested: false,
  },
});

export const ContainerSettingsProvider = ContainerSettingsStore.Provider;

export const useContainerSettings = ContainerSettingsStore.useSelector;
