---
name: tailwind
description: Set up Tailwind 4 (package @tomato/tailwind-config) and wire it into the web app / @tomato/ui. Use when asked to install/configure Tailwind or add theme tokens.
---

# Set up Tailwind 4

Tailwind 4 is CSS-first: there is no `tailwind.config.js`.

## Steps

1. Create `packages/tailwind-config/`:
   - `package.json`:

     ```json
     {
       "name": "@tomato/tailwind-config",
       "private": true,
       "exports": { ".": "./base.css", "./theme.css": "./theme.css" }
     }
     ```

   - `theme.css`:

     ```css
     @theme {
       --color-primary: oklch(0.62 0.21 25);
       --color-primary-foreground: oklch(0.98 0 0);
       --radius-md: 0.5rem;
     }
     ```

   - `base.css`:

     ```css
     @import "tailwindcss";
     @import "./theme.css";
     ```

2. Install in `apps/web`: `pnpm add -D tailwindcss @tailwindcss/postcss postcss` and `pnpm add @tomato/tailwind-config@workspace:*`.
3. `apps/web/postcss.config.mjs`:

   ```js
   export default { plugins: { "@tailwindcss/postcss": {} } };
   ```

4. `apps/web/src/app/globals.css` (imported in `layout.tsx`):

   ```css
   @import "@tomato/tailwind-config";
   @source '../../../../packages/ui/src';
   ```

5. `@tomato/ui`: add `clsx`, `tailwind-merge`, and export `cn()`. Do not import `tailwindcss` in this package.

## Notes

- Tokens (color, font, radius, spacing) are declared only in `theme.css`; never hard-code them in components.
- Dark mode: override variables in `.dark { ... }` in `base.css`.
- Only `apps/web` and `@tomato/ui` use `@tomato/tailwind-config`; `api` must not import it.
