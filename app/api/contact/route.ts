import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

/**
 * Simple in-memory rate limit.
 * OK for small sites. For heavy traffic, replace with Redis/Upstash.
 */
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 min
const RATE_LIMIT_MAX = 5; // 5 requests / window / IP
const ipHits = new Map<string, number[]>();

function getClientIp(req: Request) {
  const xff = req.headers.get("x-forwarded-for");
  return xff ? xff.split(",")[0].trim() : "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const hits = ipHits.get(ip) ?? [];
  const recent = hits.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  ipHits.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX;
}

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY!;
  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);
  if (ip && ip !== "unknown") formData.append("remoteip", ip);

  const resp = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body: formData }
  );
  if (!resp.ok) return false;
  const data = await resp.json();
  return Boolean(data.success);
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json({ ok: false }, { status: 429 });
    }

    const body = await req.json();

    // ✅ subject gehört hierhin (nicht in verifyTurnstile)
    const subject = String(body.subject ?? "").trim();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();
    const honeypot = String(body.company ?? "").trim(); // must be empty
    const turnstileToken = String(body.turnstileToken ?? "").trim();

    if (!name || !email || !message || !turnstileToken) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Honeypot hit -> silently accept (drop)
    if (honeypot) {
      return NextResponse.json({ ok: true });
    }

    const turnstileOk = await verifyTurnstile(turnstileToken, ip);
    if (!turnstileOk) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const to = process.env.CONTACT_TO_EMAIL!;
    const from = process.env.CONTACT_FROM_EMAIL!;

    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: subject
        ? `Website inquiry: ${subject} — ${name}`
        : `Website inquiry: ${name}`,
      text: [
        "New website inquiry",
        "-------------------",
        `Subject: ${subject || "-"}`,
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        "Message:",
        message,
        "",
        `IP: ${ip}`,
        `Time: ${new Date().toISOString()}`,
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
