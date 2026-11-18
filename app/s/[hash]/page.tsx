import type { Metadata } from "next";
import Link from "next/link";
import { decodeShareState } from "@/lib/share";
import { getDaysRemaining } from "@/lib/planner";
import { ShareClientView } from "@/components/share/ShareClientView";
import { HeaderNav } from "@/components/HeaderNav";

interface SharePageProps {
  params: { hash: string };
}

export async function generateMetadata({
  params,
}: SharePageProps): Promise<Metadata> {
  const shared = decodeShareState(params.hash);
  if (!shared) {
    return {
      title: "Shared Countdown Not Found",
    };
  }
  const daysLeft = getDaysRemaining(
    shared.deadline.targetDateISO,
    shared.deadline.timezone
  );

  return {
    title: `${shared.deadline.title} (${daysLeft} days left)`,
    description: `${shared.deadline.headline} — View milestones, export lock screen PNG, or import calendar reminders.`,
    openGraph: {
      title: `${shared.deadline.title} — T-Minus Studio`,
      description: `${daysLeft} days left • ${shared.milestones.length} T-minus milestones`,
      images: [`/api/og?hash=${encodeURIComponent(params.hash)}`],
    },
  };
}

export default function SharePage({ params }: SharePageProps) {
  const shared = decodeShareState(params.hash);

  if (!shared) {
    return (
      <div className="min-h-screen bg-studio-bg text-zinc-100">
        <HeaderNav />
        <main className="mx-auto flex max-w-lg flex-col items-center justify-center px-6 py-24 text-center">
          <h1 className="font-display text-3xl font-semibold text-white">
            Invalid or Expired Countdown Link
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            This T-Minus share link could not be decoded. Start a fresh
            countdown lock screen in the studio in seconds.
          </p>
          <Link
            href="/builder"
            className="mt-6 inline-flex h-11 items-center rounded-xl bg-amber-400 px-5 text-sm font-semibold text-zinc-950 transition hover:brightness-110"
          >
            Create my countdown
          </Link>
        </main>
      </div>
    );
  }

  return <ShareClientView shared={shared} />;
}
