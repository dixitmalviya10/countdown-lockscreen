import type { ThemeConfig } from "@/types";

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): RGB {
  const sanitized = hex.replace("#", "").trim();
  if (sanitized.length === 3) {
    const r = Number.parseInt(sanitized[0] + sanitized[0], 16);
    const g = Number.parseInt(sanitized[1] + sanitized[1], 16);
    const b = Number.parseInt(sanitized[2] + sanitized[2], 16);
    return { r: r || 0, g: g || 0, b: b || 0 };
  }
  const full = sanitized.padEnd(6, "0").slice(0, 6);
  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);
  return {
    r: Number.isNaN(r) ? 0 : r,
    g: Number.isNaN(g) ? 0 : g,
    b: Number.isNaN(b) ? 0 : b,
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const clamp = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v)))
      .toString(16)
      .padStart(2, "0");
  return `#${clamp(r)}${clamp(g)}${clamp(b)}`.toUpperCase();
}

export function blendColors(fg: RGB, bg: RGB, alpha: number): RGB {
  const a = Math.max(0, Math.min(1, alpha));
  return {
    r: fg.r * a + bg.r * (1 - a),
    g: fg.g * a + bg.g * (1 - a),
    b: fg.b * a + bg.b * (1 - a),
  };
}

export function getRelativeLuminance(rgb: RGB): number {
  const transform = (channel: number) => {
    const sRGB = channel / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  };
  const r = transform(rgb.r);
  const g = transform(rgb.g);
  const b = transform(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastRatio(hexA: string, hexB: string): number {
  const lumA = getRelativeLuminance(hexToRgb(hexA));
  const lumB = getRelativeLuminance(hexToRgb(hexB));
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

export interface ContrastAnalysis {
  effectiveCardSurfaceHex: string;
  textRatio: number;
  accentRatio: number;
  passesTextAA: boolean; // >= 4.5
  passesAccentAA: boolean; // >= 3.0 (bold/large accent label)
  passesOverall: boolean;
  recommendedTextColor: string;
  recommendedAccentColor: string;
}

function adjustColorUntilContrast(
  fgHex: string,
  bgHex: string,
  targetRatio: number,
  preferLight: boolean
): string {
  if (getContrastRatio(fgHex, bgHex) >= targetRatio) {
    return fgHex;
  }
  const startRgb = hexToRgb(fgHex);
  const targetRgb: RGB = preferLight
    ? { r: 255, g: 255, b: 255 }
    : { r: 10, g: 12, b: 18 };

  for (let step = 1; step <= 20; step++) {
    const candidate = rgbToHex(blendColors(targetRgb, startRgb, step / 20));
    if (getContrastRatio(candidate, bgHex) >= targetRatio) {
      return candidate;
    }
  }
  return preferLight ? "#FFFFFF" : "#0A0C12";
}

export function analyzeLockScreenContrast(
  theme: Pick<
    ThemeConfig,
    "backdropColor" | "cardBgColor" | "glassOpacity" | "textColor" | "accentColor" | "bgDim" | "customBgImage"
  >
): ContrastAnalysis {
  const backdropRgb = hexToRgb(theme.backdropColor);
  const dimmedBackdrop = theme.customBgImage
    ? blendColors({ r: 0, g: 0, b: 0 }, backdropRgb, theme.bgDim)
    : backdropRgb;
  const cardRgb = hexToRgb(theme.cardBgColor);
  const effectiveSurfaceRgb = blendColors(
    cardRgb,
    dimmedBackdrop,
    theme.glassOpacity
  );
  const effectiveCardSurfaceHex = rgbToHex(effectiveSurfaceRgb);

  const textRatio = getContrastRatio(theme.textColor, effectiveCardSurfaceHex);
  const accentRatio = getContrastRatio(theme.accentColor, effectiveCardSurfaceHex);

  const passesTextAA = textRatio >= 4.5;
  const passesAccentAA = accentRatio >= 3.0;
  const surfaceLum = getRelativeLuminance(effectiveSurfaceRgb);
  const preferLight = surfaceLum < 0.35;

  return {
    effectiveCardSurfaceHex,
    textRatio,
    accentRatio,
    passesTextAA,
    passesAccentAA,
    passesOverall: passesTextAA && passesAccentAA,
    recommendedTextColor: adjustColorUntilContrast(
      theme.textColor,
      effectiveCardSurfaceHex,
      4.5,
      preferLight
    ),
    recommendedAccentColor: adjustColorUntilContrast(
      theme.accentColor,
      effectiveCardSurfaceHex,
      3.2,
      preferLight
    ),
  };
}
