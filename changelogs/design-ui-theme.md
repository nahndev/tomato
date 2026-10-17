# Design theme for UI

## Currently

- The web app styles come from Tailwind 4 (`@tomato/tailwind-config`) and shadcn/ui components in `@tomato/ui`, with a few recently added tokens (hover color, hover/selected effect utilities).
- There is no consistent, documented theme: colors, typography, spacing, radius, and shadows are added piecemeal per feature.
- Goal: design a theme for the UI (color palette, typography, spacing, radius, shadows, light/dark modes) that all screens and components follow.

## Acceptance Criteria

- [x] Xây dựng bộ các class và colors cho các thành phần
- card:
  - Luc binh thuong
  - Luc hover -> ring primary
  - Luc selected -> ring primary
- frame:
  - Luc binh thuong -> bg gray - 200
  - Luc hover -> gray 300 va ring gray
  - Luc selected -> ring gray
- canvas:
  - Luc binh thuong -> bg canvas hien tai
  - Khong hover
  - Khong selected
- muted:
  - Luc binh thuong -> bg muted hien tai
  - Khong hover
  - Khong selected
- button:
  - Luc binh thuong -> bg background + text foreground
  - Luc hover -> bg background dam hon + text background
  - Luc selected -> bg primary + text background
  - Luc hover khi selected -> bg primary hover + text background

## Solutions

- [x] Them cac theme color cho tung thanh phan
- [x] Them class cho thanh phan

## Theme system rewrite

- [x] Model: fixed colors (background, foreground, overlay) + neutral ladder + 3 role tones (primary, accent, neutral) per theme; semantic tones (success, warning, danger, info) fixed in `theme/semantic.css`; one palette = one theme (current: twilight)
- [x] Theme and semantic files hold every value for light and dark, including the 12 states of each tone (hover, active, focus, disabled, selected, soft, text, border...); CSS derives nothing, colors come from an external tool
- [x] Intent classes (`intent-primary`, `intent-accent`, `intent-neutral`, `intent-success`, `intent-warning`, `intent-danger`, `intent-info`; file `utilities/intent.css`) point the generic color variables at a color group; shape classes `variant-solid|variant-soft|variant-outlined|variant-ghost` consume them
- [x] `scripts/check-themes.mjs` (run by `pnpm lint`): missing tokens, non-hex values, text contrast >= 4.5:1, control outline >= 3:1, semantic tones checked against every theme; focus ring < 3:1 is a warning
- [x] Removed redundant tokens and utilities: card/popover/sidebar/destructive aliases, sunken, hover/selected tokens, per-role soft/text tokens, `hover-*` / `selected-*` utilities, all CSS color derivation
- [x] `@tomato/ui` and web components migrated to shape + color classes
- [x] Utility naming aligned with the model: state variants `is-hover|active|selected|disabled` (match token suffixes), `--on-solid`
- [x] Removed `surface-*` utilities (overlapped with `variant-*`); components compose surface token fills (`bg-surface`, `bg-sunken`, `shadow-card`...) directly
- [x] Added recessed `sunken` fill (well holding a card) with neutral ladder tokens `--sunken` and `--sunken-hover`; `check-themes` validates them
- [x] Renamed neutral ladder tokens by role: `surface` -> `card`, `sunken` -> `inset`, `sunken-hover` -> `inset-hover` (`canvas`, `muted`, `muted-foreground` kept)
- [x] Unified text-on-fill tokens under `foreground`: `-text` -> `-soft-foreground`, `--on-solid|disabled|soft` -> `--solid|disabled|soft-foreground` (utilities `text-solid-foreground`, `text-soft-foreground`)
- [x] Dropped the `intent-` prefix: color classes are now `primary`, `accent`, `neutral`, `success`, `warning`, `danger`, `info`
- [x] Renamed `tone-*` classes to `intent-*` (shapes keep `variant-`): `variant-solid intent-primary`; generic color utilities `bg-solid|hover|active|soft|soft-hover|selected|disabled`, `text-on-solid|on-soft|on-disabled`, `border-outline`; `outlined` because `outline` is a Tailwind utility
