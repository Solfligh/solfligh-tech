import { Resend } from "resend";

export const runtime = "nodejs"; // important on Vercel

export async function GET() {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const from = process.env.RESEND_FROM;
  const to = process.env.RESEND_TO;

  if (!from || !to) {
    return Response.json(
      { ok: false, error: "Missing RESEND_FROM or RESEND_TO in Vercel env vars." },
      { status: 500 }
    );
  }

  // This endpoint exists to answer "is Resend working?", so a rejected send
  // must not be reported as ok. Resend puts API-level failures on `error`
  // rather than throwing.
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: "Vercel + Resend working ✅",
    html: "<p>Your Resend setup on Vercel is correct.</p>",
  });

  if (error) {
    console.error("Test email rejected by Resend:", error);
    return Response.json({ ok: false, error }, { status: 502 });
  }

  return Response.json({ ok: true, id: data?.id });
}
