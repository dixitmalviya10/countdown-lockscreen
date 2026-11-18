# T-Minus Studio

> **Your Deadline, Your Design: Create a Countdown Lock Screen.**  
> Plan backward T-minus milestones, design a bespoke frosted-glass countdown lock screen for phone & desktop, export pixel-accurate PNGs, sync `.ics` / Google Calendar reminders, and share read-only countdown URLs.

---

## Features

- **Backward T-Minus Planner**: Auto-generates milestones using an offset ladder `[14, 10, 7, 5, 3, 2, 1, 0]` (switching to every day when `< 7` days remain, max 7 rows, always including `T-1` and `T-0`). Includes a 3-question planning helper, strict 5-word milestone validation, drag-to-reorder + keyboard reordering, and a **"Paste from Gemini"** line importer.
- **Optional Gemini AI Endpoint (`POST /api/plan`)**: Uses server-side `GEMINI_API_KEY` with Zod schema validation and seamlessly falls back to the deterministic category-aware planner when no key is set.
- **Hero Lock Screen Renderer**:
  - **Device Presets**: iPhone (`1179×2556`), Android (`1080×2400`), Desktop FHD (`1920×1080` horizontal), Desktop QHD (`2560×1440` horizontal).
  - **2 Modes**: `Mockup` (with OS status bar, clock, date/weather, and lock-screen shortcuts) and `Wallpaper` (clean safe zones for your real device).
  - **Toggleable Safe-Zone Overlay**: Visualizes top clock (~32%), center frosted card (~34–86%), and bottom shortcuts (~12%).
  - **Live Milestones**: `"TODAY"` badge on today's milestone, dimmed past unchecked items, progress ring, and a celebratory completion state.
- **6 Procedural Bokeh Themes + Custom Art**: Autumn Bokeh, Midnight Neon, Clean Mono, Sunrise Gradient, Study Focus, and Spring Pastel—plus custom background image upload with blur/dim sliders, client-side dominant palette extraction, and live **WCAG AA contrast guard**.
- **Calendar Reminders & Share**: Client-side RFC 5545 `.ics` bundle (with `VALARM` and optional daily `RRULE`), Google Calendar deep links, optional browser alert check-in, and compact `lz-string` `/s/[hash]` URLs with `next/og` OpenGraph cards.

---

## Quick Start (Windows PowerShell)

```powershell
# 1. Install dependencies
npm install

# 2. (Optional) Configure Gemini AI planner key
Copy-Item .env.example .env.local
# Edit .env.local and add GEMINI_API_KEY=your_key_here

# 3. Start local development server
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Scripts (PowerShell)

```powershell
# TypeScript strict check
npm run typecheck

# ESLint check
npm run lint

# Vitest unit tests (planner, parser, .ics, contrast)
npm run test

# Production build
npm run build

# Start production server
npm run start
```

---

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `GEMINI_API_KEY` | Optional | Enables AI-generated backward milestones in `POST /api/plan`. If omitted, T-Minus Studio runs 100% locally via its deterministic planner. |

---

## Deploy to Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Import the project in [Vercel](https://vercel.com/new).
3. Framework Preset: **Next.js** (detected automatically).
4. *(Optional)* Add `GEMINI_API_KEY` under **Project Settings → Environment Variables**.
5. Click **Deploy**. No database or external storage is required.
