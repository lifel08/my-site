"use client";

import { useEffect } from "react";

let started = false;

type CookiebotWindow = Window & {
  Cookiebot?: {
    hasResponse?: boolean;
    consent?: { statistics?: boolean };
  };
};

async function sync() {
  const cookiebotWindow = window as CookiebotWindow;
  const allowed = cookiebotWindow.Cookiebot?.consent?.statistics === true;
  if (!allowed && !started) return;

  const { default: posthog } = await import("posthog-js");

  if (allowed) {
    if (!started) {
      started = true; // duplicate-init guard
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN as string, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        defaults: "2026-01-30",
        capture_exceptions: true,
        capture_heatmaps: true,
        disable_session_recording: false,
        debug: process.env.NODE_ENV === "development",
      });
    } else {
      posthog.opt_in_capturing();
    }
  } else {
    posthog.opt_out_capturing();
    posthog.stopSessionRecording();
  }
}

export default function PostHogConsent() {
  useEffect(() => {
    const events = ["CookiebotOnConsentReady", "CookiebotOnAccept", "CookiebotOnDecline"];
    events.forEach((e) => window.addEventListener(e, sync));
    if ((window as CookiebotWindow).Cookiebot?.hasResponse) sync();
    return () => events.forEach((e) => window.removeEventListener(e, sync));
  }, []);

  return null;
}
