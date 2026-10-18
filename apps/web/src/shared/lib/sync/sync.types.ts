export interface OnSynced {
  onSynced(): void;
}

export interface OnDestroy {
  onDestroy(): void;
}

export function isOnSynced(handler: object): handler is OnSynced {
  return typeof (handler as OnSynced).onSynced === "function";
}

export function isOnDestroy(handler: object): handler is OnDestroy {
  return typeof (handler as OnDestroy).onDestroy === "function";
}
