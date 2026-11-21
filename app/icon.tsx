import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          background:
            "linear-gradient(135deg, #211008 0%, #311709 50%, #090A0F 100%)",
          border: "1.5px solid rgba(251, 191, 36, 0.55)",
          color: "#FBBF24",
          fontSize: "16px",
          fontWeight: 800,
          fontFamily: "sans-serif",
          letterSpacing: "-0.04em",
        }}
      >
        T-
      </div>
    ),
    {
      ...size,
    }
  );
}
