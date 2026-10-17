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
