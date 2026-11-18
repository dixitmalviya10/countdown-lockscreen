import { ImageResponse } from "next/og";
import { decodeShareState } from "@/lib/share";
import { formatOffsetLabel, getDaysRemaining } from "@/lib/planner";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const hash = searchParams.get("hash") ?? "";
  const shared = hash ? decodeShareState(hash) : null;

  const title = shared?.deadline.title ?? "T-Minus Studio";
  const headline =
    shared?.deadline.headline ?? "Turn any deadline into a countdown lock screen";
  const accent = shared?.theme.accentColor ?? "#FBBF24";
  const backdrop = shared?.theme.backdropColor ?? "#120B07";
  const daysLeft = shared
    ? getDaysRemaining(shared.deadline.targetDateISO, shared.deadline.timezone)
    : 7;
  const rows = shared?.milestones.slice(0, 4) ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background: `radial-gradient(circle at 20% 20%, ${accent}44 0%, transparent 50%), linear-gradient(135deg, ${backdrop} 0%, #090A0F 100%)`,
          color: "#FFFBEB",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: accent,
            }}
          >
            T-MINUS STUDIO
          </div>
          <div
            style={{
              display: "flex",
              padding: "8px 20px",
              borderRadius: "999px",
              border: `2px solid ${accent}88`,
              background: `${accent}22`,
              color: accent,
              fontSize: "20px",
              fontWeight: 800,
            }}
          >
            {`${daysLeft} DAYS LEFT`}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", fontSize: "24px", opacity: 0.8 }}>{headline}</div>
          <div style={{ display: "flex", fontSize: "64px", fontWeight: 800, lineHeight: 1.05 }}>
            {title}
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
          {rows.map((m) => (
            <div
              key={m.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 18px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.16)",
                fontSize: "19px",
              }}
            >
              <span style={{ color: accent, fontWeight: 700 }}>
                {`${formatOffsetLabel(m.offsetDays)}:`}
              </span>
              <span>{m.action}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
