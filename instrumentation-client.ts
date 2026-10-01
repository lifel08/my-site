import posthog from "posthog-js";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!projectToken || !host) {
  if (process.env.NODE_ENV === "development") {
    const missingVariable = !projectToken
      ? "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN"
      : "NEXT_PUBLIC_POSTHOG_HOST";

    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  // Defer initialization until Cookiebot statistics consent is granted.
  // If Cookiebot is not present, initialize immediately (compatibility).
  let _phInitialized = false;

  const doInit = () => {
    if (_phInitialized) return;
    _phInitialized = true;
    posthog.init(projectToken, {
      api_host: host,
      defaults: "2026-01-30",
      capture_exceptions: true,
      capture_heatmaps: true,
      debug: process.env.NODE_ENV === "development",
    });
  };

  const maybeInit = () => {
    // If Cookiebot exists, only init when statistics consent is true.
    // If Cookiebot is not present, initialize immediately.
    const cb = (window as any).Cookiebot;
    if (cb) {
      const statsAllowed = !!cb?.consent?.statistics;
      if (statsAllowed) doInit();
    } else {
      doInit();
    }
  };

  // Listen for Cookiebot consent readiness event and attempt init then.
  if (typeof window !== "undefined") {
    window.addEventListener("CookiebotOnConsentReady", maybeInit as EventListener);
    // Try immediately for returning visitors / resolved consent state
    maybeInit();
  } else {
    // Server-side path (shouldn't happen for instrumentation-client), initialize defensively
    doInit();
  }
}
