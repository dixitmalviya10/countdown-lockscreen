import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { z } from "zod";
import type { SharedCountdownState } from "@/types";

const SharedStateSchema = z.object({
  deadline: z.object({
    id: z.string(),
    title: z.string(),
    headline: z.string(),
    targetDateISO: z.string(),
    timezone: z.string(),
    category: z.enum([
      "Exam",
      "Client deliverable",
      "Event/Party",
      "Launch",
      "Travel",
      "Custom",
    ]),
    questionnaire: z.object({
      doneLooksLike: z.string(),
      hoursPerDay: z.number(),
      fixedDates: z.string(),
    }),
  }),
  milestones: z.array(
    z.object({
      id: z.string(),
      offsetDays: z.number(),
      computedDateISO: z.string(),
      formattedDate: z.string(),
      action: z.string(),
      icon: z.string(),
      checked: z.boolean(),
    })
  ),
  theme: z.object({
    presetId: z.enum([
      "autumn-bokeh",
      "midnight-neon",
      "clean-mono",
      "sunrise-gradient",
      "study-focus",
      "spring-pastel",
    ]),
    accentColor: z.string(),
    textColor: z.string(),
    cardBgColor: z.string(),
    backdropColor: z.string(),
    glassBlur: z.number(),
    glassOpacity: z.number(),
    cornerRadius: z.number(),
    fontPairing: z.enum(["caveat-inter", "greatvibes-inter", "fraunces-inter"]),
    iconStyle: z.enum(["glass-badge", "minimal-glow", "solid-pill"]),
    customBgImage: z.null(),
    bgBlur: z.number(),
    bgDim: z.number(),
    autoContrast: z.boolean(),
  }),
  devicePresetId: z.enum([
    "iphone-16-pro",
    "android-flagship",
    "desktop-fhd",
    "desktop-qhd",
  ]),
  previewMode: z.enum(["mockup", "wallpaper"]),
});

export function encodeShareState(state: {
  deadline: SharedCountdownState["deadline"];
  milestones: SharedCountdownState["milestones"];
  theme: Omit<SharedCountdownState["theme"], "customBgImage"> & {
    customBgImage?: string | null;
  };
  devicePresetId: SharedCountdownState["devicePresetId"];
  previewMode: SharedCountdownState["previewMode"];
}): string {
  const compact: SharedCountdownState = {
    deadline: state.deadline,
    milestones: state.milestones.slice(0, 7),
    theme: {
      ...state.theme,
      customBgImage: null,
    },
    devicePresetId: state.devicePresetId,
    previewMode: state.previewMode,
  };
  return compressToEncodedURIComponent(JSON.stringify(compact));
}

export function decodeShareState(hash: string): SharedCountdownState | null {
  try {
    const clean = decodeURIComponent(hash);
    const json = decompressFromEncodedURIComponent(clean);
    if (!json) return null;
    const parsed = JSON.parse(json);
    const validated = SharedStateSchema.safeParse(parsed);
    return validated.success ? validated.data : null;
  } catch {
    return null;
  }
}
