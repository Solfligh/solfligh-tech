import { Resend } from "resend";

type LeadPayload = {
  kind: "contact" | "partner" | "investor";
  name: string;
  email: string;
  message: string;
  firm?: string;
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
    const firm = (body.firm || "").trim();

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
      return Response.json({ ok: false, error: "Message must be at least 10 characters." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM;
    const to = process.env.RESEND_TO;

    if (!apiKey || !from || !to) {
      return Response.json(
        { ok: false, error: "Server email settings missing (RESEND_API_KEY/RESEND_FROM/RESEND_TO)." },
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

    const textLines = [
      `Kind: ${kind.toUpperCase()}`,
      `Name: ${name}`,
      `Email: ${email}`,
      firm ? `Firm/Organization: ${firm}` : null,
      "",
      "Message:",
      message,
      "",
      "— Sent from solfligh-tech website",
    ].filter(Boolean);

    const html = `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height: 1.6;">
        <h2 style="margin:0 0 12px 0;">${subject}</h2>
        <div style="margin:0 0 10px 0;"><b>Kind:</b> ${kind.toUpperCase()}</div>
        <div style="margin:0 0 6px 0;"><b>Name:</b> ${name}</div>
        <div style="margin:0 0 6px 0;"><b>Email:</b> ${email}</div>
        ${firm ? `<div style="margin:0 0 6px 0;"><b>Firm/Organization:</b> ${firm}</div>` : ""}
        <hr style="margin:16px 0; border:none; border-top:1px solid #e2e8f0;" />
        <div style="white-space:pre-wrap;"><b>Message:</b>\n${escapeHtml(message)}</div>
        <p style="margin-top:16px; font-size:12px; color:#64748b;">Sent from solfligh-tech website</p>
      </div>
    `;

    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      replyTo: email, // when you hit reply, it replies to the sender
      text: textLines.join("\n"),
      html,
    });

    if (error) {
      return Response.json({ ok: false, error: error.message }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (e: any) {
    return Response.json({ ok: false, error: e?.message || "Unknown error" }, { status: 500 });
  }
}

// minimal safe HTML escaping
function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
