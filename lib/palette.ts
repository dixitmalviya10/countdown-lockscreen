import type { ThemeConfig, ThemePresetId } from "@/types";
import { rgbToHex } from "./contrast";

export interface ThemePresetDefinition {
  id: ThemePresetId;
  name: string;
  tagline: string;
  orbs: [string, string, string];
  gradientCss: string;
  config: ThemeConfig;
}

export const THEME_PRESETS: Record<ThemePresetId, ThemePresetDefinition> = {
  "autumn-bokeh": {
    id: "autumn-bokeh",
    name: "Autumn Bokeh",
    tagline: "Warm harvest amber & frosted espresso glass",
    orbs: ["#F59E0B", "#EA580C", "#FBBF24"],
    gradientCss:
      "radial-gradient(circle at 20% 18%, rgba(245, 158, 11, 0.55) 0%, transparent 45%), radial-gradient(circle at 82% 24%, rgba(234, 88, 12, 0.48) 0%, transparent 48%), radial-gradient(circle at 50% 88%, rgba(251, 191, 36, 0.42) 0%, transparent 55%), linear-gradient(165deg, #211008 0%, #311709 45%, #160B05 100%)",
    config: {
      presetId: "autumn-bokeh",
      accentColor: "#FBBF24",
      textColor: "#FFFBEB",
      cardBgColor: "#26140A",
      backdropColor: "#1D0E06",
      glassBlur: 22,
      glassOpacity: 0.56,
      cornerRadius: 28,
      fontPairing: "caveat-inter",
      iconStyle: "glass-badge",
      customBgImage: null,
      bgBlur: 14,
      bgDim: 0.35,
      autoContrast: true,
    },
  },
  "midnight-neon": {
    id: "midnight-neon",
    name: "Midnight Neon",
    tagline: "Deep obsidian with electric cyan & violet glow",
    orbs: ["#22D3EE", "#A855F7", "#3B82F6"],
    gradientCss:
      "radial-gradient(circle at 18% 20%, rgba(34, 211, 238, 0.42) 0%, transparent 45%), radial-gradient(circle at 82% 28%, rgba(168, 85, 247, 0.44) 0%, transparent 50%), radial-gradient(circle at 45% 86%, rgba(59, 130, 246, 0.38) 0%, transparent 52%), linear-gradient(165deg, #060914 0%, #0C1226 52%, #05070E 100%)",
    config: {
      presetId: "midnight-neon",
      accentColor: "#22D3EE",
      textColor: "#F8FAFC",
      cardBgColor: "#0D1326",
      backdropColor: "#070913",
      glassBlur: 24,
      glassOpacity: 0.62,
      cornerRadius: 26,
      fontPairing: "greatvibes-inter",
      iconStyle: "minimal-glow",
      customBgImage: null,
      bgBlur: 14,
      bgDim: 0.35,
      autoContrast: true,
    },
  },
  "clean-mono": {
    id: "clean-mono",
    name: "Clean Mono",
    tagline: "Architectural charcoal with crisp silver luminance",
    orbs: ["#E4E4E7", "#A1A1AA", "#52525B"],
    gradientCss:
      "radial-gradient(circle at 25% 18%, rgba(255, 255, 255, 0.22) 0%, transparent 45%), radial-gradient(circle at 80% 72%, rgba(161, 161, 170, 0.2) 0%, transparent 48%), linear-gradient(165deg, #101114 0%, #191B20 48%, #090A0C 100%)",
    config: {
      presetId: "clean-mono",
      accentColor: "#F4F4F5",
      textColor: "#FAFAFA",
      cardBgColor: "#18191E",
      backdropColor: "#0C0D10",
      glassBlur: 20,
      glassOpacity: 0.66,
      cornerRadius: 22,
      fontPairing: "fraunces-inter",
      iconStyle: "solid-pill",
      customBgImage: null,
      bgBlur: 12,
      bgDim: 0.35,
      autoContrast: true,
    },
  },
  "sunrise-gradient": {
    id: "sunrise-gradient",
    name: "Sunrise Gradient",
    tagline: "Twilight plum melting into coral & golden hour",
    orbs: ["#FB7185", "#FBBF24", "#C084FC"],
    gradientCss:
      "radial-gradient(circle at 22% 22%, rgba(251, 113, 133, 0.5) 0%, transparent 46%), radial-gradient(circle at 82% 24%, rgba(192, 132, 252, 0.42) 0%, transparent 48%), radial-gradient(circle at 52% 84%, rgba(251, 191, 36, 0.46) 0%, transparent 52%), linear-gradient(165deg, #1D0F24 0%, #34162A 50%, #1C101B 100%)",
    config: {
      presetId: "sunrise-gradient",
      accentColor: "#FDA4AF",
      textColor: "#FFF1F2",
      cardBgColor: "#291426",
      backdropColor: "#1D0F24",
      glassBlur: 22,
      glassOpacity: 0.56,
      cornerRadius: 28,
      fontPairing: "greatvibes-inter",
      iconStyle: "glass-badge",
      customBgImage: null,
      bgBlur: 14,
      bgDim: 0.35,
      autoContrast: true,
    },
  },
  "study-focus": {
    id: "study-focus",
    name: "Study Focus",
    tagline: "Oxford navy & warm desk-lamp amber clarity",
    orbs: ["#F59E0B", "#3B82F6", "#6366F1"],
    gradientCss:
      "radial-gradient(circle at 20% 22%, rgba(59, 130, 246, 0.42) 0%, transparent 48%), radial-gradient(circle at 78% 76%, rgba(245, 158, 11, 0.38) 0%, transparent 50%), linear-gradient(165deg, #070E20 0%, #101D3D 50%, #070D1D 100%)",
    config: {
      presetId: "study-focus",
      accentColor: "#FBBF24",
      textColor: "#F8FAFC",
      cardBgColor: "#0F1B38",
      backdropColor: "#091126",
      glassBlur: 20,
      glassOpacity: 0.64,
      cornerRadius: 24,
      fontPairing: "fraunces-inter",
      iconStyle: "solid-pill",
      customBgImage: null,
      bgBlur: 14,
      bgDim: 0.38,
      autoContrast: true,
    },
  },
  "spring-pastel": {
    id: "spring-pastel",
    name: "Spring Pastel",
    tagline: "Botanical sage backdrop with mint & sakura bokeh",
    orbs: ["#6EE7B7", "#F9A8D4", "#FDE68A"],
    gradientCss:
      "radial-gradient(circle at 20% 20%, rgba(110, 231, 183, 0.38) 0%, transparent 48%), radial-gradient(circle at 82% 30%, rgba(249, 168, 212, 0.36) 0%, transparent 48%), radial-gradient(circle at 50% 85%, rgba(253, 230, 138, 0.34) 0%, transparent 50%), linear-gradient(165deg, #0B1B18 0%, #132A25 50%, #091714 100%)",
    config: {
      presetId: "spring-pastel",
      accentColor: "#6EE7B7",
      textColor: "#ECFDF5",
      cardBgColor: "#102420",
      backdropColor: "#0B1B18",
      glassBlur: 22,
      glassOpacity: 0.56,
      cornerRadius: 30,
      fontPairing: "caveat-inter",
      iconStyle: "glass-badge",
      customBgImage: null,
      bgBlur: 14,
      bgDim: 0.32,
      autoContrast: true,
    },
  },
};

