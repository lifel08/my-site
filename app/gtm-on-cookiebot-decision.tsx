"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

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
  onLoad,
}: {
  nonce: string;
  gtmId: string;
  dataLayerName: string;
  onLoad?: () => void;
}) {
  if (document.getElementById("gtm-loader")) {
    onLoad?.();
    return;
  }

  const dl = getDataLayer(dataLayerName);

  // offizieller GTM-Start
  dl.push({
    "gtm.start": new Date().getTime(),
    event: "gtm.js",
  });

  const script = document.createElement("script");
  script.id = "gtm-loader";
  script.async = true;

  if (nonce) {
    script.setAttribute("nonce", nonce);
  }

  const dlParam =
    dataLayerName !== "dataLayer"
      ? `&l=${encodeURIComponent(dataLayerName)}`
      : "";

  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(
    gtmId
  )}${dlParam}`;

  script.onload = () => {
    onLoad?.();
  };

  const firstScript = document.getElementsByTagName("script")[0];
  if (firstScript?.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }
}

export default function GtmOnCookiebotDecision({
  nonce,
  gtmId,
  dataLayerName = "dataLayer",
}: Props) {
  const loaded = useRef(false);
  const gtmReady = useRef(false);
  const previousUrlRef = useRef("");
  const lastTrackedUrlRef = useRef("");

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams?.toString() ?? "";

  const pushCustomPageView = () => {
    const dl = getDataLayer(dataLayerName);

    const pagePath = queryString ? `${pathname}?${queryString}` : pathname;
    const currentUrl = window.location.href;

    if (!pagePath) return;
    if (lastTrackedUrlRef.current === currentUrl) return;

    dl.push({
      event: "custom_page_view",
      page_path: pagePath,
      page_location: currentUrl,
      page_referrer: previousUrlRef.current || document.referrer || "",
    });

    previousUrlRef.current = currentUrl;
    lastTrackedUrlRef.current = currentUrl;
  };

  useEffect(() => {
    previousUrlRef.current = document.referrer || "";
  }, []);

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
      pushSnapshot(sourceEvent);

      if (loaded.current) return;

      const statsAllowed = !!window.Cookiebot?.consent?.statistics;
      if (!statsAllowed) return;

      loaded.current = true;

      injectGtm({
        nonce,
        gtmId,
        dataLayerName,
        onLoad: () => {
          gtmReady.current = true;
          pushCustomPageView();
        },
      });
    };

    const onAccept = () => maybeLoad("cookiebot_accept");
    const onDecline = () => maybeLoad("cookiebot_decline");
    const onConsentReady = () => maybeLoad("cookiebot_consent_ready");

    window.addEventListener("CookiebotOnAccept", onAccept as EventListener);
    window.addEventListener("CookiebotOnDecline", onDecline as EventListener);
    window.addEventListener("CookiebotOnConsentReady", onConsentReady as EventListener);

    maybeLoad("cookiebot_bootstrap");

    return () => {
      window.removeEventListener("CookiebotOnAccept", onAccept as EventListener);
      window.removeEventListener("CookiebotOnDecline", onDecline as EventListener);
      window.removeEventListener("CookiebotOnConsentReady", onConsentReady as EventListener);
    };
  }, [nonce, gtmId, dataLayerName]);

  useEffect(() => {
    const statsAllowed = !!window.Cookiebot?.consent?.statistics;
    if (!statsAllowed) return;
    if (!pathname) return;
    if (!gtmReady.current) return;

    pushCustomPageView();
  }, [pathname, queryString]);

  return null;
}