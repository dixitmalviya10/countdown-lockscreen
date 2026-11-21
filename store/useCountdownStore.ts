"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  BuilderStep,
  Deadline,
  DeadlineCategory,
  DevicePresetId,
  Milestone,
  PreviewMode,
  ReminderConfig,
  SharedCountdownState,
  ThemeConfig,
  ThemePresetId,
} from "@/types";
import { THEME_PRESETS } from "@/lib/palette";
import {
  buildDefaultHeadline,
  clampToFiveWords,
  generateDeterministicMilestones,
  getSuggestedFutureDateISO,
  recalculateMilestoneDates,
} from "@/lib/planner";
import { DEMO_DEADLINE, DEMO_MILESTONES } from "@/lib/demo-data";
import { createId } from "@/lib/utils";

export { DEMO_DEADLINE, DEMO_MILESTONES };

export type QuickTemplateKey =
  | "handshake-challenge"
  | "friendsgiving"
  | "final-exam"
  | "product-launch"
  | "tokyo-trip";

export interface CountdownStoreState {
  deadline: Deadline;
  milestones: Milestone[];
  theme: ThemeConfig;
  activeStep: BuilderStep;
  devicePresetId: DevicePresetId;
  previewMode: PreviewMode;
  showSafeZones: boolean;
  reminderConfig: ReminderConfig;

  setDeadline: (partial: Partial<Deadline>) => void;
  setQuestionnaire: (
    partial: Partial<Deadline["questionnaire"]>
  ) => void;
  applyQuickTemplate: (key: QuickTemplateKey) => void;
  regenerateMilestones: () => void;
  setMilestones: (milestones: Milestone[]) => void;
  updateMilestone: (id: string, partial: Partial<Milestone>) => void;
  toggleMilestone: (id: string) => void;
  addMilestone: () => void;
  removeMilestone: (id: string) => void;
  reorderMilestones: (newOrder: Milestone[]) => void;
  setTheme: (partial: Partial<ThemeConfig>) => void;
  applyThemePreset: (presetId: ThemePresetId) => void;
  setActiveStep: (step: BuilderStep) => void;
  setDevicePreset: (id: DevicePresetId) => void;
  setPreviewMode: (mode: PreviewMode) => void;
  setShowSafeZones: (show: boolean) => void;
  setReminderConfig: (partial: Partial<ReminderConfig>) => void;
  hydrateFromShareState: (shared: SharedCountdownState) => void;
  resetDemo: () => void;
}

const DEFAULT_THEME: ThemeConfig = {
  ...THEME_PRESETS["autumn-bokeh"].config,
};

const DEFAULT_REMINDERS: ReminderConfig = {
  timeOfDay: "09:00",
  dailyRecurring: true,
  browserNotificationEnabled: false,
};

