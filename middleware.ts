import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function createNonce(size = 16) {
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

export function middleware(req: NextRequest) {
  const nonce = createNonce();

  const csp = `
    default-src 'self';
    base-uri 'self';
    object-src 'none';

    script-src 'self' 'nonce-${nonce}'
      https://challenges.cloudflare.com
      https://consent.cookiebot.com
      https://consentcdn.cookiebot.com
      https://cdn.cookiebot.com
      https://*.usercentrics.eu
      https://app.usercentrics.eu
      https://www.googletagmanager.com
      https://www.google-analytics.com;

    script-src-elem 'self' 'nonce-${nonce}'
      https://challenges.cloudflare.com
      https://consent.cookiebot.com
      https://consentcdn.cookiebot.com
      https://cdn.cookiebot.com
      https://*.usercentrics.eu
      https://app.usercentrics.eu
      https://www.googletagmanager.com
      https://www.google-analytics.com;

    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    style-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://fonts.googleapis.com;

    img-src 'self' data: blob: https:;
    font-src 'self' data: https://fonts.gstatic.com;

    connect-src 'self'
      https://www.googletagmanager.com
      https://www.google-analytics.com
      https://region1.google-analytics.com
      https://stats.g.doubleclick.net
      https://consent.cookiebot.com
      https://consentcdn.cookiebot.com
      https://*.cookiebot.com
      https://*.usercentrics.eu
      https://data.lfellinger.com;

    frame-src
      https://challenges.cloudflare.com
      https://consentcdn.cookiebot.com
      https://www.googletagmanager.com
      https://tagassistant.google.com
      https://data.lfellinger.com;
  `.replace(/\s{2,}/g, " ").trim();

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);

  const res = NextResponse.next({
    request: { headers: requestHeaders },
  });

  res.headers.set("Content-Security-Policy", csp);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};