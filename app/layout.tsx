import type { Metadata, Viewport } from "next";
import {
  Caveat,
  Fraunces,
  Great_Vibes,
  Inter,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-script",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script-elegant",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

function resolveMetadataBase(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return new URL(
      explicit.startsWith("http") ? explicit : `https://${explicit}`
    );
  }
  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercelHost) {
    return new URL(`https://${vercelHost}`);
  }
  return new URL("http://localhost:3000");
}

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: {
    default: "T-Minus Studio — Turn Any Deadline Into a Countdown Lock Screen",
    template: "%s | T-Minus Studio",
  },
  description:
    "Plan backward T-minus milestones, design a bespoke frosted-glass lock screen wallpaper for iPhone, Android, or Desktop, export crisp PNGs, and sync calendar reminders.",
  keywords: [
    "countdown lock screen",
    "t-minus planner",
    "deadline wallpaper",
    "lock screen generator",
    "milestone tracker",
  ],
  openGraph: {
    title: "T-Minus Studio — Countdown Lock Screen Planner",
    description:
      "Turn any deadline into a bespoke frosted-glass countdown lock screen with backward T-minus milestones, PNG exports, and calendar reminders.",
    images: ["/api/og"],
  },
  twitter: {
    card: "summary_large_image",
    title: "T-Minus Studio — Countdown Lock Screen Planner",
    description:
      "Plan backward T-minus milestones and export pixel-accurate countdown lock screens for iPhone, Android, and Desktop.",
    images: ["/api/og"],
  },
};

export const viewport: Viewport = {
  themeColor: "#090A0F",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${fraunces.variable} ${caveat.variable} ${greatVibes.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-studio-bg font-sans text-zinc-100 antialiased selection:bg-amber-500/30 selection:text-amber-100">
        {children}
      </body>
    </html>
  );
}
