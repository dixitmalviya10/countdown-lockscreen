"use client";

import React, { useRef, useState } from "react";
import {
  CalendarClock,
  CheckSquare,
  Download,
  Eye,
  Palette,
  Sliders,
} from "lucide-react";
import type { BuilderStep } from "@/types";
import { useCountdownStore } from "@/store/useCountdownStore";
import { HeaderNav } from "@/components/HeaderNav";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { StepDeadline } from "@/components/builder/StepDeadline";
import { StepMilestones } from "@/components/builder/StepMilestones";
import { StepStyle } from "@/components/builder/StepStyle";
import { StepExport } from "@/components/builder/StepExport";
import { PreviewStage } from "@/components/lockscreen/PreviewStage";

const STEPS: Array<{
  id: BuilderStep;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: "deadline", label: "1. Deadline", shortLabel: "Deadline", icon: CalendarClock },
  { id: "milestones", label: "2. Milestones", shortLabel: "Plan", icon: CheckSquare },
  { id: "style", label: "3. Style", shortLabel: "Style", icon: Palette },
  { id: "export", label: "4. Export & Share", shortLabel: "Export", icon: Download },
];

export default function BuilderPage() {
  const { activeStep, setActiveStep } = useCountdownStore();
  const exportRef = useRef<HTMLDivElement>(null);
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-col bg-studio-bg text-zinc-100">
        <HeaderNav />
        <div className="mx-auto flex w-full max-w-[1440px] flex-1 items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3 text-zinc-400">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400/30 border-t-amber-400" />
            <p className="text-xs font-medium tracking-wide">
              Loading T-Minus Studio...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col bg-studio-bg text-zinc-100">
        <HeaderNav />

        {/* Desktop Split Workspace (Wizard Left, Live Preview Right) */}
        <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col lg:grid lg:grid-cols-12">
          {/* Left Wizard Column */}
          <section
            aria-label="Countdown builder steps"
            className={`flex flex-col border-white/[0.08] lg:col-span-5 lg:border-r xl:col-span-5 ${
              mobileView === "preview" ? "hidden lg:flex" : "flex"
            }`}
          >
            {/* Stepper Tabs */}
            <div className="sticky top-14 z-20 border-b border-white/[0.08] bg-studio-bg/95 px-4 py-3 backdrop-blur-md">
              <div
                className="grid grid-cols-4 gap-1.5"
                role="tablist"
                aria-label="Builder steps"
              >
                {STEPS.map((step) => {
                  const active = activeStep === step.id;
                  const Icon = step.icon;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveStep(step.id)}
                      className={`flex flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 text-center transition sm:flex-row sm:gap-1.5 ${
                        active
                          ? "border-amber-400/50 bg-amber-400/15 text-amber-200"
                          : "border-white/[0.07] bg-white/[0.03] text-zinc-400 hover:bg-white/[0.07] hover:text-zinc-200"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate text-[11px] font-semibold">
                        <span className="hidden sm:inline">{step.label}</span>
                        <span className="sm:hidden">{step.shortLabel}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Step Form Content */}
            <div className="flex-1 overflow-y-auto p-4 pb-24 lg:pb-8">
              {activeStep === "deadline" && <StepDeadline />}
              {activeStep === "milestones" && <StepMilestones />}
              {activeStep === "style" && <StepStyle />}
              {activeStep === "export" && <StepExport exportRef={exportRef} />}
            </div>
          </section>

          {/* Right Live Preview Column */}
          <section
            aria-label="Live lock screen preview"
            className={`flex-1 flex-col lg:sticky lg:top-14 lg:col-span-7 lg:flex lg:h-[calc(100vh-3.5rem)] xl:col-span-7 ${
              mobileView === "editor" ? "hidden lg:flex" : "flex pb-20 lg:pb-0"
            }`}
          >
            <PreviewStage exportRef={exportRef} />
          </section>
        </div>

        {/* Mobile Bottom-Sheet Switcher Bar (< 1024px) */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#0D0F17]/95 px-4 py-2.5 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-md items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileView("editor")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition ${
                mobileView === "editor"
                  ? "bg-amber-400 text-zinc-950"
                  : "bg-white/[0.06] text-zinc-300"
              }`}
            >
              <Sliders className="h-4 w-4" />
              Edit Steps
            </button>
            <button
              type="button"
              onClick={() => setMobileView("preview")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition ${
                mobileView === "preview"
                  ? "bg-amber-400 text-zinc-950"
                  : "bg-white/[0.06] text-zinc-300"
              }`}
            >
              <Eye className="h-4 w-4" />
              Live Lock Screen
            </button>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
