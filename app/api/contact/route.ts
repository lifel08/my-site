import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

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
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: false as const, error: "missing_turnstile_secret" };

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);
  if (ip && ip !== "unknown") formData.append("remoteip", ip);

  const resp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: formData,
  });

  if (!resp.ok) return { ok: false as const, error: "turnstile_verify_http_error" };

  const data = await resp.json();

  if (!data?.success) {
    const codes = Array.isArray(data?.["error-codes"]) ? data["error-codes"].join(",") : "unknown";
    return { ok: false as const, error: `turnstile_failed:${codes}`, raw: data };
  }

  return { ok: true as const, raw: data };
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    if (isRateLimited(ip)) {
      return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
    }

    const subject = String(body.subject ?? "").trim();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();
    const honeypot = String(body.company ?? "").trim();
    const turnstileToken = String(body.turnstileToken ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
    }

    // Honeypot hit -> silently accept (drop)
    if (honeypot) {
      return NextResponse.json({ ok: true, dropped: true }, { status: 200 });
    }

    if (!turnstileToken) {
      return NextResponse.json({ ok: false, error: "missing_turnstile_token" }, { status: 400 });
    }

    const turnstile = await verifyTurnstile(turnstileToken, ip);
    if (!turnstile.ok) {
      // helpful server log
      console.error("Turnstile failed:", { ip, error: turnstile.error, raw: turnstile.raw });
      return NextResponse.json({ ok: false, error: turnstile.error }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL;

    if (!resendKey || !to || !from) {
      console.error("Missing email env:", {
        hasResendKey: Boolean(resendKey),
        hasTo: Boolean(to),
        hasFrom: Boolean(from),
      });
      return NextResponse.json({ ok: false, error: "missing_email_env" }, { status: 500 });
    }

    const resend = new Resend(resendKey);

const { data, error } = await resend.emails.send({
  from,
  to,
  replyTo: email,
  subject: subject ? `Website inquiry: ${subject} — ${name}` : `Website inquiry: ${name}`,
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

if (error) {
  console.error("Resend send error:", error);
  return NextResponse.json(
    { ok: false, error: "resend_error" },
    { status: 502 }
  );
}

return NextResponse.json(
  { ok: true, resendId: data?.id },
  { status: 200 }
);


    // Critical: return resend id so the frontend can confirm a real send happened
    return NextResponse.json({ ok: true, resendId: data?.id }, { status: 200 });
  } catch (err: any) {
    const msg = typeof err?.message === "string" ? err.message : "unknown";
    console.error("API /contact exception:", err);
    return NextResponse.json({ ok: false, error: `server_error:${msg}` }, { status: 500 });
  }
}
