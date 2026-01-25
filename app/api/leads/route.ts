import { Resend } from "resend";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

type LeadPayload = {
  kind: "contact" | "partner" | "investor";
  name: string;
  email: string;
  message: string;
  firm?: string;
  projectSlug?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<LeadPayload>;

    const kind = body.kind;
    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const message = (body.message || "").trim();
    const company = (body.firm || "").trim();
    const projectSlug = (body.projectSlug || "").trim() || null;

    if (!kind || !["contact", "partner", "investor"].includes(kind)) {
      return Response.json({ ok: false, error: "Invalid kind." }, { status: 400 });
    }

    if (!name || name.length < 2) {
      return Response.json({ ok: false, error: "Name is required." }, { status: 400 });
    }

    if (!email || !isValidEmail(email)) {
      return Response.json({ ok: false, error: "Valid email is required." }, { status: 400 });
    }

    if (!message || message.length < 10) {
      return Response.json(
        { ok: false, error: "Message must be at least 10 characters." },
        { status: 400 }
      );
    }

    /* -------------------------------
       1) SAVE TO SUPABASE (FIRST)
    -------------------------------- */
    const { error: insertError } = await supabaseAdmin.from("leads").insert({
      project_slug: projectSlug,
      name,
      email,
      company: company || null,
      message,
      source: kind,
      status: "new",
      contacted_at: null,
      // created_at handled by DB default
    });

    if (insertError) {
      return Response.json(
        { ok: false, error: "Failed to save lead." },
        { status: 500 }
      );
    }

    /* -------------------------------
       2) SEND EMAIL (SECOND)
    -------------------------------- */
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM;
    const to = process.env.RESEND_TO;

    if (!apiKey || !from || !to) {
      return Response.json(
        { ok: false, error: "Email service not configured." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const subjectMap: Record<LeadPayload["kind"], string> = {
      contact: "New Contact Message — SOLFLIGH TECH",
      partner: "New Partnership Request — SOLFLIGH TECH",
      investor: "New Investor Inquiry — SOLFLIGH TECH",
    };

    const subject = subjectMap[kind];

    const text = `
Kind: ${kind.toUpperCase()}
Name: ${name}
Email: ${email}
${company ? `Company: ${company}` : ""}
${projectSlug ? `Project: ${projectSlug}` : ""}

Message:
${message}
`.trim();

    await resend.emails.send({
      from,
      to,
      subject,
      replyTo: email,
      text,
      html: `
        <div style="font-family: system-ui, sans-serif; line-height: 1.6;">
          <h2>${subject}</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          ${company ? `<p><b>Company:</b> ${company}</p>` : ""}
          ${projectSlug ? `<p><b>Project:</b> ${projectSlug}</p>` : ""}
          <hr />
          <pre style="white-space: pre-wrap;">${escapeHtml(message)}</pre>
        </div>
      `,
    });

    /* -------------------------------
       3) SUCCESS RESPONSE
    -------------------------------- */
    return Response.json({ ok: true });
  } catch (e: any) {
    return Response.json(
      { ok: false, error: e?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

/* Minimal safe HTML escaping */
function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
