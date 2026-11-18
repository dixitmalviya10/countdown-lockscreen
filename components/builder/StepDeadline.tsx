"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Calendar,
  Clock,
  GraduationCap,
  HelpCircle,
  Layers,
  PartyPopper,
  Plane,
  Rocket,
  Sparkles,
  Wand2,
} from "lucide-react";
import type { DeadlineCategory } from "@/types";
import { buildDefaultHeadline } from "@/lib/planner";
import {
  useCountdownStore,
  type QuickTemplateKey,
} from "@/store/useCountdownStore";
import { Button, Input, Label, StudioCard, Textarea } from "@/components/ui/Primitives";
import { useToast } from "@/components/ui/ToastProvider";

const CATEGORIES: Array<{
  id: DeadlineCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: "Launch", label: "Launch", icon: Rocket },
  { id: "Event/Party", label: "Event / Party", icon: PartyPopper },
  { id: "Exam", label: "Exam", icon: GraduationCap },
  { id: "Client deliverable", label: "Client Work", icon: Briefcase },
  { id: "Travel", label: "Travel", icon: Plane },
  { id: "Custom", label: "Custom", icon: Layers },
];

const QUICK_TEMPLATES: Array<{ key: QuickTemplateKey; label: string }> = [
  { key: "handshake-challenge", label: "Handshake Challenge" },
  { key: "friendsgiving", label: "Friendsgiving" },
  { key: "final-exam", label: "Final Exam" },
  { key: "product-launch", label: "Product Launch" },
  { key: "tokyo-trip", label: "Tokyo Trip" },
];

const COMMON_TIMEZONES = [
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "Europe/London",
  "Europe/Paris",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Australia/Sydney",
  "UTC",
];

