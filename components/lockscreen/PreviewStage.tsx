"use client";

import React, { useEffect, useRef, useState } from "react";
import { Eye, Grid, Monitor, Smartphone } from "lucide-react";
import { DEVICE_PRESETS, DEVICE_PRESET_LIST } from "@/lib/export";
import { useCountdownStore } from "@/store/useCountdownStore";
import { LockScreenCanvas } from "./LockScreenCanvas";

export function PreviewStage({
  exportRef,
}: {
  exportRef: React.RefObject<HTMLDivElement>;
}) {
  const {
    deadline,
    milestones,
    theme,
    devicePresetId,
    previewMode,
    showSafeZones,
    setDevicePreset,
    setPreviewMode,
    setShowSafeZones,
    toggleMilestone,
  } = useCountdownStore();

  const preset =
    DEVICE_PRESETS[devicePresetId] ?? DEVICE_PRESETS["iphone-16-pro"];
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.68);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const availW = Math.max(220, rect.width - 36);
      const availH = Math.max(260, rect.height - 36);
      const nextScale = Math.min(
        availW / preset.logicalWidth,
        availH / preset.logicalHeight,
        1
      );
      setScale(Math.max(0.24, nextScale));
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", updateScale);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [preset.logicalWidth, preset.logicalHeight]);

  const isPortrait = preset.orientation === "portrait";

  return (
    <div className="flex h-full flex-col">
      {/* Preview Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] bg-black/25 px-4 py-2.5">
        {/* Device Switcher */}
        <div
          className="flex flex-wrap items-center gap-1"
          role="group"
          aria-label="Device preset"
        >
          {DEVICE_PRESET_LIST.map((item) => {
            const active = item.id === preset.id;
            const Icon =
              item.orientation === "portrait" ? Smartphone : Monitor;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setDevicePreset(item.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-amber-400/20 text-amber-300 ring-1 ring-amber-400/40"
                    : "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">
                  {item.id === "iphone-16-pro"
                    ? "iPhone"
                    : item.id === "android-flagship"
                      ? "Android"
                      : item.id === "desktop-fhd"
                        ? "1080p"
                        : "1440p"}
                </span>
                <span className="font-mono text-[10px] opacity-70">
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mode & Safe Zones Toggles */}
        <div className="flex items-center gap-2">
          <div
            className="inline-flex rounded-lg border border-white/10 bg-black/40 p-0.5"
            role="group"
            aria-label="Preview mode"
          >
            <button
              type="button"
              onClick={() => setPreviewMode("mockup")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                previewMode === "mockup"
                  ? "bg-white/15 text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Mockup
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode("wallpaper")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                previewMode === "wallpaper"
                  ? "bg-white/15 text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Wallpaper
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowSafeZones(!showSafeZones)}
            aria-pressed={showSafeZones}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
              showSafeZones
                ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-300"
                : "border-white/10 bg-black/30 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Grid className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Safe Zones</span>
          </button>
        </div>
      </div>

      {/* Live Scaled Stage */}
      <div
        ref={containerRef}
        className="relative flex min-h-[420px] flex-1 items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_30%,rgba(245,158,11,0.08),transparent_60%)] p-4"
      >
        <div
          style={{
            width: preset.logicalWidth * scale,
            height: preset.logicalHeight * scale,
          }}
          className="relative flex items-center justify-center"
        >
          {/* Outer Device Bezel Frame in Preview */}
          <div
            style={{
              width: preset.logicalWidth,
              height: preset.logicalHeight,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
            className={`absolute left-0 top-0 overflow-hidden shadow-[0_32px_90px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/20 ${
              isPortrait ? "rounded-[42px]" : "rounded-2xl"
            }`}
          >
            <LockScreenCanvas
              deadline={deadline}
              milestones={milestones}
              theme={theme}
              preset={preset}
              mode={previewMode}
              showSafeZones={showSafeZones}
              interactive={true}
              onToggleMilestone={toggleMilestone}
            />
          </div>
        </div>

        {/* Helpful Caption Pill */}
        <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[11px] text-zinc-300 backdrop-blur-md">
          <Eye className="h-3 w-3 text-amber-400" />
          <span>
            Click rows on the card to check off • Export renders at{" "}
            <strong className="font-mono text-white">
              {preset.width}×{preset.height}px
            </strong>
          </span>
        </div>
      </div>

      {/* Hidden Offscreen Exact-Scale Target for Crisp html-to-image PNG Export */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -left-[9999px] -top-[9999px] opacity-100"
      >
        <LockScreenCanvas
          ref={exportRef}
          deadline={deadline}
          milestones={milestones}
          theme={theme}
          preset={preset}
          mode={previewMode}
          showSafeZones={false}
          interactive={false}
          exportMode={true}
        />
      </div>
    </div>
  );
}
