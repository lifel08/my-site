"use client";

import { useEffect, useMemo, useRef } from "react";
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

function buildCleanQueryString(searchParams: URLSearchParams): string {
  const params = new URLSearchParams(searchParams.toString());

  params.delete("gtm_debug");
  params.delete("gtm_preview");
  params.delete("gtm_auth");

  const query = params.toString();
  return query ? `?${query}` : "";
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
  const gtmInjected = useRef(false);
  const gtmReady = useRef(false);
  const previousUrlRef = useRef("");
  const lastTrackedUrlRef = useRef("");

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const cleanQueryString = useMemo(() => {
    return buildCleanQueryString(searchParams);
  }, [searchParams]);

  const pushCustomPageView = () => {
    if (!pathname) return;

    const dl = getDataLayer(dataLayerName);
    const pagePath = `${pathname}${cleanQueryString}`;
    const currentUrl = `${window.location.origin}${pagePath}`;

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
    const maybeLoadGtm = () => {
      if (gtmInjected.current) return;

      const statsAllowed = !!window.Cookiebot?.consent?.statistics;
      if (!statsAllowed) return;

      gtmInjected.current = true;

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

    const onConsentReady = () => {
      maybeLoadGtm();
    };

    window.addEventListener(
      "CookiebotOnConsentReady",
      onConsentReady as EventListener
    );

    // returning visitors / already resolved consent
    maybeLoadGtm();

    return () => {
      window.removeEventListener(
        "CookiebotOnConsentReady",
        onConsentReady as EventListener
      );
    };
  }, [nonce, gtmId, dataLayerName, pathname, cleanQueryString]);

  useEffect(() => {
    const statsAllowed = !!window.Cookiebot?.consent?.statistics;
    if (!statsAllowed) return;
    if (!pathname) return;
    if (!gtmReady.current) return;

    pushCustomPageView();
  }, [pathname, cleanQueryString]);

  return null;
}