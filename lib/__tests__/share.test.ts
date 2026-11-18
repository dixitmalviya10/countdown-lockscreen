import { describe, expect, it } from "vitest";
import { decodeShareState, encodeShareState } from "@/lib/share";
import { THEME_PRESETS } from "@/lib/palette";
import { DEMO_DEADLINE, DEMO_MILESTONES } from "@/store/useCountdownStore";

describe("URL share serializer", () => {
  it("encodes and decodes countdown state via lz-string while stripping customBgImage", () => {
    const hash = encodeShareState({
      deadline: DEMO_DEADLINE,
      milestones: DEMO_MILESTONES,
      theme: {
        ...THEME_PRESETS["autumn-bokeh"].config,
        customBgImage: "data:image/png;base64,HUGE_IMAGE_DATA",
      },
      devicePresetId: "iphone-16-pro",
      previewMode: "mockup",
    });

    expect(hash.length).toBeGreaterThan(20);
    expect(hash).not.toContain("HUGE_IMAGE_DATA");

    const decoded = decodeShareState(hash);
    expect(decoded).not.toBeNull();
    expect(decoded?.deadline.title).toBe(DEMO_DEADLINE.title);
    expect(decoded?.milestones).toHaveLength(DEMO_MILESTONES.length);
    expect(decoded?.theme.customBgImage).toBeNull();
  });

  it("returns null for tampered or invalid share hashes", () => {
    expect(decodeShareState("not-a-valid-hash")).toBeNull();
  });
});
