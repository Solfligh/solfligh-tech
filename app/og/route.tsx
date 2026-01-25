// app/og/route.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png"; // ✅ REQUIRED

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
    searchParams.get("subtitle") ||
      "Technology · Innovation · Getting you back your time",
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
          backgroundColor: "#06121f",
          color: "#ffffff",
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Arial",
          position: "relative",
        }}
      >
        {/* background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(800px 400px at 20% 20%, rgba(14,165,233,0.35), transparent 60%), radial-gradient(700px 500px at 85% 35%, rgba(34,197,94,0.18), transparent 65%), radial-gradient(900px 650px at 50% 120%, rgba(99,102,241,0.22), transparent 60%)",
          }}
        />

        {/* header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, zIndex: 1 }}>
          <div
            style={{
              padding: "10px 16px",
              borderRadius: 999,
              fontSize: 20,
              fontWeight: 700,
              backgroundColor: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {badge}
          </div>

          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              borderRadius: 14,
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "linear-gradient(135deg,#0ea5e9,#6366f1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: 18,
              }}
            >
              S
            </div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              solflightech.org
            </div>
          </div>
        </div>

        {/* content */}
        <div style={{ zIndex: 1 }}>
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
              color: "rgba(255,255,255,0.85)",
              maxWidth: 1020,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* footer */}
        <div
          style={{
            zIndex: 1,
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.2)",
            fontSize: 20,
            fontWeight: 600,
            color: "rgba(255,255,255,0.75)",
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
