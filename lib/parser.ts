import type { Milestone } from "@/types";
import { clampToFiveWords, computeDateForOffset } from "./planner";
import { createId } from "./utils";

const ICON_KEYWORDS: Array<{ keywords: string[]; icon: string }> = [
  { keywords: ["delegate", "guest", "invite", "team", "friend", "family", "rsvp"], icon: "Users" },
  { keywords: ["turkey", "cook", "bake", "dish", "food", "pie", "meal", "dinner", "grocer", "menu"], icon: "Utensils" },
  { keywords: ["wine", "drink", "bar", "toast", "cocktail"], icon: "Wine" },
  { keywords: ["clean", "table", "decor", "setup", "set the", "arrange"], icon: "Sparkles" },
  { keywords: ["study", "read", "note", "chapter", "book", "flashcard", "syllabus"], icon: "BookOpen" },
  { keywords: ["exam", "quiz", "mock", "practice", "test"], icon: "ClipboardCheck" },
  { keywords: ["code", "build", "app", "api", "ship", "deploy", "feature", "bug"], icon: "Code2" },
  { keywords: ["design", "polish", "ui", "theme", "color", "figma", "layout"], icon: "Palette" },
  { keywords: ["export", "png", "image", "wallpaper", "download"], icon: "ImageDown" },
  { keywords: ["remind", "calendar", "alarm", "notify", "schedule"], icon: "BellRing" },
  { keywords: ["submit", "launch", "publish", "release", "handshake", "send"], icon: "Rocket" },
  { keywords: ["flight", "fly", "airport", "ticket", "passport", "train"], icon: "Plane" },
  { keywords: ["pack", "luggage", "bag", "hotel", "stay"], icon: "Luggage" },
  { keywords: ["buy", "order", "shop", "store"], icon: "ShoppingBag" },
];

export function inferMilestoneIcon(actionText: string): string {
  const lower = actionText.toLowerCase();
  for (const entry of ICON_KEYWORDS) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.icon;
    }
  }
  return "Sparkles";
}

// Matches lines like:
// "T-7 Days (Nov 10): Delegate side dishes"
// "- [x] T-14 Days (Nov 3) - Order the turkey"
// "1. T-1 Day: Set the table"
// "T-0 (Nov 23): Host Friendsgiving!"
const MILESTONE_LINE_REGEX =
  /^\s*(?:[-*•]|\d+[.)])?\s*(?:\[(x|X| )\]\s*)?T\s*[-–—]\s*(\d+)\s*(?:days?|d)?\s*(?:\(([^)]+)\))?\s*[:\-–—]\s*(.+?)\s*$/i;

export interface ParsedLineResult {
  milestones: Milestone[];
  truncatedCount: number;
  skippedLines: number;
}

export function parseGeminiMilestonesWithReport(
  input: string,
  targetDateISO: string,
  timezone: string
): ParsedLineResult {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const milestones: Milestone[] = [];
  let truncatedCount = 0;
  let skippedLines = 0;

  for (const line of lines) {
    const match = line.match(MILESTONE_LINE_REGEX);
    if (!match) {
      skippedLines += 1;
      continue;
    }

    const [, checkboxFlag, offsetStr, explicitDateLabel, rawAction] = match;
    const offsetDays = Number.parseInt(offsetStr, 10);
    if (Number.isNaN(offsetDays) || offsetDays < 0 || offsetDays > 365) {
      skippedLines += 1;
      continue;
    }

    const cleanedAction = rawAction.replace(/\s+/g, " ").trim();
    const rawWords = cleanedAction.split(" ").filter(Boolean);
    if (rawWords.length > 5) {
      truncatedCount += 1;
    }
    const action = clampToFiveWords(cleanedAction);
    if (!action) {
      skippedLines += 1;
      continue;
    }

    const computed = computeDateForOffset(targetDateISO, timezone, offsetDays);
    const formattedDate = explicitDateLabel?.trim() || computed.formattedDate;

    milestones.push({
      id: createId("ms"),
      offsetDays,
      computedDateISO: computed.computedDateISO,
      formattedDate,
      action,
      icon: inferMilestoneIcon(action),
      checked: checkboxFlag?.toLowerCase() === "x",
    });
  }

  // Sort descending by offsetDays (T-14 down to T-0) and cap at 7 rows
  const sorted = milestones
    .sort((a, b) => b.offsetDays - a.offsetDays)
    .slice(0, 7);

  return {
    milestones: sorted,
    truncatedCount,
    skippedLines,
  };
}

export function parseGeminiMilestones(
  input: string,
  targetDateISO: string,
  timezone: string
): Milestone[] {
  return parseGeminiMilestonesWithReport(input, targetDateISO, timezone)
    .milestones;
}
