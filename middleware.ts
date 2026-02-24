// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function base64Nonce(bytes = 16) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  // Base64 (URL-safe ist nicht nötig für nonce, normal base64 reicht)
  return Buffer.from(arr).toString("base64");
}

export function middleware(req: NextRequest) {
  const nonce = base64Nonce();

  const csp = `
    default-src 'self';
    base-uri 'self';
    object-src 'none';

    script-src 'self' 'nonce-${nonce}'
      https://challenges.cloudflare.com
      https://consent.cookiebot.com
      https://cdn.cookiebot.com
      https://*.usercentrics.eu
      https://app.usercentrics.eu
      https://www.googletagmanager.com
      https://www.google-analytics.com;

    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https:;
    font-src 'self' data: https:;

    connect-src 'self'
      https://www.google-analytics.com
      https://region1.google-analytics.com
      https://stats.g.doubleclick.net
      https://*.cookiebot.com
      https://consent.cookiebot.com
      https://*.usercentrics.eu;

    frame-src https://challenges.cloudflare.com;
  `.replace(/\s{2,}/g, " ").trim();

  // Nonce ins Request-Header schreiben, damit du ihn im App Router auslesen kannst
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);

  const res = NextResponse.next({
    request: { headers: requestHeaders },
  });

  res.headers.set("Content-Security-Policy", csp);
  return res;
}

// Optional: bestimmte Pfade ausschließen
export const config = {
  matcher: [
    /*
      Nicht auf Next-internals/static Assets anwenden:
    */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};