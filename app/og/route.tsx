// app/og/route.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";

function safeText(v: string | null, fallback: string) {
  const s = (v ?? "").trim();
  return s.length ? s : fallback;
}

function clamp(s: string, max: number) {
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sp = url.searchParams;

  const title = clamp(safeText(sp.get("title"), "SOLFLIGH TECH"), 60);
  const subtitle = clamp(
    safeText(sp.get("subtitle"), "Technology · Innovation · Getting you back your time"),
    90
  );
  const badge = clamp(safeText(sp.get("badge"), "SOLFLIGH TECH"), 30);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0f172a",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
          paddingTop: 60,
          paddingRight: 60,
          paddingBottom: 60,
          paddingLeft: 60,
        }}
      >
        <div style={{ fontSize: 26, fontWeight: 700 }}>{badge}</div>

        <div style={{ height: 36 }} />

        <div style={{ fontSize: 74, fontWeight: 900 }}>{title}</div>

        <div style={{ height: 20 }} />

        <div style={{ fontSize: 34, fontWeight: 600 }}>{subtitle}</div>

        <div style={{ flex: 1 }} />

        <div style={{ fontSize: 20, fontWeight: 600 }}>solflightech.org</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
