// app/api/waitlist/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { normalizeProductSlug, productLabel } from "@/app/lib/products";
import { checkRateLimit, clientIp, hashIp } from "@/app/lib/rateLimit";

/**
 * Rate limiting. This table stores no IP, so a salted hash is used rather than
 * starting to collect raw addresses just to count them.
 */
const WAITLIST_RATE_LIMIT_MAX = 5;
const WAITLIST_RATE_LIMIT_WINDOW_MINUTES = 15;

export const runtime = "nodejs"; // ✅ important for Vercel

type Payload = {
  product?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  company?: string;
  note?: string;
  source?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function safe(text: string) {
  return (text || "").replace(/[<>]/g, "");
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;

    // Normalize so aliases (e.g. "fxcopilot" vs "fxco-pilot") don't create
    // duplicate rows, and so emails can use the canonical display name.
    const product = normalizeProductSlug(body.product);
    const productName = productLabel(product);
    const email = (body.email || "").trim().toLowerCase();
    const fullName = (body.fullName || "").trim();
    const phone = (body.phone || "").trim();
    const company = (body.company || "").trim();
    const note = (body.note || "").trim();
    const source = (body.source || "waitlist_page").trim();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Rate limit before writing anything.
    const ip = clientIp(req.headers);
    const ipHash = ip ? hashIp(ip) : "";

    if (ipHash) {
      const { limited, retryAfterSeconds } = await checkRateLimit({
        table: "waitlist_signups",
        column: "ip_hash",
        value: ipHash,
        max: WAITLIST_RATE_LIMIT_MAX,
        windowMinutes: WAITLIST_RATE_LIMIT_WINDOW_MINUTES,
      });

      if (limited) {
        return NextResponse.json(
          {
            ok: false,
            error: `You have signed up a few times already. Please wait ${WAITLIST_RATE_LIMIT_WINDOW_MINUTES} minutes before trying again.`,
          },
          { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
        );
      }
    }

    // ---- Supabase storage (same as before) ----
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    let stored = false;
    let notified = false;

    if (supabaseUrl && serviceKey) {
      const supabase = createClient(supabaseUrl, serviceKey, {
        auth: { persistSession: false },
      });

      const { error } = await supabase.from("waitlist_signups").upsert(
        [
          {
            product,
            email,
            ip_hash: ipHash || null,
            full_name: fullName || null,
            phone: phone || null,
            company: company || null,
            note: note || null,
            source,
          },
        ],
        { onConflict: "product,email" }
      );

      if (error) {
        // If storage fails, still continue (we can still email you/admin)
        // but tell the client it didn't store.
        stored = false;
      } else {
        stored = true;
      }
    }

    // ---- Resend email notifications ----
    const resendKey = process.env.RESEND_API_KEY;
    const resendFrom = process.env.RESEND_FROM; // e.g. "Solfligh Tech <no-reply@solflightech.com>"
    const adminTo = process.env.RESEND_TO; // your inbox

    // Admin notification (best effort — never block signup)
    if (resendKey && resendFrom && adminTo) {
      const resend = new Resend(resendKey);

      const subject = `New waitlist signup: ${productName}`;
      const html = `
        <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;">
          <h2 style="margin:0 0 12px;">New waitlist signup</h2>
          <table cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
            <tr><td><b>Product</b></td><td>${safe(productName)} <span style="color:#64748b;">(${safe(product)})</span></td></tr>
            <tr><td><b>Email</b></td><td>${safe(email)}</td></tr>
            <tr><td><b>Name</b></td><td>${safe(fullName || "—")}</td></tr>
            <tr><td><b>Phone</b></td><td>${safe(phone || "—")}</td></tr>
            <tr><td><b>Company</b></td><td>${safe(company || "—")}</td></tr>
            <tr><td><b>Source</b></td><td>${safe(source || "—")}</td></tr>
            <tr><td><b>Note</b></td><td>${safe(note || "—")}</td></tr>
            <tr><td><b>Stored</b></td><td>${stored ? "yes" : "no (supabase env missing or error)"}</td></tr>
          </table>
        </div>
      `;

      // Resend reports API-level failures on `error` rather than throwing, so
      // these are inspected rather than assumed to have succeeded. Both sends
      // stay best effort — a mail problem must not cost the signup — but a
      // failure is now visible in the logs instead of disappearing.
      try {
        const { error: adminErr } = await resend.emails.send({
          from: resendFrom,
          to: adminTo,
          subject,
          html,
        });
        if (adminErr) {
          console.error("Waitlist admin notification rejected by Resend:", adminErr);
        } else {
          notified = true;
        }
      } catch (err) {
        console.error("Waitlist admin notification threw:", err);
      }

      // Optional: user confirmation email (also best effort)
      try {
        const { error: confirmErr } = await resend.emails.send({
          from: resendFrom,
          to: email,
          subject: "You're on the waitlist ✅",
          html: `
            <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;">
              <p>Thanks${fullName ? `, ${safe(fullName)}` : ""} — you’re on the waitlist for <b>${safe(productName)}</b>.</p>
              <p>We’ll notify you as soon as early access opens.</p>
              <p style="margin-top:20px;">— Solfligh Tech</p>
            </div>
          `,
        });
        if (confirmErr) {
          console.error("Waitlist confirmation email rejected by Resend:", confirmErr);
        }
      } catch (err) {
        console.error("Waitlist confirmation email threw:", err);
      }
    }

    // If the signup reached neither the database nor an inbox, it is gone.
    // Telling the visitor "You're in" would be untrue, and they would have no
    // reason to try again. Same guard as /api/leads.
    if (!stored && !notified) {
      console.error("Waitlist signup was neither stored nor emailed:", { product, email });
      return NextResponse.json(
        {
          ok: false,
          error:
            "We could not record your signup. Please try again, or reach us through the contact page.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      stored,
      notified,
      message: "You’re in. We’ll notify you as soon as early access opens.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request. Please try again." },
      { status: 400 }
    );
  }
}
