# AGENTS.md

Instructions for AI coding agents working in **T-Minus Studio** (`t-minus-studio`).

## Project Overview

T-Minus Studio is a Next.js 14 (App Router) + TypeScript + Tailwind CSS application that plans backward T-minus milestones for a deadline, renders frosted-glass lock-screen wallpapers for mobile and desktop presets, exports high-DPI PNGs (`html-to-image` and `next/og`), generates `.ics` calendar reminders, and encodes shareable `/s/[hash]` URLs.

## Tech Stack

- **Framework**: Next.js `14.2.25` (App Router, React 18, TypeScript strict mode)
- **Styling**: Tailwind CSS `3.4.x` (`tailwind.config.ts`, `app/globals.css`)
- **State**: Zustand `5.x` with `localStorage` persistence (`store/useCountdownStore.ts`)
- **Validation**: Zod (`app/api/plan/route.ts`, `lib/share.ts`)
- **Dates/Timezones**: `date-fns` and `date-fns-tz` (`lib/planner.ts`, `lib/ics.ts`)
- **Export & Share**: `html-to-image` (`lib/export.ts`), `lz-string` (`lib/share.ts`)
- **Testing**: Vitest (`vitest.config.ts`, `lib/__tests__/*.test.ts`)

## Repository Structure

- `app/(marketing)/page.tsx` — Marketing home page with live interactive theme-cycling iPhone lock-screen preview.
- `app/builder/page.tsx` — 4-step studio builder (`deadline`, `milestones`, `style`, `export`) with split desktop view and mobile editor/preview switcher.
- `app/s/[hash]/page.tsx` — Decoded read-only share view (`ShareClientView`) with OpenGraph metadata.
- `app/api/plan/route.ts` — `POST /api/plan` AI planner using `GEMINI_API_KEY` with deterministic fallback.
- `app/api/og/route.tsx` — Edge OpenGraph image generator for shared links.
- `app/api/export-preset/route.tsx` — Server-side PNG export route.
- `components/lockscreen/LockScreenCanvas.tsx` — Core portrait/landscape lock-screen renderer (safe zones, frosted card, progress ring, milestone rows, custom background + procedural bokeh).
- `components/lockscreen/PreviewStage.tsx` — Responsive `ResizeObserver`-scaled preview stage and hidden full-resolution export target.
- `components/lockscreen/ThemedArtwork.tsx` — Category/theme-specific bottom vector illustrations.
- `components/builder/` — `StepDeadline.tsx`, `StepMilestones.tsx`, `StepStyle.tsx`, `StepExport.tsx`.
- `lib/` — `planner.ts`, `parser.ts`, `palette.ts`, `contrast.ts`, `export.ts`, `ics.ts`, `share.ts`, `demo-data.ts`, `utils.ts`.
- `types.ts` — Shared TypeScript interfaces and union types.

## Commands

Run from the repository root:

```powershell
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
npm run test        # vitest run
npm run build       # next build
```

## Coding & UI Conventions

- **Path alias**: Always import internal modules using `@/*` (mapped to repo root in `tsconfig.json` and `vitest.config.ts`).
- **Device presets & scaling**: Logical canvas sizes are defined in `DEVICE_PRESETS` (`lib/export.ts`):
  - `iphone-16-pro`: `393x852` (`3x` -> `1179x2556`)
  - `android-flagship`: `360x800` (`3x` -> `1080x2400`)
  - `desktop-fhd`: `960x540` (`2x` -> `1920x1080`)
  - `desktop-qhd`: `1280x720` (`2x` -> `2560x1440`)
- **Preview containers**: When scaling `LockScreenCanvas` inside a rounded device bezel, prefer `ring-1` over `border` (so borders do not shrink the inner box) and keep the CSS `transform: scale(...)` ratio matched to the container's width/logicalWidth so the wallpaper fills edge-to-edge on both mobile and desktop viewports.
- **Milestone constraints**: Keep milestone actions concise (max 5 words via `clampToFiveWords` in `lib/planner.ts`) and cap visible lock-screen milestones to 7 rows.
- **Contrast & safe zones**: Respect WCAG AA auto-contrast (`lib/contrast.ts`) and keep portrait top ~32% (OS clock/widgets) and bottom ~12% (lock-screen shortcuts) unobstructed.
- **Zero-key fallback**: Keep `POST /api/plan` and UI flows fully functional without `GEMINI_API_KEY`.

## Verification

After making changes, run `npm run typecheck`, `npm run lint`, and `npm run test` (and `npm run build` for Next.js route/page changes). See `.agents/` for modular agent rules and notes.
