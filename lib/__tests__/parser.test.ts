import { describe, expect, it } from "vitest";
import {
  parseGeminiMilestones,
  parseGeminiMilestonesWithReport,
} from "@/lib/parser";

describe("Paste from Gemini parser", () => {
  it("parses standard T-minus lines with dates, actions, and icons", () => {
    const sample = `
      T-14 Days (Nov 3): Order the turkey
      T-7 Days (Nov 10): Delegate side dishes
      - [x] T-2 Days (Nov 15): Prep pie crusts
      1. T-1 Day (Nov 16) - Set the table
      T-0 Days (Nov 17): Host Friendsgiving dinner
    `;

    const parsed = parseGeminiMilestones(
      sample,
      "2026-11-17T18:00:00",
      "America/Los_Angeles"
    );

    expect(parsed).toHaveLength(5);
    expect(parsed[0]).toMatchObject({
      offsetDays: 14,
      formattedDate: "Nov 3",
      action: "Order the turkey",
      checked: false,
    });
    expect(parsed[1]).toMatchObject({
      offsetDays: 7,
      formattedDate: "Nov 10",
      action: "Delegate side dishes",
      icon: "Users",
    });
    expect(parsed[2]).toMatchObject({
      offsetDays: 2,
      checked: true,
      icon: "Utensils",
    });
    expect(parsed[3]).toMatchObject({
      offsetDays: 1,
      action: "Set the table",
    });
    expect(parsed[4]).toMatchObject({
      offsetDays: 0,
      action: "Host Friendsgiving dinner",
    });
  });

  it("clamps overly long phrases to 5 words and reports truncations", () => {
    const report = parseGeminiMilestonesWithReport(
      "T-5 Days (Nov 18): Build the entire responsive web application today\nUnrecognized line",
      "2026-11-23T23:59:00",
      "America/Los_Angeles"
    );

    expect(report.milestones).toHaveLength(1);
    expect(report.milestones[0].action).toBe("Build the entire responsive web");
    expect(report.truncatedCount).toBe(1);
    expect(report.skippedLines).toBe(1);
  });
});
