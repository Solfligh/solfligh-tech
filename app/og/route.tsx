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
    searchParams.get("subtitle") ||
      "Technology · Innovation · Getting you back your time",
    110
  );
  const badge = clampText(searchParams.get("badge") || "SOLFLIGH TECH", 30);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          backgroundColor: "#06121f",
          color: "#ffffff",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* background blobs */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.85,
            background:
              "radial-gradient(800px 400px at 20% 20%, rgba(14,165,233,0.35), transparent 60%), radial-gradient(700px 500px at 85% 35%, rgba(34,197,94,0.18), transparent 65%), radial-gradient(900px 650px at 50% 120%, rgba(99,102,241,0.22), transparent 60%)",
          }}
        />

        {/* top row */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "10px 16px",
              borderRadius: "999px",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 0.2,
              backgroundColor: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.16)",
              backdropFilter: "blur(8px)",
            }}
          >
            {badge}
          </div>

          <div
            style={{
              marginLeft: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              borderRadius: "14px",
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.14)",
            }}
          >
            {/* simple “S” mark */}
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background:
                  "linear-gradient(135deg, rgba(14,165,233,1), rgba(99,102,241,1))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: 18,
              }}
            >
              S
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, opacity: 0.95 }}>
              solflightech.org
            </div>
          </div>
        </div>

        {/* middle */}
        <div style={{ zIndex: 1 }}>
          <div
            style={{
              fontSize: 76,
              lineHeight: 1.05,
              fontWeight: 900,
              letterSpacing: -1,
              maxWidth: 1020,
              marginTop: 10,
              textWrap: "balance" as any,
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
              textWrap: "balance" as any,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* bottom */}
        <div
          style={{
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.14)",
            color: "rgba(255,255,255,0.7)",
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          <div>Technology · Innovation · Automation</div>
          <div style={{ opacity: 0.85 }}>Share preview</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
