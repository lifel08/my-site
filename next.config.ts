import type { NextConfig } from "next";

const csp = `
  default-src 'self';
  base-uri 'self';
  object-src 'none';

  script-src 'self' 'unsafe-inline'
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

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [{ key: "Content-Security-Policy", value: csp }],
      },
    ];
  },
};

export default nextConfig;