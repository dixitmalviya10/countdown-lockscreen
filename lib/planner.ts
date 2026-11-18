import { addDays, differenceInCalendarDays, format, parseISO, subDays } from "date-fns";
import { fromZonedTime, toZonedTime, formatInTimeZone } from "date-fns-tz";
import type {
  DeadlineCategory,
  Milestone,
  PlannerQuestionnaire,
} from "@/types";
import { createId } from "./utils";

export const STANDARD_OFFSET_LADDER = [14, 10, 7, 5, 3, 2, 1, 0] as const;

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function validateActionText(text: string): {
  valid: boolean;
  wordCount: number;
  error?: string;
} {
  const wordCount = countWords(text);
  if (wordCount === 0) {
    return { valid: false, wordCount: 0, error: "Action text is required" };
  }
  if (wordCount > 5) {
    return {
      valid: false,
      wordCount,
      error: `Keep under 5 words (${wordCount}/5)`,
    };
  }
  return { valid: true, wordCount };
}

export function clampToFiveWords(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 5).join(" ");
}

/**
 * Compute backward T-minus offsets from deadline.
 * - Uses [14, 10, 7, 5, 3, 2, 1, 0] filtered to daysRemaining
 * - If < 7 days left, uses every day down to 0
 * - Max 7 rows, always includes T-1 and T-0
 */
export function computeOffsetLadder(daysRemaining: number): number[] {
  const safeDays = Math.max(0, Math.floor(daysRemaining));

  if (safeDays === 0) {
    return [1, 0];
  }

  if (safeDays < 7) {
    const start = Math.min(safeDays, 6);
    const ladder: number[] = [];
    for (let d = start; d >= 0; d--) {
      ladder.push(d);
    }
    return ladder.slice(-7);
  }

  const filtered = STANDARD_OFFSET_LADDER.filter((offset) => offset <= safeDays);
  const ensureSet = new Set<number>(filtered);
  ensureSet.add(1);
  ensureSet.add(0);

  const sorted = Array.from(ensureSet).sort((a, b) => b - a);
  if (sorted.length <= 7) {
    return sorted;
  }

  // Keep highest anchor + lowest 6 ending in 1, 0 (max 7 rows)
  return sorted.slice(sorted.length - 7);
}

/**
 * Safely compute days remaining between reference "now" and targetDateISO in timezone.
 */
export function getDaysRemaining(
  targetDateISO: string,
  timezone: string,
  nowDate: Date = new Date()
): number {
  try {
    const targetUtc = fromZonedTime(targetDateISO, timezone);
    const zonedTarget = toZonedTime(targetUtc, timezone);
    const zonedNow = toZonedTime(nowDate, timezone);
    return Math.max(0, differenceInCalendarDays(zonedTarget, zonedNow));
  } catch {
    const fallbackTarget = parseISO(targetDateISO);
    return Math.max(0, differenceInCalendarDays(fallbackTarget, nowDate));
  }
}

export function computeDateForOffset(
  targetDateISO: string,
  timezone: string,
  offsetDays: number
): { computedDateISO: string; formattedDate: string } {
  try {
    const targetUtc = fromZonedTime(targetDateISO, timezone);
    const zonedTarget = toZonedTime(targetUtc, timezone);
    const milestoneZoned = subDays(zonedTarget, offsetDays);
    const utcMilestone = fromZonedTime(milestoneZoned, timezone);
    return {
      computedDateISO: formatInTimeZone(utcMilestone, timezone, "yyyy-MM-dd"),
      formattedDate: formatInTimeZone(utcMilestone, timezone, "MMM d"),
    };
  } catch {
    const base = parseISO(targetDateISO);
    const target = Number.isNaN(base.getTime()) ? new Date() : base;
    const d = subDays(target, offsetDays);
    return {
      computedDateISO: format(d, "yyyy-MM-dd"),
      formattedDate: format(d, "MMM d"),
    };
  }
}

export function getTodayISOInTimezone(
  timezone: string,
  nowDate: Date = new Date()
): string {
  try {
    return formatInTimeZone(nowDate, timezone, "yyyy-MM-dd");
  } catch {
    return format(nowDate, "yyyy-MM-dd");
  }
}

interface PhraseSpec {
  action: string;
  icon: string;
}

