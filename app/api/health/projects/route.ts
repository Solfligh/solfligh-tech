// app/api/health/projects/route.ts
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabaseEnabled =
      !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseEnabled) {
      return Response.json({
        ok: true,
        source: "json",
        supabaseEnabled: false,
        health: { ok: true },
        counts: { totalProjects: 0, publishedProjects: 0, mediaRows: 0 },
      });
    }

    // counts
    const { count: totalProjects, error: totalErr } = await supabaseAdmin
      .from("projects")
      .select("*", { count: "exact", head: true });

    if (totalErr) throw totalErr;

    const { count: publishedProjects, error: pubErr } = await supabaseAdmin
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("published", true);

    if (pubErr) throw pubErr;

    const { count: mediaRows, error: mediaErr } = await supabaseAdmin
      .from("project_media")
      .select("*", { count: "exact", head: true });

    if (mediaErr) throw mediaErr;

    return Response.json({
      ok: true,
      source: "supabase",
      supabaseEnabled: true,
      health: { ok: true },
      counts: {
        totalProjects: totalProjects ?? 0,
        publishedProjects: publishedProjects ?? 0,
        mediaRows: mediaRows ?? 0,
      },
    });
  } catch (e: any) {
    return Response.json(
      { ok: false, error: e?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
