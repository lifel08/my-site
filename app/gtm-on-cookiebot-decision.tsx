"use client";

import { useEffect, useRef } from "react";

type DataLayerEvent = Record<string, unknown>;
type DataLayer = DataLayerEvent[];

declare global {
  interface Window {
    // Damit window[dataLayerName] nicht meckert:
    [key: string]: unknown;

    // Cookiebot (optional, aber hilfreich)
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
  dataLayerName?: string; // default "dataLayer"
};

function getDataLayer(name: string): DataLayer {
  const existing = window[name];

  if (Array.isArray(existing)) return existing as DataLayer;

  const dl: DataLayer = [];
  window[name] = dl;
  return dl;
}

function injectGtm(params: { nonce: string; gtmId: string; dataLayerName: string }) {
  const { nonce, gtmId, dataLayerName } = params;

  if (document.getElementById("gtm-loader")) return;

  const dl = getDataLayer(dataLayerName);

  // Marker (optional)
  dl.push({ event: "gtm_load_after_cookiebot_decision" });

  const script = document.createElement("script");
  script.id = "gtm-loader";
  script.async = true;
  if (nonce) script.setAttribute("nonce", nonce);

  const dlParam = dataLayerName !== "dataLayer" ? `&l=${encodeURIComponent(dataLayerName)}` : "";
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}${dlParam}`;

  document.head.appendChild(script);
}

export default function GtmOnCookiebotDecision({ nonce, gtmId, dataLayerName = "dataLayer" }: Props) {
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

    // Fallback: wenn Cookiebot schon consent hat
    if (window.Cookiebot?.consent) {
      loadOnce();
    } else {
      const t0 = Date.now();
      const interval = window.setInterval(() => {
        if (loaded.current) return window.clearInterval(interval);
        if (window.Cookiebot?.consent) {
          loadOnce();
          return window.clearInterval(interval);
        }
        if (Date.now() - t0 > 15000) window.clearInterval(interval);
      }, 250);

      return () => window.clearInterval(interval);
    }

    return () => {
      window.removeEventListener("CookiebotOnAccept", onAccept as EventListener);
      window.removeEventListener("CookiebotOnDecline", onDecline as EventListener);
    };
  }, [nonce, gtmId, dataLayerName]);

  return null;
}