const CATEGORY_PHRASES: Record<DeadlineCategory, PhraseSpec[]> = {
  Exam: [
    { action: "Map syllabus and weak topics", icon: "Map" },
    { action: "Summarize core lecture notes", icon: "BookOpen" },
    { action: "Drill timed practice problems", icon: "Timer" },
    { action: "Take full mock exam", icon: "ClipboardCheck" },
    { action: "Review missed questions deeply", icon: "SearchCheck" },
    { action: "Light review and early sleep", icon: "Moon" },
    { action: "Ace the final exam", icon: "GraduationCap" },
  ],
  "Client deliverable": [
    { action: "Align scope and success criteria", icon: "Target" },
    { action: "Deliver rough architecture draft", icon: "Layers" },
    { action: "Build core deliverable sections", icon: "Briefcase" },
    { action: "Run internal quality review", icon: "CheckCircle2" },
    { action: "Incorporate final client polish", icon: "Sparkles" },
    { action: "Package files and presentation", icon: "PackageCheck" },
    { action: "Send final client handoff", icon: "Send" },
  ],
  "Event/Party": [
    { action: "Finalize menu and guest count", icon: "ClipboardList" },
    { action: "Order centerpiece and supplies", icon: "ShoppingBag" },
    { action: "Delegate side dishes & drinks", icon: "Users" },
    { action: "Shop fresh groceries & florals", icon: "Utensils" },
    { action: "Prep make-ahead dishes", icon: "ChefHat" },
    { action: "Set table and chill drinks", icon: "Wine" },
    { action: "Host and celebrate together", icon: "PartyPopper" },
  ],
  Launch: [
    { action: "Lock launch scope and goals", icon: "Compass" },
    { action: "Plan assets and copy", icon: "Sparkles" },
    { action: "Build core experience", icon: "Code2" },
    { action: "Polish visuals and edge cases", icon: "Palette" },
    { action: "Run QA and smoke tests", icon: "ShieldCheck" },
    { action: "Stage release and reminders", icon: "BellRing" },
    { action: "Ship live to the world", icon: "Rocket" },
  ],
  Travel: [
    { action: "Confirm flights and stays", icon: "Plane" },
    { action: "Reserve top dining & passes", icon: "Ticket" },
    { action: "Check passport and adapters", icon: "Shield" },
    { action: "Download offline maps & docs", icon: "MapPin" },
    { action: "Lay out outfits and gear", icon: "Luggage" },
    { action: "Pack carry-on & check in", icon: "CheckSquare" },
    { action: "Depart for the adventure", icon: "Compass" },
  ],
  Custom: [
    { action: "Define clear finish line", icon: "Flag" },
    { action: "Gather tools and references", icon: "FolderOpen" },
    { action: "Complete heavy lift sprint", icon: "Zap" },
    { action: "Review progress and tighten", icon: "SlidersHorizontal" },
    { action: "Polish final key details", icon: "Sparkles" },
    { action: "Final check and prep", icon: "CheckCheck" },
    { action: "Cross the finish line", icon: "Trophy" },
  ],
};

export interface GeneratePlanInput {
  title: string;
  targetDateISO: string;
  timezone: string;
  category: DeadlineCategory;
  questionnaire?: PlannerQuestionnaire;
  nowDate?: Date;
}

export function buildDefaultHeadline(
  title: string,
  category: DeadlineCategory
): string {
  const cleanTitle = title.trim() || "Your big deadline";
  if (category === "Event/Party") {
    return `${cleanTitle} is coming up!`;
  }
  if (category === "Travel") {
    return `${cleanTitle} takes off soon!`;
  }
  if (category === "Exam") {
    return `Countdown to ${cleanTitle}`;
  }
  return `${cleanTitle} is coming up!`;
}

export function generateDeterministicMilestones(
  input: GeneratePlanInput
): Milestone[] {
  const daysRemaining = getDaysRemaining(
    input.targetDateISO,
    input.timezone,
    input.nowDate
  );
  const offsets = computeOffsetLadder(daysRemaining);
  const specs = CATEGORY_PHRASES[input.category] ?? CATEGORY_PHRASES.Custom;

  // Map offsets onto specs preserving the final T-0 celebration and T-1 prep
  const total = offsets.length;
  const doneHint = input.questionnaire?.doneLooksLike?.trim();
  const hoursPerDay = input.questionnaire?.hoursPerDay ?? 2;

  return offsets.map((offsetDays, index) => {
    let spec: PhraseSpec;
    if (index === total - 1) {
      spec = specs[specs.length - 1];
    } else if (index === total - 2 && specs.length >= 2) {
      spec = specs[specs.length - 2];
    } else {
      const mappedIdx = Math.min(
        specs.length - 3,
        Math.floor((index / Math.max(1, total - 2)) * (specs.length - 2))
      );
      spec = specs[Math.max(0, mappedIdx)];
    }

    let action = spec.action;
    // Subtly tailor the first or final milestone using questionnaire context while staying <= 5 words
    if (index === 0 && hoursPerDay >= 4 && offsetDays >= 5) {
      action = clampToFiveWords(
        input.category === "Exam"
          ? "Start daily deep study blocks"
          : "Kick off focused daily sprint"
      );
    } else if (
      index === total - 1 &&
      doneHint &&
      countWords(doneHint) <= 4 &&
      input.category === "Custom"
    ) {
      action = clampToFiveWords(`Complete ${doneHint}`);
    }

    const { computedDateISO, formattedDate } = computeDateForOffset(
      input.targetDateISO,
      input.timezone,
      offsetDays
    );

    return {
      id: createId("ms"),
      offsetDays,
      computedDateISO,
      formattedDate,
      action: clampToFiveWords(action),
      icon: spec.icon,
      checked: false,
    };
  });
}

export function recalculateMilestoneDates(
  milestones: Milestone[],
  targetDateISO: string,
  timezone: string
): Milestone[] {
  return milestones.map((m) => {
    const { computedDateISO, formattedDate } = computeDateForOffset(
      targetDateISO,
      timezone,
      m.offsetDays
    );
    return {
      ...m,
      computedDateISO,
      formattedDate,
    };
  });
}

export function formatOffsetLabel(offsetDays: number): string {
  if (offsetDays === 1) return "T-1 Day";
  return `T-${offsetDays} Days`;
}

export function getSuggestedFutureDateISO(daysAhead = 7): string {
  const future = addDays(new Date(), daysAhead);
  return `${format(future, "yyyy-MM-dd")}T23:59:00`;
}