export function StepDeadline() {
  const {
    deadline,
    setDeadline,
    setQuestionnaire,
    setMilestones,
    applyQuickTemplate,
    setActiveStep,
  } = useCountdownStore();
  const { toast } = useToast();
  const [planning, setPlanning] = useState(false);

  const datePart = deadline.targetDateISO.slice(0, 10) || "2026-11-23";
  const timePart = deadline.targetDateISO.slice(11, 16) || "23:59";

  const browserTz =
    typeof Intl !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : "America/Los_Angeles";

  const timezoneOptions = Array.from(
    new Set([deadline.timezone, browserTz, ...COMMON_TIMEZONES].filter(Boolean))
  );

  const handleDateOrTimeChange = (newDate: string, newTime: string) => {
    setDeadline({
      targetDateISO: `${newDate}T${newTime}:00`,
    });
  };

  const handleTitleChange = (title: string) => {
    const wasAuto =
      deadline.headline ===
        buildDefaultHeadline(deadline.title, deadline.category) ||
      !deadline.headline.trim();
    setDeadline({
      title,
      headline: wasAuto
        ? buildDefaultHeadline(title, deadline.category)
        : deadline.headline,
    });
  };

  const handleGeneratePlan = async () => {
    if (!deadline.title.trim()) {
      toast({
        title: "Add a deadline title first",
        variant: "error",
      });
      return;
    }

    setPlanning(true);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: deadline.title,
          targetDateISO: deadline.targetDateISO,
          timezone: deadline.timezone,
          category: deadline.category,
          questionnaire: deadline.questionnaire,
        }),
      });
      const data = await res.json();
      if (!res.ok || !Array.isArray(data.milestones)) {
        throw new Error(data.error || "Failed to generate milestones");
      }

      setMilestones(data.milestones);
      if (data.headline && !deadline.headline) {
        setDeadline({ headline: data.headline });
      }
      toast({
        title:
          data.source === "gemini"
            ? "AI T-Minus plan generated!"
            : "T-Minus milestones generated!",
        description: `${data.milestones.length} backward milestones mapped to your deadline.`,
        variant: "success",
      });
      setActiveStep("milestones");
    } catch {
      toast({
        title: "Could not reach planner API",
        description: "Try again or edit milestones manually.",
        variant: "error",
      });
    } finally {
      setPlanning(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 10-second Quick Swap Bar */}
      <StudioCard>
        <div className="flex items-center justify-between gap-2 pb-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
            <Sparkles className="h-3.5 w-3.5" />
            Quick-Swap Demo Deadlines
          </span>
          <span className="text-[11px] text-zinc-500">1-click preset</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_TEMPLATES.map((tpl) => (
            <button
              key={tpl.key}
              type="button"
              onClick={() => {
                applyQuickTemplate(tpl.key);
                toast({
                  title: `Loaded "${tpl.label}"`,
                  description: "Deadline, milestones, and theme updated.",
                  variant: "info",
                });
              }}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-200"
            >
              {tpl.label}
            </button>
          ))}
        </div>
      </StudioCard>

      {/* Core Deadline Details */}
      <StudioCard className="space-y-4">
        <div>
          <Label htmlFor="deadline-title">Deadline Title</Label>
          <Input
            id="deadline-title"
            value={deadline.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. Submit Handshake Challenge"
            className="mt-1.5"
            maxLength={60}
          />
        </div>

        <div>
          <Label htmlFor="deadline-headline">
            Lock Screen One-Line Headline
          </Label>
          <Input
            id="deadline-headline"
            value={deadline.headline}
            onChange={(e) => setDeadline({ headline: e.target.value })}
            placeholder="e.g. Friendsgiving is coming up!"
            className="mt-1.5"
            maxLength={70}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="deadline-date">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Target Date
              </span>
            </Label>
            <Input
              id="deadline-date"
              type="date"
              value={datePart}
              onChange={(e) => handleDateOrTimeChange(e.target.value, timePart)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="deadline-time">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" /> Target Time
              </span>
            </Label>
            <Input
              id="deadline-time"
              type="time"
              value={timePart}
              onChange={(e) => handleDateOrTimeChange(datePart, e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="deadline-tz">Timezone</Label>
            <button
              type="button"
              onClick={() => setDeadline({ timezone: browserTz })}
              className="text-[11px] font-medium text-amber-400 hover:text-amber-300"
            >
              Use browser ({browserTz})
            </button>
          </div>
          <select
            id="deadline-tz"
            value={deadline.timezone}
            onChange={(e) => setDeadline({ timezone: e.target.value })}
            className="mt-1.5 h-10 w-full rounded-xl border border-white/10 bg-black/45 px-3 text-sm text-zinc-100 focus:border-amber-400/60 focus:outline-none"
          >
            {timezoneOptions.map((tz) => (
              <option key={tz} value={tz} className="bg-zinc-900 text-zinc-100">
                {tz}
              </option>
            ))}
          </select>
        </div>

        {/* Category Grid */}
        <div>
          <Label>Category</Label>
          <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const selected = deadline.category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setDeadline({ category: cat.id })}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-medium transition ${
                    selected
                      ? "border-amber-400/60 bg-amber-400/15 text-amber-200"
                      : "border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.08]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </StudioCard>

      {/* Plan with 3 quick questions */}
      <StudioCard className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-zinc-100">
              Plan with 3 quick questions
            </h3>
          </div>
          <span className="text-[11px] text-zinc-400">Feeds planner</span>
        </div>

        <div>
          <Label htmlFor="q-done">1. What does done look like?</Label>
          <Input
            id="q-done"
            value={deadline.questionnaire.doneLooksLike}
            onChange={(e) =>
              setQuestionnaire({ doneLooksLike: e.target.value })
            }
            placeholder="e.g. Shipped app + 4 exported lock screen PNGs"
            className="mt-1.5"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="q-hours">2. How many hours/day can you give?</Label>
            <Input
              id="q-hours"
              type="number"
              min={0.5}
              max={16}
              step={0.5}
              value={deadline.questionnaire.hoursPerDay}
              onChange={(e) =>
                setQuestionnaire({
                  hoursPerDay: Number.parseFloat(e.target.value) || 1,
                })
              }
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="q-fixed">3. Any fixed dates in between?</Label>
            <Input
              id="q-fixed"
              value={deadline.questionnaire.fixedDates}
              onChange={(e) => setQuestionnaire({ fixedDates: e.target.value })}
              placeholder="e.g. Nov 20 design freeze"
              className="mt-1.5"
            />
          </div>
        </div>

        <div className="pt-1">
          <Textarea
            aria-label="Summary preview"
            rows={1}
            readOnly
            value={`Plan target: ${deadline.title} • ${deadline.questionnaire.hoursPerDay}h/day • ${deadline.questionnaire.doneLooksLike || "Ready to ship"}`}
            className="hidden"
          />
          <Button
            type="button"
            variant="amber"
            size="lg"
            onClick={handleGeneratePlan}
            disabled={planning}
            className="w-full"
          >
            <Wand2 className="h-4 w-4" />
            {planning
              ? "Generating Backward Milestones..."
              : "Generate T-Minus Plan & Continue"}
          </Button>
        </div>
      </StudioCard>
    </div>
  );
}
