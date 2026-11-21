"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarPlus,
  Check,
  Copy,
  Download,
  Sparkles,
  Wand2,
} from "lucide-react";
import type { SharedCountdownState } from "@/types";
import {
  DEVICE_PRESETS,
  exportLockScreenPng,
  triggerDownload,
} from "@/lib/export";
import { downloadICSFile, generateICS } from "@/lib/ics";
import { formatOffsetLabel, getDaysRemaining } from "@/lib/planner";
import { slugify } from "@/lib/utils";
import { useCountdownStore } from "@/store/useCountdownStore";
import { HeaderNav } from "@/components/HeaderNav";
import { LockScreenCanvas } from "@/components/lockscreen/LockScreenCanvas";
import { MilestoneIcon } from "@/components/lockscreen/MilestoneIcon";
import { Button, StudioCard } from "@/components/ui/Primitives";
import { ToastProvider, useToast } from "@/components/ui/ToastProvider";

function ShareInner({ shared }: { shared: SharedCountdownState }) {
  const router = useRouter();
  const hydrateFromShareState = useCountdownStore(
    (s) => s.hydrateFromShareState
  );
  const exportRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const preset =
    DEVICE_PRESETS[shared.devicePresetId] ?? DEVICE_PRESETS["iphone-16-pro"];
  const isPortrait = preset.orientation === "portrait";
  const [previewScale, setPreviewScale] = useState(isPortrait ? 0.72 : 0.45);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const updateScale = () => {
      const availW = Math.max(220, el.clientWidth - 8);
      const availH = isPortrait ? 640 : 440;
      const nextScale = Math.min(
        availW / preset.logicalWidth,
        availH / preset.logicalHeight,
        1
      );
      setPreviewScale(Math.max(0.24, nextScale));
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    window.addEventListener("resize", updateScale);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [isPortrait, preset.logicalHeight, preset.logicalWidth]);
  const daysLeft = getDaysRemaining(
    shared.deadline.targetDateISO,
    shared.deadline.timezone
  );

  const handleDownloadPng = async () => {
    if (!exportRef.current) return;
    setDownloading(true);
    try {
      const res = await exportLockScreenPng(
        exportRef.current,
        preset,
        shared.deadline.title
      );
      triggerDownload(res.dataUrl, res.filename);
      toast({
        title: `Downloaded ${preset.width}×${preset.height} PNG`,
        variant: "success",
      });
    } catch {
      toast({ title: "Could not export PNG", variant: "error" });
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadIcs = () => {
    const ics = generateICS(shared.deadline, shared.milestones, {
      timeOfDay: "09:00",
      dailyRecurring: true,
      browserNotificationEnabled: false,
    });
    downloadICSFile(ics, `t-minus-${slugify(shared.deadline.title)}.ics`);
    toast({ title: "Calendar reminders downloaded (.ics)", variant: "success" });
  };

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Share link copied", variant: "success" });
  };

  const handleCustomize = () => {
    hydrateFromShareState(shared);
    router.push("/builder");
  };

  return (
    <div className="min-h-screen bg-studio-bg text-zinc-100">
      <HeaderNav />

      <main className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-12">
        {/* Left: Shared Countdown Summary & Actions */}
        <div className="space-y-5 lg:col-span-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300">
            <Sparkles className="h-3.5 w-3.5" />
            Shared T-Minus Countdown • {daysLeft} days left
          </div>

          <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            {shared.deadline.title}
          </h1>
          <p className="text-sm text-zinc-400">
            {shared.deadline.headline} • Target:{" "}
            <span className="font-mono text-zinc-200">
              {shared.deadline.targetDateISO.slice(0, 16).replace("T", " ")} (
              {shared.deadline.timezone})
            </span>
          </p>

          <StudioCard className="space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Backward Milestone Plan
            </p>
            {shared.milestones.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      m.checked ? "bg-emerald-400" : "bg-amber-400"
                    }`}
                  />
                  <span className="font-mono font-semibold text-amber-300">
                    {formatOffsetLabel(m.offsetDays)} ({m.formattedDate})
                  </span>
                  <span className="text-zinc-200">{m.action}</span>
                </div>
                <MilestoneIcon icon={m.icon} size={14} className="text-zinc-400" />
              </div>
            ))}
          </StudioCard>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <Button
              type="button"
              variant="amber"
              onClick={handleDownloadPng}
              disabled={downloading}
            >
              <Download className="h-4 w-4" />
              {downloading ? "Exporting..." : "Download Lock Screen PNG"}
            </Button>
            <Button type="button" variant="primary" onClick={handleCustomize}>
              <Wand2 className="h-4 w-4" />
              Remix in T-Minus Studio
            </Button>
            <Button type="button" variant="secondary" onClick={handleDownloadIcs}>
              <CalendarPlus className="h-4 w-4" />
              Download .ics Reminders
            </Button>
            <Button type="button" variant="secondary" onClick={handleCopyUrl}>
              {copied ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied Link" : "Copy Share Link"}
            </Button>
          </div>
        </div>

        {/* Right: Rendered Lock Screen */}
        <div
          ref={stageRef}
          className="flex w-full items-center justify-center overflow-hidden lg:col-span-6"
        >
          <div
            style={{
              width: preset.logicalWidth * previewScale,
              height: preset.logicalHeight * previewScale,
            }}
            className={`relative overflow-hidden shadow-2xl ring-1 ring-white/20 ${
              isPortrait ? "rounded-[36px]" : "rounded-2xl"
            }`}
          >
            <div
              style={{
                width: preset.logicalWidth,
                height: preset.logicalHeight,
                transform: `scale(${previewScale})`,
                transformOrigin: "top left",
              }}
              className="absolute left-0 top-0"
            >
              <LockScreenCanvas
                deadline={shared.deadline}
                milestones={shared.milestones}
                theme={shared.theme}
                preset={preset}
                mode={shared.previewMode}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Offscreen full-resolution export ref */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -left-[9999px] -top-[9999px]"
      >
        <LockScreenCanvas
          ref={exportRef}
          deadline={shared.deadline}
          milestones={shared.milestones}
          theme={shared.theme}
          preset={preset}
          mode={shared.previewMode}
          exportMode={true}
        />
      </div>
    </div>
  );
}

export function ShareClientView({ shared }: { shared: SharedCountdownState }) {
  return (
    <ToastProvider>
      <ShareInner shared={shared} />
    </ToastProvider>
  );
}
