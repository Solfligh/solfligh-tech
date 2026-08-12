import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { getPendingComments } from "@/app/lib/commentsStore";
import { requireAdmin } from "@/app/api/admin/_auth";
import { SITE_URL } from "@/app/lib/site";

/**
 * Daily digest of comments awaiting moderation.
 *
 * Replaces the per-comment email. Approve-first moderation means a comment is
 * invisible until someone acts on it, so the point of this is to make sure
 * "someone acts on it" actually happens without an email per submission.
 *
 * Sends nothing when the queue is empty, so a quiet week produces no mail.
 *
 * Triggered by the Vercel cron entry in vercel.json. Vercel sends
 * Authorization: Bearer <CRON_SECRET>. A valid admin token is also accepted,
 * so the digest can be sent on demand while testing.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";


function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/**
 * An open cron endpoint is a way to spam the inbox, so this fails closed: with
 * no CRON_SECRET configured, only a valid admin token gets in.
 */
async function authorize(req: Request): Promise<boolean> {
  const header = (req.headers.get("authorization") || "").trim();
  const bearer = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
  const secret = (process.env.CRON_SECRET || "").trim();

  if (secret && bearer && safeEqual(bearer, secret)) return true;

  const auth = await requireAdmin(req);
  return auth.ok;
}

function hoursWaiting(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "";
  const hours = Math.floor((Date.now() - then) / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export async function GET(req: Request) {
  if (!(await authorize(req))) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let pending;
  try {
    pending = await getPendingComments();
  } catch (err) {
    console.error("Comment digest could not read pending comments:", err);
    return NextResponse.json(
      { ok: false, error: "Could not read pending comments." },
      { status: 503 }
    );
  }

  if (pending.length === 0) {
    return NextResponse.json({ ok: true, pending: 0, sent: false });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.RESEND_TO;

  if (!apiKey || !from || !to) {
    // Loud, because the digest replaced the per-comment email: silence here
    // would mean no notification at all.
    console.error("Comment digest cannot send: RESEND_* is not configured.");
    return NextResponse.json(
      { ok: false, pending: pending.length, sent: false, error: "Email is not configured." },
      { status: 500 }
    );
  }

  const rows = pending
    .map(
      (c) => `
        <tr>
          <td style="padding:10px 12px;border-top:1px solid #e2e8f0;vertical-align:top;">
            <div style="font-weight:600;color:#0f172a;">${escapeHtml(c.authorName)}</div>
            <div style="font-size:12px;color:#64748b;">
              ${escapeHtml(c.postSlug)} &middot; ${escapeHtml(hoursWaiting(c.createdAt))}
            </div>
            <div style="margin-top:6px;color:#334155;white-space:pre-wrap;">${escapeHtml(
              c.content.length > 400 ? `${c.content.slice(0, 400)}…` : c.content
            )}</div>
          </td>
        </tr>`
    )
    .join("");

  const count = pending.length;
  const subject = `${count} comment${count === 1 ? "" : "s"} awaiting review`;

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html: `
        <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; max-width:640px;">
          <h2 style="margin:0 0 4px;">${count} comment${count === 1 ? "" : "s"} awaiting review</h2>
          <p style="margin:0 0 16px;color:#475569;">
            None of these are visible on the site until approved.
          </p>
          <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;">
            ${rows}
          </table>
          <p style="margin:20px 0 0;">
            <a href="${SITE_URL}/admin/blog"
               style="display:inline-block;background:#0284c7;color:#fff;padding:10px 16px;border-radius:9999px;text-decoration:none;font-weight:600;">
              Review them
            </a>
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Comment digest rejected by Resend:", error);
      return NextResponse.json(
        { ok: false, pending: count, sent: false, error: "Send rejected." },
        { status: 502 }
      );
    }

    console.log(`Comment digest sent for ${count} pending comment(s), id: ${data?.id}`);
    return NextResponse.json({ ok: true, pending: count, sent: true });
  } catch (err) {
    console.error("Comment digest send threw:", err);
    return NextResponse.json(
      { ok: false, pending: count, sent: false, error: "Send failed." },
      { status: 502 }
    );
  }
}
