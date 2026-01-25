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
    return { ok: false as const, error: "Server email settings missing (RESEND_API_KEY/RESEND_FROM/RESEND_TO)." };
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

    // ✅ Honeypot (bots fill hidden fields)
    if (typeof body.website === "string" && body.website.trim()) {
      return json(200, { ok: true });
    }

    const ip = getIp(req);
    const userAgent = req.headers.get("user-agent") || "";

    // ------------------------------------------------------------------
    // ✅ Case A: Project waitlist/demo lead
    // Payload: { projectSlug, name, email, company?, message?, source? }
    // ------------------------------------------------------------------
    if (looksLikeProjectLead(body)) {
      const projectSlug = String(body.projectSlug || "").trim().toLowerCase();
      const name = String(body.name || "").trim();
      const email = String(body.email || "").trim().toLowerCase();
      const company = String(body.company || "").trim();
      const message = String(body.message || "").trim();
      const source = String(body.source || "").trim();

      if (!projectSlug) return json(400, { ok: false, error: "projectSlug is required." });
      if (!name || name.length < 2) return json(400, { ok: false, error: "Name is required." });
      if (!email || !isValidEmail(email)) return json(400, { ok: false, error: "Valid email is required." });
      if (message.length > 2000) return json(400, { ok: false, error: "Message is too long." });

      // Save to Supabase (SERVICE ROLE bypasses RLS)
      const { error: dbErr } = await supabaseAdmin.from("leads").insert({
        project_slug: projectSlug,
        name,
        email,
        company: company || null,
        message: message || null,
        source: source || "projects",
        ip: ip || null,
        user_agent: userAgent || null,
      });

      if (dbErr) return json(500, { ok: false, error: dbErr.message });

      // Optional email notify (only if env is configured)
      const cfg = getResendConfig();
      if (cfg.ok) {
        const resend = new Resend(cfg.apiKey);
        const subject = `New Waitlist / Demo Request — ${projectSlug}`;

        const textLines = [
          `Type: PROJECT WAITLIST`,
          `Project: ${projectSlug}`,
          `Name: ${name}`,
          `Email: ${email}`,
          company ? `Company: ${company}` : null,
          source ? `Source: ${source}` : null,
          ip ? `IP: ${ip}` : null,
          "",
          "Message:",
          message || "(no message)",
          "",
          "— Sent from solfligh-tech website",
        ].filter(Boolean);

        const html = `
          <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height: 1.6;">
            <h2 style="margin:0 0 12px 0;">${escapeHtml(subject)}</h2>
            <div style="margin:0 0 6px 0;"><b>Project:</b> ${escapeHtml(projectSlug)}</div>
            <div style="margin:0 0 6px 0;"><b>Name:</b> ${escapeHtml(name)}</div>
            <div style="margin:0 0 6px 0;"><b>Email:</b> ${escapeHtml(email)}</div>
            ${company ? `<div style="margin:0 0 6px 0;"><b>Company:</b> ${escapeHtml(company)}</div>` : ""}
            ${source ? `<div style="margin:0 0 6px 0;"><b>Source:</b> ${escapeHtml(source)}</div>` : ""}
            <hr style="margin:16px 0; border:none; border-top:1px solid #e2e8f0;" />
            <div style="white-space:pre-wrap;"><b>Message:</b>\n${escapeHtml(message || "(no message)")}</div>
            <p style="margin-top:16px; font-size:12px; color:#64748b;">Sent from solfligh-tech website</p>
          </div>
        `;

        // Don't fail the request if email fails — DB already saved
        try {
          await resend.emails.send({
            from: cfg.from,
            to: cfg.to,
            subject,
            replyTo: email,
            text: textLines.join("\n"),
            html,
          });
        } catch {}
      }

      return json(200, { ok: true });
    }

    // ------------------------------------------------------------------
    // ✅ Case B: Existing website lead (contact/partner/investor)
    // Payload: { kind, name, email, message, firm? }
    // ------------------------------------------------------------------
    if (looksLikeWebsiteLead(body)) {
      const kind = body.kind as WebsiteLeadPayload["kind"];
      const name = String(body.name || "").trim();
      const email = String(body.email || "").trim().toLowerCase();
      const message = String(body.message || "").trim();
      const firm = String(body.firm || "").trim();

      if (!name || name.length < 2) {
        return json(400, { ok: false, error: "Name is required." });
      }
      if (!email || !isValidEmail(email)) {
        return json(400, { ok: false, error: "Valid email is required." });
      }
      if (!message || message.length < 10) {
        return json(400, { ok: false, error: "Message must be at least 10 characters." });
      }

      const cfg = getResendConfig();
      if (!cfg.ok) return json(500, { ok: false, error: cfg.error });

      const resend = new Resend(cfg.apiKey);

      const subjectMap: Record<WebsiteLeadPayload["kind"], string> = {
        contact: "New Contact Message — SOLFLIGH TECH",
        partner: "New Partnership Request — SOLFLIGH TECH",
        investor: "New Investor Inquiry — SOLFLIGH TECH",
      };

      const subject = subjectMap[kind];

      const textLines = [
        `Kind: ${kind.toUpperCase()}`,
        `Name: ${name}`,
        `Email: ${email}`,
        firm ? `Firm/Organization: ${firm}` : null,
        ip ? `IP: ${ip}` : null,
        "",
        "Message:",
        message,
        "",
        "— Sent from solfligh-tech website",
      ].filter(Boolean);

      const html = `
        <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height: 1.6;">
          <h2 style="margin:0 0 12px 0;">${escapeHtml(subject)}</h2>
          <div style="margin:0 0 10px 0;"><b>Kind:</b> ${escapeHtml(kind.toUpperCase())}</div>
          <div style="margin:0 0 6px 0;"><b>Name:</b> ${escapeHtml(name)}</div>
          <div style="margin:0 0 6px 0;"><b>Email:</b> ${escapeHtml(email)}</div>
          ${firm ? `<div style="margin:0 0 6px 0;"><b>Firm/Organization:</b> ${escapeHtml(firm)}</div>` : ""}
          <hr style="margin:16px 0; border:none; border-top:1px solid #e2e8f0;" />
          <div style="white-space:pre-wrap;"><b>Message:</b>\n${escapeHtml(message)}</div>
          <p style="margin-top:16px; font-size:12px; color:#64748b;">Sent from solfligh-tech website</p>
        </div>
      `;

      const { error } = await resend.emails.send({
        from: cfg.from,
        to: cfg.to,
        subject,
        replyTo: email,
        text: textLines.join("\n"),
        html,
      });

      if (error) {
        return json(500, { ok: false, error: error.message });
      }

      // Optional: also store these in Supabase leads table (as a generic lead)
      // (If leads table doesn't exist yet, this can throw — so we swallow errors.)
      try {
        await supabaseAdmin.from("leads").insert({
          project_slug: kind, // store under "contact/partner/investor"
          name,
          email,
          company: firm || null,
          message,
          source: "website",
          ip: ip || null,
          user_agent: userAgent || null,
        });
      } catch {}

      return json(200, { ok: true });
    }

    // ------------------------------------------------------------------
    // Unknown payload
    // ------------------------------------------------------------------
    return json(400, {
      ok: false,
      error:
        "Invalid payload. Expected either { kind, name, email, message } or { projectSlug, name, email }.",
    });
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
