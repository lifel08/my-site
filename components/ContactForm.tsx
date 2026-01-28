"use client";

console.log("CONTACTFORM_VERSION = 2026-01-28-ga4-datalayer-v3-lead-emailhash");

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: any) => string;
      reset?: (widgetId?: string) => void;
      remove?: (widgetId: string) => void;
    } | null;
    dataLayer?: Array<Record<string, any>>;
  }
}

type ContactFormProps = {
  messagePlaceholder?: string;
  defaultSubject?: string;
};

type Status = "idle" | "sending" | "success" | "error";

/* ------------------------------------------------------------------ */
/* GA cookie -> user_pseudo_id                                         */
/* _ga: GA1.1.895746381.1769617592 -> "895746381.1769617592"          */
/* ------------------------------------------------------------------ */
function getGaUserPseudoId(): string | undefined {
  if (typeof document === "undefined") return;

  const gaRow = document.cookie
    .split("; ")
    .find((row) => row.startsWith("_ga="));

  if (!gaRow) return;

  const gaValue = gaRow.substring("_ga=".length); // "GA1.1.895746381.1769617592"
  const parts = gaValue.split(".");
  if (parts.length < 4) return;

  return `${parts[2]}.${parts[3]}`;
}

/* ------------------------------------------------------------------ */
/* SHA-256 hash (lowercase + trimmed) for email                        */
/* ------------------------------------------------------------------ */
async function sha256(value: string): Promise<string> {
  const normalized = value.trim().toLowerCase();
  const data = new TextEncoder().encode(normalized);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/* ------------------------------------------------------------------ */
/* GTM dataLayer push in your desired schema                           */
/* event is ALWAYS "ga4Event"                                          */
/* ------------------------------------------------------------------ */
function pushGa4Event(payload: {
  eventName: string;
  eventType: string;
  eventLabel?: string;
  eventParameter1?: string;
  fieldValue1?: string;
  email_hashed?: string;
}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "ga4Event",
    ...payload,
  });
}

export default function ContactForm({
  messagePlaceholder = "Briefly describe your project or question",
  defaultSubject,
}: ContactFormProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Prevent double submit
  const inFlightRef = useRef(false);

  // Prevent duplicate "lead" event per successful submit
  const leadSentRef = useRef(false);

  // Token state + ref (kept in sync synchronously)
  const [token, setToken] = useState("");
  const tokenRef = useRef("");

  // UI state
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  /* ------------------------------------------------------------------ */
  /* Load Turnstile script once                                          */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!siteKey) return;

    const scriptId = "cf-turnstile";
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.defer = true;
      document.body.appendChild(s);
    }
  }, [siteKey]);

  /* ------------------------------------------------------------------ */
  /* Render Turnstile widget                                             */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!siteKey) return;

    const tryRender = () => {
      const el = containerRef.current;
      const ts = window.turnstile;

      if (!el) return;
      if (!ts || widgetIdRef.current) return;

      try {
        widgetIdRef.current = ts.render(el, {
          sitekey: siteKey,
          callback: (t: string) => {
            tokenRef.current = t;
            setToken(t);
          },
          "expired-callback": () => {
            tokenRef.current = "";
            setToken("");
          },
          "error-callback": () => {
            tokenRef.current = "";
            setToken("");
          },
        });
      } catch {
        // ignore – retry via interval
      }
    };

    const i = window.setInterval(() => {
      tryRender();
      if (widgetIdRef.current) window.clearInterval(i);
    }, 100);

    return () => window.clearInterval(i);
  }, [siteKey]);

  /* ------------------------------------------------------------------ */
  /* Hard reset without calling turnstile.reset/remove                   */
  /* ------------------------------------------------------------------ */
  function hardResetWidget() {
    tokenRef.current = "";
    setToken("");
    widgetIdRef.current = null;

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }
  }

  /* ------------------------------------------------------------------ */
  /* Submit handler (NULL-SAFE)                                          */
  /* ------------------------------------------------------------------ */
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlightRef.current) return;

    // CRITICAL: capture form synchronously
    const formEl = e.currentTarget;

    const currentToken = tokenRef.current;
    if (!currentToken) {
      setErrorMsg("Please complete the verification.");
      setStatus("error");
      return;
    }

    inFlightRef.current = true;
    setStatus("sending");
    setErrorMsg("");

    const fd = new FormData(formEl);

    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(), // honeypot
      turnstileToken: currentToken,
      subject: defaultSubject ?? "",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      let json: any = null;
      try {
        json = await res.json();
      } catch {
        // ignore
      }

      if (res.ok && (json?.ok === true || json === null)) {
        setStatus("success");

        // Fire GA4 wrapper event -> GTM trigger: Custom Event "ga4Event"
        // -> GA4 event name comes from eventName ("lead")
        if (!leadSentRef.current) {
          leadSentRef.current = true;

          const email = String(fd.get("email") ?? "").trim();
          const email_hashed = email ? await sha256(email) : undefined;

          pushGa4Event({
            eventName: "lead",
            eventType: "kontakt",
            eventParameter1: "UserPseudoID",
            fieldValue1: getGaUserPseudoId(),
            email_hashed,
          });
        }

        formEl.reset(); // SAFE
        hardResetWidget();
        return;
      }

      const msg = json?.error ?? json?.message ?? "Request failed.";
      setErrorMsg(String(msg));
      setStatus("error");
      hardResetWidget();
    } catch (err) {
      const msg =
        err instanceof Error ? `${err.name}: ${err.message}` : "Unknown error";
      setErrorMsg(msg);
      setStatus("error");
      hardResetWidget();
    } finally {
      inFlightRef.current = false;
    }
  }

  /* ------------------------------------------------------------------ */
  /* UI helpers                                                         */
  /* ------------------------------------------------------------------ */
  const clearErrorOnChange = () => {
    if (status === "error") {
      setStatus("idle");
      setErrorMsg("");
    }
  };

  const sendDisabled = status === "sending" || !token;

  /* ------------------------------------------------------------------ */
  /* Render                                                             */
  /* ------------------------------------------------------------------ */
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        name="name"
        required
        placeholder="Your name"
        onChange={() => {
          clearErrorOnChange();
          // allow a new lead after user edits + re-sends
          if (status === "success") leadSentRef.current = false;
        }}
        className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm"
      />

      <input
        name="email"
        type="email"
        required
        placeholder="Your email"
        onChange={() => {
          clearErrorOnChange();
          if (status === "success") leadSentRef.current = false;
        }}
        className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm"
      />

      <textarea
        name="message"
        rows={4}
        required
        placeholder={messagePlaceholder}
        onChange={() => {
          clearErrorOnChange();
          if (status === "success") leadSentRef.current = false;
        }}
        className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm"
      />

      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <input name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Turnstile */}
      <div ref={containerRef} className="min-h-[65px]" />

      <button
        type="submit"
        disabled={sendDisabled}
        onClick={() => {
          if (sendDisabled) return;

          pushGa4Event({
            eventName: "button_click",
            eventType: "kontakt",
            eventLabel: "send_message",
          });
        }}
        className={`inline-flex rounded-xl bg-[#ff6400] px-5 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 ${
          status === "sending" ? "pointer-events-none" : ""
        }`}
      >
        {status === "sending" ? "Sending..." : "Send message"}
      </button>

      {errorMsg && (
        <p className="text-xs text-neutral-500">debug: errorMsg={errorMsg}</p>
      )}

      {status === "success" && (
        <p className="text-sm text-green-700">
          Thanks — your message has been sent.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-700">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
