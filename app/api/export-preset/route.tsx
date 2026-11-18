import { ImageResponse } from "next/og";
import { DEVICE_PRESETS } from "@/lib/export";
import { DEMO_DEADLINE, DEMO_MILESTONES } from "@/lib/demo-data";
import { formatOffsetLabel } from "@/lib/planner";
import type { DevicePresetId } from "@/types";

export const runtime = "edge";

const VALID_PRESETS = new Set<DevicePresetId>([
  "iphone-16-pro",
  "android-flagship",
  "desktop-fhd",
  "desktop-qhd",
]);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawPreset = searchParams.get("preset") as DevicePresetId | null;
  const presetId: DevicePresetId =
    rawPreset && VALID_PRESETS.has(rawPreset) ? rawPreset : "iphone-16-pro";

  const preset = DEVICE_PRESETS[presetId];
  const isPortrait = preset.orientation === "portrait";
  const scale = isPortrait
    ? preset.width / 1179
    : preset.width / 1920;

  const px = (n: number) => Math.round(n * scale);

  const accent = "#FBBF24";
  const text = "#FFFBEB";

  if (isPortrait) {
    return new ImageResponse(
      (
        <div
          style={{
            width: `${preset.width}px`,
            height: `${preset.height}px`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background:
              "radial-gradient(circle at 22% 18%, rgba(245, 158, 11, 0.55) 0%, transparent 45%), radial-gradient(circle at 82% 24%, rgba(234, 88, 12, 0.48) 0%, transparent 48%), radial-gradient(circle at 50% 88%, rgba(251, 191, 36, 0.42) 0%, transparent 55%), linear-gradient(165deg, #211008 0%, #311709 45%, #160B05 100%)",
            color: text,
            fontFamily: "sans-serif",
            position: "relative",
          }}
        >
          {/* TOP ~32% SAFE ZONE (Status Bar + Clock + Headline) */}
          <div
            style={{
              height: `${Math.round(preset.height * 0.315)}px`,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: `${px(44)}px ${px(64)}px ${px(28)}px ${px(64)}px`,
            }}
          >
            {/* OS Status Bar */}
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: `${px(32)}px`,
                fontWeight: 600,
                opacity: 0.92,
              }}
            >
              <span>9:41</span>
              <div
                style={{
                  width: `${px(220)}px`,
                  height: `${px(48)}px`,
                  borderRadius: "999px",
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "2px solid rgba(255,255,255,0.12)",
                  display: "flex",
                }}
              />
              <span>5G  100%</span>
            </div>

            {/* Date, Weather & Big Lock Clock */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: `${px(38)}px`,
                  fontWeight: 500,
                  opacity: 0.9,
                }}
              >
                Mon, Nov 16  •  64°
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: `${px(210)}px`,
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  marginTop: `${px(8)}px`,
                }}
              >
                9:41
              </div>
            </div>

            {/* One-line headline */}
            <div
              style={{
                display: "flex",
                fontSize: `${px(44)}px`,
                fontWeight: 600,
                textAlign: "center",
                opacity: 0.96,
              }}
            >
              {DEMO_DEADLINE.headline}
            </div>
          </div>

          {/* MIDDLE FROSTED GLASS COUNTDOWN CARD */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingLeft: `${px(56)}px`,
              paddingRight: `${px(56)}px`,
              flex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                background:
                  "linear-gradient(155deg, rgba(46, 25, 13, 0.84) 0%, rgba(30, 15, 8, 0.72) 100%)",
                borderRadius: `${px(76)}px`,
                border: "3px solid rgba(255, 255, 255, 0.22)",
                padding: `${px(52)}px`,
                boxShadow: "0 40px 90px rgba(0, 0, 0, 0.55)",
              }}
            >
              {/* Card Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  paddingBottom: `${px(30)}px`,
                  borderBottom: "2px solid rgba(255, 255, 255, 0.14)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: `${px(20)}px`,
                    }}
                  >
                    <span
                      style={{
                        color: accent,
                        fontSize: `${px(28)}px`,
                        fontWeight: 800,
                        letterSpacing: "0.14em",
                      }}
                    >
                      T-MINUS COUNTDOWN:
                    </span>
                    <span
                      style={{
                        backgroundColor: "rgba(251, 191, 36, 0.2)",
                        color: accent,
                        border: "2px solid rgba(251, 191, 36, 0.45)",
                        borderRadius: "999px",
                        padding: `${px(6)}px ${px(22)}px`,
                        fontSize: `${px(24)}px`,
                        fontWeight: 800,
                      }}
                    >
                      7 DAYS LEFT
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      fontSize: `${px(74)}px`,
                      fontWeight: 700,
                      lineHeight: 1.12,
                      marginTop: `${px(12)}px`,
                      fontStyle: "italic",
                    }}
                  >
                    {DEMO_DEADLINE.title}
                  </div>
                </div>

                {/* Progress Badge */}
                <div
                  style={{
                    width: `${px(108)}px`,
                    height: `${px(108)}px`,
                    borderRadius: "999px",
                    border: `6px solid ${accent}`,
                    backgroundColor: "rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: `${px(28)}px`,
                    fontWeight: 800,
                  }}
                >
                  1/7
                </div>
              </div>

              {/* Milestone Rows */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: `${px(20)}px`,
                  marginTop: `${px(30)}px`,
                }}
              >
                {DEMO_MILESTONES.map((m) => {
                  const isToday = m.computedDateISO === "2026-11-16";
                  return (
                    <div
                      key={m.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: `${px(24)}px`,
                        padding: `${px(24)}px ${px(28)}px`,
                        borderRadius: `${px(34)}px`,
                        backgroundColor: isToday
                          ? "rgba(251, 191, 36, 0.16)"
                          : "rgba(255, 255, 255, 0.05)",
                        border: isToday
                          ? "2px solid rgba(251, 191, 36, 0.5)"
                          : "2px solid rgba(255, 255, 255, 0.08)",
                        opacity: m.checked ? 0.72 : 1,
                      }}
                    >
                      {/* Checkbox */}
                      <div
                        style={{
                          width: `${px(46)}px`,
                          height: `${px(46)}px`,
                          borderRadius: `${px(12)}px`,
                          backgroundColor: m.checked
                            ? accent
                            : "rgba(255,255,255,0.08)",
                          border: m.checked
                            ? `3px solid ${accent}`
                            : "3px solid rgba(255,251,235,0.4)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#090A0F",
                          fontSize: `${px(30)}px`,
                          fontWeight: 900,
                        }}
                      >
                        {m.checked ? (
                          <svg
                            width={px(28)}
                            height={px(28)}
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M5 13l4 4L19 7"
                              stroke="#090A0F"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : null}
                      </div>

                      {/* Text */}
                      <div
                        style={{
                          display: "flex",
                          flex: 1,
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: `${px(14)}px`,
                          fontSize: `${px(33)}px`,
                        }}
                      >
                        <span style={{ color: accent, fontWeight: 800 }}>
                          {`${formatOffsetLabel(m.offsetDays)} (${m.formattedDate}):`}
                        </span>
                        <span
                          style={{
                            color: text,
                            fontWeight: 500,
                            textDecoration: m.checked ? "line-through" : "none",
                          }}
                        >
                          {m.action}
                        </span>
                      </div>

                      {isToday && (
                        <span
                          style={{
                            backgroundColor: accent,
                            color: "#090A0F",
                            borderRadius: "999px",
                            padding: `${px(8)}px ${px(20)}px`,
                            fontSize: `${px(22)}px`,
                            fontWeight: 900,
                          }}
                        >
                          TODAY
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* BOTTOM ~12% SAFE ZONE (Shortcuts + Home Bar) */}
          <div
            style={{
              height: `${Math.round(preset.height * 0.125)}px`,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: `0 ${px(96)}px ${px(42)}px ${px(96)}px`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: `${px(34)}px`,
              }}
            >
              <div
                style={{
                  width: `${px(116)}px`,
                  height: `${px(116)}px`,
                  borderRadius: "999px",
                  backgroundColor: "rgba(0,0,0,0.48)",
                  border: "2px solid rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width={px(44)}
                  height={px(44)}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M18 6c0 2-2 2-2 4v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10c0-2-2-2-2-4V2h12v4Z"
                    stroke="#FFFBEB"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div
                style={{
                  width: `${px(116)}px`,
                  height: `${px(116)}px`,
                  borderRadius: "999px",
                  backgroundColor: "rgba(0,0,0,0.48)",
                  border: "2px solid rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width={px(44)}
                  height={px(44)}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"
                    stroke="#FFFBEB"
                    strokeWidth="2"
                  />
                  <circle cx="12" cy="13" r="3" stroke="#FFFBEB" strokeWidth="2" />
                </svg>
              </div>
            </div>
            <div
              style={{
                width: `${px(340)}px`,
                height: `${px(12)}px`,
                borderRadius: "999px",
                backgroundColor: "rgba(255,255,255,0.78)",
                marginLeft: "auto",
                marginRight: "auto",
                display: "flex",
              }}
            />
          </div>
        </div>
      ),
      {
        width: preset.width,
        height: preset.height,
      }
    );
  }

  // LANDSCAPE DESKTOP LAYOUT (1920x1080 or 2560x1440)
  return new ImageResponse(
    (
      <div
        style={{
          width: `${preset.width}px`,
          height: `${preset.height}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${px(76)}px ${px(96)}px`,
          background:
            "radial-gradient(circle at 20% 18%, rgba(245, 158, 11, 0.55) 0%, transparent 45%), radial-gradient(circle at 82% 24%, rgba(234, 88, 12, 0.48) 0%, transparent 48%), radial-gradient(circle at 50% 88%, rgba(251, 191, 36, 0.42) 0%, transparent 55%), linear-gradient(165deg, #211008 0%, #311709 45%, #160B05 100%)",
          color: text,
          fontFamily: "sans-serif",
        }}
      >
        {/* Left Clear Desktop Space + Clock Widget */}
        <div
          style={{
            width: "44%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            paddingTop: `${px(24)}px`,
          }}
        >
          <div style={{ display: "flex", fontSize: `${px(30)}px`, fontWeight: 500, opacity: 0.85 }}>
            Monday, Nov 16  •  64°F
          </div>
          <div
            style={{
              display: "flex",
              fontSize: `${px(172)}px`,
              fontWeight: 700,
              lineHeight: 1,
              marginTop: `${px(10)}px`,
              letterSpacing: "-0.03em",
            }}
          >
            9:41
          </div>
          <div
            style={{
              display: "flex",
              fontSize: `${px(32)}px`,
              marginTop: `${px(22)}px`,
              opacity: 0.8,
            }}
          >
            {DEMO_DEADLINE.headline}
          </div>
        </div>

        {/* Right T-Minus Frosted Card */}
        <div
          style={{
            width: "52%",
            display: "flex",
            flexDirection: "column",
            background:
              "linear-gradient(155deg, rgba(46, 25, 13, 0.84) 0%, rgba(30, 15, 8, 0.72) 100%)",
            borderRadius: `${px(48)}px`,
            border: "2px solid rgba(255, 255, 255, 0.22)",
            padding: `${px(46)}px`,
            boxShadow: "0 40px 90px rgba(0, 0, 0, 0.6)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              paddingBottom: `${px(24)}px`,
              borderBottom: "2px solid rgba(255,255,255,0.14)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: `${px(16)}px` }}>
                <span
                  style={{
                    color: accent,
                    fontSize: `${px(22)}px`,
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                  }}
                >
                  T-MINUS COUNTDOWN:
                </span>
                <span
                  style={{
                    backgroundColor: "rgba(251, 191, 36, 0.2)",
                    color: accent,
                    border: "2px solid rgba(251, 191, 36, 0.45)",
                    borderRadius: "999px",
                    padding: `${px(4)}px ${px(18)}px`,
                    fontSize: `${px(20)}px`,
                    fontWeight: 800,
                  }}
                >
                  7 DAYS LEFT
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: `${px(56)}px`,
                  fontWeight: 700,
                  fontStyle: "italic",
                  marginTop: `${px(8)}px`,
                }}
              >
                {DEMO_DEADLINE.title}
              </div>
            </div>

            <div
              style={{
                width: `${px(80)}px`,
                height: `${px(80)}px`,
                borderRadius: "999px",
                border: `5px solid ${accent}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: `${px(22)}px`,
                fontWeight: 800,
              }}
            >
              1/7
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: `${px(14)}px`,
              marginTop: `${px(22)}px`,
            }}
          >
            {DEMO_MILESTONES.map((m) => {
              const isToday = m.computedDateISO === "2026-11-16";
              return (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: `${px(18)}px`,
                    padding: `${px(16)}px ${px(22)}px`,
                    borderRadius: `${px(22)}px`,
                    backgroundColor: isToday
                      ? "rgba(251, 191, 36, 0.16)"
                      : "rgba(255, 255, 255, 0.05)",
                    border: isToday
                      ? "2px solid rgba(251, 191, 36, 0.5)"
                      : "2px solid rgba(255, 255, 255, 0.08)",
                    opacity: m.checked ? 0.72 : 1,
                  }}
                >
                  <div
                    style={{
                      width: `${px(34)}px`,
                      height: `${px(34)}px`,
                      borderRadius: `${px(9)}px`,
                      backgroundColor: m.checked
                        ? accent
                        : "rgba(255,255,255,0.08)",
                      border: m.checked
                        ? `2px solid ${accent}`
                        : "2px solid rgba(255,251,235,0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#090A0F",
                      fontSize: `${px(22)}px`,
                      fontWeight: 900,
                    }}
                  >
                    {m.checked ? (
                      <svg
                        width={px(22)}
                        height={px(22)}
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          stroke="#090A0F"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : null}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      alignItems: "center",
                      gap: `${px(10)}px`,
                      fontSize: `${px(24)}px`,
                    }}
                  >
                    <span style={{ color: accent, fontWeight: 800 }}>
                      {`${formatOffsetLabel(m.offsetDays)} (${m.formattedDate}):`}
                    </span>
                    <span
                      style={{
                        color: text,
                        fontWeight: 500,
                        textDecoration: m.checked ? "line-through" : "none",
                      }}
                    >
                      {m.action}
                    </span>
                  </div>
                  {isToday && (
                    <span
                      style={{
                        backgroundColor: accent,
                        color: "#090A0F",
                        borderRadius: "999px",
                        padding: `${px(5)}px ${px(16)}px`,
                        fontSize: `${px(18)}px`,
                        fontWeight: 900,
                      }}
                    >
                      TODAY
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    ),
    {
      width: preset.width,
      height: preset.height,
    }
  );
}
