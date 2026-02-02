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

  const data = await resend.emails.send({
    from,
    to,
    subject: "Vercel + Resend working ✅",
    html: "<p>Your Resend setup on Vercel is correct.</p>",
  });

  return Response.json({ ok: true, data });
}
