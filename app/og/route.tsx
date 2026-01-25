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
          backgroundColor: "#0f172a",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
          paddingTop: 64,
          paddingRight: 64,
          paddingBottom: 64,
          paddingLeft: 64,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.10)",
              borderColor: "rgba(255,255,255,0.18)",
              borderWidth: 1,
              borderRadius: 999,
              paddingTop: 10,
              paddingRight: 16,
              paddingBottom: 10,
              paddingLeft: 16,
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            {badge}
          </div>

          <div
            style={{
              marginLeft: "auto",
              fontSize: 18,
              fontWeight: 700,
              color: "rgba(255,255,255,0.90)",
            }}
          >
            solflightech.org
          </div>
        </div>

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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderColor: "rgba(255,255,255,0.18)",
            borderTopWidth: 1,
            paddingTop: 24,
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
