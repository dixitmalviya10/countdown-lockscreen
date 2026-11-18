"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  ImageDown,
  Layers,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";
import { DEVICE_PRESETS } from "@/lib/export";
import { THEME_PRESETS } from "@/lib/palette";
import { DEMO_DEADLINE, DEMO_MILESTONES } from "@/store/useCountdownStore";
import { HeaderNav } from "@/components/HeaderNav";
import { LockScreenCanvas } from "@/components/lockscreen/LockScreenCanvas";
import type { ThemePresetId } from "@/types";

const HERO_PRESETS: ThemePresetId[] = [
  "autumn-bokeh",
  "midnight-neon",
  "sunrise-gradient",
  "study-focus",
];

export default function MarketingPage() {
  const [presetIdx, setPresetIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPresetIdx((prev) => (prev + 1) % HERO_PRESETS.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  const activePresetId = HERO_PRESETS[presetIdx];
  const activeTheme = THEME_PRESETS[activePresetId].config;

  return (
    <div className="relative min-h-screen overflow-hidden bg-studio-bg text-zinc-100">
      {/* Ambient studio glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(245,158,11,0.14),transparent_48%),radial-gradient(ellipse_at_85%_20%,rgba(34,211,238,0.1),transparent_45%)]" />

      <HeaderNav />

      <main className="relative z-10 mx-auto max-w-[1320px] px-4 pb-20 pt-10 sm:px-6 lg:pt-14">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Editorial Hero Copy */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3.5 py-1 text-xs font-medium text-amber-300"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Your Deadline, Your Design — Lock Screen Studio
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[56px]"
            >
              Turn any deadline into a lock screen you actually{" "}
              <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                look forward to.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-5 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg"
            >
              Plan backward T-minus milestones in seconds, style a frosted-glass
              lock screen sized to exact iPhone, Android, and Desktop safe
              zones, export crisp high-DPI PNGs, and sync calendar reminders.
            </motion.p>

            {/* Primary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/builder"
                className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 text-sm font-semibold text-zinc-950 shadow-xl shadow-amber-500/25 transition hover:brightness-110 active:scale-[0.98]"
              >
                Create my countdown
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Seeded with Handshake Challenge • Zero sign-up required
              </div>
            </motion.div>

            {/* Feature Pillars */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.22 }}
              className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              {[
                {
                  icon: Wand2,
                  title: "Backward T-Minus Ladder",
                  desc: "Auto-plans [14,10,7,5,3,2,1,0] offsets under 5 words/row, or paste from Gemini.",
                },
                {
                  icon: Layers,
                  title: "OS Safe-Zone Precision",
                  desc: "32% top clear for clock, frosted card center, 12% bottom shortcuts safe.",
                },
                {
                  icon: ImageDown,
                  title: "Exact Pixel PNG Exports",
                  desc: "1179×2556 iPhone, 1080×2400 Android, 1920×1080 & 2560×1440 Desktop.",
                },
                {
                  icon: CalendarCheck,
                  title: ".ics + Share Links",
                  desc: "One-click calendar bundle, Google Calendar links, and compressed /s/ URLs.",
                },
              ].map((feat) => (
                <div
                  key={feat.title}
                  className="rounded-2xl border border-white/[0.08] bg-studio-surface/75 p-4 backdrop-blur-md"
                >
                  <feat.icon className="h-4 w-4 text-amber-400" />
                  <h2 className="mt-2 text-sm font-semibold text-zinc-100">
                    {feat.title}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Animated Live Phone Preview */}
          <div className="flex flex-col items-center lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative flex flex-col items-center"
            >
              {/* Soft backlight behind phone */}
              <div className="pointer-events-none absolute -inset-8 rounded-full bg-gradient-to-tr from-amber-500/20 via-orange-500/10 to-cyan-500/15 blur-3xl" />

              {/* Scaled 393x852 iPhone Frame */}
              <div className="relative h-[614px] w-[283px] overflow-hidden rounded-[42px] border border-white/20 bg-black shadow-[0_40px_100px_-18px_rgba(0,0,0,0.9)] sm:h-[665px] sm:w-[307px]">
                <div
                  style={{
                    width: 393,
                    height: 852,
                    transform: "scale(0.72)",
                    transformOrigin: "top left",
                  }}
                  className="hidden sm:block"
                >
                  <LockScreenCanvas
                    deadline={DEMO_DEADLINE}
                    milestones={DEMO_MILESTONES}
                    theme={activeTheme}
                    preset={DEVICE_PRESETS["iphone-16-pro"]}
                    mode="mockup"
                  />
                </div>
                <div
                  style={{
                    width: 393,
                    height: 852,
                    transform: "scale(0.72)",
                    transformOrigin: "top left",
                  }}
                  className="sm:hidden"
                >
                  <LockScreenCanvas
                    deadline={DEMO_DEADLINE}
                    milestones={DEMO_MILESTONES}
                    theme={activeTheme}
                    preset={DEVICE_PRESETS["iphone-16-pro"]}
                    mode="mockup"
                  />
                </div>
              </div>

              {/* Theme Switcher Pills below preview */}
              <div className="relative z-10 mt-5 flex flex-wrap items-center justify-center gap-2">
                {HERO_PRESETS.map((pid, idx) => {
                  const p = THEME_PRESETS[pid];
                  const active = idx === presetIdx;
                  return (
                    <button
                      key={pid}
                      type="button"
                      onClick={() => setPresetIdx(idx)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                        active
                          ? "border-amber-400/50 bg-amber-400/15 text-amber-200"
                          : "border-white/10 bg-white/[0.04] text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <span
                        style={{ backgroundColor: p.orbs[0] }}
                        className="h-2 w-2 rounded-full"
                      />
                      {p.name}
                    </button>
                  );
                })}
              </div>

              <p className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Live WCAG AA contrast verified • 100% procedural or custom art
              </p>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