export interface ExtractedImagePalette {
  dominantBg: string;
  vibrantAccent: string;
  swatches: string[];
}

/**
 * Client-side canvas pixel sampler extracting dominant dark backdrop,
 * vibrant accent, and top color swatches from an uploaded background image.
 */
export async function extractPaletteFromImage(
  dataUrl: string
): Promise<ExtractedImagePalette> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const size = 36;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve({
          dominantBg: "#161822",
          vibrantAccent: "#FBBF24",
          swatches: ["#161822", "#FBBF24", "#22D3EE", "#FB7185", "#F8FAFC"],
        });
        return;
      }
      ctx.drawImage(img, 0, 0, size, size);
      const { data } = ctx.getImageData(0, 0, size, size);

      const buckets = new Map<
        string,
        { count: number; rSum: number; gSum: number; bSum: number; sat: number; lum: number }
      >();

      let totalR = 0;
      let totalG = 0;
      let totalB = 0;
      let pixelCount = 0;

      for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3];
        if (a < 128) continue;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        totalR += r;
        totalG += g;
        totalB += b;
        pixelCount += 1;

        // Quantize to 24-step buckets
        const qr = Math.floor(r / 24) * 24;
        const qg = Math.floor(g / 24) * 24;
        const qb = Math.floor(b / 24) * 24;
        const key = `${qr}-${qg}-${qb}`;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const sat = max === 0 ? 0 : (max - min) / max;
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        const existing = buckets.get(key);
        if (existing) {
          existing.count += 1;
          existing.rSum += r;
          existing.gSum += g;
          existing.bSum += b;
        } else {
          buckets.set(key, { count: 1, rSum: r, gSum: g, bSum: b, sat, lum });
        }
      }

      const avgBg = pixelCount
        ? rgbToHex({
            r: (totalR / pixelCount) * 0.42,
            g: (totalG / pixelCount) * 0.42,
            b: (totalB / pixelCount) * 0.42,
          })
        : "#141620";

      const rankedByFreq = Array.from(buckets.values()).sort(
        (a, b) => b.count - a.count
      );

      const swatches = rankedByFreq.slice(0, 5).map((b) =>
        rgbToHex({
          r: b.rSum / b.count,
          g: b.gSum / b.count,
          b: b.bSum / b.count,
        })
      );

      const rankedVibrant = Array.from(buckets.values())
        .filter((b) => b.lum > 0.25 && b.lum < 0.9)
        .sort((a, b) => b.sat * Math.sqrt(b.count) - a.sat * Math.sqrt(a.count));

      const bestAccentBucket = rankedVibrant[0] ?? rankedByFreq[0];
      const vibrantAccent = bestAccentBucket
        ? rgbToHex({
            r: Math.min(255, (bestAccentBucket.rSum / bestAccentBucket.count) * 1.15),
            g: Math.min(255, (bestAccentBucket.gSum / bestAccentBucket.count) * 1.15),
            b: Math.min(255, (bestAccentBucket.bSum / bestAccentBucket.count) * 1.15),
          })
        : "#FBBF24";

      resolve({
        dominantBg: avgBg,
        vibrantAccent,
        swatches: swatches.length
          ? swatches
          : ["#161822", "#FBBF24", "#22D3EE", "#FB7185", "#F8FAFC"],
      });
    };
    img.onerror = () => {
      resolve({
        dominantBg: "#161822",
        vibrantAccent: "#FBBF24",
        swatches: ["#161822", "#FBBF24", "#22D3EE", "#FB7185", "#F8FAFC"],
      });
    };
    img.src = dataUrl;
  });
}
