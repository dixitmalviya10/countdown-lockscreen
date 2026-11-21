import type { Metadata, Viewport } from "next";
import "./globals.css";

const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Fraunces:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Great+Vibes&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap";

function resolveMetadataBase(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return new URL(
      explicit.startsWith("http") ? explicit : `https://${explicit}`
    );
  }
  const netlifyUrl = process.env.URL || process.env.DEPLOY_PRIME_URL;
  if (netlifyUrl) {
    return new URL(
      netlifyUrl.startsWith("http") ? netlifyUrl : `https://${netlifyUrl}`
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href={GOOGLE_FONTS_HREF}
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-studio-bg font-sans text-zinc-100 antialiased selection:bg-amber-500/30 selection:text-amber-100">
        {children}
      </body>
    </html>
  );
}
