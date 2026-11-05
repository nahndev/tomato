# Add shared drawer UI with custom theme styling

## Currently

- `@tomato/ui` has no drawer component; overlays are limited to `dialog`, `alert-dialog`, `confirm-dialog` and `popover`.
- Side-panel flows have no shared primitive, so each module would have to build its own or fall back to a modal dialog.
- Add a shared drawer to `@tomato/ui` (installed via `pnpm dlx shadcn@latest add`), restyled with the theme tokens from `@tomato/tailwind-config` (e.g. `bg-overlay`, `--elev-modal`) so it matches `dialog` and follows every theme in light and dark mode.

## Acceptance Criteria

- [x] Add `Drawer` using `shadcn/ui` with custom styles
- [x] `Drawer` support drag and drop allow resize width
- [x] `Drawer` support name, width cache by name
- [x] `UserItem` when click on item, show `Drawer`

## Solutions

- [x] using re-resizable for resize
- [x] Install `drawer` with shadcn (`vaul`), restyle with theme tokens, export from `@tomato/ui/client`
- [x] Cache width in `localStorage` under `drawer-width:<name>`, read on open and clamp to the viewport
- [x] Add `UserDetailDrawer` and open it from `UserRow`
