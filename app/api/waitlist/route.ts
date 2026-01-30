// app/api/waitlist/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      // Keep UX smooth; still confirm signup to the user.
      return NextResponse.json({
        ok: true,
        stored: false,
        message:
          "You’re on the waitlist. (Storage not configured yet — add SUPABASE_SERVICE_ROLE_KEY in Vercel.)",
      });
    }

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
      return NextResponse.json(
        { ok: false, error: "Could not save your request. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      stored: true,
      message: "You’re in. We’ll notify you as soon as early access opens.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request. Please try again." },
      { status: 400 }
    );
  }
}
