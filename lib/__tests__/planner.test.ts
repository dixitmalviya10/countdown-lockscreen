import { describe, expect, it } from "vitest";
import {
  clampToFiveWords,
  computeOffsetLadder,
  countWords,
  generateDeterministicMilestones,
  validateActionText,
} from "@/lib/planner";

describe("planner utilities", () => {
  it("counts words and validates <= 5 word action limit", () => {
    expect(countWords("Delegate side dishes")).toBe(3);
    expect(countWords("   ")).toBe(0);

    expect(validateActionText("Plan in Gemini").valid).toBe(true);
    expect(validateActionText("One two three four five").valid).toBe(true);
    expect(validateActionText("One two three four five six").valid).toBe(false);
    expect(validateActionText("").valid).toBe(false);

    expect(clampToFiveWords("One two three four five six seven")).toBe(
      "One two three four five"
    );
  });

  it("computes standard offset ladder [14,10,7,5,3,2,1,0] capped at 7 rows with T-1 & T-0", () => {
    const ladder14 = computeOffsetLadder(14);
    expect(ladder14.length).toBeLessThanOrEqual(7);
    expect(ladder14).toContain(1);
    expect(ladder14).toContain(0);
    expect(ladder14[ladder14.length - 1]).toBe(0);
    expect(ladder14[ladder14.length - 2]).toBe(1);

    const ladder7 = computeOffsetLadder(7);
    expect(ladder7).toEqual([7, 5, 3, 2, 1, 0]);
  });

  it("uses every day when under 7 days remain, always including T-1 and T-0", () => {
    expect(computeOffsetLadder(4)).toEqual([4, 3, 2, 1, 0]);
    expect(computeOffsetLadder(1)).toEqual([1, 0]);
    expect(computeOffsetLadder(0)).toEqual([1, 0]);
  });

  it("generates category-aware backward milestones with <= 5 words each", () => {
    const milestones = generateDeterministicMilestones({
      title: "Friendsgiving",
      targetDateISO: "2026-11-26T18:00:00",
      timezone: "America/Los_Angeles",
      category: "Event/Party",
      nowDate: new Date("2026-11-12T12:00:00Z"),
    });

    expect(milestones.length).toBeGreaterThanOrEqual(2);
    expect(milestones.length).toBeLessThanOrEqual(7);
    expect(milestones.some((m) => m.offsetDays === 1)).toBe(true);
    expect(milestones.some((m) => m.offsetDays === 0)).toBe(true);

    for (const m of milestones) {
      expect(countWords(m.action)).toBeLessThanOrEqual(5);
      expect(m.formattedDate).toMatch(/^[A-Z][a-z]{2}\s+\d{1,2}$/);
    }
  });
});
