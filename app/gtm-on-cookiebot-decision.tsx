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

    const pushConsentSnapshot = (eventName: string) => {
      const c = window.Cookiebot?.consent;
      dl.push({
        event: eventName,
        cb_preferences: !!c?.preferences,
        cb_statistics: !!c?.statistics,
        cb_marketing: !!c?.marketing,
      });
    };

    const tryLoadIfAllowed = (sourceEvent: string) => {
      if (loaded.current) return;

      const statsAllowed = !!window.Cookiebot?.consent?.statistics;

      // Always push a snapshot for debugging/auditing
      pushConsentSnapshot(sourceEvent);

      // Only load GTM once statistics is allowed
      if (!statsAllowed) return;

      loaded.current = true;
      injectGtm({ nonce, gtmId, dataLayerName });
    };

    // Fired when user accepts all / initial accept action (depends on banner UI)
    const onAccept = () => tryLoadIfAllowed("cookiebot_accept");

    // Fired when user declines (we still snapshot, but won't load since stats=false)
    const onDecline = () => tryLoadIfAllowed("cookiebot_decline");

    // Fired when user changes consent choices (this is what you need for toggles)
    const onUpdate = () => tryLoadIfAllowed("cookiebot_update");

    // Category-specific events (Cookiebot can emit these depending on config)
    const onStats = () => tryLoadIfAllowed("cookiebot_statistics");
    const onPrefs = () => tryLoadIfAllowed("cookiebot_preferences");
    const onMkt = () => tryLoadIfAllowed("cookiebot_marketing");

    window.addEventListener("CookiebotOnAccept", onAccept as EventListener);
    window.addEventListener("CookiebotOnDecline", onDecline as EventListener);

    // These are the important ones for “I enabled statistics later”
    window.addEventListener("CookiebotOnConsentReady", onUpdate as EventListener);
    window.addEventListener("CookiebotOnLoad", onUpdate as EventListener);

    // Optional extras (harmless if they never fire)
    window.addEventListener("CookiebotOnStatistics", onStats as EventListener);
    window.addEventListener("CookiebotOnPreferences", onPrefs as EventListener);
    window.addEventListener("CookiebotOnMarketing", onMkt as EventListener);

    // Fallback: if Cookiebot consent is already available (e.g. returning user),
    // try immediately (still gated by statistics === true).
    tryLoadIfAllowed("cookiebot_bootstrap");

    return () => {
      window.removeEventListener("CookiebotOnAccept", onAccept as EventListener);
      window.removeEventListener("CookiebotOnDecline", onDecline as EventListener);

      window.removeEventListener("CookiebotOnConsentReady", onUpdate as EventListener);
      window.removeEventListener("CookiebotOnLoad", onUpdate as EventListener);

      window.removeEventListener("CookiebotOnStatistics", onStats as EventListener);
      window.removeEventListener("CookiebotOnPreferences", onPrefs as EventListener);
      window.removeEventListener("CookiebotOnMarketing", onMkt as EventListener);
    };
  }, [nonce, gtmId, dataLayerName]);

  return null;
}