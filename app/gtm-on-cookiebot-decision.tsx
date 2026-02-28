"use client";

import { useEffect, useRef } from "react";

type DataLayerEvent = Record<string, unknown>;
type DataLayer = DataLayerEvent[];

declare global {
  interface Window {
    [key: string]: unknown;

    // Cookiebot global object
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

  // If dataLayer already exists, reuse it
  if (Array.isArray(existing)) return existing as DataLayer;

  // Otherwise create a new one
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
  // Prevent multiple GTM injections
  if (document.getElementById("gtm-loader")) return;

  const dl = getDataLayer(dataLayerName);

  // Optional debug marker
  dl.push({ event: "gtm_load_after_cookiebot_accept" });

  const script = document.createElement("script");
  script.id = "gtm-loader";
  script.async = true;

  // Apply CSP nonce if available
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

    // Push consent state snapshot into dataLayer
    const pushConsentSnapshot = (eventName: string) => {
      const c = window.Cookiebot?.consent;

      dl.push({
        event: eventName,
        cb_preferences: !!c?.preferences,
        cb_statistics: !!c?.statistics,
        cb_marketing: !!c?.marketing,
      });
    };

    const loadOnce = () => {
      if (loaded.current) return;
      loaded.current = true;

      // On Accept → push consent snapshot and load GTM
      pushConsentSnapshot("cookiebot_accept");
      injectGtm({ nonce, gtmId, dataLayerName });
    };

    const onAccept = () => loadOnce();

    const onDecline = () => {
      // On Decline → push snapshot only (no GTM load)
      pushConsentSnapshot("cookiebot_decline");

      // Ensure GTM cannot be loaded later in this page view
      loaded.current = true;
    };

    window.addEventListener("CookiebotOnAccept", onAccept as EventListener);
    window.addEventListener("CookiebotOnDecline", onDecline as EventListener);

    return () => {
      window.removeEventListener("CookiebotOnAccept", onAccept as EventListener);
      window.removeEventListener("CookiebotOnDecline", onDecline as EventListener);
    };
  }, [nonce, gtmId, dataLayerName]);

  return null;
}