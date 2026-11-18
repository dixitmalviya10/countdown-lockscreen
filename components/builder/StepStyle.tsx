"use client";

import React, { useRef, useState } from "react";
import {
  CheckCircle2,
  Eye,
  ImagePlus,
  Palette,
  ShieldAlert,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import type { FontPairingId, IconStyleId, ThemePresetId } from "@/types";
import { analyzeLockScreenContrast } from "@/lib/contrast";
import {
  extractPaletteFromImage,
  THEME_PRESETS,
  type ExtractedImagePalette,
} from "@/lib/palette";
import { useCountdownStore } from "@/store/useCountdownStore";
import { Button, Label, StudioCard } from "@/components/ui/Primitives";
import { useToast } from "@/components/ui/ToastProvider";

const PRESET_LIST = Object.values(THEME_PRESETS);

const ACCENT_SWATCHES = [
  "#FBBF24",
  "#22D3EE",
  "#FDA4AF",
  "#6EE7B7",
  "#C084FC",
  "#FB923C",
  "#F4F4F5",
];

const FONT_PAIRINGS: Array<{
  id: FontPairingId;
  label: string;
  previewClass: string;
}> = [
  { id: "caveat-inter", label: "Caveat + Inter", previewClass: "font-script text-xl" },
  {
    id: "greatvibes-inter",
    label: "Great Vibes + Inter",
    previewClass: "font-script-elegant text-xl",
  },
  {
    id: "fraunces-inter",
    label: "Fraunces + Inter",
    previewClass: "font-display italic text-base",
  },
];

const ICON_STYLES: Array<{ id: IconStyleId; label: string }> = [
  { id: "glass-badge", label: "Glass Badge" },
  { id: "minimal-glow", label: "Minimal Glow" },
  { id: "solid-pill", label: "Solid Pill" },
];

export function StepStyle() {
  const { theme, setTheme, applyThemePreset, setActiveStep } =
    useCountdownStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [extractedPalette, setExtractedPalette] =
    useState<ExtractedImagePalette | null>(null);

  const contrast = analyzeLockScreenContrast(theme);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : null;
      if (!dataUrl) return;
      setTheme({ customBgImage: dataUrl });
      const extracted = await extractPaletteFromImage(dataUrl);
      setExtractedPalette(extracted);
      toast({
        title: "Reference background loaded",
        description: "Color palette extracted automatically below.",
        variant: "success",
      });
    };
    reader.readAsDataURL(file);
  };

  const applyExtractedPalette = () => {
    if (!extractedPalette) return;
    setTheme({
      backdropColor: extractedPalette.dominantBg,
      cardBgColor: extractedPalette.dominantBg,
      accentColor: extractedPalette.vibrantAccent,
      autoContrast: true,
    });
    toast({
      title: "Applied extracted colors",
      description: "Accent and frosted card tuned to your image.",
      variant: "success",
    });
  };

  return (
    <div className="space-y-4">
      {/* 6 Procedural Theme Presets */}
      <StudioCard className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-100">
            <Palette className="h-3.5 w-3.5 text-amber-400" />
            Procedural Bokeh Themes
          </span>
          <span className="text-[11px] text-zinc-400">Zero external deps</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {PRESET_LIST.map((preset) => {
            const active = theme.presetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  applyThemePreset(preset.id as ThemePresetId);
                  toast({ title: `Applied ${preset.name}`, variant: "info" });
                }}
                className={`group overflow-hidden rounded-xl border text-left transition ${
                  active
                    ? "border-amber-400 ring-1 ring-amber-400/40"
                    : "border-white/10 hover:border-white/25"
                }`}
              >
                <div
                  style={{ background: preset.gradientCss }}
                  className="relative h-14 w-full overflow-hidden"
                >
                  <div className="absolute inset-0 flex items-center justify-end gap-1 p-2">
                    {preset.orbs.map((orb, i) => (
                      <span
                        key={i}
                        style={{ backgroundColor: orb }}
                        className="h-3 w-3 rounded-full border border-white/30 shadow"
                      />
                    ))}
                  </div>
                </div>
                <div className="bg-black/45 p-2">
                  <p className="truncate text-xs font-semibold text-zinc-100">
                    {preset.name}
                  </p>
                  <p className="truncate text-[10px] text-zinc-400">
                    {preset.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </StudioCard>

      {/* Custom Reference / Background Image + Dominant Color Extraction */}
      <StudioCard className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-100">
            <ImagePlus className="h-3.5 w-3.5 text-cyan-400" />
            Custom Reference / Gemini Backdrop
          </span>
          {theme.customBgImage && (
            <button
              type="button"
              onClick={() => {
                setTheme({ customBgImage: null });
                setExtractedPalette(null);
              }}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400 hover:text-rose-300"
            >
              <Trash2 className="h-3 w-3" />
              Remove image
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-black/30 px-4 py-3 text-xs font-medium text-zinc-300 transition hover:border-amber-400/50 hover:bg-amber-400/5"
        >
          <ImagePlus className="h-4 w-4 text-amber-400" />
          {theme.customBgImage
            ? "Replace uploaded background image"
            : "Upload image (or Gemini-generated art)"}
        </button>

        {theme.customBgImage && (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-[11px] text-zinc-400">
                  <span>Backdrop Blur</span>
                  <span className="font-mono">{theme.bgBlur}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  value={theme.bgBlur}
                  onChange={(e) =>
                    setTheme({ bgBlur: Number.parseInt(e.target.value, 10) })
                  }
                  className="mt-1 w-full accent-amber-400"
                />
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-zinc-400">
                  <span>Backdrop Dim</span>
                  <span className="font-mono">
                    {Math.round(theme.bgDim * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={85}
                  value={Math.round(theme.bgDim * 100)}
                  onChange={(e) =>
                    setTheme({
                      bgDim: Number.parseInt(e.target.value, 10) / 100,
                    })
                  }
                  className="mt-1 w-full accent-amber-400"
                />
              </div>
            </div>

            {extractedPalette && (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/40 p-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-zinc-400">Extracted:</span>
                  {extractedPalette.swatches.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      title={`Use ${hex} as accent`}
                      onClick={() => setTheme({ accentColor: hex })}
                      style={{ backgroundColor: hex }}
                      className="h-5 w-5 rounded-full border border-white/30"
                    />
                  ))}
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={applyExtractedPalette}
                >
                  <Wand2 className="h-3 w-3 text-amber-400" />
                  Apply Palette
                </Button>
              </div>
            )}
          </div>
        )}
      </StudioCard>

      {/* Glass, Typography, Accent & Icons */}
      <StudioCard className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>Glass Blur</span>
              <span className="font-mono">{theme.glassBlur}px</span>
            </div>
            <input
              type="range"
              min={8}
              max={40}
              value={theme.glassBlur}
              onChange={(e) =>
                setTheme({ glassBlur: Number.parseInt(e.target.value, 10) })
              }
              className="mt-1.5 w-full accent-amber-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>Card Opacity</span>
              <span className="font-mono">
                {Math.round(theme.glassOpacity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={85}
              value={Math.round(theme.glassOpacity * 100)}
              onChange={(e) =>
                setTheme({
                  glassOpacity: Number.parseInt(e.target.value, 10) / 100,
                })
              }
              className="mt-1.5 w-full accent-amber-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>Corner Radius</span>
              <span className="font-mono">{theme.cornerRadius}px</span>
            </div>
            <input
              type="range"
              min={12}
              max={40}
              value={theme.cornerRadius}
              onChange={(e) =>
                setTheme({ cornerRadius: Number.parseInt(e.target.value, 10) })
              }
              className="mt-1.5 w-full accent-amber-400"
            />
          </div>
        </div>

        {/* Font Pairing */}
        <div>
          <Label>Title Script + UI Font Pairing</Label>
          <div className="mt-1.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {FONT_PAIRINGS.map((fp) => {
              const active = theme.fontPairing === fp.id;
              return (
                <button
                  key={fp.id}
                  type="button"
                  onClick={() => setTheme({ fontPairing: fp.id })}
                  className={`rounded-xl border px-3 py-2 text-left transition ${
                    active
                      ? "border-amber-400/60 bg-amber-400/15 text-amber-100"
                      : "border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.08]"
                  }`}
                >
                  <div className={fp.previewClass}>T-Minus</div>
                  <div className="text-[10px] text-zinc-400">{fp.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accent Color & Icon Style */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Accent Color</Label>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              {ACCENT_SWATCHES.map((swatch) => (
                <button
                  key={swatch}
                  type="button"
                  aria-label={`Select accent color ${swatch}`}
                  onClick={() => setTheme({ accentColor: swatch })}
                  style={{ backgroundColor: swatch }}
                  className={`h-7 w-7 rounded-full border-2 transition ${
                    theme.accentColor.toUpperCase() === swatch.toUpperCase()
                      ? "scale-110 border-white ring-2 ring-amber-400/60"
                      : "border-white/20"
                  }`}
                />
              ))}
              <input
                type="color"
                aria-label="Custom accent color"
                value={theme.accentColor}
                onChange={(e) => setTheme({ accentColor: e.target.value })}
                className="h-7 w-8 cursor-pointer rounded border border-white/20 bg-transparent"
              />
            </div>
          </div>

          <div>
            <Label>Row Icon Style</Label>
            <div className="mt-1.5 flex gap-1.5">
              {ICON_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setTheme({ iconStyle: style.id })}
                  className={`flex-1 rounded-xl border px-2 py-2 text-[11px] font-medium transition ${
                    theme.iconStyle === style.id
                      ? "border-amber-400/60 bg-amber-400/15 text-amber-200"
                      : "border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.08]"
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </StudioCard>

      {/* Live WCAG AA Contrast Check */}
      <StudioCard
        className={`flex flex-wrap items-center justify-between gap-3 ${
          contrast.passesOverall || theme.autoContrast
            ? "border-emerald-500/25 bg-emerald-950/15"
            : "border-amber-500/35 bg-amber-950/20"
        }`}
      >
        <div className="flex items-start gap-2.5">
          {contrast.passesOverall || theme.autoContrast ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          )}
          <div>
            <p className="text-xs font-semibold text-zinc-100">
              <Eye className="mr-1 inline h-3.5 w-3.5" />
              WCAG AA Legibility Guard ({contrast.textRatio}:1 text •{" "}
              {contrast.accentRatio}:1 accent)
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-400">
              {theme.autoContrast
                ? "Auto-adjust enabled: keeps text >= 4.5:1 over frosted glass."
                : contrast.passesOverall
                  ? "Passes WCAG AA legibility standards."
                  : "Low contrast over background — turn on Auto-Adjust for crisp readability."}
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={theme.autoContrast}
          onClick={() => setTheme({ autoContrast: !theme.autoContrast })}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
            theme.autoContrast
              ? "border-emerald-400/40 bg-emerald-400/20 text-emerald-200"
              : "border-white/15 bg-white/5 text-zinc-300"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          {theme.autoContrast ? "Auto-Contrast ON" : "Enable Auto-Contrast"}
        </button>
      </StudioCard>

      <div className="flex justify-end pt-1">
        <Button
          type="button"
          variant="amber"
          onClick={() => setActiveStep("export")}
        >
          Export, Reminders & Share →
        </Button>
      </div>
    </div>
  );
}
