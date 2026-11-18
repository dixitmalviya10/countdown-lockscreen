"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Battery,
  Check,
  Flashlight,
  Camera,
  Lock,
  PartyPopper,
  Signal,
  Sun,
  Wifi,
} from "lucide-react";
import type {
  Deadline,
  DevicePreset,
  Milestone,
  PreviewMode,
  ThemeConfig,
} from "@/types";
import { analyzeLockScreenContrast, hexToRgb } from "@/lib/contrast";
import { THEME_PRESETS } from "@/lib/palette";
import {
  formatOffsetLabel,
  getDaysRemaining,
  getTodayISOInTimezone,
} from "@/lib/planner";
import { MilestoneIcon } from "./MilestoneIcon";
import { ThemedArtwork } from "./ThemedArtwork";

export interface LockScreenCanvasProps {
  deadline: Deadline;
  milestones: Milestone[];
  theme: ThemeConfig;
  preset: DevicePreset;
  mode: PreviewMode;
  showSafeZones?: boolean;
  interactive?: boolean;
  onToggleMilestone?: (id: string) => void;
  exportMode?: boolean;
}

function rgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
}

export const LockScreenCanvas = React.forwardRef<
  HTMLDivElement,
  LockScreenCanvasProps
>(
  (
    {
      deadline,
      milestones,
      theme,
      preset,
      mode,
      showSafeZones = false,
      interactive = false,
      onToggleMilestone,
      exportMode = false,
    },
    ref
  ) => {
    const isPortrait = preset.orientation === "portrait";
    const themePreset =
      THEME_PRESETS[theme.presetId] ?? THEME_PRESETS["autumn-bokeh"];

    const contrast = analyzeLockScreenContrast(theme);
    const resolvedTextColor = theme.autoContrast
      ? contrast.recommendedTextColor
      : theme.textColor;
    const resolvedAccentColor = theme.autoContrast
      ? contrast.recommendedAccentColor
      : theme.accentColor;

    const daysRemaining = getDaysRemaining(
      deadline.targetDateISO,
      deadline.timezone
    );
    const todayISO = getTodayISOInTimezone(deadline.timezone);

    const visibleMilestones = milestones.slice(0, 7);
    const checkedCount = visibleMilestones.filter((m) => m.checked).length;
    const totalCount = visibleMilestones.length;
    const allCompleted = totalCount > 0 && checkedCount === totalCount;
    const completionRatio = totalCount > 0 ? checkedCount / totalCount : 0;

    // SVG progress ring geometry
    const ringRadius = 14;
    const ringCircumference = 2 * Math.PI * ringRadius;
    const ringOffset = ringCircumference * (1 - completionRatio);

    const titleFontClass =
      theme.fontPairing === "greatvibes-inter"
        ? "font-script-elegant"
        : theme.fontPairing === "fraunces-inter"
          ? "font-display italic"
          : "font-script";

    const titleFontSize = isPortrait
      ? theme.fontPairing === "greatvibes-inter"
        ? 36
        : theme.fontPairing === "fraunces-inter"
          ? 27
          : 34
      : theme.fontPairing === "greatvibes-inter"
        ? 40
        : theme.fontPairing === "fraunces-inter"
          ? 30
          : 38;

    const cardBackground = `linear-gradient(155deg, ${rgba(
      theme.cardBgColor,
      Math.min(0.92, theme.glassOpacity + 0.14)
    )} 0%, ${rgba(
      theme.cardBgColor,
      Math.max(0.28, theme.glassOpacity - 0.04)
    )} 100%)`;

    // Determine compact scale for Android (360x800) vs iPhone (393x852) vs Desktop
    const isCompactPhone = preset.logicalWidth <= 365;

    return (
      <div
        ref={ref}
        style={{
          width: preset.logicalWidth,
          height: preset.logicalHeight,
          backgroundColor: theme.backdropColor,
          color: resolvedTextColor,
        }}
        className="relative overflow-hidden select-none font-sans"
      >
        {/* Background Layer: Custom Image or Procedural Bokeh */}
        {theme.customBgImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={theme.customBgImage}
              alt="Custom lock screen backdrop"
              style={{
                filter: `blur(${theme.bgBlur}px)`,
                transform: "scale(1.08)",
              }}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />
            <div
              style={{
                backgroundColor: `rgba(0, 0, 0, ${theme.bgDim})`,
              }}
              className="pointer-events-none absolute inset-0"
            />
          </>
        ) : (
          <div
            style={{ background: themePreset.gradientCss }}
            className="pointer-events-none absolute inset-0"
          >
            {/* Procedural Glowing Bokeh Orbs */}
            <div
              style={{
                background: `radial-gradient(circle, ${rgba(themePreset.orbs[0], 0.65)} 0%, transparent 70%)`,
              }}
              className="absolute -left-12 top-[8%] h-56 w-56 rounded-full blur-2xl"
            />
            <div
              style={{
                background: `radial-gradient(circle, ${rgba(themePreset.orbs[1], 0.52)} 0%, transparent 70%)`,
              }}
              className="absolute -right-10 top-[22%] h-64 w-64 rounded-full blur-3xl"
            />
            <div
              style={{
                background: `radial-gradient(circle, ${rgba(themePreset.orbs[2], 0.45)} 0%, transparent 70%)`,
              }}
              className="absolute bottom-[10%] left-[22%] h-52 w-52 rounded-full blur-2xl"
            />
            {/* Crisp micro bokeh dots */}
            <div
              style={{ backgroundColor: rgba(themePreset.orbs[0], 0.4) }}
              className="absolute left-[18%] top-[19%] h-8 w-8 rounded-full blur-[2px]"
            />
            <div
              style={{ backgroundColor: rgba(themePreset.orbs[2], 0.35) }}
              className="absolute right-[20%] top-[14%] h-12 w-12 rounded-full blur-[3px]"
            />
            <div
              style={{ backgroundColor: rgba(themePreset.orbs[1], 0.38) }}
              className="absolute right-[14%] bottom-[20%] h-10 w-10 rounded-full blur-[2px]"
            />
          </div>
        )}

        {/* Subtle Film Grain Texture */}
        <div className="studio-grain pointer-events-none absolute inset-0 opacity-75" />

        {/* Themed Vector Artwork */}
        <ThemedArtwork
          category={deadline.category}
          presetId={theme.presetId}
          accentColor={resolvedAccentColor}
          orientation={preset.orientation}
        />

        {/* PORTRAIT LAYOUT (Phone Lock Screens) */}
        {isPortrait ? (
          <div className="relative z-10 flex h-full w-full flex-col">
            {/* TOP ~32% SAFE ZONE (OS Status Bar + Clock in Mockup, Clear in Wallpaper) */}
            <div
              style={{ height: "31.5%" }}
              className="relative flex w-full shrink-0 flex-col items-center px-6 pt-3.5"
            >
              {mode === "mockup" && (
                <>
                  {/* Status Bar */}
                  <div className="flex w-full items-center justify-between text-[11px] font-semibold tracking-tight opacity-90">
                    <span>9:41</span>
                    <div className="h-4 w-20 rounded-full bg-black/75 ring-1 ring-white/10" />
                    <div className="flex items-center gap-1.5">
                      <Signal className="h-3 w-3" />
                      <Wifi className="h-3 w-3" />
                      <Battery className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  {/* Lock Glyph + Date + Weather + Big OS Clock */}
                  <div className="mt-4 flex flex-col items-center text-center">
                    <Lock className="mb-1.5 h-3.5 w-3.5 opacity-80" />
                    <div className="flex items-center gap-2 text-[13px] font-medium tracking-wide opacity-90">
                      <span>Mon, Nov 16</span>
                      <span className="opacity-50">•</span>
                      <span className="inline-flex items-center gap-1">
                        <Sun className="h-3.5 w-3.5 text-amber-300" />
                        64°
                      </span>
                    </div>
                    <div
                      style={{
                        textShadow: "0 4px 24px rgba(0,0,0,0.35)",
                      }}
                      className="mt-0.5 text-[72px] font-bold leading-none tracking-tight"
                    >
                      9:41
                    </div>
                  </div>
                </>
              )}

              {/* One-line headline nestled right above the card zone */}
              <div className="mt-auto pb-2 text-center">
                <p
                  style={{
                    color: resolvedTextColor,
                    textShadow: "0 2px 12px rgba(0,0,0,0.45)",
                  }}
                  className="max-w-[330px] truncate text-[15px] font-semibold tracking-tight opacity-95"
                >
                  {deadline.headline || `${deadline.title} is coming up!`}
                </p>
              </div>
            </div>

            {/* MIDDLE ~34%-86% FROSTED GLASS CARD ZONE */}
            <div
              style={{
                paddingLeft: isCompactPhone ? 16 : 20,
                paddingRight: isCompactPhone ? 16 : 20,
              }}
              className="relative flex flex-1 flex-col justify-start"
            >
              <div
                style={{
                  background: cardBackground,
                  backdropFilter: `blur(${theme.glassBlur}px)`,
                  WebkitBackdropFilter: `blur(${theme.glassBlur}px)`,
                  borderRadius: `${theme.cornerRadius}px`,
                  border: `1px solid ${rgba("#FFFFFF", 0.2)}`,
                  boxShadow:
                    "0 24px 48px -12px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.22)",
                }}
                className="w-full overflow-hidden p-4"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2 pb-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        style={{ color: resolvedAccentColor }}
                        className="text-[10px] font-bold uppercase tracking-[0.16em]"
                      >
                        T-MINUS COUNTDOWN:
                      </span>
                      <span
                        style={{
                          backgroundColor: rgba(resolvedAccentColor, 0.18),
                          color: resolvedAccentColor,
                          border: `1px solid ${rgba(resolvedAccentColor, 0.35)}`,
                        }}
                        className="rounded-full px-2 py-0.5 text-[9.5px] font-bold tracking-wide"
                      >
                        {daysRemaining === 1
                          ? "1 DAY LEFT"
                          : `${daysRemaining} DAYS LEFT`}
                      </span>
                    </div>
                    <h2
                      style={{
                        fontSize: `${titleFontSize}px`,
                        color: resolvedTextColor,
                        textShadow: "0 2px 14px rgba(0,0,0,0.3)",
                      }}
                      className={`${titleFontClass} mt-0.5 truncate leading-[1.08]`}
                    >
                      {deadline.title}
                    </h2>
                  </div>

                  {/* Circular SVG Progress Ring */}
                  <div className="relative flex h-9 w-9 shrink-0 items-center justify-center">
                    <svg className="h-9 w-9 -rotate-90" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r={ringRadius}
                        fill="none"
                        stroke="rgba(255,255,255,0.16)"
                        strokeWidth="3"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r={ringRadius}
                        fill="none"
                        stroke={resolvedAccentColor}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={ringCircumference}
                        strokeDashoffset={ringOffset}
                      />
                    </svg>
                    <span className="absolute text-[9px] font-bold">
                      {checkedCount}/{totalCount}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div
                  style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
                  className="mb-2.5 h-px w-full"
                />

                {/* Celebratory Banner when all milestones are checked */}
                {allCompleted && (
                  <div
                    style={{
                      backgroundColor: rgba(resolvedAccentColor, 0.2),
                      border: `1px solid ${rgba(resolvedAccentColor, 0.5)}`,
                    }}
                    className="mb-2.5 flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-center"
                  >
                    <PartyPopper
                      size={14}
                      style={{ color: resolvedAccentColor }}
                    />
                    <span
                      style={{ color: resolvedTextColor }}
                      className="text-[11px] font-bold tracking-wide"
                    >
                      ALL SET — READY FOR DEADLINE!
                    </span>
                  </div>
                )}

                {/* Milestone Rows */}
                <div className="flex flex-col gap-1.5">
                  {visibleMilestones.map((m) => {
                    const isToday =
                      m.computedDateISO === todayISO ||
                      (m.offsetDays === daysRemaining &&
                        m.computedDateISO === todayISO);
                    const isPastUnchecked =
                      !m.checked && m.computedDateISO < todayISO;

                    const RowWrapper = interactive ? "button" : "div";

                    return (
                      <RowWrapper
                        key={m.id}
                        type={interactive ? "button" : undefined}
                        onClick={
                          interactive && onToggleMilestone
                            ? () => onToggleMilestone(m.id)
                            : undefined
                        }
                        style={{
                          backgroundColor: isToday
                            ? rgba(resolvedAccentColor, 0.14)
                            : "rgba(255, 255, 255, 0.04)",
                          border: isToday
                            ? `1px solid ${rgba(resolvedAccentColor, 0.42)}`
                            : "1px solid rgba(255, 255, 255, 0.06)",
                          opacity: m.checked
                            ? 0.72
                            : isPastUnchecked
                              ? 0.58
                              : 1,
                        }}
                        className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition ${
                          interactive ? "cursor-pointer hover:bg-white/10" : ""
                        }`}
                      >
                        {/* Checkbox */}
                        <motion.span
                          initial={false}
                          animate={{ scale: m.checked ? [1, 1.18, 1] : 1 }}
                          transition={{ duration: 0.22 }}
                          style={{
                            backgroundColor: m.checked
                              ? resolvedAccentColor
                              : "rgba(255,255,255,0.08)",
                            borderColor: m.checked
                              ? resolvedAccentColor
                              : rgba(resolvedTextColor, 0.35),
                          }}
                          className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border"
                        >
                          {m.checked && (
                            <Check
                              size={12}
                              strokeWidth={3}
                              color="#090A0F"
                            />
                          )}
                        </motion.span>

                        {/* T-Minus Label + Action */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-x-1.5 leading-snug">
                            <span
                              style={{ color: resolvedAccentColor }}
                              className="text-[11px] font-bold tracking-tight"
                            >
                              {formatOffsetLabel(m.offsetDays)} (
                              {m.formattedDate}):
                            </span>
                            <span
                              style={{ color: resolvedTextColor }}
                              className={`text-[11.5px] font-medium ${
                                m.checked ? "line-through opacity-80" : ""
                              }`}
                            >
                              {m.action}
                            </span>
                          </div>
                        </div>

                        {/* TODAY Pill */}
                        {isToday && !m.checked && (
                          <span
                            style={{
                              backgroundColor: resolvedAccentColor,
                              color: "#090A0F",
                            }}
                            className="shrink-0 rounded-full px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-wider"
                          >
                            TODAY
                          </span>
                        )}

                        {/* Right Illustrated Icon */}
                        <div
                          style={
                            theme.iconStyle === "solid-pill"
                              ? {
                                  backgroundColor: rgba(
                                    resolvedAccentColor,
                                    0.22
                                  ),
                                  borderColor: rgba(resolvedAccentColor, 0.4),
                                }
                              : theme.iconStyle === "glass-badge"
                                ? {
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                    borderColor: "rgba(255,255,255,0.18)",
                                  }
                                : {
                                    backgroundColor: "transparent",
                                    borderColor: "transparent",
                                  }
                          }
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border"
                        >
                          <MilestoneIcon
                            icon={m.icon}
                            size={14}
                            color={
                              theme.iconStyle === "minimal-glow"
                                ? resolvedAccentColor
                                : resolvedTextColor
                            }
                          />
                        </div>
                      </RowWrapper>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* BOTTOM ~12% SAFE ZONE */}
            <div
              style={{ height: "12.5%" }}
              className="relative flex w-full shrink-0 flex-col justify-end px-8 pb-3"
            >
              {mode === "mockup" && (
                <>
                  <div className="flex w-full items-center justify-between pb-2.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/45 backdrop-blur-md">
                      <Flashlight className="h-4 w-4 text-white/90" />
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/45 backdrop-blur-md">
                      <Camera className="h-4 w-4 text-white/90" />
                    </div>
                  </div>
                  <div className="mx-auto h-1 w-28 rounded-full bg-white/75" />
                </>
              )}
            </div>
          </div>
        ) : (
          /* LANDSCAPE LAYOUT (Desktop 16:9 Wallpapers: Clear Space Left, Card Right) */
          <div className="relative z-10 flex h-full w-full items-center justify-between px-10 py-8">
            {/* Left Side: Clear desktop icon space / Mockup Desktop Clock */}
            <div className="flex h-full w-[44%] flex-col justify-between py-2">
              {mode === "mockup" ? (
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium opacity-85">
                    <span>Monday, Nov 16</span>
                    <span className="opacity-50">•</span>
                    <span className="inline-flex items-center gap-1">
                      <Sun className="h-4 w-4 text-amber-300" />
                      64°F
                    </span>
                  </div>
                  <div
                    style={{
                      textShadow: "0 6px 32px rgba(0,0,0,0.4)",
                    }}
                    className="mt-1 text-[88px] font-bold leading-none tracking-tight"
                  >
                    9:41
                  </div>
                  <p className="mt-3 max-w-xs text-sm opacity-75">
                    {deadline.headline || `${deadline.title} is coming up!`}
                  </p>
                </div>
              ) : (
                <div className="pt-2">
                  <span className="inline-block rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs font-medium tracking-wide opacity-70">
                    {deadline.headline}
                  </span>
                </div>
              )}
            </div>

            {/* Right Side: T-Minus Frosted Glass Card */}
            <div className="flex h-full w-[52%] items-center justify-end">
              <div
                style={{
                  background: cardBackground,
                  backdropFilter: `blur(${theme.glassBlur}px)`,
                  WebkitBackdropFilter: `blur(${theme.glassBlur}px)`,
                  borderRadius: `${theme.cornerRadius}px`,
                  border: `1px solid ${rgba("#FFFFFF", 0.2)}`,
                  boxShadow:
                    "0 28px 60px -15px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.22)",
                }}
                className="w-full max-w-[490px] p-5"
              >
                <div className="flex items-start justify-between gap-3 pb-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        style={{ color: resolvedAccentColor }}
                        className="text-[11px] font-bold uppercase tracking-[0.16em]"
                      >
                        T-MINUS COUNTDOWN:
                      </span>
                      <span
                        style={{
                          backgroundColor: rgba(resolvedAccentColor, 0.18),
                          color: resolvedAccentColor,
                          border: `1px solid ${rgba(resolvedAccentColor, 0.35)}`,
                        }}
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                      >
                        {daysRemaining === 1
                          ? "1 DAY LEFT"
                          : `${daysRemaining} DAYS LEFT`}
                      </span>
                    </div>
                    <h2
                      style={{
                        fontSize: `${titleFontSize}px`,
                        color: resolvedTextColor,
                      }}
                      className={`${titleFontClass} mt-0.5 truncate leading-[1.08]`}
                    >
                      {deadline.title}
                    </h2>
                  </div>

                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                    <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r={ringRadius}
                        fill="none"
                        stroke="rgba(255,255,255,0.16)"
                        strokeWidth="3"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r={ringRadius}
                        fill="none"
                        stroke={resolvedAccentColor}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={ringCircumference}
                        strokeDashoffset={ringOffset}
                      />
                    </svg>
                    <span className="absolute text-[10px] font-bold">
                      {checkedCount}/{totalCount}
                    </span>
                  </div>
                </div>

                {allCompleted && (
                  <div
                    style={{
                      backgroundColor: rgba(resolvedAccentColor, 0.2),
                      border: `1px solid ${rgba(resolvedAccentColor, 0.5)}`,
                    }}
                    className="mb-2.5 flex items-center justify-center gap-2 rounded-xl px-3 py-1.5 text-center"
                  >
                    <PartyPopper
                      size={14}
                      style={{ color: resolvedAccentColor }}
                    />
                    <span className="text-xs font-bold">
                      ALL MILESTONES COMPLETE!
                    </span>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  {visibleMilestones.map((m) => {
                    const isToday = m.computedDateISO === todayISO;
                    const isPastUnchecked =
                      !m.checked && m.computedDateISO < todayISO;
                    const RowWrapper = interactive ? "button" : "div";
                    return (
                      <RowWrapper
                        key={m.id}
                        type={interactive ? "button" : undefined}
                        onClick={
                          interactive && onToggleMilestone
                            ? () => onToggleMilestone(m.id)
                            : undefined
                        }
                        style={{
                          backgroundColor: isToday
                            ? rgba(resolvedAccentColor, 0.14)
                            : "rgba(255,255,255,0.04)",
                          border: isToday
                            ? `1px solid ${rgba(resolvedAccentColor, 0.42)}`
                            : "1px solid rgba(255,255,255,0.06)",
                          opacity: m.checked
                            ? 0.72
                            : isPastUnchecked
                              ? 0.58
                              : 1,
                        }}
                        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left transition ${
                          interactive ? "cursor-pointer hover:bg-white/10" : ""
                        }`}
                      >
                        <span
                          style={{
                            backgroundColor: m.checked
                              ? resolvedAccentColor
                              : "rgba(255,255,255,0.08)",
                            borderColor: m.checked
                              ? resolvedAccentColor
                              : rgba(resolvedTextColor, 0.35),
                          }}
                          className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border"
                        >
                          {m.checked && (
                            <Check size={12} strokeWidth={3} color="#090A0F" />
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <span
                            style={{ color: resolvedAccentColor }}
                            className="mr-1.5 text-xs font-bold"
                          >
                            {formatOffsetLabel(m.offsetDays)} ({m.formattedDate}):
                          </span>
                          <span
                            style={{ color: resolvedTextColor }}
                            className={`text-xs font-medium ${
                              m.checked ? "line-through opacity-80" : ""
                            }`}
                          >
                            {m.action}
                          </span>
                        </div>
                        {isToday && !m.checked && (
                          <span
                            style={{
                              backgroundColor: resolvedAccentColor,
                              color: "#090A0F",
                            }}
                            className="rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase"
                          >
                            TODAY
                          </span>
                        )}
                        <div
                          style={
                            theme.iconStyle === "solid-pill"
                              ? {
                                  backgroundColor: rgba(
                                    resolvedAccentColor,
                                    0.22
                                  ),
                                  borderColor: rgba(resolvedAccentColor, 0.4),
                                }
                              : theme.iconStyle === "glass-badge"
                                ? {
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                    borderColor: "rgba(255,255,255,0.18)",
                                  }
                                : {
                                    backgroundColor: "transparent",
                                    borderColor: "transparent",
                                  }
                          }
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border"
                        >
                          <MilestoneIcon
                            icon={m.icon}
                            size={14}
                            color={
                              theme.iconStyle === "minimal-glow"
                                ? resolvedAccentColor
                                : resolvedTextColor
                            }
                          />
                        </div>
                      </RowWrapper>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SAFE ZONE GUIDE OVERLAY (Never shown when exportMode=true) */}
        {showSafeZones && !exportMode && (
          <div className="pointer-events-none absolute inset-0 z-30">
            {isPortrait ? (
              <>
                <div className="absolute inset-x-0 top-0 flex h-[32%] items-start justify-center border-b-2 border-dashed border-cyan-400/70 bg-cyan-500/10 pt-2">
                  <span className="rounded bg-cyan-950/90 px-2 py-0.5 font-mono text-[10px] font-semibold text-cyan-200">
                    SAFE ZONE: OS CLOCK & WIDGETS (~32%)
                  </span>
                </div>
                <div className="absolute inset-x-0 top-[34%] flex h-[52%] items-start justify-end border-y border-dashed border-amber-400/60 bg-amber-500/5 p-2">
                  <span className="rounded bg-amber-950/90 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-200">
                    CARD ZONE (34%–86%)
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 flex h-[12%] items-center justify-center border-t-2 border-dashed border-rose-400/70 bg-rose-500/10">
                  <span className="rounded bg-rose-950/90 px-2 py-0.5 font-mono text-[10px] font-semibold text-rose-200">
                    SHORTCUTS SAFE ZONE (~12%)
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-y-0 left-0 flex w-[46%] items-start justify-start border-r-2 border-dashed border-cyan-400/70 bg-cyan-500/10 p-4">
                  <span className="rounded bg-cyan-950/90 px-2 py-0.5 font-mono text-[10px] font-semibold text-cyan-200">
                    CLEAR SPACE: DESKTOP ICONS & WIDGETS
                  </span>
                </div>
                <div className="absolute inset-y-0 right-0 flex w-[52%] items-start justify-end border-l border-dashed border-amber-400/60 bg-amber-500/5 p-4">
                  <span className="rounded bg-amber-950/90 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-200">
                    COUNTDOWN CARD ZONE
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);
LockScreenCanvas.displayName = "LockScreenCanvas";
