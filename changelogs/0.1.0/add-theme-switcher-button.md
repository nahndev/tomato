# Add theme switcher button below the user button

## Currently

- The workspace sidebar ([app-sidebar.tsx](apps/web/src/modules/workspace/components/app-sidebar.tsx)) pins the Account (user) button at the bottom; there is no way to change the theme from the UI.
- The theme is hard-coded on `<html data-theme="...">` in [layout.tsx](apps/web/src/app/layout.tsx); available themes live in `Theme` (`@tomato/constants`): `twilight`, `raspberry`, `ochre`.
- Goal: add a "change theme" button right below the user button that lets users switch between the available themes.

## Acceptance Criteria

- [x] A "Change theme" button is shown directly below the user (Account) button in the workspace sidebar
- [x] Clicking it opens a menu listing every theme in `Theme` (`@tomato/constants`) with the current one selected
- [x] Picking a theme applies it immediately (`<html data-theme>`) without a reload
- [x] The choice persists across reloads and is applied on the server render (no flash of the default theme)
- [ ] Manually verified in the browser

## Solutions

- [x] New web module `modules/theme` (`ThemeSwitcher`, `THEME_LABELS`, `resolveTheme`), exposed through `index.ts`
- [x] `ThemeSwitcher` uses the shadcn `DropdownMenu` radio group from `@tomato/ui`
- [x] Persist the theme in a `theme` cookie; the root layout reads it (fallback `DEFAULT_THEME`) to set `data-theme`
- [x] `AppSidebar` receives the current theme from `workspace/layout.tsx` and renders the switcher under the Account button
