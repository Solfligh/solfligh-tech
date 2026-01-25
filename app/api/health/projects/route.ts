// app/api/health/projects/route.ts
import { NextResponse } from "next/server";
import { getProjectsHealth } from "@/app/lib/projectStore";

export const runtime = "nodejs";

export async function GET() {
  try {
    const health = await getProjectsHealth();

    return NextResponse.json(
      {
        ok: true,
        health,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        error: e?.message || String(e),
      },
      { status: 500 }
    );
  }
}
