import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
      className="dark"
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-studio-bg font-sans text-zinc-100 antialiased selection:bg-amber-500/30 selection:text-amber-100">
        {children}
      </body>
    </html>
  );
}
