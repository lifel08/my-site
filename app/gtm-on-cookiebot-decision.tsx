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

  dl.push({ event: "gtm_load_after_cookiebot_decision" });

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

    const pushConsentSnapshot = () => {
      const c = window.Cookiebot?.consent;

      dl.push({
        event: "cookiebot_decision",
        cb_preferences: !!c?.preferences,
        cb_statistics: !!c?.statistics,
        cb_marketing: !!c?.marketing,
      });
    };

    const loadOnce = () => {
      if (loaded.current) return;
      loaded.current = true;

      pushConsentSnapshot();
      injectGtm({ nonce, gtmId, dataLayerName });
    };

    const onAccept = () => loadOnce();
    const onDecline = () => loadOnce();

    window.addEventListener("CookiebotOnAccept", onAccept as EventListener);
    window.addEventListener("CookiebotOnDecline", onDecline as EventListener);

    return () => {
      window.removeEventListener("CookiebotOnAccept", onAccept as EventListener);
      window.removeEventListener("CookiebotOnDecline", onDecline as EventListener);
    };
  }, [nonce, gtmId, dataLayerName]);

  return null;
}