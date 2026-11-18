"use client";

import React from "react";
import {
  BellRing,
  BookOpen,
  Briefcase,
  CheckCheck,
  CheckCircle2,
  CheckSquare,
  ChefHat,
  ClipboardCheck,
  ClipboardList,
  Code2,
  Compass,
  Flag,
  FolderOpen,
  GraduationCap,
  ImageDown,
  Layers,
  Luggage,
  Map,
  MapPin,
  Moon,
  PackageCheck,
  Palette,
  PartyPopper,
  Plane,
  Rocket,
  SearchCheck,
  Send,
  Shield,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Target,
  Ticket,
  Timer,
  Trophy,
  Users,
  Utensils,
  Wine,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const ICON_REGISTRY: Record<string, LucideIcon> = {
  Sparkles,
  Rocket,
  Code2,
  Palette,
  ImageDown,
  BellRing,
  Compass,
  BookOpen,
  Timer,
  ClipboardCheck,
  GraduationCap,
  Target,
  Layers,
  Briefcase,
  CheckCircle2,
  PackageCheck,
  Send,
  ClipboardList,
  ShoppingBag,
  Users,
  Utensils,
  ChefHat,
  Wine,
  PartyPopper,
  Plane,
  Ticket,
  Shield,
  MapPin,
  Luggage,
  CheckSquare,
  Flag,
  FolderOpen,
  Zap,
  SlidersHorizontal,
  CheckCheck,
  Trophy,
  Map,
  SearchCheck,
  Moon,
  ShieldCheck,
};

export const CURATED_LUCIDE_ICONS = [
  "Sparkles",
  "Rocket",
  "Code2",
  "Palette",
  "ImageDown",
  "BellRing",
  "Compass",
  "BookOpen",
  "Timer",
  "ClipboardCheck",
  "GraduationCap",
  "Target",
  "Briefcase",
  "Utensils",
  "Users",
  "Wine",
  "ChefHat",
  "PartyPopper",
  "Plane",
  "Luggage",
  "ShoppingBag",
  "Flag",
  "Trophy",
  "Zap",
] as const;

export const CURATED_EMOJIS = [
  "🚀",
  "✨",
  "🎯",
  "🦃",
  "🥧",
  "🍷",
  "📚",
  "💻",
  "🎨",
  "🔔",
  "✈️",
  "🧳",
  "🎉",
  "🍁",
  "🔥",
  "🏆",
] as const;

export function MilestoneIcon({
  icon,
  size = 16,
  color,
  className,
}: {
  icon: string;
  size?: number;
  color?: string;
  className?: string;
}) {
  const IconComp = ICON_REGISTRY[icon];
  if (IconComp) {
    return (
      <IconComp
        size={size}
        style={color ? { color } : undefined}
        className={className}
        strokeWidth={2.1}
      />
    );
  }

  // Render emoji or fallback Sparkles
  const looksLikeEmoji = /\p{Emoji}/u.test(icon);
  if (looksLikeEmoji) {
    return (
      <span
        style={{ fontSize: size, lineHeight: 1 }}
        className={className}
        aria-hidden="true"
      >
        {icon}
      </span>
    );
  }

  return (
    <Sparkles
      size={size}
      style={color ? { color } : undefined}
      className={className}
      strokeWidth={2.1}
    />
  );
}
