"use client";

import React from "react";
import type { DeadlineCategory, ThemePresetId } from "@/types";

interface ThemedArtworkProps {
  category: DeadlineCategory;
  presetId: ThemePresetId;
  accentColor: string;
  orientation: "portrait" | "landscape";
}

export function ThemedArtwork({
  category,
  presetId,
  accentColor,
  orientation,
}: ThemedArtworkProps) {
  const isAutumn = presetId === "autumn-bokeh";
  const secondary =
    presetId === "midnight-neon"
      ? "#A855F7"
      : presetId === "sunrise-gradient"
        ? "#FBBF24"
        : presetId === "spring-pastel"
          ? "#F9A8D4"
          : presetId === "clean-mono"
            ? "#A1A1AA"
            : "#EA580C";

  // Compact bottom illustration matching the spirit of the reference lock screen
  const containerClass =
    orientation === "portrait"
      ? "pointer-events-none absolute inset-x-0 bottom-[6%] flex items-end justify-center opacity-90"
      : "pointer-events-none absolute bottom-[6%] left-[5%] flex items-end justify-start opacity-85";

  if (category === "Event/Party" || isAutumn) {
    return (
      <div className={containerClass} aria-hidden="true">
        <svg
          width={orientation === "portrait" ? 320 : 280}
          height={96}
          viewBox="0 0 320 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ambient warm base glow */}
          <ellipse
            cx="160"
            cy="78"
            rx="125"
            ry="18"
            fill={accentColor}
            fillOpacity="0.14"
          />
          {/* Left Maple Leaf */}
          <path
            d="M44 74 C40 62, 30 56, 26 48 C34 48, 38 44, 40 36 C44 43, 50 44, 58 40 C54 48, 56 54, 62 58 C53 60, 48 66, 46 74 Z"
            fill={secondary}
            fillOpacity="0.78"
            stroke={accentColor}
            strokeOpacity="0.4"
            strokeWidth="1.2"
          />
          {/* Glowing Golden Pumpkin / Harvest Bowl */}
          <ellipse
            cx="118"
            cy="68"
            rx="22"
            ry="15"
            fill={secondary}
            fillOpacity="0.82"
            stroke={accentColor}
            strokeOpacity="0.55"
            strokeWidth="1.2"
          />
          <ellipse
            cx="118"
            cy="68"
            rx="11"
            ry="15"
            fill={accentColor}
            fillOpacity="0.35"
          />
          <path
            d="M118 53 C118 47, 122 44, 125 45"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Celebration Glass / Candlelight */}
          <path
            d="M160 44 L168 44 L170 74 L158 74 Z"
            fill="rgba(255,255,255,0.16)"
            stroke={accentColor}
            strokeOpacity="0.6"
            strokeWidth="1.2"
          />
          <circle cx="164" cy="39" r="4" fill={accentColor} fillOpacity="0.9" />
          <circle cx="164" cy="39" r="9" fill={accentColor} fillOpacity="0.24" />
          {/* Artisan Pie Slice / Acorn Cluster */}
          <path
            d="M196 74 L228 74 L220 56 L198 62 Z"
            fill={accentColor}
            fillOpacity="0.65"
            stroke="#FFFBEB"
            strokeOpacity="0.4"
            strokeWidth="1.2"
          />
          <path
            d="M220 56 Q226 52 230 57 L228 74"
            stroke={secondary}
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Right Maple Leaf */}
          <path
            d="M276 74 C272 62, 262 56, 258 48 C266 48, 270 44, 272 36 C276 43, 282 44, 290 40 C286 48, 288 54, 294 58 C285 60, 280 66, 278 74 Z"
            fill={accentColor}
            fillOpacity="0.72"
            stroke="#FFFBEB"
            strokeOpacity="0.35"
            strokeWidth="1.2"
          />
          {/* Floating sparkle particles */}
          <circle cx="84" cy="36" r="2.2" fill={accentColor} fillOpacity="0.75" />
          <circle cx="144" cy="24" r="1.8" fill="#FFFBEB" fillOpacity="0.65" />
          <circle cx="242" cy="32" r="2.5" fill={accentColor} fillOpacity="0.7" />
        </svg>
      </div>
    );
  }

  if (category === "Launch") {
    return (
      <div className={containerClass} aria-hidden="true">
        <svg
          width={orientation === "portrait" ? 300 : 280}
          height={92}
          viewBox="0 0 300 92"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="150"
            cy="78"
            rx="118"
            ry="14"
            fill={accentColor}
            fillOpacity="0.16"
          />
          {/* Orbital horizon arc */}
          <path
            d="M28 74 Q150 40 272 74"
            stroke={accentColor}
            strokeOpacity="0.4"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          {/* Stylized Launch Rocket */}
          <g transform="translate(138, 22)">
            <path
              d="M12 0 C20 10, 22 24, 20 38 L4 38 C2 24, 4 10, 12 0 Z"
              fill="rgba(255,255,255,0.22)"
              stroke={accentColor}
              strokeWidth="1.5"
            />
            <circle cx="12" cy="18" r="3.5" fill={accentColor} />
            <path d="M4 28 L-3 38 L4 36 Z" fill={secondary} fillOpacity="0.85" />
            <path d="M20 28 L27 38 L20 36 Z" fill={secondary} fillOpacity="0.85" />
            <path
              d="M8 39 L12 52 L16 39 Z"
              fill={accentColor}
              fillOpacity="0.85"
            />
          </g>
          {/* Constellation stars */}
          <circle cx="64" cy="40" r="2" fill={accentColor} fillOpacity="0.8" />
          <circle cx="96" cy="24" r="1.5" fill="#FFFFFF" fillOpacity="0.6" />
          <circle cx="212" cy="28" r="2.2" fill={secondary} fillOpacity="0.85" />
          <circle cx="242" cy="46" r="1.6" fill="#FFFFFF" fillOpacity="0.65" />
        </svg>
      </div>
    );
  }

  if (category === "Exam") {
    return (
      <div className={containerClass} aria-hidden="true">
        <svg
          width={orientation === "portrait" ? 300 : 280}
          height={90}
          viewBox="0 0 300 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="150"
            cy="76"
            rx="110"
            ry="12"
            fill={accentColor}
            fillOpacity="0.14"
          />
          {/* Stack of books */}
          <rect
            x="92"
            y="58"
            width="86"
            height="14"
            rx="4"
            fill="rgba(255,255,255,0.14)"
            stroke={accentColor}
            strokeOpacity="0.55"
            strokeWidth="1.3"
          />
          <rect
            x="102"
            y="43"
            width="72"
            height="13"
            rx="4"
            fill={secondary}
            fillOpacity="0.45"
            stroke="#FFFFFF"
            strokeOpacity="0.3"
            strokeWidth="1.2"
          />
          {/* Warm mug */}
          <rect
            x="194"
            y="48"
            width="24"
            height="24"
            rx="5"
            fill="rgba(255,255,255,0.16)"
            stroke={accentColor}
            strokeWidth="1.4"
          />
          <path
            d="M218 54 C224 54, 224 64, 218 64"
            stroke={accentColor}
            strokeWidth="1.4"
            fill="none"
          />
          <path
            d="M201 41 Q204 34 201 28 M210 41 Q213 34 210 28"
            stroke={accentColor}
            strokeOpacity="0.65"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  if (category === "Travel") {
    return (
      <div className={containerClass} aria-hidden="true">
        <svg
          width={orientation === "portrait" ? 310 : 280}
          height={92}
          viewBox="0 0 310 92"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Mountain skyline */}
          <path
            d="M30 76 L88 38 L136 66 L192 28 L254 68 L284 54 L296 76 Z"
            fill="rgba(255,255,255,0.08)"
            stroke={accentColor}
            strokeOpacity="0.45"
            strokeWidth="1.4"
          />
          {/* Flight path */}
          <path
            d="M52 26 Q155 8 248 32"
            stroke={accentColor}
            strokeOpacity="0.6"
            strokeWidth="1.5"
            strokeDasharray="5 4"
          />
          <circle cx="250" cy="32" r="4" fill={accentColor} />
        </svg>
      </div>
    );
  }

  // Client deliverable / Custom sleek geometric horizon
  return (
    <div className={containerClass} aria-hidden="true">
      <svg
        width={orientation === "portrait" ? 300 : 280}
        height={88}
        viewBox="0 0 300 88"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse
          cx="150"
          cy="74"
          rx="115"
          ry="13"
          fill={accentColor}
          fillOpacity="0.16"
        />
        <circle
          cx="150"
          cy="50"
          r="24"
          stroke={accentColor}
          strokeOpacity="0.45"
          strokeWidth="1.5"
        />
        <circle
          cx="150"
          cy="50"
          r="14"
          fill={secondary}
          fillOpacity="0.28"
          stroke="#FFFFFF"
          strokeOpacity="0.35"
          strokeWidth="1.2"
        />
        <circle cx="150" cy="50" r="4" fill={accentColor} />
        <line
          x1="46"
          y1="74"
          x2="254"
          y2="74"
          stroke={accentColor}
          strokeOpacity="0.32"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
}
