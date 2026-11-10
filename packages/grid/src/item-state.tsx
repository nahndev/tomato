import { createContext, useContext } from 'react';
import type { AbsoluteLayout } from './grid.types';

export interface ItemState {
  layout: AbsoluteLayout;
  isDisabled: boolean;
  isDragging: boolean;
  isDropping: boolean;
  isResizing: boolean;
}

const ItemStateContext = createContext<ItemState | null>(null);

export const ItemStateProvider = ItemStateContext.Provider;

/** State of the nearest grid item; a nested item provides its own. */
export function useItemState(): ItemState {
  const state = useContext(ItemStateContext);
  if (!state) throw new Error('useItemState must be used inside a ContainerLayout item');
  return state;
}
