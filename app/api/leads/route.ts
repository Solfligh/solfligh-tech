// app/api/leads/route.ts
import { Resend } from "resend";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { checkRateLimit, hashIp } from "@/app/lib/rateLimit";
import { coarseUserAgent } from "@/app/lib/userAgent";

export const runtime = "nodejs";

/**
 * Rate limiting.
 *
 * Deliberately more permissive than comments: a blocked lead is a lost
 * customer, so the limit only stops obvious flooding.
 *
 * Counting is keyed on a salted hash of the submitter's IP. This route used to
 * store the raw address on public.leads alongside the name, email, and message
 * body; that column has been backfilled to hashes and dropped, so the raw value
 * now exists only for the lifetime of the request.
 */
const LEAD_RATE_LIMIT_MAX = 5;
const LEAD_RATE_LIMIT_WINDOW_MINUTES = 15;

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

    // The raw address is used only to derive the hash and is never stored.
    const ip = getIp(req);
    const ipHash = ip ? hashIp(ip) : "";
    // Coarsened to "browser on OS" before it is stored. The full string is a
    // fingerprint and is not needed on a lead record.
    const userAgent = coarseUserAgent(req.headers.get("user-agent"));

    // Applies to both branches below, and runs before anything is written.
    if (ipHash) {
      const { limited, retryAfterSeconds } = await checkRateLimit({
        table: "leads",
        column: "ip_hash",
        value: ipHash,
        max: LEAD_RATE_LIMIT_MAX,
        windowMinutes: LEAD_RATE_LIMIT_WINDOW_MINUTES,
      });

      if (limited) {
        return new Response(
          JSON.stringify({
            ok: false,
            error: `You have sent a few messages already. Please wait ${LEAD_RATE_LIMIT_WINDOW_MINUTES} minutes before sending another, or email us directly.`,
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": String(retryAfterSeconds),
            },
          }
        );
      }
    }

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

      // Persist the lead. A storage failure must NOT prevent the
      // notification email below: previously this returned 500 here,
      // which silently dropped the lead entirely whenever the database
      // was unreachable (as it was for months while the old Supabase
      // project was paused). Email is the durable fallback.
      let stored = true;
      try {
        const { error: dbErr } = await supabaseAdmin.from("leads").insert({
          project_slug: projectSlug,
          name,
          email,
          company: company || null,
          message: message || null,
          source: source || "projects",
          status: "new",
          contacted_at: null,
          ip_hash: ipHash || null,
          user_agent: userAgent || null,
          created_at: new Date().toISOString(),
        });
        if (dbErr) stored = false;
      } catch {
        stored = false;
      }

      let notified = false;
      const cfg = getResendConfig();
      if (cfg.ok) {
        const resend = new Resend(cfg.apiKey);
        const subject = `New Waitlist / Demo Request — ${projectSlug}`;

        try {
          const { error: sendErr } = await resend.emails.send({
            from: cfg.from,
            to: cfg.to,
            subject,
            replyTo: email,
            text: `Project: ${projectSlug}\nName: ${name}\nEmail: ${email}\nStored in DB: ${
              stored ? "yes" : "NO — database write failed, this email is the only record"
            }\n\n${message || ""}`,
          });

          if (sendErr) {
            console.error("Project lead notification rejected by Resend:", sendErr);
          } else {
            notified = true;
          }
        } catch (err) {
          console.error("Project lead notification threw:", err);
        }
      }

      // Same guard as the website-lead branch: only fail if the lead reached
      // neither the database nor an inbox. Previously this returned ok
      // unconditionally, so a lead could be lost with the visitor told it
      // succeeded.
      if (!stored && !notified) {
        return json(500, {
          ok: false,
          error: "We could not record your request. Please email us directly.",
        });
      }

      return json(200, { ok: true, stored, notified });
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

      // Store first. Neither a database failure nor a missing/broken
      // email configuration may cause a captured lead to be discarded.
      let stored = true;
      try {
        const { error: dbErr } = await supabaseAdmin.from("leads").insert({
          project_slug: null,
          name,
          email,
          company: firm || null,
          message,
          source: kind,
          status: "new",
          contacted_at: null,
          ip_hash: ipHash || null,
          user_agent: userAgent || null,
          created_at: new Date().toISOString(),
        });
        if (dbErr) stored = false;
      } catch {
        stored = false;
      }

      // Notify by email. Previously a missing RESEND_* config returned
      // 500 here BEFORE anything was stored, so the lead was lost
      // entirely; and an unwrapped send() would throw on any Resend
      // outage with the same result.
      let notified = false;
      const cfg = getResendConfig();
      if (cfg.ok) {
        try {
          const resend = new Resend(cfg.apiKey);
          // Resend reports API-level failures on `error` rather than throwing.
          // Setting notified = true without checking it would defeat the
          // both-channels-failed guard below and lose the lead silently.
          const { error: sendErr } = await resend.emails.send({
            from: cfg.from,
            to: cfg.to,
            subject: `New ${kind.toUpperCase()} Lead — SOLFLIGH TECH`,
            replyTo: email,
            text: `Name: ${name}\nEmail: ${email}${
              firm ? `\nFirm: ${firm}` : ""
            }\nStored in DB: ${stored ? "yes" : "NO — this email is the only record"}\n\n${message}`,
          });

          if (sendErr) {
            console.error("Lead notification rejected by Resend:", sendErr);
            notified = false;
          } else {
            notified = true;
          }
        } catch (err) {
          console.error("Lead notification threw:", err);
          notified = false;
        }
      }

      // Only fail the request if BOTH channels failed — otherwise the
      // lead is safely recorded somewhere and the visitor should see
      // success.
      if (!stored && !notified) {
        return json(500, {
          ok: false,
          error: "We could not record your message. Please email us directly.",
        });
      }

      return json(200, { ok: true, stored, notified });
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
