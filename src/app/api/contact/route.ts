import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface Body {
  email?: string;
  message?: string;
  website?: string; // honeypot — real users never fill this
}

/**
 * Contact form delivery. Sends via Resend if configured, else forwards to a
 * Formspree endpoint, else reports "not configured". The destination inbox is a
 * server-side env var — no email address is ever exposed on the site.
 */
export async function POST(req: Request): Promise<Response> {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  if (body.website) return NextResponse.json({ ok: true }); // honeypot tripped → drop silently
  const message = String(body.message ?? "").trim().slice(0, 5000);
  const email = String(body.email ?? "").trim().slice(0, 200);
  if (message.length < 2) {
    return NextResponse.json({ error: "Please enter a message." }, { status: 400 });
  }
  const text = `From: ${email || "(no email provided)"}\n\n${message}`;

  const RESEND_KEY = process.env.RESEND_API_KEY;
  const TO = process.env.CONTACT_TO_EMAIL;
  const FROM = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";
  const FORMSPREE = process.env.FORMSPREE_ENDPOINT;

  try {
    if (RESEND_KEY && TO) {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: FROM,
          to: TO,
          subject: "blankand0 — contact form",
          text,
          ...(email ? { reply_to: email } : {}),
        }),
      });
      if (!r.ok) throw new Error(`resend ${r.status}`);
      return NextResponse.json({ ok: true });
    }
    if (FORMSPREE) {
      const r = await fetch(FORMSPREE, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, message }),
      });
      if (!r.ok) throw new Error(`formspree ${r.status}`);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Contact isn't set up yet." }, { status: 503 });
  } catch {
    return NextResponse.json({ error: "Couldn't send right now — try again later." }, { status: 502 });
  }
}
