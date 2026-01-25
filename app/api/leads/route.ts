// app/api/leads/route.ts
import { Resend } from "resend";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export const runtime = "nodejs";

type WebsiteLeadPayload = {
  kind: "contact" | "partner" | "investor";
  name: string;
  email: string;
  message: string;
  firm?: string;
};

type ProjectLeadPayload = {
  projectSlug: string;
  name: string;
  email: string;
  message?: string;
  company?: string;
  source?: string; // "projects_page" | "project_detail"
  website?: string; // honeypot
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function json(status: number, body: any) {
  return Response.json(body, { status });
}

function getIp(req: Request) {
  const xff = req.headers.get("x-forwarded-for") || "";
  const first = xff.split(",")[0]?.trim();
  return first || req.headers.get("x-real-ip") || "";
}

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.RESEND_TO;

  if (!apiKey || !from || !to) {
    return {
      ok: false as const,
      error: "Server email settings missing (RESEND_API_KEY/RESEND_FROM/RESEND_TO).",
    };
  }
  return { ok: true as const, apiKey, from, to };
}

function looksLikeProjectLead(body: any): body is Partial<ProjectLeadPayload> {
  return typeof body?.projectSlug === "string" && body.projectSlug.trim().length > 0;
}

function looksLikeWebsiteLead(body: any): body is Partial<WebsiteLeadPayload> {
  return typeof body?.kind === "string" && ["contact", "partner", "investor"].includes(body.kind);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as any;
    if (!body) return json(400, { ok: false, error: "Invalid JSON body." });

    // Honeypot
    if (typeof body.website === "string" && body.website.trim()) {
      return json(200, { ok: true });
    }

    const ip = getIp(req);
    const userAgent = req.headers.get("user-agent") || "";

    /* ============================================================
       CASE A — PROJECT LEAD
    ============================================================ */
    if (looksLikeProjectLead(body)) {
      const projectSlug = String(body.projectSlug).trim().toLowerCase();
      const name = String(body.name || "").trim();
      const email = String(body.email || "").trim().toLowerCase();
      const company = String(body.company || "").trim();
      const message = String(body.message || "").trim();
      const source = String(body.source || "").trim();

      if (!name || name.length < 2) return json(400, { ok: false, error: "Name is required." });
      if (!email || !isValidEmail(email)) return json(400, { ok: false, error: "Valid email is required." });
      if (message.length > 2000) return json(400, { ok: false, error: "Message is too long." });

      // ✅ FIX: always set status + created_at
      const { error: dbErr } = await supabaseAdmin.from("leads").insert({
        project_slug: projectSlug,
        name,
        email,
        company: company || null,
        message: message || null,
        source: source || "projects",
        status: "new",
        contacted_at: null,
        ip: ip || null,
        user_agent: userAgent || null,
        created_at: new Date().toISOString(),
      });

      if (dbErr) return json(500, { ok: false, error: dbErr.message });

      const cfg = getResendConfig();
      if (cfg.ok) {
        const resend = new Resend(cfg.apiKey);
        const subject = `New Waitlist / Demo Request — ${projectSlug}`;

        try {
          await resend.emails.send({
            from: cfg.from,
            to: cfg.to,
            subject,
            replyTo: email,
            text: `Project: ${projectSlug}\nName: ${name}\nEmail: ${email}\n\n${message || ""}`,
          });
        } catch {}
      }

      return json(200, { ok: true });
    }

    /* ============================================================
       CASE B — WEBSITE LEAD
    ============================================================ */
    if (looksLikeWebsiteLead(body)) {
      const kind = body.kind as WebsiteLeadPayload["kind"];
      const name = String(body.name || "").trim();
      const email = String(body.email || "").trim().toLowerCase();
      const message = String(body.message || "").trim();
      const firm = String(body.firm || "").trim();

      if (!name || name.length < 2) return json(400, { ok: false, error: "Name is required." });
      if (!email || !isValidEmail(email)) return json(400, { ok: false, error: "Valid email is required." });
      if (!message || message.length < 10) return json(400, { ok: false, error: "Message too short." });

      const cfg = getResendConfig();
      if (!cfg.ok) return json(500, { ok: false, error: cfg.error });

      const resend = new Resend(cfg.apiKey);

      await resend.emails.send({
        from: cfg.from,
        to: cfg.to,
        subject: `New ${kind.toUpperCase()} Lead — SOLFLIGH TECH`,
        replyTo: email,
        text: message,
      });

      // ✅ FIX: clean storage for admin UI
      await supabaseAdmin.from("leads").insert({
        project_slug: null,
        name,
        email,
        company: firm || null,
        message,
        source: kind,
        status: "new",
        contacted_at: null,
        ip: ip || null,
        user_agent: userAgent || null,
        created_at: new Date().toISOString(),
      });

      return json(200, { ok: true });
    }

    return json(400, { ok: false, error: "Invalid payload." });
  } catch (e: any) {
    return json(500, { ok: false, error: e?.message || "Unknown error" });
  }
}

// minimal safe HTML escaping
function escapeHtml(input: string) {
  return String(input || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
