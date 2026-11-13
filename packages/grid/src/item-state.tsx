import { createStoreContext } from '@tomato/store-context';
import type { AbsoluteLayout } from './grid.types';

export interface ItemState {
  layout: AbsoluteLayout;
  isDisabled: boolean;
  isDragging: boolean;
  isDropping: boolean;
  isResizing: boolean;
}

const ItemStateStore = createStoreContext<ItemState>('ItemState');

/** State of the nearest grid item; a nested item provides its own. */
export const ItemStateProvider = ItemStateStore.Provider;

export const useItemState = ItemStateStore.useSelector;
