"use client";

import React, { useMemo, useState } from "react";
import {
  BellRing,
  CalendarPlus,
  Check,
  Copy,
  Download,
  ExternalLink,
  ImageDown,
  Link2,
  Share2,
  Users,
} from "lucide-react";
import {
  DEVICE_PRESETS,
  exportLockScreenPng,
  triggerDownload,
} from "@/lib/export";
import {
  buildGoogleCalendarUrl,
  downloadICSFile,
  generateICS,
} from "@/lib/ics";
import { formatOffsetLabel } from "@/lib/planner";
import { encodeShareState } from "@/lib/share";
import { slugify } from "@/lib/utils";
import { useCountdownStore } from "@/store/useCountdownStore";
import { Button, Input, Label, StudioCard } from "@/components/ui/Primitives";
import { useToast } from "@/components/ui/ToastProvider";

export function StepExport({
  exportRef,
}: {
  exportRef: React.RefObject<HTMLDivElement>;
}) {
  const {
    deadline,
    milestones,
    theme,
    devicePresetId,
    previewMode,
    reminderConfig,
    setReminderConfig,
  } = useCountdownStore();
  const { toast } = useToast();

  const [exporting, setExporting] = useState(false);
  const [copiedImg, setCopiedImg] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [latestExport, setLatestExport] = useState<{
    dataUrl: string;
    width: number;
    height: number;
    presetName: string;
  } | null>(null);

  const preset =
    DEVICE_PRESETS[devicePresetId] ?? DEVICE_PRESETS["iphone-16-pro"];

  const shareUrl = useMemo(() => {
    const hash = encodeShareState({
      deadline,
      milestones,
      theme,
      devicePresetId,
      previewMode,
    });
    if (typeof window === "undefined") return `/s/${hash}`;
    return `${window.location.origin}/s/${hash}`;
  }, [deadline, milestones, theme, devicePresetId, previewMode]);

  const handleDownloadPng = async () => {
    if (!exportRef.current) return;
    setExporting(true);
    try {
      const res = await exportLockScreenPng(
        exportRef.current,
        preset,
        deadline.title
      );
      triggerDownload(res.dataUrl, res.filename);
      setLatestExport({
        dataUrl: res.dataUrl,
        width: res.width,
        height: res.height,
        presetName: preset.name,
      });
      fetch("/api/save-export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          presetId: preset.id,
          dataUrl: res.dataUrl,
          width: res.width,
          height: res.height,
        }),
      }).catch(() => {});
      toast({
        title: `Exported ${preset.name}`,
        description: `${res.width}×${res.height}px PNG downloaded.`,
        variant: "success",
      });
    } catch {
      toast({
        title: "Export failed",
        description: "Please try again after fonts finish loading.",
        variant: "error",
      });
    } finally {
      setExporting(false);
    }
  };

  const handleCopyPng = async () => {
    if (!exportRef.current) return;
    setExporting(true);
    try {
      const res = await exportLockScreenPng(
        exportRef.current,
        preset,
        deadline.title
      );
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        typeof ClipboardItem !== "undefined"
      ) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": res.blob }),
        ]);
        setCopiedImg(true);
        setTimeout(() => setCopiedImg(false), 2000);
        toast({
          title: "Lock screen PNG copied to clipboard",
          variant: "success",
        });
      } else {
        triggerDownload(res.dataUrl, res.filename);
        toast({
          title: "Clipboard image unavailable — downloaded PNG instead",
          variant: "info",
        });
      }
    } catch {
      toast({
        title: "Could not copy image to clipboard",
        variant: "error",
      });
    } finally {
      setExporting(false);
    }
  };

  const handleWebShareImage = async () => {
    if (!exportRef.current) return;
    setExporting(true);
    try {
      const res = await exportLockScreenPng(
        exportRef.current,
        preset,
        deadline.title
      );
      const file = new File([res.blob], res.filename, { type: "image/png" });

      if (
        typeof navigator !== "undefined" &&
        navigator.share &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({
          title: `${deadline.title} — T-Minus Lock Screen`,
          text: deadline.headline,
          files: [file],
        });
        toast({ title: "Shared lock screen image!", variant: "success" });
      } else {
        triggerDownload(res.dataUrl, res.filename);
        toast({
          title: "Native file share unavailable here — downloaded PNG instead",
          variant: "info",
        });
      }
    } catch {
      // User may cancel share sheet cleanly
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadICS = () => {
    const ics = generateICS(deadline, milestones, reminderConfig);
    downloadICSFile(ics, `t-minus-${slugify(deadline.title)}.ics`);
    toast({
      title: "Calendar reminders downloaded (.ics)",
      description: `${milestones.length} milestone events${
        reminderConfig.dailyRecurring ? " + daily check-in" : ""
      } ready to import.`,
      variant: "success",
    });
  };

  const handleBrowserNotifications = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast({
        title: "Browser notifications are not supported in this browser",
        variant: "error",
      });
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      setReminderConfig({ browserNotificationEnabled: true });
      new Notification(`T-Minus Studio: ${deadline.title}`, {
        body: `Daily check-in enabled at ${reminderConfig.timeOfDay}. Remember: download .ics for reliable background reminders.`,
      });
      toast({
        title: "In-browser check-in enabled",
        variant: "success",
      });
    } else {
      toast({
        title: "Notification permission denied",
        description: "Use .ics or Google Calendar below for guaranteed alerts.",
        variant: "info",
      });
    }
  };

  const handleCopyShareLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    toast({
      title: "Share link copied!",
      description: "Anyone opening the URL sees your read-only countdown.",
      variant: "success",
    });
  };

  const handleShareWithTeam = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${deadline.title} — T-Minus Plan`,
          text: `${deadline.headline} Check our T-Minus milestones:`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to copy
      }
    }
    await handleCopyShareLink();
  };

  return (
    <div className="space-y-4">
      {/* Export Lock Screen PNG */}
      <StudioCard className="space-y-3 border-amber-400/25">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
              <ImageDown className="h-4 w-4 text-amber-400" />
              Export Lock Screen PNG
            </h3>
            <p className="mt-0.5 text-xs text-zinc-400">
              Active preset:{" "}
              <span className="font-semibold text-zinc-200">{preset.name}</span>{" "}
              ({preset.width}×{preset.height}px • {previewMode})
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Button
            type="button"
            variant="amber"
            onClick={handleDownloadPng}
            disabled={exporting}
            className="sm:col-span-3"
          >
            <Download className="h-4 w-4" />
            {exporting
              ? "Rendering High-Res PNG..."
              : `Download PNG (${preset.width}×${preset.height})`}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCopyPng}
            disabled={exporting}
            className="sm:col-span-1"
          >
            {copiedImg ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            Copy Image
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleWebShareImage}
            disabled={exporting}
            className="sm:col-span-2"
          >
            <Share2 className="h-4 w-4" />
            Share Image (Mobile / OS Share Sheet)
          </Button>
        </div>

        {latestExport && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={latestExport.dataUrl}
              alt={`Latest exported ${latestExport.presetName}`}
              className="h-16 w-12 rounded-lg border border-white/15 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-emerald-200">
                Latest Exported PNG Ready
              </p>
              <p className="font-mono text-[11px] text-zinc-300">
                {latestExport.presetName} • {latestExport.width}×
                {latestExport.height}px
              </p>
            </div>
          </div>
        )}
      </StudioCard>

      {/* Calendar & Daily Reminders */}
      <StudioCard className="space-y-3.5">
        <div className="flex items-center gap-2">
          <CalendarPlus className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-zinc-100">
            Milestone & Daily Reminders
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="reminder-time">Reminder Time of Day</Label>
            <Input
              id="reminder-time"
              type="time"
              value={reminderConfig.timeOfDay}
              onChange={(e) =>
                setReminderConfig({ timeOfDay: e.target.value || "09:00" })
              }
              className="mt-1.5"
            />
          </div>
          <div className="flex flex-col justify-end">
            <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-xs text-zinc-200">
              <input
                type="checkbox"
                checked={reminderConfig.dailyRecurring}
                onChange={(e) =>
                  setReminderConfig({ dailyRecurring: e.target.checked })
                }
                className="h-4 w-4 rounded accent-amber-400"
              />
              Include daily check-in RRULE until deadline
            </label>
          </div>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={handleDownloadICS}
          className="w-full"
        >
          <Download className="h-4 w-4" />
          Download .ics Calendar Bundle (Apple / Outlook / Google)
        </Button>

        {/* Per-Milestone Google Calendar Deep Links */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
            Add Individual Milestones to Google Calendar
          </p>
          <div className="max-h-40 space-y-1.5 overflow-y-auto pr-1">
            {milestones.map((m) => (
              <a
                key={m.id}
                href={buildGoogleCalendarUrl(
                  m,
                  deadline,
                  reminderConfig.timeOfDay
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-xs transition hover:border-cyan-400/40 hover:bg-cyan-400/10"
              >
                <span className="truncate text-zinc-200">
                  <strong className="text-amber-300">
                    {formatOffsetLabel(m.offsetDays)} ({m.formattedDate}):
                  </strong>{" "}
                  {m.action}
                </span>
                <ExternalLink className="ml-2 h-3.5 w-3.5 shrink-0 text-zinc-400" />
              </a>
            ))}
          </div>
        </div>

        {/* Optional Browser Notification with Honest Delivery Note */}
        <div className="rounded-xl border border-white/10 bg-black/35 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <BellRing className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-semibold text-zinc-200">
                Optional Browser Check-in Alert
              </span>
            </div>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={handleBrowserNotifications}
            >
              {reminderConfig.browserNotificationEnabled
                ? "Test Alert"
                : "Enable Browser Alert"}
            </Button>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-400">
            Honest note: browsers pause background timers when tabs or laptops
            sleep, so background delivery isn&apos;t guaranteed. Calendar
            reminders (<code className="text-zinc-300">.ics</code> / Google
            Calendar) are the reliable option.
          </p>
        </div>
      </StudioCard>

      {/* Share Countdown URL */}
      <StudioCard className="space-y-3">
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-zinc-100">
            Share Read-Only Countdown Link
          </h3>
        </div>
        <p className="text-xs text-zinc-400">
          Your deadline, milestones, and theme are encoded right into a
          compact URL with a rich social preview card.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCopyShareLink}
            className="flex-1"
          >
            {copiedLink ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copiedLink ? "Link Copied" : "Copy Share Link"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleShareWithTeam}
            className="flex-1"
          >
            <Users className="h-4 w-4" />
            Share with my team
          </Button>
        </div>
      </StudioCard>
    </div>
  );
}