export const useCountdownStore = create<CountdownStoreState>()(
  persist(
    (set, get) => ({
      deadline: DEMO_DEADLINE,
      milestones: DEMO_MILESTONES,
      theme: DEFAULT_THEME,
      activeStep: "deadline",
      devicePresetId: "iphone-16-pro",
      previewMode: "mockup",
      showSafeZones: false,
      reminderConfig: DEFAULT_REMINDERS,

      setDeadline: (partial) => {
        const prev = get().deadline;
        const next: Deadline = { ...prev, ...partial };
        const shouldRecalcDates =
          partial.targetDateISO !== undefined ||
          partial.timezone !== undefined;
        const updatedMilestones = shouldRecalcDates
          ? recalculateMilestoneDates(
              get().milestones,
              next.targetDateISO,
              next.timezone
            )
          : get().milestones;
        set({ deadline: next, milestones: updatedMilestones });
      },

      setQuestionnaire: (partial) => {
        const prev = get().deadline;
        set({
          deadline: {
            ...prev,
            questionnaire: { ...prev.questionnaire, ...partial },
          },
        });
      },

      applyQuickTemplate: (key) => {
        const browserTz =
          typeof Intl !== "undefined"
            ? Intl.DateTimeFormat().resolvedOptions().timeZone ||
              "America/Los_Angeles"
            : "America/Los_Angeles";

        if (key === "handshake-challenge") {
          set({
            deadline: DEMO_DEADLINE,
            milestones: DEMO_MILESTONES,
            theme: { ...THEME_PRESETS["autumn-bokeh"].config },
          });
          return;
        }

        const templates: Record<
          Exclude<QuickTemplateKey, "handshake-challenge">,
          {
            title: string;
            headline: string;
            category: DeadlineCategory;
            daysAhead: number;
            presetId: ThemePresetId;
            doneLooksLike: string;
            hoursPerDay: number;
            fixedDates: string;
            customMilestones?: Array<{
              offset: number;
              action: string;
              icon: string;
            }>;
          }
        > = {
          friendsgiving: {
            title: "Friendsgiving",
            headline: "Friendsgiving is coming up!",
            category: "Event/Party",
            daysAhead: 14,
            presetId: "autumn-bokeh",
            doneLooksLike: "Warm table, roast turkey, happy friends",
            hoursPerDay: 2,
            fixedDates: "Sunday grocery run",
            customMilestones: [
              { offset: 14, action: "Finalize menu and guest list", icon: "ClipboardList" },
              { offset: 10, action: "Order the fresh turkey", icon: "ShoppingBag" },
              { offset: 7, action: "Delegate side dishes & drinks", icon: "Users" },
              { offset: 5, action: "Shop non-perishables & decor", icon: "Sparkles" },
              { offset: 2, action: "Prep pies and thaw turkey", icon: "ChefHat" },
              { offset: 1, action: "Set table and chill wine", icon: "Wine" },
              { offset: 0, action: "Roast, toast, and celebrate", icon: "Utensils" },
            ],
          },
          "final-exam": {
            title: "Systems Final Exam",
            headline: "Finals week countdown",
            category: "Exam",
            daysAhead: 10,
            presetId: "study-focus",
            doneLooksLike: "Confident on every practice problem",
            hoursPerDay: 4,
            fixedDates: "Wed practice test",
          },
          "product-launch": {
            title: "v2.0 Public Launch",
            headline: "v2.0 Launch is coming up!",
            category: "Launch",
            daysAhead: 12,
            presetId: "midnight-neon",
            doneLooksLike: "Zero P0 bugs and Product Hunt live",
            hoursPerDay: 5,
            fixedDates: "Day-2 press embargo",
          },
          "tokyo-trip": {
            title: "Tokyo Adventure",
            headline: "Tokyo takes off soon!",
            category: "Travel",
            daysAhead: 14,
            presetId: "sunrise-gradient",
            doneLooksLike: "Bags packed, Suica loaded, seats booked",
            hoursPerDay: 1,
            fixedDates: "T-1 online check-in",
          },
        };

        const tpl = templates[key];
        const targetDateISO = getSuggestedFutureDateISO(tpl.daysAhead);
        const nextDeadline: Deadline = {
          id: createId("dl"),
          title: tpl.title,
          headline: tpl.headline,
          targetDateISO,
          timezone: browserTz,
          category: tpl.category,
          questionnaire: {
            doneLooksLike: tpl.doneLooksLike,
            hoursPerDay: tpl.hoursPerDay,
            fixedDates: tpl.fixedDates,
          },
        };

        const generated = tpl.customMilestones
          ? recalculateMilestoneDates(
              tpl.customMilestones.map((m, i) => ({
                id: createId(`ms-${i}`),
                offsetDays: m.offset,
                computedDateISO: "",
                formattedDate: "",
                action: clampToFiveWords(m.action),
                icon: m.icon,
                checked: false,
              })),
              targetDateISO,
              browserTz
            )
          : generateDeterministicMilestones({
              title: nextDeadline.title,
              targetDateISO: nextDeadline.targetDateISO,
              timezone: nextDeadline.timezone,
              category: nextDeadline.category,
              questionnaire: nextDeadline.questionnaire,
            });

        set({
          deadline: nextDeadline,
          milestones: generated,
          theme: { ...THEME_PRESETS[tpl.presetId].config },
        });
      },

      regenerateMilestones: () => {
        const d = get().deadline;
        const generated = generateDeterministicMilestones({
          title: d.title,
          targetDateISO: d.targetDateISO,
          timezone: d.timezone,
          category: d.category,
          questionnaire: d.questionnaire,
        });
        set({
          deadline: {
            ...d,
            headline:
              d.headline || buildDefaultHeadline(d.title, d.category),
          },
          milestones: generated,
        });
      },

      setMilestones: (milestones) => {
        const d = get().deadline;
        set({
          milestones: recalculateMilestoneDates(
            milestones.slice(0, 7),
            d.targetDateISO,
            d.timezone
          ),
        });
      },

      updateMilestone: (id, partial) => {
        const d = get().deadline;
        const next = get().milestones.map((m) => {
          if (m.id !== id) return m;
          const updated = { ...m, ...partial };
          if (partial.offsetDays !== undefined) {
            return recalculateMilestoneDates(
              [updated],
              d.targetDateISO,
              d.timezone
            )[0];
          }
          return updated;
        });
        set({ milestones: next });
      },

      toggleMilestone: (id) => {
        set({
          milestones: get().milestones.map((m) =>
            m.id === id ? { ...m, checked: !m.checked } : m
          ),
        });
      },

      addMilestone: () => {
        const current = get().milestones;
        if (current.length >= 7) return;
        const d = get().deadline;
        const existingOffsets = new Set(current.map((m) => m.offsetDays));
        let candidateOffset = 4;
        for (const o of [14, 10, 7, 6, 5, 4, 3, 2, 1, 0]) {
          if (!existingOffsets.has(o)) {
            candidateOffset = o;
            break;
          }
        }
        const [newRow] = recalculateMilestoneDates(
          [
            {
              id: createId("ms"),
              offsetDays: candidateOffset,
              computedDateISO: "",
              formattedDate: "",
              action: "Review milestone progress",
              icon: "Sparkles",
              checked: false,
            },
          ],
          d.targetDateISO,
          d.timezone
        );
        const next = [...current, newRow].sort(
          (a, b) => b.offsetDays - a.offsetDays
        );
        set({ milestones: next });
      },

      removeMilestone: (id) => {
        const current = get().milestones;
        if (current.length <= 2) return;
        set({ milestones: current.filter((m) => m.id !== id) });
      },

      reorderMilestones: (newOrder) => {
        set({ milestones: newOrder });
      },

      setTheme: (partial) => {
        set({ theme: { ...get().theme, ...partial } });
      },

      applyThemePreset: (presetId) => {
        const preset = THEME_PRESETS[presetId];
        if (!preset) return;
        const currentCustomImg = get().theme.customBgImage;
        set({
          theme: {
            ...preset.config,
            customBgImage: currentCustomImg,
          },
        });
      },

      setActiveStep: (step) => set({ activeStep: step }),
      setDevicePreset: (id) => set({ devicePresetId: id }),
      setPreviewMode: (mode) => set({ previewMode: mode }),
      setShowSafeZones: (show) => set({ showSafeZones: show }),
      setReminderConfig: (partial) =>
        set({ reminderConfig: { ...get().reminderConfig, ...partial } }),

      hydrateFromShareState: (shared) => {
        set({
          deadline: shared.deadline,
          milestones: shared.milestones,
          theme: { ...shared.theme, customBgImage: null },
          devicePresetId: shared.devicePresetId,
          previewMode: shared.previewMode,
        });
      },

      resetDemo: () => {
        set({
          deadline: DEMO_DEADLINE,
          milestones: DEMO_MILESTONES,
          theme: DEFAULT_THEME,
          activeStep: "deadline",
          devicePresetId: "iphone-16-pro",
          previewMode: "mockup",
          showSafeZones: false,
          reminderConfig: DEFAULT_REMINDERS,
        });
      },
    }),
    {
      name: "t-minus-studio-v1",
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          try {
            return localStorage.getItem(name);
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, value);
          } catch {
            // Ignore storage quota or restricted-mode errors cleanly
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch {
            // Ignore restricted-mode errors
          }
        },
      })),
      partialize: (state) => ({
        deadline: state.deadline,
        milestones: state.milestones,
        theme: {
          ...state.theme,
          // Keep large uploaded DataURLs in memory only so localStorage never overflows
          customBgImage: null,
        },
        devicePresetId: state.devicePresetId,
        previewMode: state.previewMode,
        reminderConfig: state.reminderConfig,
      }),
    }
  )
);
