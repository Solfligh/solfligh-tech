// app/api/waitlist/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

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

    const product = (body.product || "profitpilot").trim().toLowerCase();
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

    // ---- Supabase storage (same as before) ----
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    let stored = false;

    if (supabaseUrl && serviceKey) {
      const supabase = createClient(supabaseUrl, serviceKey, {
        auth: { persistSession: false },
      });

      const { error } = await supabase.from("waitlist_signups").upsert(
        [
          {
            product,
            email,
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

      const subject = `New waitlist signup: ${product}`;
      const html = `
        <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;">
          <h2 style="margin:0 0 12px;">New waitlist signup</h2>
          <table cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
            <tr><td><b>Product</b></td><td>${safe(product)}</td></tr>
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

      try {
        await resend.emails.send({
          from: resendFrom,
          to: adminTo,
          subject,
          html,
        });
      } catch {
        // swallow errors to keep UX smooth
      }

      // Optional: user confirmation email (also best effort)
      try {
        await resend.emails.send({
          from: resendFrom,
          to: email,
          subject: "You're on the waitlist ✅",
          html: `
            <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;">
              <p>Thanks${fullName ? `, ${safe(fullName)}` : ""} — you’re on the waitlist for <b>${safe(product)}</b>.</p>
              <p>We’ll notify you as soon as early access opens.</p>
              <p style="margin-top:20px;">— Solfligh Tech</p>
            </div>
          `,
        });
      } catch {
        // ignore
      }
    }

    // Always respond success for a smooth user experience
    return NextResponse.json({
      ok: true,
      stored,
      message: "You’re in. We’ll notify you as soon as early access opens.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request. Please try again." },
      { status: 400 }
    );
  }
}
