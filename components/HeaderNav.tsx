"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, RotateCcw, Timer } from "lucide-react";
import { useCountdownStore } from "@/store/useCountdownStore";

export function HeaderNav() {
  const pathname = usePathname();
  const resetDemo = useCountdownStore((s) => s.resetDemo);

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-studio-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight text-zinc-100"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-amber-400/35 bg-gradient-to-br from-amber-400/25 to-orange-500/20 text-amber-300 shadow-inner transition group-hover:scale-105">
            <Timer className="h-4 w-4" />
          </span>
          <span className="font-display text-base tracking-tight">
            T-Minus <span className="text-amber-400">Studio</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          {pathname === "/builder" ? (
            <>
              <button
                type="button"
                onClick={resetDemo}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.09] hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset Demo</span>
              </button>
              <Link
                href="/"
                className="rounded-xl px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:text-white"
              >
                Overview
              </Link>
            </>
          ) : (
            <Link
              href="/builder"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-3.5 py-2 text-xs font-semibold text-zinc-950 shadow-lg shadow-amber-500/20 transition hover:brightness-110"
            >
              Open Studio
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
