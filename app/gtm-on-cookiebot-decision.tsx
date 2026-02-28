"use client";

import { useEffect, useRef } from "react";

type DataLayerEvent = Record<string, unknown>;
type DataLayer = DataLayerEvent[];

declare global {
  interface Window {
    [key: string]: unknown;

    Cookiebot?: {
      consent?: {
        preferences?: boolean;
        statistics?: boolean;
        marketing?: boolean;
      };
    };
  }
}

type Props = {
  nonce: string;
  gtmId: string;
  dataLayerName?: string;
};

function getDataLayer(name: string): DataLayer {
  const existing = window[name];
  if (Array.isArray(existing)) return existing as DataLayer;

  const dl: DataLayer = [];
  window[name] = dl;
  return dl;
}

function injectGtm({
  nonce,
  gtmId,
  dataLayerName,
}: {
  nonce: string;
  gtmId: string;
  dataLayerName: string;
}) {
  if (document.getElementById("gtm-loader")) return;

  const dl = getDataLayer(dataLayerName);
  dl.push({ event: "gtm_load_after_cookiebot_statistics" });

  const script = document.createElement("script");
  script.id = "gtm-loader";
  script.async = true;
  if (nonce) script.setAttribute("nonce", nonce);

  const dlParam =
    dataLayerName !== "dataLayer"
      ? `&l=${encodeURIComponent(dataLayerName)}`
      : "";

  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(
    gtmId
  )}${dlParam}`;

  document.head.appendChild(script);
}

export default function GtmOnCookiebotDecision({
  nonce,
  gtmId,
  dataLayerName = "dataLayer",
}: Props) {
  const loaded = useRef(false);

  useEffect(() => {
    const dl = getDataLayer(dataLayerName);

    const pushSnapshot = (eventName: string) => {
      const c = window.Cookiebot?.consent;
      dl.push({
        event: eventName,
        cb_preferences: !!c?.preferences,
        cb_statistics: !!c?.statistics,
        cb_marketing: !!c?.marketing,
      });
    };

    const maybeLoad = (sourceEvent: string) => {
      // Always snapshot (for debugging/auditing), but only load if statistics allowed
      pushSnapshot(sourceEvent);

      if (loaded.current) return;

      const statsAllowed = !!window.Cookiebot?.consent?.statistics;
      if (!statsAllowed) return;

      loaded.current = true;
      injectGtm({ nonce, gtmId, dataLayerName });
    };

    // Accept: user confirmed choices (could be "accept all" or "accept selection" depending on UI)
    const onAccept = () => maybeLoad("cookiebot_accept");

    // Decline: user denied (we snapshot, but will not load because statistics is false)
    const onDecline = () => maybeLoad("cookiebot_decline");

    // ConsentReady: fires when consent is available/updated (this is the key one for toggles)
    const onConsentReady = () => maybeLoad("cookiebot_consent_ready");

    window.addEventListener("CookiebotOnAccept", onAccept as EventListener);
    window.addEventListener("CookiebotOnDecline", onDecline as EventListener);
    window.addEventListener("CookiebotOnConsentReady", onConsentReady as EventListener);

    // Optional: run once in case consent is already present (returning visitors)
    // This will still NOT load unless statistics === true.
    maybeLoad("cookiebot_bootstrap");

    return () => {
      window.removeEventListener("CookiebotOnAccept", onAccept as EventListener);
      window.removeEventListener("CookiebotOnDecline", onDecline as EventListener);
      window.removeEventListener("CookiebotOnConsentReady", onConsentReady as EventListener);
    };
  }, [nonce, gtmId, dataLayerName]);

  return null;
}