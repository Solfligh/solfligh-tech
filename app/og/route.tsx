// app/og/route.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          color: "#ffffff",
          fontSize: 64,
          fontWeight: 800,
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
        }}
      >
        SOLFLIGH TECH
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
