# Lock Screen & Studio Conventions

1. **Scaled Canvas Previews**
   - `LockScreenCanvas` renders at exact logical device dimensions (`393×852` for iPhone, `360×800` for Android, `960×540` / `1280×720` for Desktop).
   - Scaled preview wrappers (marketing hero, `PreviewStage`, `ShareClientView`) must match `containerWidth / preset.logicalWidth` and use `ring-1` instead of `border` to avoid 2px inner clipping or black gaps around the wallpaper.
   - Use `ResizeObserver` when containers can resize responsively on mobile screens.

2. **Safe Zones & Readability**
   - Portrait lock screens reserve ~31.5%–32% at the top for OS status bar/clock and ~12%–12.5% at the bottom for flashlight/camera shortcuts.
   - Landscape wallpapers keep the left ~44% clear for desktop icons/clock and place the frosted card on the right.
   - Keep `showSafeZones` overlays disabled when `exportMode` is `true`.

3. **Planner & Export Invariants**
   - Backward offset ladder `[14, 10, 7, 5, 3, 2, 1, 0]` (max 7 rows, max 5 words per milestone action).
   - Do not break offline/deterministic mode when `GEMINI_API_KEY` is unset.
   - Always run `npm run typecheck`, `npm run lint`, and `npm run test` after edits.
