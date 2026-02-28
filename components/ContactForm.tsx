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
/* GA cookie -> user_pseudo_id                                        */
/* ------------------------------------------------------------------ */
function getGaUserPseudoId(): string | undefined {
  if (typeof document === "undefined") return;

  const gaRow = document.cookie
    .split("; ")
    .find((row) => row.startsWith("_ga="));

  if (!gaRow) return;

  const gaValue = gaRow.substring("_ga=".length);
  const parts = gaValue.split(".");
  if (parts.length < 4) return;

  return `${parts[2]}.${parts[3]}`;
}

/* ------------------------------------------------------------------ */
/* SHA-256 hash for email                                             */
/* ------------------------------------------------------------------ */
async function sha256(value: string): Promise<string> {
  const normalized = value.trim().toLowerCase();
  const data = new TextEncoder().encode(normalized);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/* ------------------------------------------------------------------ */
/* dataLayer push                                                     */
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
  const inFlightRef = useRef(false);
  const leadSentRef = useRef(false);

  const [token, setToken] = useState("");
  const tokenRef = useRef("");

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  /* ------------------------------------------------------------------ */
  /* Lazy Load + Render Turnstile                                      */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!siteKey) return;
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;
    let observer: IntersectionObserver | null = null;

    const scriptId = "cf-turnstile";

    function loadScript(): Promise<void> {
      return new Promise((resolve, reject) => {
        if (window.turnstile) return resolve();

        const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
        if (existing) {
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener("error", () => reject(), { once: true });
          return;
        }

        const s = document.createElement("script");
        s.id = scriptId;
        s.src =
          "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        s.async = true;
        s.defer = true;

        s.onload = () => resolve();
        s.onerror = () => reject();

        document.body.appendChild(s);
      });
    }

    async function renderWidget() {
      if (cancelled) return;
      if (widgetIdRef.current) return;

      await loadScript();
      if (cancelled) return;

      const ts = window.turnstile;
      if (!ts) return;

      const currentEl = containerRef.current;
      if (!currentEl) return;

      widgetIdRef.current = ts.render(currentEl, {
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
    }

    observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer?.disconnect();
        renderWidget().catch(() => {});
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [siteKey]);

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
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlightRef.current) return;

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
      company: String(fd.get("company") ?? "").trim(),
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
      } catch {}

      if (res.ok && (json?.ok === true || json === null)) {
        setStatus("success");

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

        formEl.reset();
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

  const clearErrorOnChange = () => {
    if (status === "error") {
      setStatus("idle");
      setErrorMsg("");
    }
  };

  const sendDisabled = status === "sending" || !token;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        name="name"
        required
        placeholder="Your name"
        onChange={() => {
          clearErrorOnChange();
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

      <div className="hidden" aria-hidden="true">
        <input name="company" tabIndex={-1} autoComplete="off" />
      </div>

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