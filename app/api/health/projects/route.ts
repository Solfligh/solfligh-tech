// app/api/health/projects/route.ts
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export const runtime = "nodejs";

function json(status: number, body: any) {
  return Response.json(body, { status });
}

export async function GET() {
  try {
    const supabaseEnabled =
      !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseEnabled) {
      return json(200, {
        ok: true,
        health: {
          ok: true,
          source: "json",
          supabaseEnabled: false,
          counts: { totalProjects: 0, publishedProjects: 0, mediaRows: 0 },
        },
      });
    }

    // Count projects
    const { count: totalProjects, error: totalErr } = await supabaseAdmin
      .from("projects")
      .select("id", { count: "exact", head: true });

    if (totalErr) return json(500, { ok: false, error: totalErr.message });

    // Count published projects
    const { count: publishedProjects, error: pubErr } = await supabaseAdmin
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("published", true);

    if (pubErr) return json(500, { ok: false, error: pubErr.message });

    // Count media rows
    const { count: mediaRows, error: mediaErr } = await supabaseAdmin
      .from("project_media")
      .select("id", { count: "exact", head: true });

    if (mediaErr) return json(500, { ok: false, error: mediaErr.message });

    return json(200, {
      ok: true,
      health: {
        ok: true,
        source: "supabase",
        supabaseEnabled: true,
        counts: {
          totalProjects: totalProjects ?? 0,
          publishedProjects: publishedProjects ?? 0,
          mediaRows: mediaRows ?? 0,
        },
      },
    });
  } catch (e: any) {
    return json(500, { ok: false, error: e?.message || "Unknown error" });
  }
}
