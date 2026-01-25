// app/og/route.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";

function clampText(input: string, max = 90) {
  const s = (input || "").trim();
  if (!s) return "";
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const title = clampText(searchParams.get("title") || "SOLFLIGH TECH", 70);
  const subtitle = clampText(
    searchParams.get("subtitle") || "Technology · Innovation · Getting you back your time",
    110
  );
  const badge = clampText(searchParams.get("badge") || "SOLFLIGH TECH", 30);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          backgroundColor: "#0f172a",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
        }}
      >
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              padding: "10px 16px",
              borderRadius: 999,
              fontSize: 20,
              fontWeight: 700,
              backgroundColor: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            {badge}
          </div>

          <div style={{ marginLeft: "auto", fontSize: 18, fontWeight: 700, opacity: 0.9 }}>
            solflightech.org
          </div>
        </div>

        {/* Middle */}
        <div>
          <div
            style={{
              fontSize: 76,
              lineHeight: 1.05,
              fontWeight: 900,
              maxWidth: 1020,
            }}
          >
            {title}
          </div>

          <div
            style={{
              marginTop: 22,
              fontSize: 30,
              lineHeight: 1.25,
              fontWeight: 600,
              color: "rgba(255,255,255,0.82)",
              maxWidth: 1020,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.18)",
            fontSize: 20,
            fontWeight: 600,
            color: "rgba(255,255,255,0.70)",
          }}
        >
          <div>Technology · Innovation · Automation</div>
          <div>Share preview</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
