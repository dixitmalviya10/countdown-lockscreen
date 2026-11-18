import { describe, expect, it } from "vitest";
import { analyzeLockScreenContrast, getContrastRatio } from "@/lib/contrast";
import { THEME_PRESETS } from "@/lib/palette";

describe("WCAG AA contrast analyzer", () => {
  it("computes black vs white contrast as 21:1", () => {
    expect(getContrastRatio("#FFFFFF", "#000000")).toBe(21);
    expect(getContrastRatio("#121212", "#121212")).toBe(1);
  });

  it("verifies all 6 built-in theme presets pass WCAG AA", () => {
    for (const preset of Object.values(THEME_PRESETS)) {
      const analysis = analyzeLockScreenContrast(preset.config);
      expect(analysis.textRatio).toBeGreaterThanOrEqual(4.5);
      expect(analysis.accentRatio).toBeGreaterThanOrEqual(3.0);
      expect(analysis.passesOverall).toBe(true);
    }
  });

  it("flags low-contrast combinations and recommends an AA-passing text color", () => {
    const analysis = analyzeLockScreenContrast({
      backdropColor: "#141414",
      cardBgColor: "#181818",
      glassOpacity: 0.7,
      textColor: "#2C2C2C",
      accentColor: "#252525",
      bgDim: 0.3,
      customBgImage: null,
    });

    expect(analysis.passesOverall).toBe(false);
    expect(
      getContrastRatio(
        analysis.recommendedTextColor,
        analysis.effectiveCardSurfaceHex
      )
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      getContrastRatio(
        analysis.recommendedAccentColor,
        analysis.effectiveCardSurfaceHex
      )
    ).toBeGreaterThanOrEqual(3.0);
  });
});
