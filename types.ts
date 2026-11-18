export type DeadlineCategory =
  | "Exam"
  | "Client deliverable"
  | "Event/Party"
  | "Launch"
  | "Travel"
  | "Custom";

export interface PlannerQuestionnaire {
  doneLooksLike: string;
  hoursPerDay: number;
  fixedDates: string;
}

export interface Deadline {
  id: string;
  title: string;
  headline: string;
  targetDateISO: string; // Local date-time string like "2026-11-23T23:59:00"
  timezone: string; // IANA timezone, e.g., "America/Los_Angeles"
  category: DeadlineCategory;
  questionnaire: PlannerQuestionnaire;
}

export interface Milestone {
  id: string;
  offsetDays: number;
  computedDateISO: string; // YYYY-MM-DD in target timezone
  formattedDate: string; // e.g., "Nov 16"
  action: string; // Hard limit: 5 words max
  icon: string; // Lucide icon name or emoji
  checked: boolean;
}

export type ThemePresetId =
  | "autumn-bokeh"
  | "midnight-neon"
  | "clean-mono"
  | "sunrise-gradient"
  | "study-focus"
  | "spring-pastel";

export type FontPairingId =
  | "caveat-inter"
  | "greatvibes-inter"
  | "fraunces-inter";

export type IconStyleId = "glass-badge" | "minimal-glow" | "solid-pill";

export interface ThemeConfig {
  presetId: ThemePresetId;
  accentColor: string;
  textColor: string;
  cardBgColor: string;
  backdropColor: string;
  glassBlur: number;
  glassOpacity: number;
  cornerRadius: number;
  fontPairing: FontPairingId;
  iconStyle: IconStyleId;
  customBgImage: string | null;
  bgBlur: number;
  bgDim: number;
  autoContrast: boolean;
}

export type DevicePresetId =
  | "iphone-16-pro"
  | "android-flagship"
  | "desktop-fhd"
  | "desktop-qhd";

export interface DevicePreset {
  id: DevicePresetId;
  name: string;
  badge: string;
  width: number;
  height: number;
  logicalWidth: number;
  logicalHeight: number;
  pixelRatio: number;
  orientation: "portrait" | "landscape";
}

export type PreviewMode = "mockup" | "wallpaper";

export interface ReminderConfig {
  timeOfDay: string; // "HH:mm" e.g. "09:00"
  dailyRecurring: boolean;
  browserNotificationEnabled: boolean;
}

export type BuilderStep = "deadline" | "milestones" | "style" | "export";

export interface SharedCountdownState {
  deadline: Deadline;
  milestones: Milestone[];
  theme: Omit<ThemeConfig, "customBgImage"> & { customBgImage: null };
  devicePresetId: DevicePresetId;
  previewMode: PreviewMode;
}
