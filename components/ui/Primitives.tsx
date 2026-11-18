"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "amber";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", ...props }, ref) => {
    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      primary:
        "bg-zinc-100 text-zinc-950 hover:bg-white shadow-lg shadow-white/5 border border-white/20",
      amber:
        "bg-gradient-to-r from-amber-400 to-orange-500 text-zinc-950 font-semibold hover:brightness-110 shadow-lg shadow-amber-500/20 border border-amber-300/40",
      secondary:
        "bg-white/[0.06] text-zinc-100 hover:bg-white/[0.11] border border-white/10",
      ghost:
        "bg-transparent text-zinc-300 hover:bg-white/[0.06] hover:text-white border border-transparent",
      danger:
        "bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30",
    };

    const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
      sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
      md: "h-10 px-4 text-sm rounded-xl gap-2",
      lg: "h-12 px-6 text-sm rounded-xl gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-45 active:scale-[0.98]",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-xl border border-white/10 bg-black/35 px-3.5 text-sm text-zinc-100 placeholder:text-zinc-500 transition focus:border-amber-400/60 focus:bg-black/50 focus:outline-none",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-white/10 bg-black/35 p-3.5 text-sm text-zinc-100 placeholder:text-zinc-500 transition focus:border-amber-400/60 focus:bg-black/50 focus:outline-none",
        className
      )}
      {...props}
    />
  );
}

export function Label({
  className,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "block text-xs font-medium uppercase tracking-wider text-zinc-400",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}

export function StudioCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-studio-surface/90 p-4 shadow-xl backdrop-blur-md",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-0.5 text-[11px] font-medium text-zinc-300",
        className
      )}
    >
      {children}
    </span>
  );
}
