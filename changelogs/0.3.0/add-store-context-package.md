# Share React state through createStoreContext

## Currently

- Every provider repeats the same code: `createContext`, a `Provider` (often just `Context.Provider` with a `value` object rebuilt each render), a hook that throws outside it, sometimes a custom missing-provider error. 14 contexts in `apps/web`, plus `@tomato/canvas`, `@tomato/grid`, `@tomato/color`, `@tomato/storage-ui`
- A context re-renders every consumer on any change of its value; consumers cannot select the part they read
- State with actions is kept in `useState` / hooks and copied into the context (widget selection, template snapshot), so it exists twice and children read it one render late
- `@tomato/canvas` hand-rolls "a zustand store per provider" in `state-provider.tsx`

## Acceptance Criteria

- [x] One helper creates the provider and its hooks; a store per provider instance, read with selectors
- [x] A store can hold its own state and actions next to the props
- [x] Every context of `apps/web` and the packages uses it (shadcn components excepted)

## Solutions

- [x] New package `@tomato/store-context`: `createStoreContext<P, S>(name, { defaults, initState })` → `{ Provider, useSelector, useStoreApi }`. The provider's props are the state, written into the store when they change (shallow); `initState` adds the store's own state and actions; `defaults` serve the hooks outside a provider, otherwise they throw `StoreProviderMissingError`; re-exports `useShallow`
- [x] Web: template-editor (session id, mode, meta, connection, snapshot, widget selection), template-data (data, scope), template-form, template-widget (widget id, button action), submission doc, submission-dependency graph, `SyncDocProvider`; hooks read with selectors (`useTemplateSnapshot(selector)`, `useTemplateForm(selector)`, `useShallow` for several keys)
- [x] Widget selection is a store with `selectedId` / `select` / `toggle` (`useSelectedWidget`, `useIsWidgetSelected`, `useSelectWidget`, `useToggleWidget`); `use-selection.ts` removed
- [x] Template snapshot: seeded once from the doc, then every doc update is written into the store (`TemplateDocSnapshotProvider`); `TemplateSnapshotProvider` takes a snapshot as props (tests), like `DependencyGraphValueProvider` next to `DependencyGraphProvider`
- [x] Packages: `@tomato/grid` (item state, container settings), `@tomato/color`, `@tomato/storage-ui` (file browser, drag items), `@tomato/canvas` (`createCanvasState` as `initState`); `FileBrowserProviderMissingError` / `StateProviderMissingError` → `StoreProviderMissingError`
- [x] Renamed `button-action-context.tsx` → `button-action-provider.tsx`, `sync-doc-context.ts` → `sync-doc-provider.ts`
- [x] `CONTRIBUTING.md` rule, `README.md`, `docs/template-editor.md`, `docs/maps.md`
