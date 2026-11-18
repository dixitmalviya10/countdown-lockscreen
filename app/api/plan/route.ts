import { NextResponse } from "next/server";
import { z } from "zod";
import {
  buildDefaultHeadline,
  clampToFiveWords,
  computeDateForOffset,
  computeOffsetLadder,
  generateDeterministicMilestones,
  getDaysRemaining,
} from "@/lib/planner";
import { createId } from "@/lib/utils";
import type { Milestone } from "@/types";

const PlanRequestSchema = z.object({
  title: z.string().min(1).max(120),
  targetDateISO: z.string().min(4),
  timezone: z.string().min(1).default("America/Los_Angeles"),
  category: z.enum([
    "Exam",
    "Client deliverable",
    "Event/Party",
    "Launch",
    "Travel",
    "Custom",
  ]),
  questionnaire: z
    .object({
      doneLooksLike: z.string().default(""),
      hoursPerDay: z.number().min(0.5).max(24).default(2),
      fixedDates: z.string().default(""),
    })
    .optional(),
});

const GeminiOutputSchema = z.object({
  headline: z.string().min(1).max(80).optional(),
  milestones: z
    .array(
      z.object({
        offsetDays: z.number().int().min(0).max(365),
        action: z.string().min(1),
        icon: z.string().min(1).default("Sparkles"),
      })
    )
    .min(2)
    .max(7),
});

export async function POST(req: Request) {
  let validatedInput: z.infer<typeof PlanRequestSchema> | null = null;

  try {
    const body = await req.json();
    const parsed = PlanRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const input = parsed.data;
    validatedInput = input;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const milestones = generateDeterministicMilestones(input);
      return NextResponse.json({
        headline: buildDefaultHeadline(input.title, input.category),
        milestones,
        source: "fallback",
      });
    }

    const daysRemaining = getDaysRemaining(input.targetDateISO, input.timezone);
    const ladder = computeOffsetLadder(daysRemaining);

    const prompt = [
      `You are a precision backward-planning assistant for T-Minus Studio.`,
      `Create a backward milestone plan for deadline "${input.title}" (Category: ${input.category}, Target: ${input.targetDateISO} ${input.timezone}).`,
      `Questionnaire context:`,
      `- What done looks like: ${input.questionnaire?.doneLooksLike || "Not specified"}`,
      `- Hours per day available: ${input.questionnaire?.hoursPerDay ?? 2}`,
      `- Fixed dates in between: ${input.questionnaire?.fixedDates || "None"}`,
      `Use these exact offsetDays values in descending order: [${ladder.join(", ")}].`,
      `Strict rules:`,
      `1. Return valid JSON ONLY with keys "headline" (short 1-line lock screen header) and "milestones" (array of {offsetDays, action, icon}).`,
      `2. Every "action" MUST be 2 to 5 words MAXIMUM (never exceed 5 words).`,
      `3. "icon" must be a valid Lucide icon name from: Compass, Sparkles, Code2, Palette, ImageDown, BellRing, Rocket, BookOpen, Timer, ClipboardCheck, GraduationCap, Target, Briefcase, Utensils, Users, Wine, ChefHat, Plane, Luggage, Trophy, Flag.`,
    ].join("\n");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.4,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API HTTP ${response.status}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error("Empty Gemini response");
    }

    const candidateJson = JSON.parse(rawText);
    const validatedOutput = GeminiOutputSchema.parse(candidateJson);

    const milestones: Milestone[] = validatedOutput.milestones
      .slice(0, 7)
      .sort((a, b) => b.offsetDays - a.offsetDays)
      .map((item) => {
        const { computedDateISO, formattedDate } = computeDateForOffset(
          input.targetDateISO,
          input.timezone,
          item.offsetDays
        );
        return {
          id: createId("ms"),
          offsetDays: item.offsetDays,
          computedDateISO,
          formattedDate,
          action: clampToFiveWords(item.action),
          icon: item.icon,
          checked: false,
        };
      });

    return NextResponse.json({
      headline:
        validatedOutput.headline ??
        buildDefaultHeadline(input.title, input.category),
      milestones,
      source: "gemini",
    });
  } catch {
    if (validatedInput) {
      return NextResponse.json({
        headline: buildDefaultHeadline(
          validatedInput.title,
          validatedInput.category
        ),
        milestones: generateDeterministicMilestones(validatedInput),
        source: "fallback",
      });
    }

    return NextResponse.json(
      { error: "Unable to generate plan" },
      { status: 500 }
    );
  }
}
